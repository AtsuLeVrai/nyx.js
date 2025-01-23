import {
  type AnyThreadChannelEntity,
  ChannelEntity,
  DefaultMessageNotificationLevel,
  ExplicitContentFilterLevel,
  GuildFeature,
  GuildMemberFlags,
  GuildOnboardingMode,
  GuildOnboardingPromptEntity,
  RoleEntity,
  Snowflake,
  SystemChannelFlags,
  type ThreadMemberEntity,
  VerificationLevel,
  WelcomeScreenChannelEntity,
} from "@nyxjs/core";
import { z } from "zod";
import { FileHandler } from "../handlers/index.js";
import type { FileInput } from "../types/index.js";

/**
 * @see {@link https://discord.com/developers/docs/resources/guild#create-guild-json-params}
 */
export const CreateGuildSchema = z.object({
  name: z.string().min(2).max(100),
  region: z.string().nullish(),
  icon: z
    .custom<FileInput>(FileHandler.isValidSingleInput)
    .transform(FileHandler.toDataUri)
    .optional(),
  verification_level: z.nativeEnum(VerificationLevel).optional(),
  default_message_notifications: z
    .nativeEnum(DefaultMessageNotificationLevel)
    .optional(),
  explicit_content_filter: z.nativeEnum(ExplicitContentFilterLevel).optional(),
  roles: z.array(RoleEntity).optional(),
  channels: z.array(ChannelEntity.partial()).optional(),
  afk_channel_id: Snowflake.optional(),
  afk_timeout: z.number().optional(),
  system_channel_id: Snowflake.optional(),
  system_channel_flags: z.nativeEnum(SystemChannelFlags).optional(),
});

export type CreateGuildSchema = z.input<typeof CreateGuildSchema>;

/**
 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-json-params}
 */
export const ModifyGuildSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  /** @deprecated */
  region: z.string().nullish(),
  verification_level: z.nativeEnum(VerificationLevel).nullish(),
  default_message_notifications: z
    .nativeEnum(DefaultMessageNotificationLevel)
    .nullish(),
  explicit_content_filter: z.nativeEnum(ExplicitContentFilterLevel).nullish(),
  afk_channel_id: Snowflake.nullish(),
  afk_timeout: z.number().optional(),
  icon: z
    .custom<FileInput>(FileHandler.isValidSingleInput)
    .transform(FileHandler.toDataUri)
    .nullish(),
  owner_id: Snowflake.optional(),
  splash: z
    .custom<FileInput>(FileHandler.isValidSingleInput)
    .transform(FileHandler.toDataUri)
    .nullish(),
  discovery_splash: z
    .custom<FileInput>(FileHandler.isValidSingleInput)
    .transform(FileHandler.toDataUri)
    .nullish(),
  banner: z
    .custom<FileInput>(FileHandler.isValidSingleInput)
    .transform(FileHandler.toDataUri)
    .nullish(),
  system_channel_id: Snowflake.nullish(),
  system_channel_flags: z.nativeEnum(SystemChannelFlags).optional(),
  rules_channel_id: Snowflake.nullish(),
  public_updates_channel_id: Snowflake.nullish(),
  preferred_locale: z.string().optional(),
  features: z.array(z.nativeEnum(GuildFeature)).optional(),
  description: z.string().nullish(),
  premium_progress_bar_enabled: z.boolean().optional(),
  safety_alerts_channel_id: Snowflake.nullish(),
});

export type ModifyGuildSchema = z.input<typeof ModifyGuildSchema>;

/**
 * @see {@link https://discord.com/developers/docs/resources/guild#create-guild-channel-json-params}
 */
export const CreateGuildChannelSchema = ChannelEntity;

export type CreateGuildChannelSchema = z.input<typeof CreateGuildChannelSchema>;

/**
 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-channel-positions}
 */
export const ModifyGuildChannelPositionsSchema = z.array(
  z.object({
    id: Snowflake,
    position: z.number().nullish(),
    lock_permissions: z.boolean().optional(),
    parent_id: Snowflake.nullish(),
  }),
);

export type ModifyGuildChannelPositionsSchema = z.input<
  typeof ModifyGuildChannelPositionsSchema
>;

/**
 * @see {@link https://discord.com/developers/docs/resources/guild#list-active-guild-threads-response-body}
 */
export interface ListActiveGuildThreadsEntity {
  threads: AnyThreadChannelEntity[];
  members: ThreadMemberEntity[];
}

/**
 * @see {@link https://discord.com/developers/docs/resources/guild#list-guild-members-query-string-params}
 */
export const ListGuildMembersQuerySchema = z.object({
  limit: z.number().min(1).max(1000).default(1),
  after: Snowflake.optional(),
});

export type ListGuildMembersQuerySchema = z.input<
  typeof ListGuildMembersQuerySchema
>;

/**
 * @see {@link https://discord.com/developers/docs/resources/guild#search-guild-members-query-string-params}
 */
export const SearchGuildMembersQuerySchema = z.object({
  query: z.string(),
  limit: z.number().min(1).max(1000).default(1),
});

export type SearchGuildMembersQuerySchema = z.input<
  typeof SearchGuildMembersQuerySchema
>;

/**
 * @see {@link https://discord.com/developers/docs/resources/guild#add-guild-member-json-params}
 */
export const AddGuildMemberSchema = z.object({
  access_token: z.string(),
  nick: z.string().optional(),
  roles: z.array(Snowflake).optional(),
  mute: z.boolean().optional(),
  deaf: z.boolean().optional(),
});

