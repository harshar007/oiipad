import dgram from 'dgram';
import { Logger } from '../system/Logger.js';
import { NetworkUtils } from '../system/NetworkUtils.js';
import { RoomRepositoryPort } from '@oiipad/domain';

export interface DiscoveryServerOptions {
  discoveryPort: number;
  wsPort: number;
  serverName: string;
}

export class UdpPcDiscoveryServer {
  private socket: dgram.Socket | null = null;
  private isRunning: boolean = false;

  constructor(
    private options: DiscoveryServerOptions,
    private roomRepository: RoomRepositoryPort
  ) {}

  public start(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = dgram.createSocket({ type: 'udp4', reuseAddr: true });

        this.socket.on('error', (err) => {
          Logger.error('DiscoveryServer', 'UDP socket error', err);
        });

        this.socket.on('message', async (msg, rinfo) => {
          try {
            const str = msg.toString();
            if (str.includes('GYNOO_DISCOVER') || str.includes('OIIPAD_DISCOVER')) {
              await this.respondToDiscovery(rinfo);
            }
          } catch (err) {
            Logger.error('DiscoveryServer', 'Error responding to discovery', err);
          }
        });

        this.socket.bind(this.options.discoveryPort, () => {
          this.isRunning = true;
          try {
            this.socket?.setBroadcast(true);
          } catch {}
          Logger.info('DiscoveryServer', `UDP Discovery Server listening on port ${this.options.discoveryPort}`);
          resolve();
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  private async respondToDiscovery(rinfo: dgram.RemoteInfo): Promise<void> {
    const rooms = await this.roomRepository.getAll();
    const activeRoom = rooms[0];
    const localIp = NetworkUtils.getPrimaryLocalIp();

    const payload = JSON.stringify({
      type: 'GYNOO_OFFER',
      name: this.options.serverName,
      host: localIp,
      port: this.options.wsPort,
      roomCode: activeRoom?.code.value || 'BBR1',
      activePlayers: activeRoom?.playerCount || 0,
      maxPlayers: activeRoom?.maxPlayers || 4
    });

    this.socket?.send(payload, rinfo.port, rinfo.address, (err) => {
      if (err) {
        Logger.error('DiscoveryServer', `Failed to send discovery response to ${rinfo.address}:${rinfo.port}`, err);
      } else {
        Logger.debug('DiscoveryServer', `Sent discovery response to ${rinfo.address}:${rinfo.port}`);
      }
    });
  }

  public stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.socket && this.isRunning) {
        this.socket.close(() => {
          this.isRunning = false;
          Logger.info('DiscoveryServer', 'UDP Discovery Server stopped');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}
