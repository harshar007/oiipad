export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export class Logger {
  private static level: LogLevel = LogLevel.INFO;

  public static setLevel(level: LogLevel): void {
    Logger.level = level;
  }

  public static debug(module: string, message: string, data?: unknown): void {
    if (Logger.level <= LogLevel.DEBUG) {
      console.log(`[DEBUG][${new Date().toISOString()}][${module}] ${message}`, data ? JSON.stringify(data) : '');
    }
  }

  public static info(module: string, message: string, data?: unknown): void {
    if (Logger.level <= LogLevel.INFO) {
      console.log(`[INFO][${new Date().toISOString()}][${module}] ${message}`, data ? JSON.stringify(data) : '');
    }
  }

  public static warn(module: string, message: string, data?: unknown): void {
    if (Logger.level <= LogLevel.WARN) {
      console.warn(`[WARN][${new Date().toISOString()}][${module}] ${message}`, data ? JSON.stringify(data) : '');
    }
  }

  public static error(module: string, message: string, error?: unknown): void {
    if (Logger.level <= LogLevel.ERROR) {
      console.error(`[ERROR][${new Date().toISOString()}][${module}] ${message}`, error ?? '');
    }
  }
}
