import type { Snowflake } from "../managers/index.js";

/**
 * Represents the privacy level options for a Stage instance.
 * @see {@link https://github.com/discord/discord-api-docs/blob/main/docs/resources/Stage_Instance.md#privacy-level}
 */
export enum StageInstancePrivacyLevel {
  /**
   * The Stage instance is visible publicly (deprecated).
   * @deprecated This privacy level is deprecated by Discord.
   */
  Public = 1,

  /** The Stage instance is visible to only guild members. */
  GuildOnly = 2,
}

/**
 * Represents a live Stage instance within a Stage channel.
 * A Stage instance holds information about a live stage.
 * @see {@link https://github.com/discord/discord-api-docs/blob/main/docs/resources/Stage_Instance.md#stage-instance-object}
 */
export interface StageInstanceEntity {
  /** The ID of this Stage instance */
  id: Snowflake;

  /** The guild ID of the associated Stage channel */
  guild_id: Snowflake;

  /** The ID of the associated Stage channel */
  channel_id: Snowflake;

  /**
   * The topic of the Stage instance (1-120 characters)
   * @minLength 1
   * @maxLength 120
   */
  topic: string;

  /** The privacy level of the Stage instance */
  privacy_level: StageInstancePrivacyLevel;

  /**
   * Whether or not Stage Discovery is disabled
   * @deprecated This field is deprecated by Discord
   */
  discoverable_disabled: boolean;

  /** The ID of the scheduled event for this Stage instance, if any */
  guild_scheduled_event_id: Snowflake | null;
}
