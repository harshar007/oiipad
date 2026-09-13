import {
  ControllerState,
  GameProfileRepositoryPort,
  PlayerId,
  RoomRepositoryPort,
  SteeringValue,
  VirtualGamepadPort,
  PlayerNotFoundError
} from '@oiipad/domain';
import { ControllerInputPayload } from '@oiipad/protocol';

export interface ReceiveControllerInputParams {
  playerId: string;
  payload: ControllerInputPayload;
}

export class ReceiveControllerInput {
  constructor(
    private roomRepository: RoomRepositoryPort,
    private gameProfileRepository: GameProfileRepositoryPort,
    private virtualGamepad: VirtualGamepadPort
  ) {}

  public async execute(params: ReceiveControllerInputParams): Promise<void> {
    const playerId = new PlayerId(params.playerId);
    const rooms = await this.roomRepository.getAll();

    let targetRoom;
    let targetPlayer;

    for (const room of rooms) {
      const player = room.getPlayer(playerId);
      if (player && player.connectionState === 'connected') {
        targetRoom = room;
        targetPlayer = player;
        break;
      }
    }

    if (!targetRoom || !targetPlayer) {
      throw new PlayerNotFoundError(params.playerId);
    }

    // Convert validated DTO to Domain ControllerState
    const steering = SteeringValue.fromClamped(params.payload.steering);
    const controllerState = new ControllerState({
      steering,
      accelerate: params.payload.accelerate,
      brake: params.payload.brake,
      handbrake: params.payload.handbrake,
      boost: params.payload.boost,
      powerUp: params.payload.powerUp,
      pause: params.payload.pause,
      buttons: params.payload.buttons,
      timestamp: Date.now()
    });

    // Update player model
    const updatedPlayer = targetPlayer.updateControllerState(controllerState);
    const updatedRoom = targetRoom.updatePlayer(updatedPlayer);
    await this.roomRepository.save(updatedRoom);

    // Retrieve active game profile for the room mapping
    const gameProfile = await this.gameProfileRepository.getById(targetRoom.gameProfile);
    if (gameProfile) {
      // Direct hardware/virtual gamepad update targeting the player's specific slot (1-4)
      await this.virtualGamepad.update(targetPlayer.slot, controllerState, gameProfile);
    }

    // Telemetry output for PC Server GUI (Player Slots 1-4)
    console.log(`[TELEMETRY] ${JSON.stringify({
      slot: targetPlayer.slot,
      steer: controllerState.steering.value,
      accel: controllerState.accelerate,
      brake: controllerState.brake,
      handbrake: controllerState.handbrake,
      boost: controllerState.boost,
      powerUp: controllerState.powerUp,
      buttons: controllerState.buttons,
      profile: gameProfile?.id?.value || 'bbr1'
    })}`);
  }
}
