"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const ControllerState_1 = require("./ControllerState");
class Player {
    id;
    name;
    slot;
    connectionState;
    readyState;
    controllerState;
    lastHeartbeat;
    constructor(props) {
        this.id = props.id;
        this.name = props.name.trim() || `Player ${props.slot}`;
        this.slot = props.slot;
        this.connectionState = props.connectionState ?? 'connected';
        this.readyState = Boolean(props.readyState);
        this.controllerState = props.controllerState ?? ControllerState_1.ControllerState.default();
        this.lastHeartbeat = props.lastHeartbeat ?? Date.now();
    }
    setReady(ready) {
        return new Player({
            ...this,
            readyState: ready
        });
    }
    setConnectionState(state) {
        return new Player({
            ...this,
            connectionState: state,
            // If disconnected, automatically reset controller state
            controllerState: state === 'disconnected' ? ControllerState_1.ControllerState.default() : this.controllerState
        });
    }
    updateControllerState(newState) {
        if (this.connectionState === 'disconnected') {
            return this; // Disconnected players cannot send active input
        }
        return new Player({
            ...this,
            controllerState: newState
        });
    }
    touchHeartbeat() {
        return new Player({
            ...this,
            lastHeartbeat: Date.now()
        });
    }
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map