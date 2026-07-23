# Entity Domain Events

## Entity Events
- EntityCreated
- EntityConfigured
- EntityRenamed
- EntityMoved
- EntityArchived

## Hardware Events
- HardwareDiscovered
- HardwareBound
- HardwareUnbound
- HardwareReplaced
- HardwareMissing
- HardwareRecovered

## Capability Events
- CapabilityAdded
- CapabilityRemoved
- CapabilityStateChanged

## Audit Requirements
Every event must contain:
- eventId
- entityId
- timestamp
- actor
- correlationId
- causationId
- payload

Events are immutable and form the basis for auditing, synchronization and future event sourcing support.