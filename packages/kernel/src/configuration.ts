export type ConfigurationValue = string | number | boolean;
export type ConfigurationData = Readonly<Record<string, ConfigurationValue>>;

export interface ConfigurationSource {
  load(): ConfigurationData | Promise<ConfigurationData>;
}

export class Configuration {
  private data: ConfigurationData = {};
  private loaded = false;

  public constructor(private readonly source: ConfigurationSource) {}

  async load(): Promise<void> {
    this.data = Object.freeze({ ...(await this.source.load()) });
    this.loaded = true;
  }

  get(key: string): ConfigurationValue {
    if (!this.loaded) throw new Error('Configuration has not been loaded');
    const value = this.data[key];
    if (value === undefined) throw new Error(`Missing configuration key: ${key}`);
    return value;
  }

  getOptional(key: string): ConfigurationValue | undefined {
    if (!this.loaded) throw new Error('Configuration has not been loaded');
    return this.data[key];
  }
}

export class StaticConfigurationSource implements ConfigurationSource {
  public constructor(private readonly data: ConfigurationData) {}
  load(): ConfigurationData {
    return this.data;
  }
}
