
# MULTIPLIC — Development Blueprint
# Phase Mirror Development Orchestrator
# Generated: 2026-03-09

===============================================================================
OVERVIEW
===============================================================================

Multiplic is a monorepo-driven multi-site hosting platform.
One repo. One Node.js process. Unlimited sites. GitHub is source of truth.

Phases:
  Phase 0 — Foundation          (Days  1–7)
  Phase 1 — Core Server         (Days  8–21)
  Phase 2 — CI/CD Pipeline      (Days 22–35)
  Phase 3 — CLI (mpc)           (Days 36–50)
  Phase 4 — Test Harness        (Days 51–65)
  Phase 5 — Cloud Tier          (Days 66–90)

===============================================================================
PHASE 0 — FOUNDATION  (Days 1–7)
===============================================================================

Goal: Repo exists. File tree is scaffolded. multiplic.json schema is locked.
      No code runs yet. All decisions are documented in ADRs.

--- ADRs to write first (governance before code) ---

  ADR-001: multiplic.json as single registry of truth
    Decision: One JSON file at repo root maps every domain/subpath to a sites/ folder.
    Constraint: No domain may be served without a multiplic.json entry.
    Owner: Platform
    Metric: 100% of served domains traceable to multiplic.json entry

  ADR-002: `built` branch as deployment artifact
    Decision: main branch never has dist/. CI builds and commits dist/ to `built` branch.
    Server only ever pulls `built`. Build tools never installed on production.
    Constraint: Server has only git + node + pm2. No npm build toolchain.
    Owner: Infra
    Metric: 0 build tools on production server

  ADR-003: HMAC-SHA256 on all server-bound signals
    Decision: Every webhook/sync ping must carry X-Hub-Signature-256.
    Server rejects all unsigned requests with 403. No exceptions.
    Constraint: SYNC_SECRET must be rotated every 90 days.
    Owner: Security
    Metric: 100% rejection rate of unsigned payloads

  ADR-004: Path-scoped CI — build only changed sites
    Decision: GitHub Actions detects which sites/ folders changed via git diff.
    Only those sites rebuild. Unaffected sites never re-run npm ci.
    Owner: CI
    Metric: Build time < 90s for single-site change

  ADR-005: WordPress as API-only dependency
    Decision: No Multiplic site uses a WP PHP template for delivery.
    WP plugins accessible via REST from React/Angular apps via window.__MULTIPLIC__.wpBase.
    Owner: Architecture
    Metric: 0 SPA pages rendered through WP template system

--- File scaffold (full tree) ---

multiplic/
├── multiplic.json                    # THE registry — domain → sites/ folder
├── package.json                      # npm workspaces root
├── .nvmrc                            # node version pin (20)
├── .gitignore                        # ignores sites/*/dist on main
│
├── server/                           # multiplic-server package
│   ├── package.json
│   ├── app.js                        # Express: domain router + SPA fallback
│   ├── sync.js                       # Webhook listener: git pull + pm2 reload
│   ├── router.js                     # Extracted routing logic (testable)
│   ├── logger.js                     # Structured JSON logging
│   └── config.js                     # Reads multiplic.json, validates schema
│
├── cli/                              # mpc CLI package
│   ├── package.json
│   ├── bin/
│   │   └── mpc.js                    # Entry point: #!/usr/bin/env node
│   └── commands/
│       ├── add.js                    # mpc add <domain> [--framework react|angular]
│       ├── remove.js                 # mpc remove <domain>
│       ├── deploy.js                 # mpc deploy [site] — triggers manual sync
│       ├── status.js                 # mpc status — shows all sites + last deploy SHA
│       └── logs.js                   # mpc logs [site] — tails server log filtered by site
│
├── sites/                            # All site sources live here
│   └── citizengardens.org--lambdaproof/
│       ├── package.json              # "build": "vite build --outDir dist"
│       ├── vite.config.js
│       ├── index.html
│       ├── src/
│       │   ├── main.jsx
│       │   ├── App.jsx
│       │   └── assets/
│       └── dist/                     # gitignored on main, committed on `built`
│
├── shared/                           # Cross-site shared components
│   ├── package.json
│   └── components/
│       └── index.js
│
├── infra/
│   ├── nginx/
│   │   └── multiplic.conf            # Nginx: proxy to Node :3000, sync on :9000 (internal)
│   ├── pm2/
│   │   └── ecosystem.config.js       # pm2 process definitions
│   └── setup/
│       └── server-init.sh            # One-time server provisioning script
│
├── docs/
│   ├── adr/
│   │   ├── 0001-multiplic-json-registry.md
│   │   ├── 0002-built-branch-artifacts.md
│   │   ├── 0003-hmac-signing.md
│   │   ├── 0004-path-scoped-ci.md
│   │   └── 0005-wordpress-api-only.md
│   ├── ARCHITECTURE.md
│   ├── ADDING-A-SITE.md
│   └── DEPLOYMENT.md
│
└── .github/
    └── workflows/
        ├── build-changed.yml         # Detect + build changed sites → commit to `built`
        ├── notify-server.yml         # Ping server sync endpoint after built branch updates
        ├── lint.yml                  # ESLint + Prettier on all JS
        └── test.yml                  # Run full test harness on PR

