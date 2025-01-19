import type { Dispatcher } from "undici";
import type { FileInput } from "./file-processor.type.js";
import type { RateLimitBucket, RateLimitEvent } from "./rate-limit.type.js";

/**
 * @see {@link https://discord.com/developers/docs/topics/opcodes-and-status-codes#json-example-json-error-response}
 */
export interface JsonErrorEntity {
  code: JsonErrorCode;
  message: string;
  errors?: Record<string, unknown>;
}

export interface RequestOptions extends Dispatcher.RequestOptions {
  files?: FileInput | FileInput[];
  reason?: string;
}

export interface RequestStartEvent {
  path: string;
  method: string;
  body?: unknown;
  timestamp: number;
}

export interface RequestFinishEvent {
  path: string;
  method: string;
  statusCode: number;
  latency: number;
}

export interface InvalidRequestEvent {
  path: string;
  method: string;
  statusCode: number;
}

export interface RestEvents {
  debug: (message: string, context?: Record<string, unknown>) => void;
  error: (message: string | Error, context?: Record<string, unknown>) => void;
  warn: (message: string, context?: Record<string, unknown>) => void;
  requestStart: (requestInfo: RequestStartEvent) => void;
  requestFinish: (requestInfo: RequestFinishEvent) => void;
  rateLimited: (data: RateLimitEvent) => void;
  bucketCreated: (bucket: RateLimitBucket) => void;
  bucketDeleted: (bucketHash: string) => void;
  invalidRequest: (data: InvalidRequestEvent) => void;
}

/**
 * @see {@link https://discord.com/developers/docs/topics/opcodes-and-status-codes#http-http-response-codes}
 */
export enum HttpStatusCode {
  Ok = 200,
  Created = 201,
  NoContent = 204,
  NotModified = 304,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  TooManyRequests = 429,
  GatewayUnavailable = 502,
  ServerError = 500,
}

/**
 * @see {@link https://discord.com/developers/docs/topics/opcodes-and-status-codes#json-json-error-codes}
 */
