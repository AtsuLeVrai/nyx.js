import type { Snowflake } from "../managers/index.js";
import type { ApplicationEntity } from "./application.entity.js";
import type { AnyThreadChannelEntity, ChannelType } from "./channel.entity.js";
import type { EmojiEntity } from "./emoji.entity.js";
import type {
  InteractionResolvedDataEntity,
  InteractionType,
} from "./interaction.entity.js";
import type { ActionRowEntity } from "./message-components.entity.js";
import type { PollEntity } from "./poll.entity.js";
import type { StickerEntity, StickerItemEntity } from "./sticker.entity.js";
import type { UserEntity } from "./user.entity.js";

/**
 * Defines the types of mentions that can be allowed in messages.
 * @see {@link https://github.com/discord/discord-api-docs/blob/main/docs/resources/message.md#allowed-mentions-object-allowed-mention-types}
 */
export enum AllowedMentionType {
  /** Controls role mentions */
  RoleMentions = "roles",

  /** Controls user mentions */
  UserMentions = "users",

  /** Controls @everyone and @here mentions */
  EveryoneMentions = "everyone",
}

/**
 * Defines the flags that can be applied to message attachments.
 * @see {@link https://github.com/discord/discord-api-docs/blob/main/docs/resources/message.md#attachment-object-attachment-flags}
 */
export enum AttachmentFlags {
  /** This attachment has been edited using the remix feature on mobile */
  IsRemix = 1 << 2,
}

/**
 * Defines the types of embeds that can be included in a message.
 * @see {@link https://github.com/discord/discord-api-docs/blob/main/docs/resources/message.md#embed-object-embed-types}
 */
export enum EmbedType {
  /** Generic rich embed (default) */
  Rich = "rich",

  /** Image embed */
  Image = "image",

  /** Video embed */
  Video = "video",

  /** Animated gif image embed rendered as a video embed */
  Gifv = "gifv",

  /** Article embed */
  Article = "article",

  /** Link embed */
  Link = "link",

  /** Poll result embed */
  PollResult = "poll_result",
}

/**
 * Defines the types of message references.
 * @see {@link https://github.com/discord/discord-api-docs/blob/main/docs/resources/message.md#message-reference-types}
 */
export enum MessageReferenceType {
  /** Standard reference used by replies */
  Default = 0,

  /** Reference used to point to a message at a point in time */
  Forward = 1,
}

/**
 * Defines the flags that can be applied to messages.
 * @see {@link https://github.com/discord/discord-api-docs/blob/main/docs/resources/message.md#message-object-message-flags}
 */
export enum MessageFlags {
  /** Message has been published to subscribed channels (via Channel Following) */
  Crossposted = 1 << 0,

  /** Message originated from a message in another channel (via Channel Following) */
  IsCrosspost = 1 << 1,

  /** Do not include any embeds when serializing this message */
  SuppressEmbeds = 1 << 2,

  /** Source message for this crosspost has been deleted (via Channel Following) */
  SourceMessageDeleted = 1 << 3,

  /** Message came from the urgent message system */
  Urgent = 1 << 4,

  /** Message has an associated thread, with the same id as the message */
  HasThread = 1 << 5,

  /** Message is only visible to the user who invoked the Interaction */
  Ephemeral = 1 << 6,

  /** Message is an Interaction Response and the bot is "thinking" */
  Loading = 1 << 7,

  /** Message failed to mention some roles and add their members to the thread */
  FailedToMentionSomeRolesInThread = 1 << 8,

  /** Message will not trigger push and desktop notifications */
  SuppressNotifications = 1 << 12,

  /** Message is a voice message */
  IsVoiceMessage = 1 << 13,

  /** Message has a snapshot (via Message Forwarding) */
  HasSnapshot = 1 << 14,
}

/**
 * Defines the types of activities that can be associated with a message.
 * @see {@link https://github.com/discord/discord-api-docs/blob/main/docs/resources/message.md#message-object-message-activity-types}
 */
