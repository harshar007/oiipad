"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UdpPcDiscoveryServer = void 0;
const dgram_1 = __importDefault(require("dgram"));
const Logger_js_1 = require("../system/Logger.js");
const NetworkUtils_js_1 = require("../system/NetworkUtils.js");
class UdpPcDiscoveryServer {
    options;
    roomRepository;
    socket = null;
    isRunning = false;
    constructor(options, roomRepository) {
        this.options = options;
        this.roomRepository = roomRepository;
    }
    start() {
        return new Promise((resolve, reject) => {
            try {
                this.socket = dgram_1.default.createSocket({ type: 'udp4', reuseAddr: true });
                this.socket.on('error', (err) => {
                    Logger_js_1.Logger.error('DiscoveryServer', 'UDP socket error', err);
                });
                this.socket.on('message', async (msg, rinfo) => {
                    try {
                        const str = msg.toString();
                        if (str.includes('GYNOO_DISCOVER') || str.includes('OIIPAD_DISCOVER')) {
                            await this.respondToDiscovery(rinfo);
                        }
                    }
                    catch (err) {
                        Logger_js_1.Logger.error('DiscoveryServer', 'Error responding to discovery', err);
                    }
                });
                this.socket.bind(this.options.discoveryPort, () => {
                    this.isRunning = true;
                    try {
                        this.socket?.setBroadcast(true);
                    }
                    catch { }
                    Logger_js_1.Logger.info('DiscoveryServer', `UDP Discovery Server listening on port ${this.options.discoveryPort}`);
                    resolve();
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }
    async respondToDiscovery(rinfo) {
        const rooms = await this.roomRepository.getAll();
        const activeRoom = rooms[0];
        const localIp = NetworkUtils_js_1.NetworkUtils.getPrimaryLocalIp();
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
                Logger_js_1.Logger.error('DiscoveryServer', `Failed to send discovery response to ${rinfo.address}:${rinfo.port}`, err);
            }
            else {
                Logger_js_1.Logger.debug('DiscoveryServer', `Sent discovery response to ${rinfo.address}:${rinfo.port}`);
            }
        });
    }
    stop() {
        return new Promise((resolve) => {
            if (this.socket && this.isRunning) {
                this.socket.close(() => {
                    this.isRunning = false;
                    Logger_js_1.Logger.info('DiscoveryServer', 'UDP Discovery Server stopped');
                    resolve();
                });
            }
            else {
                resolve();
            }
        });
    }
}
exports.UdpPcDiscoveryServer = UdpPcDiscoveryServer;
//# sourceMappingURL=UdpPcDiscoveryServer.js.map