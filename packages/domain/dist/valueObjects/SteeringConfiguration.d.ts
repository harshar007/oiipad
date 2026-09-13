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
export declare class SteeringConfiguration {
    readonly sensitivity: number;
    readonly deadZone: number;
    readonly smoothing: number;
    readonly invert: boolean;
    readonly autoCenter: boolean;
    readonly responseCurve: ResponseCurveType;
    readonly maxTiltAngle: number;
    constructor(props?: SteeringConfigurationProps);
    static default(): SteeringConfiguration;
    with(overrides: Partial<SteeringConfigurationProps>): SteeringConfiguration;
}
//# sourceMappingURL=SteeringConfiguration.d.ts.map