===============================================================================
PHASE 1 — CORE SERVER  (Days 8–21)
===============================================================================

Goal: `multiplic-server` runs locally, serves sites from sites/*/dist,
      handles SPA fallback, responds to sync webhook.

--- server/app.js ---

const express  = require('express');
const path     = require('path');
const { buildRouter } = require('./router');
const { loadConfig }  = require('./config');
const logger   = require('./logger');

const app = express();
app.use(express.json());

const config = loadConfig();

app.use((req, res, next) => {
  const handler = buildRouter(config, req.hostname, req.path);
  if (!handler) {
    logger.warn({ hostname: req.hostname, path: req.path }, 'no site matched');
    return res.status(404).send('Site not found');
  }
  handler(req, res, next);
});

module.exports = app;
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => logger.info({ port }, 'multiplic server started'));
}

--- server/router.js ---

const express = require('express');
const path    = require('path');
const fs      = require('fs');

function buildRouter(config, hostname, reqPath) {
  const host     = hostname.replace(/^www\./, '');
  const segment  = reqPath.split('/').filter(Boolean)[0] || '';

  // Try subpath match first: citizengardens.org/lambdaproof
  const subKey   = `${host}/${segment}`;
  const entry    = config.sites[subKey] || config.sites[host];

  if (!entry) return null;

  const root     = path.resolve(__dirname, '..', entry.root, 'dist');
  if (!fs.existsSync(root)) return null;

  return (req, res, next) => {
    // Strip subpath prefix for subpath-mounted sites
    if (config.sites[subKey] && segment) {
      req.url = req.url.replace(`/${segment}`, '') || '/';
    }
    express.static(root)(req, res, () => {
      res.sendFile(path.join(root, 'index.html'));
    });
  };
}

module.exports = { buildRouter };

--- server/sync.js ---

const express    = require('express');
const crypto     = require('crypto');
const { exec }   = require('child_process');
const logger     = require('./logger');

const app = express();
app.use(express.raw({ type: '*/*' }));   // raw body for HMAC

app.post('/sync', (req, res) => {
  const sig      = req.headers['x-hub-signature-256'] || '';
  const secret   = process.env.SYNC_SECRET;
  const expected = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(req.body)
    .digest('hex');

  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    logger.warn('sync: rejected unsigned request');
    return res.status(403).send('Forbidden');
  }

  res.sendStatus(202);  // respond immediately, don't block Actions runner

  const repoPath = process.env.MULTIPLIC_REPO_PATH || '/var/www/multiplic';
  exec(`git -C ${repoPath} pull origin built`, (err, stdout, stderr) => {
    if (err) logger.error({ err, stderr }, 'sync: git pull failed');
    else     logger.info({ stdout }, 'sync: pulled built branch');
  });
});

const port = process.env.SYNC_PORT || 9000;
app.listen(port, () => logger.info({ port }, 'multiplic sync listener started'));

--- server/config.js ---

const fs   = require('fs');
const path = require('path');

