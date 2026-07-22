import type { CorrelationId, EntityId, EventId } from './ids.js';
import type { Instant } from './clock.js';

export interface HouseEvent<TPayload> {
  readonly id: EventId;
  readonly type: string;
  readonly version: number;
  readonly source: EntityId;
  readonly occurredAt: Instant;
  readonly receivedAt: Instant;
  readonly correlationId?: CorrelationId;
  readonly payload: Readonly<TPayload>;
}
