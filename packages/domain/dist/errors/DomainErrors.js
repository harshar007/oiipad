"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalibrationError = exports.ConnectionError = exports.UnsupportedGameProfileError = exports.InvalidControllerInputError = exports.NoAvailableSlotError = exports.SlotAlreadyOccupiedError = exports.PlayerNotFoundError = exports.RoomFullError = exports.RoomNotFoundError = exports.InvalidSteeringValueError = exports.DomainError = void 0;
class DomainError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
exports.DomainError = DomainError;
class InvalidSteeringValueError extends DomainError {
    constructor(value) {
        super(`Invalid steering value: ${value}. Must be a finite number between -1.0 and 1.0.`);
    }
}
exports.InvalidSteeringValueError = InvalidSteeringValueError;
class RoomNotFoundError extends DomainError {
    constructor(roomCode) {
        super(`Room with code '${roomCode}' not found.`);
    }
}
exports.RoomNotFoundError = RoomNotFoundError;
class RoomFullError extends DomainError {
    constructor(maxPlayers) {
        super(`Room is full. Maximum players reached: ${maxPlayers}.`);
    }
}
exports.RoomFullError = RoomFullError;
class PlayerNotFoundError extends DomainError {
    constructor(playerId) {
        super(`Player with ID '${playerId}' not found in the room.`);
    }
}
exports.PlayerNotFoundError = PlayerNotFoundError;
class SlotAlreadyOccupiedError extends DomainError {
    constructor(slot) {
        super(`Player slot ${slot} is already occupied.`);
    }
}
exports.SlotAlreadyOccupiedError = SlotAlreadyOccupiedError;
class NoAvailableSlotError extends DomainError {
    constructor() {
        super('No available player slot in the room.');
    }
}
exports.NoAvailableSlotError = NoAvailableSlotError;
class InvalidControllerInputError extends DomainError {
    constructor(details) {
        super(`Invalid controller input: ${details}`);
    }
}
exports.InvalidControllerInputError = InvalidControllerInputError;
class UnsupportedGameProfileError extends DomainError {
    constructor(profileId) {
        super(`Unsupported game profile: '${profileId}'.`);
    }
}
exports.UnsupportedGameProfileError = UnsupportedGameProfileError;
class ConnectionError extends DomainError {
    constructor(message) {
        super(`Connection error: ${message}`);
    }
}
exports.ConnectionError = ConnectionError;
class CalibrationError extends DomainError {
    constructor(message) {
        super(`Calibration error: ${message}`);
    }
}
exports.CalibrationError = CalibrationError;
//# sourceMappingURL=DomainErrors.js.map