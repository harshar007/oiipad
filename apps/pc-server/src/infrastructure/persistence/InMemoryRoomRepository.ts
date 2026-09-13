import { Room, RoomCode, RoomRepositoryPort } from '@oiipad/domain';

export class InMemoryRoomRepository implements RoomRepositoryPort {
  private rooms: Map<string, Room> = new Map();

  public async save(room: Room): Promise<void> {
    this.rooms.set(room.id, room);
  }

  public async findByCode(code: RoomCode): Promise<Room | undefined> {
    for (const room of this.rooms.values()) {
      if (room.code.equals(code)) {
        return room;
      }
    }
    return undefined;
  }

  public async findById(id: string): Promise<Room | undefined> {
    return this.rooms.get(id);
  }

  public async delete(id: string): Promise<void> {
    this.rooms.delete(id);
  }

  public async getAll(): Promise<Room[]> {
    return Array.from(this.rooms.values());
  }
}