export enum MessageActivityType {
  /** User joined */
  Join = 1,

  /** User is spectating */
  Spectate = 2,

  /** User is listening */
  Listen = 3,

  /** User requested to join */
  JoinRequest = 5,
}

/**
 * Defines the different types of messages that can be sent in Discord.
 * @see {@link https://github.com/discord/discord-api-docs/blob/main/docs/resources/message.md#message-object-message-types}
 */
export enum MessageType {
  /** Default message */
  Default = 0,

  /** Recipient added to group DM */
  RecipientAdd = 1,

  /** Recipient removed from group DM */
  RecipientRemove = 2,

  /** Call message */
  Call = 3,

  /** Channel name change */
  ChannelNameChange = 4,

  /** Channel icon change */
  ChannelIconChange = 5,

  /** Channel pinned message */
  ChannelPinnedMessage = 6,

  /** User joined guild */
  UserJoin = 7,

  /** Guild boost */
  GuildBoost = 8,

  /** Guild reached boost tier 1 */
  GuildBoostTier1 = 9,

  /** Guild reached boost tier 2 */
  GuildBoostTier2 = 10,

  /** Guild reached boost tier 3 */
  GuildBoostTier3 = 11,

  /** Channel follow add */
  ChannelFollowAdd = 12,

  /** Guild discovery disqualified */
  GuildDiscoveryDisqualified = 14,

  /** Guild discovery requalified */
  GuildDiscoveryRequalified = 15,

  /** Guild discovery grace period initial warning */
  GuildDiscoveryGracePeriodInitialWarning = 16,

  /** Guild discovery grace period final warning */
  GuildDiscoveryGracePeriodFinalWarning = 17,

  /** Thread created */
  ThreadCreated = 18,

  /** Reply to a message */
  Reply = 19,

  /** Application command */
  ChatInputCommand = 20,

  /** Thread starter message */
  ThreadStarterMessage = 21,

  /** Guild invite reminder */
  GuildInviteReminder = 22,

  /** Context menu command */
  ContextMenuCommand = 23,

  /** Auto-moderation action */
  AutoModerationAction = 24,

  /** Role subscription purchase */
  RoleSubscriptionPurchase = 25,

  /** Interaction premium upsell */
  InteractionPremiumUpsell = 26,

  /** Stage start */
  StageStart = 27,

  /** Stage end */
  StageEnd = 28,

  /** Stage speaker */
  StageSpeaker = 29,

  /** Stage topic */
  StageTopic = 31,

  /** Guild application premium subscription */
  GuildApplicationPremiumSubscription = 32,

  /** Guild incident alert mode enabled */
  GuildIncidentAlertModeEnabled = 36,

  /** Guild incident alert mode disabled */
  GuildIncidentAlertModeDisabled = 37,

  /** Guild incident report raid */
  GuildIncidentReportRaid = 38,

  /** Guild incident report false alarm */
  GuildIncidentReportFalseAlarm = 39,

  /** Purchase notification */
  PurchaseNotification = 44,

  /** Poll result */
  PollResult = 46,
}

/**
 * Represents data for role subscription purchase events.
 * @see {@link https://github.com/discord/discord-api-docs/blob/main/docs/resources/message.md#role-subscription-data-object-role-subscription-data-object-structure}
 */
export interface RoleSubscriptionDataEntity {
  /** ID of the SKU and listing that the user subscribed to */
  role_subscription_listing_id: Snowflake;

  /** Name of the tier that the user is subscribed to */
  tier_name: string;

  /** The cumulative number of months that the user has been subscribed for */
  total_months_subscribed: number;

  /** Whether this notification is for a renewal rather than a new purchase */
  is_renewal: boolean;
}

