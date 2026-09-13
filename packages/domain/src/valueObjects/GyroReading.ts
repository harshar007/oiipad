export interface GyroReadingData {
  x: number;
  y: number;
  z: number;
  timestamp?: number;
}

export class GyroReading {
  public readonly x: number;
  public readonly y: number;
  public readonly z: number;
  public readonly timestamp: number;

  constructor(data: GyroReadingData) {
    this.x = isFinite(data.x) ? data.x : 0;
    this.y = isFinite(data.y) ? data.y : 0;
    this.z = isFinite(data.z) ? data.z : 0;
    this.timestamp = data.timestamp ?? Date.now();
  }

  public static zero(): GyroReading {
    return new GyroReading({ x: 0, y: 0, z: 0, timestamp: 0 });
  }
}
