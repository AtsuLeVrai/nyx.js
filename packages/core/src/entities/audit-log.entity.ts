import type { Snowflake } from "../managers/index.js";
import type { AnyApplicationCommandEntity } from "./application-commands.entity.js";
import type { AutoModerationRuleEntity } from "./auto-moderation.entity.js";
import type { AnyThreadChannelEntity } from "./channel.entity.js";
import type { IntegrationEntity } from "./guild.entity.js";
import type { GuildScheduledEventEntity } from "./scheduled-event.entity.js";
import type { UserEntity } from "./user.entity.js";
import type { WebhookEntity } from "./webhook.entity.js";

/**
 * Audit log events enumeration.
 * These values indicate the type of action that occurred in the audit log.
 * All audit log entries are stored for 45 days.
 * @see {@link https://discord.com/developers/docs/resources/audit-log#audit-log-entry-object-audit-log-events}
 */
export enum AuditLogEvent {
  /**
   * Server settings were updated.
   * Changes to the Guild object will be included.
   * @value 1
   */
  GuildUpdate = 1,

  /**
   * Channel was created.
   * Changes to the Channel object will be included.
   * @value 10
   */
  ChannelCreate = 10,

  /**
   * Channel settings were updated.
   * Changes to the Channel object will be included.
   * @value 11
   */
  ChannelUpdate = 11,

  /**
   * Channel was deleted.
   * Changes to the Channel object will be included.
   * @value 12
   */
  ChannelDelete = 12,

  /**
   * Permission overwrite was added to a channel.
   * Changes to the Channel Overwrite object will be included.
   * @value 13
   */
  ChannelOverwriteCreate = 13,

  /**
   * Permission overwrite was updated for a channel.
   * Changes to the Channel Overwrite object will be included.
   * @value 14
   */
  ChannelOverwriteUpdate = 14,

  /**
   * Permission overwrite was deleted from a channel.
   * Changes to the Channel Overwrite object will be included.
   * @value 15
   */
  ChannelOverwriteDelete = 15,

  /**
   * Member was removed from server.
   * No changes array, but options.channel_id may be present.
   * @value 20
   */
  MemberKick = 20,

  /**
   * Members were pruned from server.
   * No changes array, but options.delete_member_days and options.members_removed will be present.
   * @value 21
   */
  MemberPrune = 21,

  /**
   * Member was banned from server.
   * No changes array.
   * @value 22
   */
  MemberBanAdd = 22,

  /**
   * Server ban was lifted for a member.
   * No changes array.
   * @value 23
   */
  MemberBanRemove = 23,

  /**
   * Member was updated in server.
   * Changes to the Member object will be included.
   * @value 24
   */
  MemberUpdate = 24,

  /**
   * Member was added or removed from a role.
   * The changes array will include $add and/or $remove with an array of role objects.
   * @value 25
   */
  MemberRoleUpdate = 25,

  /**
   * Member was moved to a different voice channel.
   * No changes array, but options.channel_id and options.count will be present.
   * @value 26
   */
  MemberMove = 26,

  /**
   * Member was disconnected from a voice channel.
   * No changes array, but options.count will be present.
   * @value 27
   */
  MemberDisconnect = 27,

  /**
   * Bot user was added to server.
   * No changes array.
   * @value 28
   */
  BotAdd = 28,

  /**
   * Role was created.
   * Changes to the Role object will be included.
   * @value 30
   */
  RoleCreate = 30,

  /**
   * Role was edited.
   * Changes to the Role object will be included.
   * @value 31
   */
  RoleUpdate = 31,

  /**
   * Role was deleted.
   * Changes to the Role object will be included.
   * @value 32
   */
  RoleDelete = 32,

  /**
   * Server invite was created.
   * Includes an additional channel_id key in changes array.
   * @value 40
   */
  InviteCreate = 40,

  /**
   * Server invite was updated.
   * Includes an additional channel_id key in changes array.
   * @value 41
   */
  InviteUpdate = 41,

  /**
   * Server invite was deleted.
   * Includes an additional channel_id key in changes array.
   * @value 42
   */
  InviteDelete = 42,

  /**
   * Webhook was created.
   * Changes to the Webhook object will be included with avatar_hash instead of avatar.
   * @value 50
   */
  WebhookCreate = 50,

  /**
   * Webhook properties or channel were updated.
   * Changes to the Webhook object will be included with avatar_hash instead of avatar.
   * @value 51
   */
  WebhookUpdate = 51,

  /**
   * Webhook was deleted.
   * Changes to the Webhook object will be included with avatar_hash instead of avatar.
   * @value 52
   */
  WebhookDelete = 52,

  /**
   * Emoji was created.
   * Changes to the Emoji object will be included.
   * @value 60
   */
  EmojiCreate = 60,

