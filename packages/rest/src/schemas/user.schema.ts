import { Snowflake } from "@nyxjs/core";
import { z } from "zod";
import { type FileInput, fileHandler } from "../handlers/index.js";

/**
 * @see {@link https://discord.com/developers/docs/resources/user#modify-current-user-json-params}
 */
export const ModifyCurrentUserSchema = z.object({
  username: z.string().optional(),
  avatar: z
    .custom<FileInput>(fileHandler.isValidSingleInput)
    .transform(fileHandler.toDataUri)
    .nullish(),
  banner: z
    .custom<FileInput>(fileHandler.isValidSingleInput)
    .transform(fileHandler.toDataUri)
    .nullish(),
});

export type ModifyCurrentUserSchema = z.input<typeof ModifyCurrentUserSchema>;

/**
 * @see {@link https://discord.com/developers/docs/resources/user#get-current-user-guilds-query-string-params}
 */
export const GetCurrentUserGuildsQuerySchema = z.object({
  before: Snowflake.optional(),
  after: Snowflake.optional(),
  limit: z.number().int().default(200),
  with_counts: z.boolean().default(false),
});

export type GetCurrentUserGuildsQuerySchema = z.input<
  typeof GetCurrentUserGuildsQuerySchema
>;

/**
 * @see {@link https://discord.com/developers/docs/resources/user#create-group-dm-json-params}
 */
export const CreateGroupDmSchema = z.object({
  access_tokens: z.array(z.string()).min(2).max(10),
  nicks: z.record(Snowflake, z.string()),
});

export type CreateGroupDmSchema = z.input<typeof CreateGroupDmSchema>;

/**
 * @see {@link https://discord.com/developers/docs/resources/user#update-current-user-application-role-connection-json-params}
 */
export const UpdateCurrentUserApplicationRoleConnectionSchema = z.object({
  platform_name: z.string().max(50).optional(),
  platform_username: z.string().max(100).optional(),
  metadata: z.record(z.string().max(100), z.string().max(100)).optional(),
});

export type UpdateCurrentUserApplicationRoleConnectionSchema = z.input<
  typeof UpdateCurrentUserApplicationRoleConnectionSchema
>;
