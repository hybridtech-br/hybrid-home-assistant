import type { BootContext } from "./BootContext.js";

export interface BootStagePolicy {
  readonly required: boolean;
  readonly timeoutMs?: number;
  readonly retries?: number;
}

export interface BootStageResult {
  readonly success: boolean;
  readonly warnings?: readonly string[];
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface BootStage {
  readonly id: string;
  readonly name: string;
  readonly policy: BootStagePolicy;

  execute(context: BootContext): Promise<BootStageResult>;
}
