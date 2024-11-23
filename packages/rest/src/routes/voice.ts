import type {
  Snowflake,
  VoiceRegionEntity,
  VoiceStateEntity,
} from "@nyxjs/core";
import type { Rest } from "../core/index.js";

interface ModifyCurrentVoiceStateOptions {
  channel_id?: Snowflake;
  suppress?: boolean;
  request_to_speak_timestamp?: string | null;
}

interface ModifyUserVoiceStateOptions {
  channel_id: Snowflake;
  suppress?: boolean;
}

export class VoiceRoutes {
  static routes = {
    base: "/voice",
    regions: "/voice/regions",
    guildVoiceState: (
      guildId: Snowflake,
    ): `/guilds/${Snowflake}/voice-states/@me` => {
      return `/guilds/${guildId}/voice-states/@me` as const;
    },
    userVoiceState: (
      guildId: Snowflake,
      userId: Snowflake,
    ): `/guilds/${Snowflake}/voice-states/${Snowflake}` => {
      return `/guilds/${guildId}/voice-states/${userId}` as const;
    },
  } as const;

  readonly #rest: Rest;

  constructor(rest: Rest) {
    this.#rest = rest;
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/voice#list-voice-regions}
   */
  getVoiceRegions(): Promise<VoiceRegionEntity[]> {
    return this.#rest.get(VoiceRoutes.routes.regions);
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/voice#get-current-user-voice-state}
   */
  getCurrentVoiceState(guildId: Snowflake): Promise<VoiceStateEntity> {
    return this.#rest.get(VoiceRoutes.routes.guildVoiceState(guildId));
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/voice#get-user-voice-state}
   */
  getUserVoiceState(
    guildId: Snowflake,
    userId: Snowflake,
  ): Promise<VoiceStateEntity> {
    return this.#rest.get(VoiceRoutes.routes.userVoiceState(guildId, userId));
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/voice#modify-current-user-voice-state}
   */
  modifyCurrentVoiceState(
    guildId: Snowflake,
    options: ModifyCurrentVoiceStateOptions,
  ): Promise<void> {
    return this.#rest.patch(VoiceRoutes.routes.guildVoiceState(guildId), {
      body: JSON.stringify(options),
    });
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/voice#modify-user-voice-state}
   */
  modifyUserVoiceState(
    guildId: Snowflake,
    userId: Snowflake,
    options: ModifyUserVoiceStateOptions,
  ): Promise<void> {
    return this.#rest.patch(
      VoiceRoutes.routes.userVoiceState(guildId, userId),
      {
        body: JSON.stringify(options),
      },
    );
  }
}
