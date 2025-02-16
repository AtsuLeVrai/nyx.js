import type { Dispatcher } from "undici";
import type { FileInput } from "./handlers.type.js";
import type { RetryAttempt } from "./managers.type.js";

export type ImageSize = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;

export interface BaseImageOptions {
  size?: ImageSize;
}

export interface ImageOptions extends BaseImageOptions {
  format?: "png" | "jpeg" | "webp";
}

export interface AnimatedImageOptions extends BaseImageOptions {
  format?: "png" | "jpeg" | "webp" | "gif";
  animated?: boolean;
}

export interface StickerFormatOptions extends BaseImageOptions {
  format?: "png" | "gif" | "json";
  useMediaProxy?: boolean;
}

export interface ApiRequestOptions extends Dispatcher.RequestOptions {
  files?: FileInput | FileInput[];
  reason?: string;
}

export interface ApiRequest {
  path: string;
  method: string;
  headers: Record<string, string>;
  statusCode: number;
  latency: number;
  timestamp: number;
}

export interface RestEventHandlers {
  debug: (message: string, context?: Record<string, unknown>) => void;
  error: (error: Error | string, context?: Record<string, unknown>) => void;
  requestFinish: (request: ApiRequest) => void;
  retryAttempt: (retry: RetryAttempt) => void;
  rateLimitExceeded: (bucket: string, resetAfter: number) => void;
  bucketExpired: (bucketHash: string) => void;
  bucketCreated: (bucketHash: string, route: string) => void;
  bucketUpdated: (
    bucketHash: string,
    remaining: number,
    resetAfter: number,
  ) => void;
}
