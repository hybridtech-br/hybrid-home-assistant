import type { Brand } from './brand.js';

export type EntityId = Brand<string, 'EntityId'>;
export type EventId = Brand<string, 'EventId'>;
export type CommandId = Brand<string, 'CommandId'>;
export type CorrelationId = Brand<string, 'CorrelationId'>;

const ID_PATTERN = /^[a-z][a-z0-9-]*_[A-Za-z0-9_-]{8,}$/;

export function isValidIdentifier(value: string): boolean {
  return ID_PATTERN.test(value);
}

export function entityId(value: string): EntityId {
  if (!isValidIdentifier(value)) {
    throw new TypeError(`Invalid EntityId: ${value}`);
  }
  return value as EntityId;
}

export function eventId(value: string): EventId {
  if (!isValidIdentifier(value)) {
    throw new TypeError(`Invalid EventId: ${value}`);
  }
  return value as EventId;
}
