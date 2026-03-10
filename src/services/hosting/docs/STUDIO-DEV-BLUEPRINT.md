**complete 6-phase development blueprint** for Multiplic Studio with full file scaffolds, detailed implementation code, test harness specs, and day-by-day sequencing. Here's the structure:

***

## **6-Phase Plan Overview**

| Phase | Days | Deliverable | Key Milestone |
| :-- | :-- | :-- | :-- |
| **Phase 0** — Foundation | 1-2 | ADRs 006-009 + complete file tree scaffold | All decisions documented, no code runs yet |
| **Phase 1** — Auth \& Routing | 3-4 | Login page + session middleware | `/_studio` auth-gated, password login works |
| **Phase 2** — File System | 5-6 | File explorer + Monaco editor | Open/save any file in repo |
| **Phase 3** — Git Operations | 7-8 | Git panel + commit/push UI | Stage → commit → push triggers CI |
| **Phase 4** — Terminal | 9-10 | WebSocket PTY + xterm.js | Live shell in repo directory |
| **Phase 5** — AI Copilot | 11-13 | Chat sidebar + SSE streaming + "Apply" | Context-aware code assistance |
| **Phase 6** — Polish | 14 | VSCode theme + keyboard shortcuts + docs | Production-ready |

**Total:** 10-14 focused dev days

***

## **Key Architecture Decisions (ADRs)**

Four new ADRs lock down the security model before any code is written:

### **ADR-006: Password + Session Auth**

- Single `STUDIO_PASSWORD` env var (bcrypt hash)
- `express-session` with 24h expiry, `SameSite=Strict`
- All `/_studio/*` routes check `req.session.authenticated`


### **ADR-007: File System Sandboxing**

- Every path resolved with `path.resolve()` + assertion: `startsWith(REPO_ROOT)`
- Rejects `../` attempts before resolution
- 403 on any escape attempt (tested with `../../etc/passwd`)


### **ADR-008: AI Provider Abstraction**

- Server-side LLM proxy — client never sees API keys
- Pluggable: `STUDIO_AI_PROVIDER=openai|anthropic|ollama|custom`
- System prompt auto-injects current file + `multiplic.json` summary


### **ADR-009: Terminal Security**

- `node-pty` spawns `bash --restricted --noprofile --norc`
- CWD locked to `REPO_ROOT`
- Optional whitelist: `STUDIO_SHELL_ALLOWED_CMDS=npm,git,node,ls`

***

## **Complete File Scaffold**

The plan includes a **full tree** with every file path (59 new files). Here's the structure:

```
server/studio/
├── index.js                     # Studio Express sub-app
├── middleware/auth.js           # Session check + 401 guard
├── routes/
│   ├── auth.js                  # POST /login, /logout
│   ├── fs.js                    # GET/PUT /api/fs/:path
│   ├── git.js                   # GET /status; POST /commit, /push
│   ├── terminal.js              # WebSocket → node-pty
│   └── ai.js                    # POST /api/ai/complete (SSE)
└── services/
    ├── fileSystem.js            # Sandboxed fs operations
    ├── gitOperations.js         # simple-git wrapper
    ├── aiProvider.js            # LLM provider factory
    └── terminalManager.js       # PTY lifecycle

sites/multiplic-studio/
└── src/
    ├── App.jsx                  # Auth gate → Studio shell
    ├── pages/
    │   ├── Login.jsx
    │   └── Studio.jsx
    ├── components/
    │   ├── FileExplorer.jsx     # Tree from multiplic.json
    │   ├── EditorPane.jsx       # Monaco multi-tab
    │   ├── Terminal.jsx         # xterm.js WebSocket
    │   ├── GitPanel.jsx         # Stage/commit/push UI
    │   └── AIPanel.jsx          # Chat + SSE stream
    └── hooks/
        ├── useFileSystem.js
        ├── useGit.js
        ├── useTerminal.js
        └── useAI.js
```


***

## **Implementation Highlights**

### **Phase 1 Code Sample: Auth Middleware**

```javascript
function requireAuth(req, res, next) {
  if (!req.session?.authenticated) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}
```


### **Phase 2 Code Sample: Sandboxed File Read**

```javascript
function assertSafePath(filePath) {
  const resolved = path.resolve(REPO_ROOT, filePath);
  if (!resolved.startsWith(REPO_ROOT)) {
    throw new Error('Path traversal attempt');
  }
  return resolved;
}
```


### **Phase 4 Code Sample: PTY Spawn**

```javascript
const ptyProcess = pty.spawn('/bin/bash', ['--restricted'], {
  cwd: REPO_ROOT,
  env: { PS1: '\\w $ ' }
});
```


### **Phase 5 Code Sample: AI SSE Stream**

```javascript
for await (const token of streamCompletion(messages)) {
  res.write(`data: ${JSON.stringify({ token })}\n\n`);
}
```


***

## **Test Harness (22 Tests)**

### **10 Unit Tests**

- Session middleware bcrypt validation
- Path traversal rejection (`../../etc/passwd` → throw)
- `simple-git` API operations
- LLM provider factory


### **12 Integration Tests**

- Login → session cookie → auth guard
- File read/write via REST API
- Stage → commit → push workflow
- WebSocket PTY spawn + command execution
- AI SSE streaming response

**Coverage target:** 80%+ on `server/studio/`

***

## **Environment Variables**

```bash
# Auth
STUDIO_PASSWORD=<bcrypt hash>
STUDIO_SESSION_SECRET=<random 32-char>

# AI
STUDIO_AI_PROVIDER=openai
STUDIO_AI_API_KEY=sk-...
STUDIO_AI_MODEL=gpt-4o

# Terminal
STUDIO_SHELL_RESTRICTED=true
STUDIO_SHELL_ALLOWED_CMDS=npm,git,node,ls,cat
```


***

## **Acceptance Criteria (13 Checkpoints)**

✅ `/_studio` redirects to login when unauthenticated
✅ Login with valid password → session → Studio shell visible
✅ File explorer shows all `sites/` folders
✅ Clicking file opens Monaco editor with syntax highlighting
✅ `Ctrl+S` saves file to disk
✅ Git panel shows changed files
✅ Can stage, commit, push from Git panel
✅ Push triggers CI → `built` branch
✅ Terminal opens live PTY in repo dir
✅ AI panel streams response for prompt
✅ "Apply" button inserts AI code into editor
✅ All 22 tests passing
✅ Path traversal returns 403

***

## **Dependencies to Install**

```bash
# Server
npm install simple-git node-pty express-session bcryptjs ws express-ws

# Studio frontend
npm install @monaco-editor/react xterm xterm-addon-fit axios

# Dev
npm install -D supertest jest
```


***

## **Next Steps**

The full plan is now saved in my notes. Would you like me to:

1. **Create a GitHub issue** with this complete spec (ready for Copilot to pick up)
2. **Start Phase 0** by generating the 4 ADR documents (006-009) as markdown files
3. **Generate the file tree scaffold** as shell script you can run to create all empty stubs
4. **Walk through Phase 1 implementation** step-by-step interactively

Which would you prefer to tackle first?

