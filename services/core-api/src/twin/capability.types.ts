export type CapabilityType =
  | 'on-off'
  | 'brightness'
  | 'color'
  | 'temperature'
  | 'lock'
  | 'sensor'
  | 'camera'
  | 'media'
  | 'energy'
  | 'availability';

export interface CapabilityMetadata {
  name: string;
  unit?: string;
  writable: boolean;
  min?: number;
  max?: number;
  values?: string[];
}

export interface Capability<TState = unknown> {
  id: string;
  type: CapabilityType;
  deviceId: string;
  state: TState;
  commands: string[];
  metadata: CapabilityMetadata;
  updatedAt: string;
}
