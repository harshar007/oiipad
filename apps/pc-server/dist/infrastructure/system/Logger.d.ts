export declare enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}
export declare class Logger {
    private static level;
    static setLevel(level: LogLevel): void;
    static debug(module: string, message: string, data?: unknown): void;
    static info(module: string, message: string, data?: unknown): void;
    static warn(module: string, message: string, data?: unknown): void;
    static error(module: string, message: string, error?: unknown): void;
}
//# sourceMappingURL=Logger.d.ts.map