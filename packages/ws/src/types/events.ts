import type {
    AuditLogEntryStructure,
    AutoModerationRuleStructure,
    ChannelStructure,
    EntitlementStructure,
    GuildApplicationCommandPermissionsStructure,
    GuildMemberStructure,
    GuildScheduledEventStructure,
    GuildStructure,
    IntegrationStructure,
    InteractionStructure,
    MessageStructure,
    StageInstanceStructure,
    SubscriptionStructure,
    ThreadMemberStructure,
    UnavailableGuildStructure,
    UserStructure,
    VoiceStateStructure,
} from "@nyxjs/api-types";
import type { GatewayOpcodes, Integer } from "@nyxjs/core";
import type {
    ChannelPinsUpdateEventFields,
    ThreadListSyncEventFields,
    ThreadMembersUpdateEventFields,
    ThreadMemberUpdateEventExtraFields,
} from "../events/channels";
import type {
    GuildAuditLogEntryCreateEventExtraFields,
    GuildBanAddEventFields,
    GuildBanRemoveEventFields,
    GuildCreateExtraFields,
    GuildEmojisUpdateEventFields,
    GuildIntegrationsUpdateEventFields,
    GuildMemberAddEventFields,
    GuildMemberRemoveEventFields,
    GuildMembersChunkEventFields,
    GuildMemberUpdateEventFields,
    GuildRoleCreateEventFields,
    GuildRoleDeleteEventFields,
    GuildRoleUpdateEventFields,
    GuildScheduledEventUserAddEventFields,
    GuildScheduledEventUserRemoveEventFields,
    GuildStickersUpdateEventFields,
    RequestGuildMembersRequestStructure,
} from "../events/guilds";
import type { HelloStructure } from "../events/hello";
import type { IdentifyStructure } from "../events/identity";
import type {
    IntegrationCreateEventAdditionalFields,
    IntegrationDeleteEventFields,
    IntegrationUpdateEventAdditionalFields,
} from "../events/integrations";
import type { InviteCreateEventFields, InviteDeleteEventFields } from "../events/invites";
import type {
    MessageCreateExtraFields,
    MessageDeleteBulkEventFields,
    MessageDeleteEventFields,
    MessageReactionAddEventFields,
    MessageReactionRemoveAllEventFields,
    MessageReactionRemoveEmojiEventFields,
    MessageReactionRemoveEventFields,
} from "../events/messages";
import type { AutoModerationActionExecutionEventFields } from "../events/moderations";
import type { MessagePollVoteAddFields, MessagePollVoteRemoveFields } from "../events/polls";
import type {
    PresenceUpdateEventFields,
    TypingStartEventFields,
    UpdatePresenceGatewayPresenceUpdateStructure,
} from "../events/presences";
import type { ReadyEventFields } from "../events/ready";
import type { ResumeStructure } from "../events/resume";
import type {
    UpdateVoiceStateGatewayVoiceStateUpdateStructure,
    VoiceChannelEffectSendEventFields,
    VoiceServerUpdateEventFields,
} from "../events/voices";
import type { WebhooksUpdateEventFields } from "../events/webhooks";

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#receive-events}
 */
