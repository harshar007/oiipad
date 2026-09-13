import { InMemoryRoomRepository } from './infrastructure/persistence/InMemoryRoomRepository.js';
import { JsonGameProfileRepository } from './infrastructure/persistence/JsonGameProfileRepository.js';
import { WindowsViGEmGamepadAdapter } from './infrastructure/virtualGamepad/WindowsViGEmGamepadAdapter.js';
import { GynooWebSocketServer } from './infrastructure/websocket/GynooWebSocketServer.js';
import { UdpPcDiscoveryServer } from './infrastructure/discovery/UdpPcDiscoveryServer.js';
import { WebSocketMessageHandler } from './presentation/handlers/WebSocketMessageHandler.js';
import {
  CreateRoom,
  JoinRoom,
  LeaveRoom,
  DisconnectPlayer,
  ReceiveControllerInput,
  SetPlayerReady,
  LoadGameProfile
} from './application/useCases/index.js';
import { DEFAULT_SERVER_CONFIG } from './config/ServerConfig.js';
import { Logger } from './infrastructure/system/Logger.js';
import { NetworkUtils } from './infrastructure/system/NetworkUtils.js';

async function bootstrap() {
  console.log(`
  ==============================================================
     GYNOO (OII PAD) - WIRELESS MOBILE GAME CONTROLLER SERVER   
     Clean Architecture + Gyro Steering Platform                
  ==============================================================
  `);

  // 1. Initialize Infrastructure Adapters & Repositories
  const roomRepository = new InMemoryRoomRepository();
  const gameProfileRepository = new JsonGameProfileRepository();
  const virtualGamepadAdapter = new WindowsViGEmGamepadAdapter();

  // 2. Initialize Application Use Cases
  const createRoomUseCase = new CreateRoom(roomRepository);
  const joinRoomUseCase = new JoinRoom(roomRepository, virtualGamepadAdapter);
  const leaveRoomUseCase = new LeaveRoom(roomRepository, virtualGamepadAdapter);
  const disconnectPlayerUseCase = new DisconnectPlayer(roomRepository, virtualGamepadAdapter);
  const receiveControllerInputUseCase = new ReceiveControllerInput(
    roomRepository,
    gameProfileRepository,
    virtualGamepadAdapter
  );
  const setPlayerReadyUseCase = new SetPlayerReady(roomRepository);
  const loadGameProfileUseCase = new LoadGameProfile(roomRepository, gameProfileRepository);

  // 3. Initialize Presentation Handlers
  const messageHandler = new WebSocketMessageHandler(
    joinRoomUseCase,
    leaveRoomUseCase,
    setPlayerReadyUseCase,
    receiveControllerInputUseCase,
    disconnectPlayerUseCase,
    loadGameProfileUseCase,
    roomRepository,
    gameProfileRepository
  );

  // 4. Create Default Game Room
  const initialRoom = await createRoomUseCase.execute({
    roomCode: DEFAULT_SERVER_CONFIG.defaultRoomCode,
    gameProfileId: 'bbr1',
    maxPlayers: DEFAULT_SERVER_CONFIG.maxPlayers
  });

  // 5. Start WebSocket Server
  const wsServer = new GynooWebSocketServer(DEFAULT_SERVER_CONFIG.wsPort, messageHandler);
  const actualPort = await wsServer.start();

  // 6. Start UDP PC Discovery Server
  const discoveryServer = new UdpPcDiscoveryServer(
    {
      discoveryPort: DEFAULT_SERVER_CONFIG.discoveryPort,
      wsPort: actualPort,
      serverName: DEFAULT_SERVER_CONFIG.serverName
    },
    roomRepository
  );

  try {
    await discoveryServer.start();
  } catch (err) {
    Logger.warn('Bootstrap', 'UDP discovery port binding skipped or unavailable. Manual IP connection is still active.');
  }

  const localIps = NetworkUtils.getLocalIpAddresses();
  const primaryIp = NetworkUtils.getPrimaryLocalIp();
  const connectUri = `gynoo://${primaryIp}:${actualPort}/${initialRoom.code.value}`;

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
    qrcode.generate(connectUri, { small: true }, (qrStr: string) => {
      console.log(qrStr);
    });
  } catch {
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
  Logger.error('Bootstrap', 'Fatal error during server startup', err);
  process.exit(1);
});
