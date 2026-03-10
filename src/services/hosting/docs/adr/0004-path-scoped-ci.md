# ADR-004: Path-scoped CI — build only changed sites

**Status:** Accepted  
**Date:** 2026-03-09

## Decision

GitHub Actions detects which `sites/` folders changed via `git diff`. Only those sites rebuild. Unaffected sites never re-run `npm ci`.

## Metric

Build time < 90s for single-site change
