import { WebSocket } from 'ws';
import { JoinRoom, LeaveRoom, SetPlayerReady, ReceiveControllerInput, DisconnectPlayer, LoadGameProfile } from '../../application/useCases/index.js';
import { RoomRepositoryPort, GameProfileRepositoryPort } from '@oiipad/domain';
export declare class WebSocketMessageHandler {
    private joinRoomUseCase;
    private leaveRoomUseCase;
    private setPlayerReadyUseCase;
    private receiveControllerInputUseCase;
    private disconnectPlayerUseCase;
    private loadGameProfileUseCase;
    private roomRepository;
    private gameProfileRepository;
    private socketToPlayerMap;
    private playerToSocketMap;
    constructor(joinRoomUseCase: JoinRoom, leaveRoomUseCase: LeaveRoom, setPlayerReadyUseCase: SetPlayerReady, receiveControllerInputUseCase: ReceiveControllerInput, disconnectPlayerUseCase: DisconnectPlayer, loadGameProfileUseCase: LoadGameProfile, roomRepository: RoomRepositoryPort, gameProfileRepository: GameProfileRepositoryPort);
    handleConnection(socket: WebSocket): void;
    private processMessage;
    handleDisconnect(socket: WebSocket): Promise<void>;
    broadcastRoomState(roomCode: string): Promise<void>;
    private sendToSocket;
}
//# sourceMappingURL=WebSocketMessageHandler.d.ts.map