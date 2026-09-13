"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetPlayerReady = void 0;
const domain_1 = require("@oiipad/domain");
const Logger_js_1 = require("../../infrastructure/system/Logger.js");
class SetPlayerReady {
    roomRepository;
    constructor(roomRepository) {
        this.roomRepository = roomRepository;
    }
    async execute(input) {
        const rooms = await this.roomRepository.getAll();
        const playerId = new domain_1.PlayerId(input.playerId);
        for (const room of rooms) {
            const player = room.getPlayer(playerId);
            if (player) {
                const updatedPlayer = player.setReady(input.ready);
                const updatedRoom = room.updatePlayer(updatedPlayer);
                await this.roomRepository.save(updatedRoom);
                Logger_js_1.Logger.info('SetPlayerReady', `Player ${player.name} ready status set to: ${input.ready}`);
                return;
            }
        }
        throw new domain_1.PlayerNotFoundError(input.playerId);
    }
}
exports.SetPlayerReady = SetPlayerReady;
//# sourceMappingURL=SetPlayerReady.js.map