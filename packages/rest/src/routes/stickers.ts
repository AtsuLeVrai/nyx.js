import { Buffer } from "node:buffer";
import { createReadStream } from "node:fs";
import type { Readable } from "node:stream";
import type { RestHttpResponseCodes, Snowflake } from "@nyxjs/core";
import { FormData } from "undici";
import type {
	StickerPackStructure,
	StickerStructure,
} from "../structures/stickers";
import type { RestRequestOptions } from "../types/globals";

/**
 * @see {@link https://discord.com/developers/docs/resources/sticker#modify-guild-sticker-json-params}
 */
export type ModifyGuildStickerJsonParams = Partial<
	Pick<StickerStructure, "description" | "name" | "tags">
>;

/**
 * @see {@link https://discord.com/developers/docs/resources/sticker#create-guild-sticker-form-params}
 */
export type CreateGuildStickerFormParams = Pick<
	StickerStructure,
	"description" | "name" | "tags"
> & {
	/**
	 * The sticker file to upload, must be a PNG, APNG, GIF, or Lottie JSON file, max 512 KiB
	 */
	file: Buffer | Readable | string;
};

/**
 * @see {@link https://discord.com/developers/docs/resources/sticker#create-guild-sticker}
 */
function createGuildSticker(
	guildId: Snowflake,
	form: CreateGuildStickerFormParams,
	reason?: string,
): RestRequestOptions<StickerStructure> {
	const formData = new FormData();
	formData.append("name", form.name);
	formData.append("description", form.description);
	formData.append("tags", form.tags);

	if (typeof form.file === "string") {
		formData.append("file", createReadStream(form.file));
	} else if (Buffer.isBuffer(form.file)) {
		formData.append("file", new Blob([form.file]));
	} else {
		formData.append("file", form.file);
	}

	return {
		method: "POST",
		path: `/guilds/${guildId}/stickers`,
		body: formData,
		headers: {
			"Content-Type": "multipart/form-data",
			...(reason && { "X-Audit-Log-Reason": reason }),
		},
	};
}

/**
 * @see {@link https://discord.com/developers/docs/resources/sticker#list-sticker-packs-response-structure}
 */
export type ListStickerPacksResponse = {
	/**
	 * Array of sticker pack objects
	 */
	sticker_packs: StickerPackStructure[];
};

export const StickerRoutes = {
	/**
	 * @see {@link https://discord.com/developers/docs/resources/sticker#delete-guild-sticker}
	 */
	deleteGuildSticker: (
		guildId: Snowflake,
		stickerId: Snowflake,
		reason?: string,
	): RestRequestOptions<RestHttpResponseCodes.NoContent> => ({
		method: "DELETE",
		path: `/guilds/${guildId}/stickers/${stickerId}`,
		headers: { ...(reason && { "X-Audit-Log-Reason": reason }) },
	}),
	/**
	 * @see {@link https://discord.com/developers/docs/resources/sticker#modify-guild-sticker}
	 */
	modifyGuildSticker: (
		guildId: Snowflake,
		stickerId: Snowflake,
		json: ModifyGuildStickerJsonParams,
		reason?: string,
	): RestRequestOptions<StickerStructure> => ({
		method: "PATCH",
		path: `/guilds/${guildId}/stickers/${stickerId}`,
		body: JSON.stringify(json),
		headers: { ...(reason && { "X-Audit-Log-Reason": reason }) },
	}),
	createGuildSticker,
	/**
	 * @see {@link https://discord.com/developers/docs/resources/sticker#get-guild-sticker}
	 */
	getGuildSticker: (
		guildId: Snowflake,
		stickerId: string,
	): RestRequestOptions<StickerStructure> => ({
		method: "GET",
		path: `/guilds/${guildId}/stickers/${stickerId}`,
	}),
	/**
	 * @see {@link https://discord.com/developers/docs/resources/sticker#list-guild-stickers}
	 */
	listGuildStickers: (
		guildId: Snowflake,
	): RestRequestOptions<StickerStructure[]> => ({
		method: "GET",
		path: `/guilds/${guildId}/stickers`,
	}),
	/**
	 * @see {@link https://discord.com/developers/docs/resources/sticker#get-sticker-pack}
	 */
	getStickerPack: (
		stickerPackId: Snowflake,
	): RestRequestOptions<StickerPackStructure> => ({
		method: "GET",
		path: `/sticker-packs/${stickerPackId}`,
	}),
	/**
	 * @see {@link https://discord.com/developers/docs/resources/sticker#list-sticker-packs}
	 */
	listStickerPacks: (): RestRequestOptions<ListStickerPacksResponse> => ({
		method: "GET",
		path: "/sticker-packs",
	}),
	/**
	 * @see {@link https://discord.com/developers/docs/resources/sticker#get-sticker}
	 */
	getSticker: (stickerId: Snowflake): RestRequestOptions<StickerStructure> => ({
		method: "GET",
		path: `/stickers/${stickerId}`,
	}),
};
