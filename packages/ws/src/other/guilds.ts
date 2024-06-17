import { Integer, Snowflake } from "@lunajs/core";
import { z } from "zod";

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#request-guild-members-request-guild-members-structure}
 */
export const GatewayRequestGuildMembersStructure = z.object({
	/**
	 * ID of the guild to get members for
	 */
	guild_id: Snowflake,
	/**
	 * string that username starts with, or an empty string to return all members
	 */
	query: z.string().optional(),
	/**
	 * maximum number of members to send matching the query; a limit of 0 can be used with an empty string query to return all members
	 */
	limit: Integer,
	/**
	 * used to specify if we want the presences of the matched members
	 */
	presences: z.boolean().optional(),
	/**
	 * used to specify which users you wish to fetch
	 */
	user_ids: z.union([Snowflake, z.array(Snowflake)]).optional(),
	/**
	 * nonce to identify the Guild Members Chunk response
	 */
	nonce: z.string().optional(),
});

export type GatewayRequestGuildMembersStructureInfer = z.infer<typeof GatewayRequestGuildMembersStructure>;