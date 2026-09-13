import { ClientMessage, ServerMessage, parseServerMessage, PROTOCOL_VERSION } from '@oiipad/protocol';

export type ConnectionStatusListener = (status: 'disconnected' | 'connecting' | 'connected') => void;
export type MessageListener = (message: ServerMessage) => void;

export class GynooWebSocketClient {
  private socket: WebSocket | null = null;
  private messageListeners: Set<MessageListener> = new Set();
  private statusListeners: Set<ConnectionStatusListener> = new Set();
  private status: 'disconnected' | 'connecting' | 'connected' = 'disconnected';
  private heartbeatInterval: any = null;
  private url: string = '';

  public get connectionStatus(): 'disconnected' | 'connecting' | 'connected' {
    return this.status;
  }

  private setStatus(status: 'disconnected' | 'connecting' | 'connected'): void {
    this.status = status;
    for (const listener of this.statusListeners) {
      listener(status);
    }
  }

  public connect(url: string): Promise<void> {
    this.url = url;
    this.setStatus('connecting');

    return new Promise((resolve, reject) => {
      try {
        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
          this.setStatus('connected');
          this.startHeartbeat();
          resolve();
        };

        this.socket.onmessage = (event) => {
          const parsed = parseServerMessage(event.data);
          if (parsed.success) {
            for (const listener of this.messageListeners) {
              listener(parsed.data);
            }
          }
        };

        this.socket.onclose = () => {
          this.stopHeartbeat();
          this.setStatus('disconnected');
        };

        this.socket.onerror = (error) => {
          this.stopHeartbeat();
          this.setStatus('disconnected');
          reject(error);
        };
      } catch (err) {
        this.setStatus('disconnected');
        reject(err);
      }
    });
  }

  public disconnect(): void {
    this.stopHeartbeat();
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.setStatus('disconnected');
  }

  public send(message: ClientMessage): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  public onMessage(listener: MessageListener): () => void {
    this.messageListeners.add(listener);
    return () => {
      this.messageListeners.delete(listener);
    };
  }

  public onStatusChange(listener: ConnectionStatusListener): () => void {
    this.statusListeners.add(listener);
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      this.send({
        version: PROTOCOL_VERSION,
        type: 'ping',
        timestamp: Date.now()
      });
    }, 5000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
}
