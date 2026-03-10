# ADR-002: `built` branch as deployment artifact

**Status:** Accepted  
**Date:** 2026-03-09

## Decision

`main` branch never has `dist/`. CI builds and commits `dist/` to the `built` branch. Server only ever pulls `built`. Build tools never installed on production.

## Constraint

Server has only git + node + pm2. No npm build toolchain.

## Metric

0 build tools on production server
