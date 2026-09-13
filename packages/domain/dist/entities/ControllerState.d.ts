import { SteeringValue } from '../valueObjects/SteeringValue';
export interface ControllerStateProps {
    steering?: SteeringValue;
    accelerate?: number;
    brake?: number;
    handbrake?: boolean;
    boost?: boolean;
    powerUp?: boolean;
    pause?: boolean;
    buttons?: Record<string, boolean>;
    timestamp?: number;
}
export declare class ControllerState {
    readonly steering: SteeringValue;
    readonly accelerate: number;
    readonly brake: number;
    readonly handbrake: boolean;
    readonly boost: boolean;
    readonly powerUp: boolean;
    readonly pause: boolean;
    readonly buttons: Readonly<Record<string, boolean>>;
    readonly timestamp: number;
    constructor(props?: ControllerStateProps);
    static default(): ControllerState;
    with(updates: Partial<ControllerStateProps>): ControllerState;
}
//# sourceMappingURL=ControllerState.d.ts.map