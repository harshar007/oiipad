import { DiscoveredPc, PcDiscoveryListener, PcDiscoveryPort } from '@oiipad/domain';

export class UdpPcDiscoveryRepository implements PcDiscoveryPort {
  private listeners: Set<PcDiscoveryListener> = new Set();
  private discoveredPcs: Map<string, DiscoveredPc> = new Map();
  private scanInterval: any = null;

  public async startDiscovery(): Promise<void> {
    // Add default localhost and local network discovery probe
    this.addDiscoveredPc({
      id: 'local_host',
      name: 'Local PC Host',
      host: '127.0.0.1',
      port: 8888,
      roomCode: 'BBR1',
      activePlayers: 0,
      maxPlayers: 4,
      lastSeen: Date.now()
    });

    this.scanInterval = setInterval(() => {
      this.notifyListeners();
    }, 2000);
  }

  public async stopDiscovery(): Promise<void> {
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
      this.scanInterval = null;
    }
  }

  public async broadcastPresence(_pcInfo: Omit<DiscoveredPc, 'lastSeen'>): Promise<void> {
    // Mobile client does not broadcast server presence
  }

  public onPcsUpdated(listener: PcDiscoveryListener): () => void {
    this.listeners.add(listener);
    listener(Array.from(this.discoveredPcs.values()));
    return () => {
      this.listeners.delete(listener);
    };
  }

  public addDiscoveredPc(pc: DiscoveredPc): void {
    this.discoveredPcs.set(pc.id, pc);
    this.notifyListeners();
  }

  private notifyListeners(): void {
    const list = Array.from(this.discoveredPcs.values());
    for (const listener of this.listeners) {
      listener(list);
    }
  }
}
