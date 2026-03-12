# ADR-007: File System Sandboxing for Multiplic Studio

**Status:** Accepted
**Date:** 2026-03-09
**Depends on:** ADR-006

## Context

Studio's file explorer and editor give authenticated users access to read and write files in the repository. This creates risk of path traversal attacks — either deliberate (reading `/etc/passwd`) or accidental (editing `.env` secrets).

## Decision

Every file path provided by the client is processed through `assertSafePath()` before any filesystem operation:

1. **Raw `..` rejection**: Split path on `/` and `\`; throw 403 if any segment is `..`
2. **`path.resolve()` resolution**: Convert to absolute path under `REPO_ROOT`
3. **`startsWith(REPO_ROOT)` check**: Throw 403 if resolved path escapes the root
4. **`realpathSync()` symlink resolution**: Re-resolve to catch symlink escapes; re-apply `startsWith` check
5. **Deny-list**: Reject `.env*`, `.git/**`, `node_modules/**` by regex match on the relative path

File reads are additionally capped at 5 MB; larger files return `413 Content Too Large`.

## Consequences

- Directory traversal returns 403 before any filesystem call is made
- Symlinks pointing outside `REPO_ROOT` are rejected
- `.env` files and git internals are never readable through Studio
- Writes to `node_modules/` are blocked, preventing dependency tampering
- New files (paths that do not yet exist) skip the `realpathSync` check because there is nothing to resolve

## Rejected Alternatives

- **Chroot jail**: Requires root privileges; incompatible with npm workspace structure
- **Allowlist approach**: Too restrictive; arbitrary files in `sites/*/src/` must be accessible
