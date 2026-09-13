import { GynooWebSocketClient } from '../../infrastructure/networking/GynooWebSocketClient';
import { PROTOCOL_VERSION } from '@oiipad/protocol';

export class ConnectToPc {
  constructor(private wsClient: GynooWebSocketClient) {}

  public async execute(host: string, port: number = 8080): Promise<void> {
    const url = `ws://${host}:${port}`;
    await this.wsClient.connect(url);
  }
}

export class DisconnectFromPc {
  constructor(private wsClient: GynooWebSocketClient) {}

  public execute(): void {
    this.wsClient.disconnect();
  }
}

export class JoinRoomMobile {
  constructor(private wsClient: GynooWebSocketClient) {}

  public execute(roomCode: string, playerName: string, preferredSlot?: 1 | 2 | 3 | 4): void {
    this.wsClient.send({
      version: PROTOCOL_VERSION,
      type: 'join_room',
      roomCode,
      playerName,
      preferredSlot,
      timestamp: Date.now()
    });
  }
}

export class LeaveRoomMobile {
  constructor(private wsClient: GynooWebSocketClient) {}

  public execute(playerId: string): void {
    this.wsClient.send({
      version: PROTOCOL_VERSION,
      type: 'leave_room',
      playerId,
      timestamp: Date.now()
    });
  }
}

export class SetPlayerReadyMobile {
  constructor(private wsClient: GynooWebSocketClient) {}

  public execute(playerId: string, ready: boolean): void {
    this.wsClient.send({
      version: PROTOCOL_VERSION,
      type: 'set_ready',
      playerId,
      ready,
      timestamp: Date.now()
    });
  }
}

export class SelectGameProfileMobile {
  constructor(private wsClient: GynooWebSocketClient) {}

  public execute(profileId: string): void {
    this.wsClient.send({
      version: PROTOCOL_VERSION,
      type: 'select_profile',
      profileId,
      timestamp: Date.now()
    });
  }
}
