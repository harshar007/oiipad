"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetController = exports.StopGame = exports.StartGame = exports.LoadGameProfile = void 0;
const domain_1 = require("@oiipad/domain");
const Logger_js_1 = require("../../infrastructure/system/Logger.js");
class LoadGameProfile {
    roomRepository;
    gameProfileRepository;
    constructor(roomRepository, gameProfileRepository) {
        this.roomRepository = roomRepository;
        this.gameProfileRepository = gameProfileRepository;
    }
    async execute(roomCode, profileId) {
        const code = new domain_1.RoomCode(roomCode);
        const room = await this.roomRepository.findByCode(code);
        if (!room) {
            throw new domain_1.RoomNotFoundError(roomCode);
        }
        const gProfileId = new domain_1.GameProfileId(profileId);
        const profile = await this.gameProfileRepository.getById(gProfileId);
        if (!profile) {
            throw new domain_1.UnsupportedGameProfileError(profileId);
        }
        const updatedRoom = room.setGameProfile(gProfileId);
        await this.roomRepository.save(updatedRoom);
        Logger_js_1.Logger.info('LoadGameProfile', `Room ${roomCode} switched profile to: ${profile.name}`);
        return profile;
    }
}
exports.LoadGameProfile = LoadGameProfile;
class StartGame {
    roomRepository;
    constructor(roomRepository) {
        this.roomRepository = roomRepository;
    }
    async execute(roomCode) {
        const code = new domain_1.RoomCode(roomCode);
        const room = await this.roomRepository.findByCode(code);
        if (!room) {
            throw new domain_1.RoomNotFoundError(roomCode);
        }
        const updatedRoom = room.setState('in_game');
        await this.roomRepository.save(updatedRoom);
        Logger_js_1.Logger.info('StartGame', `Game started in room ${roomCode}`);
    }
}
exports.StartGame = StartGame;
class StopGame {
    roomRepository;
    virtualGamepad;
    constructor(roomRepository, virtualGamepad) {
        this.roomRepository = roomRepository;
        this.virtualGamepad = virtualGamepad;
    }
    async execute(roomCode) {
        const code = new domain_1.RoomCode(roomCode);
        const room = await this.roomRepository.findByCode(code);
        if (!room) {
            throw new domain_1.RoomNotFoundError(roomCode);
        }
        const updatedRoom = room.setState('waiting');
        await this.roomRepository.save(updatedRoom);
        await this.virtualGamepad.resetAll();
        Logger_js_1.Logger.info('StopGame', `Game stopped in room ${roomCode}`);
    }
}
exports.StopGame = StopGame;
class ResetController {
    virtualGamepad;
    constructor(virtualGamepad) {
        this.virtualGamepad = virtualGamepad;
    }
    async execute(slot) {
        if (slot !== undefined) {
            await this.virtualGamepad.reset(slot);
        }
        else {
            await this.virtualGamepad.resetAll();
        }
    }
}
exports.ResetController = ResetController;
//# sourceMappingURL=GameUseCases.js.map