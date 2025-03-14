import { AuditLogEvent, Snowflake } from "@nyxjs/core";
import { z } from "zod";

/**
 * @see {@link https://discord.com/developers/docs/resources/audit-log#get-guild-audit-log-query-string-params}
 */
export const GetGuildAuditLogQuerySchema = z.object({
  user_id: Snowflake.optional(),
  action_type: z.nativeEnum(AuditLogEvent).optional(),
  before: Snowflake.optional(),
  after: Snowflake.optional(),
  limit: z.number().int().min(1).max(100).default(50),
});

export type GetGuildAuditLogQuerySchema = z.input<
  typeof GetGuildAuditLogQuerySchema
>;
