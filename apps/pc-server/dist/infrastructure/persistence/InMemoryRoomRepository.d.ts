import { Room, RoomCode, RoomRepositoryPort } from '@oiipad/domain';
export declare class InMemoryRoomRepository implements RoomRepositoryPort {
    private rooms;
    save(room: Room): Promise<void>;
    findByCode(code: RoomCode): Promise<Room | undefined>;
    findById(id: string): Promise<Room | undefined>;
    delete(id: string): Promise<void>;
    getAll(): Promise<Room[]>;
}
//# sourceMappingURL=InMemoryRoomRepository.d.ts.map