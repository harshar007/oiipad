"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SERVER_CONFIG = void 0;
exports.DEFAULT_SERVER_CONFIG = {
    wsPort: parseInt(process.env.GYNOO_PORT || '8888', 10),
    discoveryPort: parseInt(process.env.GYNOO_DISCOVERY_PORT || '41234', 10),
    serverName: process.env.GYNOO_SERVER_NAME || 'Gynoo PC Host',
    defaultRoomCode: process.env.GYNOO_ROOM_CODE || 'BBR1',
    maxPlayers: 4
};
//# sourceMappingURL=ServerConfig.js.map