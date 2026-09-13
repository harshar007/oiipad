"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameProfile = void 0;
const GameProfileId_1 = require("../valueObjects/GameProfileId");
class GameProfile {
    id;
    name;
    description;
    mapping;
    constructor(props) {
        this.id = props.id;
        this.name = props.name;
        this.description = props.description;
        this.mapping = Object.freeze({ ...props.mapping });
    }
    static bbr1() {
        return new GameProfile({
            id: GameProfileId_1.GameProfileId.BBR1,
            name: 'Beach Buggy Racing 1',
            description: 'Optimized tilt steering & controls for Beach Buggy Racing 1',
            mapping: {
                steeringAxis: 'LEFT_STICK_X',
                accelerateTarget: { type: 'trigger', name: 'RIGHT_TRIGGER' },
                brakeTarget: { type: 'trigger', name: 'LEFT_TRIGGER' },
                powerUpButton: 'A',
                boostButton: 'Y',
                handbrakeButton: 'RIGHT_SHOULDER',
                pauseButton: 'START'
            }
        });
    }
    static bbr2() {
        return new GameProfile({
            id: GameProfileId_1.GameProfileId.BBR2,
            name: 'Beach Buggy Racing 2',
            description: 'Dual power-up & special ability tilt controls for Beach Buggy Racing 2',
            mapping: {
                steeringAxis: 'LEFT_STICK_X',
                accelerateTarget: { type: 'trigger', name: 'RIGHT_TRIGGER' },
                brakeTarget: { type: 'trigger', name: 'LEFT_TRIGGER' },
                powerUpButton: 'A',
                secondaryPowerUpButton: 'B',
                boostButton: 'Y',
                handbrakeButton: 'RIGHT_SHOULDER',
                pauseButton: 'START'
            }
        });
    }
    static standard() {
        return new GameProfile({
            id: GameProfileId_1.GameProfileId.STANDARD,
            name: 'Standard Gamepad',
            description: 'Direct XInput gamepad emulation layout',
            mapping: {
                steeringAxis: 'LEFT_STICK_X',
                accelerateTarget: { type: 'trigger', name: 'RIGHT_TRIGGER' },
                brakeTarget: { type: 'trigger', name: 'LEFT_TRIGGER' },
                powerUpButton: 'A',
                boostButton: 'B',
                handbrakeButton: 'RIGHT_SHOULDER',
                pauseButton: 'START'
            }
        });
    }
}
exports.GameProfile = GameProfile;
//# sourceMappingURL=GameProfile.js.map