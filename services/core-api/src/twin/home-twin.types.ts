import type { Capability } from './capability.types';

export interface TwinRoom {
  id: string;
  name: string;
  deviceIds: string[];
}

export interface TwinDevice {
  id: string;
  name: string;
  roomId?: string;
  manufacturer?: string;
  model?: string;
  status: 'discovered' | 'online' | 'offline' | 'error';
  capabilityIds: string[];
  healthScore: number;
}

export interface HomeTwin {
  homeId: string;
  name: string;
  rooms: Record<string, TwinRoom>;
  devices: Record<string, TwinDevice>;
  capabilities: Record<string, Capability>;
  healthScore: number;
  version: number;
  updatedAt: string;
}