/**
 * Controls which mentions are allowed in a message.
 * @see {@link https://github.com/discord/discord-api-docs/blob/main/docs/resources/message.md#allowed-mentions-object-allowed-mentions-structure}
 */
export interface AllowedMentionsEntity {
  /** An array of allowed mention types to parse from the content */
  parse: AllowedMentionType[];

  /**
   * Array of role IDs to mention
   * @maxItems 100
   * @optional
   */
  roles?: Snowflake[];

  /**
   * Array of user IDs to mention
   * @maxItems 100
   * @optional
   */
  users?: Snowflake[];

  /** For replies, whether to mention the author of the message being replied to */
  replied_user?: boolean;
}

/**
 * Represents a channel mention in message content.
 * @see {@link https://github.com/discord/discord-api-docs/blob/main/docs/resources/message.md#channel-mention-object-channel-mention-structure}
 */
export interface ChannelMentionEntity {
  /** ID of the channel */
  id: Snowflake;

  /** ID of the guild containing the channel */
  guild_id: Snowflake;

  /** The type of channel */
  type: ChannelType;

  /** The name of the channel */
  name: string;
}

/**
 * Represents a file attached to a message.
 * @see {@link https://github.com/discord/discord-api-docs/blob/main/docs/resources/message.md#attachment-object-attachment-structure}
 */
export interface AttachmentEntity {
  /** Attachment ID */
  id: Snowflake;

  /** Name of the attached file */
  filename: string;

  /** Title of the file */
  title?: string;

  /**
   * Description of the file
   * @maxLength 1024
   * @optional
   */
  description?: string;

  /** The attachment's media type */
  content_type?: string;

  /** Size of file in bytes */
  size: number;

  /**
   * Source URL of file
   * @format url
   */
  url: string;

  /**
   * A proxied URL of the file
   * @format url
   */
  proxy_url: string;

  /** Height of file (if image) */
  height?: number | null;

  /** Width of file (if image) */
  width?: number | null;

  /** Whether this attachment is ephemeral */
  ephemeral?: boolean;

  /** The duration of the audio file (for voice messages) */
  duration_secs?: number;

  /** Base64 encoded bytearray representing a sampled waveform (for voice messages) */
  waveform?: string;

  /** Attachment flags */
  flags?: AttachmentFlags;
}

/**
 * Represents a field in an embed.
 * @see {@link https://github.com/discord/discord-api-docs/blob/main/docs/resources/message.md#embed-object-embed-field-structure}
 */
export interface EmbedFieldEntity {
  /**
   * Name of the field
   * @minLength 1
   * @maxLength 256
   */
  name: string;

  /**
   * Value of the field
   * @minLength 1
   * @maxLength 1024
   */
  value: string;

  /** Whether or not this field should display inline */
  inline?: boolean;
}

/**
 * Represents the footer of an embed.
 * @see {@link https://github.com/discord/discord-api-docs/blob/main/docs/resources/message.md#embed-object-embed-footer-structure}
 */
export interface EmbedFooterEntity {
  /**
   * Footer text
   * @minLength 1
   * @maxLength 2048
   */
  text: string;

  /**
   * URL of footer icon
   * @format url
   * @optional
   */
  icon_url?: string;

  /**
   * A proxied URL of the footer icon
   * @format url
   * @optional
   */
  proxy_icon_url?: string;
}

/**
 * Represents the author of an embed.
 * @see {@link https://github.com/discord/discord-api-docs/blob/main/docs/resources/message.md#embed-object-embed-author-structure}
 */
export interface EmbedAuthorEntity {
  /**
   * Name of author
   * @minLength 1
   * @maxLength 256
   */
  name: string;

  /**
   * URL of author
   * @format url
   * @optional
   */
  url?: string;

  /**
   * URL of author icon
   * @format url
   * @optional
   */
  icon_url?: string;

  /**
   * A proxied URL of author icon
   * @format url
   * @optional
   */
  proxy_icon_url?: string;
}

