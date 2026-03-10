# AIISTECH × Multiplic — ADR Phased Integration Plan

**Status:** Active  
**Author:** AIISTECH Platform Team  
**Date:** 2026-03-10  
**Depends on:** Multiplic ADRs 001–005 (in `src/services/hosting/docs/adr/`)

---

## Overview

This document governs the phased integration of Multiplic (the monorepo-driven multi-site hosting platform at `src/services/hosting/`) into AIISTECH as its multi-domain PaaS hosting substrate. Each phase is backed by one or more ADRs that lock decisions before code is written.

AIISTECH's existing stack:

| Component | Location | Runtime |
|---|---|---|
| Marketing site | WordPress PHP templates (`*.php`) | Nginx → PHP-FPM |
| React SPA | `src/` (Vite, port 8080) | Node → Multiplic |
| Express API | `mock-backend/server.js` (port 3001) | Node → Multiplic |
| Dashboard | `dashboard/` (Vite) | Node → Multiplic |

---

## ADR Index

| ADR | Title | Phase | Status |
|---|---|---|---|
| [ADR-0006](0006-aiistech-domain-topology.md) | AIISTECH Domain Topology in Multiplic | 0 — Foundation | Draft |
| [ADR-0007](0007-cross-subdomain-jwt-cookies.md) | Cookie-Scoped JWT for Cross-Subdomain Identity | 1 — Identity Layer | Draft |
| [ADR-0008](0008-per-project-subdomain-model.md) | Per-Project Subdomain Model with Explicit Deploy | 2 — Project Hosting | Draft |
| [ADR-0009](0009-provisioning-pipeline-saga.md) | Provisioning Pipeline Saga Pattern | 3 — Provisioning | Draft |
| [ADR-0010](0010-multiplic-registry-as-project-manifest.md) | Multiplic Registry as AIISTECH Project Manifest | 3 — Provisioning | Draft |

---

## Phases

```
Phase 0 — Foundation          Register AIISTECH domains in Multiplic
Phase 1 — Identity Layer      JWT cross-subdomain auth via cookies
Phase 2 — Project Hosting     Per-project subdomain model + explicit deploy
Phase 3 — Provisioning        Saga pipeline, DNS, manifest writes
Phase 4 — Dashboard UI        Deploy action, state machine, polling
Phase 5 — Self-managing PaaS  Automation-triggered lifecycle (future)
```

---

## Phase 0 — Foundation

**Goal:** Multiplic serves the AIISTECH React SPA and dashboard with zero changes to the existing Express API. No auth changes. No new subdomains. Prove the router works.

**ADR to accept first:** ADR-0006 (domain topology)

**Tasks:**

1. Add `aiistech.com`, `app.aiistech.com`, and `dashboard.aiistech.com` entries to `src/services/hosting/multiplic.json`
2. Move the React SPA `dist/` output to `src/services/hosting/sites/app.aiistech.com/`
3. Move the dashboard `dist/` output to `src/services/hosting/sites/dashboard.aiistech.com/`
4. Confirm Multiplic's Express router resolves both hostnames to their `dist/` folders
5. Update `infra/nginx.conf` to route both subdomains to Multiplic (port 3000)
6. Keep `mock-backend/server.js` running at port 3001 — unchanged

**Acceptance criteria:**
- `curl http://app.aiistech.com` returns the React SPA shell
- `curl http://dashboard.aiistech.com` returns the dashboard shell
- `mock-backend` health check (`GET /api/health`) still returns 200
- All existing Multiplic tests (`npm test` in `src/services/hosting/`) still pass

---

## Phase 1 — Identity Layer

**Goal:** JWT tokens work across all `*.aiistech.com` subdomains via `httpOnly` cookies. No more `localStorage`. `AuthContext.tsx` drives cross-domain session state.

**ADR to accept first:** ADR-0007 (cookie-scoped JWT)

**Tasks:**

1. Harden `mock-backend/server.js`: replace static `JWT_SECRET` with env var; add `CORS_ORIGIN` allow-list pattern `*.aiistech.com`
2. Change login response from returning tokens in JSON body to setting `httpOnly; Secure; SameSite=None; Domain=.aiistech.com` cookies
3. Add `POST /api/auth/refresh` cookie-based rotation endpoint
4. Update `AuthContext.tsx` to read auth state from `/api/auth/me` on mount instead of from `localStorage`
5. Update `ProtectedRoute.tsx` to handle the cookie-auth flow
6. Update `src/services/authService.ts` to remove all `localStorage.setItem` calls for tokens

**Acceptance criteria:**
- Login at `app.aiistech.com` sets `.aiistech.com`-scoped cookie
- Navigating to `dashboard.aiistech.com` in the same browser session requires no re-login
- `GET /api/auth/me` with cookie returns user object; without cookie returns 401
- No access tokens visible in `localStorage` or `sessionStorage`

---

## Phase 2 — Project Hosting

**Goal:** Users can create automation projects. Each project gets an isolated subdomain (`[slug].aiistech.com`). Subdomains are NOT live until the user explicitly deploys.

