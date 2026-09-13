import {
  Player,
  PlayerId,
  Room,
  RoomCode,
  PlayerSlotNumber,
  RoomRepositoryPort,
  VirtualGamepadPort,
  RoomNotFoundError
} from '@oiipad/domain';
import { Logger } from '../../infrastructure/system/Logger.js';

export interface JoinRoomInput {
  roomCode: string;
  playerName: string;
  playerId?: string;
  preferredSlot?: PlayerSlotNumber;
}

export interface JoinRoomOutput {
  room: Room;
  player: Player;
}

export class JoinRoom {
  constructor(
    private roomRepository: RoomRepositoryPort,
    private virtualGamepad: VirtualGamepadPort
  ) {}

  public async execute(input: JoinRoomInput): Promise<JoinRoomOutput> {
    const code = new RoomCode(input.roomCode);
    const room = await this.roomRepository.findByCode(code);
    if (!room) {
      throw new RoomNotFoundError(input.roomCode);
    }

    const playerId = input.playerId ? new PlayerId(input.playerId) : new PlayerId(Math.random().toString(36).substring(2, 9));

    // Check if player is reconnecting
    const existingPlayer = room.getPlayer(playerId);
    let slot: PlayerSlotNumber;

    if (existingPlayer) {
      slot = existingPlayer.slot;
      const updatedPlayer = existingPlayer.setConnectionState('connected');
      const updatedRoom = room.updatePlayer(updatedPlayer);
      await this.virtualGamepad.connect(slot);
      await this.roomRepository.save(updatedRoom);
      Logger.info('JoinRoom', `Player ${updatedPlayer.name} reconnected to room ${room.code.value} in slot ${slot}`);
      return { room: updatedRoom, player: updatedPlayer };
    }

    // Determine available slot
    slot = input.preferredSlot ?? room.getAvailableSlot();

    const player = new Player({
      id: playerId,
      name: input.playerName,
      slot,
      connectionState: 'connected',
      readyState: false
    });

    const updatedRoom = room.addPlayer(player);
    await this.virtualGamepad.connect(slot);
    await this.roomRepository.save(updatedRoom);

    Logger.info('JoinRoom', `Player ${player.name} (${player.id.value}) joined room ${room.code.value} in slot ${slot}`);
    return { room: updatedRoom, player };
  }
}
