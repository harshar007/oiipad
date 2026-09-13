"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GyroReading = void 0;
class GyroReading {
    x;
    y;
    z;
    timestamp;
    constructor(data) {
        this.x = isFinite(data.x) ? data.x : 0;
        this.y = isFinite(data.y) ? data.y : 0;
        this.z = isFinite(data.z) ? data.z : 0;
        this.timestamp = data.timestamp ?? Date.now();
    }
    static zero() {
        return new GyroReading({ x: 0, y: 0, z: 0, timestamp: 0 });
    }
}
exports.GyroReading = GyroReading;
//# sourceMappingURL=GyroReading.js.map