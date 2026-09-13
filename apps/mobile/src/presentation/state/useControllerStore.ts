import { create } from 'zustand';
import {
  GameProfileId,
  GyroReading,
  PlayerId,
  SteeringConfiguration,
  SteeringProcessor,
  SteeringProcessResult,
  SteeringValue,
  DiscoveredPc
} from '@oiipad/domain';
import { PlayerDto } from '@oiipad/protocol';
import { ExpoMotionSensor } from '../../infrastructure/sensors/ExpoMotionSensor';
import { GynooWebSocketClient } from '../../infrastructure/networking/GynooWebSocketClient';
import { AsyncStorageSettingsRepository } from '../../infrastructure/storage/AsyncStorageSettingsRepository';
import { UdpPcDiscoveryRepository } from '../../infrastructure/discovery/UdpPcDiscoveryRepository';
import {
  CalibrateSteering,
  StartController
} from '../../application/useCases/ControllerUseCases';
import {
  ConnectToPc,
  DisconnectFromPc,
  JoinRoomMobile,
  LeaveRoomMobile,
  SelectGameProfileMobile,
  SetPlayerReadyMobile
} from '../../application/useCases/RoomUseCases';
import {
  DiscoverPcs,
  LoadControllerSettings,
  SaveControllerSettings
} from '../../application/useCases/SettingsAndDiscoveryUseCases';

// Instantiate singletons of infrastructure and processors
const motionSensor = new ExpoMotionSensor();
const steeringProcessor = new SteeringProcessor();
const wsClient = new GynooWebSocketClient();
const settingsRepo = new AsyncStorageSettingsRepository();
const discoveryRepo = new UdpPcDiscoveryRepository();

// Use Cases
const calibrateUseCase = new CalibrateSteering(motionSensor, steeringProcessor);
const startControllerUseCase = new StartController(motionSensor, steeringProcessor, wsClient);
const connectToPcUseCase = new ConnectToPc(wsClient);
const disconnectFromPcUseCase = new DisconnectFromPc(wsClient);
const joinRoomUseCase = new JoinRoomMobile(wsClient);
const leaveRoomUseCase = new LeaveRoomMobile(wsClient);
const setReadyUseCase = new SetPlayerReadyMobile(wsClient);
const selectProfileUseCase = new SelectGameProfileMobile(wsClient);
const loadSettingsUseCase = new LoadControllerSettings(settingsRepo);
const saveSettingsUseCase = new SaveControllerSettings(settingsRepo);
const discoverPcsUseCase = new DiscoverPcs(discoveryRepo);

export interface ControllerStoreState {
  // Connection & Room
  connectionStatus: 'disconnected' | 'connecting' | 'connected';
  serverHost: string;
  serverPort: number;
  roomCode: string;
  playerId: string | null;
  playerSlot: 1 | 2 | 3 | 4 | null;
  playerName: string;
  gameProfile: string;
  players: PlayerDto[];
  discoveredPcs: DiscoveredPc[];
  isReady: boolean;
  error: string | null;

  // Steering & Sensors
  steeringConfig: SteeringConfiguration;
  liveSteering: number;
  rawTilt: number;
  neutralOffset: number;
  rawGyro: GyroReading;
  isControllerRunning: boolean;

  // Real-time button inputs
  buttonStates: {
    accelerate: number;
    brake: number;
    handbrake: boolean;
    boost: boolean;
    powerUp: boolean;
    pause: boolean;
    buttons: Record<string, boolean>;
  };

  // Actions
  init: () => Promise<void>;
  connect: (host: string, port?: number) => Promise<void>;
  disconnect: () => void;
  joinRoom: (roomCode: string, slot?: 1 | 2 | 3 | 4) => void;
  leaveRoom: () => void;
  setReady: (ready: boolean) => void;
  selectGameProfile: (profileId: string) => void;
  calibrate: () => void;
  startController: () => Promise<void>;
  stopController: () => Promise<void>;
  setButtonState: (updates: Partial<ControllerStoreState['buttonStates']>) => void;
  updateSteeringConfig: (updates: Partial<{
    sensitivity: number;
    deadZone: number;
    smoothing: number;
    invert: boolean;
  }>) => Promise<void>;
  connectFromQr: (qrText: string) => Promise<boolean>;
  setPlayerName: (name: string) => Promise<void>;
}