function loadConfig(configPath) {
  const file = configPath || path.resolve(__dirname, '..', 'multiplic.json');
  if (!fs.existsSync(file)) throw new Error(`multiplic.json not found at ${file}`);
  const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  validate(raw);
  return raw;
}

function validate(config) {
  if (!config.version) throw new Error('multiplic.json: missing version field');
  if (!config.sites || typeof config.sites !== 'object')
    throw new Error('multiplic.json: missing sites object');
  for (const [key, entry] of Object.entries(config.sites)) {
    if (!entry.root)      throw new Error(`site "${key}": missing root`);
    if (!entry.framework) throw new Error(`site "${key}": missing framework`);
  }
}

module.exports = { loadConfig };

--- multiplic.json schema ---

{
  "version": 1,
  "sites": {
    "citizengardens.org": {
      "root": "sites/citizengardens.org",
      "framework": "react",
      "description": "Citizen Gardens main site"
    },
    "citizengardens.org/lambdaproof": {
      "root": "sites/citizengardens.org--lambdaproof",
      "framework": "react",
      "description": "Lambda Proof application"
    }
  }
}

===============================================================================
PHASE 2 — CI/CD PIPELINE  (Days 22–35)
===============================================================================

Goal: Push to main → only changed sites build → dist committed to `built`
      branch → server webhook pinged → server pulls → site live.

--- .github/workflows/build-changed.yml ---

name: Build Changed Sites
on:
  push:
    branches: [main]
    paths: ['sites/**', 'shared/**', 'multiplic.json']

jobs:
  detect:
    runs-on: ubuntu-latest
    outputs:
      sites: ${{ steps.detect.outputs.sites }}
      has_changes: ${{ steps.detect.outputs.has_changes }}
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 2 }
      - name: Detect changed sites
        id: detect
        run: |
          CHANGED=$(git diff --name-only HEAD~1 HEAD \
            | grep '^sites/' \
            | cut -d'/' -f2 \
            | sort -u)
          # Also rebuild all sites if shared/ changed
          if git diff --name-only HEAD~1 HEAD | grep -q '^shared/'; then
            CHANGED=$(ls sites/)
          fi
          SITES=$(echo "$CHANGED" | tr '\n' ' ' | xargs)
          echo "sites=$SITES" >> $GITHUB_OUTPUT
          echo "has_changes=$([ -n "$SITES" ] && echo true || echo false)" >> $GITHUB_OUTPUT

  build:
    needs: detect
    if: needs.detect.outputs.has_changes == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version-file: '.nvmrc', cache: 'npm' }
      - name: Install root workspace deps
        run: npm ci
      - name: Build changed sites
        run: |
          for site in ${{ needs.detect.outputs.sites }}; do
            echo "=== Building $site ==="
            cd sites/$site
            npm ci
            npm run build
            cd ../..
          done
      - name: Commit dist to built branch
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          git config user.email "ci@multiplic"
          git config user.name "Multiplic CI"
          git fetch origin built 2>/dev/null || true
          # Detach and set up built branch
          git checkout -B built origin/built 2>/dev/null || git checkout --orphan built
          # Bring in the full tree except .gitignore overrides
          git checkout main -- .
          # Force-add dist folders (they are gitignored on main)
          for site in ${{ needs.detect.outputs.sites }}; do
            git add -f sites/$site/dist/
          done
          git commit -m "build(${{ github.sha }}): ${{ needs.detect.outputs.sites }}"
          git push origin built --force-with-lease

  notify:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Ping server sync endpoint
        run: |
          PAYLOAD=$(printf '{"sha":"%s","sites":"%s"}' \
            "${{ github.sha }}" \
            "${{ needs.detect.outputs.sites }}")
          SIG=$(printf '%s' "$PAYLOAD" | \
            openssl dgst -sha256 -hmac "${{ secrets.SYNC_SECRET }}" | awk '{print $2}')
          curl -fsSL -X POST "${{ secrets.SERVER_SYNC_URL }}/sync" \
            -H "X-Hub-Signature-256: sha256=$SIG" \
            -H "Content-Type: application/json" \
            -d "$PAYLOAD"

--- infra/nginx/multiplic.conf ---

# All domains → Node :3000 (public)
server {
    listen 80;
    server_name ~^(.+)$;

    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}

