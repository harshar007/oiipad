export declare class DomainError extends Error {
    constructor(message: string);
}
export declare class InvalidSteeringValueError extends DomainError {
    constructor(value: number);
}
export declare class RoomNotFoundError extends DomainError {
    constructor(roomCode: string);
}
export declare class RoomFullError extends DomainError {
    constructor(maxPlayers: number);
}
export declare class PlayerNotFoundError extends DomainError {
    constructor(playerId: string);
}
export declare class SlotAlreadyOccupiedError extends DomainError {
    constructor(slot: number);
}
export declare class NoAvailableSlotError extends DomainError {
    constructor();
}
export declare class InvalidControllerInputError extends DomainError {
    constructor(details: string);
}
export declare class UnsupportedGameProfileError extends DomainError {
    constructor(profileId: string);
}
export declare class ConnectionError extends DomainError {
    constructor(message: string);
}
export declare class CalibrationError extends DomainError {
    constructor(message: string);
}
//# sourceMappingURL=DomainErrors.d.ts.map