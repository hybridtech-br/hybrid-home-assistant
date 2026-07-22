import { describe, expect, it } from 'vitest';
import { entityId, err, FixedClock, isValidIdentifier, ok } from '../src/index.js';

describe('foundation', () => {
  it('creates a typed entity identifier from a valid value', () => {
    expect(entityId('entity_01HZYX5K9A')).toBe('entity_01HZYX5K9A');
  });

  it('rejects invalid identifiers', () => {
    expect(() => entityId('invalid')).toThrow(TypeError);
  });

  it('validates identifiers consistently', () => {
    expect(isValidIdentifier('event_01HZYX5K9A')).toBe(true);
    expect(isValidIdentifier('EVENT!')).toBe(false);
  });

  it('creates explicit success and error results', () => {
    expect(ok(42)).toEqual({ ok: true, value: 42 });
    expect(err('failure')).toEqual({ ok: false, error: 'failure' });
  });

  it('provides deterministic time through FixedClock', () => {
    const clock = new FixedClock('2026-07-22T13:00:00.000Z');
    expect(clock.now()).toBe('2026-07-22T13:00:00.000Z');
  });
});
