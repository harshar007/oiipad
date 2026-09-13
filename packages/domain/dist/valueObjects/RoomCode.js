"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomCode = void 0;
const DomainErrors_1 = require("../errors/DomainErrors");
class RoomCode {
    _value;
    constructor(value) {
        if (!value || typeof value !== 'string') {
            throw new DomainErrors_1.DomainError('RoomCode must be a non-empty string');
        }
        const clean = value.trim().toUpperCase();
        if (clean.length < 4 || clean.length > 8) {
            throw new DomainErrors_1.DomainError('RoomCode must be between 4 and 8 alphanumeric characters');
        }
        this._value = clean;
    }
    get value() {
        return this._value;
    }
    equals(other) {
        if (!other)
            return false;
        return this._value === other._value;
    }
    toString() {
        return this._value;
    }
    static generate() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let result = '';
        for (let i = 0; i < 4; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return new RoomCode(result);
    }
}
exports.RoomCode = RoomCode;
//# sourceMappingURL=RoomCode.js.map