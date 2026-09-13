"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerMessageSchema = exports.ClientMessageSchema = exports.ErrorMessageSchema = exports.PongMessageSchema = exports.PingMessageSchema = exports.RoomStateMessageSchema = exports.SelectProfileMessageSchema = exports.SetReadyMessageSchema = exports.LeaveRoomMessageSchema = exports.JoinRoomResponseSchema = exports.PlayerDtoSchema = exports.JoinRoomMessageSchema = exports.ControllerInputMessageSchema = exports.ControllerInputPayloadSchema = exports.BaseMessageSchema = exports.PROTOCOL_VERSION = void 0;
exports.parseClientMessage = parseClientMessage;
exports.parseServerMessage = parseServerMessage;
const zod_1 = require("zod");
exports.PROTOCOL_VERSION = 1;
// Base message schema containing versioning
exports.BaseMessageSchema = zod_1.z.object({
    version: zod_1.z.number().default(exports.PROTOCOL_VERSION),
    type: zod_1.z.string(),
    timestamp: zod_1.z.number().default(() => Date.now())
});
// Controller Input Message
exports.ControllerInputPayloadSchema = zod_1.z.object({
    steering: zod_1.z.number().min(-1.0).max(1.0),
    accelerate: zod_1.z.number().min(0.0).max(1.0).default(0),
    brake: zod_1.z.number().min(0.0).max(1.0).default(0),
    handbrake: zod_1.z.boolean().default(false),
    boost: zod_1.z.boolean().default(false),
    powerUp: zod_1.z.boolean().default(false),
    pause: zod_1.z.boolean().default(false),
    buttons: zod_1.z.record(zod_1.z.boolean()).default({}),
    seq: zod_1.z.number().optional()
});
exports.ControllerInputMessageSchema = exports.BaseMessageSchema.extend({
    type: zod_1.z.literal('controller_input'),
    playerId: zod_1.z.string().min(1),
    payload: exports.ControllerInputPayloadSchema
});
// Join Room Message
exports.JoinRoomMessageSchema = exports.BaseMessageSchema.extend({
    type: zod_1.z.literal('join_room'),
    roomCode: zod_1.z.string().min(1),
    playerName: zod_1.z.string().min(1).max(32),
    preferredSlot: zod_1.z.union([zod_1.z.literal(1), zod_1.z.literal(2), zod_1.z.literal(3), zod_1.z.literal(4)]).optional()
});
// Join Room Response
exports.PlayerDtoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    slot: zod_1.z.union([zod_1.z.literal(1), zod_1.z.literal(2), zod_1.z.literal(3), zod_1.z.literal(4)]),
    connectionState: zod_1.z.enum(['disconnected', 'connecting', 'connected', 'reconnecting']),
    readyState: zod_1.z.boolean()
});
exports.JoinRoomResponseSchema = exports.BaseMessageSchema.extend({
    type: zod_1.z.literal('join_room_response'),
    success: zod_1.z.boolean(),
    playerId: zod_1.z.string().optional(),
    slot: zod_1.z.union([zod_1.z.literal(1), zod_1.z.literal(2), zod_1.z.literal(3), zod_1.z.literal(4)]).optional(),
    roomCode: zod_1.z.string().optional(),
    gameProfile: zod_1.z.string().optional(),
    players: zod_1.z.array(exports.PlayerDtoSchema).optional(),
    error: zod_1.z.string().optional()
});
// Leave Room Message
exports.LeaveRoomMessageSchema = exports.BaseMessageSchema.extend({
    type: zod_1.z.literal('leave_room'),
    playerId: zod_1.z.string().min(1)
});
// Ready State Message
exports.SetReadyMessageSchema = exports.BaseMessageSchema.extend({
    type: zod_1.z.literal('set_ready'),
    playerId: zod_1.z.string().min(1),
    ready: zod_1.z.boolean()
});
// Select Game Profile Message
exports.SelectProfileMessageSchema = exports.BaseMessageSchema.extend({
    type: zod_1.z.literal('select_profile'),
    profileId: zod_1.z.string().min(1)
});
// Room State Broadcast Message
exports.RoomStateMessageSchema = exports.BaseMessageSchema.extend({
    type: zod_1.z.literal('room_state'),
    roomCode: zod_1.z.string(),
    state: zod_1.z.enum(['waiting', 'in_game', 'paused', 'closed']),
    gameProfile: zod_1.z.string(),
    players: zod_1.z.array(exports.PlayerDtoSchema)
});
// Heartbeat Messages
exports.PingMessageSchema = exports.BaseMessageSchema.extend({
    type: zod_1.z.literal('ping'),
    playerId: zod_1.z.string().optional(),
    clientTime: zod_1.z.number().optional()
});
exports.PongMessageSchema = exports.BaseMessageSchema.extend({
    type: zod_1.z.literal('pong'),
    clientTime: zod_1.z.number().optional()
});
// Error Message
exports.ErrorMessageSchema = exports.BaseMessageSchema.extend({
    type: zod_1.z.literal('error'),
    code: zod_1.z.string(),
    message: zod_1.z.string(),
    details: zod_1.z.any().optional()
});
// Union of all Client-to-Server Messages
exports.ClientMessageSchema = zod_1.z.discriminatedUnion('type', [
    exports.ControllerInputMessageSchema,
    exports.JoinRoomMessageSchema,
    exports.LeaveRoomMessageSchema,
    exports.SetReadyMessageSchema,
    exports.SelectProfileMessageSchema,
    exports.PingMessageSchema
]);
// Union of all Server-to-Client Messages
exports.ServerMessageSchema = zod_1.z.discriminatedUnion('type', [
    exports.JoinRoomResponseSchema,
    exports.RoomStateMessageSchema,
    exports.PongMessageSchema,
    exports.ErrorMessageSchema
]);
// Safe Protocol Parser Utility
function parseClientMessage(raw) {
    try {
        const json = typeof raw === 'string' ? JSON.parse(raw) : raw;
        const result = exports.ClientMessageSchema.safeParse(json);
        if (result.success) {
            return { success: true, data: result.data };
        }
        return { success: false, error: result.error.message };
    }
    catch (err) {
        return { success: false, error: err.message || 'Invalid JSON' };
    }
}
function parseServerMessage(raw) {
    try {
        const json = typeof raw === 'string' ? JSON.parse(raw) : raw;
        const result = exports.ServerMessageSchema.safeParse(json);
        if (result.success) {
            return { success: true, data: result.data };
        }
        return { success: false, error: result.error.message };
    }
    catch (err) {
        return { success: false, error: err.message || 'Invalid JSON' };
    }
}
//# sourceMappingURL=index.js.map