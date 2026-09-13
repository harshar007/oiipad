"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketMessageHandler = void 0;
const ws_1 = require("ws");
const protocol_1 = require("@oiipad/protocol");
const Logger_js_1 = require("../../infrastructure/system/Logger.js");
class WebSocketMessageHandler {
    joinRoomUseCase;
    leaveRoomUseCase;
    setPlayerReadyUseCase;
    receiveControllerInputUseCase;
    disconnectPlayerUseCase;
    loadGameProfileUseCase;
    roomRepository;
    gameProfileRepository;
    // Map socket to authenticated player ID
    socketToPlayerMap = new Map();
    playerToSocketMap = new Map();
    constructor(joinRoomUseCase, leaveRoomUseCase, setPlayerReadyUseCase, receiveControllerInputUseCase, disconnectPlayerUseCase, loadGameProfileUseCase, roomRepository, gameProfileRepository) {
        this.joinRoomUseCase = joinRoomUseCase;
        this.leaveRoomUseCase = leaveRoomUseCase;
        this.setPlayerReadyUseCase = setPlayerReadyUseCase;
        this.receiveControllerInputUseCase = receiveControllerInputUseCase;
        this.disconnectPlayerUseCase = disconnectPlayerUseCase;
        this.loadGameProfileUseCase = loadGameProfileUseCase;
        this.roomRepository = roomRepository;
        this.gameProfileRepository = gameProfileRepository;
    }
    handleConnection(socket) {
        Logger_js_1.Logger.info('WebSocketHandler', 'Client connected to WebSocket server');
        socket.on('message', async (raw) => {
            try {
                const text = raw.toString();
                const parsed = (0, protocol_1.parseClientMessage)(text);
                if (!parsed.success) {
                    this.sendToSocket(socket, {
                        version: protocol_1.PROTOCOL_VERSION,
                        type: 'error',
                        code: 'INVALID_PROTOCOL_MESSAGE',
                        message: parsed.error,
                        timestamp: Date.now()
                    });
                    return;
                }
                await this.processMessage(socket, parsed.data);
            }
            catch (err) {
                Logger_js_1.Logger.error('WebSocketHandler', 'Error handling client message', err);
                this.sendToSocket(socket, {
                    version: protocol_1.PROTOCOL_VERSION,
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
            Logger_js_1.Logger.error('WebSocketHandler', 'Socket error', err);
        });
    }
    async processMessage(socket, msg) {
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
                        version: protocol_1.PROTOCOL_VERSION,
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
                }
                catch (err) {
                    this.sendToSocket(socket, {
                        version: protocol_1.PROTOCOL_VERSION,
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
                        version: protocol_1.PROTOCOL_VERSION,
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
                if (!session)
                    return;
                await this.setPlayerReadyUseCase.execute({
                    playerId: session.playerId,
                    ready: msg.ready
                });
                await this.broadcastRoomState(session.roomCode);
                break;
            }
            case 'select_profile': {
                const session = this.socketToPlayerMap.get(socket);
                if (!session)
                    return;
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
                    version: protocol_1.PROTOCOL_VERSION,
                    type: 'pong',
                    timestamp: Date.now()
                });
                break;
            }
        }
    }
    async handleDisconnect(socket) {
        const session = this.socketToPlayerMap.get(socket);
        if (session) {
            Logger_js_1.Logger.warn('WebSocketHandler', `Client disconnected: player ${session.playerId} in room ${session.roomCode}`);
            await this.disconnectPlayerUseCase.execute({ playerId: session.playerId });
            this.socketToPlayerMap.delete(socket);
            this.playerToSocketMap.delete(session.playerId);
            await this.broadcastRoomState(session.roomCode);
        }
    }
    async broadcastRoomState(roomCode) {
        const rooms = await this.roomRepository.getAll();
        const room = rooms.find((r) => r.code.value === roomCode);
        if (!room)
            return;
        const playersDto = Array.from(room.players.values()).map((p) => ({
            id: p.id.value,
            name: p.name,
            slot: p.slot,
            connectionState: p.connectionState,
            readyState: p.readyState
        }));
        const message = {
            version: protocol_1.PROTOCOL_VERSION,
            type: 'room_state',
            roomCode: room.code.value,
            state: room.state,
            gameProfile: room.gameProfile.value,
            players: playersDto,
            timestamp: Date.now()
        };
        for (const player of room.players.values()) {
            const socket = this.playerToSocketMap.get(player.id.value);
            if (socket && socket.readyState === ws_1.WebSocket.OPEN) {
                this.sendToSocket(socket, message);
            }
        }
    }
    sendToSocket(socket, message) {
        if (socket.readyState === ws_1.WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
        }
    }
}
exports.WebSocketMessageHandler = WebSocketMessageHandler;
//# sourceMappingURL=WebSocketMessageHandler.js.map