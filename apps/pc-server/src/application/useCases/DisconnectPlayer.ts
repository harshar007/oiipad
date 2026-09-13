import {
  PlayerId,
  RoomRepositoryPort,
  VirtualGamepadPort
} from '@oiipad/domain';
import { Logger } from '../../infrastructure/system/Logger.js';

export interface DisconnectPlayerInput {
  playerId: string;
}

export class DisconnectPlayer {
  constructor(
    private roomRepository: RoomRepositoryPort,
    private virtualGamepad: VirtualGamepadPort
  ) {}

  public async execute(input: DisconnectPlayerInput): Promise<void> {
    const rooms = await this.roomRepository.getAll();
    const playerId = new PlayerId(input.playerId);

    for (const room of rooms) {
      const player = room.getPlayer(playerId);
      if (player) {
        // Disconnect safety: Reset controller inputs and release buttons immediately
        await this.virtualGamepad.reset(player.slot);
        await this.virtualGamepad.disconnect(player.slot);

        // Update player connection state
        const disconnectedPlayer = player.setConnectionState('disconnected');
        const updatedRoom = room.updatePlayer(disconnectedPlayer);
        await this.roomRepository.save(updatedRoom);

        Logger.warn('DisconnectPlayer', `Player ${player.name} (${player.id.value}) disconnected. Gamepad #${player.slot} safely reset and released.`);
      }
    }
  }
}
