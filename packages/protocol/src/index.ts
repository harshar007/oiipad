import { z } from 'zod';

export const PROTOCOL_VERSION = 1;

// Base message schema containing versioning
export const BaseMessageSchema = z.object({
  version: z.number().default(PROTOCOL_VERSION),
  type: z.string(),
  timestamp: z.number().default(() => Date.now())
});

// Controller Input Message
export const ControllerInputPayloadSchema = z.object({
  steering: z.number().min(-1.0).max(1.0),
  accelerate: z.number().min(0.0).max(1.0).default(0),
  brake: z.number().min(0.0).max(1.0).default(0),
  handbrake: z.boolean().default(false),
  boost: z.boolean().default(false),
  powerUp: z.boolean().default(false),
  pause: z.boolean().default(false),
  buttons: z.record(z.boolean()).default({}),
  seq: z.number().optional()
});

export const ControllerInputMessageSchema = BaseMessageSchema.extend({
  type: z.literal('controller_input'),
  playerId: z.string().min(1),
  payload: ControllerInputPayloadSchema
});

export type ControllerInputPayload = z.infer<typeof ControllerInputPayloadSchema>;
export type ControllerInputMessage = z.infer<typeof ControllerInputMessageSchema>;

// Join Room Message
export const JoinRoomMessageSchema = BaseMessageSchema.extend({
  type: z.literal('join_room'),
  roomCode: z.string().min(1),
  playerName: z.string().min(1).max(32),
  preferredSlot: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional()
});

export type JoinRoomMessage = z.infer<typeof JoinRoomMessageSchema>;

// Join Room Response
export const PlayerDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  slot: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  connectionState: z.enum(['disconnected', 'connecting', 'connected', 'reconnecting']),
  readyState: z.boolean()
});

export type PlayerDto = z.infer<typeof PlayerDtoSchema>;

export const JoinRoomResponseSchema = BaseMessageSchema.extend({
  type: z.literal('join_room_response'),
  success: z.boolean(),
  playerId: z.string().optional(),
  slot: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(),
  roomCode: z.string().optional(),
  gameProfile: z.string().optional(),
  players: z.array(PlayerDtoSchema).optional(),
  error: z.string().optional()
});

export type JoinRoomResponse = z.infer<typeof JoinRoomResponseSchema>;

// Leave Room Message
export const LeaveRoomMessageSchema = BaseMessageSchema.extend({
  type: z.literal('leave_room'),
  playerId: z.string().min(1)
});

export type LeaveRoomMessage = z.infer<typeof LeaveRoomMessageSchema>;

// Ready State Message
export const SetReadyMessageSchema = BaseMessageSchema.extend({
  type: z.literal('set_ready'),
  playerId: z.string().min(1),
  ready: z.boolean()
});

export type SetReadyMessage = z.infer<typeof SetReadyMessageSchema>;

// Select Game Profile Message
export const SelectProfileMessageSchema = BaseMessageSchema.extend({
  type: z.literal('select_profile'),
  profileId: z.string().min(1)
});

export type SelectProfileMessage = z.infer<typeof SelectProfileMessageSchema>;

// Room State Broadcast Message
export const RoomStateMessageSchema = BaseMessageSchema.extend({
  type: z.literal('room_state'),
  roomCode: z.string(),
  state: z.enum(['waiting', 'in_game', 'paused', 'closed']),
  gameProfile: z.string(),
  players: z.array(PlayerDtoSchema)
});

export type RoomStateMessage = z.infer<typeof RoomStateMessageSchema>;

// Heartbeat Messages
export const PingMessageSchema = BaseMessageSchema.extend({
  type: z.literal('ping'),
  playerId: z.string().optional()
});

export const PongMessageSchema = BaseMessageSchema.extend({
  type: z.literal('pong')
});

export type PingMessage = z.infer<typeof PingMessageSchema>;
export type PongMessage = z.infer<typeof PongMessageSchema>;

// Error Message
export const ErrorMessageSchema = BaseMessageSchema.extend({
  type: z.literal('error'),
  code: z.string(),
  message: z.string(),
  details: z.any().optional()
});

export type ErrorMessage = z.infer<typeof ErrorMessageSchema>;

// Union of all Client-to-Server Messages
export const ClientMessageSchema = z.discriminatedUnion('type', [
  ControllerInputMessageSchema,
  JoinRoomMessageSchema,
  LeaveRoomMessageSchema,
  SetReadyMessageSchema,
  SelectProfileMessageSchema,
  PingMessageSchema
]);

export type ClientMessage = z.infer<typeof ClientMessageSchema>;

// Union of all Server-to-Client Messages
export const ServerMessageSchema = z.discriminatedUnion('type', [
  JoinRoomResponseSchema,
  RoomStateMessageSchema,
  PongMessageSchema,
  ErrorMessageSchema
]);

export type ServerMessage = z.infer<typeof ServerMessageSchema>;

// Safe Protocol Parser Utility
export function parseClientMessage(raw: string | unknown): { success: true; data: ClientMessage } | { success: false; error: string } {
  try {
    const json = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const result = ClientMessageSchema.safeParse(json);
    if (result.success) {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.error.message };
  } catch (err: any) {
    return { success: false, error: err.message || 'Invalid JSON' };
  }
}

export function parseServerMessage(raw: string | unknown): { success: true; data: ServerMessage } | { success: false; error: string } {
  try {
    const json = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const result = ServerMessageSchema.safeParse(json);
    if (result.success) {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.error.message };
  } catch (err: any) {
    return { success: false, error: err.message || 'Invalid JSON' };
  }
}
