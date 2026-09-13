import { Room } from '../entities/Room';
import { RoomCode } from '../valueObjects/RoomCode';
export interface RoomRepositoryPort {
    save(room: Room): Promise<void>;
    findByCode(code: RoomCode): Promise<Room | undefined>;
    findById(id: string): Promise<Room | undefined>;
    delete(id: string): Promise<void>;
    getAll(): Promise<Room[]>;
}
//# sourceMappingURL=RoomRepositoryPort.d.ts.map