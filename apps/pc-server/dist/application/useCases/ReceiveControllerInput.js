"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiveControllerInput = void 0;
const domain_1 = require("@oiipad/domain");
class ReceiveControllerInput {
    roomRepository;
    gameProfileRepository;
    virtualGamepad;
    constructor(roomRepository, gameProfileRepository, virtualGamepad) {
        this.roomRepository = roomRepository;
        this.gameProfileRepository = gameProfileRepository;
        this.virtualGamepad = virtualGamepad;
    }
    async execute(params) {
        const playerId = new domain_1.PlayerId(params.playerId);
        const rooms = await this.roomRepository.getAll();
        let targetRoom;
        let targetPlayer;
        for (const room of rooms) {
            const player = room.getPlayer(playerId);
            if (player && player.connectionState === 'connected') {
                targetRoom = room;
                targetPlayer = player;
                break;
            }
        }
        if (!targetRoom || !targetPlayer) {
            throw new domain_1.PlayerNotFoundError(params.playerId);
        }
        // Convert validated DTO to Domain ControllerState
        const steering = domain_1.SteeringValue.fromClamped(params.payload.steering);
        const controllerState = new domain_1.ControllerState({
            steering,
            accelerate: params.payload.accelerate,
            brake: params.payload.brake,
            handbrake: params.payload.handbrake,
            boost: params.payload.boost,
            powerUp: params.payload.powerUp,
            pause: params.payload.pause,
            buttons: params.payload.buttons,
            timestamp: Date.now()
        });
        // Update player model
        const updatedPlayer = targetPlayer.updateControllerState(controllerState);
        const updatedRoom = targetRoom.updatePlayer(updatedPlayer);
        await this.roomRepository.save(updatedRoom);
        // Retrieve active game profile for the room mapping
        const gameProfile = await this.gameProfileRepository.getById(targetRoom.gameProfile);
        if (gameProfile) {
            // Direct hardware/virtual gamepad update targeting the player's specific slot (1-4)
            await this.virtualGamepad.update(targetPlayer.slot, controllerState, gameProfile);
        }
    }
}
exports.ReceiveControllerInput = ReceiveControllerInput;
//# sourceMappingURL=ReceiveControllerInput.js.map