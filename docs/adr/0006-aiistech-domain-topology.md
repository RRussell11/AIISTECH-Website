# ADR-0006: AIISTECH Domain Topology in Multiplic

**Status:** Draft  
**Date:** 2026-03-10  
**Phase:** 0 — Foundation  
**Depends on:** Multiplic ADR-001 (multiplic.json as single registry)

---

## Context

AIISTECH is a hybrid stack: WordPress PHP governs public marketing pages; a React SPA (`src/`) governs the authenticated application layer; a separate Vite dashboard (`dashboard/`) provides role-based analytics; and an Express API (`mock-backend/server.js`) provides REST endpoints. These four components currently run as isolated processes with no shared routing or identity layer.

Multiplic is a monorepo-driven multi-site hosting platform where one Express process (port 3000) serves all domains by looking up hostnames in `multiplic.json`. Integrating AIISTECH means registering each component as a named node in Multiplic's domain registry.

---

## Decision

AIISTECH's four runtime components map to four Multiplic domain nodes:

| Domain Node | Stack | Multiplic `sites/` folder | Purpose |
|---|---|---|---|
| `aiistech.com` | WordPress (Nginx → PHP-FPM) | n/a — proxied, not served by Node | Marketing + content root |
| `app.aiistech.com` | React SPA (Vite) | `sites/app.aiistech.com/` | Authenticated application |
| `dashboard.aiistech.com` | Dashboard (Vite) | `sites/dashboard.aiistech.com/` | Role-based analytics |
| `api.aiistech.com` | Express API | n/a — reverse-proxied to port 3001 | REST + auth endpoints |

`aiistech.com` (WordPress) and `api.aiistech.com` (Express) are **reverse-proxied** through Nginx to their respective processes — they do not go through Multiplic's static file router. `app.aiistech.com` and `dashboard.aiistech.com` are **served directly by Multiplic** from their `sites/*/dist` folders.

Per-project nodes (`[slug].aiistech.com`) are added dynamically at deploy time and are governed by ADR-0008 and ADR-0010.

---

## Constraints

1. Every domain served by Multiplic's Node process must have an entry in `multiplic.json` (inherited from Multiplic ADR-001).
2. WordPress is API-only — no SPA pages are rendered through WP templates (inherited from Multiplic ADR-005).
3. `api.aiistech.com` CORS must explicitly allow `app.aiistech.com`, `dashboard.aiistech.com`, and `*.aiistech.com` pattern for project subdomains.
4. Nginx terminates TLS for all `*.aiistech.com` using a wildcard certificate — Multiplic itself does not manage certs.

---

## `multiplic.json` entries for Phase 0

```json
{
  "version": 1,
  "sites": {
    "citizengardens.org": { ... },
    "citizengardens.org/lambdaproof": { ... },
    "app.aiistech.com": {
      "root": "sites/app.aiistech.com",
      "framework": "react",
      "description": "AIISTECH React SPA — authenticated application layer"
    },
    "dashboard.aiistech.com": {
      "root": "sites/dashboard.aiistech.com",
      "framework": "react",
      "description": "AIISTECH role-based analytics dashboard"
    }
  }
}
```

---

## Nginx routing additions

```nginx
# app.aiistech.com → Multiplic Node process
server {
    listen 80;
    server_name app.aiistech.com;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
    }
}

# dashboard.aiistech.com → Multiplic Node process
server {
    listen 80;
    server_name dashboard.aiistech.com;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
    }
}

# api.aiistech.com → Express API process (bypass Multiplic)
server {
    listen 80;
    server_name api.aiistech.com;
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
    }
}
```

---

## Rejected alternatives

**Single domain with subpaths (`aiistech.com/app`, `aiistech.com/api`)** — rejected because it couples WordPress routing with React SPA routing, prevents independent deployments per component, and makes cookie scoping for cross-domain auth impossible.

**Separate Multiplic instance per environment** — rejected because it contradicts Multiplic's core principle of one process serving unlimited sites, and creates configuration drift between staging and production.

---

## Metrics

- 100% of AIISTECH domains traceable to either `multiplic.json` or Nginx proxy config entry
- Zero pages served via WordPress PHP template that belong to the React SPA
- `curl -I http://app.aiistech.com` returns `200` from Multiplic within Phase 0 completion
