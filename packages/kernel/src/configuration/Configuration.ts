export type LogLevel = "trace" | "debug" | "info" | "warn" | "error";

export interface KernelPathsConfiguration {
  readonly config: string;
  readonly data: string;
  readonly logs: string;
  readonly temp: string;
}

export interface KernelLoggingConfiguration {
  readonly level: LogLevel;
}

export interface KernelRuntimeConfiguration {
  readonly maxWorkers: number;
}

export interface KernelConfiguration {
  readonly profile: string;
  readonly paths: KernelPathsConfiguration;
  readonly logging: KernelLoggingConfiguration;
  readonly runtime: KernelRuntimeConfiguration;
}

export const DEFAULT_KERNEL_CONFIGURATION: KernelConfiguration = Object.freeze({
  profile: "standard",
  paths: Object.freeze({
    config: "./config",
    data: "./data",
    logs: "./logs",
    temp: "./temp",
  }),
  logging: Object.freeze({
    level: "info",
  }),
  runtime: Object.freeze({
    maxWorkers: 1,
  }),
});
