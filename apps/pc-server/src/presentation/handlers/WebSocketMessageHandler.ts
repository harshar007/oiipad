import { WebSocket } from 'ws';
import {
  parseClientMessage,
  ClientMessage,
  ServerMessage,
  PROTOCOL_VERSION
} from '@oiipad/protocol';
import {
  JoinRoom,
  LeaveRoom,
  SetPlayerReady,
  ReceiveControllerInput,
  DisconnectPlayer,
  LoadGameProfile
} from '../../application/useCases/index.js';
import { RoomRepositoryPort, GameProfileRepositoryPort } from '@oiipad/domain';
import { Logger } from '../../infrastructure/system/Logger.js';

export class WebSocketMessageHandler {
  // Map socket to authenticated player ID
  private socketToPlayerMap: Map<WebSocket, { playerId: string; roomCode: string }> = new Map();
  private playerToSocketMap: Map<string, WebSocket> = new Map();

  constructor(
    private joinRoomUseCase: JoinRoom,
    private leaveRoomUseCase: LeaveRoom,
    private setPlayerReadyUseCase: SetPlayerReady,
    private receiveControllerInputUseCase: ReceiveControllerInput,
    private disconnectPlayerUseCase: DisconnectPlayer,
    private loadGameProfileUseCase: LoadGameProfile,
    private roomRepository: RoomRepositoryPort,
    private gameProfileRepository: GameProfileRepositoryPort
  ) {}

  public handleConnection(socket: WebSocket): void {
    Logger.info('WebSocketHandler', 'Client connected to WebSocket server');

    socket.on('message', async (raw: Buffer | string) => {
      try {
        const text = raw.toString();
        const parsed = parseClientMessage(text);
        if (!parsed.success) {
          this.sendToSocket(socket, {
            version: PROTOCOL_VERSION,
            type: 'error',
            code: 'INVALID_PROTOCOL_MESSAGE',
            message: parsed.error,
            timestamp: Date.now()
          });
          return;
        }

        await this.processMessage(socket, parsed.data);
      } catch (err: any) {
        Logger.error('WebSocketHandler', 'Error handling client message', err);
        this.sendToSocket(socket, {
          version: PROTOCOL_VERSION,
          type: 'error',
          code: 'INTERNAL_SERVER_ERROR',
          message: err.message || 'An unexpected error occurred',
          timestamp: Date.now()
        });
      }
    });

    socket.on('close', async () => {
      await this.handleDisconnect(socket);
    });

    socket.on('error', (err) => {
      Logger.error('WebSocketHandler', 'Socket error', err);
    });
  }

  private async processMessage(socket: WebSocket, msg: ClientMessage): Promise<void> {
    switch (msg.type) {
      case 'join_room': {
        try {
          const result = await this.joinRoomUseCase.execute({
            roomCode: msg.roomCode,
            playerName: msg.playerName,
            preferredSlot: msg.preferredSlot
          });

          // Associate socket with player ID
          this.socketToPlayerMap.set(socket, {
            playerId: result.player.id.value,
            roomCode: result.room.code.value
          });
          this.playerToSocketMap.set(result.player.id.value, socket);

          const playersDto = Array.from(result.room.players.values()).map((p) => ({
            id: p.id.value,
            name: p.name,
            slot: p.slot,
            connectionState: p.connectionState,
            readyState: p.readyState
          }));

          // Send confirmation to the joining player
          this.sendToSocket(socket, {
            version: PROTOCOL_VERSION,
            type: 'join_room_response',
            success: true,
            playerId: result.player.id.value,
            slot: result.player.slot,
            roomCode: result.room.code.value,
            gameProfile: result.room.gameProfile.value,
            players: playersDto,
            timestamp: Date.now()
          });

          // Broadcast updated room state to all players in the room
          await this.broadcastRoomState(result.room.code.value);

          console.log(`[PLAYER_EVENT] ${JSON.stringify({
            event: 'join',
            slot: result.player.slot,
            name: result.player.name,
            id: result.player.id.value,
            gameProfile: result.room.gameProfile.value
          })}`);
        } catch (err: any) {
          this.sendToSocket(socket, {
            version: PROTOCOL_VERSION,
            type: 'join_room_response',
            success: false,
            error: err.message,
            timestamp: Date.now()
          });
        }
        break;
      }

      case 'controller_input': {
        const session = this.socketToPlayerMap.get(socket);
        if (!session) {
          this.sendToSocket(socket, {
            version: PROTOCOL_VERSION,
            type: 'error',
            code: 'UNAUTHORIZED_INPUT',
            message: 'Player session not established. Please join a room first.',
            timestamp: Date.now()
          });
          return;
        }

        // Security rule: Authoritative server overrides client-provided playerId with authenticated session ID
        await this.receiveControllerInputUseCase.execute({
          playerId: session.playerId,
          payload: msg.payload
        });
        break;
      }

      case 'set_ready': {
        const session = this.socketToPlayerMap.get(socket);
        if (!session) return;

        await this.setPlayerReadyUseCase.execute({
          playerId: session.playerId,
          ready: msg.ready
        });

        await this.broadcastRoomState(session.roomCode);
        break;
      }

      case 'select_profile': {
        const session = this.socketToPlayerMap.get(socket);
        if (!session) return;

        await this.loadGameProfileUseCase.execute(session.roomCode, msg.profileId);
        await this.broadcastRoomState(session.roomCode);
        break;
      }

      case 'leave_room': {
        const session = this.socketToPlayerMap.get(socket);
        if (session) {
          await this.leaveRoomUseCase.execute({
            roomCode: session.roomCode,
            playerId: session.playerId
          });
          this.socketToPlayerMap.delete(socket);
          this.playerToSocketMap.delete(session.playerId);
          await this.broadcastRoomState(session.roomCode);
        }
        break;
      }

      case 'ping': {
        this.sendToSocket(socket, {
          version: PROTOCOL_VERSION,
          type: 'pong',
          clientTime: msg.clientTime,
          timestamp: Date.now()
        });
        break;
      }
    }
  }

  public async handleDisconnect(socket: WebSocket): Promise<void> {
    const session = this.socketToPlayerMap.get(socket);
    if (session) {
      Logger.warn('WebSocketHandler', `Client disconnected: player ${session.playerId} in room ${session.roomCode}`);
      await this.disconnectPlayerUseCase.execute({ playerId: session.playerId });
      this.socketToPlayerMap.delete(socket);
      this.playerToSocketMap.delete(session.playerId);
      await this.broadcastRoomState(session.roomCode);

      console.log(`[PLAYER_EVENT] ${JSON.stringify({
        event: 'leave',
        id: session.playerId
      })}`);
    }
  }

  public async broadcastRoomState(roomCode: string): Promise<void> {
    const rooms = await this.roomRepository.getAll();
    const room = rooms.find((r) => r.code.value === roomCode);
    if (!room) return;

    const playersDto = Array.from(room.players.values()).map((p) => ({
      id: p.id.value,
      name: p.name,
      slot: p.slot,
      connectionState: p.connectionState,
      readyState: p.readyState
    }));

    const message: ServerMessage = {
      version: PROTOCOL_VERSION,
      type: 'room_state',
      roomCode: room.code.value,
      state: room.state,
      gameProfile: room.gameProfile.value,
      players: playersDto,
      timestamp: Date.now()
    };

    for (const player of room.players.values()) {
      const socket = this.playerToSocketMap.get(player.id.value);
      if (socket && socket.readyState === WebSocket.OPEN) {
        this.sendToSocket(socket, message);
      }
    }
  }

  private sendToSocket(socket: WebSocket, message: ServerMessage): void {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  }
}
