import { DomainError } from '../errors/DomainErrors';

export class GameProfileId {
  public static readonly BBR1 = new GameProfileId('bbr1');
  public static readonly BBR2 = new GameProfileId('bbr2');
  public static readonly STANDARD = new GameProfileId('standard');

  private readonly _value: string;

  constructor(value: string) {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      throw new DomainError('GameProfileId cannot be empty');
    }
    this._value = value.trim().toLowerCase();
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: GameProfileId | null | undefined): boolean {
    if (!other) return false;
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
