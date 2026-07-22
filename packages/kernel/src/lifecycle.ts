export interface LifecycleService {
  readonly name: string;
  initialize?(): void | Promise<void>;
  start?(): void | Promise<void>;
  stop?(): void | Promise<void>;
  dispose?(): void | Promise<void>;
}

export type LifecycleState = 'created' | 'initialized' | 'started' | 'stopped' | 'disposed';

export class LifecycleManager {
  private state: LifecycleState = 'created';

  public constructor(private readonly services: ReadonlyArray<LifecycleService>) {}

  getState(): LifecycleState {
    return this.state;
  }

  async initialize(): Promise<void> {
    this.assertState('created');
    for (const service of this.services) await service.initialize?.();
    this.state = 'initialized';
  }

  async start(): Promise<void> {
    this.assertState('initialized');
    for (const service of this.services) await service.start?.();
    this.state = 'started';
  }

  async stop(): Promise<void> {
    this.assertState('started');
    for (const service of [...this.services].reverse()) await service.stop?.();
    this.state = 'stopped';
  }

  async dispose(): Promise<void> {
    if (this.state === 'started') await this.stop();
    if (this.state !== 'initialized' && this.state !== 'stopped') {
      this.assertState('stopped');
    }
    for (const service of [...this.services].reverse()) await service.dispose?.();
    this.state = 'disposed';
  }

  private assertState(expected: LifecycleState): void {
    if (this.state !== expected) {
      throw new Error(`Invalid lifecycle transition: expected ${expected}, got ${this.state}`);
    }
  }
}
