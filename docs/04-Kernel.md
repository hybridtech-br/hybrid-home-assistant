# H²A Kernel v0.1

## Status

Specification baseline for the first executable kernel of the HYBRID Home Assistant.

## Purpose

The Kernel is responsible for bootstrapping, lifecycle management, service registration, dependency resolution, messaging, configuration, health and observability.

The Kernel must not know residential domain concepts such as rooms, lights, cameras, residents, routines, Matter, MQTT or device manufacturers.

## Kernel boundary

The Kernel knows only:

- services;
- messages;
- state;
- configuration;
- runtime.

Residential concepts belong to higher layers.

## Public contracts

### Service

```ts
export interface Service {
  readonly id: string;
  readonly version: string;

  initialize(context: ServiceContext): Promise<void>;
  start(): Promise<void>;
  stop(reason?: string): Promise<void>;
  health(): Promise<ServiceHealth>;
}
```

### Service health

```ts
export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

export interface ServiceHealth {
  serviceId: string;
  status: HealthStatus;
  checkedAt: string;
  details?: Record<string, unknown>;
}
```

### Service context

```ts
export interface ServiceContext {
  configuration: ConfigurationReader;
  logger: Logger;
  eventBus: EventBus;
  commandBus: CommandBus;
  queryBus: QueryBus;
}
```

## Kernel lifecycle

Valid states:

```text
Created
  -> Bootstrapping
  -> Initializing
  -> Starting
  -> Running
  -> Degraded
  -> Recovering
  -> Stopping
  -> Stopped
```

Exceptional states:

```text
Failed
SafeMode
RecoveryMode
MaintenanceMode
```

State transitions must be explicit, validated and observable.

## Service lifecycle

```text
Created
  -> Configured
  -> Initialized
  -> Running
  -> Stopping
  -> Stopped
  -> Disposed
```

A service may enter `Degraded`, `Recovering` or `Failed` while active.

## Service manifest

Every service must declare a manifest.

```yaml
id: entity-runtime
version: 0.1.0
entrypoint: dist/index.js
dependencies:
  required:
    - configuration
    - event-bus
  optional: []
provides:
  - entity.read
  - entity.write
permissions:
  - storage.read
  - storage.write
startup:
  timeoutMs: 10000
  retries: 2
```

Required fields:

- `id`;
- `version`;
- `entrypoint`;
- `dependencies`;
- `provides`;
- `permissions`;
- `startup`.

## Service Registry rules

The Registry stores service metadata, factories, dependency information, capabilities and runtime status.

It must:

- reject duplicate service identifiers;
- validate manifests before registration;
- resolve required dependencies before startup;
- tolerate absent optional dependencies;
- detect dependency cycles;
- expose service status for diagnostics;
- never expose mutable internal Registry state directly.

## Boot sequence

```text
Power On
  -> Bootstrap
  -> Load Configuration
  -> Initialize Logging
  -> Create Service Registry
  -> Register Core Services
  -> Resolve Dependencies
  -> Initialize Services
  -> Start Services
  -> Run Health Validation
  -> Publish KernelReady
  -> System Ready
```

A required service failure blocks normal startup.

The Kernel may enter Safe Mode only when the failed component is not required to preserve minimum diagnostics and controlled shutdown.

## Core services for v0.1

Only the following are mandatory:

- Configuration Service;
- Logger;
- Event Bus;
- Command Bus;
- Query Bus;
- Service Registry;
- Health Service;
- HTTP API.

The Scheduler, Plugin Runtime, Entity Runtime, Driver Runtime and residential domain services are outside the first bootstrap increment unless explicitly added by a later ADR.

## Messaging contracts

All messages use a common envelope.

```ts
export interface MessageEnvelope<TPayload = unknown> {
  messageId: string;
  type: string;
  version: number;
  source: string;
  timestamp: string;
  correlationId?: string;
  causationId?: string;
  traceId?: string;
  payload: TPayload;
  metadata?: Record<string, unknown>;
}
```

### Event Bus

- Events describe facts that already occurred.
- An event may have zero or more subscribers.
- Event publishers must not depend on subscriber implementation.
- v0.1 delivery is in-process and at-most-once.

### Command Bus

- Commands express intent to perform an action.
- A command must have exactly one handler.
- Duplicate handlers for the same command type must fail registration.

### Query Bus

- Queries request information without mutating state.
- A query must have exactly one handler.
- Query handlers return typed results or typed errors.

## Configuration

Configuration loading order:

1. built-in defaults;
2. local configuration file;
3. environment variables;
4. explicit CLI arguments.

Higher-priority sources override lower-priority sources.

Secrets must never be written to logs or returned by diagnostic endpoints.

## Observability

The first implementation must provide:

### Structured logs

Minimum fields:

- timestamp;
- level;
- component;
- event;
- message;
- correlationId when available;
- error details when applicable.

### Metrics

Minimum metrics:

- kernel startup duration;
- active service count;
- failed service count;
- message processing count;
- message processing errors;
- process memory usage.

### Kernel events

Minimum events:

- `KernelBootstrapping`;
- `ConfigurationLoaded`;
- `ServiceRegistered`;
- `ServiceInitialized`;
- `ServiceStarted`;
- `ServiceDegraded`;
- `ServiceFailed`;
- `KernelReady`;
- `KernelStopping`;
- `KernelStopped`.

## HTTP diagnostics

The first API exposes:

- `GET /health`;
- `GET /kernel`;
- `GET /services`.

`/health` must return a non-success status when the Kernel or any required service is unhealthy.

## CLI objective

The first user-visible command is:

```bash
h2a start
```

Minimum expected output:

```text
Kernel initialized
Configuration loaded
Residential Bus ready
Service Registry ready
Health Service ready
HTTP API ready
System Ready
```

## Error handling

- Errors must be typed.
- Startup errors must identify the failing phase and component.
- Service startup must support timeout and bounded retries.
- Shutdown must proceed in reverse dependency order.
- Unhandled promise rejections and uncaught exceptions must trigger controlled shutdown when possible.

## Acceptance criteria

The Kernel v0.1 specification is satisfied when:

- `h2a start` starts the process successfully;
- all required services follow the defined lifecycle;
- dependency cycles are detected;
- `/health`, `/kernel` and `/services` respond;
- `KernelReady` is published;
- structured logs are produced;
- shutdown is graceful;
- automated tests cover lifecycle, dependency resolution and messaging contracts;
- Windows, Linux and macOS development instructions are documented.

## Explicit exclusions

This specification does not implement:

- RCOS;
- artificial intelligence;
- Context Engine;
- Knowledge Graph;
- Digital Twin;
- hardware drivers;
- Matter, Zigbee, Z-Wave, BLE or MQTT integrations;
- production dashboard;
- cloud federation.

These components depend on the Kernel and will be introduced incrementally after the bootstrap foundation is proven.