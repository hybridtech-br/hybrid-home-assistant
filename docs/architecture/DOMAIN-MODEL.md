# Domain Model

## Aggregates

### Home
Root aggregate representing a residence.

### Room
Child aggregate belonging to a Home.

### HomeEntity
Logical representation of something that exists in a room.

### HardwareBinding
Associates a physical device with a HomeEntity.

## Value Objects
- HomeId
- RoomId
- EntityId
- DisplayName
- NormalizedName
- Alias
- Fingerprint

## Invariants
- EntityId is immutable.
- One active HardwareBinding per HomeEntity.
- DisplayName must be unique within a room after normalization.
- Hardware replacement preserves EntityId.
- Hardware history is immutable.

## Future repositories
- HomeRepository
- RoomRepository
- HomeEntityRepository
- HardwareBindingRepository