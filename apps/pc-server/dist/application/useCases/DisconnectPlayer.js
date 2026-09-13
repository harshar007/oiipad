"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisconnectPlayer = void 0;
const domain_1 = require("@oiipad/domain");
const Logger_js_1 = require("../../infrastructure/system/Logger.js");
class DisconnectPlayer {
    roomRepository;
    virtualGamepad;
    constructor(roomRepository, virtualGamepad) {
        this.roomRepository = roomRepository;
        this.virtualGamepad = virtualGamepad;
    }
    async execute(input) {
        const rooms = await this.roomRepository.getAll();
        const playerId = new domain_1.PlayerId(input.playerId);
        for (const room of rooms) {
            const player = room.getPlayer(playerId);
            if (player) {
                // Disconnect safety: Reset controller inputs and release buttons immediately
                await this.virtualGamepad.reset(player.slot);
                await this.virtualGamepad.disconnect(player.slot);
                // Update player connection state
                const disconnectedPlayer = player.setConnectionState('disconnected');
                const updatedRoom = room.updatePlayer(disconnectedPlayer);
                await this.roomRepository.save(updatedRoom);
                Logger_js_1.Logger.warn('DisconnectPlayer', `Player ${player.name} (${player.id.value}) disconnected. Gamepad #${player.slot} safely reset and released.`);
            }
        }
    }
}
exports.DisconnectPlayer = DisconnectPlayer;
//# sourceMappingURL=DisconnectPlayer.js.map