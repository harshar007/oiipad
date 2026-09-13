import { ControllerState, GameProfile, VirtualGamepadPort } from '@oiipad/domain';
export declare class WindowsViGEmGamepadAdapter implements VirtualGamepadPort {
    private fallbackAdapter;
    private isDriverAvailable;
    private vigemClient;
    private controllers;
    constructor();
    private initViGEm;
    connect(slot: number): Promise<boolean>;
    disconnect(slot: number): Promise<void>;
    update(slot: number, state: ControllerState, profile: GameProfile): Promise<void>;
    reset(slot: number): Promise<void>;
    resetAll(): Promise<void>;
    isConnected(slot: number): boolean;
    getSlotDiagnostic(slot: number): import("./MockVirtualGamepadAdapter.js").GamepadSlotState | undefined;
}
//# sourceMappingURL=WindowsViGEmGamepadAdapter.d.ts.map