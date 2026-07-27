import { BootContext, type BootProfile } from './BootContext.js';
import { BootPipeline } from './BootPipeline.js';
import type { BootStage } from './BootStage.js';
import { KernelState } from '../lifecycle/KernelState.js';
import type { LifecycleManager } from '../lifecycle/LifecycleManager.js';
import { BootReport } from './BootReport.js';

export class BootEngine {
 constructor(private readonly lifecycle: LifecycleManager, private readonly stages: readonly BootStage[]){}
 async start(profile: BootProfile='standard'): Promise<BootReport>{
  this.lifecycle.transitionTo(KernelState.Bootstrapping);
  const context=new BootContext({lifecycle:this.lifecycle,profile});
  const pipeline=new BootPipeline(this.stages);
  const report=await pipeline.run(context);
  const failed=report.stageReports.some(s=>!s.success);
  this.lifecycle.transitionTo(failed?KernelState.Failed:KernelState.Running);
  return report;
 }
}
