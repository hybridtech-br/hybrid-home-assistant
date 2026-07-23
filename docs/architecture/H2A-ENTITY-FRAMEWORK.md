# H²A Entity Framework (HEF)

Status: Proposed Architecture

## Purpose

The H²A Entity Framework is the domain foundation for the HYBRID Home Assistant.

Its core principle is that the platform manages homes, rooms and logical household entities instead of physical devices.

## Main concepts

- Home
- Room
- HomeEntity
- HardwareBinding
- Capability
- Fingerprint
- Alias
- Lifecycle

## Core rules

1. Entity identity is immutable.
2. Hardware is replaceable.
3. Display names are unique within a room after normalization.
4. Automations reference entities instead of hardware.
5. AI learns behavior from entities.
6. Hardware history is preserved.

## Domain events

- entity.created
- entity.renamed
- hardware.bound
- hardware.replaced
- capability.added
- capability.removed

## Long-term objective

Turn H²A into a true Residential Operating System capable of preserving the home's digital twin independently of hardware replacement.