  /**
   * Emoji name was updated.
   * Changes to the Emoji object will be included.
   * @value 61
   */
  EmojiUpdate = 61,

  /**
   * Emoji was deleted.
   * Changes to the Emoji object will be included.
   * @value 62
   */
  EmojiDelete = 62,

  /**
   * Single message was deleted.
   * No changes array, but options.channel_id and options.count will be present.
   * @value 72
   */
  MessageDelete = 72,

  /**
   * Multiple messages were deleted.
   * No changes array, but options.count will be present.
   * @value 73
   */
  MessageBulkDelete = 73,

  /**
   * Message was pinned to a channel.
   * No changes array, but options.channel_id and options.message_id will be present.
   * @value 74
   */
  MessagePin = 74,

  /**
   * Message was unpinned from a channel.
   * No changes array, but options.channel_id and options.message_id will be present.
   * @value 75
   */
  MessageUnpin = 75,

  /**
   * App was added to server.
   * Changes to the Integration object will be included.
   * @value 80
   */
  IntegrationCreate = 80,

  /**
   * App was updated (as an example, its scopes were updated).
   * Changes to the Integration object will be included.
   * @value 81
   */
  IntegrationUpdate = 81,

  /**
   * App was removed from server.
   * Changes to the Integration object will be included.
   * @value 82
   */
  IntegrationDelete = 82,

  /**
   * Stage instance was created (stage channel becomes live).
   * Changes to the Stage Instance object will be included.
   * @value 83
   */
  StageInstanceCreate = 83,

  /**
   * Stage instance details were updated.
   * Changes to the Stage Instance object will be included.
   * @value 84
   */
  StageInstanceUpdate = 84,

  /**
   * Stage instance was deleted (stage channel no longer live).
   * Changes to the Stage Instance object will be included.
   * @value 85
   */
  StageInstanceDelete = 85,

  /**
   * Sticker was created.
   * Changes to the Sticker object will be included.
   * @value 90
   */
  StickerCreate = 90,

  /**
   * Sticker details were updated.
   * Changes to the Sticker object will be included.
   * @value 91
   */
  StickerUpdate = 91,

  /**
   * Sticker was deleted.
   * Changes to the Sticker object will be included.
   * @value 92
   */
  StickerDelete = 92,

  /**
   * Event was created.
   * Changes to the Guild Scheduled Event object will be included.
   * @value 100
   */
  GuildScheduledEventCreate = 100,

  /**
   * Event was updated.
   * Changes to the Guild Scheduled Event object will be included.
   * @value 101
   */
  GuildScheduledEventUpdate = 101,

  /**
   * Event was cancelled.
   * Changes to the Guild Scheduled Event object will be included.
   * @value 102
   */
  GuildScheduledEventDelete = 102,

  /**
   * Thread was created in a channel.
   * Changes to the Thread Metadata object will be included.
   * @value 110
   */
  ThreadCreate = 110,

  /**
   * Thread was updated.
   * Changes to the Thread Metadata object will be included.
   * @value 111
   */
  ThreadUpdate = 111,

  /**
   * Thread was deleted.
   * Changes to the Thread Metadata object will be included.
   * @value 112
   */
  ThreadDelete = 112,

  /**
   * Permissions were updated for a command.
   * Changes contains objects with a key field representing the entity affected.
   * @value 121
   */
  ApplicationCommandPermissionUpdate = 121,

  /**
   * Soundboard sound was created.
   * Changes to the Soundboard Sound object will be included.
   * @value 130
   */
  SoundboardSoundCreate = 130,

  /**
   * Soundboard sound was updated.
   * Changes to the Soundboard Sound object will be included.
   * @value 131
   */
  SoundboardSoundUpdate = 131,

  /**
   * Soundboard sound was deleted.
   * Changes to the Soundboard Sound object will be included.
   * @value 132
   */
  SoundboardSoundDelete = 132,

  /**
   * Auto Moderation rule was created.
   * Changes to the Auto Moderation Rule object will be included.
   * @value 140
   */
  AutoModerationRuleCreate = 140,

  /**
   * Auto Moderation rule was updated.
   * Changes to the Auto Moderation Rule object will be included.
   * @value 141
   */
  AutoModerationRuleUpdate = 141,

  /**
   * Auto Moderation rule was deleted.
   * Changes to the Auto Moderation Rule object will be included.
   * @value 142
   */
  AutoModerationRuleDelete = 142,

  /**
   * Message was blocked by Auto Moderation.
   * No changes array, but options will include auto moderation rule details.
   * @value 143
   */
  AutoModerationBlockMessage = 143,

  /**
   * Message was flagged by Auto Moderation.
   * No changes array, but options will include auto moderation rule details.
   * @value 144
   */
  AutoModerationFlagToChannel = 144,

