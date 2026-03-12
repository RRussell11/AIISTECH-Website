# ADR-0010: Multiplic Registry as AIISTECH Project Manifest

**Status:** Draft  
**Date:** 2026-03-10  
**Phase:** 3 — Provisioning  
**Depends on:** Multiplic ADR-001 (multiplic.json as single registry), ADR-0008 (per-project subdomain model), ADR-0009 (provisioning saga)

---

## Context

Multiplic uses `multiplic.json` as its single source of truth for all served domains (Multiplic ADR-001). AIISTECH needs a project manifest that records which automation project subdomains are live, their routing targets, their provisioning status, and ownership metadata.

Two options exist: maintain a separate AIISTECH-specific project manifest, or extend `multiplic.json` to carry AIISTECH project metadata. A separate manifest risks drift — a DNS record exists but no `multiplic.json` entry, or a manifest entry exists but no DNS record. A single registry eliminates this class of inconsistency.

---

## Decision

`multiplic.json` is the canonical record for every AIISTECH project subdomain. No project subdomain is considered provisioned unless it has an active entry in `multiplic.json`. This is a direct extension of Multiplic ADR-001 into the AIISTECH project layer.

### Schema extension

`multiplic.json` entries for AIISTECH project nodes carry additional metadata in an `aiistech` namespace:

```json
{
  "version": 1,
  "sites": {
    "app.aiistech.com": {
      "root": "sites/app.aiistech.com",
      "framework": "react",
      "description": "AIISTECH React SPA"
    },
    "dashboard.aiistech.com": {
      "root": "sites/dashboard.aiistech.com",
      "framework": "react",
      "description": "AIISTECH role-based analytics dashboard"
    },
    "invoice-automation.aiistech.com": {
      "root": "sites/invoice-automation.aiistech.com",
      "framework": "react",
      "description": "Invoice Automation — tenant-1",
      "aiistech": {
        "type": "project",
        "projectId": "proj-uuid-001",
        "tenantId": "tenant-1",
        "ownerId": "user-uuid-001",
        "status": "active",
        "deployedAt": "2026-03-10T18:21:00Z",
        "primeIndex": 7
      }
    }
  }
}
```

The `aiistech` namespace is ignored by Multiplic's core router — it reads only `root` and `framework`. This keeps the schema extension non-breaking and compatible with Multiplic ADR-001's constraint that all served domains have a `multiplic.json` entry.

### `status` field values in the registry

| Value | Meaning | Router serves? |
|---|---|---|
| `pending` | Pipeline in progress — written by saga Step 2 | No |
| `active` | Pipeline complete — written by saga Step 6 | Yes |
| `disabled` | Teardown in progress or manually paused | No |

The Multiplic router is extended with a one-line guard:

```javascript
// server/router.js — add to existing site lookup
const site = config.sites[hostname];
if (!site) return null;
if (site.aiistech && site.aiistech.status !== 'active') return null; // not yet live
```

This means `pending` and `disabled` entries exist in the registry (maintaining the saga's ability to detect partial states) but are not served to browsers.

### `primeIndex` assignment

Each project entry receives a `primeIndex` — the next available prime number at provisioning time. This is a direct implementation of Multiplic's prime-indexed identity model: every project is uniquely addressable by its prime, deterministic, and collision-free.

```javascript
// server/provisioning/manifest.js
function nextPrimeIndex(sites) {
  const usedPrimes = Object.values(sites)
    .filter(s => s.aiistech)
    .map(s => s.aiistech.primeIndex)
    .filter(Boolean);
  return nextPrime(Math.max(...usedPrimes, 1));
}
```

`primeIndex` is informational metadata at this stage — it does not affect routing. It is reserved for use by the future Multiplic prime-indexed relational governance model.

---

## Registry write protocol

`multiplic.json` is written by two actors: the provisioning saga and the `mpc` CLI (for manual admin operations). Both actors must:

1. Acquire a file lock before reading or writing (`proper-lockfile` or equivalent)
2. Read the current file, apply the change, write atomically (write to `.tmp` then rename)
3. Release the lock
4. Signal the Multiplic server to reload config via `POST /sync` (HMAC-signed, per ADR-003)

The server's `loadConfig()` function in `server/config.js` is already called on startup. For hot-reload without restart, the sync webhook handler is extended to call `loadConfig()` after pulling the `built` branch.

---

## Relationship to project database

The AIISTECH backend maintains a `projects` table (or in-memory store for Phase 3) as the **operational source of truth** for project lifecycle (status transitions, audit logs, user ownership). `multiplic.json` is the **routing source of truth** — it governs what the Multiplic server serves.

The two must stay in sync. The provisioning saga is the only authorized writer that updates both atomically (per ADR-0009). No direct writes to `multiplic.json` from the frontend or from user-facing API calls are permitted.

---

## Constraints

1. Every write to `multiplic.json` must be HMAC-signed and routed through the sync webhook (inherited from Multiplic ADR-003).
2. The `aiistech` namespace in `multiplic.json` may only be written by the provisioning saga or the `mpc` CLI with admin credentials.
3. The Multiplic router must never serve a `pending` or `disabled` entry to a browser — the guard in `router.js` is a hard constraint.
4. `multiplic.json` is committed to the `main` branch and deployed to `built` branch via CI — it is not written directly on the production server (inherited from Multiplic ADR-002). Exception: the sync webhook may write it during provisioning if the CI-based write path is too slow for real-time provisioning (to be resolved in Phase 3 implementation).

---

## Rejected alternatives

**Separate `aiistech-projects.json` manifest** — rejected. Two files governing overlapping domains creates a split-registry problem: the Multiplic router only knows about `multiplic.json`, so a project in a separate manifest is unserved until manually cross-referenced. All ADR-001 guarantees apply to `multiplic.json` only.

**Database as the routing source of truth** — rejected. The Multiplic server reads only the filesystem at startup and on sync. Adding a database read to every HTTP request introduces a hard database dependency on the hot path and contradicts Multiplic's design of serving from static filesystem state.

---

## Metrics

- Zero `multiplic.json` entries with `status: pending` older than 5 minutes (stale pipeline indicator)
- 100% of `status: active` entries correspond to a DNS CNAME resolving to the Multiplic host
- 100% of deployed project slugs in `multiplic.json` have a matching entry in the projects database
- `multiplic.json` reads consistent across all server replicas within 5 seconds of a sync event
