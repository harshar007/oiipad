import { InvalidSteeringValueError } from '../errors/DomainErrors';

export class SteeringValue {
  private readonly _value: number;

  constructor(value: number) {
    if (typeof value !== 'number' || isNaN(value) || !isFinite(value) || value < -1.0 || value > 1.0) {
      throw new InvalidSteeringValueError(value);
    }
    // Round to 4 decimal places for floating-point precision consistency
    this._value = Math.round(value * 10000) / 10000;
  }

  public get value(): number {
    return this._value;
  }

  public static center(): SteeringValue {
    return new SteeringValue(0.0);
  }

  public static fromClamped(raw: number): SteeringValue {
    if (typeof raw !== 'number' || isNaN(raw) || !isFinite(raw)) {
      return SteeringValue.center();
    }
    const clamped = Math.max(-1.0, Math.min(1.0, raw));
    return new SteeringValue(clamped);
  }

  public equals(other: SteeringValue | null | undefined): boolean {
    if (!other) return false;
    return Math.abs(this._value - other._value) < 0.0001;
  }

  public toString(): string {
    return this._value.toFixed(4);
  }
}
