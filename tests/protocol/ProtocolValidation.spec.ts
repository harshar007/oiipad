import {
  parseClientMessage,
  parseServerMessage,
  PROTOCOL_VERSION
} from '@oiipad/protocol';

describe('Protocol Serialization and Validation Tests', () => {
  it('should validate valid controller_input message', () => {
    const validPacket = JSON.stringify({
      version: PROTOCOL_VERSION,
      type: 'controller_input',
      playerId: 'player-123',
      payload: {
        steering: 0.75,
        accelerate: 1.0,
        brake: 0.0,
        handbrake: false,
        boost: true,
        powerUp: false,
        pause: false,
        buttons: { A: true }
      },
      timestamp: Date.now()
    });

    const parsed = parseClientMessage(validPacket);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.type).toBe('controller_input');
      expect((parsed.data as any).payload.steering).toBe(0.75);
    }
  });

  it('should reject invalid steering ranges (> 1.0 or < -1.0)', () => {
    const invalidPacket = JSON.stringify({
      version: PROTOCOL_VERSION,
      type: 'controller_input',
      playerId: 'player-123',
      payload: {
        steering: 2.5 // Invalid
      },
      timestamp: Date.now()
    });

    const parsed = parseClientMessage(invalidPacket);
    expect(parsed.success).toBe(false);
  });

  it('should parse valid join_room message', () => {
    const joinPacket = JSON.stringify({
      version: PROTOCOL_VERSION,
      type: 'join_room',
      roomCode: 'BBR1',
      playerName: 'Racer 1'
    });

    const parsed = parseClientMessage(joinPacket);
    expect(parsed.success).toBe(true);
  });
});
