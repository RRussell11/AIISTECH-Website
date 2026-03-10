# ADR-003: HMAC-SHA256 on all server-bound signals

**Status:** Accepted  
**Date:** 2026-03-09

## Decision

Every webhook/sync ping must carry `X-Hub-Signature-256`. Server rejects all unsigned requests with 403. No exceptions.

## Constraint

`SYNC_SECRET` must be rotated every 90 days.

## Metric

100% rejection rate of unsigned payloads
