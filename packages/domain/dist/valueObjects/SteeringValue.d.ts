export declare class SteeringValue {
    private readonly _value;
    constructor(value: number);
    get value(): number;
    static center(): SteeringValue;
    static fromClamped(raw: number): SteeringValue;
    equals(other: SteeringValue | null | undefined): boolean;
    toString(): string;
}
//# sourceMappingURL=SteeringValue.d.ts.map