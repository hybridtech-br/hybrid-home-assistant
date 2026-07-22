export type Instant = string;

export interface Clock {
  now(): Instant;
}

export class SystemClock implements Clock {
  now(): Instant {
    return new Date().toISOString();
  }
}

export class FixedClock implements Clock {
  public constructor(private readonly instant: Instant) {}

  now(): Instant {
    return this.instant;
  }
}
