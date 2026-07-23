# Entity Framework Package Structure

## Proposed layout

packages/
  foundation/
    entity-framework/
      domain/
        aggregates/
        entities/
        value-objects/
        events/
        policies/
        repositories/
        services/
      application/
      infrastructure/
      tests/

## Goals
- Isolate business rules from infrastructure.
- Keep domain free of framework dependencies.
- Allow infrastructure adapters to evolve independently.
- Enable reuse by all H²A modules.

## Dependencies
Domain -> none
Application -> Domain
Infrastructure -> Domain + Application
UI -> Application