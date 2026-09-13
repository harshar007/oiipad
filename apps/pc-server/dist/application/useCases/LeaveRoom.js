"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveRoom = void 0;
const domain_1 = require("@oiipad/domain");
const Logger_js_1 = require("../../infrastructure/system/Logger.js");
class LeaveRoom {
    roomRepository;
    virtualGamepad;
    constructor(roomRepository, virtualGamepad) {
        this.roomRepository = roomRepository;
        this.virtualGamepad = virtualGamepad;
    }
    async execute(input) {
        const code = new domain_1.RoomCode(input.roomCode);
        const room = await this.roomRepository.findByCode(code);
        if (!room)
            return;
        const playerId = new domain_1.PlayerId(input.playerId);
        const player = room.getPlayer(playerId);
        if (player) {
            await this.virtualGamepad.reset(player.slot);
            await this.virtualGamepad.disconnect(player.slot);
            const updatedRoom = room.removePlayer(playerId);
            await this.roomRepository.save(updatedRoom);
            Logger_js_1.Logger.info('LeaveRoom', `Player ${player.name} left room ${room.code.value} (slot ${player.slot} released)`);
        }
    }
}
exports.LeaveRoom = LeaveRoom;
//# sourceMappingURL=LeaveRoom.js.map