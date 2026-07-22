import type { HouseEvent } from '@hha/foundation';

export type EventHandler<TPayload = unknown> = (
  event: HouseEvent<TPayload>,
) => void | Promise<void>;

export interface Subscription {
  readonly unsubscribe: () => void;
}

export interface EventBus {
  publish<TPayload>(event: HouseEvent<TPayload>): Promise<void>;
  subscribe<TPayload>(eventType: string, handler: EventHandler<TPayload>): Subscription;
}

export class InMemoryEventBus implements EventBus {
  private readonly handlers = new Map<string, Set<EventHandler>>();

  subscribe<TPayload>(eventType: string, handler: EventHandler<TPayload>): Subscription {
    const handlers = this.handlers.get(eventType) ?? new Set<EventHandler>();
    handlers.add(handler as EventHandler);
    this.handlers.set(eventType, handlers);

    return {
      unsubscribe: () => {
        handlers.delete(handler as EventHandler);
        if (handlers.size === 0) this.handlers.delete(eventType);
      },
    };
  }

  async publish<TPayload>(event: HouseEvent<TPayload>): Promise<void> {
    const direct = [...(this.handlers.get(event.type) ?? [])];
    const wildcard = [...(this.handlers.get('*') ?? [])];
    await Promise.all([...direct, ...wildcard].map((handler) => Promise.resolve(handler(event))));
  }
}
