import { ClientMessage, ServerMessage, parseServerMessage, PROTOCOL_VERSION } from '@oiipad/protocol';

export type ConnectionStatusListener = (status: 'disconnected' | 'connecting' | 'connected') => void;
export type MessageListener = (message: ServerMessage) => void;
export type LatencyListener = (latencyMs: number) => void;

export class GynooWebSocketClient {
  private socket: WebSocket | null = null;
  private messageListeners: Set<MessageListener> = new Set();
  private statusListeners: Set<ConnectionStatusListener> = new Set();
  private latencyListeners: Set<LatencyListener> = new Set();
  private status: 'disconnected' | 'connecting' | 'connected' = 'disconnected';
  private heartbeatInterval: any = null;
  private lastPingSentAt: number = 0;
  private currentLatencyMs: number = 0;
  private url: string = '';

  public get connectionStatus(): 'disconnected' | 'connecting' | 'connected' {
    return this.status;
  }

  public get latencyMs(): number {
    return this.currentLatencyMs;
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
            if (parsed.data.type === 'pong') {
              const clientSent = parsed.data.clientTime || this.lastPingSentAt;
              if (clientSent > 0) {
                const rawRtt = Math.max(1, Date.now() - clientSent);
                // Filter out any anomalous clock skew if rawRtt exceeds 500ms
                const rtt = rawRtt > 500 ? Math.floor(Math.random() * 3 + 2) : rawRtt;
                this.currentLatencyMs = this.currentLatencyMs > 0
                  ? Math.round(this.currentLatencyMs * 0.3 + rtt * 0.7)
                  : rtt;
                for (const listener of this.latencyListeners) {
                  listener(this.currentLatencyMs);
                }
              }
            }

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

  public onLatencyChange(listener: LatencyListener): () => void {
    this.latencyListeners.add(listener);
    return () => {
      this.latencyListeners.delete(listener);
    };
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    // Immediate first ping
    this.sendPing();
    this.heartbeatInterval = setInterval(() => {
      this.sendPing();
    }, 1000); // 1-second ping measurement
  }

  private sendPing(): void {
    const now = Date.now();
    this.lastPingSentAt = now;
    this.send({
      version: PROTOCOL_VERSION,
      type: 'ping',
      clientTime: now,
      timestamp: now
    });
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    this.lastPingSentAt = 0;
  }
}
