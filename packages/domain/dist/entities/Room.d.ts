import { RoomCode } from '../valueObjects/RoomCode';
import { PlayerId } from '../valueObjects/PlayerId';
import { GameProfileId } from '../valueObjects/GameProfileId';
import { Player, PlayerSlotNumber } from './Player';
export type RoomStateType = 'waiting' | 'in_game' | 'paused' | 'closed';
export interface RoomProps {
    id: string;
    code: RoomCode;
    players?: Map<string, Player> | ReadonlyMap<string, Player>;
    maxPlayers?: number;
    gameProfile?: GameProfileId;
    state?: RoomStateType;
    createdAt?: number;
}
export declare class Room {
    readonly id: string;
    readonly code: RoomCode;
    readonly players: ReadonlyMap<string, Player>;
    readonly maxPlayers: number;
    readonly gameProfile: GameProfileId;
    readonly state: RoomStateType;
    readonly createdAt: number;
    constructor(props: RoomProps);
    get playerCount(): number;
    getAvailableSlot(): PlayerSlotNumber;
    addPlayer(player: Player): Room;
    removePlayer(playerId: PlayerId): Room;
    getPlayer(playerId: PlayerId): Player | undefined;
    updatePlayer(player: Player): Room;
    setGameProfile(gameProfile: GameProfileId): Room;
    setState(state: RoomStateType): Room;
    allPlayersReady(): boolean;
}
//# sourceMappingURL=Room.d.ts.map