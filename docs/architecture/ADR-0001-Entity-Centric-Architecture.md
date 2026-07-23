# ADR-0001 - Entity-Centric Architecture

## Status
Accepted

## Context
Traditional smart-home platforms couple automations to physical devices, making hardware replacement expensive and error-prone.

## Decision
H²A adopts an entity-centric architecture.

Logical entities are the primary domain objects. Physical devices are represented as replaceable hardware bindings.

Automations, scenes, permissions, AI, telemetry and Digital Twin reference logical entities.

## Consequences
- Hardware can be replaced without breaking automations.
- AI history is preserved.
- Digital Twin remains stable.
- Drivers become hardware adapters.
- Device discovery becomes a binding problem instead of an automation problem.

This ADR is considered a foundational architectural decision for the platform.