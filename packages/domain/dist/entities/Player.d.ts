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
export declare class Player {
    readonly id: PlayerId;
    readonly name: string;
    readonly slot: PlayerSlotNumber;
    readonly connectionState: ConnectionStateType;
    readonly readyState: boolean;
    readonly controllerState: ControllerState;
    readonly lastHeartbeat: number;
    constructor(props: PlayerProps);
    setReady(ready: boolean): Player;
    setConnectionState(state: ConnectionStateType): Player;
    updateControllerState(newState: ControllerState): Player;
    touchHeartbeat(): Player;
}
//# sourceMappingURL=Player.d.ts.map