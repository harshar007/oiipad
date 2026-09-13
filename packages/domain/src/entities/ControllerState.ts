import { SteeringValue } from '../valueObjects/SteeringValue';

export interface ControllerStateProps {
  steering?: SteeringValue;
  accelerate?: number;
  brake?: number;
  handbrake?: boolean;
  boost?: boolean;
  powerUp?: boolean;
  pause?: boolean;
  buttons?: Record<string, boolean>;
  timestamp?: number;
}

export class ControllerState {
  public readonly steering: SteeringValue;
  public readonly accelerate: number;
  public readonly brake: number;
  public readonly handbrake: boolean;
  public readonly boost: boolean;
  public readonly powerUp: boolean;
  public readonly pause: boolean;
  public readonly buttons: Readonly<Record<string, boolean>>;
  public readonly timestamp: number;

  constructor(props: ControllerStateProps = {}) {
    this.steering = props.steering ?? SteeringValue.center();
    this.accelerate = Math.max(0.0, Math.min(1.0, props.accelerate ?? 0.0));
    this.brake = Math.max(0.0, Math.min(1.0, props.brake ?? 0.0));
    this.handbrake = Boolean(props.handbrake);
    this.boost = Boolean(props.boost);
    this.powerUp = Boolean(props.powerUp);
    this.pause = Boolean(props.pause);
    this.buttons = Object.freeze({ ...(props.buttons ?? {}) });
    this.timestamp = props.timestamp ?? Date.now();
  }

  public static default(): ControllerState {
    return new ControllerState({
      steering: SteeringValue.center(),
      accelerate: 0.0,
      brake: 0.0,
      handbrake: false,
      boost: false,
      powerUp: false,
      pause: false,
      buttons: {},
      timestamp: Date.now()
    });
  }

  public with(updates: Partial<ControllerStateProps>): ControllerState {
    return new ControllerState({
      steering: updates.steering ?? this.steering,
      accelerate: updates.accelerate ?? this.accelerate,
      brake: updates.brake ?? this.brake,
      handbrake: updates.handbrake ?? this.handbrake,
      boost: updates.boost ?? this.boost,
      powerUp: updates.powerUp ?? this.powerUp,
      pause: updates.pause ?? this.pause,
      buttons: updates.buttons ? { ...this.buttons, ...updates.buttons } : this.buttons,
      timestamp: updates.timestamp ?? Date.now()
    });
  }
}
