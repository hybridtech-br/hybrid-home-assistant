import { BootReport } from "./BootReport.js";
import type { BootContext } from "./BootContext.js";
import type { BootStage } from "./BootStage.js";

export class BootPipeline {
  public constructor(private readonly stages: readonly BootStage[]) {}

  public async run(context: BootContext): Promise<BootReport> {
    const report = new BootReport(context.bootId, context.startedAt, context.profile);

    for (const stage of this.stages) {
      const start = Date.now();

      try {
        const result = await stage.execute(context);
        report.addStage({
          id: stage.id,
          name: stage.name,
          required: stage.policy.required,
          success: result.success,
          durationMs: Date.now() - start,
          warnings: [...(result.warnings ?? [])],
          errors: [],
        });

        if (!result.success && stage.policy.required) {
          break;
        }
      } catch (error) {
        report.addStage({
          id: stage.id,
          name: stage.name,
          required: stage.policy.required,
          success: false,
          durationMs: Date.now() - start,
          warnings: [],
          errors: [error instanceof Error ? error.message : String(error)],
        });

        if (stage.policy.required) {
          break;
        }
      }
    }

    return report;
  }
}