/**
 * Represents the provider of an embed.
 * @see {@link https://github.com/discord/discord-api-docs/blob/main/docs/resources/message.md#embed-object-embed-provider-structure}
 */
export interface EmbedProviderEntity {
  /** Name of provider */
  name?: string;

  /**
   * URL of provider
   * @format url
   * @optional
   */
  url?: string;
}

/**
 * Represents an image in an embed.
 * @see {@link https://github.com/discord/discord-api-docs/blob/main/docs/resources/message.md#embed-object-embed-image-structure}
 */
export interface EmbedImageEntity {
  /**
   * Source URL of image
   * @format url
   */
  url: string;

  /**
   * A proxied URL of the image
   * @format url
   * @optional
   */
  proxy_url?: string;

  /** Height of image */
  height?: number;

  /** Width of image */
  width?: number;
}

/**
 * Represents a video in an embed.
 * @see {@link https://github.com/discord/discord-api-docs/blob/main/docs/resources/message.md#embed-object-embed-video-structure}
 */
export interface EmbedVideoEntity {
  /**
   * Source URL of video
   * @format url
   * @optional
   */
  url?: string;

  /**
   * A proxied URL of the video
   * @format url
   * @optional
   */
  proxy_url?: string;

  /** Height of video */
  height?: number;

  /** Width of video */
  width?: number;
}

/**
 * Represents a thumbnail in an embed.
 * @see {@link https://github.com/discord/discord-api-docs/blob/main/docs/resources/message.md#embed-object-embed-thumbnail-structure}
 */
export interface EmbedThumbnailEntity {
  /**
   * Source URL of thumbnail
   * @format url
   */
  url: string;

  /**
   * A proxied URL of the thumbnail
   * @format url
   * @optional
   */
  proxy_url?: string;

  /** Height of thumbnail */
  height?: number;

  /** Width of thumbnail */
  width?: number;
}

/**
 * Represents an embed in a message.
 * @see {@link https://github.com/discord/discord-api-docs/blob/main/docs/resources/message.md#embed-object-embed-structure}
 */
export interface EmbedEntity {
  /**
   * Title of embed
   * @maxLength 256
   * @optional
   */
  title?: string;

  /** Type of embed (always "rich" for webhook embeds) */
  type: EmbedType;

  /**
   * Description of embed
   * @maxLength 4096
   * @optional
   */
  description?: string;

  /**
   * URL of embed
   * @format url
   * @optional
   */
  url?: string;

  /** Timestamp of embed content */
  timestamp?: string;

  /** Color code of the embed */
  color?: number;

  /** Footer information */
  footer?: EmbedFooterEntity;

  /** Image information */
  image?: EmbedImageEntity;

  /** Thumbnail information */
  thumbnail?: EmbedThumbnailEntity;

  /** Video information */
  video?: EmbedVideoEntity;

  /** Provider information */
  provider?: EmbedProviderEntity;

  /** Author information */
  author?: EmbedAuthorEntity;

  /**
   * Fields information
   * @maxItems 25
   * @optional
   */
  fields?: EmbedFieldEntity[];
}

/**
 * Represents the breakdown of reaction counts for normal and super reactions.
 * @see {@link https://github.com/discord/discord-api-docs/blob/main/docs/resources/message.md#reaction-count-details-object-reaction-count-details-structure}
 */
export interface ReactionCountDetailsEntity {
  /** Count of super reactions */
  burst: number;

  /** Count of normal reactions */
  normal: number;
}

/**
 * Represents a reaction to a message.
 * @see {@link https://github.com/discord/discord-api-docs/blob/main/docs/resources/message.md#reaction-object-reaction-structure}
 */
export interface ReactionEntity {
  /** Total number of times this emoji has been used to react */
  count: number;

  /** Breakdown of normal and super reaction counts */
  count_details: ReactionCountDetailsEntity;

  /** Whether the current user reacted using this emoji */
  me: boolean;

