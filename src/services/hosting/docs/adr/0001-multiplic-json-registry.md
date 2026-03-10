# ADR-001: multiplic.json as single registry of truth

**Status:** Accepted  
**Date:** 2026-03-09

## Decision

One JSON file at repo root maps every domain/subpath to a `sites/` folder.

## Constraint

No domain may be served without a `multiplic.json` entry.

## Metric

100% of served domains traceable to `multiplic.json` entry
