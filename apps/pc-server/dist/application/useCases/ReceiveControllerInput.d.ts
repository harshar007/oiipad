import { GameProfileRepositoryPort, RoomRepositoryPort, VirtualGamepadPort } from '@oiipad/domain';
import { ControllerInputPayload } from '@oiipad/protocol';
export interface ReceiveControllerInputParams {
    playerId: string;
    payload: ControllerInputPayload;
}
export declare class ReceiveControllerInput {
    private roomRepository;
    private gameProfileRepository;
    private virtualGamepad;
    constructor(roomRepository: RoomRepositoryPort, gameProfileRepository: GameProfileRepositoryPort, virtualGamepad: VirtualGamepadPort);
    execute(params: ReceiveControllerInputParams): Promise<void>;
}
//# sourceMappingURL=ReceiveControllerInput.d.ts.map