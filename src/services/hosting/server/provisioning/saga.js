const { randomUUID } = require('crypto');
const {
  domainForSlug,
  getEntry,
  createPendingEntry,
  activateEntry,
  setEntryStatus,
  removeEntry,
} = require('./manifestStore');
const { createDnsAdapter } = require('./dnsAdapter');

const runs = new Map();

function getSagaRunStatus(runId) {
  return runs.get(runId) || null;
}

function updateRun(runId, patch) {
  const current = runs.get(runId) || {};
  runs.set(runId, { ...current, ...patch, updatedAt: new Date().toISOString() });
}

function markStep(runId, stepName, state, details) {
  const run = runs.get(runId);
  const steps = run.steps || [];
  const index = steps.findIndex((s) => s.name === stepName);
  const nextStep = { name: stepName, state, details, at: new Date().toISOString() };

  if (index === -1) {
    steps.push(nextStep);
  } else {
    steps[index] = nextStep;
  }

  updateRun(runId, { currentStep: stepName, steps });
}

function hasWildcardTlsCoverage() {
  return process.env.WILDCARD_TLS_ENABLED !== 'false';
}

function startProvisioningSaga({ slug, projectId, tenantId, ownerId, onProjectUpdate, onIdentityRefresh }) {
  const runId = randomUUID();
  const dns = createDnsAdapter();
  const fqdn = domainForSlug(slug);
  const target = process.env.MULTIPLIC_HOST || 'multiplic.local';

  runs.set(runId, {
    runId,
    operation: 'deploy',
    slug,
    projectId,
    status: 'running',
    currentStep: 'queued',
    steps: [],
    rollbackSteps: [],
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    error: null,
  });

  const rollbackStack = [];

  async function runStep(name, execute, rollback) {
    markStep(runId, name, 'running');
    await execute();
    if (rollback) {
      rollbackStack.push({ name, rollback });
    }
    markStep(runId, name, 'completed');
    if (onProjectUpdate) {
      onProjectUpdate({ currentStep: name, runId });
    }
  }

  async function rollbackAll(failedStep, err) {
    updateRun(runId, { status: 'rolling_back', error: err.message });

    for (const item of [...rollbackStack].reverse()) {
      try {
        markStep(runId, item.name, 'rolling_back');
        await item.rollback();
        const run = runs.get(runId);
        run.rollbackSteps.push({ name: item.name, state: 'completed', at: new Date().toISOString() });
        runs.set(runId, run);
      } catch (rollbackErr) {
        const run = runs.get(runId);
        run.rollbackSteps.push({
          name: item.name,
          state: 'failed',
          error: rollbackErr.message,
          at: new Date().toISOString(),
        });
        runs.set(runId, run);
      }
    }

    updateRun(runId, {
      status: 'failed',
      failedStep,
      error: err.message,
      finishedAt: new Date().toISOString(),
    });
  }

  (async () => {
    try {
      await runStep(
        'validate-manifest-availability',
        async () => {
          const existing = getEntry(slug);
          if (existing) throw new Error(`Manifest entry already exists for ${fqdn}`);
        },
        async () => {}
      );

      await runStep(
        'write-manifest-pending',
        async () => {
          await createPendingEntry({ slug, projectId, tenantId, ownerId });
        },
        async () => {
          await removeEntry(slug);
        }
      );

      await runStep(
        'register-dns-cname',
        async () => {
          await dns.createCname(fqdn, target);
        },
        async () => {
          await dns.deleteCname(fqdn);
        }
      );

      await runStep(
        'verify-wildcard-tls',
        async () => {
          if (!hasWildcardTlsCoverage()) {
            throw new Error('Wildcard TLS coverage not enabled');
          }
        },
        async () => {}
      );

      await runStep(
        'refresh-project-identity',
        async () => {
          if (onIdentityRefresh) {
            await onIdentityRefresh({ projectId, slug });
          }
        },
        async () => {}
      );

      await runStep(
        'activate-manifest-entry',
        async () => {
          await activateEntry(slug);
        },
        async () => {
          await removeEntry(slug);
        }
      );

      updateRun(runId, { status: 'completed', finishedAt: new Date().toISOString() });
      if (onProjectUpdate) {
        onProjectUpdate({
          runId,
          currentStep: 'completed',
          status: 'deployed',
          url: `https://${fqdn}`,
          deployedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      await rollbackAll(runs.get(runId).currentStep, err);
      if (onProjectUpdate) {
        onProjectUpdate({
          runId,
          status: 'failed',
          currentStep: runs.get(runId).currentStep,
          error: err.message,
        });
      }
    }
  })();

  return runId;
}

function startTeardownSaga({ slug, projectId, onProjectUpdate }) {
  const runId = randomUUID();
  const dns = createDnsAdapter();
  const fqdn = domainForSlug(slug);

  runs.set(runId, {
    runId,
    operation: 'teardown',
    slug,
    projectId,
    status: 'running',
    currentStep: 'queued',
    steps: [],
    rollbackSteps: [],
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    error: null,
  });

  (async () => {
    try {
      markStep(runId, 'disable-manifest-entry', 'running');
      await setEntryStatus(slug, 'disabled');
      markStep(runId, 'disable-manifest-entry', 'completed');

      markStep(runId, 'delete-dns-cname', 'running');
      await dns.deleteCname(fqdn);
      markStep(runId, 'delete-dns-cname', 'completed');

      markStep(runId, 'remove-manifest-entry', 'running');
      await removeEntry(slug);
      markStep(runId, 'remove-manifest-entry', 'completed');

      updateRun(runId, { status: 'completed', finishedAt: new Date().toISOString() });
      if (onProjectUpdate) {
        onProjectUpdate({
          runId,
          currentStep: 'completed',
          status: 'undeployed',
          url: null,
          deployedAt: null,
        });
      }
    } catch (err) {
      updateRun(runId, {
        status: 'failed',
        error: err.message,
        finishedAt: new Date().toISOString(),
      });
      if (onProjectUpdate) {
        onProjectUpdate({
          runId,
          status: 'failed',
          error: err.message,
        });
      }
    }
  })();

  return runId;
}

module.exports = {
  startProvisioningSaga,
  startTeardownSaga,
  getSagaRunStatus,
};
