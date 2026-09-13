"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SteeringConfiguration = void 0;
class SteeringConfiguration {
    sensitivity;
    deadZone;
    smoothing;
    invert;
    autoCenter;
    responseCurve;
    maxTiltAngle;
    constructor(props = {}) {
        this.sensitivity = typeof props.sensitivity === 'number' ? Math.max(0.1, Math.min(5.0, props.sensitivity)) : 1.0;
        this.deadZone = typeof props.deadZone === 'number' ? Math.max(0.0, Math.min(0.5, props.deadZone)) : 0.05;
        this.smoothing = typeof props.smoothing === 'number' ? Math.max(0.0, Math.min(0.95, props.smoothing)) : 0.25;
        this.invert = Boolean(props.invert);
        this.autoCenter = props.autoCenter !== undefined ? Boolean(props.autoCenter) : true;
        this.responseCurve = props.responseCurve || 'linear';
        this.maxTiltAngle = typeof props.maxTiltAngle === 'number' ? Math.max(0.1, props.maxTiltAngle) : 0.7; // ~40 degrees
    }
    static default() {
        return new SteeringConfiguration();
    }
    with(overrides) {
        return new SteeringConfiguration({
            sensitivity: overrides.sensitivity ?? this.sensitivity,
            deadZone: overrides.deadZone ?? this.deadZone,
            smoothing: overrides.smoothing ?? this.smoothing,
            invert: overrides.invert ?? this.invert,
            autoCenter: overrides.autoCenter ?? this.autoCenter,
            responseCurve: overrides.responseCurve ?? this.responseCurve,
            maxTiltAngle: overrides.maxTiltAngle ?? this.maxTiltAngle
        });
    }
}
exports.SteeringConfiguration = SteeringConfiguration;
//# sourceMappingURL=SteeringConfiguration.js.map