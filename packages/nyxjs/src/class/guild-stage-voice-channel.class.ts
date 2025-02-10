import {
  BitFieldManager,
  type ChannelFlags,
  type ChannelType,
  GuildStageVoiceChannelEntity,
  type OverwriteEntity,
  type Snowflake,
  type VideoQualityMode,
} from "@nyxjs/core";
import { z } from "zod";
import { fromError } from "zod-validation-error";

export class GuildStageVoiceChannel {
  readonly #data: GuildStageVoiceChannelEntity;
  readonly #flags: BitFieldManager<ChannelFlags>;

  constructor(
    data: Partial<z.input<typeof GuildStageVoiceChannelEntity>> = {},
  ) {
    try {
      this.#data = GuildStageVoiceChannelEntity.parse(data);
    } catch (error) {
      throw new Error(fromError(error).message);
    }

    this.#flags = new BitFieldManager(this.#data.flags);
  }

  get id(): Snowflake {
    return this.#data.id;
  }

  get type(): ChannelType.GuildStageVoice {
    return this.#data.type;
  }

  get guildId(): Snowflake {
    return this.#data.guild_id;
  }

  get position(): number | null {
    return this.#data.position ?? null;
  }

  get permissionOverwrites(): OverwriteEntity[] | null {
    return this.#data.permission_overwrites ?? null;
  }

  get name(): string | null {
    return this.#data.name ?? null;
  }

  get topic(): string | null {
    return this.#data.topic ?? null;
  }

  get nsfw(): boolean {
    return Boolean(this.#data.nsfw);
  }

  get bitrate(): number {
    return this.#data.bitrate;
  }

  get userLimit(): number {
    return this.#data.user_limit;
  }

  get rateLimitPerUser(): number | null {
    return this.#data.rate_limit_per_user ?? null;
  }

  get parentId(): Snowflake | null {
    return this.#data.parent_id ?? null;
  }

  get lastPinTimestamp(): string | null {
    return this.#data.last_pin_timestamp ?? null;
  }

  get rtcRegion(): string | null {
    return this.#data.rtc_region ?? null;
  }

  get videoQualityMode(): VideoQualityMode | null {
    return this.#data.video_quality_mode ?? null;
  }

  get permissions(): string | null {
    return this.#data.permissions ?? null;
  }

  get flags(): BitFieldManager<ChannelFlags> {
    return this.#flags;
  }

  get totalMessageSent(): number | null {
    return this.#data.total_message_sent ?? null;
  }

  toJson(): GuildStageVoiceChannelEntity {
    return { ...this.#data };
  }

  clone(): GuildStageVoiceChannel {
    return new GuildStageVoiceChannel(this.toJson());
  }

  validate(): boolean {
    try {
      GuildStageVoiceChannelSchema.parse(this.toJson());
      return true;
    } catch {
      return false;
    }
  }

  merge(other: Partial<GuildStageVoiceChannelEntity>): GuildStageVoiceChannel {
    return new GuildStageVoiceChannel({ ...this.toJson(), ...other });
  }

  equals(other: GuildStageVoiceChannel): boolean {
    return JSON.stringify(this.#data) === JSON.stringify(other.toJson());
  }
}

export const GuildStageVoiceChannelSchema = z.instanceof(
  GuildStageVoiceChannel,
);
