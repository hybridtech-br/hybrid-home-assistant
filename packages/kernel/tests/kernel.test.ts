import { entityId, eventId, FixedClock, type HouseEvent } from '@hha/foundation';
import { describe, expect, it, vi } from 'vitest';

import {
  Configuration,
  InMemoryEventBus,
  LifecycleManager,
  MemoryLogSink,
  ServiceRegistry,
  serviceToken,
  StaticConfigurationSource,
  StructuredLogger,
} from '../src/index.js';

describe('InMemoryEventBus', () => {
  it('publishes matching events and supports unsubscribe', async () => {
    const bus = new InMemoryEventBus();
    const handler = vi.fn();
    const subscription = bus.subscribe('KernelStarted', handler);
    const event: HouseEvent<{ ready: boolean }> = {
      id: eventId('event_12345678'),
      type: 'KernelStarted',
      version: 1,
      source: entityId('kernel_12345678'),
      occurredAt: '2026-07-22T12:00:00.000Z',
      receivedAt: '2026-07-22T12:00:00.000Z',
      payload: { ready: true },
    };

    await bus.publish(event);
    expect(handler).toHaveBeenCalledOnce();

    subscription.unsubscribe();
    await bus.publish(event);
    expect(handler).toHaveBeenCalledOnce();
  });
});

describe('ServiceRegistry', () => {
  it('registers and resolves a typed service', () => {
    const registry = new ServiceRegistry();
    const token = serviceToken<{ value: number }>('sample');
    registry.register(token, { value: 42 });
    expect(registry.resolve(token).value).toBe(42);
  });
});

describe('LifecycleManager', () => {
  it('starts in order and stops in reverse order', async () => {
    const calls: string[] = [];
    const manager = new LifecycleManager([
      {
        name: 'a',
        initialize: () => calls.push('a:init'),
        start: () => calls.push('a:start'),
        stop: () => calls.push('a:stop'),
      },
      {
        name: 'b',
        initialize: () => calls.push('b:init'),
        start: () => calls.push('b:start'),
        stop: () => calls.push('b:stop'),
      },
    ]);

    await manager.initialize();
    await manager.start();
    await manager.stop();

    expect(calls).toEqual(['a:init', 'b:init', 'a:start', 'b:start', 'b:stop', 'a:stop']);
  });
});

describe('Configuration and logging', () => {
  it('loads immutable configuration and writes structured logs', async () => {
    const configuration = new Configuration(new StaticConfigurationSource({ port: 8080 }));
    await configuration.load();
    expect(configuration.get('port')).toBe(8080);

    const sink = new MemoryLogSink();
    const logger = new StructuredLogger(new FixedClock('2026-07-22T12:00:00.000Z'), sink);
    logger.info('kernel.started', { port: 8080 });

    expect(sink.records[0]).toEqual({
      level: 'info',
      message: 'kernel.started',
      timestamp: '2026-07-22T12:00:00.000Z',
      context: { port: 8080 },
    });
  });
});
