"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinRoom = void 0;
const domain_1 = require("@oiipad/domain");
const Logger_js_1 = require("../../infrastructure/system/Logger.js");
class JoinRoom {
    roomRepository;
    virtualGamepad;
    constructor(roomRepository, virtualGamepad) {
        this.roomRepository = roomRepository;
        this.virtualGamepad = virtualGamepad;
    }
    async execute(input) {
        const code = new domain_1.RoomCode(input.roomCode);
        const room = await this.roomRepository.findByCode(code);
        if (!room) {
            throw new domain_1.RoomNotFoundError(input.roomCode);
        }
        const playerId = input.playerId ? new domain_1.PlayerId(input.playerId) : new domain_1.PlayerId(Math.random().toString(36).substring(2, 9));
        // Check if player is reconnecting
        const existingPlayer = room.getPlayer(playerId);
        let slot;
        if (existingPlayer) {
            slot = existingPlayer.slot;
            const updatedPlayer = existingPlayer.setConnectionState('connected');
            const updatedRoom = room.updatePlayer(updatedPlayer);
            await this.virtualGamepad.connect(slot);
            await this.roomRepository.save(updatedRoom);
            Logger_js_1.Logger.info('JoinRoom', `Player ${updatedPlayer.name} reconnected to room ${room.code.value} in slot ${slot}`);
            return { room: updatedRoom, player: updatedPlayer };
        }
        // Determine available slot
        slot = input.preferredSlot ?? room.getAvailableSlot();
        const player = new domain_1.Player({
            id: playerId,
            name: input.playerName,
            slot,
            connectionState: 'connected',
            readyState: false
        });
        const updatedRoom = room.addPlayer(player);
        await this.virtualGamepad.connect(slot);
        await this.roomRepository.save(updatedRoom);
        Logger_js_1.Logger.info('JoinRoom', `Player ${player.name} (${player.id.value}) joined room ${room.code.value} in slot ${slot}`);
        return { room: updatedRoom, player };
    }
}
exports.JoinRoom = JoinRoom;
//# sourceMappingURL=JoinRoom.js.map