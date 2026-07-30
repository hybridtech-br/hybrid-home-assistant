import { ConfigurationStage } from "../configuration/ConfigurationStage.js";
import { KernelState } from "../lifecycle/KernelState.js";
import type { LifecycleManager } from "../lifecycle/LifecycleManager.js";
import { BootContext, type BootProfile } from "./BootContext.js";
import { BootPipeline } from "./BootPipeline.js";
import { BootReport } from "./BootReport.js";
import type { BootStage } from "./BootStage.js";

export class BootEngine {
  private readonly stages: readonly BootStage[];

  public constructor(
    private readonly lifecycle: LifecycleManager,
    stages: readonly BootStage[] = [],
  ) {
    this.stages = [
      new ConfigurationStage(),
      ...stages.filter((stage) => stage.id !== "configuration"),
    ];
  }

  public async start(profile: BootProfile = "standard"): Promise<BootReport> {
    this.lifecycle.transitionTo(KernelState.Bootstrapping);

    const context = new BootContext({
      lifecycle: this.lifecycle,
      profile,
    });
    const pipeline = new BootPipeline(this.stages);
    const report = await pipeline.run(context);

    if (report.hasRequiredFailures) {
      this.lifecycle.transitionTo(KernelState.Failed);
      report.finish(KernelState.Failed);
      return report;
    }

    this.lifecycle.transitionTo(KernelState.Initializing);
    this.lifecycle.transitionTo(KernelState.Starting);

    const finalState = report.hasOptionalFailures
      ? KernelState.Degraded
      : KernelState.Running;

    this.lifecycle.transitionTo(finalState);
    report.finish(finalState);

    return report;
  }
}