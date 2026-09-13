import { Room, RoomRepositoryPort } from '@oiipad/domain';
export interface CreateRoomInput {
    roomCode?: string;
    gameProfileId?: string;
    maxPlayers?: number;
}
export declare class CreateRoom {
    private roomRepository;
    constructor(roomRepository: RoomRepositoryPort);
    execute(input?: CreateRoomInput): Promise<Room>;
}
//# sourceMappingURL=CreateRoom.d.ts.map