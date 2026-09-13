import { GameProfile } from '../entities/GameProfile';
import { GameProfileId } from '../valueObjects/GameProfileId';

export interface GameProfileRepositoryPort {
  getById(id: GameProfileId): Promise<GameProfile | undefined>;
  getAll(): Promise<GameProfile[]>;
  save(profile: GameProfile): Promise<void>;
}
