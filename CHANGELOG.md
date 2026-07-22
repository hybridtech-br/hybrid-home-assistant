# Changelog

## [0.1.0-alpha.2.2] - 2026-07-22

### Fixed

- Corrigidas quatro falhas reais de ESLint no pacote `@hha/kernel`.
- Removido o uso de parâmetros genéricos desnecessários na configuração.
- Normalizada a agregação de handlers síncronos e assíncronos no Event Bus.
- Reforçada a tipagem nominal dos tokens do Service Registry.
- Substituído o script reservado `ci` por `verify`, pois `pnpm ci` não executa scripts do projeto.

## [0.1.0-alpha.2.1] - 2026-07-22

### Fixed

- Resolução do pacote `@hha/foundation` durante `typecheck` sem exigir build prévio.
- Alias do Vitest para testes do Kernel contra o código-fonte do Foundation.
- Configuração type-aware do ESLint incluindo arquivos de teste.
- Declaração ESM no pacote raiz para eliminar avisos de configuração.
- Formatação consistente do monorepo.

## Unreleased

## 0.1.0-alpha.2 - 2026-07-22

### Added

- Kernel MVP package.
- In-memory Event Bus.
- Typed Service Registry.
- Lifecycle Manager.
- Static configuration service.
- Structured logger with in-memory sink.
- Unit tests for Kernel components.

## 0.1.0-alpha.1 - 2026-07-22

### Added

- Initial monorepo bootstrap.
- Foundation package with typed identifiers, Result, Clock and HouseEvent.
