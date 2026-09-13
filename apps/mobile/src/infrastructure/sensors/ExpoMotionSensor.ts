import { MotionSensorPort, SensorListener, SensorUnsubscribe, GyroReading } from '@oiipad/domain';

export class ExpoMotionSensor implements MotionSensorPort {
  private currentReading: GyroReading = GyroReading.zero();
  private listeners: Set<SensorListener> = new Set();
  private subscription: any = null;
  private isRunning: boolean = false;

  public async isAvailable(): Promise<boolean> {
    try {
      const { DeviceMotion } = require('expo-sensors');
      return await DeviceMotion.isAvailableAsync();
    } catch {
      return false;
    }
  }

  public async start(updateIntervalMs: number = 16): Promise<void> {
    if (this.isRunning) return;

    try {
      const { DeviceMotion } = require('expo-sensors');
      DeviceMotion.setUpdateInterval(updateIntervalMs);

      this.subscription = DeviceMotion.addListener((motionData: any) => {
        // In landscape mode with phone held horizontally:
        // rotation.gamma or accelerationIncludingGravity.y corresponds to the steering tilt
        const gamma = motionData.rotation?.gamma ?? motionData.accelerationIncludingGravity?.y ?? 0;
        const beta = motionData.rotation?.beta ?? motionData.accelerationIncludingGravity?.x ?? 0;
        const alpha = motionData.rotation?.alpha ?? motionData.accelerationIncludingGravity?.z ?? 0;

        const reading = new GyroReading({
          x: beta,
          y: gamma,
          z: alpha,
          timestamp: Date.now()
        });

        this.currentReading = reading;
        for (const listener of this.listeners) {
          listener(reading);
        }
      });

      this.isRunning = true;
    } catch {
      // Fallback for emulator / web environment
      this.isRunning = true;
    }
  }

  public async stop(): Promise<void> {
    if (this.subscription) {
      this.subscription.remove();
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

  // Simulation method for testing / web preview
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
