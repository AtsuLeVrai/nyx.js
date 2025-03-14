import {
  BitFieldManager,
  BitwisePermissionFlags,
  type ChannelEntity,
  type ChannelFlags,
  ChannelType,
  ForumLayoutType,
  InviteTargetType,
  OverwriteType,
  Snowflake,
  SortOrderType,
  type ThreadMemberEntity,
  VideoQualityMode,
} from "@nyxjs/core";
import { z } from "zod";
import { CreateMessageSchema } from "./message.schema.js";
import { CreateGroupDmSchema } from "./user.schema.js";

export const OverwriteSchema = z.object({
  id: Snowflake,
  type: z.nativeEnum(OverwriteType),
  allow: z.string(),
  deny: z.string(),
});

export type OverwriteSchema = z.input<typeof OverwriteSchema>;

export const ForumTagSchema = z.object({
  id: Snowflake,
  name: z.string().max(20),
  moderated: z.boolean(),
  emoji_id: Snowflake.nullable(),

  emoji_name: z.string().nullable(),
});

export type ForumTagSchema = z.input<typeof ForumTagSchema>;

export const DefaultReactionSchema = z.object({
  emoji_id: Snowflake.nullable(),
  emoji_name: z.string().nullable(),
});

export type DefaultReactionSchema = z.input<typeof DefaultReactionSchema>;

/**
 * @see {@link https://discord.com/developers/docs/resources/channel#modify-channel-json-params-group-dm}
 */
export const ModifyChannelGroupDmSchema = z.object({
  name: z.string().min(1).max(100),
  icon: z.string(),
});

export type ModifyChannelGroupDmSchema = z.input<
  typeof ModifyChannelGroupDmSchema
>;

/** @see {@link https://discord.com/developers/docs/resources/channel#modify-channel-json-params-guild-channel} */
export const ModifyChannelGuildChannelSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  type: z
    .union([
      z.literal(ChannelType.GuildText),
      z.literal(ChannelType.AnnouncementThread),
      z.literal(ChannelType.GuildAnnouncement),
    ])
    .optional(),
  position: z.number().int().optional(),
  topic: z.string().min(0).max(1024).optional(),
  nsfw: z.boolean().optional(),
  rate_limit_per_user: z.number().int().min(0).max(21600).optional(),
  bitrate: z.number().int().min(8000).optional(),
  user_limit: z.number().int().min(0).max(99).optional(),
  permission_overwrites: z.array(OverwriteSchema.partial()).optional(),
  parent_id: Snowflake.optional(),
  rtc_region: z.string().optional(),
  video_quality_mode: z.nativeEnum(VideoQualityMode).optional(),
  default_auto_archive_duration: z
    .union([z.literal(60), z.literal(1440), z.literal(4320), z.literal(10080)])
    .optional(),
  flags: z.custom<ChannelFlags>(BitFieldManager.isValidBitField),
  available_tags: z.array(ForumTagSchema).optional(),
  default_reaction_emoji: DefaultReactionSchema.optional(),
  default_thread_rate_limit_per_user: z.number().int().optional(),
  default_sort_order: z.nativeEnum(SortOrderType).optional(),
  default_forum_layout: z.nativeEnum(ForumLayoutType).optional(),
});

export type ModifyChannelGuildChannelSchema = z.input<
  typeof ModifyChannelGuildChannelSchema
>;

/**
 * @see {@link https://discord.com/developers/docs/resources/channel#modify-channel-json-params-thread}
 */
export const ModifyChannelThreadSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  archived: z.boolean().optional(),
  auto_archive_duration: z
    .union([z.literal(60), z.literal(1440), z.literal(4320), z.literal(10080)])
    .optional(),
  locked: z.boolean().optional(),
  invitable: z.boolean().optional(),
  rate_limit_per_user: z.number().int().max(21600).optional(),
  flags: z.custom<ChannelFlags>(BitFieldManager.isValidBitField).optional(),
  applied_tags: z.array(Snowflake).optional(),
});

export type ModifyChannelThreadSchema = z.input<
  typeof ModifyChannelThreadSchema
>;

/**
 * @see {@link https://discord.com/developers/docs/resources/channel#edit-channel-permissions-json-params}
 */
export const EditChannelPermissionsSchema = z.object({
  allow: z.nativeEnum(BitwisePermissionFlags).nullish(),
  deny: z.nativeEnum(BitwisePermissionFlags).nullish(),
  type: z.nativeEnum(OverwriteType),
});

export type EditChannelPermissionsSchema = z.input<
  typeof EditChannelPermissionsSchema
>;

