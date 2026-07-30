import type { BootProfile } from "../bootstrap/BootContext.js";
import type { BootReport } from "../bootstrap/BootReport.js";
import type { KernelConfiguration } from "../configuration/Configuration.js";
import type { LifecycleManager } from "../lifecycle/LifecycleManager.js";

export interface KernelContextOptions {
  readonly bootId: string;
  readonly profile: BootProfile;
  readonly configuration: KernelConfiguration;
  readonly lifecycle: LifecycleManager;
  readonly bootReport: BootReport;
}

export class KernelContext {
  public readonly bootId: string;
  public readonly profile: BootProfile;
  public readonly configuration: KernelConfiguration;
  public readonly lifecycle: LifecycleManager;
  public readonly bootReport: BootReport;

  public constructor(options: KernelContextOptions) {
    this.bootId = options.bootId;
    this.profile = options.profile;
    this.configuration = options.configuration;
    this.lifecycle = options.lifecycle;
    this.bootReport = options.bootReport;
  }
}
