import {
  GameProfileId,
  SettingsRepositoryPort,
  SteeringConfiguration,
  UserSettings
} from '@oiipad/domain';

const SETTINGS_KEY = '@oiipad_user_settings_v1';

export class AsyncStorageSettingsRepository implements SettingsRepositoryPort {
  private memoryCache: UserSettings = {
    playerName: 'Racer 1',
    selectedProfileId: GameProfileId.BBR1,
    steeringConfig: SteeringConfiguration.default(),
    lastConnectedHost: '127.0.0.1',
    lastConnectedPort: 8888
  };

  public async loadSettings(): Promise<UserSettings> {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const json = await AsyncStorage.getItem(SETTINGS_KEY);
      if (json) {
        const raw = JSON.parse(json);
        this.memoryCache = {
          playerName: raw.playerName || 'Racer 1',
          selectedProfileId: new GameProfileId(raw.selectedProfileId || 'bbr1'),
          steeringConfig: new SteeringConfiguration(raw.steeringConfig || {}),
          lastConnectedHost: raw.lastConnectedHost || '127.0.0.1',
          lastConnectedPort: raw.lastConnectedPort || 8080
        };
      }
    } catch {
      // Return memory cache if storage is unavailable
    }
    return this.memoryCache;
  }

  public async saveSettings(settings: UserSettings): Promise<void> {
    this.memoryCache = settings;
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const serializable = {
        playerName: settings.playerName,
        selectedProfileId: settings.selectedProfileId.value,
        steeringConfig: {
          sensitivity: settings.steeringConfig.sensitivity,
          deadZone: settings.steeringConfig.deadZone,
          smoothing: settings.steeringConfig.smoothing,
          invert: settings.steeringConfig.invert,
          autoCenter: settings.steeringConfig.autoCenter,
          responseCurve: settings.steeringConfig.responseCurve,
          maxTiltAngle: settings.steeringConfig.maxTiltAngle
        },
        lastConnectedHost: settings.lastConnectedHost,
        lastConnectedPort: settings.lastConnectedPort
      };
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(serializable));
    } catch {
      // Storage error silent fallback
    }
  }
}