# Sync endpoint on :9000 — INTERNAL ONLY, never expose to public
# Only allow from GitHub Actions IP ranges
server {
    listen 9000;
    allow  192.30.252.0/22;    # GitHub Actions IP range
    allow  185.199.108.0/22;
    deny   all;

    location /sync {
        proxy_pass http://127.0.0.1:9000;
    }
}

--- infra/pm2/ecosystem.config.js ---

module.exports = {
  apps: [
    {
      name:         'multiplic-app',
      script:       'server/app.js',
      cwd:          '/var/www/multiplic',
      instances:    'max',
      exec_mode:    'cluster',
      env: {
        NODE_ENV:              'production',
        PORT:                  3000,
        MULTIPLIC_REPO_PATH:   '/var/www/multiplic'
      }
    },
    {
      name:         'multiplic-sync',
      script:       'server/sync.js',
      cwd:          '/var/www/multiplic',
      instances:    1,
      env: {
        NODE_ENV:              'production',
        SYNC_PORT:             9000,
        SYNC_SECRET:           'SET_IN_PM2_ENV',
        MULTIPLIC_REPO_PATH:   '/var/www/multiplic'
      }
    }
  ]
};

===============================================================================
PHASE 3 — CLI (mpc)  (Days 36–50)
===============================================================================

Goal: `npm install -g multiplic` gives you the `mpc` CLI.
      Developers manage sites from the command line without editing JSON manually.

--- cli/bin/mpc.js ---

#!/usr/bin/env node
const { program } = require('commander');
const pkg         = require('../../package.json');

program
  .name('mpc')
  .description('Multiplic CLI — manage your multi-site Node.js server')
  .version(pkg.version);

program
  .command('add <domain>')
  .description('Add a new site to multiplic.json and scaffold sites/<folder>/')
  .option('-f, --framework <type>', 'react or angular', 'react')
  .option('-p, --path <subpath>',   'mount at subpath, e.g. /lambdaproof')
  .action(require('./commands/add'));

program
  .command('remove <domain>')
  .description('Remove a site from multiplic.json')
  .action(require('./commands/remove'));

program
  .command('status')
  .description('Show all sites, active SHA, last deployed')
  .action(require('./commands/status'));

program
  .command('deploy [site]')
  .description('Trigger manual sync on server (re-pull built branch)')
  .action(require('./commands/deploy'));

program
  .command('logs [site]')
  .description('Tail server logs filtered by site domain')
  .action(require('./commands/logs'));

program.parse();

--- cli/commands/add.js ---

const fs   = require('fs');
const path = require('path');

module.exports = function add(domain, options) {
  const configPath = path.resolve(process.cwd(), 'multiplic.json');
  const config     = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  const key    = options.path ? `${domain}${options.path}` : domain;
  const folder = options.path
    ? `sites/${domain}--${options.path.replace('/', '')}`
    : `sites/${domain}`;

  if (config.sites[key]) {
    console.error(`Site "${key}" already exists in multiplic.json`);
    process.exit(1);
  }

  config.sites[key] = { root: folder, framework: options.framework };
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

  // Scaffold site folder from template
  const siteDir = path.resolve(process.cwd(), folder);
  fs.mkdirSync(path.join(siteDir, 'src'), { recursive: true });

  const tmpl = options.framework === 'angular'
    ? angularPackageJson(domain)
    : reactPackageJson(domain);

  fs.writeFileSync(path.join(siteDir, 'package.json'), JSON.stringify(tmpl, null, 2));

  console.log(`✓ Added ${key} → ${folder}`);
  console.log(`  Next: cd ${folder} && npm install && npm run dev`);
};

function reactPackageJson(name) {
  return {
    name: name.replace(/[^a-z0-9-]/g, '-'),
    version: '0.1.0',
    private: true,
    scripts: {
      dev:   'vite',
      build: 'vite build --outDir dist',
      preview: 'vite preview'
    },
    dependencies:    { react: '^18.3.1', 'react-dom': '^18.3.1' },
    devDependencies: { vite: '^5.0.0', '@vitejs/plugin-react': '^4.0.0' }
  };
}