  /** Whether the current user super-reacted using this emoji */
  me_burst: boolean;

  /** Emoji information */
  emoji: Partial<EmojiEntity>;

  /** HEX colors used for super reaction */
  burst_colors?: string[];
}

/**
 * Represents a reference to another message.
 * @see {@link https://github.com/discord/discord-api-docs/blob/main/docs/resources/message.md#message-reference-structure}
 */
export interface MessageReferenceEntity {
  /** Type of reference */
  type: MessageReferenceType;

  /** ID of the originating message */
  message_id?: Snowflake;

  /** ID of the originating message's channel */
  channel_id?: Snowflake;

  /** ID of the originating message's guild */
  guild_id?: Snowflake;

  /** When sending, whether to error if the referenced message doesn't exist */
  fail_if_not_exists?: boolean;
}

/**
 * Represents call information associated with a message.
 * @see {@link https://github.com/discord/discord-api-docs/blob/main/docs/resources/message.md#message-call-object-message-call-object-structure}
 */
export interface MessageCallEntity {
  /** Array of user IDs that participated in the call */
  participants: Snowflake[];

  /** Time when the call ended */
  ended_timestamp?: string | null;
}

/**
 * Represents metadata about a message component interaction.
 * @see {@link https://github.com/discord/discord-api-docs/blob/main/docs/resources/message.md#message-interaction-metadata-object-message-component-interaction-metadata-structure}
 */
export interface MessageComponentInteractionMetadataEntity {
  /** ID of the interaction */
  id: Snowflake;

  /** Type of interaction */
  type: InteractionType;

  /** User who triggered the interaction */
  user: UserEntity;

  /** IDs for installation context(s) related to an interaction */
  authorizing_integration_owners: Record<string, Snowflake>;

  /** ID of the original response message, present only on follow-up messages */
  original_response_message_id?: Snowflake;

  /** ID of the message that contained the interactive component */
  interacted_message_id?: Snowflake;
}

/**
 * Represents metadata about an application command interaction.
 * @see {@link https://github.com/discord/discord-api-docs/blob/main/docs/resources/message.md#message-interaction-metadata-object-application-command-interaction-metadata-structure}
 */
export interface ApplicationCommandInteractionMetadataEntity {
  /** ID of the interaction */
  id: Snowflake;

  /** Type of interaction */
  type: InteractionType;

  /** User who triggered the interaction */
  user: UserEntity;

  /** IDs for installation context(s) related to an interaction */
  authorizing_integration_owners: Record<string, Snowflake>;

  /** ID of the original response message, present only on follow-up messages */
  original_response_message_id?: Snowflake;

  /** The user the command was run on, present only on user command interactions */
  target_user?: UserEntity;

  /** The ID of the message the command was run on, present only on message command interactions */
  target_message_id?: Snowflake;
}

/**
 * Represents metadata about a modal submit interaction.
 * @see {@link https://github.com/discord/discord-api-docs/blob/main/docs/resources/message.md#message-interaction-metadata-object-modal-submit-interaction-metadata-structure}
 */
export interface ModalSubmitInteractionMetadataEntity {
  /** ID of the interaction */
  id: Snowflake;

  /** Type of interaction */
  type: InteractionType;

  /** User who triggered the interaction */
  user: UserEntity;

  /** IDs for installation context(s) related to an interaction */
  authorizing_integration_owners: Record<string, Snowflake>;

  /** ID of the original response message, present only on follow-up messages */
  original_response_message_id?: Snowflake;

  /** Metadata for the interaction that was used to open the modal */
  triggering_interaction_metadata?:
    | ApplicationCommandInteractionMetadataEntity
    | MessageComponentInteractionMetadataEntity;
}

/**
 * Represents an activity associated with a message.
 * @see {@link https://github.com/discord/discord-api-docs/blob/main/docs/resources/message.md#message-object-message-activity-structure}
 */
