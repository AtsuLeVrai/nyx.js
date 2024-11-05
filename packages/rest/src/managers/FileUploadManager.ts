import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { basename, extname } from "node:path";
import { MimeTypes } from "@nyxjs/core";
import FormData from "form-data";

/**
 * @see {@link https://discord.com/developers/docs/reference#signed-attachment-cdn-urls-attachment-cdn-url-parameters}
 */
export type AttachmentCdnUrlParameters = {
    /**
     * Hex timestamp indicating when an attachment CDN URL will expire
     */
    ex: string;
    /**
     * Unique signature that remains valid until the URL's expiration
     */
    hm: string;
    /**
     * Hex timestamp indicating when the URL was issued
     */
    is: string;
};

export class FileUploadManager {
    readonly #formData: FormData = new FormData();

    readonly #fileLimit: number;

    constructor(fileLimit: number = 25 * 1_024 * 1_024) {
        this.#fileLimit = fileLimit;
    }

    getHeaders(additionalHeaders?: Record<string, unknown>): Record<string, string> {
        return this.#formData.getHeaders(additionalHeaders);
    }

    getFormData(): FormData {
        return this.#formData;
    }

    toBuffer(): Buffer {
        return this.#formData.getBuffer();
    }

    createAttachmentUrl(file: string): string {
        return `attachment://${file}`;
    }

    addField(name: string, value: string): void {
        this.#formData.append(name, value);
    }

    addPayload(payload: Record<string, unknown>): void {
        this.#formData.append("payload_json", JSON.stringify(payload), {
            contentType: MimeTypes.Json,
        });
    }

    async addFiles(files: string[] | string): Promise<void> {
        if (Array.isArray(files)) {
            await Promise.all(files.map(async (file, index) => this.#processFile(file, index)));
        } else {
            await this.#processFile(files);
        }
    }

    async #processFile(file: string, index?: number): Promise<void> {
        const fileStats = await stat(file);
        if (fileStats.size > this.#fileLimit) {
            throw new Error(`File size exceeds the limit of ${this.#fileLimit / (1_024 * 1_024)} MiB`);
        }

        const filename = basename(file);
        const contentType = this.#getMimeType(filename);
        const fieldName = index === undefined ? "file" : `files[${index}]`;
        this.#formData.append(fieldName, createReadStream(file), {
            filename,
            contentType,
        });
    }

    #getMimeType(filename: string): MimeTypes {
        const extension = extname(filename).slice(1);
        switch (extension) {
            case "png": {
                return MimeTypes.Png;
            }

            case "jpg": {
                return MimeTypes.Jpeg;
            }

            case "jpeg": {
                return MimeTypes.Jpeg;
            }

            case "gif": {
                return MimeTypes.Gif;
            }

            case "webp": {
                return MimeTypes.Webp;
            }

            default: {
                return MimeTypes.Bin;
            }
        }
    }
}
