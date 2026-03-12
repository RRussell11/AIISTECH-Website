# ADR-006: Password + Session Authentication for Multiplic Studio

**Status:** Accepted
**Date:** 2026-03-09
**Depends on:** ADR-001 through ADR-005

## Context

Multiplic Studio is a browser-based developer environment served at `/_studio`. It provides file editing, git operations, terminal access, and AI assistance — all of which could be destructive or expose sensitive information if accessed without authentication.

## Decision

- **Single `STUDIO_PASSWORD` env var** (stored as a bcrypt hash with cost factor 12)
- Studio is **completely disabled** when `STUDIO_PASSWORD` is absent — no routes, no sessions, no overhead
- `express-session` with a 24-hour cookie expiry, `httpOnly: true`, `SameSite=Strict`
- All `/_studio/*` routes check `req.session.authenticated` via `requireAuth` middleware
- Failed login attempts incur a fixed 300 ms delay to slow brute-force attacks
- No rate limiting or account lockout (single-user tool; lockout would be a DoS risk)

## Consequences

- Zero overhead on the existing domain router when Studio is disabled
- Single bcrypt comparison on login; no database required
- 300 ms delay limits brute-force to ~200 attempts/minute
- `SESSION_SECRET` env var required when Studio is enabled; server refuses to start without it

## Rejected Alternatives

- **JWT**: stateless tokens cannot be invalidated without a token store; overkill for single-user tool
- **HTTP Basic Auth**: no CSRF protection; credentials re-sent on every request
- **OAuth/OIDC**: too complex for a single-operator tool