export type AddGuildMemberSchema = z.input<typeof AddGuildMemberSchema>;

/**
 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-member-json-params}
 */
export const ModifyGuildMemberSchema = z.object({
  nick: z.string().nullish(),
  roles: z.array(Snowflake).optional(),
  mute: z.boolean().optional(),
  deaf: z.boolean().optional(),
  channel_id: Snowflake.nullish(),
  communication_disabled_until: z.string().datetime().optional(),
  flags: z.nativeEnum(GuildMemberFlags).optional(),
});

export type ModifyGuildMemberSchema = z.input<typeof ModifyGuildMemberSchema>;

/**
 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-bans-query-string-params}
 */
export const GetGuildBansQuerySchema = z.object({
  limit: z.number().min(1).max(1000).default(1000),
  before: Snowflake.optional(),
  after: Snowflake.optional(),
});

export type GetGuildBansQuerySchema = z.input<typeof GetGuildBansQuerySchema>;

/**
 * @see {@link https://discord.com/developers/docs/resources/guild#create-guild-ban-json-params}
 */
export const CreateGuildBanSchema = z.object({
  /** @deprecated */
  delete_message_days: z.number().min(0).max(7).optional(),
  delete_message_seconds: z.number().min(0).max(604800).optional(),
});

export type CreateGuildBanSchema = z.input<typeof CreateGuildBanSchema>;

/**
 * @see {@link https://discord.com/developers/docs/resources/guild#bulk-guild-ban-json-params}
 */
export const BulkGuildBanSchema = z.object({
  user_ids: z.array(Snowflake).max(200),
  delete_message_seconds: z.number().min(0).max(604800).default(0),
});

export type BulkGuildBanSchema = z.input<typeof BulkGuildBanSchema>;

/**
 * @see {@link https://discord.com/developers/docs/resources/guild#bulk-guild-ban-bulk-ban-response}
 */
export interface BulkGuildBanResponseEntity {
  banned_users: Snowflake[];
  failed_users: Snowflake[];
}

/**
 * @see {@link https://discord.com/developers/docs/resources/guild#create-guild-role-json-params}
 */
export const CreateGuildRoleSchema = z.object({
  name: z.string().max(100).default("new role"),
  permissions: z.string(),
  color: z.number().int().default(0),
  hoist: z.boolean().default(false),
  icon: z
    .custom<FileInput>(FileHandler.isValidSingleInput)
    .transform(FileHandler.toDataUri)
    .nullable(),
  unicode_emoji: z.string().emoji().optional(),
  mentionable: z.boolean().default(false),
});

export type CreateGuildRoleSchema = z.input<typeof CreateGuildRoleSchema>;

/**
 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-role-positions-json-params}
 */
export const ModifyGuildRolePositionsSchema = z.array(
  z.object({
    id: Snowflake,
    position: z.number().int().nullish(),
  }),
);

export type ModifyGuildRolePositionsSchema = z.input<
  typeof ModifyGuildRolePositionsSchema
>;

/**
 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-role-json-params}
 */
export const ModifyGuildRoleSchema = CreateGuildRoleSchema.partial().nullable();

export type ModifyGuildRoleSchema = z.input<typeof ModifyGuildRoleSchema>;

/**
 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-prune-count-query-string-params}
 */
export const GetGuildPruneCountQuerySchema = z.object({
  days: z.number().min(1).max(30).default(7),
  include_roles: z.string().optional(),
});

export type GetGuildPruneCountQuerySchema = z.input<
  typeof GetGuildPruneCountQuerySchema
>;

/**
 * @see {@link https://discord.com/developers/docs/resources/guild#begin-guild-prune-json-params}
 */
export const BeginGuildPruneSchema = z.object({
  days: z.number().min(1).max(30).default(7),
  compute_prune_count: z.boolean().default(true),
  include_roles: z.array(Snowflake),
  /** @deprecated */
  reason: z.string().optional(),
});

export type BeginGuildPruneSchema = z.input<typeof BeginGuildPruneSchema>;

/**
 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-widget-image-widget-style-options}
 */
export type WidgetStyleOptions =
  | "shield"
  | "banner1"
  | "banner2"
  | "banner3"
  | "banner4";

/**
 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-widget-json-params}
 */
export const ModifyGuildWidgetSettingsSchema = z.object({
  enabled: z.boolean(),
  channel_id: Snowflake.nullable(),
});

export type ModifyGuildWidgetSettingsSchema = z.input<
  typeof ModifyGuildWidgetSettingsSchema
>;

/**
 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-welcome-screen-json-params}
 */
export const ModifyGuildWelcomeScreenSchema = z.object({
  enabled: z.boolean().nullish(),
  welcome_channels: z.array(WelcomeScreenChannelEntity).nullish(),
  description: z.string().nullish(),
});

export type ModifyGuildWelcomeScreenSchema = z.input<
  typeof ModifyGuildWelcomeScreenSchema
>;

/**
 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-onboarding}
 */
export const ModifyGuildOnboardingSchema = z.object({
  prompts: z.array(GuildOnboardingPromptEntity),
  default_channel_ids: z.array(Snowflake),
  enabled: z.boolean(),
  mode: z.nativeEnum(GuildOnboardingMode),
});

export type ModifyGuildOnboardingSchema = z.input<
  typeof ModifyGuildOnboardingSchema
>;
