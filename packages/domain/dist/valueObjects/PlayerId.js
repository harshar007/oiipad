"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerId = void 0;
const DomainErrors_1 = require("../errors/DomainErrors");
class PlayerId {
    _value;
    constructor(value) {
        if (!value || typeof value !== 'string' || value.trim().length === 0) {
            throw new DomainErrors_1.DomainError('PlayerId cannot be empty');
        }
        this._value = value.trim();
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
exports.PlayerId = PlayerId;
//# sourceMappingURL=PlayerId.js.map