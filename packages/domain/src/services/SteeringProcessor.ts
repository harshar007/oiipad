import { GyroReading } from '../valueObjects/GyroReading';
import { SteeringConfiguration } from '../valueObjects/SteeringConfiguration';
import { SteeringValue } from '../valueObjects/SteeringValue';

export interface SteeringProcessResult {
  steering: SteeringValue;
  rawTilt: number;
  filteredTilt: number;
}

export class SteeringProcessor {
  private neutralOffset: number = 0;
  private lastSmoothed: number = 0;

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.neutralOffset = 0;
    this.lastSmoothed = 0;
  }

  public calibrate(reading: GyroReading): void {
    // Calibration captures current tilt axis as neutral baseline (using reading.gamma or reading.y)
    this.neutralOffset = reading.y;
    this.lastSmoothed = 0;
  }

  public getNeutralOffset(): number {
    return this.neutralOffset;
  }

  public setNeutralOffset(offset: number): void {
    this.neutralOffset = offset;
  }

  public process(reading: GyroReading, config: SteeringConfiguration): SteeringProcessResult {
    // 1. Calculate raw tilt relative to calibrated neutral point
    // In landscape mode, roll/tilt around Y or gamma axis corresponds to turning the phone like a steering wheel
    const rawAxis = reading.y;
    let delta = rawAxis - this.neutralOffset;

    // 2. Inversion
    if (config.invert) {
      delta = -delta;
    }

    // 3. Normalization relative to maximum expected tilt angle (radians or degrees converted)
    let normalized = delta / config.maxTiltAngle;
    normalized = Math.max(-1.0, Math.min(1.0, normalized));

    // 4. Dead Zone calculation
    let deadZoned = 0;
    const absNorm = Math.abs(normalized);
    if (absNorm > config.deadZone) {
      // Scale smoothly after deadzone threshold
      const range = 1.0 - config.deadZone;
      deadZoned = Math.sign(normalized) * ((absNorm - config.deadZone) / (range > 0 ? range : 1.0));
    }

    // 5. Smoothing filter (Exponential Moving Average)
    // smoothing: 0 = instantaneous, 0.9 = very heavy smoothing
    const alpha = Math.max(0.0, Math.min(0.95, config.smoothing));
    const smoothed = (1.0 - alpha) * deadZoned + alpha * this.lastSmoothed;
    this.lastSmoothed = smoothed;

    // 6. Sensitivity
    let scaled = smoothed * config.sensitivity;

    // 7. Response Curve
    let curved = scaled;
    if (config.responseCurve === 'exponential') {
      const sign = Math.sign(scaled);
      curved = sign * Math.pow(Math.abs(scaled), 1.5);
    } else if (config.responseCurve === 'sigmoid') {
      // Sigmoid shaped S-curve centered at 0
      const sign = Math.sign(scaled);
      const mag = Math.abs(scaled);
      curved = sign * (2 / (1 + Math.exp(-2.5 * mag)) - 1);
    }

    // 8. Clamp & build validated SteeringValue
    const steering = SteeringValue.fromClamped(curved);

    return {
      steering,
      rawTilt: delta,
      filteredTilt: smoothed
    };
  }
}
