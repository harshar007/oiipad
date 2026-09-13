export interface ServerConfig {
  wsPort: number;
  discoveryPort: number;
  serverName: string;
  defaultRoomCode: string;
  maxPlayers: number;
}

export const DEFAULT_SERVER_CONFIG: ServerConfig = {
  wsPort: parseInt(process.env.GYNOO_PORT || '8888', 10),
  discoveryPort: parseInt(process.env.GYNOO_DISCOVERY_PORT || '41234', 10),
  serverName: process.env.GYNOO_SERVER_NAME || 'Gynoo PC Host',
  defaultRoomCode: process.env.GYNOO_ROOM_CODE || 'BBR1',
  maxPlayers: 4
};
