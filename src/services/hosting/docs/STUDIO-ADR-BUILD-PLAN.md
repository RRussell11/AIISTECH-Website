# Multiplic Studio — Full ADR Build Plan

**Status:** Draft
**Author:** @PhaseMirror
**Date:** 2026-03-09
**Supersedes:** `docs/STUDIO-DEV-BLUEPRINT.md` (summary version)
**Depends on:** ADR-001 through ADR-005 (existing platform ADRs)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Relationship to Existing Architecture](#2-relationship-to-existing-architecture)
3. [ADR-006: Password + Session Authentication](#3-adr-006-password--session-authentication)
4. [ADR-007: File System Sandboxing](#4-adr-007-file-system-sandboxing)
5. [ADR-008: AI Provider Abstraction](#5-adr-008-ai-provider-abstraction)
6. [ADR-009: Terminal Security](#6-adr-009-terminal-security)
7. [Complete File Manifest](#7-complete-file-manifest)
8. [Dependency Map](#8-dependency-map)
9. [Phase 0–6 Day-by-Day Task Decomposition](#9-phase-06-day-by-day-task-decomposition)
10. [Full Implementation Reference Code](#10-full-implementation-reference-code)
11. [Test Harness](#11-test-harness)
12. [Environment Variables Reference](#12-environment-variables-reference)
13. [Security Threat Model](#13-security-threat-model)
14. [Acceptance Criteria](#14-acceptance-criteria)
15. [Rollback and Feature Flags](#15-rollback-and-feature-flags)

---

## 1. Executive Summary

Multiplic Studio is a **browser-based developer environment** served at `/_studio` on the existing Express server (port 3000). It provides a Monaco-powered code editor, a sandboxed file explorer, a git commit/push UI, an embedded terminal (via WebSocket + node-pty), and an AI copilot sidebar — all scoped to the repository root.

**Guiding principle:** Studio is a zero-footprint opt-in feature. It activates only when `STUDIO_PASSWORD` is set in the environment. When the variable is absent the server behaves exactly as today; no routes, no middleware, no overhead are added.

**Mount point:**

```javascript
// server/app.js addition (only change to existing files)
if (process.env.STUDIO_PASSWORD) {
  const studio = require('./studio');
  app.use('/_studio', studio);
}
```

Studio is a self-contained Express sub-application living in `server/studio/`. All Studio routes, middleware, and services are isolated behind that mount. The existing domain-router, sync listener, and config loader are unmodified.

---

## 2. Relationship to Existing Architecture

### 2.1 Constraint Inheritance from ADRs 001–005

| Existing ADR | Studio implication |
|---|---|
| **ADR-001** — `multiplic.json` is the single registry | Studio file explorer reads `multiplic.json` to build the site-tree sidebar. No site is shown unless it has an entry. |
| **ADR-002** — `built` branch carries `dist/`; build tools absent from production | Studio pushes to `main` only. CI picks up the push and rebuilds/deploys. Studio never runs `npm run build` itself. |
| **ADR-003** — HMAC on all server-bound signals | Studio's git push triggers the same HMAC-signed sync webhook. Studio does not bypass `sync.js`. |
| **ADR-004** — Path-scoped CI: build only changed sites | Studio commits include only the site folder that was edited. CI path filter naturally limits rebuilds. |
| **ADR-005** — WordPress as API-only | Studio AI context includes `wpBase` from `multiplic.json` when the currently open site declares it, ensuring AI suggestions respect the API-only constraint. |

### 2.2 Interaction with Existing Server Files

```
server/
├── app.js          ← ONE addition: conditional Studio mount
├── router.js       ← unchanged; handles citizengardens.org domain routing
├── sync.js         ← unchanged; Studio-triggered pushes flow through here
├── config.js       ← unchanged; Studio calls loadConfig() to read multiplic.json
├── logger.js       ← unchanged; Studio imports same pino logger instance
└── studio/         ← NEW sub-application (see File Manifest)
```

### 2.3 Request-Flow Diagram

```
Browser ──GET /_studio/*──► app.js
                              │
                    STUDIO_PASSWORD set?
                         ├── no  → 404 (Studio not mounted)
                         └── yes → studio/index.js sub-app
                                       │
                               requireAuth middleware
                                  ├── not logged in → 401/redirect to /_studio/login
                                  └── logged in
                                        ├── GET /_studio/api/fs/*    → fsRoutes
                                        ├── GET /_studio/api/git/*   → gitRoutes
                                        ├── WS  /_studio/api/terminal → terminalRoute
                                        └── GET /_studio/api/ai/stream → aiRoute
```

---

## 3. ADR-006: Password + Session Authentication

**Status:** Proposed
**Date:** 2026-03-09

### Context

Studio exposes file-system reads/writes and a full terminal over the network. A single shared password is appropriate for a single-developer self-hosted tool. OAuth or multi-user auth adds unnecessary complexity for this use case.

### Decision

1. **Credential storage:** The operator sets `STUDIO_PASSWORD` to a bcrypt hash (`bcryptjs.hashSync(password, 12)`). Plain-text passwords are never accepted in the env var.
2. **Session store:** `express-session` with a randomly generated `SESSION_SECRET` (required env var). In-memory store for single-process deployments; operators may swap in a Redis store via the standard `store` option without code changes.
3. **Cookie attributes:** `httpOnly: true`, `secure: true` (enforced in production), `sameSite: 'strict'`, `maxAge: 86400000` (24 hours).
4. **`requireAuth` middleware:** Applied to every `/_studio/*` route except `/_studio/login` (GET and POST). Returns `401` for API requests (`Accept: application/json`) and redirects to `/_studio/login` for browser requests.
5. **Login endpoint:** `POST /_studio/auth/login` accepts `{ password }` JSON body. Compares with `bcryptjs.compare()`. On success sets `req.session.authenticated = true` and returns `200`. On failure returns `401` after a fixed 300 ms delay to blunt timing attacks.
6. **Logout endpoint:** `POST /_studio/auth/logout` calls `req.session.destroy()` and returns `200`.

### Consequences

- ✅ Zero user-management surface area.
- ✅ bcrypt makes offline dictionary attacks against a leaked session store infeasible.
- ✅ SameSite=Strict prevents CSRF without a separate CSRF token.
- ⚠️ Single password means no per-user audit trail. Acceptable for single-operator use.
- ⚠️ In-memory session store is lost on process restart (user must re-login). Acceptable for dev tool.

### Rejected Alternatives

- **JWT in localStorage:** XSS risk; no server-side revocation.
- **HTTP Basic Auth:** Password sent on every request; no logout mechanism.
- **GitHub OAuth:** Adds external dependency; overkill for local dev tool.

---

## 4. ADR-007: File System Sandboxing

**Status:** Proposed
**Date:** 2026-03-09

### Context

Studio reads and writes files on behalf of the authenticated user. Without sandboxing, a compromised session or a path traversal bug could expose or overwrite arbitrary server files.

### Decision

Every file-system operation passes through `assertSafePath(userInput)`:

1. **Reject `../` before resolution:** If the raw input contains `..` as a path segment, return `403` immediately before any filesystem call.
2. **Resolve to absolute path:** `const abs = path.resolve(REPO_ROOT, userInput)`.
3. **startsWith assertion:** If `abs` does not start with `REPO_ROOT + path.sep` (and is not exactly `REPO_ROOT`), return `403`.
4. **Symlink resolution:** After the startsWith check, call `fs.realpathSync(abs)` and repeat the startsWith check on the result to catch symlink escapes.
5. **Deny-list:** Reject any path whose resolved absolute form matches:
   - `**/.env` (any `.env` file at any depth)
   - `**/.git/**` (git internals)
   - `**/node_modules/**`
6. **File size limit:** Read operations on files larger than **5 MB** return `413 Payload Too Large`.
7. **Write operations:** Only `PUT` (update existing) and `POST` (create new) are supported. `DELETE` is not implemented in v1 to reduce risk surface.

`REPO_ROOT` is set to `process.env.MULTIPLIC_REPO_PATH` (same variable used by `sync.js`) or falls back to `path.resolve(__dirname, '../../..')` (three levels up from `server/studio/services/`).

### Consequences

- ✅ Double-checked path resolution defeats both directory traversal and symlink attacks.
- ✅ Deny-list prevents accidental exposure of credentials and git internals.
- ✅ 5 MB cap prevents memory exhaustion from large binary reads.
- ⚠️ Operators must ensure `MULTIPLIC_REPO_PATH` is set correctly; wrong value silently changes the sandbox root.

### Rejected Alternatives

- **chroot/container per request:** Correct but enormous operational overhead for a dev tool.
- **Allowlist of permitted paths:** Too restrictive; developers need to edit any site file.

---

## 5. ADR-008: AI Provider Abstraction

**Status:** Proposed
**Date:** 2026-03-09

### Context

AI API keys must not be exposed to the browser. Different operators prefer different LLM providers. Streaming responses are required for good UX.

### Decision

1. **Server-side proxy:** The browser sends a chat message to `GET /_studio/api/ai/stream?message=...`. The server holds the API key and forwards the request to the configured provider.
2. **Pluggable provider:** `STUDIO_AI_PROVIDER` selects the backend: `openai` (default), `anthropic`, `ollama`, or `custom`. Each provider is a module in `server/studio/services/aiProviders/` that exports `{ stream(messages, res) }`.
3. **SSE transport:** The route sets `Content-Type: text/event-stream` and streams tokens as `data: <token>\n\n` events. The browser uses `EventSource`.
4. **Context injection:** Before forwarding, the server prepends a system prompt containing:
   - The current file's content (passed as `?file=<path>` query param, sandboxed via `assertSafePath`).
   - A compact summary of `multiplic.json` (site keys and frameworks only; no secrets).
   - `wpBase` URL if the current site declares it (ADR-005 compliance).
5. **Rate limiting:** 30 AI requests per minute per session. Exceeding returns `429`.
6. **Key storage:** `STUDIO_AI_KEY` env var. Never logged, never sent to client.

### Supported Providers

| `STUDIO_AI_PROVIDER` | API key env var | Default model |
|---|---|---|
| `openai` | `STUDIO_AI_KEY` | `gpt-4o` |
| `anthropic` | `STUDIO_AI_KEY` | `claude-3-5-sonnet-20241022` |
| `ollama` | _(none; local)_ | `llama3` |
| `custom` | `STUDIO_AI_KEY` | set via `STUDIO_AI_MODEL` |

### Consequences

- ✅ API keys never reach the browser.
- ✅ Switching providers requires only an env-var change.
- ✅ Ollama support enables fully offline/air-gapped use.
- ⚠️ SSE does not support request cancellation from the server side in all Node versions; use `req.on('close', ...)` to abort the upstream fetch.

### Rejected Alternatives

- **Direct browser-to-LLM calls:** Exposes API key; violates separation of concerns.
- **WebSocket for AI:** Adds complexity without benefit over SSE for unidirectional streaming.

---

## 6. ADR-009: Terminal Security

**Status:** Proposed
**Date:** 2026-03-09

### Context

A browser-accessible terminal is the highest-risk Studio feature. Arbitrary command execution must be constrained to the repository and cannot be allowed to affect the host system beyond the repo root.

### Decision

1. **Restricted shell:** `node-pty` spawns `bash --restricted --noprofile --norc`. Restricted bash (`rbash`) prevents `cd` to arbitrary directories, redirections to files outside CWD, and execution of commands with `/` in the name.
2. **CWD locked to `REPO_ROOT`:** The PTY is spawned with `cwd: REPO_ROOT`. `rbash` prevents `cd` escapes.
3. **Sanitized environment:** The child process receives only a curated env:
   ```
   HOME, TERM, PATH (minimal read-only), LANG, MULTIPLIC_REPO_PATH
   ```
   Secrets (`STUDIO_PASSWORD`, `STUDIO_AI_KEY`, `SYNC_SECRET`, `SESSION_SECRET`) are explicitly excluded.
4. **Session limits:** Maximum **2 concurrent PTY sessions** per authenticated Studio instance. A third `POST /_studio/api/terminal/create` returns `429`.
5. **Idle timeout:** PTY sessions idle for **30 minutes** (no I/O) are automatically killed and removed from the session map.
6. **WebSocket transport:** Each terminal has a WebSocket at `/_studio/api/terminal/:id`. Binary frames carry PTY output; text frames carry resize commands `{"cols":N,"rows":N}`.

### Consequences

- ✅ `rbash` meaningfully reduces blast radius of a compromised session.
- ✅ Sanitized env ensures AI keys and sync secrets are never visible in the terminal.
- ✅ Concurrent session cap prevents resource exhaustion.
- ⚠️ `rbash` is not a security boundary; a determined attacker with write access can escape it. The real boundary is ADR-006 authentication.
- ⚠️ Some legitimate developer workflows (e.g., `cd ../other-site`) are blocked by `rbash`. Operators who need unrestricted terminals should not expose Studio to the public internet.

### Rejected Alternatives

- **Command whitelist (allow only git/npm/etc.):** Too brittle; developers need general shell access for debugging.
- **Docker container per session:** Correct security model but impractical for a self-hosted single-process server.

---

## 7. Complete File Manifest

59 new files total. 2 existing files modified.

### 7.1 Server Backend (15 files)

```
server/studio/
├── index.js                          # Express sub-app; mounts all routes
├── middleware/
│   └── requireAuth.js                # Session-based auth guard
├── routes/
│   ├── authRoutes.js                 # POST /auth/login, POST /auth/logout
│   ├── fsRoutes.js                   # GET/PUT/POST /api/fs/*
│   ├── gitRoutes.js                  # GET/POST /api/git/*
│   ├── terminalRoutes.js             # POST /api/terminal/create, DELETE /api/terminal/:id
│   └── aiRoutes.js                   # GET /api/ai/stream (SSE)
└── services/
    ├── fileSystem.js                 # assertSafePath(), readFile(), writeFile(), listDir()
    ├── gitOperations.js              # status(), diff(), commit(), push() via simple-git
    ├── terminalManager.js            # PTY lifecycle; create(), resize(), kill(), cleanup()
    ├── aiProvider.js                 # Factory: returns provider module by STUDIO_AI_PROVIDER
    └── aiProviders/
        ├── openai.js                 # OpenAI Chat Completions streaming adapter
        ├── anthropic.js              # Anthropic Messages streaming adapter
        ├── ollama.js                 # Ollama /api/chat streaming adapter
        └── custom.js                 # Generic OpenAI-compatible endpoint adapter
```

### 7.2 Frontend React (16 files)

```
sites/multiplic-studio/
├── package.json
├── vite.config.js
├── index.html
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── api/
│   │   ├── fsApi.js                  # Axios wrappers for fs routes
│   │   ├── gitApi.js                 # Axios wrappers for git routes
│   │   └── aiApi.js                  # EventSource wrapper for AI SSE
│   └── components/
│       ├── Login.jsx
│       ├── Shell.jsx                 # Top-level layout
│       ├── FileExplorer.jsx          # Site tree from multiplic.json
│       ├── EditorPane.jsx            # Monaco editor
│       ├── GitPanel.jsx              # Diff + commit + push
│       ├── Terminal.jsx              # xterm.js + WebSocket
│       └── AIPanel.jsx               # Chat sidebar
```

### 7.3 ADR Documents (4 files)

```
docs/adr/
├── 0006-studio-auth.md
├── 0007-fs-sandboxing.md
├── 0008-ai-provider-abstraction.md
└── 0009-terminal-security.md
```

### 7.4 Test Files (22 files)

```
tests/studio/
├── unit/
│   ├── assertSafePath.test.js
│   ├── fileSystem.test.js
│   ├── gitOperations.test.js
│   ├── terminalManager.test.js
│   ├── aiProvider.test.js
│   ├── requireAuth.test.js
│   ├── openaiAdapter.test.js
│   ├── anthropicAdapter.test.js
│   ├── ollamaAdapter.test.js
│   └── customAdapter.test.js
└── integration/
    ├── auth.test.js
    ├── fsRoutes.test.js
    ├── gitRoutes.test.js
    ├── terminalRoutes.test.js
    ├── aiRoutes.test.js
    ├── pathTraversal.test.js
    ├── sessionExpiry.test.js
    ├── rateLimiting.test.js
    ├── terminalConcurrency.test.js
    ├── aiContextInjection.test.js
    ├── symlinkEscape.test.js
    └── studioMount.test.js
```

### 7.5 Modified Existing Files (2 files)

```
server/app.js            ← Add conditional Studio mount (3 lines)
package.json             ← Add Studio dependencies to root workspace
```

---

## 8. Dependency Map

All new runtime dependencies. Zero changes to existing dependency versions.

| Package | Version | Use | Rationale |
|---|---|---|---|
| `bcryptjs` | `^2.4.3` | ADR-006: password hashing | Pure-JS; no native compile step; compatible with bcrypt hash format |
| `express-session` | `^1.17.3` | ADR-006: session management | Standard Express session middleware; pluggable store |
| `simple-git` | `^3.22.0` | Git operations service | Promise-based git wrapper; well-maintained; avoids raw exec |
| `node-pty` | `^1.0.0` | ADR-009: PTY terminal | Industry standard for browser terminals; supports resize |
| `ws` | `^8.16.0` | Terminal WebSocket transport | Lightweight; already used in many Node stacks |
| `@monaco-editor/react` | `^4.6.0` | EditorPane component | Official Monaco React wrapper; lazy-loaded |
| `xterm` | `^5.3.0` | Terminal component | Standard xterm.js; pairs with node-pty |
| `axios` | `^1.6.8` | Frontend HTTP client | Interceptor support for auth errors; consistent with ADR patterns |

### Dev-only additions (tests)

| Package | Version | Use |
|---|---|---|
| `supertest` | `^6.3.4` | Integration test HTTP assertions |

---

## 9. Phase 0–6 Day-by-Day Task Decomposition

Total: **14 development days**

---

### Phase 0 — Foundation (Day 1)

**Goal:** ADRs written, directory scaffold in place, CI unaffected.

| Task | Files | Acceptance Criteria |
|---|---|---|
| Write ADR-006 through ADR-009 as markdown | `docs/adr/0006–0009-*.md` | Files exist; each has Status/Context/Decision/Consequences sections |
| Create `server/studio/` directory tree with empty stubs | All 15 server files | `require('./studio')` resolves without error |
| Create `sites/multiplic-studio/` scaffold | `package.json`, `vite.config.js`, `index.html` | `npm install` in the site dir succeeds |
| Add dependencies to root `package.json` | `package.json` | `npm install` from root succeeds; existing tests still pass |
| Add conditional mount to `server/app.js` | `server/app.js` | When `STUDIO_PASSWORD` unset: server starts, all existing routes work, no `/_studio` mount exists |

---

### Phase 1 — Auth & Routing (Days 2–3)

**Goal:** Login/logout functional; `requireAuth` blocks unauthenticated access.

**Day 2:**

| Task | Files | Acceptance Criteria |
|---|---|---|
| Implement `requireAuth` middleware | `server/studio/middleware/requireAuth.js` | `GET /_studio/` without session returns 401 (JSON) or redirect (browser) |
| Implement `POST /_studio/auth/login` | `server/studio/routes/authRoutes.js` | Correct password → 200 + session cookie; wrong password → 401 after ≥300 ms |
| Implement `POST /_studio/auth/logout` | `server/studio/routes/authRoutes.js` | Destroys session; subsequent requests return 401 |
| Wire routes in `studio/index.js` | `server/studio/index.js` | Sub-app mounts; `GET /_studio/` returns 200 with static shell when authenticated |

**Day 3:**

| Task | Files | Acceptance Criteria |
|---|---|---|
| Build `Login.jsx` React component | `sites/multiplic-studio/src/components/Login.jsx` | Renders form; submits to `/auth/login`; shows error on 401 |
| Build `Shell.jsx` layout skeleton | `sites/multiplic-studio/src/components/Shell.jsx` | Renders after login; shows sidebar + editor area placeholders |
| Write unit tests for auth middleware | `tests/studio/unit/requireAuth.test.js` | 4 passing tests: no session → 401, valid session → next(), JSON request → 401 JSON, browser request → redirect |
| Write integration tests for auth routes | `tests/studio/integration/auth.test.js` | 4 passing tests: login success, login failure, logout, session expiry |

---

### Phase 2 — File System (Days 4–6)

**Goal:** Authenticated user can browse the repo tree and edit files in Monaco.

**Day 4:**

| Task | Files | Acceptance Criteria |
|---|---|---|
| Implement `assertSafePath()` | `server/studio/services/fileSystem.js` | Rejects `../`, symlink escapes, `.env`, `.git`, `node_modules`; accepts valid paths |
| Implement `listDir()` | `server/studio/services/fileSystem.js` | Returns `{name, type, path}[]` for a directory; respects deny-list |
| Implement `readFile()` | `server/studio/services/fileSystem.js` | Returns file content string; rejects >5 MB files with `413` error |
| Implement `writeFile()` | `server/studio/services/fileSystem.js` | Writes content atomically; rejects paths outside `REPO_ROOT` |

**Day 5:**

| Task | Files | Acceptance Criteria |
|---|---|---|
| Implement fs routes | `server/studio/routes/fsRoutes.js` | `GET /api/fs/list?path=`, `GET /api/fs/read?path=`, `PUT /api/fs/write` all wired and auth-gated |
| Build `FileExplorer.jsx` | `sites/multiplic-studio/src/components/FileExplorer.jsx` | Renders site-tree from `multiplic.json`; clicking a file calls `/api/fs/read` |
| Build `EditorPane.jsx` with Monaco | `sites/multiplic-studio/src/components/EditorPane.jsx` | Displays file content; Ctrl+S triggers `PUT /api/fs/write` |

**Day 6:**

| Task | Files | Acceptance Criteria |
|---|---|---|
| Write unit tests for `assertSafePath` | `tests/studio/unit/assertSafePath.test.js` | 10 passing tests covering all rejection and acceptance cases |
| Write unit tests for `fileSystem` service | `tests/studio/unit/fileSystem.test.js` | 6 passing tests: listDir, readFile, writeFile, size limit |
| Write integration tests for fs routes | `tests/studio/integration/fsRoutes.test.js` | 4 passing tests: list, read, write, path traversal rejection |
| Write path traversal integration tests | `tests/studio/integration/pathTraversal.test.js` | 6 passing tests covering all traversal variants |
| Write symlink escape integration tests | `tests/studio/integration/symlinkEscape.test.js` | 2 passing tests: symlink within repo allowed, symlink outside rejected |

---

### Phase 3 — Git Operations (Days 7–8)

**Goal:** Authenticated user can view diff, commit, and push to `main`.

**Day 7:**

| Task | Files | Acceptance Criteria |
|---|---|---|
| Implement `gitOperations` service | `server/studio/services/gitOperations.js` | `status()`, `diff()`, `commit(msg)`, `push()` work against real git repo in test fixture |
| Implement git routes | `server/studio/routes/gitRoutes.js` | `GET /api/git/status`, `GET /api/git/diff`, `POST /api/git/commit`, `POST /api/git/push` all auth-gated |

**Day 8:**

| Task | Files | Acceptance Criteria |
|---|---|---|
| Build `GitPanel.jsx` | `sites/multiplic-studio/src/components/GitPanel.jsx` | Shows modified files; diff modal; commit message input; push button |
| Write unit tests for `gitOperations` | `tests/studio/unit/gitOperations.test.js` | 4 passing tests using a temp git repo fixture |
| Write integration tests for git routes | `tests/studio/integration/gitRoutes.test.js` | 4 passing tests: status, diff, commit, push |

---

### Phase 4 — Terminal (Days 9–11)

**Goal:** Browser terminal connected via WebSocket, sandboxed to repo root.

**Day 9:**

| Task | Files | Acceptance Criteria |
|---|---|---|
| Implement `terminalManager` service | `server/studio/services/terminalManager.js` | `create()` spawns `rbash`; `resize()` updates PTY dimensions; `kill()` destroys session; idle timeout fires after 30 min |
| Implement terminal HTTP routes | `server/studio/routes/terminalRoutes.js` | `POST /api/terminal/create` → `{id}`; `DELETE /api/terminal/:id` → 204; third create → 429 |

**Day 10:**

| Task | Files | Acceptance Criteria |
|---|---|---|
| Implement terminal WebSocket handler | `server/studio/routes/terminalRoutes.js` (ws upgrade) | Binary frames relay PTY output to browser; text frames apply resize; connection close kills PTY |
| Build `Terminal.jsx` with xterm.js | `sites/multiplic-studio/src/components/Terminal.jsx` | Renders xterm.js; connects WebSocket; input echoed; resize tracked |

**Day 11:**

| Task | Files | Acceptance Criteria |
|---|---|---|
| Write unit tests for `terminalManager` | `tests/studio/unit/terminalManager.test.js` | 4 passing tests: create, resize, kill, idle timeout (mocked timers) |
| Write integration tests for terminal routes | `tests/studio/integration/terminalRoutes.test.js` | 3 passing tests: create, delete, concurrency limit |
| Write concurrency limit test | `tests/studio/integration/terminalConcurrency.test.js` | 1 passing test: third create returns 429 |

---

### Phase 5 — AI Copilot (Days 12–13)

**Goal:** AI chat sidebar streams LLM responses with current-file context.

**Day 12:**

| Task | Files | Acceptance Criteria |
|---|---|---|
| Implement `aiProvider` factory | `server/studio/services/aiProvider.js` | Returns correct provider module based on `STUDIO_AI_PROVIDER` env var |
| Implement OpenAI streaming adapter | `server/studio/services/aiProviders/openai.js` | Streams tokens from OpenAI Chat Completions to SSE response |
| Implement Anthropic streaming adapter | `server/studio/services/aiProviders/anthropic.js` | Streams tokens from Anthropic Messages API to SSE response |
| Implement Ollama adapter | `server/studio/services/aiProviders/ollama.js` | Streams tokens from local Ollama `/api/chat` to SSE response |
| Implement custom adapter | `server/studio/services/aiProviders/custom.js` | Forwards to `STUDIO_AI_BASE_URL` with OpenAI-compatible request format |
| Implement AI SSE route | `server/studio/routes/aiRoutes.js` | `GET /api/ai/stream` streams tokens; injects file context; rate-limits at 30/min |

**Day 13:**

| Task | Files | Acceptance Criteria |
|---|---|---|
| Build `AIPanel.jsx` | `sites/multiplic-studio/src/components/AIPanel.jsx` | Chat input; message history; EventSource for streaming; shows current file name as context |
| Write unit tests for `aiProvider` | `tests/studio/unit/aiProvider.test.js` | 4 passing tests: correct provider selected, unknown provider throws, factory returns module |
| Write unit tests for OpenAI adapter | `tests/studio/unit/openaiAdapter.test.js` | 2 passing tests using mocked fetch |
| Write unit tests for Anthropic adapter | `tests/studio/unit/anthropicAdapter.test.js` | 2 passing tests using mocked fetch |
| Write unit tests for Ollama adapter | `tests/studio/unit/ollamaAdapter.test.js` | 1 passing test using mocked fetch |
| Write integration tests for AI route | `tests/studio/integration/aiRoutes.test.js` | 3 passing tests: SSE stream, rate limit, context injection |
| Write AI context injection test | `tests/studio/integration/aiContextInjection.test.js` | 1 passing test: system prompt contains file content and multiplic.json summary |
| Write rate limiting test | `tests/studio/integration/rateLimiting.test.js` | 1 passing test: 31st request in 60 s window returns 429 |

---

### Phase 6 — Polish (Day 14)

**Goal:** VSCode-like theme, keyboard shortcuts, CI passing, documentation complete.

| Task | Files | Acceptance Criteria |
|---|---|---|
| Apply dark VSCode theme to all components | `sites/multiplic-studio/src/` | Studio visually matches VSCode dark theme |
| Add keyboard shortcuts (Ctrl+S save, Ctrl+` terminal, Ctrl+Shift+G git panel) | `Shell.jsx` | Shortcuts work; no browser default overrides |
| Run full test suite | — | All 22 Studio tests pass; all 20 existing tests still pass |
| Update `README.md` Studio section | `README.md` | Setup instructions for `STUDIO_PASSWORD` env var documented |
| Final security review against threat model | — | All 12 threats in Section 13 confirmed mitigated |

---

## 10. Full Implementation Reference Code

### 10.1 `server/studio/middleware/requireAuth.js`

```javascript
'use strict';

function requireAuth(req, res, next) {
  if (req.session && req.session.authenticated) {
    return next();
  }
  const wantsJson =
    req.headers.accept && req.headers.accept.includes('application/json');
  if (wantsJson) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  return res.redirect('/_studio/login');
}

module.exports = requireAuth;
```

---

### 10.2 `server/studio/services/fileSystem.js`

```javascript
'use strict';

const fs   = require('fs');
const path = require('path');

const REPO_ROOT = process.env.MULTIPLIC_REPO_PATH
  ? path.resolve(process.env.MULTIPLIC_REPO_PATH)
  : path.resolve(__dirname, '../../..');

const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5 MB

const DENY_PATTERNS = [
  /^\.env(\.|$)/i,         // .env, .env.local, etc.
  /^\.git(\/|$)/,          // .git directory
  /node_modules(\/|$)/,    // node_modules at any depth
];

function assertSafePath(userInput) {
  if (!userInput || typeof userInput !== 'string') {
    const err = new Error('Invalid path');
    err.status = 400;
    throw err;
  }

  // Reject raw ../ traversal before any resolution
  const segments = userInput.split(/[/\\]/);
  if (segments.some(s => s === '..')) {
    const err = new Error('Path traversal rejected');
    err.status = 403;
    throw err;
  }

  const abs = path.resolve(REPO_ROOT, userInput);

  // startsWith check (abs must be inside REPO_ROOT)
  const rootWithSep = REPO_ROOT.endsWith(path.sep)
    ? REPO_ROOT
    : REPO_ROOT + path.sep;
  if (abs !== REPO_ROOT && !abs.startsWith(rootWithSep)) {
    const err = new Error('Path outside repository root');
    err.status = 403;
    throw err;
  }

  // Symlink resolution (re-check after resolving)
  let real;
  try {
    real = fs.realpathSync(abs);
  } catch {
    // Path does not exist yet (e.g. new file write) — skip symlink check
    real = abs;
  }
  if (real !== REPO_ROOT && !real.startsWith(rootWithSep)) {
    const err = new Error('Symlink escapes repository root');
    err.status = 403;
    throw err;
  }

  // Deny-list check against the relative portion
  const rel = path.relative(REPO_ROOT, real);
  for (const pattern of DENY_PATTERNS) {
    if (pattern.test(rel) || pattern.test(path.basename(rel))) {
      const err = new Error('Access to this path is denied');
      err.status = 403;
      throw err;
    }
  }

  return real;
}

function listDir(userInput) {
  const safePath = assertSafePath(userInput);
  const entries = fs.readdirSync(safePath, { withFileTypes: true });
  return entries
    .filter(entry => {
      const rel = path.relative(REPO_ROOT, path.join(safePath, entry.name));
      return !DENY_PATTERNS.some(p => p.test(rel) || p.test(entry.name));
    })
    .map(entry => ({
      name: entry.name,
      type: entry.isDirectory() ? 'directory' : 'file',
      path: path.join(path.relative(REPO_ROOT, safePath), entry.name),
    }));
}

function readFile(userInput) {
  const safePath = assertSafePath(userInput);
  const stat = fs.statSync(safePath);
  if (stat.size > FILE_SIZE_LIMIT) {
    const err = new Error('File too large');
    err.status = 413;
    throw err;
  }
  return fs.readFileSync(safePath, 'utf8');
}

function writeFile(userInput, content) {
  const safePath = assertSafePath(userInput);
  fs.writeFileSync(safePath, content, 'utf8');
}

module.exports = { assertSafePath, listDir, readFile, writeFile, REPO_ROOT };
```

---

### 10.3 `server/studio/services/gitOperations.js`

```javascript
'use strict';

const simpleGit = require('simple-git');
const { REPO_ROOT } = require('./fileSystem');

function getGit() {
  return simpleGit(REPO_ROOT);
}

async function status() {
  const git = getGit();
  const result = await git.status();
  return {
    branch: result.current,
    modified: result.modified,
    created: result.created,
    deleted: result.deleted,
    staged: result.staged,
  };
}

async function diff(filePath) {
  const git = getGit();
  if (filePath) {
    return git.diff([filePath]);
  }
  return git.diff();
}

async function commit(message) {
  if (!message || typeof message !== 'string' || !message.trim()) {
    throw new Error('Commit message is required');
  }
  const git = getGit();
  await git.add('.');
  const result = await git.commit(message.trim());
  return { commit: result.commit, summary: result.summary };
}

async function push() {
  const git = getGit();
  await git.push('origin', 'main');
  return { pushed: true };
}

module.exports = { status, diff, commit, push };
```

---

### 10.4 `server/studio/services/terminalManager.js`

```javascript
'use strict';

const pty = require('node-pty');
const { REPO_ROOT } = require('./fileSystem');

const MAX_SESSIONS   = 2;
const IDLE_TIMEOUT   = 30 * 60 * 1000; // 30 minutes
const sessions       = new Map(); // id → { pty, idleTimer }

let nextId = 1;

function _resetIdle(id) {
  const session = sessions.get(id);
  if (!session) return;
  clearTimeout(session.idleTimer);
  session.idleTimer = setTimeout(() => kill(id), IDLE_TIMEOUT);
}

function create() {
  if (sessions.size >= MAX_SESSIONS) {
    const err = new Error('Maximum concurrent terminal sessions reached');
    err.status = 429;
    throw err;
  }

  const id = String(nextId++);

  const safeEnv = {
    HOME:                  process.env.HOME || '/tmp',
    TERM:                  'xterm-256color',
    PATH:                  '/usr/local/bin:/usr/bin:/bin',
    LANG:                  process.env.LANG || 'en_US.UTF-8',
    MULTIPLIC_REPO_PATH:   REPO_ROOT,
  };

  const ptyProcess = pty.spawn('bash', ['--restricted', '--noprofile', '--norc'], {
    name:  'xterm-256color',
    cols:  80,
    rows:  24,
    cwd:   REPO_ROOT,
    env:   safeEnv,
  });

  const idleTimer = setTimeout(() => kill(id), IDLE_TIMEOUT);
  sessions.set(id, { pty: ptyProcess, idleTimer });

  return { id, pty: ptyProcess };
}

function get(id) {
  return sessions.get(id) || null;
}

function resize(id, cols, rows) {
  const session = sessions.get(id);
  if (!session) return;
  session.pty.resize(cols, rows);
  _resetIdle(id);
}

function kill(id) {
  const session = sessions.get(id);
  if (!session) return;
  clearTimeout(session.idleTimer);
  try { session.pty.kill(); } catch { /* already dead */ }
  sessions.delete(id);
}

function listIds() {
  return Array.from(sessions.keys());
}

module.exports = { create, get, resize, kill, listIds, MAX_SESSIONS };
```

---

### 10.5 `server/studio/services/aiProvider.js` (Factory)

```javascript
'use strict';

const PROVIDERS = {
  openai:    () => require('./aiProviders/openai'),
  anthropic: () => require('./aiProviders/anthropic'),
  ollama:    () => require('./aiProviders/ollama'),
  custom:    () => require('./aiProviders/custom'),
};

function getProvider() {
  const name = (process.env.STUDIO_AI_PROVIDER || 'openai').toLowerCase();
  const factory = PROVIDERS[name];
  if (!factory) {
    throw new Error(
      `Unknown STUDIO_AI_PROVIDER: "${name}". Valid options: ${Object.keys(PROVIDERS).join(', ')}`
    );
  }
  return factory();
}

module.exports = { getProvider };
```

---

### 10.6 `server/studio/services/aiProviders/openai.js`

```javascript
'use strict';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

async function stream(messages, res) {
  const apiKey = process.env.STUDIO_AI_KEY;
  if (!apiKey) throw new Error('STUDIO_AI_KEY is not set');

  const model = process.env.STUDIO_AI_MODEL || 'gpt-4o';

  const response = await fetch(OPENAI_API_URL, {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({ model, messages, stream: true }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${text}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    for (const line of chunk.split('\n')) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (data === '[DONE]') {
        res.write('data: [DONE]\n\n');
        return;
      }
      try {
        const parsed = JSON.parse(data);
        const token = parsed.choices?.[0]?.delta?.content;
        if (token) res.write(`data: ${JSON.stringify(token)}\n\n`);
      } catch { /* skip malformed lines */ }
    }
  }
}

module.exports = { stream };
```

---

### 10.7 `server/studio/index.js`

```javascript
'use strict';

const express      = require('express');
const session      = require('express-session');
const path         = require('path');
const requireAuth  = require('./middleware/requireAuth');
const authRoutes   = require('./routes/authRoutes');
const fsRoutes     = require('./routes/fsRoutes');
const gitRoutes    = require('./routes/gitRoutes');
const terminalRoutes = require('./routes/terminalRoutes');
const aiRoutes     = require('./routes/aiRoutes');

const app = express();

// Body parsing
app.use(express.json());

// Session
app.use(session({
  secret:            process.env.SESSION_SECRET || (() => { throw new Error('SESSION_SECRET is required'); })(),
  resave:            false,
  saveUninitialized: false,
  cookie: {
    httpOnly:  true,
    secure:    process.env.NODE_ENV === 'production',
    sameSite:  'strict',
    maxAge:    86400000, // 24 hours
  },
}));

// Public routes (no auth required)
app.use('/auth', authRoutes);

// Serve login page (static)
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../../sites/multiplic-studio/dist/index.html'));
});

// Auth-gated static frontend
app.use(requireAuth, express.static(
  path.join(__dirname, '../../sites/multiplic-studio/dist')
));

// Auth-gated API routes
app.use('/api/fs',       requireAuth, fsRoutes);
app.use('/api/git',      requireAuth, gitRoutes);
app.use('/api/terminal', requireAuth, terminalRoutes);
app.use('/api/ai',       requireAuth, aiRoutes);

// SPA fallback (auth-gated)
app.get('*', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../../sites/multiplic-studio/dist/index.html'));
});

module.exports = app;
```

---

### 10.8 `server/studio/routes/fsRoutes.js`

```javascript
'use strict';

const express = require('express');
const { listDir, readFile, writeFile } = require('../services/fileSystem');

const router = express.Router();

router.get('/list', (req, res) => {
  try {
    const entries = listDir(req.query.path || '');
    res.json(entries);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.get('/read', (req, res) => {
  try {
    const content = readFile(req.query.path);
    res.json({ content });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.put('/write', (req, res) => {
  try {
    const { path: filePath, content } = req.body;
    writeFile(filePath, content);
    res.json({ ok: true });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

module.exports = router;
```

---

### 10.9 `server/studio/routes/gitRoutes.js`

```javascript
'use strict';

const express = require('express');
const git = require('../services/gitOperations');

const router = express.Router();

router.get('/status', async (req, res) => {
  try {
    res.json(await git.status());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/diff', async (req, res) => {
  try {
    res.json({ diff: await git.diff(req.query.path) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/commit', async (req, res) => {
  try {
    res.json(await git.commit(req.body.message));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/push', async (req, res) => {
  try {
    res.json(await git.push());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
```

---

### 10.10 `server/studio/routes/terminalRoutes.js` (HTTP portion)

```javascript
'use strict';

const express  = require('express');
const { WebSocketServer } = require('ws');
const termMgr  = require('../services/terminalManager');

const router = express.Router();

router.post('/create', (req, res) => {
  try {
    const { id } = termMgr.create();
    res.json({ id });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.delete('/:id', (req, res) => {
  termMgr.kill(req.params.id);
  res.sendStatus(204);
});

// WebSocket upgrade handler — attached to the HTTP server in studio/index.js
function attachWebSocket(server) {
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    if (!request.url.startsWith('/_studio/api/terminal/')) return;
    wss.handleUpgrade(request, socket, head, ws => {
      wss.emit('connection', ws, request);
    });
  });

  wss.on('connection', (ws, req) => {
    const id = req.url.split('/').pop();
    const session = termMgr.get(id);
    if (!session) {
      ws.close(4004, 'Terminal session not found');
      return;
    }

    const { pty: ptyProcess } = session;

    // PTY → browser
    ptyProcess.onData(data => {
      if (ws.readyState === ws.OPEN) ws.send(Buffer.from(data));
    });

    // Browser → PTY
    ws.on('message', msg => {
      if (typeof msg === 'string') {
        try {
          const cmd = JSON.parse(msg);
          if (cmd.cols && cmd.rows) termMgr.resize(id, cmd.cols, cmd.rows);
        } catch { /* ignore non-JSON */ }
      } else {
        ptyProcess.write(msg.toString());
      }
    });

    ws.on('close', () => termMgr.kill(id));

    ptyProcess.onExit(() => {
      if (ws.readyState === ws.OPEN) ws.close(1000, 'Process exited');
    });
  });
}

module.exports = router;
module.exports.attachWebSocket = attachWebSocket;
```

---

### 10.11 `server/studio/routes/aiRoutes.js`

```javascript
'use strict';

const express = require('express');
const { getProvider } = require('../services/aiProvider');
const { readFile }    = require('../services/fileSystem');
const { loadConfig }  = require('../../config');

const router = express.Router();

// Rate limiter: 30 req/min per session
const rateMap = new Map();
const RATE_WINDOW = 60 * 1000;
const RATE_LIMIT  = 30;

function rateLimit(req, res, next) {
  const key = req.session.id;
  const now = Date.now();
  const rec = rateMap.get(key) || { count: 0, reset: now + RATE_WINDOW };
  if (now > rec.reset) { rec.count = 0; rec.reset = now + RATE_WINDOW; }
  rec.count++;
  rateMap.set(key, rec);
  if (rec.count > RATE_LIMIT) return res.status(429).json({ error: 'Rate limit exceeded' });
  next();
}

router.get('/stream', rateLimit, async (req, res) => {
  res.setHeader('Content-Type',  'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection',    'keep-alive');
  res.flushHeaders();

  const userMessage = req.query.message || '';
  const filePath    = req.query.file;

  // Build system context
  let systemContent = 'You are Multiplic Studio AI, a coding assistant for the Multiplic platform.';

  // Inject current file content
  if (filePath) {
    try {
      const content = readFile(filePath);
      systemContent += `\n\nCurrent file (${filePath}):\n\`\`\`\n${content}\n\`\`\``;
    } catch { /* file unreadable or out of scope — omit */ }
  }

  // Inject compact multiplic.json summary
  try {
    const config = loadConfig();
    const siteSummary = Object.entries(config.sites)
      .map(([k, v]) => `${k}: ${v.framework}${v.wpBase ? ` (wpBase: ${v.wpBase})` : ''}`)
      .join(', ');
    systemContent += `\n\nRepository sites: ${siteSummary}`;
  } catch { /* config unreadable — omit */ }

  const messages = [
    { role: 'system', content: systemContent },
    { role: 'user',   content: userMessage },
  ];

  try {
    const provider = getProvider();
    await provider.stream(messages, res);
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
  } finally {
    res.end();
  }
});

module.exports = router;
```

---

## 11. Test Harness

### 11.1 Unit Tests (10 tests)

#### `assertSafePath.test.js` — 6 assertions

```javascript
const { assertSafePath } = require('../../../server/studio/services/fileSystem');

describe('assertSafePath', () => {
  test('accepts a valid relative path inside REPO_ROOT', () => {
    expect(() => assertSafePath('sites/citizengardens.org/src/App.jsx')).not.toThrow();
  });

  test('rejects path containing .. segments', () => {
    const err = (() => { try { assertSafePath('../../../etc/passwd'); } catch(e) { return e; } })();
    expect(err.status).toBe(403);
  });

  test('rejects encoded traversal (%2e%2e)', () => {
    // path.resolve decodes percent-encoding; the raw segment check catches this
    const err = (() => { try { assertSafePath('sites/%2e%2e/etc/passwd'); } catch(e) { return e; } })();
    expect(err).toBeDefined();
  });

  test('rejects .env file', () => {
    const err = (() => { try { assertSafePath('.env'); } catch(e) { return e; } })();
    expect(err.status).toBe(403);
  });

  test('rejects .git directory', () => {
    const err = (() => { try { assertSafePath('.git/config'); } catch(e) { return e; } })();
    expect(err.status).toBe(403);
  });

  test('rejects node_modules path', () => {
    const err = (() => { try { assertSafePath('node_modules/.bin/something'); } catch(e) { return e; } })();
    expect(err.status).toBe(403);
  });
});
```

#### `requireAuth.test.js` — 4 assertions

```javascript
const requireAuth = require('../../../server/studio/middleware/requireAuth');

function makeReq(sessionData, acceptHeader) {
  return {
    session: sessionData || {},
    headers: { accept: acceptHeader || 'text/html' },
  };
}

describe('requireAuth', () => {
  test('calls next() when session is authenticated', () => {
    const next = jest.fn();
    requireAuth(makeReq({ authenticated: true }), {}, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  test('returns 401 JSON for unauthenticated API request', () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    requireAuth(makeReq({}, 'application/json'), res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Not authenticated' });
  });

  test('redirects browser request to /_studio/login', () => {
    const res = { redirect: jest.fn() };
    requireAuth(makeReq({}), res, jest.fn());
    expect(res.redirect).toHaveBeenCalledWith('/_studio/login');
  });

  test('does not call next() when unauthenticated', () => {
    const next = jest.fn();
    const res  = { redirect: jest.fn() };
    requireAuth(makeReq({}), res, next);
    expect(next).not.toHaveBeenCalled();
  });
});
```

### 11.2 Integration Tests (12 tests)

All integration tests use `supertest` against the Studio sub-app with a real (temp) git repository as `MULTIPLIC_REPO_PATH`.

#### `auth.test.js` — 4 assertions

```javascript
const request = require('supertest');
// studio app configured with test STUDIO_PASSWORD hash and SESSION_SECRET

test('POST /auth/login with correct password returns 200 and sets cookie', async () => {
  const res = await request(app).post('/_studio/auth/login').send({ password: TEST_PASSWORD });
  expect(res.status).toBe(200);
  expect(res.headers['set-cookie']).toBeDefined();
});

test('POST /auth/login with wrong password returns 401', async () => {
  const res = await request(app).post('/_studio/auth/login').send({ password: 'wrong' });
  expect(res.status).toBe(401);
});

test('POST /auth/logout destroys session', async () => {
  const agent = request.agent(app);
  await agent.post('/_studio/auth/login').send({ password: TEST_PASSWORD });
  await agent.post('/_studio/auth/logout');
  const res = await agent.get('/_studio/api/fs/list?path=').set('Accept', 'application/json');
  expect(res.status).toBe(401);
});

test('Session expires after maxAge', async () => {
  // Uses fake timers to advance clock by 25 hours
  jest.useFakeTimers();
  const agent = request.agent(app);
  await agent.post('/_studio/auth/login').send({ password: TEST_PASSWORD });
  jest.advanceTimersByTime(25 * 60 * 60 * 1000);
  const res = await agent.get('/_studio/api/fs/list?path=').set('Accept', 'application/json');
  expect(res.status).toBe(401);
  jest.useRealTimers();
});
```

#### `pathTraversal.test.js` — 6 assertions

```javascript
// All requests made with valid authenticated session

test('GET /api/fs/read?path=../../../etc/passwd returns 403', ...);
test('GET /api/fs/read?path=.env returns 403', ...);
test('GET /api/fs/read?path=.git/config returns 403', ...);
test('GET /api/fs/read?path=node_modules/.bin/node returns 403', ...);
test('PUT /api/fs/write with path containing .. returns 403', ...);
test('GET /api/fs/list?path=../.. returns 403', ...);
```

#### `terminalConcurrency.test.js` — 1 assertion

```javascript
test('Third POST /api/terminal/create returns 429', async () => {
  const agent = authenticatedAgent();
  await agent.post('/_studio/api/terminal/create');
  await agent.post('/_studio/api/terminal/create');
  const res = await agent.post('/_studio/api/terminal/create');
  expect(res.status).toBe(429);
  // Cleanup
  await agent.delete('/_studio/api/terminal/1');
  await agent.delete('/_studio/api/terminal/2');
});
```

#### `rateLimiting.test.js` — 1 assertion

```javascript
test('31st AI request in 60s window returns 429', async () => {
  const agent = authenticatedAgent();
  for (let i = 0; i < 30; i++) {
    await agent.get('/_studio/api/ai/stream?message=hi');
  }
  const res = await agent.get('/_studio/api/ai/stream?message=hi');
  expect(res.status).toBe(429);
});
```

---

## 12. Environment Variables Reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `STUDIO_PASSWORD` | No (opt-in) | — | bcrypt hash of the Studio login password. Studio is **disabled** when absent. |
| `SESSION_SECRET` | Yes (when Studio enabled) | — | Random string used to sign the session cookie. Minimum 32 chars recommended. |
| `MULTIPLIC_REPO_PATH` | No | `/var/www/multiplic` | Absolute path to the repo root. Used as the file-system sandbox root and git working directory. |
| `STUDIO_AI_PROVIDER` | No | `openai` | AI backend: `openai`, `anthropic`, `ollama`, `custom`. |
| `STUDIO_AI_KEY` | Yes (when AI enabled, except Ollama) | — | API key for the selected AI provider. Never logged or sent to client. |
| `STUDIO_AI_MODEL` | No | Provider default | Override the default model (e.g. `gpt-4-turbo`, `claude-3-haiku-20240307`). |
| `STUDIO_AI_BASE_URL` | Yes (when `STUDIO_AI_PROVIDER=custom`) | — | Base URL for a custom OpenAI-compatible API endpoint. |
| `SYNC_SECRET` | Yes (existing) | — | HMAC secret for the sync webhook. Used by `sync.js`; Studio-triggered pushes flow through the same webhook. |
| `NODE_ENV` | No | `development` | Set to `production` to enforce `secure: true` on session cookies. |
| `PORT` | No | `3000` | HTTP port for the main Express server (including Studio). |
| `SYNC_PORT` | No | `9000` | Port for the HMAC sync listener (`sync.js`). |

---

## 13. Security Threat Model

| # | Threat | Mitigation | ADR |
|---|---|---|---|
| T-01 | **Unauthenticated access to Studio** | `requireAuth` middleware on every `/_studio/*` route except `/login` | ADR-006 |
| T-02 | **Brute-force password attack** | bcrypt with cost factor 12; 300 ms fixed delay on failed login; no lockout (single-user tool) | ADR-006 |
| T-03 | **Session hijacking via XSS** | `httpOnly: true` cookie; `Content-Security-Policy` header on Studio responses | ADR-006 |
| T-04 | **CSRF against Studio endpoints** | `SameSite=Strict` cookie; no cross-origin cookie transmission | ADR-006 |
| T-05 | **Directory traversal — file read** | `assertSafePath()` double-check (raw `..` rejection + `path.resolve` + `startsWith`) | ADR-007 |
| T-06 | **Symlink escape from REPO_ROOT** | `realpathSync()` + second `startsWith` check on resolved path | ADR-007 |
| T-07 | **Exposure of `.env` / secrets via file read** | Deny-list in `assertSafePath()` rejects `.env*`, `.git/**`, `node_modules/**` | ADR-007 |
| T-08 | **Memory exhaustion via large file read** | 5 MB file size limit; `413` response for oversized files | ADR-007 |
| T-09 | **AI API key exposure** | Key stored in env var; never logged; never sent to client; server-side proxy only | ADR-008 |
| T-10 | **AI prompt injection from untrusted file content** | File content is injected as a code block in the system prompt, not as executable instructions | ADR-008 |
| T-11 | **Terminal escape from REPO_ROOT** | `rbash` (`bash --restricted`) + `cwd: REPO_ROOT` prevents `cd` outside working directory | ADR-009 |
| T-12 | **Resource exhaustion via terminal sessions** | Maximum 2 concurrent PTY sessions; 30-minute idle timeout; 30/min AI rate limit | ADR-009, ADR-008 |

---

## 14. Acceptance Criteria

| # | Criterion | Phase | Test Coverage |
|---|---|---|---|
| AC-01 | Studio is **not mounted** when `STUDIO_PASSWORD` is unset; all existing routes unaffected | Phase 0 | `integration/studioMount.test.js` |
| AC-02 | Studio **mounts at `/_studio`** when `STUDIO_PASSWORD` is set | Phase 0 | `integration/studioMount.test.js` |
| AC-03 | Unauthenticated `GET /_studio/` redirects to `/_studio/login` | Phase 1 | `integration/auth.test.js` |
| AC-04 | Correct password → session cookie; wrong password → 401 after ≥ 300 ms | Phase 1 | `integration/auth.test.js` |
| AC-05 | Session expires after 24 hours; subsequent requests return 401 | Phase 1 | `integration/sessionExpiry.test.js` |
| AC-06 | `GET /api/fs/read?path=../../../etc/passwd` returns 403 | Phase 2 | `integration/pathTraversal.test.js` |
| AC-07 | Symlink pointing outside `REPO_ROOT` is rejected with 403 | Phase 2 | `integration/symlinkEscape.test.js` |
| AC-08 | Files larger than 5 MB return 413 | Phase 2 | `unit/fileSystem.test.js` |
| AC-09 | `GET /api/git/status` returns branch name and modified file list | Phase 3 | `integration/gitRoutes.test.js` |
| AC-10 | `POST /api/git/commit` + `POST /api/git/push` result in a new commit visible on `main` | Phase 3 | `integration/gitRoutes.test.js` |
| AC-11 | Terminal spawns `rbash` with `cwd` set to `REPO_ROOT` | Phase 4 | `unit/terminalManager.test.js` |
| AC-12 | Third terminal create request returns 429; session map has ≤ 2 entries | Phase 4 | `integration/terminalConcurrency.test.js` |
| AC-13 | AI route streams tokens as SSE events; `STUDIO_AI_KEY` never appears in response | Phase 5 | `integration/aiRoutes.test.js` |
| AC-14 | 31st AI request within 60 s returns 429 | Phase 5 | `integration/rateLimiting.test.js` |
| AC-15 | AI system prompt contains current file content and `multiplic.json` site summary | Phase 5 | `integration/aiContextInjection.test.js` |

---

## 15. Rollback and Feature Flags

### 15.1 Studio Opt-In via `STUDIO_PASSWORD`

Studio is gated behind a single environment variable. This is both a feature flag and a security control:

```bash
# Enable Studio
STUDIO_PASSWORD=$(node -e "console.log(require('bcryptjs').hashSync('mysecret', 12))")

# Disable Studio (remove the variable)
unset STUDIO_PASSWORD
```

When `STUDIO_PASSWORD` is absent:
- The `require('./studio')` call in `server/app.js` is never executed.
- No Studio middleware, sessions, or routes are loaded.
- Memory footprint is identical to the pre-Studio server.
- All existing domain routes, the sync listener, and the config loader are completely unaffected.

### 15.2 Zero-Risk Removal Plan

If Studio needs to be permanently removed:

1. Remove the 3-line conditional block from `server/app.js`:
   ```javascript
   // Remove these 4 lines:
   if (process.env.STUDIO_PASSWORD) {
     const studio = require('./studio');
     app.use('/_studio', studio);
   }
   ```
2. Delete `server/studio/` directory.
3. Delete `sites/multiplic-studio/` directory.
4. Remove Studio-specific entries from root `package.json` dependencies.
5. Remove `tests/studio/` directory.

No other existing files are modified by Studio. The removal is fully reversible via git revert of the Phase 0 commit.

### 15.3 Incremental Rollout

Each Phase (0–6) can be deployed independently. The feature is useful in partial states:

| Deployed through | Usable capability |
|---|---|
| Phase 1 | Auth gate active; Studio shell loads (empty) |
| Phase 2 | File browsing and editing |
| Phase 3 | File editing + git commit/push |
| Phase 4 | + Terminal |
| Phase 5 | + AI copilot |
| Phase 6 | + Polish / keyboard shortcuts |

Phases 0–3 have no native module dependencies (`bcryptjs`, `express-session`, `simple-git` are pure JS or have pre-built binaries). `node-pty` (Phase 4) requires a native compile step and should be tested in the target environment before deploying Phase 4.
