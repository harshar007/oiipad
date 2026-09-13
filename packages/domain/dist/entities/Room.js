"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const GameProfileId_1 = require("../valueObjects/GameProfileId");
const DomainErrors_1 = require("../errors/DomainErrors");
class Room {
    id;
    code;
    players;
    maxPlayers;
    gameProfile;
    state;
    createdAt;
    constructor(props) {
        this.id = props.id;
        this.code = props.code;
        this.players = props.players ? new Map(props.players) : new Map();
        this.maxPlayers = props.maxPlayers ?? 4;
        this.gameProfile = props.gameProfile ?? GameProfileId_1.GameProfileId.BBR1;
        this.state = props.state ?? 'waiting';
        this.createdAt = props.createdAt ?? Date.now();
    }
    get playerCount() {
        return this.players.size;
    }
    getAvailableSlot() {
        const occupiedSlots = new Set();
        for (const player of this.players.values()) {
            if (player.connectionState !== 'disconnected') {
                occupiedSlots.add(player.slot);
            }
        }
        for (let slot = 1; slot <= this.maxPlayers; slot++) {
            if (!occupiedSlots.has(slot)) {
                return slot;
            }
        }
        throw new DomainErrors_1.NoAvailableSlotError();
    }
    addPlayer(player) {
        if (this.players.size >= this.maxPlayers && !this.players.has(player.id.value)) {
            throw new DomainErrors_1.RoomFullError(this.maxPlayers);
        }
        // Check slot uniqueness among active players
        for (const existing of this.players.values()) {
            if (!existing.id.equals(player.id) &&
                existing.slot === player.slot &&
                existing.connectionState !== 'disconnected') {
                throw new DomainErrors_1.SlotAlreadyOccupiedError(player.slot);
            }
        }
        const nextPlayers = new Map(this.players);
        nextPlayers.set(player.id.value, player);
        return new Room({
            ...this,
            players: nextPlayers
        });
    }
    removePlayer(playerId) {
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
    getPlayer(playerId) {
        return this.players.get(playerId.value);
    }
    updatePlayer(player) {
        if (!this.players.has(player.id.value)) {
            throw new DomainErrors_1.PlayerNotFoundError(player.id.value);
        }
        const nextPlayers = new Map(this.players);
        nextPlayers.set(player.id.value, player);
        return new Room({
            ...this,
            players: nextPlayers
        });
    }
    setGameProfile(gameProfile) {
        return new Room({
            ...this,
            gameProfile
        });
    }
    setState(state) {
        return new Room({
            ...this,
            state
        });
    }
    allPlayersReady() {
        if (this.players.size === 0)
            return false;
        for (const player of this.players.values()) {
            if (player.connectionState === 'connected' && !player.readyState) {
                return false;
            }
        }
        return true;
    }
}
exports.Room = Room;
//# sourceMappingURL=Room.js.map