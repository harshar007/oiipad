import { PlayerId } from '../valueObjects/PlayerId';
import { ControllerState } from './ControllerState';

export type PlayerSlotNumber = 1 | 2 | 3 | 4;
export type ConnectionStateType = 'disconnected' | 'connecting' | 'connected' | 'reconnecting';

export interface PlayerProps {
  id: PlayerId;
  name: string;
  slot: PlayerSlotNumber;
  connectionState?: ConnectionStateType;
  readyState?: boolean;
  controllerState?: ControllerState;
  lastHeartbeat?: number;
}

export class Player {
  public readonly id: PlayerId;
  public readonly name: string;
  public readonly slot: PlayerSlotNumber;
  public readonly connectionState: ConnectionStateType;
  public readonly readyState: boolean;
  public readonly controllerState: ControllerState;
  public readonly lastHeartbeat: number;

  constructor(props: PlayerProps) {
    this.id = props.id;
    this.name = props.name.trim() || `Player ${props.slot}`;
    this.slot = props.slot;
    this.connectionState = props.connectionState ?? 'connected';
    this.readyState = Boolean(props.readyState);
    this.controllerState = props.controllerState ?? ControllerState.default();
    this.lastHeartbeat = props.lastHeartbeat ?? Date.now();
  }

  public setReady(ready: boolean): Player {
    return new Player({
      ...this,
      readyState: ready
    });
  }

  public setConnectionState(state: ConnectionStateType): Player {
    return new Player({
      ...this,
      connectionState: state,
      // If disconnected, automatically reset controller state
      controllerState: state === 'disconnected' ? ControllerState.default() : this.controllerState
    });
  }

  public updateControllerState(newState: ControllerState): Player {
    if (this.connectionState === 'disconnected') {
      return this; // Disconnected players cannot send active input
    }
    return new Player({
      ...this,
      controllerState: newState
    });
  }

  public touchHeartbeat(): Player {
    return new Player({
      ...this,
      lastHeartbeat: Date.now()
    });
  }
}
