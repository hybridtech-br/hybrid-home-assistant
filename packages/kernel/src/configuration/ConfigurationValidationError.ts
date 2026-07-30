export class ConfigurationValidationError extends Error {
  public readonly issues: readonly string[];

  public constructor(issues: readonly string[]) {
    const normalizedIssues = issues.map((issue) => issue.trim()).filter(Boolean);
    const message =
      normalizedIssues.length === 0
        ? "Kernel configuration validation failed."
        : `Kernel configuration validation failed: ${normalizedIssues.join("; ")}`;

    super(message);
    this.name = "ConfigurationValidationError";
    this.issues = Object.freeze([...normalizedIssues]);
  }
}
