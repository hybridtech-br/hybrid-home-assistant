export const KernelState = {
  Created: "created",
  Bootstrapping: "bootstrapping",
  Initializing: "initializing",
  Starting: "starting",
  Running: "running",
  Degraded: "degraded",
  Recovering: "recovering",
  Stopping: "stopping",
  Stopped: "stopped",
  Failed: "failed",
  SafeMode: "safe-mode",
} as const;

export type KernelState = (typeof KernelState)[keyof typeof KernelState];
