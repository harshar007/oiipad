import { Player, Room, PlayerSlotNumber, RoomRepositoryPort, VirtualGamepadPort } from '@oiipad/domain';
export interface JoinRoomInput {
    roomCode: string;
    playerName: string;
    playerId?: string;
    preferredSlot?: PlayerSlotNumber;
}
export interface JoinRoomOutput {
    room: Room;
    player: Player;
}
export declare class JoinRoom {
    private roomRepository;
    private virtualGamepad;
    constructor(roomRepository: RoomRepositoryPort, virtualGamepad: VirtualGamepadPort);
    execute(input: JoinRoomInput): Promise<JoinRoomOutput>;
}
//# sourceMappingURL=JoinRoom.d.ts.map