export type ResponseCurveType = 'linear' | 'exponential' | 'sigmoid';

export interface SteeringConfigurationProps {
  sensitivity?: number;
  deadZone?: number;
  smoothing?: number;
  invert?: boolean;
  autoCenter?: boolean;
  responseCurve?: ResponseCurveType;
  maxTiltAngle?: number;
}

export class SteeringConfiguration {
  public readonly sensitivity: number;
  public readonly deadZone: number;
  public readonly smoothing: number;
  public readonly invert: boolean;
  public readonly autoCenter: boolean;
  public readonly responseCurve: ResponseCurveType;
  public readonly maxTiltAngle: number;

  constructor(props: SteeringConfigurationProps = {}) {
    this.sensitivity = typeof props.sensitivity === 'number' ? Math.max(0.1, Math.min(5.0, props.sensitivity)) : 1.3;
    this.deadZone = typeof props.deadZone === 'number' ? Math.max(0.0, Math.min(0.5, props.deadZone)) : 0.01;
    this.smoothing = typeof props.smoothing === 'number' ? Math.max(0.0, Math.min(0.95, props.smoothing)) : 0.0;
    this.invert = Boolean(props.invert);
    this.autoCenter = props.autoCenter !== undefined ? Boolean(props.autoCenter) : false;
    this.responseCurve = props.responseCurve || 'linear';
    this.maxTiltAngle = typeof props.maxTiltAngle === 'number' ? Math.max(0.1, props.maxTiltAngle) : 0.50; // ~28 degrees
  }

  public static default(): SteeringConfiguration {
    return new SteeringConfiguration();
  }

  public with(overrides: Partial<SteeringConfigurationProps>): SteeringConfiguration {
    return new SteeringConfiguration({
      sensitivity: overrides.sensitivity ?? this.sensitivity,
      deadZone: overrides.deadZone ?? this.deadZone,
      smoothing: overrides.smoothing ?? this.smoothing,
      invert: overrides.invert ?? this.invert,
      autoCenter: overrides.autoCenter ?? this.autoCenter,
      responseCurve: overrides.responseCurve ?? this.responseCurve,
      maxTiltAngle: overrides.maxTiltAngle ?? this.maxTiltAngle
    });
  }
}
