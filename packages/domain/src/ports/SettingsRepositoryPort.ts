import { SteeringConfiguration } from '../valueObjects/SteeringConfiguration';
import { GameProfileId } from '../valueObjects/GameProfileId';

export interface UserSettings {
  playerName: string;
  selectedProfileId: GameProfileId;
  steeringConfig: SteeringConfiguration;
  lastConnectedHost?: string;
  lastConnectedPort?: number;
}

export interface SettingsRepositoryPort {
  loadSettings(): Promise<UserSettings>;
  saveSettings(settings: UserSettings): Promise<void>;
}