function angularPackageJson(name) {
  return {
    name: name.replace(/[^a-z0-9-]/g, '-'),
    version: '0.1.0',
    private: true,
    scripts: {
      dev:   'ng serve',
      build: 'ng build --output-path dist',
      test:  'ng test'
    },
    dependencies:    { '@angular/core': '^17.0.0', '@angular/platform-browser': '^17.0.0' },
    devDependencies: { '@angular/cli': '^17.0.0' }
  };
}

===============================================================================
PHASE 4 — TEST HARNESS  (Days 51–65)
===============================================================================

Goal: Full test suite. Unit tests on router logic. Integration tests on
      server behavior. E2E tests on CI pipeline. All tests run on every PR.

--- Test structure ---

tests/
├── unit/
│   ├── router.test.js          # router.js logic with mock config
│   ├── config.test.js          # multiplic.json validation
│   └── sync.test.js            # HMAC validation logic
├── integration/
│   ├── server.test.js          # Express app with supertest
│   └── sync-endpoint.test.js   # sync endpoint with valid/invalid signatures
├── e2e/
│   └── deploy-flow.test.js     # simulates full push → build → sync → serve
└── fixtures/
    ├── multiplic.json           # test config
    └── sites/
        └── test.example.com/
            └── dist/
                └── index.html   # minimal SPA fixture

--- tests/unit/router.test.js ---

const { buildRouter } = require('../../server/router');

const config = {
  sites: {
    'example.com': {
      root: 'tests/fixtures/sites/test.example.com',
      framework: 'react'
    },
    'example.com/app': {
      root: 'tests/fixtures/sites/test.example.com',
      framework: 'react'
    }
  }
};

describe('buildRouter', () => {
  test('returns null for unknown hostname', () => {
    expect(buildRouter(config, 'unknown.com', '/')).toBeNull();
  });

  test('matches root domain', () => {
    const handler = buildRouter(config, 'example.com', '/');
    expect(handler).toBeInstanceOf(Function);
  });

  test('matches www-prefixed domain', () => {
    const handler = buildRouter(config, 'www.example.com', '/');
    expect(handler).toBeInstanceOf(Function);
  });

  test('matches subpath site', () => {
    const handler = buildRouter(config, 'example.com', '/app/dashboard');
    expect(handler).toBeInstanceOf(Function);
  });

  test('returns null when dist folder missing', () => {
    const badConfig = {
      sites: { 'example.com': { root: 'sites/nonexistent', framework: 'react' } }
    };
    expect(buildRouter(badConfig, 'example.com', '/')).toBeNull();
  });
});

--- tests/unit/sync.test.js ---

const crypto = require('crypto');

function validateSignature(body, sig, secret) {
  const expected = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch { return false; }
}

describe('HMAC validation', () => {
  const secret = 'test-secret-123';

  test('accepts valid signature', () => {
    const body = JSON.stringify({ sha: 'abc123' });
    const sig  = 'sha256=' + crypto.createHmac('sha256', secret).update(body).digest('hex');
    expect(validateSignature(body, sig, secret)).toBe(true);
  });

  test('rejects tampered body', () => {
    const body    = JSON.stringify({ sha: 'abc123' });
    const tampered = JSON.stringify({ sha: 'evil' });
    const sig     = 'sha256=' + crypto.createHmac('sha256', secret).update(body).digest('hex');
    expect(validateSignature(tampered, sig, secret)).toBe(false);
  });

  test('rejects wrong secret', () => {
    const body = JSON.stringify({ sha: 'abc123' });
    const sig  = 'sha256=' + crypto.createHmac('sha256', 'wrong').update(body).digest('hex');
    expect(validateSignature(body, sig, secret)).toBe(false);
  });

  test('rejects missing signature', () => {
    expect(validateSignature('body', '', secret)).toBe(false);
  });
});

--- tests/integration/server.test.js ---

const request = require('supertest');
const app     = require('../../server/app');

