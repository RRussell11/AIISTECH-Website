# ADR-009: Terminal Security for Multiplic Studio

**Status:** Accepted
**Date:** 2026-03-09
**Depends on:** ADR-006, ADR-007

## Context

Studio includes an embedded terminal to allow developers to run `npm`, `git`, and `node` commands without leaving the browser. An unrestricted shell on the production server would be a severe security risk.

## Decision

- **`bash --restricted` (`rbash`)**: Prevents `cd` outside `REPO_ROOT`, prevents PATH modification, prevents I/O redirection, prevents sourcing arbitrary files
- **`cwd: REPO_ROOT`**: Terminal spawns in the repository root; combined with `rbash` prevents directory escape
- **Minimal `PATH`**: Only `/usr/local/bin:/usr/bin:/bin` — no user-local directories
- **Clean environment**: Only `HOME`, `TERM`, `PATH`, `LANG`, and `MULTIPLIC_REPO_PATH` are passed to the PTY; no secrets from the parent environment
- **Max 2 concurrent sessions**: Third create request returns 429
- **30-minute idle timeout**: Inactive PTY sessions are automatically destroyed
- **WebSocket transport**: PTY I/O flows over a WebSocket connection; resize commands are JSON-encoded and parsed separately from raw input

## Consequences

- `rbash` restrictions prevent most lateral movement from within the terminal
- Secrets in the server environment (e.g., `SYNC_SECRET`, `STUDIO_PASSWORD`) are not inherited by PTY child processes
- The 2-session cap prevents resource exhaustion from abandoned browser tabs
- Idle timeout frees file descriptors and PTY kernel resources after inactivity
- Operators who need unrestricted shell access should SSH directly to the server

## Rejected Alternatives

- **Full `bash`**: No sandboxing; any user with Studio access could exfiltrate secrets or modify server config
- **Whitelisted commands only**: Overly restrictive for a developer workflow; `npm install`, `git log`, `node scripts/` all need to work
- **Container isolation**: Correct approach for multi-tenant Cloud tier; overkill for single-operator OSS tool
