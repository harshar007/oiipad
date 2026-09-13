import {
  GameProfile,
  GameProfileId,
  GameProfileRepositoryPort,
  RoomCode,
  RoomRepositoryPort,
  VirtualGamepadPort,
  RoomNotFoundError,
  UnsupportedGameProfileError
} from '@oiipad/domain';
import { Logger } from '../../infrastructure/system/Logger.js';

export class LoadGameProfile {
  constructor(
    private roomRepository: RoomRepositoryPort,
    private gameProfileRepository: GameProfileRepositoryPort
  ) {}

  public async execute(roomCode: string, profileId: string): Promise<GameProfile> {
    const code = new RoomCode(roomCode);
    const room = await this.roomRepository.findByCode(code);
    if (!room) {
      throw new RoomNotFoundError(roomCode);
    }

    const gProfileId = new GameProfileId(profileId);
    const profile = await this.gameProfileRepository.getById(gProfileId);
    if (!profile) {
      throw new UnsupportedGameProfileError(profileId);
    }

    const updatedRoom = room.setGameProfile(gProfileId);
    await this.roomRepository.save(updatedRoom);
    Logger.info('LoadGameProfile', `Room ${roomCode} switched profile to: ${profile.name}`);
    return profile;
  }
}

export class StartGame {
  constructor(private roomRepository: RoomRepositoryPort) {}

  public async execute(roomCode: string): Promise<void> {
    const code = new RoomCode(roomCode);
    const room = await this.roomRepository.findByCode(code);
    if (!room) {
      throw new RoomNotFoundError(roomCode);
    }

    const updatedRoom = room.setState('in_game');
    await this.roomRepository.save(updatedRoom);
    Logger.info('StartGame', `Game started in room ${roomCode}`);
  }
}

export class StopGame {
  constructor(
    private roomRepository: RoomRepositoryPort,
    private virtualGamepad: VirtualGamepadPort
  ) {}

  public async execute(roomCode: string): Promise<void> {
    const code = new RoomCode(roomCode);
    const room = await this.roomRepository.findByCode(code);
    if (!room) {
      throw new RoomNotFoundError(roomCode);
    }

    const updatedRoom = room.setState('waiting');
    await this.roomRepository.save(updatedRoom);
    await this.virtualGamepad.resetAll();
    Logger.info('StopGame', `Game stopped in room ${roomCode}`);
  }
}

export class ResetController {
  constructor(private virtualGamepad: VirtualGamepadPort) {}

  public async execute(slot?: number): Promise<void> {
    if (slot !== undefined) {
      await this.virtualGamepad.reset(slot);
    } else {
      await this.virtualGamepad.resetAll();
    }
  }
}
