import {
  SteeringProcessor,
  GyroReading,
  SteeringConfiguration
} from '@oiipad/domain';

describe('SteeringProcessor Gyro Algorithm (Section 41 Tests)', () => {
  let processor: SteeringProcessor;
  let config: SteeringConfiguration;

  beforeEach(() => {
    processor = new SteeringProcessor();
    config = new SteeringConfiguration({
      sensitivity: 1.0,
      deadZone: 0.05,
      smoothing: 0.0, // Disable smoothing for raw algorithmic step tests
      invert: false,
      maxTiltAngle: 0.5 // ~30 degrees max tilt
    });
  });

  it('Neutral phone calibration -> steering ≈ 0', () => {
    const neutralReading = new GyroReading({ x: 0, y: 0.2, z: 0 });
    processor.calibrate(neutralReading);

    // Reading at neutral position
    const result = processor.process(neutralReading, config);
    expect(result.steering.value).toBe(0.0);
  });

  it('Tilt left -> negative steering', () => {
    const neutral = new GyroReading({ x: 0, y: 0.0, z: 0 });
    processor.calibrate(neutral);

    const tiltLeft = new GyroReading({ x: 0, y: -0.3, z: 0 });
    const result = processor.process(tiltLeft, config);

    expect(result.steering.value).toBeLessThan(0);
  });

  it('Tilt right -> positive steering', () => {
    const neutral = new GyroReading({ x: 0, y: 0.0, z: 0 });
    processor.calibrate(neutral);

    const tiltRight = new GyroReading({ x: 0, y: 0.3, z: 0 });
    const result = processor.process(tiltRight, config);

    expect(result.steering.value).toBeGreaterThan(0);
  });

  it('Dead zone -> small movements ignored', () => {
    const neutral = new GyroReading({ x: 0, y: 0.0, z: 0 });
    processor.calibrate(neutral);

    // Minor wobble below deadzone (0.01 / 0.5 = 0.02 < 0.05 deadzone)
    const tinyWobble = new GyroReading({ x: 0, y: 0.01, z: 0 });
    const result = processor.process(tinyWobble, config);

    expect(result.steering.value).toBe(0.0);
  });

  it('Maximum tilt -> clamped to ±1.0', () => {
    const neutral = new GyroReading({ x: 0, y: 0.0, z: 0 });
    processor.calibrate(neutral);

    const extremeLeft = new GyroReading({ x: 0, y: -2.5, z: 0 });
    const extremeRight = new GyroReading({ x: 0, y: 2.5, z: 0 });

    const resLeft = processor.process(extremeLeft, config);
    const resRight = processor.process(extremeRight, config);

    expect(resLeft.steering.value).toBe(-1.0);
    expect(resRight.steering.value).toBe(1.0);
  });

  it('Invert enabled -> direction reversed', () => {
    const neutral = new GyroReading({ x: 0, y: 0.0, z: 0 });
    processor.calibrate(neutral);

    const invertConfig = config.with({ invert: true });
    const tiltRight = new GyroReading({ x: 0, y: 0.3, z: 0 });

    const normalResult = processor.process(tiltRight, config);
    const invertedResult = processor.process(tiltRight, invertConfig);

    expect(normalResult.steering.value).toBeGreaterThan(0);
    expect(invertedResult.steering.value).toBeLessThan(0);
    expect(invertedResult.steering.value).toBeCloseTo(-normalResult.steering.value, 2);
  });
});