export const useControllerStore = create<ControllerStoreState>((set, get) => {
  // Listen to WebSocket messages
  wsClient.onMessage((msg) => {
    switch (msg.type) {
      case 'join_room_response':
        if (msg.success) {
          set({
            playerId: msg.playerId ?? null,
            playerSlot: msg.slot ?? null,
            roomCode: msg.roomCode ?? get().roomCode,
            gameProfile: msg.gameProfile ?? 'bbr1',
            players: msg.players ?? [],
            error: null
          });
        } else {
          set({ error: msg.error || 'Failed to join room' });
        }
        break;

      case 'room_state':
        set({
          roomCode: msg.roomCode,
          gameProfile: msg.gameProfile,
          players: msg.players
        });
        // Update local ready state from player list
        const myId = get().playerId;
        if (myId) {
          const me = msg.players.find((p) => p.id === myId);
          if (me) {
            set({ isReady: me.readyState });
          }
        }
        break;

      case 'error':
        set({ error: msg.message });
        break;
    }
  });

  // Listen to WebSocket status changes
  wsClient.onStatusChange((status) => {
    set({ connectionStatus: status });
    if (status === 'disconnected') {
      get().stopController();
    }
  });

  return {
    connectionStatus: 'disconnected',
    serverHost: '127.0.0.1',
    serverPort: 8888,
    roomCode: 'BBR1',
    playerId: null,
    playerSlot: null,
    playerName: 'Racer 1',
    gameProfile: 'bbr1',
    players: [],
    discoveredPcs: [],
    isReady: false,
    error: null,

    steeringConfig: SteeringConfiguration.default(),
    liveSteering: 0.0,
    rawTilt: 0.0,
    neutralOffset: 0.0,
    rawGyro: GyroReading.zero(),
    isControllerRunning: false,

    buttonStates: {
      accelerate: 0,
      brake: 0,
      handbrake: false,
      boost: false,
      powerUp: false,
      pause: false,
      buttons: {}
    },

    init: async () => {
      const settings = await loadSettingsUseCase.execute();
      set({
        playerName: settings.playerName,
        steeringConfig: settings.steeringConfig,
        serverHost: settings.lastConnectedHost || '127.0.0.1',
        serverPort: settings.lastConnectedPort || 8080
      });

      // Start PC discovery
      discoverPcsUseCase.start((pcs) => {
        set({ discoveredPcs: pcs });
      });
    },

    connect: async (host: string, port: number = 8080) => {
      set({ serverHost: host, serverPort: port, error: null });
      await connectToPcUseCase.execute(host, port);
      const settings = await loadSettingsUseCase.execute();
      await saveSettingsUseCase.execute({
        ...settings,
        lastConnectedHost: host,
        lastConnectedPort: port
      });
    },

    disconnect: () => {
      disconnectFromPcUseCase.execute();
      set({
        playerId: null,
        playerSlot: null,
        players: [],
        isReady: false
      });
    },

    joinRoom: (roomCode: string, slot?: 1 | 2 | 3 | 4) => {
      set({ roomCode, error: null });
      joinRoomUseCase.execute(roomCode, get().playerName, slot);
    },

    leaveRoom: () => {
      const { playerId } = get();
      if (playerId) {
        leaveRoomUseCase.execute(playerId);
      }
      set({ playerId: null, playerSlot: null, isReady: false });
    },

    setReady: (ready: boolean) => {
      const { playerId } = get();
      if (playerId) {
        setReadyUseCase.execute(playerId, ready);
        set({ isReady: ready });
      }
    },

    selectGameProfile: (profileId: string) => {
      selectProfileUseCase.execute(profileId);
    },

    calibrate: () => {
      const reading = calibrateUseCase.execute();
      set({
        neutralOffset: steeringProcessor.getNeutralOffset(),
        rawGyro: reading,
        liveSteering: 0.0
      });
    },

    startController: async () => {
      if (get().isControllerRunning) return;
      set({ isControllerRunning: true });

      await startControllerUseCase.execute(
        () => get().playerId || '',
        () => get().steeringConfig,
        () => get().buttonStates,
        (result: SteeringProcessResult) => {
          set({
            liveSteering: result.steering.value,
            rawTilt: result.rawTilt,
            rawGyro: motionSensor.getCurrentReading()
          });
        }
      );
    },

    stopController: async () => {
      await startControllerUseCase.stop();
      set({ isControllerRunning: false, liveSteering: 0.0 });
    },

    setButtonState: (updates) => {
      set((state) => ({
        buttonStates: {
          ...state.buttonStates,
          ...updates,
          buttons: updates.buttons ? { ...state.buttonStates.buttons, ...updates.buttons } : state.buttonStates.buttons
        }
      }));
    },

    updateSteeringConfig: async (updates) => {
      const newConfig = get().steeringConfig.with(updates);
      set({ steeringConfig: newConfig });
      const settings = await loadSettingsUseCase.execute();
      await saveSettingsUseCase.execute({
        ...settings,
        steeringConfig: newConfig
      });
    },

    connectFromQr: async (qrText: string) => {
      try {
        let clean = qrText.trim();
        let host = '127.0.0.1';
        let port = 8888;
        let room = 'BBR1';

        // Check if URI format: gynoo://host:port/room or ws://host:port/room
        if (clean.includes('://')) {
          const withoutScheme = clean.split('://')[1];
          const [hostPort, roomPart] = withoutScheme.split('/');
          if (roomPart) room = roomPart.trim().toUpperCase();
          if (hostPort.includes(':')) {
            const [h, p] = hostPort.split(':');
            host = h.trim();
            port = parseInt(p.trim(), 10) || 8888;
          } else {
            host = hostPort.trim();
          }
        } else if (clean.includes(':')) {
          const [h, p] = clean.split(':');
          host = h.trim();
          port = parseInt(p.trim(), 10) || 8888;
        } else {
          host = clean;
        }

        await get().connect(host, port);
        get().joinRoom(room);
        return true;
      } catch (err: any) {
        set({ error: `QR Connect Error: ${err.message || 'Invalid QR'}` });
        return false;
      }
    },

    setPlayerName: async (name: string) => {
      set({ playerName: name });
      const settings = await loadSettingsUseCase.execute();
      await saveSettingsUseCase.execute({
        ...settings,
        playerName: name
      });
    }
  };
});
