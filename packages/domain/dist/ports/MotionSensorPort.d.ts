import { GyroReading } from '../valueObjects/GyroReading';
export type SensorUnsubscribe = () => void;
export type SensorListener = (reading: GyroReading) => void;
export interface MotionSensorPort {
    start(updateIntervalMs?: number): Promise<void>;
    stop(): Promise<void>;
    isAvailable(): Promise<boolean>;
    subscribe(listener: SensorListener): SensorUnsubscribe;
    getCurrentReading(): GyroReading;
}
//# sourceMappingURL=MotionSensorPort.d.ts.map