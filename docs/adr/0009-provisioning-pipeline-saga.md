# ADR-0009: Provisioning Pipeline Saga Pattern

**Status:** Draft  
**Date:** 2026-03-10  
**Phase:** 3 — Provisioning  
**Depends on:** ADR-0008 (per-project subdomain model), ADR-0010 (Multiplic registry)

---

## Context

Deploying a project subdomain requires coordination across multiple infrastructure systems: the `multiplic.json` registry, DNS records, TLS certificate coverage, and the JWT token store. These operations are not atomic — DNS propagation takes seconds to minutes, and any step can fail independently.

A naive sequential approach — write manifest, register DNS, issue cert — leaves orphaned partial states on failure: a manifest entry pointing to a DNS record that doesn't exist, or a DNS record with no cert coverage. These partial states corrupt the hosting registry and require manual intervention to clean up.

The saga pattern solves this by pairing each forward step with a compensating rollback step, executed in reverse order on failure.

---

## Decision

The provisioning pipeline is implemented as an **ordered saga** with explicit compensating transactions at each step.

### Pipeline steps (forward)

```
Step 1  Validate slug uniqueness in multiplic.json  →  compensate: no-op (nothing written)
Step 2  Write multiplic.json entry (status: pending) →  compensate: delete entry
Step 3  Register DNS CNAME [slug] → multiplic-host   →  compensate: delete DNS record
Step 4  Verify TLS coverage for [slug].aiistech.com   →  compensate: no-op (cert not changed)
Step 5  Re-issue JWT with updated projects[] claim    →  compensate: no-op (old token still valid)
Step 6  Flip multiplic.json entry from pending → active → compensate: flip back to pending / delete
Step 7  Update project DB record to status: deployed  →  compensate: revert to status: failed
```

Step 4 is a **verification step**, not a write. If the wildcard cert `*.aiistech.com` already covers the new subdomain (which it does by design), this step simply confirms coverage and is idempotent. No new cert issuance is triggered.

Step 5 (JWT re-issue) is best-effort — the user's next `/api/auth/me` call or explicit token refresh will pick up the updated `projects[]` claim. The step does not block pipeline completion.

### Failure and rollback sequence

On failure at step N, compensating steps are executed from step N-1 down to step 1:

```
Failure at Step 3 (DNS registration):
  → Compensate Step 2: delete multiplic.json pending entry
  → Compensate Step 1: no-op
  → project.status = 'failed'
  → log saga failure with stepFailed=3 and error details
```

### Implementation

```javascript
// server/provisioning/saga.js
async function triggerProvisioningPipeline(slug, projectId) {
  const completed = [];

  const steps = [
    {
      name: 'validate-slug',
      run: () => validateSlugUniqueness(slug),
      rollback: () => Promise.resolve()
    },
    {
      name: 'write-manifest-pending',
      run: () => writeManifestEntry(slug, { status: 'pending' }),
      rollback: () => deleteManifestEntry(slug)
    },
    {
      name: 'register-dns',
      run: () => registerDnsCname(slug),
      rollback: () => deleteDnsCname(slug)
    },
    {
      name: 'verify-tls',
      run: () => verifyTlsCoverage(slug),
      rollback: () => Promise.resolve()
    },
    {
      name: 'reissue-jwt',
      run: () => scheduleTokenRefresh(projectId),
      rollback: () => Promise.resolve()
    },
    {
      name: 'activate-manifest',
      run: () => activateManifestEntry(slug),
      rollback: () => deleteManifestEntry(slug)
    },
    {
      name: 'update-project-status',
      run: () => updateProjectStatus(projectId, 'deployed'),
      rollback: () => updateProjectStatus(projectId, 'failed')
    }
  ];

  for (const step of steps) {
    try {
      await step.run();
      completed.push(step);
    } catch (err) {
      logger.error({ step: step.name, err }, 'saga step failed — beginning rollback');
      for (const done of [...completed].reverse()) {
        await done.rollback().catch(rbErr =>
          logger.error({ step: done.name, rbErr }, 'rollback step failed')
        );
      }
      await updateProjectStatus(projectId, 'failed');
      throw err;
    }
  }
}
```

### Fire-and-poll pattern

`POST /api/projects/:slug/deploy` is **non-blocking**:

```javascript
app.post('/api/projects/:slug/deploy', authenticateToken, async (req, res) => {
  await updateProjectStatus(req.params.slug, 'provisioning');
  // Fire async — do not await
  triggerProvisioningPipeline(req.params.slug, project.id)
    .catch(err => logger.error({ slug: req.params.slug, err }, 'pipeline failed'));
  res.json({ status: 'provisioning', message: 'Deploy initiated' });
});
```

The frontend polls `GET /api/projects/:slug/status` every 3 seconds until status resolves to `deployed` or `failed`.

### Teardown (undeploy) saga

Teardown runs the same saga in reverse with teardown-specific operations:

```
Step 1  Flip multiplic.json entry from active → disabled
Step 2  Delete DNS CNAME record
Step 3  Remove projects[] claim entry from JWT store
Step 4  Update project DB record to status: undeployed
```

Teardown compensating rollbacks are less critical (removing a domain from service is safe to partially complete) but are still implemented for audit completeness.

---

## DNS implementation note

For Phase 3, DNS registration targets the provider API configured in environment variable `DNS_PROVIDER` (e.g., Cloudflare, Route 53). The `registerDnsCname` and `deleteDnsCname` functions are provider-agnostic adapter calls:

```javascript
// server/provisioning/dns.js
const provider = require(`./dns-providers/${process.env.DNS_PROVIDER}`);

async function registerDnsCname(slug) {
  return provider.createCname(`${slug}.aiistech.com`, process.env.MULTIPLIC_HOST);
}
```

For local development and testing, a `mock` provider is available that writes to a local JSON file instead of calling a real DNS API.

---

## Constraints

1. Each step's rollback must be implemented before the step's forward function is deployed.
2. Rollback failures are logged as errors but do not prevent the pipeline from recording final `failed` status on the project.
3. A project in `provisioning` state cannot accept a second `POST /api/projects/:slug/deploy` call — the endpoint returns `409 Conflict`.
4. Pipeline timeout: if a step has not resolved within 120 seconds, the pipeline is considered failed and rollback is triggered.
5. All saga step outcomes (forward and rollback) must be written to the audit log with `projectId`, `slug`, `stepName`, `outcome`, and `timestamp`.

---

## Metrics

- Zero orphaned `multiplic.json` entries (pending entries not matching an active project)
- Zero orphaned DNS records (CNAME records not matching a deployed project)
- 100% of saga step failures trigger rollback of all completed steps
- Mean time from `POST /deploy` to `deployed` status: < 90 seconds
- All saga steps covered by unit tests with mock DNS and manifest adapters