**ADR to accept first:** ADR-0008 (per-project subdomain model)

**Tasks:**

1. Design the projects data model: `{ id, slug, name, tenantId, status: 'undeployed' | 'provisioning' | 'deployed' | 'failed', deployedAt, url }`
2. Add project CRUD endpoints to the backend: `POST /api/projects`, `GET /api/projects`, `GET /api/projects/:slug`
3. Add `projects[]` claim to the JWT payload — list of slugs the user may access
4. Extend `ProtectedRoute.tsx` with subdomain-level access check
5. Scaffold the project site template in `src/services/hosting/sites/` (a minimal React app)
6. Wire the project template into `multiplic.json` as a disabled/entry-only record until deploy

**Acceptance criteria:**
- `POST /api/projects` creates a project with status `undeployed`
- `GET /api/projects` returns all projects for the authenticated tenant
- JWT contains `projects: ["slug-a", "slug-b"]` after project creation
- Visiting `slug-a.aiistech.com` before deploy returns Multiplic's 404 response

---

## Phase 3 — Provisioning

**Goal:** The explicit deploy action executes the provisioning pipeline atomically. Failures at any step trigger a full compensating rollback. The manifest entry is only written on success.

**ADRs to accept first:** ADR-0009 (saga), ADR-0010 (registry)

**Tasks:**

1. Implement `POST /api/projects/:slug/deploy` — kicks off async pipeline, returns `{ status: 'provisioning' }`
2. Implement `GET /api/projects/:slug/status` — polling endpoint
3. Implement `DELETE /api/projects/:slug/deploy` — teardown/rollback endpoint
4. Build `triggerProvisioningPipeline(slug)`:
   - **Step 1** — Validate slug uniqueness in `multiplic.json`
   - **Step 2** — Write manifest entry (pending flag)
   - **Step 3** — Register DNS CNAME `slug → multiplic-host`
   - **Step 4** — Request wildcard cert coverage (or confirm `*.aiistech.com` covers it)
   - **Step 5** — Re-issue JWT with updated `projects[]` claim
   - **Step 6** — Flip manifest entry from pending to active
   - On any failure: compensating rollback in reverse step order
5. Write saga rollback handlers for each step

**Acceptance criteria:**
- Successful deploy transitions project to `deployed`; `multiplic.json` contains active entry
- Failed DNS step rolls back manifest write; project status returns to `undeployed`
- `GET /api/projects/:slug/status` reflects real pipeline state during provisioning
- All saga steps and rollbacks are covered by unit tests

---

## Phase 4 — Dashboard UI

**Goal:** The four role-based dashboards expose a Project Management panel with a deploy state machine. All four roles see projects; only the project owner (matched by `tenantId`) can deploy.

**Tasks:**

1. Create `src/features/dashboard/ProjectsPanel.tsx` — project list with status badges
2. Create `src/features/dashboard/DeployButton.tsx` — state machine: `Configure & Deploy` → `Deploying…` → `Live ↗` / `Retry Deploy`
3. Implement polling via `useProjectStatus(slug)` hook — polls `GET /api/projects/:slug/status` every 3s while status is `provisioning`
4. Gate deploy write-actions by `user.tenantId === project.tenantId`
5. Surface the live subdomain URL as a clickable link on `deployed` state
6. Add to all four role dashboards: Executive, Finance, Operations, IT (read-only for non-owners)

**Acceptance criteria:**
- Deploy button transitions through all four states correctly
- Polling stops when status resolves to `deployed` or `failed`
- Non-owner users see project list but deploy button is absent
- Live URL link opens the correct subdomain

---

## Phase 5 — Self-Managing PaaS (Future)

**Goal:** AIISTECH's automation engine drives domain lifecycle programmatically. No manual deploy clicks required for automation-configured projects.

**Planned work (not yet ADR'd):**

- Automation trigger → `POST /api/projects/:slug/deploy` via internal service token
- Automation teardown → `DELETE /api/projects/:slug/deploy`
- Webhook for project health changes → update manifest and notify tenant
- Per-project resource quotas enforced at Multiplic router level

---

## Dependency Map

```
ADR-0006 (topology)
    │
    ▼
ADR-0007 (JWT cookies) ──────────────────────────────┐
    │                                                 │
    ▼                                                 ▼
ADR-0008 (per-project model)              Phase 1 implementation
    │
    ▼
ADR-0009 (saga) ◄─── ADR-0010 (registry)
    │
    ▼
Phase 3 implementation
    │
    ▼
Phase 4 UI
```

---

## Governance Rules

1. No phase may begin implementation before its ADR(s) have status `Accepted`
2. Every new domain served by Multiplic must have a `multiplic.json` entry (inherited from Multiplic ADR-001)
3. No build toolchain on the production server (inherited from Multiplic ADR-002)
4. All server-bound signals must carry HMAC-SHA256 (inherited from Multiplic ADR-003)
5. WordPress is API-only — AIISTECH's SPA pages are never rendered through PHP templates (inherited from Multiplic ADR-005)
6. Access tokens are never stored in `localStorage` or `sessionStorage` in production
