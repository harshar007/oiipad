"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryRoomRepository = void 0;
class InMemoryRoomRepository {
    rooms = new Map();
    async save(room) {
        this.rooms.set(room.id, room);
    }
    async findByCode(code) {
        for (const room of this.rooms.values()) {
            if (room.code.equals(code)) {
                return room;
            }
        }
        return undefined;
    }
    async findById(id) {
        return this.rooms.get(id);
    }
    async delete(id) {
        this.rooms.delete(id);
    }
    async getAll() {
        return Array.from(this.rooms.values());
    }
}
exports.InMemoryRoomRepository = InMemoryRoomRepository;
//# sourceMappingURL=InMemoryRoomRepository.js.map