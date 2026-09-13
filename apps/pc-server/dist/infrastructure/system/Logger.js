"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.LogLevel = void 0;
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
class Logger {
    static level = LogLevel.INFO;
    static setLevel(level) {
        Logger.level = level;
    }
    static debug(module, message, data) {
        if (Logger.level <= LogLevel.DEBUG) {
            console.log(`[DEBUG][${new Date().toISOString()}][${module}] ${message}`, data ? JSON.stringify(data) : '');
        }
    }
    static info(module, message, data) {
        if (Logger.level <= LogLevel.INFO) {
            console.log(`[INFO][${new Date().toISOString()}][${module}] ${message}`, data ? JSON.stringify(data) : '');
        }
    }
    static warn(module, message, data) {
        if (Logger.level <= LogLevel.WARN) {
            console.warn(`[WARN][${new Date().toISOString()}][${module}] ${message}`, data ? JSON.stringify(data) : '');
        }
    }
    static error(module, message, error) {
        if (Logger.level <= LogLevel.ERROR) {
            console.error(`[ERROR][${new Date().toISOString()}][${module}] ${message}`, error ?? '');
        }
    }
}
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map