import { RoomRepositoryPort } from '@oiipad/domain';
export interface SetPlayerReadyInput {
    playerId: string;
    ready: boolean;
}
export declare class SetPlayerReady {
    private roomRepository;
    constructor(roomRepository: RoomRepositoryPort);
    execute(input: SetPlayerReadyInput): Promise<void>;
}
//# sourceMappingURL=SetPlayerReady.d.ts.map