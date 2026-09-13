import { ControllerState, GameProfile, VirtualGamepadPort } from '@oiipad/domain';
import { Logger } from '../system/Logger.js';

export interface GamepadSlotState {
  connected: boolean;
  leftStickX: number;
  leftStickY: number;
  rightStickX: number;
  rightStickY: number;
  leftTrigger: number;
  rightTrigger: number;
  buttons: Set<string>;
  lastUpdate: number;
}

export class MockVirtualGamepadAdapter implements VirtualGamepadPort {
  private slots: Map<number, GamepadSlotState> = new Map();

  constructor() {
    for (let i = 1; i <= 4; i++) {
      this.slots.set(i, this.createDefaultSlotState(false));
    }
  }

  private createDefaultSlotState(connected: boolean): GamepadSlotState {
    return {
      connected,
      leftStickX: 0,
      leftStickY: 0,
      rightStickX: 0,
      rightStickY: 0,
      leftTrigger: 0,
      rightTrigger: 0,
      buttons: new Set(),
      lastUpdate: Date.now()
    };
  }

  public async connect(slot: number): Promise<boolean> {
    const state = this.slots.get(slot) ?? this.createDefaultSlotState(false);
    state.connected = true;
    this.slots.set(slot, state);
    Logger.info('VirtualGamepad', `Controller slot ${slot} connected (Virtual Emulation)`);
    return true;
  }

  public async disconnect(slot: number): Promise<void> {
    await this.reset(slot);
    const state = this.slots.get(slot);
    if (state) {
      state.connected = false;
    }
    Logger.info('VirtualGamepad', `Controller slot ${slot} disconnected`);
  }

  public async update(slot: number, state: ControllerState, profile: GameProfile): Promise<void> {
    const slotState = this.slots.get(slot);
    if (!slotState || !slotState.connected) {
      return;
    }

    const mapping = profile.mapping;

    // Apply steering axis
    if (mapping.steeringAxis === 'LEFT_STICK_X') {
      slotState.leftStickX = state.steering.value;
    }

    // Apply acceleration
    if (mapping.accelerateTarget.type === 'trigger') {
      if (mapping.accelerateTarget.name === 'RIGHT_TRIGGER') {
        slotState.rightTrigger = state.accelerate;
      }
    } else if (mapping.accelerateTarget.type === 'button') {
      if (state.accelerate > 0.5) {
        slotState.buttons.add(mapping.accelerateTarget.name);
      } else {
        slotState.buttons.delete(mapping.accelerateTarget.name);
      }
    }

    // Apply brake
    if (mapping.brakeTarget.type === 'trigger') {
      if (mapping.brakeTarget.name === 'LEFT_TRIGGER') {
        slotState.leftTrigger = state.brake;
      }
    } else if (mapping.brakeTarget.type === 'button') {
      if (state.brake > 0.5) {
        slotState.buttons.add(mapping.brakeTarget.name);
      } else {
        slotState.buttons.delete(mapping.brakeTarget.name);
      }
    }

    // Apply buttons: powerUp, boost, handbrake, pause
    this.applyButtonState(slotState, mapping.powerUpButton, state.powerUp);
    this.applyButtonState(slotState, mapping.boostButton, state.boost);
    this.applyButtonState(slotState, mapping.handbrakeButton, state.handbrake);
    this.applyButtonState(slotState, mapping.pauseButton, state.pause);

    if (mapping.secondaryPowerUpButton && state.buttons['secondaryPowerUp']) {
      this.applyButtonState(slotState, mapping.secondaryPowerUpButton, true);
    }

    // Custom buttons
    for (const [btnKey, isPressed] of Object.entries(state.buttons)) {
      const targetBtn = mapping.customButtons?.[btnKey] || btnKey;
      this.applyButtonState(slotState, targetBtn, isPressed);
    }

    slotState.lastUpdate = Date.now();
  }

  private applyButtonState(slotState: GamepadSlotState, buttonName: string, pressed: boolean): void {
    if (pressed) {
      slotState.buttons.add(buttonName);
    } else {
      slotState.buttons.delete(buttonName);
    }
  }

  public async reset(slot: number): Promise<void> {
    const state = this.slots.get(slot);
    if (state) {
      state.leftStickX = 0;
      state.leftStickY = 0;
      state.rightStickX = 0;
      state.rightStickY = 0;
      state.leftTrigger = 0;
      state.rightTrigger = 0;
      state.buttons.clear();
      state.lastUpdate = Date.now();
      Logger.info('VirtualGamepad', `Controller slot ${slot} inputs reset`);
    }
  }

  public async resetAll(): Promise<void> {
    for (let i = 1; i <= 4; i++) {
      await this.reset(i);
    }
  }

  public isConnected(slot: number): boolean {
    return this.slots.get(slot)?.connected ?? false;
  }

  public getSlotState(slot: number): GamepadSlotState | undefined {
    return this.slots.get(slot);
  }
}
