export interface GyroReadingData {
    x: number;
    y: number;
    z: number;
    timestamp?: number;
}
export declare class GyroReading {
    readonly x: number;
    readonly y: number;
    readonly z: number;
    readonly timestamp: number;
    constructor(data: GyroReadingData);
    static zero(): GyroReading;
}
//# sourceMappingURL=GyroReading.d.ts.map