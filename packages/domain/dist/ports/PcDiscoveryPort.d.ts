export interface DiscoveredPc {
    id: string;
    name: string;
    host: string;
    port: number;
    roomCode?: string;
    activePlayers?: number;
    maxPlayers?: number;
    lastSeen: number;
}
export type PcDiscoveryListener = (pcs: DiscoveredPc[]) => void;
export interface PcDiscoveryPort {
    startDiscovery(): Promise<void>;
    stopDiscovery(): Promise<void>;
    broadcastPresence(pcInfo: Omit<DiscoveredPc, 'lastSeen'>): Promise<void>;
    onPcsUpdated(listener: PcDiscoveryListener): () => void;
}
//# sourceMappingURL=PcDiscoveryPort.d.ts.map