/**
 * @see {@link https://discord.com/developers/docs/resources/channel#create-channel-invite-json-params}
 */
export const CreateChannelInviteSchema = z.object({
  max_age: z.number().int().min(0).max(604800).default(86400),
  max_uses: z.number().int().min(0).max(100).default(0),
  temporary: z.boolean().default(false),
  unique: z.boolean().default(false),
  target_type: z.nativeEnum(InviteTargetType).optional(),
  target_user_id: Snowflake.optional(),
  target_application_id: Snowflake.optional(),
});

export type CreateChannelInviteSchema = z.input<
  typeof CreateChannelInviteSchema
>;

/**
 * @see {@link https://discord.com/developers/docs/resources/channel#group-dm-add-recipient-json-params}
 */
export const AddGroupDmRecipientSchema = CreateGroupDmSchema;

export type AddGroupDmRecipientSchema = z.input<
  typeof AddGroupDmRecipientSchema
>;

/**
 * @see {@link https://discord.com/developers/docs/resources/channel#start-thread-from-message-json-params}
 */
export const StartThreadFromMessageSchema = z.object({
  name: z.string().min(1).max(100),
  auto_archive_duration: z
    .union([z.literal(60), z.literal(1440), z.literal(4320), z.literal(10080)])
    .optional(),
  rate_limit_per_user: z.number().int().max(21600).nullish(),
});

export type StartThreadFromMessageSchema = z.input<
  typeof StartThreadFromMessageSchema
>;

/**
 * @see {@link https://discord.com/developers/docs/resources/channel#start-thread-without-message-json-params}
 */
export const StartThreadWithoutMessageSchema =
  StartThreadFromMessageSchema.extend({
    type: z
      .union([
        z.literal(ChannelType.AnnouncementThread),
        z.literal(ChannelType.PrivateThread),
        z.literal(ChannelType.PublicThread),
      ])
      .optional()
      .default(ChannelType.PrivateThread),
    invitable: z.boolean().optional(),
  });

export type StartThreadWithoutMessageSchema = z.input<
  typeof StartThreadWithoutMessageSchema
>;

/**
 * @see {@link https://discord.com/developers/docs/resources/channel#start-thread-in-forum-or-media-channel-jsonform-params}
 * @see {@link https://discord.com/developers/docs/resources/channel#start-thread-in-forum-or-media-channel-forum-and-media-thread-message-params-object}
 */
export const StartThreadInForumOrMediaChannelForumAndMediaThreadMessageSchema =
  CreateMessageSchema.pick({
    content: true,
    embeds: true,
    allowed_mentions: true,
    components: true,
    sticker_ids: true,
    attachments: true,
    flags: true,
  });

export type StartThreadInForumOrMediaChannelForumAndMediaThreadMessageSchema =
  z.input<
    typeof StartThreadInForumOrMediaChannelForumAndMediaThreadMessageSchema
  >;

export const StartThreadInForumOrMediaChannelSchema = CreateMessageSchema.pick({
  files: true,
  payload_json: true,
}).extend({
  name: z.string().min(1).max(100),
  auto_archive_duration: z
    .union([z.literal(60), z.literal(1440), z.literal(4320), z.literal(10080)])
    .optional(),
  rate_limit_per_user: z.number().int().max(21600).nullish(),
  message: StartThreadInForumOrMediaChannelForumAndMediaThreadMessageSchema,
  applied_tags: z.array(Snowflake).optional(),
});

export type StartThreadInForumOrMediaChannelSchema = z.input<
  typeof StartThreadInForumOrMediaChannelSchema
>;

/**
 * @see {@link https://discord.com/developers/docs/resources/channel#list-thread-members-query-string-params}
 */
export const ListThreadMembersQuerySchema = z.object({
  with_member: z.boolean().optional(),
  after: Snowflake.optional(),
  limit: z.number().int().min(1).max(100).default(100),
});

export type ListThreadMembersQuerySchema = z.input<
  typeof ListThreadMembersQuerySchema
>;

/**
 * @see {@link https://discord.com/developers/docs/resources/channel#list-public-archived-threads-query-string-params}
 */
export const ListPublicArchivedThreadsQuerySchema = z.object({
  before: z.string().datetime().optional(),
  limit: z.number().int().optional(),
});

export type ListPublicArchivedThreadsQuerySchema = z.input<
  typeof ListPublicArchivedThreadsQuerySchema
>;

/**
 * @see {@link https://discord.com/developers/docs/resources/channel#list-public-archived-threads-response-body}
 */
export interface ListPublicArchivedThreadsResponseEntity {
  threads: ChannelEntity[];
  members: ThreadMemberEntity[];
  has_more: boolean;
}
