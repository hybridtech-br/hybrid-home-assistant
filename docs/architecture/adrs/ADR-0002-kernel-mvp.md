# ADR-0002 — Kernel MVP in process

## Status

Accepted

## Decision

The Genesis Kernel starts with in-process implementations for events, service registration, lifecycle, configuration and structured logging.

## Consequences

The first executable increments remain local and deterministic. Persistence, clustering and distributed transports are deferred behind stable contracts.
