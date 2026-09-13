"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GynooWebSocketServer = void 0;
const ws_1 = require("ws");
const Logger_js_1 = require("../system/Logger.js");
class GynooWebSocketServer {
    port;
    messageHandler;
    wss = null;
    constructor(port, messageHandler) {
        this.port = port;
        this.messageHandler = messageHandler;
    }
    get activePort() {
        return this.port;
    }
    start() {
        return new Promise((resolve, reject) => {
            const tryListen = (currentPort, attemptsLeft) => {
                try {
                    const wss = new ws_1.WebSocketServer({ port: currentPort });
                    wss.on('listening', () => {
                        this.wss = wss;
                        this.port = currentPort;
                        Logger_js_1.Logger.info('WebSocketServer', `Gynoo WebSocket Server listening on port ${currentPort}`);
                        resolve(currentPort);
                    });
                    wss.on('connection', (socket) => {
                        this.messageHandler.handleConnection(socket);
                    });
                    wss.on('error', (error) => {
                        if (error.code === 'EADDRINUSE' && attemptsLeft > 0) {
                            Logger_js_1.Logger.warn('WebSocketServer', `Port ${currentPort} in use, trying port ${currentPort + 1}...`);
                            wss.close();
                            tryListen(currentPort + 1, attemptsLeft - 1);
                        }
                        else {
                            Logger_js_1.Logger.error('WebSocketServer', 'Server error occurred', error);
                            reject(error);
                        }
                    });
                }
                catch (err) {
                    reject(err);
                }
            };
            tryListen(this.port, 10);
        });
    }
    stop() {
        return new Promise((resolve) => {
            if (this.wss) {
                this.wss.close(() => {
                    Logger_js_1.Logger.info('WebSocketServer', 'WebSocket server stopped');
                    resolve();
                });
            }
            else {
                resolve();
            }
        });
    }
}
exports.GynooWebSocketServer = GynooWebSocketServer;
//# sourceMappingURL=GynooWebSocketServer.js.map