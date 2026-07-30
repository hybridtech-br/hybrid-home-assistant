import { BootContext } from "../bootstrap/BootContext.js";
import type { BootStage, BootStageResult } from "../bootstrap/BootStage.js";
import { DefaultConfigurationLoader } from "./ConfigurationLoader.js";
import { ConfigurationValidator } from "./ConfigurationValidator.js";

export class ConfigurationStage implements BootStage {
  public readonly id = "configuration";
  public readonly name = "Configuration";
  public readonly policy = { required: true };

  private readonly loader = new DefaultConfigurationLoader();
  private readonly validator = new ConfigurationValidator();

  public async execute(context: BootContext): Promise<BootStageResult> {
    const configuration = await this.loader.load();
    this.validator.validate(configuration);
    context.configuration = configuration;
    return { success: true };
  }
}
