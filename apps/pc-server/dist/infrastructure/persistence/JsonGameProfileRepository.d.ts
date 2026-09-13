import { GameProfile, GameProfileId, GameProfileRepositoryPort } from '@oiipad/domain';
export declare class JsonGameProfileRepository implements GameProfileRepositoryPort {
    private profiles;
    constructor();
    getById(id: GameProfileId): Promise<GameProfile | undefined>;
    getAll(): Promise<GameProfile[]>;
    save(profile: GameProfile): Promise<void>;
}
//# sourceMappingURL=JsonGameProfileRepository.d.ts.map