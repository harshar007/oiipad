"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerState = void 0;
const SteeringValue_1 = require("../valueObjects/SteeringValue");
class ControllerState {
    steering;
    accelerate;
    brake;
    handbrake;
    boost;
    powerUp;
    pause;
    buttons;
    timestamp;
    constructor(props = {}) {
        this.steering = props.steering ?? SteeringValue_1.SteeringValue.center();
        this.accelerate = Math.max(0.0, Math.min(1.0, props.accelerate ?? 0.0));
        this.brake = Math.max(0.0, Math.min(1.0, props.brake ?? 0.0));
        this.handbrake = Boolean(props.handbrake);
        this.boost = Boolean(props.boost);
        this.powerUp = Boolean(props.powerUp);
        this.pause = Boolean(props.pause);
        this.buttons = Object.freeze({ ...(props.buttons ?? {}) });
        this.timestamp = props.timestamp ?? Date.now();
    }
    static default() {
        return new ControllerState({
            steering: SteeringValue_1.SteeringValue.center(),
            accelerate: 0.0,
            brake: 0.0,
            handbrake: false,
            boost: false,
            powerUp: false,
            pause: false,
            buttons: {},
            timestamp: Date.now()
        });
    }
    with(updates) {
        return new ControllerState({
            steering: updates.steering ?? this.steering,
            accelerate: updates.accelerate ?? this.accelerate,
            brake: updates.brake ?? this.brake,
            handbrake: updates.handbrake ?? this.handbrake,
            boost: updates.boost ?? this.boost,
            powerUp: updates.powerUp ?? this.powerUp,
            pause: updates.pause ?? this.pause,
            buttons: updates.buttons ? { ...this.buttons, ...updates.buttons } : this.buttons,
            timestamp: updates.timestamp ?? Date.now()
        });
    }
}
exports.ControllerState = ControllerState;
//# sourceMappingURL=ControllerState.js.map