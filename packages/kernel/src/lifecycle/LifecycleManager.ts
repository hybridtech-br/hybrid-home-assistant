import { KernelState } from "./KernelState.js";

export interface KernelStateTransition {
  readonly from: KernelState;
  readonly to: KernelState;
  readonly occurredAt: Date;
}

export type KernelStateListener = (transition: KernelStateTransition) => void;

const transitions: Readonly<Record<KernelState, readonly KernelState[]>> = {
  [KernelState.Created]: [KernelState.Bootstrapping, KernelState.Failed],
  [KernelState.Bootstrapping]: [KernelState.Initializing, KernelState.Failed, KernelState.SafeMode],
  [KernelState.Initializing]: [KernelState.Starting, KernelState.Failed, KernelState.SafeMode],
  [KernelState.Starting]: [KernelState.Running, KernelState.Degraded, KernelState.Failed, KernelState.SafeMode],
  [KernelState.Running]: [KernelState.Degraded, KernelState.Stopping, KernelState.Failed],
  [KernelState.Degraded]: [KernelState.Recovering, KernelState.Stopping, KernelState.Failed, KernelState.SafeMode],
  [KernelState.Recovering]: [KernelState.Running, KernelState.Degraded, KernelState.Failed, KernelState.SafeMode],
  [KernelState.Stopping]: [KernelState.Stopped, KernelState.Failed],
  [KernelState.Stopped]: [],
  [KernelState.Failed]: [KernelState.SafeMode, KernelState.Stopping],
  [KernelState.SafeMode]: [KernelState.Recovering, KernelState.Stopping, KernelState.Failed],
};

export class LifecycleManager {
  private state: KernelState = KernelState.Created;
  private readonly listeners = new Set<KernelStateListener>();

  public get currentState(): KernelState {
    return this.state;
  }

  public canTransitionTo(nextState: KernelState): boolean {
    return transitions[this.state].includes(nextState);
  }

  public transitionTo(nextState: KernelState): KernelStateTransition {
    if (!this.canTransitionTo(nextState)) {
      throw new Error(`Invalid kernel state transition: ${this.state} -> ${nextState}`);
    }

    const transition: KernelStateTransition = {
      from: this.state,
      to: nextState,
      occurredAt: new Date(),
    };

    this.state = nextState;

    for (const listener of this.listeners) {
      listener(transition);
    }

    return transition;
  }

  public subscribe(listener: KernelStateListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
