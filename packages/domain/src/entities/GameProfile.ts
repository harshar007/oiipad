import { GameProfileId } from '../valueObjects/GameProfileId';

export interface GamepadMapping {
  steeringAxis: string; // e.g., 'LEFT_STICK_X'
  accelerateTarget: { type: 'trigger' | 'button' | 'axis'; name: string };
  brakeTarget: { type: 'trigger' | 'button' | 'axis'; name: string };
  powerUpButton: string; // e.g., 'A'
  secondaryPowerUpButton?: string; // e.g., 'B'
  boostButton: string; // e.g., 'Y'
  handbrakeButton: string; // e.g., 'RIGHT_SHOULDER'
  pauseButton: string; // e.g., 'START'
  customButtons?: Record<string, string>;
}

export interface GameProfileProps {
  id: GameProfileId;
  name: string;
  description: string;
  mapping: GamepadMapping;
}

export class GameProfile {
  public readonly id: GameProfileId;
  public readonly name: string;
  public readonly description: string;
  public readonly mapping: Readonly<GamepadMapping>;

  constructor(props: GameProfileProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.mapping = Object.freeze({ ...props.mapping });
  }

  public static bbr1(): GameProfile {
    return new GameProfile({
      id: GameProfileId.BBR1,
      name: 'Beach Buggy Racing 1',
      description: 'Optimized tilt steering & controls for Beach Buggy Racing 1',
      mapping: {
        steeringAxis: 'LEFT_STICK_X',
        accelerateTarget: { type: 'trigger', name: 'RIGHT_TRIGGER' },
        brakeTarget: { type: 'trigger', name: 'LEFT_TRIGGER' },
        powerUpButton: 'A',
        boostButton: 'Y',
        handbrakeButton: 'RIGHT_SHOULDER',
        pauseButton: 'START'
      }
    });
  }

  public static bbr2(): GameProfile {
    return new GameProfile({
      id: GameProfileId.BBR2,
      name: 'Beach Buggy Racing 2',
      description: 'Dual power-up & special ability tilt controls for Beach Buggy Racing 2',
      mapping: {
        steeringAxis: 'LEFT_STICK_X',
        accelerateTarget: { type: 'trigger', name: 'RIGHT_TRIGGER' },
        brakeTarget: { type: 'trigger', name: 'LEFT_TRIGGER' },
        powerUpButton: 'A',
        secondaryPowerUpButton: 'B',
        boostButton: 'Y',
        handbrakeButton: 'RIGHT_SHOULDER',
        pauseButton: 'START'
      }
    });
  }

  public static standard(): GameProfile {
    return new GameProfile({
      id: GameProfileId.STANDARD,
      name: 'Standard Gamepad',
      description: 'Direct XInput gamepad emulation layout',
      mapping: {
        steeringAxis: 'LEFT_STICK_X',
        accelerateTarget: { type: 'trigger', name: 'RIGHT_TRIGGER' },
        brakeTarget: { type: 'trigger', name: 'LEFT_TRIGGER' },
        powerUpButton: 'A',
        boostButton: 'B',
        handbrakeButton: 'RIGHT_SHOULDER',
        pauseButton: 'START'
      }
    });
  }
}
