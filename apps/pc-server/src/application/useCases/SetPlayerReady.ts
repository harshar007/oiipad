import { PlayerId, RoomRepositoryPort, PlayerNotFoundError } from '@oiipad/domain';
import { Logger } from '../../infrastructure/system/Logger.js';

export interface SetPlayerReadyInput {
  playerId: string;
  ready: boolean;
}

export class SetPlayerReady {
  constructor(private roomRepository: RoomRepositoryPort) {}

  public async execute(input: SetPlayerReadyInput): Promise<void> {
    const rooms = await this.roomRepository.getAll();
    const playerId = new PlayerId(input.playerId);

    for (const room of rooms) {
      const player = room.getPlayer(playerId);
      if (player) {
        const updatedPlayer = player.setReady(input.ready);
        const updatedRoom = room.updatePlayer(updatedPlayer);
        await this.roomRepository.save(updatedRoom);
        Logger.info('SetPlayerReady', `Player ${player.name} ready status set to: ${input.ready}`);
        return;
      }
    }

    throw new PlayerNotFoundError(input.playerId);
  }
}
