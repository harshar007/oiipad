"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InMemoryRoomRepository_js_1 = require("./infrastructure/persistence/InMemoryRoomRepository.js");
const JsonGameProfileRepository_js_1 = require("./infrastructure/persistence/JsonGameProfileRepository.js");
const WindowsViGEmGamepadAdapter_js_1 = require("./infrastructure/virtualGamepad/WindowsViGEmGamepadAdapter.js");
const GynooWebSocketServer_js_1 = require("./infrastructure/websocket/GynooWebSocketServer.js");
const UdpPcDiscoveryServer_js_1 = require("./infrastructure/discovery/UdpPcDiscoveryServer.js");
const WebSocketMessageHandler_js_1 = require("./presentation/handlers/WebSocketMessageHandler.js");
const index_js_1 = require("./application/useCases/index.js");
const ServerConfig_js_1 = require("./config/ServerConfig.js");
const Logger_js_1 = require("./infrastructure/system/Logger.js");
const NetworkUtils_js_1 = require("./infrastructure/system/NetworkUtils.js");
async function bootstrap() {
    console.log(`
  ==============================================================
     GYNOO (OII PAD) - WIRELESS MOBILE GAME CONTROLLER SERVER   
     Clean Architecture + Gyro Steering Platform                
  ==============================================================
  `);
    // 1. Initialize Infrastructure Adapters & Repositories
    const roomRepository = new InMemoryRoomRepository_js_1.InMemoryRoomRepository();
    const gameProfileRepository = new JsonGameProfileRepository_js_1.JsonGameProfileRepository();
    const virtualGamepadAdapter = new WindowsViGEmGamepadAdapter_js_1.WindowsViGEmGamepadAdapter();
    // 2. Initialize Application Use Cases
    const createRoomUseCase = new index_js_1.CreateRoom(roomRepository);
    const joinRoomUseCase = new index_js_1.JoinRoom(roomRepository, virtualGamepadAdapter);
    const leaveRoomUseCase = new index_js_1.LeaveRoom(roomRepository, virtualGamepadAdapter);
    const disconnectPlayerUseCase = new index_js_1.DisconnectPlayer(roomRepository, virtualGamepadAdapter);
    const receiveControllerInputUseCase = new index_js_1.ReceiveControllerInput(roomRepository, gameProfileRepository, virtualGamepadAdapter);
    const setPlayerReadyUseCase = new index_js_1.SetPlayerReady(roomRepository);
    const loadGameProfileUseCase = new index_js_1.LoadGameProfile(roomRepository, gameProfileRepository);
    // 3. Initialize Presentation Handlers
    const messageHandler = new WebSocketMessageHandler_js_1.WebSocketMessageHandler(joinRoomUseCase, leaveRoomUseCase, setPlayerReadyUseCase, receiveControllerInputUseCase, disconnectPlayerUseCase, loadGameProfileUseCase, roomRepository, gameProfileRepository);
    // 4. Create Default Game Room
    const initialRoom = await createRoomUseCase.execute({
        roomCode: ServerConfig_js_1.DEFAULT_SERVER_CONFIG.defaultRoomCode,
        gameProfileId: 'bbr1',
        maxPlayers: ServerConfig_js_1.DEFAULT_SERVER_CONFIG.maxPlayers
    });
    // 5. Start WebSocket Server
    const wsServer = new GynooWebSocketServer_js_1.GynooWebSocketServer(ServerConfig_js_1.DEFAULT_SERVER_CONFIG.wsPort, messageHandler);
    const actualPort = await wsServer.start();
    // 6. Start UDP PC Discovery Server
    const discoveryServer = new UdpPcDiscoveryServer_js_1.UdpPcDiscoveryServer({
        discoveryPort: ServerConfig_js_1.DEFAULT_SERVER_CONFIG.discoveryPort,
        wsPort: actualPort,
        serverName: ServerConfig_js_1.DEFAULT_SERVER_CONFIG.serverName
    }, roomRepository);
    try {
        await discoveryServer.start();
    }
    catch (err) {
        Logger_js_1.Logger.warn('Bootstrap', 'UDP discovery port binding skipped or unavailable. Manual IP connection is still active.');
    }
    const localIps = NetworkUtils_js_1.NetworkUtils.getLocalIpAddresses();
    const primaryIp = NetworkUtils_js_1.NetworkUtils.getPrimaryLocalIp();
    const connectUri = `gynoo://${primaryIp}:${actualPort}/${initialRoom.code.value}`;
    console.log(`[PORT] ${actualPort}`);
    console.log(`[STATUS] ONLINE`);
    console.log(`
  [+] Server Status : ONLINE
  [+] Active Room   : ${initialRoom.code.value}
  [+] Game Profile  : Beach Buggy Racing 1 (bbr1)
  [+] WebSocket Port: ${actualPort}
  [+] Primary Host  : ${primaryIp}

  ┌────────────────────────────────────────────────────────────┐
  │  SCAN THIS QR CODE ON YOUR PHONE TO CONNECT INSTANTLY:     │
  └────────────────────────────────────────────────────────────┘
  `);
    try {
        const qrcode = require('qrcode-terminal');
        qrcode.generate(connectUri, { small: true }, (qrStr) => {
            console.log(qrStr);
        });
    }
    catch {
        // Fallback if qrcode-terminal isn't available
    }
    console.log(`
  [+] Or Connect Manually:
      ${localIps.map((ip) => `• ws://${ip}:${actualPort} (Room: ${initialRoom.code.value})`).join('\n      ')}

  Ready for 1-4 players! Tilt phone to steer.
  Press Ctrl+C to stop server safely.
  ==============================================================
  `);
    // Graceful shutdown handling
    const shutdown = async () => {
        console.log('\nStopping Gynoo PC Server...');
        await virtualGamepadAdapter.resetAll();
        await wsServer.stop();
        await discoveryServer.stop();
        console.log('Gynoo server stopped safely.');
        process.exit(0);
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
}
bootstrap().catch((err) => {
    Logger_js_1.Logger.error('Bootstrap', 'Fatal error during server startup', err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map