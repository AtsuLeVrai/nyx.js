import { ApiVersion } from "@nyxjs/core";

export const HttpConstants = {
  defaultApiVersion: ApiVersion.v10,
  defaultUserAgent: "DiscordBot (https://github.com/3tatsu/nyx.js, 1.0.0)",
  urls: {
    api: "https://discord.com",
    cdn: "https://cdn.discordapp.com",
    media: "https://media.discordapp.net",
  },
  timeout: {
    default: 15000,
    connect: 5000,
    retry: {
      min: 100,
      max: 15000,
    },
  },
} as const;

export type HttpConstants = typeof HttpConstants;

/**
 * @see {@link https://discord.com/developers/docs/topics/opcodes-and-status-codes#http-http-response-codes}
 */
export const HttpStatusCode = {
  ok: 200,
  created: 201,
  noContent: 204,
  notModified: 304,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  methodNotAllowed: 405,
  tooManyRequests: 429,
  gatewayUnavailable: 502,
  serverError: 500,
} as const;

export type HttpStatusCode =
  (typeof HttpStatusCode)[keyof typeof HttpStatusCode];

/**
 * @see {@link https://discord.com/developers/docs/topics/opcodes-and-status-codes#json-json-error-codes}
 */
export const JsonErrorCode = {
  generalError: 0,
  unknownAccount: 10001,
  unknownApplication: 10002,
  unknownChannel: 10003,
  unknownGuild: 10004,
  unknownIntegration: 10005,
  unknownInvite: 10006,
  unknownMember: 10007,
  unknownMessage: 10008,
  unknownPermissionOverwrite: 10009,
  unknownProvider: 10010,
  unknownRole: 10011,
  unknownToken: 10012,
  unknownUser: 10013,
  unknownEmoji: 10014,
  unknownWebhook: 10015,
  unknownWebhookService: 10016,
  unknownSession: 10020,
  unknownAsset: 10021,
  unknownBan: 10026,
  unknownSku: 10027,
  unknownStoreListing: 10028,
  unknownEntitlement: 10029,
  unknownBuild: 10030,
  unknownLobby: 10031,
  unknownBranch: 10032,
  unknownStoreDirectoryLayout: 10033,
  unknownRedistributable: 10036,
  unknownGiftCode: 10038,
  unknownStream: 10049,
  unknownPremiumServerSubscribeCooldown: 10050,
  unknownGuildTemplate: 10057,
  unknownDiscoverableServerCategory: 10059,
  unknownSticker: 10060,
  unknownStickerPack: 10061,
  unknownInteraction: 10062,
  unknownApplicationCommand: 10063,
  unknownVoiceState: 10065,
  unknownApplicationCommandPermissions: 10066,
  unknownStageInstance: 10067,
  unknownGuildMemberVerificationForm: 10068,
  unknownGuildWelcomeScreen: 10069,
  unknownGuildScheduledEvent: 10070,
  unknownGuildScheduledEventUser: 10071,
  unknownTag: 10087,
  unknownSound: 10097,
  botsCannotUseEndpoint: 20001,
  onlyBotsCanUseEndpoint: 20002,
  explicitContentCannotBeSent: 20009,
  notAuthorizedForApplication: 20012,
  slowmodeRateLimit: 20016,
  onlyOwnerCanPerformAction: 20018,
  announcementRateLimit: 20022,
  underMinimumAge: 20024,
  channelWriteRateLimit: 20028,
  serverWriteRateLimit: 20029,
  disallowedServerContent: 20031,
  guildPremiumSubscriptionTooLow: 20035,
  maxGuildsReached: 30001,
  maxFriendsReached: 30002,
  maxPinsReached: 30003,
  maxRecipientsReached: 30004,
  maxGuildRolesReached: 30005,
  maxWebhooksReached: 30007,
  maxEmojisReached: 30008,
  maxReactionsReached: 30010,
  maxGroupDmsReached: 30011,
  maxGuildChannelsReached: 30013,
  maxAttachmentsReached: 30015,
  maxInvitesReached: 30016,
  maxAnimatedEmojisReached: 30018,
  maxServerMembersReached: 30019,
  maxServerCategoriesReached: 30030,
  guildTemplateExists: 30031,
  maxApplicationCommandsReached: 30032,
  maxThreadParticipantsReached: 30033,
  maxDailyApplicationCommandsReached: 30034,
  maxNonMemberBansReached: 30035,
  maxBanFetchesReached: 30037,
  maxUncompletedGuildScheduledEventsReached: 30038,
  maxStickersReached: 30039,
  maxPruneRequestsReached: 30040,
  maxGuildWidgetSettingsUpdatesReached: 30042,
  maxSoundboardSoundsReached: 30045,
  maxOldMessageEditsReached: 30046,
  maxPinnedThreadsInForumReached: 30047,
  maxForumTagsReached: 30048,
  bitrateTooHigh: 30052,
  maxPremiumEmojisReached: 30056,
  maxWebhooksPerGuildReached: 30058,
  maxChannelPermissionOverwritesReached: 30060,
  guildChannelsTooLarge: 30061,
  unauthorized: 40001,
  verificationRequired: 40002,
  openingDmsTooFast: 40003,
  sendMessagesTemporarilyDisabled: 40004,
  requestEntityTooLarge: 40005,
  featureTemporarilyDisabled: 40006,
  userBannedFromGuild: 40007,
  connectionRevoked: 40012,
  onlyConsumableSkusCanBeConsumed: 40018,
  onlySandboxEntitlementsCanBeDeleted: 40019,
  targetUserNotConnectedToVoice: 40032,
  messageAlreadyCrossposted: 40033,
  applicationCommandNameExists: 40041,
  interactionFailedToSend: 40043,
  cannotSendForumMessage: 40058,
  interactionAlreadyAcknowledged: 40060,
  tagNamesMustBeUnique: 40061,
  serviceResourceRateLimited: 40062,
  noAvailableTagsForNonModerators: 40066,
  tagRequiredForForumPost: 40067,
  resourceAlreadyHasEntitlement: 40074,
  maxFollowUpMessagesReached: 40094,
  cloudflareError: 40333,
  missingAccess: 50001,
  invalidAccountType: 50002,
  cannotExecuteDmAction: 50003,
  guildWidgetDisabled: 50004,
  cannotEditOtherUsersMessages: 50005,
  cannotSendEmptyMessage: 50006,
  cannotSendMessagesToUser: 50007,
  cannotSendMessagesInNonTextChannel: 50008,
  channelVerificationTooHigh: 50009,
  oauth2ApplicationNoBot: 50010,
  oauth2ApplicationLimitReached: 50011,
  invalidOAuth2State: 50012,
  missingPermissions: 50013,
  invalidAuthenticationToken: 50014,
  noteTooLong: 50015,
  invalidMessageDeleteCount: 50016,
  invalidMfaLevel: 50017,
  invalidPinChannel: 50019,
  inviteCodeInvalidOrTaken: 50020,
  cannotExecuteOnSystemMessage: 50021,
  invalidChannelType: 50024,
  invalidOAuth2AccessToken: 50025,
  missingOAuth2Scope: 50026,
  invalidWebhookToken: 50027,
  invalidRole: 50028,
  invalidRecipients: 50033,
  messageTooOldForBulkDelete: 50034,
  invalidFormBody: 50035,
  inviteAcceptedToNonBotGuild: 50036,
  invalidActivityAction: 50039,
  invalidApiVersion: 50041,
  fileUploadTooBig: 50045,
  invalidFileUploaded: 50046,
  cannotSelfRedeemGift: 50054,
  invalidGuild: 50055,
  invalidSku: 50057,
  invalidRequestOrigin: 50067,
  invalidMessageType: 50068,
  paymentSourceRequired: 50070,
  cannotModifySystemWebhook: 50073,
  cannotDeleteRequiredChannel: 50074,
  cannotEditMessageStickers: 50080,
  invalidStickerSent: 50081,
  cannotPerformActionOnArchivedThread: 50083,
  invalidThreadNotificationSettings: 50084,
  beforeValueTooOld: 50085,
  communityChannelsMustBeTextChannels: 50086,
  eventEntityTypeMismatch: 50091,
  serverNotAvailableInLocation: 50095,
  serverNeedsMonetization: 50097,
  serverNeedsMoreBoosts: 50101,
  invalidRequestBodyJson: 50109,
  invalidFile: 50110,
  invalidFileType: 50123,
  fileDurationTooLong: 50124,
  ownerCannotBePending: 50131,
  ownershipCannotBeTransferredToBot: 50132,
  failedToResizeAsset: 50138,
  cannotMixSubscriptionEmojis: 50144,
  cannotConvertEmojis: 50145,
  uploadedFileNotFound: 50146,
  invalidEmoji: 50151,
  voiceMessagesNoAdditionalContent: 50159,
  voiceMessagesMustHaveAudio: 50160,
  voiceMessagesMustHaveMetadata: 50161,
  voiceMessagesCannotBeEdited: 50162,
  cannotDeleteGuildSubscription: 50163,
  cannotSendVoiceMessages: 50173,
  accountMustBeVerified: 50178,
  invalidFileDuration: 50192,
  noStickerPermission: 50600,
  twoFactorRequired: 60003,
  noUsersWithDiscordTag: 80004,
  reactionBlocked: 90001,
  userCannotUseBurstReactions: 90002,
  applicationNotAvailable: 110001,
  apiResourceOverloaded: 130000,
  stageAlreadyOpen: 150006,
  cannotReplyWithoutReadHistory: 160002,
  threadAlreadyCreated: 160004,
  threadLocked: 160005,
  maxActiveThreadsReached: 160006,
  maxActiveAnnouncementThreadsReached: 160007,
  invalidLottieJson: 170001,
  lottieCannotContainRasterImages: 170002,
  stickerMaxFramerateExceeded: 170003,
  stickerMaxFramesExceeded: 170004,
  lottieDimensionsExceeded: 170005,
  stickerFrameRateInvalid: 170006,
  stickerAnimationDurationExceeded: 170007,
  cannotUpdateFinishedEvent: 180000,
  failedToCreateStageEvent: 180002,
  messageBlockedByAutomod: 200000,
  titleBlockedByAutomod: 200001,
  webhookForumThreadNameRequired: 220001,
  webhookForumThreadConflict: 220002,
  webhooksCanOnlyCreateForumThreads: 220003,
  webhookServicesNotAllowedInForums: 220004,
  messageBlockedByHarmfulLinks: 240000,
  cannotEnableOnboarding: 350000,
  cannotUpdateOnboarding: 350001,
  failedToBanUsers: 500000,
  pollVotingBlocked: 520000,
  pollExpired: 520001,
  invalidPollChannel: 520002,
  cannotEditPoll: 520003,
  cannotUsePollEmoji: 520004,
  cannotExpireNonPoll: 520006,
} as const;

export type JsonErrorCode = (typeof JsonErrorCode)[keyof typeof JsonErrorCode];
