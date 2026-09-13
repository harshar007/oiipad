import {
  Room,
  RoomCode,
  Player,
  PlayerId,
  GameProfileId,
  RoomFullError,
  SlotAlreadyOccupiedError
} from '@oiipad/domain';

describe('Room and Player Domain Entities', () => {
  it('should initialize room with defaults', () => {
    const room = new Room({
      id: 'BBR1',
      code: new RoomCode('BBR1'),
      maxPlayers: 4
    });

    expect(room.playerCount).toBe(0);
    expect(room.maxPlayers).toBe(4);
    expect(room.gameProfile.value).toBe('bbr1');
  });

  it('should add players and allocate slots sequentially', () => {
    let room = new Room({
      id: 'BBR1',
      code: new RoomCode('BBR1'),
      maxPlayers: 4
    });

    const p1 = new Player({
      id: new PlayerId('p1'),
      name: 'Racer One',
      slot: room.getAvailableSlot()
    });
    room = room.addPlayer(p1);

    expect(p1.slot).toBe(1);
    expect(room.playerCount).toBe(1);

    const p2 = new Player({
      id: new PlayerId('p2'),
      name: 'Racer Two',
      slot: room.getAvailableSlot()
    });
    room = room.addPlayer(p2);

    expect(p2.slot).toBe(2);
    expect(room.playerCount).toBe(2);
  });

  it('should prevent adding duplicate active slots', () => {
    let room = new Room({
      id: 'BBR1',
      code: new RoomCode('BBR1'),
      maxPlayers: 2
    });

    const p1 = new Player({ id: new PlayerId('p1'), name: 'P1', slot: 1 });
    const p2 = new Player({ id: new PlayerId('p2'), name: 'P2', slot: 1 }); // Conflict on slot 1

    room = room.addPlayer(p1);
    expect(() => room.addPlayer(p2)).toThrow(SlotAlreadyOccupiedError);
  });

  it('should enforce max player capacity', () => {
    let room = new Room({
      id: 'BBR1',
      code: new RoomCode('BBR1'),
      maxPlayers: 2
    });

    const p1 = new Player({ id: new PlayerId('p1'), name: 'P1', slot: 1 });
    const p2 = new Player({ id: new PlayerId('p2'), name: 'P2', slot: 2 });
    const p3 = new Player({ id: new PlayerId('p3'), name: 'P3', slot: 3 });

    room = room.addPlayer(p1);
    room = room.addPlayer(p2);
    expect(() => room.addPlayer(p3)).toThrow(RoomFullError);
  });

  it('should correctly evaluate allPlayersReady', () => {
    let room = new Room({ id: 'BBR1', code: new RoomCode('BBR1') });
    expect(room.allPlayersReady()).toBe(false);

    const p1 = new Player({ id: new PlayerId('p1'), name: 'P1', slot: 1, readyState: false });
    room = room.addPlayer(p1);
    expect(room.allPlayersReady()).toBe(false);

    const p1Ready = p1.setReady(true);
    room = room.updatePlayer(p1Ready);
    expect(room.allPlayersReady()).toBe(true);
  });
});
