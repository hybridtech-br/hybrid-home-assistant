import type { KernelConfiguration } from "./Configuration.js";
import { ConfigurationValidationError } from "./ConfigurationValidationError.js";

const LOG_LEVELS = new Set(["trace", "debug", "info", "warn", "error"]);

export class ConfigurationValidator {
  public validate(configuration: KernelConfiguration): void {
    const issues: string[] = [];

    if (!configuration.profile.trim()) issues.push("Profile must not be empty.");

    for (const [name, value] of Object.entries(configuration.paths)) {
      if (!value.trim()) issues.push(`Path '${name}' must not be empty.`);
    }

    if (!LOG_LEVELS.has(configuration.logging.level)) {
      issues.push("Invalid logging level.");
    }

    if (configuration.runtime.maxWorkers <= 0) {
      issues.push("Runtime maxWorkers must be greater than zero.");
    }

    if (issues.length > 0) {
      throw new ConfigurationValidationError(issues);
    }
  }
}
