import type { Snowflake, StickerEntity, StickerPackEntity } from "@nyxjs/core";
import { BaseRouter } from "../base/index.js";
import {
  type CreateGuildStickerEntity,
  CreateGuildStickerSchema,
  type ListStickerPacksResponseEntity,
  type ModifyGuildStickerEntity,
  ModifyGuildStickerSchema,
} from "../schemas/index.js";

export class StickerRouter extends BaseRouter {
  static readonly ROUTES = {
    stickerPacks: "/sticker-packs" as const,
    sticker: (stickerId: Snowflake) => `/stickers/${stickerId}` as const,
    stickerPack: (packId: Snowflake) => `/sticker-packs/${packId}` as const,
    guildStickers: (guildId: Snowflake) =>
      `/guilds/${guildId}/stickers` as const,
    guildSticker: (guildId: Snowflake, stickerId: Snowflake) =>
      `/guilds/${guildId}/stickers/${stickerId}` as const,
  } as const;

  /**
   * @see {@link https://discord.com/developers/docs/resources/sticker#get-sticker}
   */
  getSticker(stickerId: Snowflake): Promise<StickerEntity> {
    return this.get(StickerRouter.ROUTES.sticker(stickerId));
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/sticker#list-sticker-packs}
   */
  listStickerPacks(): Promise<ListStickerPacksResponseEntity> {
    return this.get(StickerRouter.ROUTES.stickerPacks);
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/sticker#get-sticker-pack}
   */
  getStickerPack(packId: Snowflake): Promise<StickerPackEntity> {
    return this.get(StickerRouter.ROUTES.stickerPack(packId));
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/sticker#list-guild-stickers}
   */
  listGuildStickers(guildId: Snowflake): Promise<StickerEntity[]> {
    return this.get(StickerRouter.ROUTES.guildStickers(guildId));
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/sticker#get-guild-sticker}
   */
  getGuildSticker(
    guildId: Snowflake,
    stickerId: Snowflake,
  ): Promise<StickerEntity> {
    return this.get(StickerRouter.ROUTES.guildSticker(guildId, stickerId));
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/sticker#create-guild-sticker}
   */
  createGuildSticker(
    guildId: Snowflake,
    options: CreateGuildStickerEntity,
    reason?: string,
  ): Promise<StickerEntity> {
    const result = CreateGuildStickerSchema.safeParse(options);
    if (!result.success) {
      throw new Error(
        result.error.errors
          .map((e) => `[${e.path.join(".")}] ${e.message}`)
          .join(", "),
      );
    }

    const { file, ...rest } = result.data;
    return this.post(StickerRouter.ROUTES.guildStickers(guildId), {
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
    options: ModifyGuildStickerEntity,
    reason?: string,
  ): Promise<StickerEntity> {
    const result = ModifyGuildStickerSchema.safeParse(options);
    if (!result.success) {
      throw new Error(
        result.error.errors
          .map((e) => `[${e.path.join(".")}] ${e.message}`)
          .join(", "),
      );
    }

    return this.patch(StickerRouter.ROUTES.guildSticker(guildId, stickerId), {
      body: JSON.stringify(result.data),
      reason,
    });
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/sticker#delete-guild-sticker}
   */
  deleteGuildSticker(
    guildId: Snowflake,
    stickerId: Snowflake,
    reason?: string,
  ): Promise<void> {
    return this.delete(StickerRouter.ROUTES.guildSticker(guildId, stickerId), {
      reason,
    });
  }
}
