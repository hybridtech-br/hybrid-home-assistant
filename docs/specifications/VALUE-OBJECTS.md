# Core Value Objects

## EntityId
Immutable UUID identifying a logical entity.

## HomeId
Immutable UUID identifying a home.

## RoomId
Immutable UUID identifying a room.

## DisplayName
User-facing name. Unique within a room after normalization.

## NormalizedName
Canonical representation used for comparisons.

## Alias
Alternative user-visible names. Must be unique within a room.

## Fingerprint
Composite immutable identifier built from serial number, MAC address, Matter ID and other available identifiers.

## Rules
- Value Objects are immutable.
- Equality is by value.
- Validation occurs at construction.
- Invalid objects cannot be instantiated.