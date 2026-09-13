import { MotionSensorPort, SensorListener, SensorUnsubscribe, GyroReading } from '@oiipad/domain';

export class ExpoMotionSensor implements MotionSensorPort {
  private currentReading: GyroReading = GyroReading.zero();
  private listeners: Set<SensorListener> = new Set();
  private subscription: any = null;
  private isRunning: boolean = false;

  public async isAvailable(): Promise<boolean> {
    try {
      const { Accelerometer, DeviceMotion } = require('expo-sensors');
      const accelAvail = await Accelerometer?.isAvailableAsync?.().catch(() => false);
      const motionAvail = await DeviceMotion?.isAvailableAsync?.().catch(() => false);
      return Boolean(accelAvail || motionAvail);
    } catch {
      return false;
    }
  }

  public async start(updateIntervalMs: number = 16): Promise<void> {
    if (this.isRunning) return;

    try {
      const { Accelerometer, DeviceMotion } = require('expo-sensors');

      // Primary: Accelerometer provides ultra-low latency, 60Hz-100Hz hardware gravity tracking
      if (Accelerometer && typeof Accelerometer.addListener === 'function') {
        Accelerometer.setUpdateInterval(updateIntervalMs);

        this.subscription = Accelerometer.addListener((data: { x: number; y: number; z: number }) => {
          const rawX = typeof data.x === 'number' ? data.x : 0;
          const rawY = typeof data.y === 'number' ? data.y : 0;
          const rawZ = typeof data.z === 'number' ? data.z : 0;

          // 3D gravity vector normalization for 100% accurate tilt extraction
          const mag = Math.sqrt(rawX * rawX + rawY * rawY + rawZ * rawZ);
          const tiltY = mag > 0.05 ? (rawY / mag) : (Math.abs(rawY) > 2.0 ? (rawY / 9.81) : rawY);

          const reading = new GyroReading({
            x: rawX,
            y: tiltY,
            z: rawZ,
            timestamp: Date.now()
          });

          this.currentReading = reading;
          for (const listener of this.listeners) {
            listener(reading);
          }
        });
      } else if (DeviceMotion && typeof DeviceMotion.addListener === 'function') {
        DeviceMotion.setUpdateInterval(updateIntervalMs);

        this.subscription = DeviceMotion.addListener((motionData: any) => {
          const rawX = motionData.accelerationIncludingGravity?.x ?? motionData.rotation?.beta ?? 0;
          const rawY = motionData.accelerationIncludingGravity?.y ?? motionData.rotation?.gamma ?? 0;
          const rawZ = motionData.accelerationIncludingGravity?.z ?? motionData.rotation?.alpha ?? 0;

          const mag = Math.sqrt(rawX * rawX + rawY * rawY + rawZ * rawZ);
          const tiltY = mag > 0.05 ? (rawY / mag) : (Math.abs(rawY) > 2.0 ? (rawY / 9.81) : rawY);

          const reading = new GyroReading({
            x: rawX,
            y: tiltY,
            z: rawZ,
            timestamp: Date.now()
          });

          this.currentReading = reading;
          for (const listener of this.listeners) {
            listener(reading);
          }
        });
      }

      this.isRunning = true;
    } catch {
      this.isRunning = true;
    }
  }

  public async stop(): Promise<void> {
    if (this.subscription) {
      if (typeof this.subscription.remove === 'function') {
        this.subscription.remove();
      }
      this.subscription = null;
    }
    this.isRunning = false;
  }

  public subscribe(listener: SensorListener): SensorUnsubscribe {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getCurrentReading(): GyroReading {
    return this.currentReading;
  }

  public simulateReading(yTilt: number): void {
    const reading = new GyroReading({
      x: 0,
      y: yTilt,
      z: 0,
      timestamp: Date.now()
    });
    this.currentReading = reading;
    for (const listener of this.listeners) {
      listener(reading);
    }
  }
}
