"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRoom = void 0;
const domain_1 = require("@oiipad/domain");
const Logger_js_1 = require("../../infrastructure/system/Logger.js");
class CreateRoom {
    roomRepository;
    constructor(roomRepository) {
        this.roomRepository = roomRepository;
    }
    async execute(input = {}) {
        const code = input.roomCode ? new domain_1.RoomCode(input.roomCode) : domain_1.RoomCode.generate();
        const gameProfile = input.gameProfileId ? new domain_1.GameProfileId(input.gameProfileId) : domain_1.GameProfileId.BBR1;
        const room = new domain_1.Room({
            id: code.value,
            code,
            maxPlayers: input.maxPlayers ?? 4,
            gameProfile,
            state: 'waiting'
        });
        await this.roomRepository.save(room);
        Logger_js_1.Logger.info('CreateRoom', `Room created: ${room.code.value} (Max Players: ${room.maxPlayers}, Profile: ${room.gameProfile.value})`);
        return room;
    }
}
exports.CreateRoom = CreateRoom;
//# sourceMappingURL=CreateRoom.js.map