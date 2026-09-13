import { ControllerState } from '../entities/ControllerState';
import { GameProfile } from '../entities/GameProfile';

export interface VirtualGamepadPort {
  connect(slot: number): Promise<boolean>;
  disconnect(slot: number): Promise<void>;
  update(slot: number, state: ControllerState, profile: GameProfile): Promise<void>;
  reset(slot: number): Promise<void>;
  resetAll(): Promise<void>;
  isConnected(slot: number): boolean;
}
