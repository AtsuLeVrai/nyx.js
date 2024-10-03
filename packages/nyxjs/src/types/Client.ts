import type { ApiVersions, GatewayCloseCodes, GatewayIntents, Integer } from "@nyxjs/core";
import type { GatewayOptions } from "@nyxjs/gateway";
import type { RestOptions } from "@nyxjs/rest";

export type ClientOptions = {
    auth_type?: RestOptions["auth_type"];
    intents: GatewayIntents[] | Integer;
    presence?: GatewayOptions["presence"];
    rest?: Partial<Pick<RestOptions, "cache_life_time" | "user_agent">>;
    shard?: GatewayOptions["shard"];
    version?: ApiVersions;
    ws?: Partial<Pick<GatewayOptions, "compress" | "delay" | "encoding" | "large_threshold" | "max_attempts">>;
};

export type ClientEvents = {
    applicationCommandPermissionsUpdate: [];
    autoModerationActionExecution: [];
    autoModerationBlockMessage: [];
    autoModerationFlagToChannel: [];
    autoModerationRuleCreate: [];
    autoModerationRuleDelete: [];
    autoModerationRuleUpdate: [];
    autoModerationUserCommunicationDisabled: [];
    channelCreate: [];
    channelDelete: [];
    channelOverwriteCreate: [];
    channelOverwriteDelete: [];
    channelOverwriteUpdate: [];
    channelPinsUpdate: [];
    channelUpdate: [];
    close: [code: GatewayCloseCodes, reason: string];
    creatorMonetizationRequestCreated: [];
    creatorMonetizationTermsAccepted: [];
    debug: [message: string];
    entitlementCreate: [];
    entitlementDelete: [];
    entitlementUpdate: [];
    error: [error: Error];
    guildAuditLogEntryCreate: [];
    guildBanAdd: [];
    guildBanRemove: [];
    guildBotAdd: [];
    guildCreate: [];
    guildDelete: [];
    guildEmojiCreate: [];
    guildEmojiDelete: [];
    guildEmojiUpdate: [];
    guildHomeSettingsCreate: [];
    guildHomeSettingsUpdate: [];
    guildMemberAdd: [];
    guildMemberDisconnect: [];
    guildMemberKick: [];
    guildMemberMove: [];
    guildMemberPrune: [];
    guildMemberRemove: [];
    guildMemberUpdate: [];
    guildMembersChunk: [];
    guildOnboardingCreate: [];
    guildOnboardingPromptCreate: [];
    guildOnboardingPromptDelete: [];
    guildOnboardingPromptUpdate: [];
    guildOnboardingUpdate: [];
    guildRoleCreate: [];
    guildRoleDelete: [];
    guildRoleUpdate: [];
    guildScheduledEventCreate: [];
    guildScheduledEventDelete: [];
    guildScheduledEventUpdate: [];
    guildScheduledEventUserAdd: [];
    guildScheduledEventUserRemove: [];
    guildStickerCreate: [];
    guildStickerDelete: [];
    guildStickerUpdate: [];
    guildUpdate: [];
    integrationCreate: [];
    integrationDelete: [];
    integrationUpdate: [];
    interactionCreate: [];
    invalidateSession: [invalidate: boolean];
    inviteCreate: [];
    inviteDelete: [];
    inviteUpdate: [];
    messageCreate: [];
    messageDelete: [];
    messageDeleteBulk: [];
    messagePin: [];
    messagePollVoteAdd: [];
    messagePollVoteRemove: [];
    messageReactionAdd: [];
    messageReactionRemove: [];
    messageReactionRemoveAll: [];
    messageReactionRemoveEmoji: [];
    messageUnpin: [];
    messageUpdate: [];
    presenceUpdate: [];
    ready: [];
    reconnect: [reconnect: null];
    resumed: [];
    stageInstanceCreate: [];
    stageInstanceDelete: [];
    stageInstanceUpdate: [];
    subscriptionCreate: [];
    subscriptionDelete: [];
    subscriptionUpdate: [];
    threadCreate: [];
    threadDelete: [];
    threadListSync: [];
    threadMemberUpdate: [];
    threadMembersUpdate: [];
    threadUpdate: [];
    typingStart: [];
    userUpdate: [];
    voiceChannelEffectSend: [];
    voiceServerUpdate: [];
    voiceStateUpdate: [];
    warn: [message: string];
    webhookCreate: [];
    webhookDelete: [];
    webhookUpdate: [];
};