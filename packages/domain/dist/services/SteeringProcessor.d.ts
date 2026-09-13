import { GyroReading } from '../valueObjects/GyroReading';
import { SteeringConfiguration } from '../valueObjects/SteeringConfiguration';
import { SteeringValue } from '../valueObjects/SteeringValue';
export interface SteeringProcessResult {
    steering: SteeringValue;
    rawTilt: number;
    filteredTilt: number;
}
export declare class SteeringProcessor {
    private neutralOffset;
    private lastSmoothed;
    private fusedAngle;
    private lastTimestamp;
    constructor();
    reset(): void;
    calibrate(reading: GyroReading): void;
    getNeutralOffset(): number;
    setNeutralOffset(offset: number): void;
    process(reading: GyroReading, config: SteeringConfiguration): SteeringProcessResult;
}
//# sourceMappingURL=SteeringProcessor.d.ts.map