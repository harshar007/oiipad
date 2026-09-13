import { Room, RoomCode, GameProfileId, RoomRepositoryPort } from '@oiipad/domain';
import { Logger } from '../../infrastructure/system/Logger.js';

export interface CreateRoomInput {
  roomCode?: string;
  gameProfileId?: string;
  maxPlayers?: number;
}

export class CreateRoom {
  constructor(private roomRepository: RoomRepositoryPort) {}

  public async execute(input: CreateRoomInput = {}): Promise<Room> {
    const code = input.roomCode ? new RoomCode(input.roomCode) : RoomCode.generate();
    const gameProfile = input.gameProfileId ? new GameProfileId(input.gameProfileId) : GameProfileId.BBR1;

    const room = new Room({
      id: code.value,
      code,
      maxPlayers: input.maxPlayers ?? 4,
      gameProfile,
      state: 'waiting'
    });

    await this.roomRepository.save(room);
    Logger.info('CreateRoom', `Room created: ${room.code.value} (Max Players: ${room.maxPlayers}, Profile: ${room.gameProfile.value})`);
    return room;
  }
}