export interface MessageActivityEntity {
  /** Type of message activity */
  type: MessageActivityType;

  /** Party ID from a Rich Presence event */
  party_id?: string;
}

/**
 * Represents a Discord message.
 * @see {@link https://github.com/discord/discord-api-docs/blob/main/docs/resources/message.md#message-object}
 */
export interface MessageEntity {
  /** ID of the message */
  id: Snowflake;

  /** ID of the channel the message was sent in */
  channel_id: Snowflake;

  /** The author of this message */
  author: UserEntity;

  /**
   * Contents of the message
   * @maxLength 2000
   */
  content: string;

  /** When this message was sent */
  timestamp: string;

  /** When this message was edited (null if never) */
  edited_timestamp: string | null;

  /** Whether this was a TTS message */
  tts: boolean;

  /** Whether this message mentions everyone */
  mention_everyone: boolean;

  /** Users specifically mentioned in the message */
  mentions: UserEntity[];

  /** Roles specifically mentioned in this message */
  mention_roles: Snowflake[];

  /** Any attached files */
  attachments: AttachmentEntity[];

  /** Any embedded content */
  embeds: EmbedEntity[];

  /** Whether this message is pinned */
  pinned: boolean;

  /** Type of message */
  type: MessageType;

  /** Channels specifically mentioned in this message */
  mention_channels?: ChannelMentionEntity[];

  /** Reactions to the message */
  reactions?: ReactionEntity[];

  /** Used for validating a message was sent */
  nonce?: string | number;

  /** If the message is generated by a webhook, this is the webhook's ID */
  webhook_id?: Snowflake;

  /** Sent with Rich Presence-related chat embeds */
  activity?: MessageActivityEntity;

  /** Sent with Rich Presence-related chat embeds */
  application?: Partial<ApplicationEntity>;

  /** If the message is an Interaction or application-owned webhook, this is the ID of the application */
  application_id?: Snowflake;

  /** Message flags combined as a bitfield */
  flags?: MessageFlags;

  /** Components in the message (buttons, select menus, etc.) */
  components?: ActionRowEntity[];

  /** Sticker items sent with the message */
  sticker_items?: StickerItemEntity[];

  /** @deprecated The stickers sent with the message */
  stickers?: StickerEntity[];

  /** Approximate position of the message in a thread */
  position?: number;

  /** Data from a role subscription purchase event */
  role_subscription_data?: RoleSubscriptionDataEntity;

  /** Poll data if this message contains a poll */
  poll?: PollEntity;

  /** Call data if this message is a call */
  call?: MessageCallEntity;

  /** Data showing the source of a crosspost, channel follow add, pin, or reply message */
  message_reference?: MessageReferenceEntity;

  /** Metadata about the interaction that generated this message */
  interaction_metadata?:
    | ApplicationCommandInteractionMetadataEntity
    | MessageComponentInteractionMetadataEntity
    | ModalSubmitInteractionMetadataEntity;

  /** Thread associated with this message */
  thread?: AnyThreadChannelEntity;

  /** Metadata about the interaction that generated this message */
  resolved?: InteractionResolvedDataEntity;

  /** For messages with type Forward, contains the message snapshots */
  message_snapshots?: MessageSnapshotEntity[];

  /** The message associated with the message_reference */
  referenced_message?: MessageEntity | null;
}

/**
 * Represents a snapshot of a message.
 *
 * @see {@link https://discord.com/developers/docs/resources/message#message-snapshot-object}
 */
export interface MessageSnapshotEntity {
  /** Minimal subset of fields in the forwarded message */
  message: Pick<
    MessageEntity,
    | "type"
    | "content"
    | "embeds"
    | "attachments"
    | "timestamp"
    | "edited_timestamp"
    | "flags"
    | "mentions"
    | "mention_roles"
    | "stickers"
    | "sticker_items"
    | "components"
  >;
}
