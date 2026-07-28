import {
  DEFAULT_KERNEL_CONFIGURATION,
  type KernelConfiguration,
} from "./Configuration.js";

export interface ConfigurationLoader {
  load(): Promise<KernelConfiguration>;
}

export class DefaultConfigurationLoader implements ConfigurationLoader {
  public async load(): Promise<KernelConfiguration> {
    return DEFAULT_KERNEL_CONFIGURATION;
  }
}
