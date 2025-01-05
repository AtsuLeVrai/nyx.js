import { ApiVersion } from "@nyxjs/core";
import WebSocket from "ws";
import { z } from "zod";
import { GatewayIntentsBits, GatewayOpcodes } from "../constants/index.js";
import { UpdatePresenceSchema } from "../events/index.js";
import { CompressionOptionsSchema } from "./compression.schema.js";
import { EncodingOptionsSchema } from "./encoding.schema.js";
import { HeartbeatOptionsSchema } from "./heartbeat.schema.js";
import { ShardOptionsSchema } from "./shard.schema.js";

/**
 * @see {@link https://discord.com/developers/docs/events/gateway-events#payload-structure}
 */
export const PayloadSchema = z
  .object({
    op: z.nativeEnum(GatewayOpcodes),
    d: z.union([z.object({}), z.number(), z.null()]),
    s: z.number().nullable(),
    t: z.string().nullable(),
  })
  .strict();

export type PayloadEntity = z.infer<typeof PayloadSchema>;

export const GatewayStatsSchema = z
  .object({
    ping: z.number().nonnegative(),
    lastHeartbeat: z.number().nullable(),
    sessionId: z.string().nullable(),
    sequence: z.number().nonnegative(),
    reconnectAttempts: z.number().nonnegative(),
    uptime: z.number().nonnegative(),
    readyState: z.union([
      z.literal(WebSocket.CONNECTING),
      z.literal(WebSocket.OPEN),
      z.literal(WebSocket.CLOSING),
      z.literal(WebSocket.CLOSED),
    ]),
    receivedPayloads: z.number().nonnegative(),
    sentPayloads: z.number().nonnegative(),
    missedHeartbeats: z.number().nonnegative(),
  })
  .strict();

export type GatewayStats = z.infer<typeof GatewayStatsSchema>;

export const GatewayOptionsSchema = z
  .object({
    token: z.string().min(1),
    intents: z.union([
      z.array(z.nativeEnum(GatewayIntentsBits)),
      z.number().positive(),
    ]),
    version: z.literal(10).default(ApiVersion.v10),
    presence: UpdatePresenceSchema.optional(),
    encoding: EncodingOptionsSchema.optional(),
    compression: CompressionOptionsSchema.optional(),
    heartbeat: HeartbeatOptionsSchema.optional(),
    shard: ShardOptionsSchema.optional(),
    largeThreshold: z.number().int().min(50).max(250).default(50),
    monitorStats: z.boolean().default(true),
    validatePayloads: z.boolean().default(true),
    maxReconnectAttempts: z.number().int().positive().default(5),
    reconnectDelay: z.number().int().positive().default(5000),
    autoReconnect: z.boolean().default(true),
  })
  .strict()
  .refine(
    (data) => {
      if (Array.isArray(data.intents)) {
        return data.intents.every((intent) =>
          Object.values(GatewayIntentsBits).includes(intent),
        );
      }
      return true;
    },
    {
      message: "Invalid intents provided",
      path: ["intents"],
    },
  );

export type GatewayOptions = z.infer<typeof GatewayOptionsSchema>;
