import { KernelState, type KernelState as KernelStateValue } from "../lifecycle/KernelState.js";
import type { BootProfile } from "./BootContext.js";

export type BootResult = "succeeded" | "degraded" | "failed";

export interface BootStageReport {
  readonly id: string;
  readonly name: string;
  readonly required: boolean;
  readonly success: boolean;
  readonly durationMs: number;
  readonly warnings: readonly string[];
  readonly errors: readonly string[];
}

export interface BootSummary {
  readonly totalStages: number;
  readonly succeededStages: number;
  readonly failedStages: number;
  readonly requiredStages: number;
  readonly optionalStages: number;
  readonly requiredFailures: number;
  readonly optionalFailures: number;
  readonly warningCount: number;
  readonly errorCount: number;
}

export interface BootMetrics {
  readonly durationMs: number;
  readonly averageStageDurationMs: number;
  readonly longestStage?: Readonly<{
    id: string;
    name: string;
    durationMs: number;
  }>;
}

export class BootReport {
  public readonly bootId: string;
  public readonly profile: BootProfile;
  public readonly startedAt: Date;
  public finishedAt?: Date;
  public finalState?: KernelStateValue;
  private readonly stages: BootStageReport[] = [];

  public constructor(bootId: string, startedAt: Date, profile: BootProfile) {
    this.bootId = bootId;
    this.startedAt = startedAt;
    this.profile = profile;
  }

  public addStage(stage: BootStageReport): void {
    if (this.finishedAt) {
      throw new Error("Cannot add stages to a finished boot report.");
    }

    this.stages.push(stage);
  }

  public finish(finalState: KernelStateValue): void {
    if (this.finishedAt) {
      throw new Error("Boot report has already been finished.");
    }

    this.finalState = finalState;
    this.finishedAt = new Date();
  }

  public get durationMs(): number {
    const end = this.finishedAt ?? new Date();
    return end.getTime() - this.startedAt.getTime();
  }

  public get result(): BootResult | undefined {
    switch (this.finalState) {
      case KernelState.Running:
        return "succeeded";
      case KernelState.Degraded:
        return "degraded";
      case KernelState.Failed:
        return "failed";
      default:
        return undefined;
    }
  }

  public get stageReports(): readonly BootStageReport[] {
    return this.stages;
  }

  public get summary(): BootSummary {
    return {
      totalStages: this.stages.length,
      succeededStages: this.stages.filter((stage) => stage.success).length,
      failedStages: this.stages.filter((stage) => !stage.success).length,
      requiredStages: this.stages.filter((stage) => stage.required).length,
      optionalStages: this.stages.filter((stage) => !stage.required).length,
      requiredFailures: this.stages.filter((stage) => stage.required && !stage.success).length,
      optionalFailures: this.stages.filter((stage) => !stage.required && !stage.success).length,
      warningCount: this.stages.reduce((count, stage) => count + stage.warnings.length, 0),
      errorCount: this.stages.reduce((count, stage) => count + stage.errors.length, 0),
    };
  }

  public get metrics(): BootMetrics {
    const longestStage = this.stages.reduce<BootStageReport | undefined>(
      (longest, stage) => !longest || stage.durationMs > longest.durationMs ? stage : longest,
      undefined,
    );

    return {
      durationMs: this.durationMs,
      averageStageDurationMs: this.stages.length === 0
        ? 0
        : this.stages.reduce((total, stage) => total + stage.durationMs, 0) / this.stages.length,
      ...(longestStage
        ? {
            longestStage: {
              id: longestStage.id,
              name: longestStage.name,
              durationMs: longestStage.durationMs,
            },
          }
        : {}),
    };
  }

  public get hasRequiredFailures(): boolean {
    return this.summary.requiredFailures > 0;
  }

  public get hasOptionalFailures(): boolean {
    return this.summary.optionalFailures > 0;
  }
}