  /**
   * Member was timed out by Auto Moderation.
   * No changes array, but options will include auto moderation rule details.
   * @value 145
   */
  AutoModerationUserCommunicationDisabled = 145,

  /**
   * Creator monetization request was created.
   * No changes array.
   * @value 150
   */
  CreatorMonetizationRequestCreated = 150,

  /**
   * Creator monetization terms were accepted.
   * No changes array.
   * @value 151
   */
  CreatorMonetizationTermsAccepted = 151,

  /**
   * Onboarding prompt was created.
   * Changes to the Onboarding Prompt Structure will be included.
   * @value 163
   */
  OnboardingPromptCreate = 163,

  /**
   * Onboarding prompt was updated.
   * Changes to the Onboarding Prompt Structure will be included.
   * @value 164
   */
  OnboardingPromptUpdate = 164,

  /**
   * Onboarding prompt was deleted.
   * Changes to the Onboarding Prompt Structure will be included.
   * @value 165
   */
  OnboardingPromptDelete = 165,

  /**
   * Onboarding was created.
   * Changes to the Guild Onboarding object will be included.
   * @value 166
   */
  OnboardingCreate = 166,

  /**
   * Onboarding was updated.
   * Changes to the Guild Onboarding object will be included.
   * @value 167
   */
  OnboardingUpdate = 167,

  /**
   * Home settings were created.
   * No changes array.
   * @value 190
   */
  HomeSettingsCreate = 190,

  /**
   * Home settings were updated.
   * No changes array.
   * @value 191
   */
  HomeSettingsUpdate = 191,
}

/**
 * Represents a change to an entity in an audit log.
 * Each audit log entry can contain multiple changes, with varying structures.
 * Not all audit log events include changes.
 * @see {@link https://discord.com/developers/docs/resources/audit-log#audit-log-change-object}
 */
export interface AuditLogChangeEntity {
  /**
   * Name of the changed entity.
   * This is generally a property name from the corresponding object type
   * that was modified.
   */
  key: string;

  /**
   * New value of the entity.
   * If not present while old_value is, it indicates the property was reset or set to null.
   * Type varies based on what property changed.
   */
  new_value?: unknown;

  /**
   * Old value of the entity.
   * If not present, it indicates the property was previously null.
   * Type varies based on what property changed.
   */
  old_value?: unknown;
}

/**
 * Represents permission changes for application commands in an audit log.
 * This is a special case for APPLICATION_COMMAND_PERMISSION_UPDATE events.
 * @see {@link https://discord.com/developers/docs/resources/audit-log#audit-log-change-object-audit-log-change-exceptions}
 */
export interface AuditLogCommandPermissionChangeEntity {
  /**
   * ID of the command or the application the permissions were changed for.
   * Represents the entity (role, channel, or user ID) whose command was affected.
   */
  key: Snowflake;

  /**
   * Old permission overwrites.
   * Contains the previous permissions configuration.
   */
  old_value: Record<string, unknown>;

  /**
   * New permission overwrites.
   * Contains the updated permissions configuration.
   */
  new_value: Record<string, unknown>;
}

/**
 * Represents role changes in an audit log.
 * This is a special case for MEMBER_ROLE_UPDATE events.
 * @see {@link https://discord.com/developers/docs/resources/audit-log#audit-log-change-object-audit-log-change-exceptions}
 */
export interface AuditLogRoleChangeEntity {
  /**
   * Type of role change.
   * "$add" indicates roles were added to the member.
   * "$remove" indicates roles were removed from the member.
   */
  key: "$add" | "$remove";

  /**
   * Array of role objects.
   * Each object contains the role's ID and name.
   */
  new_value: {
    /** Role ID */
    id: string;

    /** Role name */
    name: string;
  }[];
}

/**
 * Represents optional additional info for an audit log entry.
 * These fields provide context-specific details that vary depending on the action_type.
 * @see {@link https://discord.com/developers/docs/resources/audit-log#audit-log-entry-object-optional-audit-entry-info}
 */
export interface AuditLogEntryInfoEntity {
  /**
   * ID of the app whose permissions were targeted.
   * Present for APPLICATION_COMMAND_PERMISSION_UPDATE events.
   */
  application_id?: Snowflake;

  /**
   * Name of the Auto Moderation rule that was triggered.
   * Present for Auto Moderation action events (143-145).
   */
  auto_moderation_rule_name?: string;

  /**
   * Trigger type of the Auto Moderation rule that was triggered.
   * Present for Auto Moderation action events (143-145).
   */
  auto_moderation_rule_trigger_type?: string;

