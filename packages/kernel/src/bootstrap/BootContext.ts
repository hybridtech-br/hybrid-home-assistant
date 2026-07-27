import type { LifecycleManager } from "../lifecycle/LifecycleManager.js";

export type BootProfile = "minimal" | "standard" | "full";

export interface BootContextOptions {
  readonly lifecycle: LifecycleManager;
  readonly profile?: BootProfile;
  readonly bootId?: string;
}

export class BootContext {
  public readonly bootId: string;
  public readonly startedAt: Date;
  public readonly profile: BootProfile;
  public readonly lifecycle: LifecycleManager;
  private readonly values = new Map<string, unknown>();

  public constructor(options: BootContextOptions) {
    this.lifecycle = options.lifecycle;
    this.profile = options.profile ?? "standard";
    this.bootId = options.bootId ?? BootContext.createBootId();
    this.startedAt = new Date();
  }

  public set<T>(key: string, value: T): void {
    this.values.set(key, value);
  }

  public has(key: string): boolean {
    return this.values.has(key);
  }

  public get<T>(key: string): T {
    if (!this.values.has(key)) {
      throw new Error(`Boot context value not found: ${key}`);
    }

    return this.values.get(key) as T;
  }

  public getOptional<T>(key: string): T | undefined {
    return this.values.get(key) as T | undefined;
  }

  private static createBootId(): string {
    const timestamp = new Date().toISOString();
    const suffix = Math.random().toString(16).slice(2, 8).toUpperCase();
    return `${timestamp}-${suffix}`;
  }
}
