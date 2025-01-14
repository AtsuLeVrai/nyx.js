import type { Snowflake, StickerEntity, StickerPackEntity } from "@nyxjs/core";
import type { z } from "zod";
import { fromZodError } from "zod-validation-error";
import type { Rest } from "../rest.js";
import {
  CreateGuildStickerEntity,
  type ListStickerPacksResponseEntity,
  ModifyGuildStickerEntity,
} from "../schemas/index.js";
import type { HttpResponse } from "../types/index.js";

export class StickerRouter {
  static readonly ROUTES = {
    stickerPacks: "/sticker-packs" as const,
    sticker: (stickerId: Snowflake) => `/stickers/${stickerId}` as const,
    stickerPack: (packId: Snowflake) => `/sticker-packs/${packId}` as const,
    guildStickers: (guildId: Snowflake) =>
      `/guilds/${guildId}/stickers` as const,
    guildSticker: (guildId: Snowflake, stickerId: Snowflake) =>
      `/guilds/${guildId}/stickers/${stickerId}` as const,
  } as const;

  #rest: Rest;

  constructor(rest: Rest) {
    this.#rest = rest;
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/sticker#get-sticker}
   */
  getSticker(stickerId: Snowflake): Promise<HttpResponse<StickerEntity>> {
    return this.#rest.get(StickerRouter.ROUTES.sticker(stickerId));
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/sticker#list-sticker-packs}
   */
  listStickerPacks(): Promise<HttpResponse<ListStickerPacksResponseEntity>> {
    return this.#rest.get(StickerRouter.ROUTES.stickerPacks);
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/sticker#get-sticker-pack}
   */
  getStickerPack(packId: Snowflake): Promise<HttpResponse<StickerPackEntity>> {
    return this.#rest.get(StickerRouter.ROUTES.stickerPack(packId));
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/sticker#list-guild-stickers}
   */
  listGuildStickers(
    guildId: Snowflake,
  ): Promise<HttpResponse<StickerEntity[]>> {
    return this.#rest.get(StickerRouter.ROUTES.guildStickers(guildId));
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/sticker#get-guild-sticker}
   */
  getGuildSticker(
    guildId: Snowflake,
    stickerId: Snowflake,
  ): Promise<HttpResponse<StickerEntity>> {
    return this.#rest.get(
      StickerRouter.ROUTES.guildSticker(guildId, stickerId),
    );
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/sticker#create-guild-sticker}
   */
  createGuildSticker(
    guildId: Snowflake,
    options: z.input<typeof CreateGuildStickerEntity>,
    reason?: string,
  ): Promise<HttpResponse<StickerEntity>> {
    const result = CreateGuildStickerEntity.safeParse(options);
    if (!result.success) {
      throw new Error(fromZodError(result.error).message);
    }

    const { file, ...rest } = result.data;
    return this.#rest.post(StickerRouter.ROUTES.guildStickers(guildId), {
      body: JSON.stringify(rest),
      files: file,
      reason,
    });
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/sticker#modify-guild-sticker}
   */
  modifyGuildSticker(
    guildId: Snowflake,
    stickerId: Snowflake,
    options: z.input<typeof ModifyGuildStickerEntity>,
    reason?: string,
  ): Promise<HttpResponse<StickerEntity>> {
    const result = ModifyGuildStickerEntity.safeParse(options);
    if (!result.success) {
      throw new Error(fromZodError(result.error).message);
    }

    return this.#rest.patch(
      StickerRouter.ROUTES.guildSticker(guildId, stickerId),
      {
        body: JSON.stringify(result.data),
        reason,
      },
    );
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/sticker#delete-guild-sticker}
   */
  deleteGuildSticker(
    guildId: Snowflake,
    stickerId: Snowflake,
    reason?: string,
  ): Promise<HttpResponse<void>> {
    return this.#rest.delete(
      StickerRouter.ROUTES.guildSticker(guildId, stickerId),
      {
        reason,
      },
    );
  }
}