  /**
   * Channel in which the entities were targeted.
   * Present for channel-specific events like message actions, stage instance
   * actions, and Auto Moderation actions.
   */
  channel_id?: Snowflake;

  /**
   * Number of entities that were targeted.
   * Present for bulk action events like MESSAGE_DELETE, MESSAGE_BULK_DELETE,
   * MEMBER_DISCONNECT, and MEMBER_MOVE.
   */
  count?: string;

  /**
   * Number of days after which inactive members were kicked.
   * Present for MEMBER_PRUNE events.
   */
  delete_member_days?: string;

  /**
   * ID of the overwritten entity.
   * Present for channel permission overwrite actions (13-15).
   */
  id?: Snowflake;

  /**
   * Number of members removed by the prune.
   * Present for MEMBER_PRUNE events.
   */
  members_removed?: string;

  /**
   * ID of the message that was targeted.
   * Present for MESSAGE_PIN and MESSAGE_UNPIN events.
   */
  message_id?: Snowflake;

  /**
   * Name of the role if type is "0" (role), or name of the invite if type is "1" (invite).
   * Present for channel permission overwrite actions (13-15).
   */
  role_name?: string;

  /**
   * Type of overwritten entity - role ("0") or member ("1").
   * Present for channel permission overwrite actions (13-15).
   */
  type?: "0" | "1";

  /**
   * Type of integration which performed the action.
   * Present for MEMBER_KICK and MEMBER_ROLE_UPDATE events.
   */
  integration_type?: string;
}

/**
 * Represents an entry in the audit log.
 * Each entry represents a single administrative action that occurred in a guild.
 * Audit log entries are stored for 45 days.
 * @see {@link https://discord.com/developers/docs/resources/audit-log#audit-log-entry-object}
 */
export interface AuditLogEntryEntity {
  /**
   * ID of the affected entity (webhook, user, role, etc.).
   * For APPLICATION_COMMAND_PERMISSION_UPDATE events, this will be the command ID
   * or app ID since the changes array represents the entire permissions property.
   */
  target_id: string | null;

  /**
   * Changes made to the target_id.
   * The structure varies depending on the action_type.
   * Some events have no changes array.
   */
  changes?:
    | AuditLogChangeEntity[]
    | AuditLogCommandPermissionChangeEntity[]
    | AuditLogRoleChangeEntity[];

  /**
   * User or app that made the changes.
   * This is the ID of the user or application that performed the audited action.
   */
  user_id: Snowflake | null;

  /**
   * ID of the entry.
   * Unique identifier for this audit log entry.
   */
  id: Snowflake;

  /**
   * Type of action that occurred.
   * Indicates what kind of action occurred and how to interpret the changes.
   */
  action_type: AuditLogEvent;

  /**
   * Additional info for certain event types.
   * Contains action-specific information that varies by action_type.
   */
  options?: AuditLogEntryInfoEntity;

  /**
   * Reason for the change (0-512 characters).
   * Can be set by apps using the X-Audit-Log-Reason header when making API requests.
   * @minLength 0
   * @maxLength 512
   */
  reason?: string;
}

/**
 * Represents a guild's audit log.
 * Audit logs record administrative actions taken in a guild and are stored for 45 days.
 * Viewing audit logs requires the VIEW_AUDIT_LOG permission.
 * @see {@link https://discord.com/developers/docs/resources/audit-log#audit-log-object}
 */
export interface AuditLogEntity {
  /**
   * List of application commands referenced in the audit log.
   * Contains any application commands that were affected by audit log entries.
   */
  application_commands: AnyApplicationCommandEntity[];

  /**
   * List of audit log entries, sorted from most to least recent.
   * These contain information about actions that were performed in the guild.
   */
  audit_log_entries: AuditLogEntryEntity[];

  /**
   * List of auto moderation rules referenced in the audit log.
   * Contains any auto moderation rules that were affected by audit log entries.
   */
  auto_moderation_rules: AutoModerationRuleEntity[];

  /**
   * List of scheduled events referenced in the audit log.
   * Contains any guild scheduled events that were affected by audit log entries.
   */
  guild_scheduled_events: GuildScheduledEventEntity[];

  /**
   * List of partial integration objects.
   * Contains any integrations that were affected by audit log entries.
   */
  integrations: Partial<IntegrationEntity>[];

  /**
   * List of threads referenced in the audit log.
   * Contains any threads that were affected by audit log entries, including
   * archived threads that might not be in memory for clients.
   */
  threads: AnyThreadChannelEntity[];

  /**
   * List of users referenced in the audit log.
   * Contains any users that were involved in audit log entries.
   */
  users: UserEntity[];

  /**
   * List of webhooks referenced in the audit log.
   * Contains any webhooks that were affected by audit log entries.
   */
  webhooks: WebhookEntity[];
}
