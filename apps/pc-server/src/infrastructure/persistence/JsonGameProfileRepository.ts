import { GameProfile, GameProfileId, GameProfileRepositoryPort } from '@oiipad/domain';

export class JsonGameProfileRepository implements GameProfileRepositoryPort {
  private profiles: Map<string, GameProfile> = new Map();

  constructor() {
    // Register default game profiles
    const bbr1 = GameProfile.bbr1();
    const bbr2 = GameProfile.bbr2();
    const standard = GameProfile.standard();

    this.profiles.set(bbr1.id.value, bbr1);
    this.profiles.set(bbr2.id.value, bbr2);
    this.profiles.set(standard.id.value, standard);
  }

  public async getById(id: GameProfileId): Promise<GameProfile | undefined> {
    return this.profiles.get(id.value);
  }

  public async getAll(): Promise<GameProfile[]> {
    return Array.from(this.profiles.values());
  }

  public async save(profile: GameProfile): Promise<void> {
    this.profiles.set(profile.id.value, profile);
  }
}
