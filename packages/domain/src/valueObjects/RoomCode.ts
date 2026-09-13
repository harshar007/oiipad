import { DomainError } from '../errors/DomainErrors';

export class RoomCode {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || typeof value !== 'string') {
      throw new DomainError('RoomCode must be a non-empty string');
    }
    const clean = value.trim().toUpperCase();
    if (clean.length < 4 || clean.length > 8) {
      throw new DomainError('RoomCode must be between 4 and 8 alphanumeric characters');
    }
    this._value = clean;
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: RoomCode | null | undefined): boolean {
    if (!other) return false;
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }

  public static generate(): RoomCode {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return new RoomCode(result);
  }
}
