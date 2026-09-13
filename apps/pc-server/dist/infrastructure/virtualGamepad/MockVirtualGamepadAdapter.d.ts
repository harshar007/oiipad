import { ControllerState, GameProfile, VirtualGamepadPort } from '@oiipad/domain';
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
export declare class MockVirtualGamepadAdapter implements VirtualGamepadPort {
    private slots;
    constructor();
    private createDefaultSlotState;
    connect(slot: number): Promise<boolean>;
    disconnect(slot: number): Promise<void>;
    update(slot: number, state: ControllerState, profile: GameProfile): Promise<void>;
    private applyButtonState;
    reset(slot: number): Promise<void>;
    resetAll(): Promise<void>;
    isConnected(slot: number): boolean;
    getSlotState(slot: number): GamepadSlotState | undefined;
}
//# sourceMappingURL=MockVirtualGamepadAdapter.d.ts.map