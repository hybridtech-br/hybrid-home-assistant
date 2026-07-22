declare const serviceTokenType: unique symbol;

export type ServiceToken<TService> = symbol & {
  readonly [serviceTokenType]: TService;
};

export function serviceToken<TService>(description: string): ServiceToken<TService> {
  return Symbol(description) as ServiceToken<TService>;
}

export class ServiceAlreadyRegisteredError extends Error {}
export class ServiceNotFoundError extends Error {}

export class ServiceRegistry {
  private readonly services = new Map<symbol, unknown>();

  register<TService>(token: ServiceToken<TService>, service: TService): void {
    if (this.services.has(token)) {
      throw new ServiceAlreadyRegisteredError(`Service already registered: ${String(token)}`);
    }
    this.services.set(token, service);
  }

  has<TService>(token: ServiceToken<TService>): boolean {
    return this.services.has(token);
  }

  resolve<TService>(token: ServiceToken<TService>): TService {
    const service = this.services.get(token);
    if (service === undefined) {
      throw new ServiceNotFoundError(`Service not found: ${String(token)}`);
    }
    return service as TService;
  }
}
