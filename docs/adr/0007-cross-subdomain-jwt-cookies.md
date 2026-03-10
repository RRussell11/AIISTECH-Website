# ADR-0007: Cookie-Scoped JWT for Cross-Subdomain Identity

**Status:** Draft  
**Date:** 2026-03-10  
**Phase:** 1 — Identity Layer  
**Depends on:** ADR-0006 (domain topology)

---

## Context

The existing `mock-backend/server.js` returns JWT access tokens (15-minute lifespan) and refresh tokens (7-day lifespan) in a JSON response body. The frontend stores them in `localStorage` via `authService.ts` and reads them back on every request.

`localStorage` is **origin-scoped**: a token stored at `app.aiistech.com` is invisible to `dashboard.aiistech.com` and to any `[slug].aiistech.com` project subdomain. As AIISTECH expands to multi-domain hosting under Multiplic, this creates forced re-authentication every time a user crosses a subdomain boundary — a broken UX and a violation of the recursive identity-preservation model that Multiplic is built on.

Additionally, `localStorage` tokens are accessible to any JavaScript on the page — a direct XSS vulnerability that violates OWASP A07 (Identification and Authentication Failures).

---

## Decision

JWTs are issued and rotated as `httpOnly` cookies scoped to `.aiistech.com`. `localStorage` is never used for auth tokens in production.

### Cookie attributes

```
Set-Cookie: access_token=<jwt>; HttpOnly; Secure; SameSite=None; Domain=.aiistech.com; Path=/; Max-Age=900
Set-Cookie: refresh_token=<jwt>; HttpOnly; Secure; SameSite=None; Domain=.aiistech.com; Path=/api/auth/refresh; Max-Age=604800
```

- `HttpOnly` — token inaccessible to JavaScript; XSS cannot extract it
- `Secure` — cookie only sent over HTTPS
- `SameSite=None` — required for cross-subdomain requests (pairs with `Secure`)
- `Domain=.aiistech.com` — the leading dot makes the cookie valid for all subdomains
- `refresh_token` path is scoped to `/api/auth/refresh` to limit its exposure surface

### Auth state source of truth

`AuthContext.tsx` no longer reads from `localStorage`. On mount it calls `GET /api/auth/me`, which validates the `access_token` cookie server-side and returns the user object. If the cookie is absent or expired, the endpoint returns `401` and the context sets `user = null`.

### Token refresh flow

```
Client → GET /api/auth/me → 401 (access token expired)
Client → POST /api/auth/refresh (sends refresh_token cookie)
Server → validates refresh token → issues new access_token cookie
Client → retry GET /api/auth/me → 200 + user object
```

The frontend `api.ts` interceptor handles the 401 → refresh → retry cycle transparently.

---

## Changes required

| File | Change |
|---|---|
| `mock-backend/server.js` | Replace JSON token response with `res.cookie()` calls; add `/api/auth/me`; add `/api/auth/refresh`; harden CORS to `*.aiistech.com` pattern with `credentials: true` |
| `src/services/authService.ts` | Remove all `localStorage.setItem/getItem` calls for tokens; remove manual `Authorization` header injection |
| `src/contexts/AuthContext.tsx` | Replace `localStorage` read on mount with `GET /api/auth/me` call |
| `src/components/auth/ProtectedRoute.tsx` | Use `AuthContext` user state only; no direct token reads |
| `src/services/api.ts` | Add 401 interceptor that triggers refresh before retry |

---

## Constraints

1. `JWT_SECRET` and `JWT_REFRESH_SECRET` must be loaded from environment variables — never hardcoded. The current hardcoded values in `mock-backend/server.js` are acceptable only in the mock environment and must be replaced before Phase 1 is marked complete.
2. CORS on the API must set `credentials: true` and use a dynamic origin validator — not a wildcard `*` — because `SameSite=None` cookies require explicit origin whitelisting when credentials are included.
3. `SameSite=None; Secure` requires HTTPS. Phase 1 cannot be marked production-ready until the wildcard TLS certificate (`*.aiistech.com`) is issued and Nginx TLS termination is live.

---

## Rejected alternatives

**`sessionStorage` instead of cookies** — rejected. `sessionStorage` is also origin-scoped (same problem as `localStorage`) and is cleared on tab close, breaking user experience.

**Shared auth domain redirect (OAuth-style)** — rejected as over-engineered for this stage. The cookie approach achieves the same result with far less infrastructure overhead given that all subdomains are under a single apex domain.

**Token in URL hash during subdomain handoff** — rejected. Tokens in URLs are logged by servers, proxies, and browser history — an OWASP A02 cryptographic failure.

---

## Metrics

- Zero access tokens in `localStorage` or `sessionStorage` in any production browser session
- `GET /api/auth/me` from `dashboard.aiistech.com` returns 200 for a user authenticated at `app.aiistech.com` in the same browser session without re-login
- `GET /api/auth/me` with no cookie returns 401 within 50ms
