import { WebSocketMessageHandler } from '../../presentation/handlers/WebSocketMessageHandler.js';
export declare class GynooWebSocketServer {
    private port;
    private messageHandler;
    private wss;
    constructor(port: number, messageHandler: WebSocketMessageHandler);
    get activePort(): number;
    start(): Promise<number>;
    stop(): Promise<void>;
}
//# sourceMappingURL=GynooWebSocketServer.d.ts.map