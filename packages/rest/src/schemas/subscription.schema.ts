import { Snowflake } from "@nyxjs/core";
import { z } from "zod";

/**
 * @see {@link https://discord.com/developers/docs/resources/subscription#query-string-params}
 */
export const SubscriptionQuerySchema = z.object({
  before: Snowflake.optional(),
  after: Snowflake.optional(),
  limit: z.number().int().min(1).max(100).default(50),
  user_id: Snowflake.optional(),
});

export type SubscriptionQuerySchema = z.input<typeof SubscriptionQuerySchema>;
