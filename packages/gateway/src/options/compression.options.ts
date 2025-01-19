import { z } from "zod";
import { CompressionType } from "../types/index.js";

export const CompressionOptions = z.object({
  compressionType: z.nativeEnum(CompressionType).optional(),
  zlibChunkSize: z
    .number()
    .int()
    .default(128 * 1024),
  zlibWindowBits: z.number().int().default(15),
  zlibFlushBytes: z
    .instanceof(Buffer)
    .default(Buffer.from([0x00, 0x00, 0xff, 0xff])),
  maxChunksInMemory: z.number().int().default(1000),
  autoCleanChunks: z.boolean().default(true),
  maxChunkSize: z
    .number()
    .int()
    .default(1024 * 1024),
  validateBuffers: z.boolean().default(true),
});
