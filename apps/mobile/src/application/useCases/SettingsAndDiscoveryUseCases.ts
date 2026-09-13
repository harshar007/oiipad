import {
  DiscoveredPc,
  PcDiscoveryPort,
  SettingsRepositoryPort,
  SteeringConfiguration,
  UserSettings
} from '@oiipad/domain';

export class LoadControllerSettings {
  constructor(private settingsRepo: SettingsRepositoryPort) {}

  public async execute(): Promise<UserSettings> {
    return await this.settingsRepo.loadSettings();
  }
}

export class SaveControllerSettings {
  constructor(private settingsRepo: SettingsRepositoryPort) {}

  public async execute(settings: UserSettings): Promise<void> {
    await this.settingsRepo.saveSettings(settings);
  }
}

export class DiscoverPcs {
  constructor(private discoveryRepo: PcDiscoveryPort) {}

  public async start(onUpdate: (pcs: DiscoveredPc[]) => void): Promise<() => void> {
    await this.discoveryRepo.startDiscovery();
    const unsubscribe = this.discoveryRepo.onPcsUpdated(onUpdate);
    return () => {
      unsubscribe();
      this.discoveryRepo.stopDiscovery();
    };
  }
}
