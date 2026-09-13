"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SteeringProcessor = void 0;
const SteeringValue_1 = require("../valueObjects/SteeringValue");
class SteeringProcessor {
    neutralOffset = 0;
    lastSmoothed = 0;
    fusedAngle = 0;
    lastTimestamp = 0;
    constructor() {
        this.reset();
    }
    reset() {
        this.neutralOffset = 0;
        this.lastSmoothed = 0;
        this.fusedAngle = 0;
        this.lastTimestamp = 0;
    }
    calibrate(reading) {
        // Calibration captures current tilt axis as neutral baseline
        this.neutralOffset = reading.y;
        this.lastSmoothed = 0;
        this.fusedAngle = 0;
        this.lastTimestamp = reading.timestamp || Date.now();
    }
    getNeutralOffset() {
        return this.neutralOffset;
    }
    setNeutralOffset(offset) {
        this.neutralOffset = offset;
    }
    process(reading, config) {
        // 1. Calculate raw tilt relative to calibrated neutral point
        const rawAxis = reading.y;
        let delta = rawAxis - this.neutralOffset;
        // Inversion check
        if (config.invert) {
            delta = -delta;
        }
        // 2. Normalization relative to maximum expected tilt angle (e.g. 35-45 degrees = 0.6-0.7 rad)
        const maxAngle = config.maxTiltAngle || 0.65;
        let normalized = delta / maxAngle;
        normalized = Math.max(-1.0, Math.min(1.0, normalized));
        // 3. Dead Zone threshold filtering with smooth linear ramp
        let deadZoned = 0;
        const absNorm = Math.abs(normalized);
        const deadZone = config.deadZone || 0.04;
        if (absNorm > deadZone) {
            const range = 1.0 - deadZone;
            deadZoned = Math.sign(normalized) * ((absNorm - deadZone) / (range > 0 ? range : 1.0));
        }
        else if (config.autoCenter) {
            // Gentle stationary auto-calibration drift compensation when resting near neutral center
            this.neutralOffset = this.neutralOffset * 0.998 + rawAxis * 0.002;
        }
        // 4. Low-latency Exponential Moving Average filter
        const alpha = Math.max(0.0, Math.min(0.9, config.smoothing ?? 0.15));
        const smoothed = (1.0 - alpha) * deadZoned + alpha * this.lastSmoothed;
        this.lastSmoothed = smoothed;
        // 5. Sensitivity Scaling
        let scaled = smoothed * (config.sensitivity || 1.0);
        // 6. Response Curve Calculation
        let curved = scaled;
        if (config.responseCurve === 'exponential') {
            const sign = Math.sign(scaled);
            curved = sign * Math.pow(Math.abs(scaled), 1.4);
        }
        else if (config.responseCurve === 'sigmoid') {
            const sign = Math.sign(scaled);
            const mag = Math.abs(scaled);
            curved = sign * (2 / (1 + Math.exp(-2.6 * mag)) - 1);
        }
        // 7. Clamp to strict [-1.0, 1.0] and generate validated SteeringValue
        const steering = SteeringValue_1.SteeringValue.fromClamped(curved);
        return {
            steering,
            rawTilt: delta,
            filteredTilt: smoothed
        };
    }
}
exports.SteeringProcessor = SteeringProcessor;
//# sourceMappingURL=SteeringProcessor.js.map