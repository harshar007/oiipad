import { ControllerState, GameProfile, VirtualGamepadPort } from '@oiipad/domain';
import { Logger } from '../system/Logger.js';
import { MockVirtualGamepadAdapter } from './MockVirtualGamepadAdapter.js';

export class WindowsViGEmGamepadAdapter implements VirtualGamepadPort {
  private fallbackAdapter: MockVirtualGamepadAdapter;
  private isDriverAvailable: boolean = false;
  private vigemClient: any = null;
  private controllers: Map<number, any> = new Map();

  constructor() {
    this.fallbackAdapter = new MockVirtualGamepadAdapter();
    this.initViGEm();
  }

  private initViGEm(): void {
    if (process.platform !== 'win32') {
      Logger.info('WindowsViGEm', 'Non-Windows platform detected, using fallback virtual gamepad');
      return;
    }

    try {
      // Dynamic import / require attempt for vigemclient
      // If vigemclient is installed and ViGEmBus driver is running on Windows
      const ViGEmClient = (require as any)('vigemclient');
      if (ViGEmClient) {
        this.vigemClient = new ViGEmClient();
        const err = this.vigemClient.connect();
        if (err === null || err === 0) {
          this.isDriverAvailable = true;
          Logger.info('WindowsViGEm', 'Successfully connected to Windows ViGEmBus driver!');
        } else {
          Logger.warn('WindowsViGEm', `ViGEmBus connection returned code ${err}, falling back to virtual emulation.`);
        }
      }
    } catch {
      Logger.info('WindowsViGEm', 'ViGEmBus driver / native module not found. Running in high-performance virtual gamepad mode.');
      this.isDriverAvailable = false;
    }
  }

  public async connect(slot: number): Promise<boolean> {
    if (this.isDriverAvailable && this.vigemClient) {
      try {
        if (!this.controllers.has(slot)) {
          const controller = this.vigemClient.createX360Controller();
          const err = controller.connect();
          if (err === null || err === 0) {
            this.controllers.set(slot, controller);
            Logger.info('WindowsViGEm', `Hardware XInput controller #${slot} created via ViGEmBus`);
            return true;
          }
        }
      } catch (e) {
        Logger.error('WindowsViGEm', `Error initializing ViGEm controller for slot ${slot}`, e);
      }
    }
    return this.fallbackAdapter.connect(slot);
  }

  public async disconnect(slot: number): Promise<void> {
    await this.reset(slot);
    if (this.controllers.has(slot)) {
      try {
        const controller = this.controllers.get(slot);
        controller.disconnect();
        this.controllers.delete(slot);
      } catch (e) {
        Logger.error('WindowsViGEm', `Error disconnecting ViGEm controller slot ${slot}`, e);
      }
    }
    await this.fallbackAdapter.disconnect(slot);
  }

  public async update(slot: number, state: ControllerState, profile: GameProfile): Promise<void> {
    // Always update fallback state for diagnostics
    await this.fallbackAdapter.update(slot, state, profile);

    const controller = this.controllers.get(slot);
    if (!controller) return;

    try {
      const mapping = profile.mapping;

      // Axis Left Stick X: range [-1, 1] mapped to [-32768, 32767]
      if (mapping.steeringAxis === 'LEFT_STICK_X') {
        controller.axis.leftX.setValue(state.steering.value);
      }

      // Triggers: range [0, 1] mapped to [0, 255]
      if (mapping.accelerateTarget.name === 'RIGHT_TRIGGER') {
        controller.axis.rightTrigger.setValue(state.accelerate);
      }
      if (mapping.brakeTarget.name === 'LEFT_TRIGGER') {
        controller.axis.leftTrigger.setValue(state.brake);
      }

      // Buttons
      if (controller.button) {
        if (mapping.powerUpButton === 'A') controller.button.A.setValue(state.powerUp);
        if (mapping.boostButton === 'Y') controller.button.Y.setValue(state.boost);
        if (mapping.handbrakeButton === 'RIGHT_SHOULDER') controller.button.RIGHT_SHOULDER.setValue(state.handbrake);
        if (mapping.pauseButton === 'START') controller.button.START.setValue(state.pause);
      }
    } catch (e) {
      Logger.error('WindowsViGEm', `Error sending input to ViGEm controller ${slot}`, e);
    }
  }

  public async reset(slot: number): Promise<void> {
    await this.fallbackAdapter.reset(slot);
    const controller = this.controllers.get(slot);
    if (controller) {
      try {
        controller.axis.leftX.setValue(0);
        controller.axis.leftY.setValue(0);
        controller.axis.rightX.setValue(0);
        controller.axis.rightY.setValue(0);
        controller.axis.leftTrigger.setValue(0);
        controller.axis.rightTrigger.setValue(0);
        if (controller.button) {
          for (const btnKey of Object.keys(controller.button)) {
            controller.button[btnKey].setValue(false);
          }
        }
      } catch (e) {
        Logger.error('WindowsViGEm', `Error resetting ViGEm controller slot ${slot}`, e);
      }
    }
  }

  public async resetAll(): Promise<void> {
    for (let slot = 1; slot <= 4; slot++) {
      await this.reset(slot);
    }
  }

  public isConnected(slot: number): boolean {
    return this.controllers.has(slot) || this.fallbackAdapter.isConnected(slot);
  }

  public getSlotDiagnostic(slot: number) {
    return this.fallbackAdapter.getSlotState(slot);
  }
}
