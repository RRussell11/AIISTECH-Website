# Multi-Domain Hosting

**One repo. One Node.js process. Unlimited sites.**

A monorepo-driven multi-site hosting platform. A single Express server reads a central `multiplic.json` registry and serves any number of React/Angular SPAs from one process. GitHub is the source of truth — every `git push` triggers a CI build that publishes built assets to the `built` branch, and the server hot-reloads via a signed webhook.

---

## What exists today

| Area | Status | Notes |
|---|---|---|
| `server/` | ✅ Running | Express domain router, SPA fallback, structured JSON logging |
| `server/sync.js` | ✅ Running | HMAC-signed webhook listener — pulls `built` branch on push |
| `cli/` (`mpc`) | ✅ Working | `add`, `remove`, `deploy`, `status`, `logs` commands |
| `multiplic.json` | ✅ Active | Registry of live sites: `citizengardens.org` + `citizengardens.org/lambdaproof` |
| `sites/citizengardens.org--lambdaproof` | ✅ Present | React/Vite source |
| `shared/` | ✅ Scaffolded | Cross-site shared components workspace |
| `infra/` | ✅ Present | Nginx config, pm2 ecosystem, server provisioning script |
| `.github/workflows/` | ✅ Active | Path-scoped CI: only rebuilds changed sites |
| `docs/` | ✅ Present | Architecture, deployment, ADRs (001–005) |
| Test harness | ✅ Present | Jest — 20 tests across unit + integration |

---

## How it works

```
Browser → Nginx :80 → Node :3000
  └─ multiplic.json lookup by hostname / subpath
  └─ Serve sites/<folder>/dist  (static + SPA fallback)

git push main → GitHub Actions
  └─ Detect changed sites (git diff)
  └─ npm ci + vite build for each changed site
  └─ Commit dist/ → `built` branch
  └─ POST /sync  (HMAC-SHA256 signed)
  └─ Server: git pull built → live instantly
```

---

## Quick start (local dev)

```bash
# Prerequisites: Node 20, npm 10+
nvm use          # picks version from .nvmrc
npm install

# Start the server
npm start        # node server/app.js   → http://localhost:3000
npm run start:sync  # sync listener     → http://localhost:9001

# Watch mode
npm run dev

# Run tests
npm test
```

---

## Adding a site

```bash
mpc add citizengardens.org/lambdaproof --framework react
cd sites/citizengardens.org--lambdaproof
npm install && npm run dev
```

See [docs/ADDING-A-SITE.md](docs/ADDING-A-SITE.md) for the full walkthrough.

---

## Deploying to production

1. Provision an Ubuntu 22.04 VPS  
2. Run `bash infra/setup/server-init.sh`  
3. Set GitHub secrets: `SYNC_SECRET`, `SERVER_SYNC_URL`  
4. Push to `main` — CI handles the rest

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for environment variables and detailed steps.

---

## Repository layout

```
multiplic/
├── multiplic.json          # Domain → sites/ registry (source of truth)
├── server/                 # Express server + sync webhook
├── cli/                    # mpc CLI (add / remove / deploy / status / logs)
├── sites/                  # All site sources
├── shared/                 # Cross-site shared components
├── infra/                  # Nginx, pm2, provisioning
├── docs/                   # Architecture, deployment, ADRs, roadmap
└── tests/                  # Unit + integration test suites
```

---

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Adding a site](docs/ADDING-A-SITE.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Dev Roadmap](docs/ROADMAP.md)
- [ADR index](docs/adr/)
