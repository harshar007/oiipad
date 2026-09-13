import { RoomCode } from '../valueObjects/RoomCode';
import { PlayerId } from '../valueObjects/PlayerId';
import { GameProfileId } from '../valueObjects/GameProfileId';
import { Player, PlayerSlotNumber } from './Player';
import { ControllerState } from './ControllerState';
import {
  RoomFullError,
  PlayerNotFoundError,
  SlotAlreadyOccupiedError,
  NoAvailableSlotError
} from '../errors/DomainErrors';

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

export class Room {
  public readonly id: string;
  public readonly code: RoomCode;
  public readonly players: ReadonlyMap<string, Player>;
  public readonly maxPlayers: number;
  public readonly gameProfile: GameProfileId;
  public readonly state: RoomStateType;
  public readonly createdAt: number;

  constructor(props: RoomProps) {
    this.id = props.id;
    this.code = props.code;
    this.players = props.players ? new Map(props.players) : new Map();
    this.maxPlayers = props.maxPlayers ?? 4;
    this.gameProfile = props.gameProfile ?? GameProfileId.BBR1;
    this.state = props.state ?? 'waiting';
    this.createdAt = props.createdAt ?? Date.now();
  }

  public get playerCount(): number {
    return this.players.size;
  }

  public getAvailableSlot(): PlayerSlotNumber {
    const occupiedSlots = new Set<number>();
    for (const player of this.players.values()) {
      if (player.connectionState !== 'disconnected') {
        occupiedSlots.add(player.slot);
      }
    }
    for (let slot = 1; slot <= this.maxPlayers; slot++) {
      if (!occupiedSlots.has(slot)) {
        return slot as PlayerSlotNumber;
      }
    }
    throw new NoAvailableSlotError();
  }

  public addPlayer(player: Player): Room {
    if (this.players.size >= this.maxPlayers && !this.players.has(player.id.value)) {
      throw new RoomFullError(this.maxPlayers);
    }

    // Check slot uniqueness among active players
    for (const existing of this.players.values()) {
      if (
        !existing.id.equals(player.id) &&
        existing.slot === player.slot &&
        existing.connectionState !== 'disconnected'
      ) {
        throw new SlotAlreadyOccupiedError(player.slot);
      }
    }

    const nextPlayers = new Map(this.players);
    nextPlayers.set(player.id.value, player);

    return new Room({
      ...this,
      players: nextPlayers
    });
  }

  public removePlayer(playerId: PlayerId): Room {
    if (!this.players.has(playerId.value)) {
      return this;
    }
    const nextPlayers = new Map(this.players);
    nextPlayers.delete(playerId.value);

    return new Room({
      ...this,
      players: nextPlayers
    });
  }

  public getPlayer(playerId: PlayerId): Player | undefined {
    return this.players.get(playerId.value);
  }

  public updatePlayer(player: Player): Room {
    if (!this.players.has(player.id.value)) {
      throw new PlayerNotFoundError(player.id.value);
    }
    const nextPlayers = new Map(this.players);
    nextPlayers.set(player.id.value, player);
    return new Room({
      ...this,
      players: nextPlayers
    });
  }

  public setGameProfile(gameProfile: GameProfileId): Room {
    return new Room({
      ...this,
      gameProfile
    });
  }

  public setState(state: RoomStateType): Room {
    return new Room({
      ...this,
      state
    });
  }

  public allPlayersReady(): boolean {
    if (this.players.size === 0) return false;
    for (const player of this.players.values()) {
      if (player.connectionState === 'connected' && !player.readyState) {
        return false;
      }
    }
    return true;
  }
}
