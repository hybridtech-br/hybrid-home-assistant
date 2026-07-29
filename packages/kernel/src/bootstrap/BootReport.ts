export interface BootStageReport {
  readonly id: string;
  readonly name: string;
  readonly required: boolean;
  readonly success: boolean;
  readonly durationMs: number;
  readonly warnings: readonly string[];
  readonly errors: readonly string[];
}

export class BootReport {
  public readonly bootId: string;
  public readonly startedAt: Date;
  public finishedAt?: Date;
  private readonly stages: BootStageReport[] = [];

  constructor(bootId: string, startedAt: Date) {
    this.bootId = bootId;
    this.startedAt = startedAt;
  }

  addStage(stage: BootStageReport): void {
    this.stages.push(stage);
  }

  finish(): void {
    this.finishedAt = new Date();
  }

  get durationMs(): number {
    const end = this.finishedAt ?? new Date();
    return end.getTime() - this.startedAt.getTime();
  }

  get stageReports(): readonly BootStageReport[] {
    return this.stages;
  }

  get hasRequiredFailures(): boolean {
    return this.stages.some((stage) => stage.required && !stage.success);
  }

  get hasOptionalFailures(): boolean {
    return this.stages.some((stage) => !stage.required && !stage.success);
  }
}
