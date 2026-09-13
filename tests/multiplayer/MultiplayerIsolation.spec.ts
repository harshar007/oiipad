import {
  CreateRoom,
  JoinRoom,
  DisconnectPlayer,
  ReceiveControllerInput
} from '../../apps/pc-server/src/application/useCases/index.js';
import { InMemoryRoomRepository } from '../../apps/pc-server/src/infrastructure/persistence/InMemoryRoomRepository.js';
import { JsonGameProfileRepository } from '../../apps/pc-server/src/infrastructure/persistence/JsonGameProfileRepository.js';
import { MockVirtualGamepadAdapter } from '../../apps/pc-server/src/infrastructure/virtualGamepad/MockVirtualGamepadAdapter.js';

describe('Multiplayer Controller Isolation & Disconnect Safety (Section 34 & 42)', () => {
  let roomRepo: InMemoryRoomRepository;
  let gameProfileRepo: JsonGameProfileRepository;
  let virtualGamepad: MockVirtualGamepadAdapter;
  let createRoom: CreateRoom;
  let joinRoom: JoinRoom;
  let disconnectPlayer: DisconnectPlayer;
  let receiveInput: ReceiveControllerInput;

  beforeEach(async () => {
    roomRepo = new InMemoryRoomRepository();
    gameProfileRepo = new JsonGameProfileRepository();
    virtualGamepad = new MockVirtualGamepadAdapter();

    createRoom = new CreateRoom(roomRepo);
    joinRoom = new JoinRoom(roomRepo, virtualGamepad);
    disconnectPlayer = new DisconnectPlayer(roomRepo, virtualGamepad);
    receiveInput = new ReceiveControllerInput(roomRepo, gameProfileRepo, virtualGamepad);

    await createRoom.execute({ roomCode: 'BBR1', maxPlayers: 4 });
  });

  it('Player 1 and Player 2 are assigned unique controller slots', async () => {
    const res1 = await joinRoom.execute({ roomCode: 'BBR1', playerName: 'Player 1', playerId: 'p1' });
    const res2 = await joinRoom.execute({ roomCode: 'BBR1', playerName: 'Player 2', playerId: 'p2' });

    expect(res1.player.slot).toBe(1);
    expect(res2.player.slot).toBe(2);

    expect(virtualGamepad.isConnected(1)).toBe(true);
    expect(virtualGamepad.isConnected(2)).toBe(true);
  });

  it('Input Isolation: P1 steering only affects Controller #1, P2 only affects Controller #2', async () => {
    await joinRoom.execute({ roomCode: 'BBR1', playerName: 'Player 1', playerId: 'p1' });
    await joinRoom.execute({ roomCode: 'BBR1', playerName: 'Player 2', playerId: 'p2' });

    // P1 steers left (-0.8) and accelerates (1.0)
    await receiveInput.execute({
      playerId: 'p1',
      payload: {
        steering: -0.8,
        accelerate: 1.0,
        brake: 0.0,
        handbrake: false,
        boost: false,
        powerUp: false,
        pause: false,
        buttons: {}
      }
    });

    // P2 steers right (+0.5) and presses power-up (A)
    await receiveInput.execute({
      playerId: 'p2',
      payload: {
        steering: 0.5,
        accelerate: 0.0,
        brake: 0.5,
        handbrake: false,
        boost: false,
        powerUp: true,
        pause: false,
        buttons: {}
      }
    });

    const slot1 = virtualGamepad.getSlotState(1);
    const slot2 = virtualGamepad.getSlotState(2);

    expect(slot1?.leftStickX).toBe(-0.8);
    expect(slot1?.rightTrigger).toBe(1.0);
    expect(slot1?.buttons.has('A')).toBe(false);

    expect(slot2?.leftStickX).toBe(0.5);
    expect(slot2?.leftTrigger).toBe(0.5);
    expect(slot2?.buttons.has('A')).toBe(true);
  });

  it('Disconnect Safety: Disconnecting P1 immediately resets controller #1 inputs and clears buttons', async () => {
    await joinRoom.execute({ roomCode: 'BBR1', playerName: 'Player 1', playerId: 'p1' });

    // Active input
    await receiveInput.execute({
      playerId: 'p1',
      payload: {
        steering: 1.0,
        accelerate: 1.0,
        brake: 0.0,
        handbrake: false,
        boost: true,
        powerUp: false,
        pause: false,
        buttons: {}
      }
    });

    expect(virtualGamepad.getSlotState(1)?.rightTrigger).toBe(1.0);
    expect(virtualGamepad.getSlotState(1)?.buttons.has('Y')).toBe(true);

    // Disconnect
    await disconnectPlayer.execute({ playerId: 'p1' });

    const slot1 = virtualGamepad.getSlotState(1);
    expect(slot1?.leftStickX).toBe(0);
    expect(slot1?.rightTrigger).toBe(0);
    expect(slot1?.leftTrigger).toBe(0);
    expect(slot1?.buttons.size).toBe(0);
  });
});
