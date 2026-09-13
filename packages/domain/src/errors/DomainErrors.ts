export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class InvalidSteeringValueError extends DomainError {
  constructor(value: number) {
    super(`Invalid steering value: ${value}. Must be a finite number between -1.0 and 1.0.`);
  }
}

export class RoomNotFoundError extends DomainError {
  constructor(roomCode: string) {
    super(`Room with code '${roomCode}' not found.`);
  }
}

export class RoomFullError extends DomainError {
  constructor(maxPlayers: number) {
    super(`Room is full. Maximum players reached: ${maxPlayers}.`);
  }
}

export class PlayerNotFoundError extends DomainError {
  constructor(playerId: string) {
    super(`Player with ID '${playerId}' not found in the room.`);
  }
}

export class SlotAlreadyOccupiedError extends DomainError {
  constructor(slot: number) {
    super(`Player slot ${slot} is already occupied.`);
  }
}

export class NoAvailableSlotError extends DomainError {
  constructor() {
    super('No available player slot in the room.');
  }
}

export class InvalidControllerInputError extends DomainError {
  constructor(details: string) {
    super(`Invalid controller input: ${details}`);
  }
}

export class UnsupportedGameProfileError extends DomainError {
  constructor(profileId: string) {
    super(`Unsupported game profile: '${profileId}'.`);
  }
}

export class ConnectionError extends DomainError {
  constructor(message: string) {
    super(`Connection error: ${message}`);
  }
}

export class CalibrationError extends DomainError {
  constructor(message: string) {
    super(`Calibration error: ${message}`);
  }
}
