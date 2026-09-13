"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameProfileId = void 0;
const DomainErrors_1 = require("../errors/DomainErrors");
class GameProfileId {
    static BBR1 = new GameProfileId('bbr1');
    static BBR2 = new GameProfileId('bbr2');
    static STANDARD = new GameProfileId('standard');
    _value;
    constructor(value) {
        if (!value || typeof value !== 'string' || value.trim().length === 0) {
            throw new DomainErrors_1.DomainError('GameProfileId cannot be empty');
        }
        this._value = value.trim().toLowerCase();
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
}
exports.GameProfileId = GameProfileId;
//# sourceMappingURL=GameProfileId.js.map