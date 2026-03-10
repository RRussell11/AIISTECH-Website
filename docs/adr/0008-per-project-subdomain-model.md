# ADR-0008: Per-Project Subdomain Model with Explicit Deploy

**Status:** Draft  
**Date:** 2026-03-10  
**Phase:** 2 — Project Hosting  
**Depends on:** ADR-0007 (cookie-scoped JWT), ADR-0006 (domain topology)

---

## Context

AIISTECH is a PaaS and Personal Automation Service. Users create automation projects that must be accessible at isolated, independently addressable URLs. Two granularity options exist: **one subdomain per user** or **one subdomain per automation project**. This ADR resolves that choice and governs how project subdomains come into existence.

A subdomain must not go live accidentally. Incomplete automation workflows, partially configured projects, or projects-in-draft must not be reachable from the public internet. This demands an explicit, intentional deploy action rather than automatic provisioning at project creation time.

---

## Decision

### One subdomain per automation project

Each automation project maps to its own `[slug].aiistech.com` subdomain. The `slug` is derived from the project name (lowercase, hyphenated, URL-safe) and is globally unique within the AIISTECH platform.

**Rationale over per-user subdomains:**
- A user may own multiple automation projects with different lifecycles, audiences, and access controls
- Project-level isolation allows independent deployments, rollbacks, and teardowns
- Billing and quota enforcement is cleaner at the project level than at the user level
- The existing `tenantId` field on users maps naturally to a tenant's collection of project slugs

### Project states

A project exists in one of four states:

| State | Meaning | Subdomain live? |
|---|---|---|
| `undeployed` | Created but never deployed | No — Multiplic returns 404 |
| `provisioning` | Deploy triggered; pipeline running | No — DNS/cert not yet active |
| `deployed` | Pipeline complete; subdomain live | Yes |
| `failed` | Pipeline failed; rollback complete | No — returns to `undeployed` |

### Explicit deploy action

A subdomain is **never** provisioned automatically at project creation. The user must explicitly click "Deploy" in the dashboard or call `POST /api/projects/:slug/deploy` programmatically. This is the formal state transition from `undeployed` to `provisioning`.

---

## Data model

```typescript
interface Project {
  id: string;           // UUID
  slug: string;         // URL-safe, globally unique, immutable after first deploy
  name: string;         // Human-readable display name
  tenantId: string;     // Matches user.tenantId — determines ownership
  ownerId: string;      // user.id of the project creator
  status: 'undeployed' | 'provisioning' | 'deployed' | 'failed';
  url: string | null;   // null until deployed; "https://[slug].aiistech.com" after
  deployedAt: string | null;  // ISO 8601 timestamp of last successful deploy
  createdAt: string;
  updatedAt: string;
}
```

---

## JWT extension

The existing JWT payload carries `{ id, email, role, tenantId }`. A `projects` claim is added at deploy time:

```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "role": "EXECUTIVE",
  "tenantId": "tenant-1",
  "projects": ["invoice-automation", "client-onboarding"]
}
```

`projects[]` is updated whenever:
- A new project subdomain is successfully deployed (slug added)
- A project subdomain is torn down (slug removed)
- Token is refreshed via `POST /api/auth/refresh` (list re-derived from database)

### Subdomain access check in `ProtectedRoute.tsx`

```typescript
const projectSlug = window.location.hostname.split('.')[0];
const isProjectSubdomain = window.location.hostname.endsWith('.aiistech.com')
  && projectSlug !== 'app'
  && projectSlug !== 'dashboard';

if (isProjectSubdomain && !user.projects.includes(projectSlug)) {
  return <Navigate to="/access-denied" replace />;
}
```

---

## API endpoints added in Phase 2

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/projects` | Create project (status: `undeployed`) |
| `GET` | `/api/projects` | List all projects for authenticated tenant |
| `GET` | `/api/projects/:slug` | Get single project by slug |
| `PATCH` | `/api/projects/:slug` | Update project name / metadata |
| `DELETE` | `/api/projects/:slug` | Delete project (must be `undeployed` or `failed`) |
| `POST` | `/api/projects/:slug/deploy` | Trigger deploy pipeline (Phase 3) |
| `GET` | `/api/projects/:slug/status` | Poll pipeline status (Phase 3) |
| `DELETE` | `/api/projects/:slug/deploy` | Teardown/undeploy (Phase 3) |

`POST /api/projects/:slug/deploy` and its teardown counterpart are specified here but implemented in Phase 3 (ADR-0009).

---

## Constraints

1. `slug` is **immutable after first deploy** — DNS records and `multiplic.json` entries use it as the primary key. Renaming a deployed slug requires teardown + re-deploy as a new slug.
2. Slug format: `^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$` — enforced at `POST /api/projects` validation.
3. Only the project owner (`user.id === project.ownerId`) may trigger deploy or teardown. Other members of the same `tenantId` have read-only access.
4. A project in `provisioning` state cannot be deleted. The in-flight pipeline must resolve to `deployed` or `failed` first.

---

## Rejected alternatives

**Per-user subdomain (`[username].aiistech.com`)** — rejected. A user's projects have independent lifecycles and audiences; collapsing them into a single subdomain creates a shared-fate failure boundary and prevents per-project access control.

**Subpath routing (`app.aiistech.com/projects/[slug]`)** — rejected. Subpaths cannot carry isolated `httpOnly` cookies, cannot have independent TLS SAN entries, and conflate the platform SPA with tenant project content.

**Auto-deploy on project creation** — rejected. Incomplete automation workflows would be publicly reachable before the user intends. An explicit deploy action creates a clean event boundary in the audit log.

---

## Metrics

- `POST /api/projects` responds in < 200ms
- Zero `[slug].aiistech.com` subdomains reachable before explicit deploy action
- `ProtectedRoute` subdomain check adds < 1ms overhead
- 100% of deployed project slugs present in the authenticated user's `projects[]` JWT claim