export enum JsonErrorCode {
  GeneralError = 0,
  UnknownAccount = 10001,
  UnknownApplication = 10002,
  UnknownChannel = 10003,
  UnknownGuild = 10004,
  UnknownIntegration = 10005,
  UnknownInvite = 10006,
  UnknownMember = 10007,
  UnknownMessage = 10008,
  UnknownPermissionOverwrite = 10009,
  UnknownProvider = 10010,
  UnknownRole = 10011,
  UnknownToken = 10012,
  UnknownUser = 10013,
  UnknownEmoji = 10014,
  UnknownWebhook = 10015,
  UnknownWebhookService = 10016,
  UnknownSession = 10020,
  UnknownAsset = 10021,
  UnknownBan = 10026,
  UnknownSku = 10027,
  UnknownStoreListing = 10028,
  UnknownEntitlement = 10029,
  UnknownBuild = 10030,
  UnknownLobby = 10031,
  UnknownBranch = 10032,
  UnknownStoreDirectoryLayout = 10033,
  UnknownRedistributable = 10036,
  UnknownGiftCode = 10038,
  UnknownStream = 10049,
  UnknownPremiumServerSubscribeCooldown = 10050,
  UnknownGuildTemplate = 10057,
  UnknownDiscoverableServerCategory = 10059,
  UnknownSticker = 10060,
  UnknownStickerPack = 10061,
  UnknownInteraction = 10062,
  UnknownApplicationCommand = 10063,
  UnknownVoiceState = 10065,
  UnknownApplicationCommandPermissions = 10066,
  UnknownStageInstance = 10067,
  UnknownGuildMemberVerificationForm = 10068,
  UnknownGuildWelcomeScreen = 10069,
  UnknownGuildScheduledEvent = 10070,
  UnknownGuildScheduledEventUser = 10071,
  UnknownTag = 10087,
  UnknownSound = 10097,
  BotsCannotUseEndpoint = 20001,
  OnlyBotsCanUseEndpoint = 20002,
  ExplicitContentCannotBeSent = 20009,
  NotAuthorizedForApplication = 20012,
  SlowmodeRateLimit = 20016,
  OnlyOwnerCanPerformAction = 20018,
  AnnouncementRateLimit = 20022,
  UnderMinimumAge = 20024,
  ChannelWriteRateLimit = 20028,
  ServerWriteRateLimit = 20029,
  DisallowedServerContent = 20031,
  GuildPremiumSubscriptionTooLow = 20035,
  MaxGuildsReached = 30001,
  MaxFriendsReached = 30002,
  MaxPinsReached = 30003,
  MaxRecipientsReached = 30004,
  MaxGuildRolesReached = 30005,
  MaxWebhooksReached = 30007,
  MaxEmojisReached = 30008,
  MaxReactionsReached = 30010,
  MaxGroupDmsReached = 30011,
  MaxGuildChannelsReached = 30013,
  MaxAttachmentsReached = 30015,
  MaxInvitesReached = 30016,
  MaxAnimatedEmojisReached = 30018,
  MaxServerMembersReached = 30019,
  MaxServerCategoriesReached = 30030,
  GuildTemplateExists = 30031,
  MaxApplicationCommandsReached = 30032,
  MaxThreadParticipantsReached = 30033,
  MaxDailyApplicationCommandsReached = 30034,
  MaxNonMemberBansReached = 30035,
  MaxBanFetchesReached = 30037,
  MaxUncompletedGuildScheduledEventsReached = 30038,
  MaxStickersReached = 30039,
  MaxPruneRequestsReached = 30040,
  MaxGuildWidgetSettingsUpdatesReached = 30042,
  MaxSoundboardSoundsReached = 30045,
  MaxOldMessageEditsReached = 30046,
  MaxPinnedThreadsInForumReached = 30047,
  MaxForumTagsReached = 30048,
  BitrateTooHigh = 30052,
  MaxPremiumEmojisReached = 30056,
  MaxWebhooksPerGuildReached = 30058,
  MaxChannelPermissionOverwritesReached = 30060,
  GuildChannelsTooLarge = 30061,
  Unauthorized = 40001,
  VerificationRequired = 40002,
  OpeningDmsTooFast = 40003,
  SendMessagesTemporarilyDisabled = 40004,
  RequestEntityTooLarge = 40005,
  FeatureTemporarilyDisabled = 40006,
  UserBannedFromGuild = 40007,
  ConnectionRevoked = 40012,
  OnlyConsumableSkusCanBeConsumed = 40018,
  OnlySandboxEntitlementsCanBeDeleted = 40019,
  TargetUserNotConnectedToVoice = 40032,
  MessageAlreadyCrossposted = 40033,
  ApplicationCommandNameExists = 40041,
  InteractionFailedToSend = 40043,
  CannotSendForumMessage = 40058,
  InteractionAlreadyAcknowledged = 40060,
  TagNamesMustBeUnique = 40061,
  ServiceResourceRateLimited = 40062,
  NoAvailableTagsForNonModerators = 40066,
  TagRequiredForForumPost = 40067,
  ResourceAlreadyHasEntitlement = 40074,
  MaxFollowUpMessagesReached = 40094,
  CloudflareError = 40333,
  MissingAccess = 50001,
  InvalidAccountType = 50002,
  CannotExecuteDmAction = 50003,
  GuildWidgetDisabled = 50004,
  CannotEditOtherUsersMessages = 50005,
  CannotSendEmptyMessage = 50006,
  CannotSendMessagesToUser = 50007,
  CannotSendMessagesInNonTextChannel = 50008,
  ChannelVerificationTooHigh = 50009,
  Oauth2ApplicationNoBot = 50010,
  Oauth2ApplicationLimitReached = 50011,
  InvalidOAuth2State = 50012,
  MissingPermissions = 50013,
  InvalidAuthenticationToken = 50014,
  NoteTooLong = 50015,
  InvalidMessageDeleteCount = 50016,
  InvalidMfaLevel = 50017,
  InvalidPinChannel = 50019,
  InviteCodeInvalidOrTaken = 50020,
  CannotExecuteOnSystemMessage = 50021,
  InvalidChannelType = 50024,
  InvalidOAuth2AccessToken = 50025,
  MissingOAuth2Scope = 50026,
  InvalidWebhookToken = 50027,
  InvalidRole = 50028,
  InvalidRecipients = 50033,
  MessageTooOldForBulkDelete = 50034,
  InvalidFormBody = 50035,
  InviteAcceptedToNonBotGuild = 50036,
  InvalidActivityAction = 50039,
  InvalidApiVersion = 50041,
  FileUploadTooBig = 50045,
  InvalidFileUploaded = 50046,
  CannotSelfRedeemGift = 50054,
  InvalidGuild = 50055,
  InvalidSku = 50057,
  InvalidRequestOrigin = 50067,
  InvalidMessageType = 50068,
  PaymentSourceRequired = 50070,
  CannotModifySystemWebhook = 50073,
  CannotDeleteRequiredChannel = 50074,
  CannotEditMessageStickers = 50080,
  InvalidStickerSent = 50081,
  CannotPerformActionOnArchivedThread = 50083,
  InvalidThreadNotificationSettings = 50084,
  BeforeValueTooOld = 50085,
  CommunityChannelsMustBeTextChannels = 50086,
  EventEntityTypeMismatch = 50091,
  ServerNotAvailableInLocation = 50095,
  ServerNeedsMonetization = 50097,
  ServerNeedsMoreBoosts = 50101,
  InvalidRequestBodyJson = 50109,
  InvalidFile = 50110,
  InvalidFileType = 50123,
  FileDurationTooLong = 50124,
  OwnerCannotBePending = 50131,
  OwnershipCannotBeTransferredToBot = 50132,
  FailedToResizeAsset = 50138,
  CannotMixSubscriptionEmojis = 50144,
  CannotConvertEmojis = 50145,
  UploadedFileNotFound = 50146,
  InvalidEmoji = 50151,
  VoiceMessagesNoAdditionalContent = 50159,
  VoiceMessagesMustHaveAudio = 50160,
  VoiceMessagesMustHaveMetadata = 50161,
  VoiceMessagesCannotBeEdited = 50162,
  CannotDeleteGuildSubscription = 50163,
  CannotSendVoiceMessages = 50173,
  AccountMustBeVerified = 50178,
  InvalidFileDuration = 50192,
  NoStickerPermission = 50600,
  TwoFactorRequired = 60003,
  NoUsersWithDiscordTag = 80004,
  ReactionBlocked = 90001,
  UserCannotUseBurstReactions = 90002,
  ApplicationNotAvailable = 110001,
  ApiResourceOverloaded = 130000,
  StageAlreadyOpen = 150006,
  CannotReplyWithoutReadHistory = 160002,
  ThreadAlreadyCreated = 160004,
  ThreadLocked = 160005,
  MaxActiveThreadsReached = 160006,
  MaxActiveAnnouncementThreadsReached = 160007,
  InvalidLottieJson = 170001,
  LottieCannotContainRasterImages = 170002,
  StickerMaxFramerateExceeded = 170003,
  StickerMaxFramesExceeded = 170004,
  LottieDimensionsExceeded = 170005,
  StickerFrameRateInvalid = 170006,
  StickerAnimationDurationExceeded = 170007,
  CannotUpdateFinishedEvent = 180000,
  FailedToCreateStageEvent = 180002,
  MessageBlockedByAutomod = 200000,
  TitleBlockedByAutomod = 200001,
  WebhookForumThreadNameRequired = 220001,
  WebhookForumThreadConflict = 220002,
  WebhooksCanOnlyCreateForumThreads = 220003,
  WebhookServicesNotAllowedInForums = 220004,
  MessageBlockedByHarmfulLinks = 240000,
  CannotEnableOnboarding = 350000,
  CannotUpdateOnboarding = 350001,
  FailedToBanUsers = 500000,
  PollVotingBlocked = 520000,
  PollExpired = 520001,
  InvalidPollChannel = 520002,
  CannotEditPoll = 520003,
  CannotUsePollEmoji = 520004,
  CannotExpireNonPoll = 520006,
}
