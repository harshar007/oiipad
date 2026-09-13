import { z } from 'zod';
export declare const PROTOCOL_VERSION = 1;
export declare const BaseMessageSchema: z.ZodObject<{
    version: z.ZodDefault<z.ZodNumber>;
    type: z.ZodString;
    timestamp: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    version: number;
    type: string;
    timestamp: number;
}, {
    type: string;
    version?: number | undefined;
    timestamp?: number | undefined;
}>;
export declare const ControllerInputPayloadSchema: z.ZodObject<{
    steering: z.ZodNumber;
    accelerate: z.ZodDefault<z.ZodNumber>;
    brake: z.ZodDefault<z.ZodNumber>;
    handbrake: z.ZodDefault<z.ZodBoolean>;
    boost: z.ZodDefault<z.ZodBoolean>;
    powerUp: z.ZodDefault<z.ZodBoolean>;
    pause: z.ZodDefault<z.ZodBoolean>;
    buttons: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
    seq: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    steering: number;
    accelerate: number;
    brake: number;
    handbrake: boolean;
    boost: boolean;
    powerUp: boolean;
    pause: boolean;
    buttons: Record<string, boolean>;
    seq?: number | undefined;
}, {
    steering: number;
    accelerate?: number | undefined;
    brake?: number | undefined;
    handbrake?: boolean | undefined;
    boost?: boolean | undefined;
    powerUp?: boolean | undefined;
    pause?: boolean | undefined;
    buttons?: Record<string, boolean> | undefined;
    seq?: number | undefined;
}>;
export declare const ControllerInputMessageSchema: z.ZodObject<{
    version: z.ZodDefault<z.ZodNumber>;
    timestamp: z.ZodDefault<z.ZodNumber>;
} & {
    type: z.ZodLiteral<"controller_input">;
    playerId: z.ZodString;
    payload: z.ZodObject<{
        steering: z.ZodNumber;
        accelerate: z.ZodDefault<z.ZodNumber>;
        brake: z.ZodDefault<z.ZodNumber>;
        handbrake: z.ZodDefault<z.ZodBoolean>;
        boost: z.ZodDefault<z.ZodBoolean>;
        powerUp: z.ZodDefault<z.ZodBoolean>;
        pause: z.ZodDefault<z.ZodBoolean>;
        buttons: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
        seq: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        steering: number;
        accelerate: number;
        brake: number;
        handbrake: boolean;
        boost: boolean;
        powerUp: boolean;
        pause: boolean;
        buttons: Record<string, boolean>;
        seq?: number | undefined;
    }, {
        steering: number;
        accelerate?: number | undefined;
        brake?: number | undefined;
        handbrake?: boolean | undefined;
        boost?: boolean | undefined;
        powerUp?: boolean | undefined;
        pause?: boolean | undefined;
        buttons?: Record<string, boolean> | undefined;
        seq?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    version: number;
    type: "controller_input";
    timestamp: number;
    playerId: string;
    payload: {
        steering: number;
        accelerate: number;
        brake: number;
        handbrake: boolean;
        boost: boolean;
        powerUp: boolean;
        pause: boolean;
        buttons: Record<string, boolean>;
        seq?: number | undefined;
    };
}, {
    type: "controller_input";
    playerId: string;
    payload: {
        steering: number;
        accelerate?: number | undefined;
        brake?: number | undefined;
        handbrake?: boolean | undefined;
        boost?: boolean | undefined;
        powerUp?: boolean | undefined;
        pause?: boolean | undefined;
        buttons?: Record<string, boolean> | undefined;
        seq?: number | undefined;
    };
    version?: number | undefined;
    timestamp?: number | undefined;
}>;
export type ControllerInputPayload = z.infer<typeof ControllerInputPayloadSchema>;
export type ControllerInputMessage = z.infer<typeof ControllerInputMessageSchema>;
export declare const JoinRoomMessageSchema: z.ZodObject<{
    version: z.ZodDefault<z.ZodNumber>;
    timestamp: z.ZodDefault<z.ZodNumber>;
} & {
    type: z.ZodLiteral<"join_room">;
    roomCode: z.ZodString;
    playerName: z.ZodString;
    preferredSlot: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<4>]>>;
}, "strip", z.ZodTypeAny, {
    version: number;
    type: "join_room";
    timestamp: number;
    roomCode: string;
    playerName: string;
    preferredSlot?: 1 | 2 | 3 | 4 | undefined;
}, {
    type: "join_room";
    roomCode: string;
    playerName: string;
    version?: number | undefined;
    timestamp?: number | undefined;
    preferredSlot?: 1 | 2 | 3 | 4 | undefined;
}>;
export type JoinRoomMessage = z.infer<typeof JoinRoomMessageSchema>;
export declare const PlayerDtoSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    slot: z.ZodUnion<[z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<4>]>;
    connectionState: z.ZodEnum<["disconnected", "connecting", "connected", "reconnecting"]>;
    readyState: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    slot: 1 | 2 | 3 | 4;
    connectionState: "disconnected" | "connecting" | "connected" | "reconnecting";
    readyState: boolean;
}, {
    id: string;
    name: string;
    slot: 1 | 2 | 3 | 4;
    connectionState: "disconnected" | "connecting" | "connected" | "reconnecting";
    readyState: boolean;
}>;
export type PlayerDto = z.infer<typeof PlayerDtoSchema>;
export declare const JoinRoomResponseSchema: z.ZodObject<{
    version: z.ZodDefault<z.ZodNumber>;
    timestamp: z.ZodDefault<z.ZodNumber>;
} & {
    type: z.ZodLiteral<"join_room_response">;
    success: z.ZodBoolean;
    playerId: z.ZodOptional<z.ZodString>;
    slot: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<4>]>>;
    roomCode: z.ZodOptional<z.ZodString>;
    gameProfile: z.ZodOptional<z.ZodString>;
    players: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        slot: z.ZodUnion<[z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<4>]>;
        connectionState: z.ZodEnum<["disconnected", "connecting", "connected", "reconnecting"]>;
        readyState: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        slot: 1 | 2 | 3 | 4;
        connectionState: "disconnected" | "connecting" | "connected" | "reconnecting";
        readyState: boolean;
    }, {
        id: string;
        name: string;
        slot: 1 | 2 | 3 | 4;
        connectionState: "disconnected" | "connecting" | "connected" | "reconnecting";
        readyState: boolean;
    }>, "many">>;
    error: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    version: number;
    type: "join_room_response";
    timestamp: number;
    success: boolean;
    playerId?: string | undefined;
    roomCode?: string | undefined;
    slot?: 1 | 2 | 3 | 4 | undefined;
    gameProfile?: string | undefined;
    players?: {
        id: string;
        name: string;
        slot: 1 | 2 | 3 | 4;
        connectionState: "disconnected" | "connecting" | "connected" | "reconnecting";
        readyState: boolean;
    }[] | undefined;
    error?: string | undefined;
}, {
    type: "join_room_response";
    success: boolean;
    version?: number | undefined;
    timestamp?: number | undefined;
    playerId?: string | undefined;
    roomCode?: string | undefined;
    slot?: 1 | 2 | 3 | 4 | undefined;
    gameProfile?: string | undefined;
    players?: {
        id: string;
        name: string;
        slot: 1 | 2 | 3 | 4;
        connectionState: "disconnected" | "connecting" | "connected" | "reconnecting";
        readyState: boolean;
    }[] | undefined;
    error?: string | undefined;
}>;
export type JoinRoomResponse = z.infer<typeof JoinRoomResponseSchema>;
export declare const LeaveRoomMessageSchema: z.ZodObject<{
    version: z.ZodDefault<z.ZodNumber>;
    timestamp: z.ZodDefault<z.ZodNumber>;
} & {
    type: z.ZodLiteral<"leave_room">;
    playerId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    version: number;
    type: "leave_room";
    timestamp: number;
    playerId: string;
}, {
    type: "leave_room";
    playerId: string;
    version?: number | undefined;
    timestamp?: number | undefined;
}>;
export type LeaveRoomMessage = z.infer<typeof LeaveRoomMessageSchema>;
export declare const SetReadyMessageSchema: z.ZodObject<{
    version: z.ZodDefault<z.ZodNumber>;
    timestamp: z.ZodDefault<z.ZodNumber>;
} & {
    type: z.ZodLiteral<"set_ready">;
    playerId: z.ZodString;
    ready: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    version: number;
    type: "set_ready";
    timestamp: number;
    playerId: string;
    ready: boolean;
}, {
    type: "set_ready";
    playerId: string;
    ready: boolean;
    version?: number | undefined;
    timestamp?: number | undefined;
}>;
export type SetReadyMessage = z.infer<typeof SetReadyMessageSchema>;
export declare const SelectProfileMessageSchema: z.ZodObject<{
    version: z.ZodDefault<z.ZodNumber>;
    timestamp: z.ZodDefault<z.ZodNumber>;
} & {
    type: z.ZodLiteral<"select_profile">;
    profileId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    version: number;
    type: "select_profile";
    timestamp: number;
    profileId: string;
}, {
    type: "select_profile";
    profileId: string;
    version?: number | undefined;
    timestamp?: number | undefined;
}>;
export type SelectProfileMessage = z.infer<typeof SelectProfileMessageSchema>;
export declare const RoomStateMessageSchema: z.ZodObject<{
    version: z.ZodDefault<z.ZodNumber>;
    timestamp: z.ZodDefault<z.ZodNumber>;
} & {
    type: z.ZodLiteral<"room_state">;
    roomCode: z.ZodString;
    state: z.ZodEnum<["waiting", "in_game", "paused", "closed"]>;
    gameProfile: z.ZodString;
    players: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        slot: z.ZodUnion<[z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<4>]>;
        connectionState: z.ZodEnum<["disconnected", "connecting", "connected", "reconnecting"]>;
        readyState: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        slot: 1 | 2 | 3 | 4;
        connectionState: "disconnected" | "connecting" | "connected" | "reconnecting";
        readyState: boolean;
    }, {
        id: string;
        name: string;
        slot: 1 | 2 | 3 | 4;
        connectionState: "disconnected" | "connecting" | "connected" | "reconnecting";
        readyState: boolean;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    version: number;
    type: "room_state";
    timestamp: number;
    roomCode: string;
    gameProfile: string;
    players: {
        id: string;
        name: string;
        slot: 1 | 2 | 3 | 4;
        connectionState: "disconnected" | "connecting" | "connected" | "reconnecting";
        readyState: boolean;
    }[];
    state: "waiting" | "in_game" | "paused" | "closed";
}, {
    type: "room_state";
    roomCode: string;
    gameProfile: string;
    players: {
        id: string;
        name: string;
        slot: 1 | 2 | 3 | 4;
        connectionState: "disconnected" | "connecting" | "connected" | "reconnecting";
        readyState: boolean;
    }[];
    state: "waiting" | "in_game" | "paused" | "closed";
    version?: number | undefined;
    timestamp?: number | undefined;
}>;
export type RoomStateMessage = z.infer<typeof RoomStateMessageSchema>;
export declare const PingMessageSchema: z.ZodObject<{
    version: z.ZodDefault<z.ZodNumber>;
    timestamp: z.ZodDefault<z.ZodNumber>;
} & {
    type: z.ZodLiteral<"ping">;
    playerId: z.ZodOptional<z.ZodString>;
    clientTime: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    version: number;
    type: "ping";
    timestamp: number;
    playerId?: string | undefined;
    clientTime?: number | undefined;
}, {
    type: "ping";
    version?: number | undefined;
    timestamp?: number | undefined;
    playerId?: string | undefined;
    clientTime?: number | undefined;
}>;
export declare const PongMessageSchema: z.ZodObject<{
    version: z.ZodDefault<z.ZodNumber>;
    timestamp: z.ZodDefault<z.ZodNumber>;
} & {
    type: z.ZodLiteral<"pong">;
    clientTime: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    version: number;
    type: "pong";
    timestamp: number;
    clientTime?: number | undefined;
}, {
    type: "pong";
    version?: number | undefined;
    timestamp?: number | undefined;
    clientTime?: number | undefined;
}>;
export type PingMessage = z.infer<typeof PingMessageSchema>;
export type PongMessage = z.infer<typeof PongMessageSchema>;
export declare const ErrorMessageSchema: z.ZodObject<{
    version: z.ZodDefault<z.ZodNumber>;
    timestamp: z.ZodDefault<z.ZodNumber>;
} & {
    type: z.ZodLiteral<"error">;
    code: z.ZodString;
    message: z.ZodString;
    details: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    version: number;
    type: "error";
    timestamp: number;
    code: string;
    message: string;
    details?: any;
}, {
    type: "error";
    code: string;
    message: string;
    version?: number | undefined;
    timestamp?: number | undefined;
    details?: any;
}>;
export type ErrorMessage = z.infer<typeof ErrorMessageSchema>;
export declare const ClientMessageSchema: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    version: z.ZodDefault<z.ZodNumber>;
    timestamp: z.ZodDefault<z.ZodNumber>;
} & {
    type: z.ZodLiteral<"controller_input">;
    playerId: z.ZodString;
    payload: z.ZodObject<{
        steering: z.ZodNumber;
        accelerate: z.ZodDefault<z.ZodNumber>;
        brake: z.ZodDefault<z.ZodNumber>;
        handbrake: z.ZodDefault<z.ZodBoolean>;
        boost: z.ZodDefault<z.ZodBoolean>;
        powerUp: z.ZodDefault<z.ZodBoolean>;
        pause: z.ZodDefault<z.ZodBoolean>;
        buttons: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
        seq: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        steering: number;
        accelerate: number;
        brake: number;
        handbrake: boolean;
        boost: boolean;
        powerUp: boolean;
        pause: boolean;
        buttons: Record<string, boolean>;
        seq?: number | undefined;
    }, {
        steering: number;
        accelerate?: number | undefined;
        brake?: number | undefined;
        handbrake?: boolean | undefined;
        boost?: boolean | undefined;
        powerUp?: boolean | undefined;
        pause?: boolean | undefined;
        buttons?: Record<string, boolean> | undefined;
        seq?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    version: number;
    type: "controller_input";
    timestamp: number;
    playerId: string;
    payload: {
        steering: number;
        accelerate: number;
        brake: number;
        handbrake: boolean;
        boost: boolean;
        powerUp: boolean;
        pause: boolean;
        buttons: Record<string, boolean>;
        seq?: number | undefined;
    };
}, {
    type: "controller_input";
    playerId: string;
    payload: {
        steering: number;
        accelerate?: number | undefined;
        brake?: number | undefined;
        handbrake?: boolean | undefined;
        boost?: boolean | undefined;
        powerUp?: boolean | undefined;
        pause?: boolean | undefined;
        buttons?: Record<string, boolean> | undefined;
        seq?: number | undefined;
    };
    version?: number | undefined;
    timestamp?: number | undefined;
}>, z.ZodObject<{
    version: z.ZodDefault<z.ZodNumber>;
    timestamp: z.ZodDefault<z.ZodNumber>;
} & {
    type: z.ZodLiteral<"join_room">;
    roomCode: z.ZodString;
    playerName: z.ZodString;
    preferredSlot: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<4>]>>;
}, "strip", z.ZodTypeAny, {
    version: number;
    type: "join_room";
    timestamp: number;
    roomCode: string;
    playerName: string;
    preferredSlot?: 1 | 2 | 3 | 4 | undefined;
}, {
    type: "join_room";
    roomCode: string;
    playerName: string;
    version?: number | undefined;
    timestamp?: number | undefined;
    preferredSlot?: 1 | 2 | 3 | 4 | undefined;
}>, z.ZodObject<{
    version: z.ZodDefault<z.ZodNumber>;
    timestamp: z.ZodDefault<z.ZodNumber>;
} & {
    type: z.ZodLiteral<"leave_room">;
    playerId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    version: number;
    type: "leave_room";
    timestamp: number;
    playerId: string;
}, {
    type: "leave_room";
    playerId: string;
    version?: number | undefined;
    timestamp?: number | undefined;
}>, z.ZodObject<{
    version: z.ZodDefault<z.ZodNumber>;
    timestamp: z.ZodDefault<z.ZodNumber>;
} & {
    type: z.ZodLiteral<"set_ready">;
    playerId: z.ZodString;
    ready: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    version: number;
    type: "set_ready";
    timestamp: number;
    playerId: string;
    ready: boolean;
}, {
    type: "set_ready";
    playerId: string;
    ready: boolean;
    version?: number | undefined;
    timestamp?: number | undefined;
}>, z.ZodObject<{
    version: z.ZodDefault<z.ZodNumber>;
    timestamp: z.ZodDefault<z.ZodNumber>;
} & {
    type: z.ZodLiteral<"select_profile">;
    profileId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    version: number;
    type: "select_profile";
    timestamp: number;
    profileId: string;
}, {
    type: "select_profile";
    profileId: string;
    version?: number | undefined;
    timestamp?: number | undefined;
}>, z.ZodObject<{
    version: z.ZodDefault<z.ZodNumber>;
    timestamp: z.ZodDefault<z.ZodNumber>;
} & {
    type: z.ZodLiteral<"ping">;
    playerId: z.ZodOptional<z.ZodString>;
    clientTime: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    version: number;
    type: "ping";
    timestamp: number;
    playerId?: string | undefined;
    clientTime?: number | undefined;
}, {
    type: "ping";
    version?: number | undefined;
    timestamp?: number | undefined;
    playerId?: string | undefined;
    clientTime?: number | undefined;
}>]>;
export type ClientMessage = z.infer<typeof ClientMessageSchema>;
export declare const ServerMessageSchema: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    version: z.ZodDefault<z.ZodNumber>;
    timestamp: z.ZodDefault<z.ZodNumber>;
} & {
    type: z.ZodLiteral<"join_room_response">;
    success: z.ZodBoolean;
    playerId: z.ZodOptional<z.ZodString>;
    slot: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<4>]>>;
    roomCode: z.ZodOptional<z.ZodString>;
    gameProfile: z.ZodOptional<z.ZodString>;
    players: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        slot: z.ZodUnion<[z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<4>]>;
        connectionState: z.ZodEnum<["disconnected", "connecting", "connected", "reconnecting"]>;
        readyState: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        slot: 1 | 2 | 3 | 4;
        connectionState: "disconnected" | "connecting" | "connected" | "reconnecting";
        readyState: boolean;
    }, {
        id: string;
        name: string;
        slot: 1 | 2 | 3 | 4;
        connectionState: "disconnected" | "connecting" | "connected" | "reconnecting";
        readyState: boolean;
    }>, "many">>;
    error: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    version: number;
    type: "join_room_response";
    timestamp: number;
    success: boolean;
    playerId?: string | undefined;
    roomCode?: string | undefined;
    slot?: 1 | 2 | 3 | 4 | undefined;
    gameProfile?: string | undefined;
    players?: {
        id: string;
        name: string;
        slot: 1 | 2 | 3 | 4;
        connectionState: "disconnected" | "connecting" | "connected" | "reconnecting";
        readyState: boolean;
    }[] | undefined;
    error?: string | undefined;
}, {
    type: "join_room_response";
    success: boolean;
    version?: number | undefined;
    timestamp?: number | undefined;
    playerId?: string | undefined;
    roomCode?: string | undefined;
    slot?: 1 | 2 | 3 | 4 | undefined;
    gameProfile?: string | undefined;
    players?: {
        id: string;
        name: string;
        slot: 1 | 2 | 3 | 4;
        connectionState: "disconnected" | "connecting" | "connected" | "reconnecting";
        readyState: boolean;
    }[] | undefined;
    error?: string | undefined;
}>, z.ZodObject<{
    version: z.ZodDefault<z.ZodNumber>;
    timestamp: z.ZodDefault<z.ZodNumber>;
} & {
    type: z.ZodLiteral<"room_state">;
    roomCode: z.ZodString;
    state: z.ZodEnum<["waiting", "in_game", "paused", "closed"]>;
    gameProfile: z.ZodString;
    players: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        slot: z.ZodUnion<[z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<4>]>;
        connectionState: z.ZodEnum<["disconnected", "connecting", "connected", "reconnecting"]>;
        readyState: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        slot: 1 | 2 | 3 | 4;
        connectionState: "disconnected" | "connecting" | "connected" | "reconnecting";
        readyState: boolean;
    }, {
        id: string;
        name: string;
        slot: 1 | 2 | 3 | 4;
        connectionState: "disconnected" | "connecting" | "connected" | "reconnecting";
        readyState: boolean;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    version: number;
    type: "room_state";
    timestamp: number;
    roomCode: string;
    gameProfile: string;
    players: {
        id: string;
        name: string;
        slot: 1 | 2 | 3 | 4;
        connectionState: "disconnected" | "connecting" | "connected" | "reconnecting";
        readyState: boolean;
    }[];
    state: "waiting" | "in_game" | "paused" | "closed";
}, {
    type: "room_state";
    roomCode: string;
    gameProfile: string;
    players: {
        id: string;
        name: string;
        slot: 1 | 2 | 3 | 4;
        connectionState: "disconnected" | "connecting" | "connected" | "reconnecting";
        readyState: boolean;
    }[];
    state: "waiting" | "in_game" | "paused" | "closed";
    version?: number | undefined;
    timestamp?: number | undefined;
}>, z.ZodObject<{
    version: z.ZodDefault<z.ZodNumber>;
    timestamp: z.ZodDefault<z.ZodNumber>;
} & {
    type: z.ZodLiteral<"pong">;
    clientTime: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    version: number;
    type: "pong";
    timestamp: number;
    clientTime?: number | undefined;
}, {
    type: "pong";
    version?: number | undefined;
    timestamp?: number | undefined;
    clientTime?: number | undefined;
}>, z.ZodObject<{
    version: z.ZodDefault<z.ZodNumber>;
    timestamp: z.ZodDefault<z.ZodNumber>;
} & {
    type: z.ZodLiteral<"error">;
    code: z.ZodString;
    message: z.ZodString;
    details: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    version: number;
    type: "error";
    timestamp: number;
    code: string;
    message: string;
    details?: any;
}, {
    type: "error";
    code: string;
    message: string;
    version?: number | undefined;
    timestamp?: number | undefined;
    details?: any;
}>]>;
export type ServerMessage = z.infer<typeof ServerMessageSchema>;
export declare function parseClientMessage(raw: string | unknown): {
    success: true;
    data: ClientMessage;
} | {
    success: false;
    error: string;
};
export declare function parseServerMessage(raw: string | unknown): {
    success: true;
    data: ServerMessage;
} | {
    success: false;
    error: string;
};
//# sourceMappingURL=index.d.ts.map