export type GatewayReceiveEvents = {
    [GatewayOpcodes.Hello]: [hello: HelloStructure];
    [GatewayOpcodes.Resume]: [resume: ResumeStructure];
    [GatewayOpcodes.Reconnect]: [reconnect: null];
    [GatewayOpcodes.InvalidSession]: [invalidSession: boolean];
    APPLICATION_COMMAND_PERMISSIONS_UPDATE: [
        applicationCommandPermissionsUpdate: GuildApplicationCommandPermissionsStructure,
    ];
    AUTO_MODERATION_ACTION_EXECUTION: [autoModerationActionExecution: AutoModerationActionExecutionEventFields];
    AUTO_MODERATION_RULE_CREATE: [autoModerationRuleCreate: AutoModerationRuleStructure];
    AUTO_MODERATION_RULE_DELETE: [autoModerationRuleDelete: AutoModerationRuleStructure];
    AUTO_MODERATION_RULE_UPDATE: [autoModerationRuleUpdate: AutoModerationRuleStructure];
    CHANNEL_CREATE: [channelCreate: ChannelStructure];
    CHANNEL_DELETE: [channelDelete: ChannelStructure];
    CHANNEL_PINS_UPDATE: [channelPinsUpdate: ChannelPinsUpdateEventFields];
    CHANNEL_UPDATE: [channelUpdate: ChannelStructure];
    ENTITLEMENT_CREATE: [entitlementCreate: EntitlementStructure];
    ENTITLEMENT_DELETE: [entitlementDelete: EntitlementStructure];
    ENTITLEMENT_UPDATE: [entitlementUpdate: EntitlementStructure];
    GUILD_AUDIT_LOG_ENTRY_CREATE: [
        guildAuditLogEntryCreate: AuditLogEntryStructure & GuildAuditLogEntryCreateEventExtraFields,
    ];
    GUILD_BAN_ADD: [guildBanAdd: GuildBanAddEventFields];
    GUILD_BAN_REMOVE: [guildBanRemove: GuildBanRemoveEventFields];
    GUILD_CREATE: [guildCreate: UnavailableGuildStructure | (GuildCreateExtraFields & GuildStructure)];
    GUILD_DELETE: [guildDelete: UnavailableGuildStructure];
    GUILD_EMOJIS_UPDATE: [guildEmojisUpdate: GuildEmojisUpdateEventFields];
    GUILD_INTEGRATIONS_UPDATE: [guildIntegrationsUpdate: GuildIntegrationsUpdateEventFields];
    GUILD_MEMBERS_CHUNK: [guildMembersChunk: GuildMembersChunkEventFields];
    GUILD_MEMBER_ADD: [guildMemberAdd: GuildMemberAddEventFields & GuildMemberStructure];
    GUILD_MEMBER_REMOVE: [guildMemberRemove: GuildMemberRemoveEventFields];
    GUILD_MEMBER_UPDATE: [guildMemberUpdate: GuildMemberUpdateEventFields];
    GUILD_ROLE_CREATE: [guildRoleCreate: GuildRoleCreateEventFields];
    GUILD_ROLE_DELETE: [guildRoleDelete: GuildRoleDeleteEventFields];
    GUILD_ROLE_UPDATE: [guildRoleUpdate: GuildRoleUpdateEventFields];
    GUILD_SCHEDULED_EVENT_CREATE: [guildScheduledEventCreate: GuildScheduledEventStructure];
    GUILD_SCHEDULED_EVENT_DELETE: [guildScheduledEventDelete: GuildScheduledEventStructure];
    GUILD_SCHEDULED_EVENT_UPDATE: [guildScheduledEventUpdate: GuildScheduledEventStructure];
    GUILD_SCHEDULED_EVENT_USER_ADD: [guildScheduledEventUserAdd: GuildScheduledEventUserAddEventFields];
    GUILD_SCHEDULED_EVENT_USER_REMOVE: [guildScheduledEventUserRemove: GuildScheduledEventUserRemoveEventFields];
    GUILD_STICKERS_UPDATE: [guildStickersUpdate: GuildStickersUpdateEventFields];
    GUILD_UPDATE: [guildUpdate: GuildStructure];
    INTEGRATION_CREATE: [integrationCreate: IntegrationCreateEventAdditionalFields & IntegrationStructure];
    INTEGRATION_DELETE: [integrationDelete: IntegrationDeleteEventFields];
    INTEGRATION_UPDATE: [integrationUpdate: IntegrationStructure & IntegrationUpdateEventAdditionalFields];
    INTERACTION_CREATE: [interactionCreate: InteractionStructure];
    INVITE_CREATE: [inviteCreate: InviteCreateEventFields];
    INVITE_DELETE: [inviteDelete: InviteDeleteEventFields];
    MESSAGE_CREATE: [messageCreate: MessageCreateExtraFields & MessageStructure];
    MESSAGE_DELETE: [messageDelete: MessageDeleteEventFields];
    MESSAGE_DELETE_BULK: [messageDeleteBulk: MessageDeleteBulkEventFields];
    MESSAGE_POLL_VOTE_ADD: [messagePollVoteAdd: MessagePollVoteAddFields];
    MESSAGE_POLL_VOTE_REMOVE: [messagePollVoteRemove: MessagePollVoteRemoveFields];
    MESSAGE_REACTION_ADD: [messageReactionAdd: MessageReactionAddEventFields];
    MESSAGE_REACTION_REMOVE: [messageReactionRemove: MessageReactionRemoveEventFields];
    MESSAGE_REACTION_REMOVE_ALL: [messageReactionRemoveAll: MessageReactionRemoveAllEventFields];
    MESSAGE_REACTION_REMOVE_EMOJI: [messageReactionRemoveEmoji: MessageReactionRemoveEmojiEventFields];
    MESSAGE_UPDATE: [messageUpdate: MessageStructure];
    PRESENCE_UPDATE: [presenceUpdate: PresenceUpdateEventFields];
    READY: [ready: ReadyEventFields];
    STAGE_INSTANCE_CREATE: [stageInstanceCreate: StageInstanceStructure];
    STAGE_INSTANCE_DELETE: [stageInstanceDelete: StageInstanceStructure];
    STAGE_INSTANCE_UPDATE: [stageInstanceUpdate: StageInstanceStructure];
    SUBSCRIPTION_CREATE: [subscriptionCreate: SubscriptionStructure];
    SUBSCRIPTION_DELETE: [subscriptionDelete: SubscriptionStructure];
    SUBSCRIPTION_UPDATE: [subscriptionUpdate: SubscriptionStructure];
    THREAD_CREATE: [
        threadCreate:
            | (ChannelStructure &
                  ThreadMemberStructure & {
                      newly_created: boolean;
                  })
            | (ChannelStructure & {
                  newly_created: boolean;
              })
            | (ChannelStructure & ThreadMemberStructure),
    ];
    THREAD_DELETE: [threadDelete: Pick<ChannelStructure, "guild_id" | "id" | "parent_id" | "type">];
    THREAD_LIST_SYNC: [threadListSync: ThreadListSyncEventFields];
    THREAD_MEMBERS_UPDATE: [threadMembersUpdate: ThreadMembersUpdateEventFields];
    THREAD_MEMBER_UPDATE: [threadMemberUpdate: ThreadMemberStructure & ThreadMemberUpdateEventExtraFields];
    TYPING_START: [typingStart: TypingStartEventFields];
    USER_UPDATE: [userUpdate: UserStructure];
    VOICE_CHANNEL_EFFECT_SEND: [voiceChannelEffectSend: VoiceChannelEffectSendEventFields];
    VOICE_SERVER_UPDATE: [voiceServerUpdate: VoiceServerUpdateEventFields];
    VOICE_STATE_UPDATE: [voiceStateUpdate: VoiceStateStructure];
    WEBHOOKS_UPDATE: [webhooksUpdate: WebhooksUpdateEventFields];
};

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#send-events}
 */
export type GatewaySendEvents = {
    [GatewayOpcodes.Identify]: IdentifyStructure;
    [GatewayOpcodes.Resume]: ResumeStructure;
    [GatewayOpcodes.Heartbeat]: Integer | null;
    [GatewayOpcodes.RequestGuildMembers]: RequestGuildMembersRequestStructure;
    [GatewayOpcodes.VoiceStateUpdate]: UpdateVoiceStateGatewayVoiceStateUpdateStructure;
    [GatewayOpcodes.PresenceUpdate]: UpdatePresenceGatewayPresenceUpdateStructure;
};
