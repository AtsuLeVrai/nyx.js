import type {
  Snowflake,
  VoiceRegionEntity,
  VoiceStateEntity,
} from "@nyxjs/core";
import { fromZodError } from "zod-validation-error";
import type { Rest } from "../rest.js";
import {
  ModifyCurrentUserVoiceStateEntity,
  ModifyUserVoiceStateEntity,
} from "../schemas/index.js";
import type { HttpResponse } from "../types/index.js";

export class VoiceRouter {
  static readonly ROUTES = {
    voiceRegions: "/voice/regions" as const,
    currentUserVoiceState: (guildId: Snowflake) =>
      `/guilds/${guildId}/voice-states/@me` as const,
    userVoiceState: (guildId: Snowflake, userId: Snowflake) =>
      `/guilds/${guildId}/voice-states/${userId}` as const,
  } as const;

  #rest: Rest;

  constructor(rest: Rest) {
    this.#rest = rest;
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/voice#list-voice-regions}
   */
  listVoiceRegions(): Promise<HttpResponse<VoiceRegionEntity[]>> {
    return this.#rest.get(VoiceRouter.ROUTES.voiceRegions);
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/voice#get-current-user-voice-state}
   */
  getCurrentUserVoiceState(
    guildId: Snowflake,
  ): Promise<HttpResponse<VoiceStateEntity>> {
    return this.#rest.get(VoiceRouter.ROUTES.currentUserVoiceState(guildId));
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/voice#get-user-voice-state}
   */
  getUserVoiceState(
    guildId: Snowflake,
    userId: Snowflake,
  ): Promise<HttpResponse<VoiceStateEntity>> {
    return this.#rest.get(VoiceRouter.ROUTES.userVoiceState(guildId, userId));
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/voice#modify-current-user-voice-state}
   */
  modifyCurrentUserVoiceState(
    guildId: Snowflake,
    options: ModifyCurrentUserVoiceStateEntity,
  ): Promise<HttpResponse<void>> {
    const result = ModifyCurrentUserVoiceStateEntity.safeParse(options);
    if (!result.success) {
      const validationError = fromZodError(result.error);
      throw new Error(validationError.message);
    }

    return this.#rest.patch(VoiceRouter.ROUTES.currentUserVoiceState(guildId), {
      body: JSON.stringify(result.data),
    });
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/voice#modify-user-voice-state}
   */
  modifyUserVoiceState(
    guildId: Snowflake,
    userId: Snowflake,
    options: ModifyUserVoiceStateEntity,
  ): Promise<HttpResponse<void>> {
    const result = ModifyUserVoiceStateEntity.safeParse(options);
    if (!result.success) {
      const validationError = fromZodError(result.error);
      throw new Error(validationError.message);
    }

    return this.#rest.patch(
      VoiceRouter.ROUTES.userVoiceState(guildId, userId),
      {
        body: JSON.stringify(result.data),
      },
    );
  }
}
