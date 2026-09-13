import { WebSocketServer } from 'ws';
import { WebSocketMessageHandler } from '../../presentation/handlers/WebSocketMessageHandler.js';
import { Logger } from '../system/Logger.js';

export class GynooWebSocketServer {
  private wss: WebSocketServer | null = null;

  constructor(
    private port: number,
    private messageHandler: WebSocketMessageHandler
  ) {}

  public get activePort(): number {
    return this.port;
  }

  public start(): Promise<number> {
    return new Promise((resolve, reject) => {
      const tryListen = (currentPort: number, attemptsLeft: number) => {
        try {
          const wss = new WebSocketServer({ port: currentPort });

          wss.on('listening', () => {
            this.wss = wss;
            this.port = currentPort;
            Logger.info('WebSocketServer', `Gynoo WebSocket Server listening on port ${currentPort}`);
            resolve(currentPort);
          });

          wss.on('connection', (socket: any) => {
            if (socket._socket && typeof socket._socket.setNoDelay === 'function') {
              socket._socket.setNoDelay(true);
            }
            this.messageHandler.handleConnection(socket);
          });

          wss.on('error', (error: any) => {
            if (error.code === 'EADDRINUSE' && attemptsLeft > 0) {
              Logger.warn('WebSocketServer', `Port ${currentPort} in use, trying port ${currentPort + 1}...`);
              wss.close();
              tryListen(currentPort + 1, attemptsLeft - 1);
            } else {
              Logger.error('WebSocketServer', 'Server error occurred', error);
              reject(error);
            }
          });
        } catch (err) {
          reject(err);
        }
      };

      tryListen(this.port, 10);
    });
  }

  public stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.wss) {
        this.wss.close(() => {
          Logger.info('WebSocketServer', 'WebSocket server stopped');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}
