import type { Buffer } from "node:buffer";
import type { Inflate } from "zlib-sync";
import { Z_SYNC_FLUSH } from "zlib-sync";

/**
 * Decompresses zlib-compressed data using the provided Inflate object.
 *
 * @param data - The compressed data as a Buffer.
 * @param zlibInflate - An Inflate object from zlib-sync for decompression.
 * @returns A Promise that resolves with the decompressed data as a Buffer or string.
 * @throws Will throw an error if decompression fails.
 */
export async function decompressZlib(data: Buffer, zlibInflate: Inflate): Promise<Buffer | string> {
    return new Promise((resolve, reject) => {
        zlibInflate.push(data, Z_SYNC_FLUSH);

        if (zlibInflate.err < 0) {
            reject(new Error("Failed to decompress zlib data"));
        }

        const result = zlibInflate.result;
        if (result) {
            try {
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }
    });
}