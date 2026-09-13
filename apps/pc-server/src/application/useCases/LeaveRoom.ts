import {
  PlayerId,
  RoomCode,
  RoomRepositoryPort,
  VirtualGamepadPort
} from '@oiipad/domain';
import { Logger } from '../../infrastructure/system/Logger.js';

export interface LeaveRoomInput {
  roomCode: string;
  playerId: string;
}

export class LeaveRoom {
  constructor(
    private roomRepository: RoomRepositoryPort,
    private virtualGamepad: VirtualGamepadPort
  ) {}

  public async execute(input: LeaveRoomInput): Promise<void> {
    const code = new RoomCode(input.roomCode);
    const room = await this.roomRepository.findByCode(code);
    if (!room) return;

    const playerId = new PlayerId(input.playerId);
    const player = room.getPlayer(playerId);
    if (player) {
      await this.virtualGamepad.reset(player.slot);
      await this.virtualGamepad.disconnect(player.slot);
      const updatedRoom = room.removePlayer(playerId);
      await this.roomRepository.save(updatedRoom);
      Logger.info('LeaveRoom', `Player ${player.name} left room ${room.code.value} (slot ${player.slot} released)`);
    }
  }
}
