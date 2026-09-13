import { GameProfileId } from '../valueObjects/GameProfileId';
export interface GamepadMapping {
    steeringAxis: string;
    accelerateTarget: {
        type: 'trigger' | 'button' | 'axis';
        name: string;
    };
    brakeTarget: {
        type: 'trigger' | 'button' | 'axis';
        name: string;
    };
    powerUpButton: string;
    secondaryPowerUpButton?: string;
    boostButton: string;
    handbrakeButton: string;
    pauseButton: string;
    customButtons?: Record<string, string>;
}
export interface GameProfileProps {
    id: GameProfileId;
    name: string;
    description: string;
    mapping: GamepadMapping;
}
export declare class GameProfile {
    readonly id: GameProfileId;
    readonly name: string;
    readonly description: string;
    readonly mapping: Readonly<GamepadMapping>;
    constructor(props: GameProfileProps);
    static bbr1(): GameProfile;
    static bbr2(): GameProfile;
    static standard(): GameProfile;
}
//# sourceMappingURL=GameProfile.d.ts.map