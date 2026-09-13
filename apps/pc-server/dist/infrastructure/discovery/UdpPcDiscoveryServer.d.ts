import { RoomRepositoryPort } from '@oiipad/domain';
export interface DiscoveryServerOptions {
    discoveryPort: number;
    wsPort: number;
    serverName: string;
}
export declare class UdpPcDiscoveryServer {
    private options;
    private roomRepository;
    private socket;
    private isRunning;
    constructor(options: DiscoveryServerOptions, roomRepository: RoomRepositoryPort);
    start(): Promise<void>;
    private respondToDiscovery;
    stop(): Promise<void>;
}
//# sourceMappingURL=UdpPcDiscoveryServer.d.ts.map