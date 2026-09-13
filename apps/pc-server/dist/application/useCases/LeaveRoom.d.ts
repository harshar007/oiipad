import { RoomRepositoryPort, VirtualGamepadPort } from '@oiipad/domain';
export interface LeaveRoomInput {
    roomCode: string;
    playerId: string;
}
export declare class LeaveRoom {
    private roomRepository;
    private virtualGamepad;
    constructor(roomRepository: RoomRepositoryPort, virtualGamepad: VirtualGamepadPort);
    execute(input: LeaveRoomInput): Promise<void>;
}
//# sourceMappingURL=LeaveRoom.d.ts.map