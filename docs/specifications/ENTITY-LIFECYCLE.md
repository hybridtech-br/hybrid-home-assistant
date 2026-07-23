# Entity Lifecycle Specification

## States
- Created
- Configured
- Active
- Unavailable
- Maintenance
- HardwareMissing
- Retired
- Archived

## Allowed transitions
Created -> Configured
Configured -> Active
Active -> Unavailable
Unavailable -> Active
Active -> Maintenance
Maintenance -> Active
Active -> HardwareMissing
HardwareMissing -> Active
Active -> Retired
Retired -> Archived

## Rules
- EntityId never changes.
- Archived entities cannot be reactivated.
- Hardware replacement does not change lifecycle identity.
- All transitions must generate domain events and audit records.
- History is immutable.