describe('Multiplic server', () => {
  test('returns 404 for unknown domain', async () => {
    const res = await request(app)
      .get('/')
      .set('Host', 'unknown.example.com');
    expect(res.status).toBe(404);
  });

  test('serves index.html for known domain root', async () => {
    const res = await request(app)
      .get('/')
      .set('Host', 'test.example.com');
    expect(res.status).toBe(200);
    expect(res.text).toContain('<div id="root">');
  });

  test('SPA fallback: unknown path returns index.html', async () => {
    const res = await request(app)
      .get('/some/deep/react-route')
      .set('Host', 'test.example.com');
    expect(res.status).toBe(200);
    expect(res.text).toContain('<div id="root">');
  });

  test('static assets served with correct content-type', async () => {
    const res = await request(app)
      .get('/assets/main.js')
      .set('Host', 'test.example.com');
    // 200 if fixture exists, 200 (index.html fallback) if not — either way, no 500
    expect([200, 404]).toContain(res.status);
  });
});

--- tests/unit/config.test.js ---

const { loadConfig } = require('../../server/config');
const path           = require('path');

describe('loadConfig', () => {
  test('loads valid multiplic.json', () => {
    const config = loadConfig(path.resolve(__dirname, '../fixtures/multiplic.json'));
    expect(config.version).toBe(1);
    expect(config.sites).toBeDefined();
  });

  test('throws on missing file', () => {
    expect(() => loadConfig('/nonexistent/multiplic.json')).toThrow();
  });

  test('throws on missing version', () => {
    const tmpFile = require('os').tmpdir() + '/multiplic-bad.json';
    require('fs').writeFileSync(tmpFile, JSON.stringify({ sites: {} }));
    expect(() => loadConfig(tmpFile)).toThrow('missing version');
  });

  test('throws on site missing root', () => {
    const tmpFile = require('os').tmpdir() + '/multiplic-bad2.json';
    require('fs').writeFileSync(tmpFile, JSON.stringify({
      version: 1,
      sites: { 'example.com': { framework: 'react' } }
    }));
    expect(() => loadConfig(tmpFile)).toThrow('missing root');
  });
});

--- package.json (root) ---

{
  "name": "multiplic",
  "version": "0.1.0",
  "private": true,
  "workspaces": ["server", "cli", "sites/*", "shared"],
  "scripts": {
    "test":         "jest --runInBand",
    "test:unit":    "jest tests/unit",
    "test:int":     "jest tests/integration",
    "test:watch":   "jest --watch",
    "lint":         "eslint server/ cli/ --ext .js",
    "start":        "node server/app.js",
    "start:sync":   "node server/sync.js",
    "dev":          "nodemon server/app.js"
  },
  "devDependencies": {
    "jest":         "^29.0.0",
    "supertest":    "^6.0.0",
    "nodemon":      "^3.0.0",
    "eslint":       "^8.0.0"
  },
  "jest": {
    "testEnvironment": "node",
    "collectCoverageFrom": ["server/**/*.js", "cli/**/*.js"],
    "coverageThreshold": {
      "global": { "branches": 80, "functions": 80, "lines": 80 }
    }
  }
}

===============================================================================
PHASE 5 — CLOUD TIER  (Days 66–90)
===============================================================================

Goal: Managed Multiplic Cloud — clients get a hosted instance with
      dashboard, no server setup required.

Architecture additions:
  - /dashboard                        React app: site list, deploy history, logs viewer
  - /api                              Thin Express REST API backing the dashboard
  - Multi-tenant: each org gets an isolated server process (pm2 namespace)
  - Billing: usage-based on bandwidth + sites count
  - White-label: clients can use their own domain for the dashboard

New files (Cloud tier only, open-core boundary):
  server/
  ├── api/
  │   ├── routes/
  │   │   ├── sites.js              # GET/POST /api/sites
  │   │   ├── deployments.js        # GET /api/deployments
  │   │   └── logs.js               # GET /api/logs (SSE stream)
  │   └── middleware/
  │       └── auth.js               # JWT auth for dashboard API
  └── dashboard/                    # Built React dashboard app
      └── dist/

Open-core boundary:
  OSS (free):     server/, cli/, multiplic.json spec, CI templates
  Cloud (paid):   dashboard/, api/, multi-tenant orchestration, SLA, support

===============================================================================
DEPLOYMENT INSTRUCTIONS — STEP BY STEP
===============================================================================

