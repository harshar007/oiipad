"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SteeringValue = void 0;
const DomainErrors_1 = require("../errors/DomainErrors");
class SteeringValue {
    _value;
    constructor(value) {
        if (typeof value !== 'number' || isNaN(value) || !isFinite(value) || value < -1.0 || value > 1.0) {
            throw new DomainErrors_1.InvalidSteeringValueError(value);
        }
        // Round to 4 decimal places for floating-point precision consistency
        this._value = Math.round(value * 10000) / 10000;
    }
    get value() {
        return this._value;
    }
    static center() {
        return new SteeringValue(0.0);
    }
    static fromClamped(raw) {
        if (typeof raw !== 'number' || isNaN(raw) || !isFinite(raw)) {
            return SteeringValue.center();
        }
        const clamped = Math.max(-1.0, Math.min(1.0, raw));
        return new SteeringValue(clamped);
    }
    equals(other) {
        if (!other)
            return false;
        return Math.abs(this._value - other._value) < 0.0001;
    }
    toString() {
        return this._value.toFixed(4);
    }
}
exports.SteeringValue = SteeringValue;
//# sourceMappingURL=SteeringValue.js.map