# Multiplic Architecture

Multiplic is a monorepo-driven multi-site hosting platform. One Node.js process serves unlimited sites. GitHub is source of truth.

## Components

- **server/** — Express app that reads `multiplic.json` and serves `sites/*/dist` with SPA fallback
- **cli/** — `mpc` CLI for managing sites from the command line
- **sites/** — All site sources (React/Angular apps)
- **shared/** — Cross-site shared components
- **infra/** — Nginx config, pm2 ecosystem, server provisioning

## Request flow

```
Browser → Nginx :80 → Node :3000
  └─ multiplic.json lookup by hostname/subpath
  └─ Serve sites/<folder>/dist (static + SPA fallback)
```

## Sync flow

```
git push main → GitHub Actions (build-changed.yml)
  └─ Detect changed sites (git diff)
  └─ npm ci + vite build for each changed site
  └─ Commit dist/ to `built` branch
  └─ POST /sync to server (HMAC-signed)
  └─ Server: git pull built → sites updated
```
