import { RoomRepositoryPort, VirtualGamepadPort } from '@oiipad/domain';
export interface DisconnectPlayerInput {
    playerId: string;
}
export declare class DisconnectPlayer {
    private roomRepository;
    private virtualGamepad;
    constructor(roomRepository: RoomRepositoryPort, virtualGamepad: VirtualGamepadPort);
    execute(input: DisconnectPlayerInput): Promise<void>;
}
//# sourceMappingURL=DisconnectPlayer.d.ts.map