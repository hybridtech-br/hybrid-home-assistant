const UUID_V4_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export abstract class UniqueId {
  protected constructor(private readonly rawValue: string) {
    if (!UUID_V4_PATTERN.test(rawValue)) {
      throw new TypeError(`Invalid UUID v4: ${rawValue}`);
    }
  }

  public get value(): string {
    return this.rawValue;
  }

  public equals(other: UniqueId): boolean {
    return this.constructor === other.constructor && this.rawValue === other.rawValue;
  }

  public toString(): string {
    return this.rawValue;
  }

  public toJSON(): string {
    return this.rawValue;
  }
}
