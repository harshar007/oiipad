import { DomainError } from '../errors/DomainErrors';

export class PlayerId {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      throw new DomainError('PlayerId cannot be empty');
    }
    this._value = value.trim();
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: PlayerId | null | undefined): boolean {
    if (!other) return false;
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