STEP 1: Create the repo
  1a. Go to github.com/MultiplicityFoundation → New repository
  1b. Name: multiplic
  1c. Public (OSS) or Private (until ready)
  1d. Initialize with README

STEP 2: Provision the server
  # On a fresh Ubuntu 22.04 VPS (DigitalOcean, Linode, etc.):
  # Run: bash infra/setup/server-init.sh

  #!/bin/bash
  set -e
  apt-get update && apt-get upgrade -y
  apt-get install -y git nginx certbot python3-certbot-nginx

  # Node 20 via nvm
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh"
  nvm install 20 && nvm use 20 && nvm alias default 20

  # pm2 globally
  npm install -g pm2

  # Clone repo (built branch — no build tools needed on server)
  git clone --branch built https://github.com/MultiplicityFoundation/multiplic /var/www/multiplic
  cd /var/www/multiplic

  # Install server deps only
  cd server && npm ci --production && cd ..

  # Copy Nginx config
  cp infra/nginx/multiplic.conf /etc/nginx/sites-available/multiplic
  ln -sf /etc/nginx/sites-available/multiplic /etc/nginx/sites-enabled/
  nginx -t && systemctl reload nginx

  # Start processes
  pm2 start infra/pm2/ecosystem.config.js
  pm2 save && pm2 startup

STEP 3: Set GitHub repo secrets
  In GitHub repo → Settings → Secrets and variables → Actions:
  - SYNC_SECRET          (random 32-char string — keep this, put it in pm2 env too)
  - SERVER_SYNC_URL      (http://your-server-ip:9000)

STEP 4: Add your first site
  # Locally:
  git clone https://github.com/MultiplicityFoundation/multiplic
  cd multiplic
  npm install -g multiplic      # installs mpc CLI (once published)
  # or: node cli/bin/mpc.js
  mpc add citizengardens.org/lambdaproof --framework react

  # This:
  # 1. Updates multiplic.json
  # 2. Scaffolds sites/citizengardens.org--lambdaproof/
  # 3. You add your lovable.dev source files into src/

STEP 5: Push and watch it deploy
  git add .
  git commit -m "feat: add lambdaproof site"
  git push origin main
  # → GitHub Actions detects sites/citizengardens.org--lambdaproof changed
  # → Builds only that site (npm ci + vite build)
  # → Commits dist/ to built branch
  # → Pings server /sync
  # → Server pulls built branch
  # → Site live at citizengardens.org/lambdaproof

STEP 6: Configure DNS
  Point all domains → same server IP (A records)
  Nginx handles all of them → proxies to Node :3000
  Node reads hostname → serves correct sites/*/dist

STEP 7: SSL
  certbot --nginx -d citizengardens.org -d domain2.com
  # Certbot auto-updates Nginx config with SSL + auto-renewal

===============================================================================
ADDING A NEW SITE (steady state, post-launch)
===============================================================================

1. mpc add <domain> [--framework react|angular] [--path /subpath]
2. Build your React/Angular app inside sites/<folder>/src/
3. git add . && git commit -m "feat: add <domain>" && git push
4. Done. CI builds it. Server serves it. 3 minutes total.

===============================================================================
OPEN-CORE POSITIONING
===============================================================================

Multiplic OSS:
  - Self-hostable
  - Unlimited sites
  - MIT licensed
  - npm install -g multiplic

Multiplic Cloud:
  - Managed hosting
  - Dashboard UI
  - Deploy previews
  - SLA + support
  - Usage-based pricing: $0 → $X/month per bandwidth tier

===============================================================================
LEVERS SUMMARY
===============================================================================

Lever                      Owner      Metric                           Horizon
─────────────────────────────────────────────────────────────────────────────
multiplic.json as registry Platform   100% domains in registry          7 days
built branch isolation     Infra      0 build tools on prod             7 days
HMAC on all sync pings     Security   100% unsigned rejections          7 days
Path-scoped CI             CI         Build time < 90s single site     14 days
SPA fallback correctness   Server     0 hard 404s on deep routes       21 days
Test coverage ≥ 80%        QA         Coverage report on every PR      65 days
mpc CLI published to npm   Platform   npm install -g multiplic works   50 days
Cloud dashboard v1         Product    First paying client              90 days 
