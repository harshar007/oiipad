import { SteeringValue, InvalidSteeringValueError } from '@oiipad/domain';

describe('SteeringValue Value Object', () => {
  it('should accept valid normalized values between -1.0 and +1.0', () => {
    const left = new SteeringValue(-1.0);
    const center = new SteeringValue(0.0);
    const right = new SteeringValue(1.0);
    const partial = new SteeringValue(0.45);

    expect(left.value).toBe(-1.0);
    expect(center.value).toBe(0.0);
    expect(right.value).toBe(1.0);
    expect(partial.value).toBe(0.45);
  });

  it('should reject out of range numbers', () => {
    expect(() => new SteeringValue(-1.5)).toThrow(InvalidSteeringValueError);
    expect(() => new SteeringValue(2.0)).toThrow(InvalidSteeringValueError);
    expect(() => new SteeringValue(100)).toThrow(InvalidSteeringValueError);
  });

  it('should reject NaN and Infinity', () => {
    expect(() => new SteeringValue(NaN)).toThrow(InvalidSteeringValueError);
    expect(() => new SteeringValue(Infinity)).toThrow(InvalidSteeringValueError);
    expect(() => new SteeringValue(-Infinity)).toThrow(InvalidSteeringValueError);
  });

  it('should clamp properly with fromClamped helper', () => {
    expect(SteeringValue.fromClamped(-5.0).value).toBe(-1.0);
    expect(SteeringValue.fromClamped(3.2).value).toBe(1.0);
    expect(SteeringValue.fromClamped(0.25).value).toBe(0.25);
    expect(SteeringValue.fromClamped(NaN).value).toBe(0.0);
  });
});
