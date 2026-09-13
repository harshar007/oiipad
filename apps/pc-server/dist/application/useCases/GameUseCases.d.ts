import { GameProfile, GameProfileRepositoryPort, RoomRepositoryPort, VirtualGamepadPort } from '@oiipad/domain';
export declare class LoadGameProfile {
    private roomRepository;
    private gameProfileRepository;
    constructor(roomRepository: RoomRepositoryPort, gameProfileRepository: GameProfileRepositoryPort);
    execute(roomCode: string, profileId: string): Promise<GameProfile>;
}
export declare class StartGame {
    private roomRepository;
    constructor(roomRepository: RoomRepositoryPort);
    execute(roomCode: string): Promise<void>;
}
export declare class StopGame {
    private roomRepository;
    private virtualGamepad;
    constructor(roomRepository: RoomRepositoryPort, virtualGamepad: VirtualGamepadPort);
    execute(roomCode: string): Promise<void>;
}
export declare class ResetController {
    private virtualGamepad;
    constructor(virtualGamepad: VirtualGamepadPort);
    execute(slot?: number): Promise<void>;
}
//# sourceMappingURL=GameUseCases.d.ts.map