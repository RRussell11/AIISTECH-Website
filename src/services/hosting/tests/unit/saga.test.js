const path = require('path');
const os   = require('os');
const fs   = require('fs');

function makeTmpConfig(sites) {
  const tmp = path.join(os.tmpdir(), `multiplic-saga-${Date.now()}-${Math.random()}.json`);
  fs.writeFileSync(tmp, JSON.stringify({ version: 1, sites: sites || {} }, null, 2));
  return tmp;
}

describe('provisioningSaga', () => {
  let saga;
  let tmpConfig;

  beforeEach(() => {
    tmpConfig = makeTmpConfig();
    process.env.MULTIPLIC_CONFIG_PATH = tmpConfig;
    // Use mock DNS provider
    process.env.DNS_PROVIDER    = 'mock';
    process.env.MOCK_DNS_RECORDS_PATH = path.join(
      os.tmpdir(),
      `dns-records-${Date.now()}-${Math.random()}.json`
    );
    process.env.WILDCARD_TLS_ENABLED = 'true';
    jest.resetModules();
    saga = require('../../server/provisioning/saga');
  });

  afterEach(() => {
    delete process.env.MULTIPLIC_CONFIG_PATH;
    delete process.env.DNS_PROVIDER;
    const dnsPath = process.env.MOCK_DNS_RECORDS_PATH;
    delete process.env.MOCK_DNS_RECORDS_PATH;
    if (dnsPath && fs.existsSync(dnsPath)) fs.unlinkSync(dnsPath);
    if (fs.existsSync(tmpConfig)) fs.unlinkSync(tmpConfig);
  });

  function waitForRun(runId, timeoutMs = 3000) {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const interval = setInterval(() => {
        const run = saga.getSagaRunStatus(runId);
        if (run && (run.status === 'completed' || run.status === 'failed')) {
          clearInterval(interval);
          resolve(run);
        } else if (Date.now() - start > timeoutMs) {
          clearInterval(interval);
          reject(new Error(`Saga ${runId} did not complete within ${timeoutMs}ms`));
        }
      }, 20);
    });
  }

  describe('startProvisioningSaga', () => {
    test('completes successfully and activates manifest entry', async () => {
      const updates = [];
      const runId = saga.startProvisioningSaga({
        slug: 'myapp',
        projectId: 'proj-1',
        tenantId:  'tenant-1',
        ownerId:   'owner-1',
        onProjectUpdate: (u) => updates.push(u),
      });
      expect(typeof runId).toBe('string');

      const run = await waitForRun(runId);
      expect(run.status).toBe('completed');

      // Manifest entry should be activated in multiplic.json
      const config = JSON.parse(fs.readFileSync(tmpConfig, 'utf8'));
      expect(config.sites['myapp.aiistech.com']).toBeDefined();
      expect(config.sites['myapp.aiistech.com'].aiistech.status).toBe('active');

      // onProjectUpdate received a completed notification
      const completedUpdate = updates.find((u) => u.currentStep === 'completed');
      expect(completedUpdate).toBeDefined();
      expect(completedUpdate.url).toBe('https://myapp.aiistech.com');
    });

    test('fails and rolls back if slug already exists', async () => {
      // Pre-populate the config so the slug already exists
      const existing = JSON.parse(fs.readFileSync(tmpConfig, 'utf8'));
      existing.sites['duplicate.aiistech.com'] = {
        root: 'sites/duplicate.aiistech.com',
        framework: 'react',
        aiistech: { status: 'active', projectId: 'existing' },
      };
      fs.writeFileSync(tmpConfig, JSON.stringify(existing, null, 2));

      const updates = [];
      const runId = saga.startProvisioningSaga({
        slug: 'duplicate',
        projectId: 'proj-2',
        tenantId:  'tenant-2',
        ownerId:   'owner-2',
        onProjectUpdate: (u) => updates.push(u),
      });

      const run = await waitForRun(runId);
      expect(run.status).toBe('failed');
      expect(run.error).toContain('already exists');

      const failUpdate = updates.find((u) => u.status === 'failed');
      expect(failUpdate).toBeDefined();
    });

    test('fails and rolls back when TLS is disabled', async () => {
      process.env.WILDCARD_TLS_ENABLED = 'false';
      jest.resetModules();
      saga = require('../../server/provisioning/saga');

      const runId = saga.startProvisioningSaga({
        slug: 'notls',
        projectId: 'proj-3',
        tenantId:  'tenant-3',
        ownerId:   'owner-3',
      });

      const run = await waitForRun(runId);
      expect(run.status).toBe('failed');
      expect(run.error).toContain('Wildcard TLS');

      // Manifest entry should have been rolled back
      const config = JSON.parse(fs.readFileSync(tmpConfig, 'utf8'));
      expect(config.sites['notls.aiistech.com']).toBeUndefined();
    });

    test('getSagaRunStatus returns null for unknown runId', () => {
      expect(saga.getSagaRunStatus('no-such-id')).toBeNull();
    });

    test('calls onIdentityRefresh when provided', async () => {
      let refreshArgs = null;
      const runId = saga.startProvisioningSaga({
        slug: 'withrefresh',
        projectId: 'proj-4',
        tenantId:  'tenant-4',
        ownerId:   'owner-4',
        onIdentityRefresh: async (args) => { refreshArgs = args; },
      });

      const run = await waitForRun(runId);
      expect(run.status).toBe('completed');
      expect(refreshArgs).toEqual({ projectId: 'proj-4', slug: 'withrefresh' });
    });
  });

  describe('startTeardownSaga', () => {
    test('removes a deployed site successfully', async () => {
      // First provision a site
      const provisionId = saga.startProvisioningSaga({
        slug: 'teardown-me',
        projectId: 'proj-5',
        tenantId:  'tenant-5',
        ownerId:   'owner-5',
      });
      await waitForRun(provisionId);

      // Now tear it down
      const updates = [];
      const teardownId = saga.startTeardownSaga({
        slug: 'teardown-me',
        projectId: 'proj-5',
        onProjectUpdate: (u) => updates.push(u),
      });

      const run = await waitForRun(teardownId);
      expect(run.status).toBe('completed');

      // Manifest entry should be gone
      const config = JSON.parse(fs.readFileSync(tmpConfig, 'utf8'));
      expect(config.sites['teardown-me.aiistech.com']).toBeUndefined();

      const undeployedUpdate = updates.find((u) => u.status === 'undeployed');
      expect(undeployedUpdate).toBeDefined();
    });
  });
});
