import { setTimeout } from "node:timers/promises";
import { EventEmitter } from "eventemitter3";
import pQueue from "p-queue";
import type { z } from "zod";
import { fromError } from "zod-validation-error";
import { HttpError, RateLimitError } from "../errors/index.js";
import { RouterFactory } from "../factory/index.js";
import { RateLimiterManager } from "../managers/index.js";
import { RestOptions } from "../options/index.js";
import type {
  ApplicationCommandRouter,
  ApplicationConnectionRouter,
  ApplicationRouter,
  AuditLogRouter,
  AutoModerationRouter,
  ChannelRouter,
  EmojiRouter,
  EntitlementRouter,
  GatewayRouter,
  GuildRouter,
  GuildTemplateRouter,
  InteractionRouter,
  InviteRouter,
  MessageRouter,
  OAuth2Router,
  PollRouter,
  ScheduledEventRouter,
  SkuRouter,
  SoundboardRouter,
  StageInstanceRouter,
  StickerRouter,
  SubscriptionRouter,
  UserRouter,
  VoiceRouter,
  WebhookRouter,
} from "../routes/index.js";
import { HttpService } from "../services/index.js";
import type { RequestOptions, RestEvents } from "../types/index.js";

export const REST_FORWARDED_EVENTS: Array<keyof RestEvents> = [
  "debug",
  "error",
  "request",
  "rateLimited",
  "bucketCreated",
  "bucketDeleted",
];

export class Rest extends EventEmitter<RestEvents> {
  readonly queue: pQueue;
  readonly http: HttpService;
  readonly rateLimiter: RateLimiterManager;
  readonly routers: RouterFactory;
  readonly options: z.output<typeof RestOptions>;
  readonly #eventCleanup: () => void;

  constructor(options: z.input<typeof RestOptions>) {
    super();

    try {
      this.options = RestOptions.parse(options);
    } catch (error) {
      throw new Error(fromError(error).message);
    }

    this.queue = new pQueue(this.options);
    this.rateLimiter = new RateLimiterManager(this.options);
    this.http = new HttpService(this.options);
    this.routers = new RouterFactory(this);

    this.#eventCleanup = this.#forward([this.rateLimiter, this.http], this);
    this.queue.on("error", (error) => this.emit("error", error));
  }

  get applications(): ApplicationRouter {
    return this.routers.getRouter("applications");
  }

  get commands(): ApplicationCommandRouter {
    return this.routers.getRouter("commands");
  }

  get connections(): ApplicationConnectionRouter {
    return this.routers.getRouter("connections");
  }

  get guilds(): GuildRouter {
    return this.routers.getRouter("guilds");
  }

  get channels(): ChannelRouter {
    return this.routers.getRouter("channels");
  }

  get invites(): InviteRouter {
    return this.routers.getRouter("invites");
  }

  get templates(): GuildTemplateRouter {
    return this.routers.getRouter("templates");
  }

  get users(): UserRouter {
    return this.routers.getRouter("users");
  }

  get auditLogs(): AuditLogRouter {
    return this.routers.getRouter("auditLogs");
  }

  get messages(): MessageRouter {
    return this.routers.getRouter("messages");
  }

  get interactions(): InteractionRouter {
    return this.routers.getRouter("interactions");
  }

  get emojis(): EmojiRouter {
    return this.routers.getRouter("emojis");
  }

  get stickers(): StickerRouter {
    return this.routers.getRouter("stickers");
  }

  get voice(): VoiceRouter {
    return this.routers.getRouter("voice");
  }

  get soundboards(): SoundboardRouter {
    return this.routers.getRouter("soundboards");
  }

  get stages(): StageInstanceRouter {
    return this.routers.getRouter("stages");
  }

  get scheduledEvents(): ScheduledEventRouter {
    return this.routers.getRouter("scheduledEvents");
  }

  get polls(): PollRouter {
    return this.routers.getRouter("polls");
  }

  get autoModeration(): AutoModerationRouter {
    return this.routers.getRouter("autoModeration");
  }

  get webhooks(): WebhookRouter {
    return this.routers.getRouter("webhooks");
  }

  get oauth2(): OAuth2Router {
    return this.routers.getRouter("oauth2");
  }

  get gateway(): GatewayRouter {
    return this.routers.getRouter("gateway");
  }

  get skus(): SkuRouter {
    return this.routers.getRouter("skus");
  }

  get entitlements(): EntitlementRouter {
    return this.routers.getRouter("entitlements");
  }

  get subscriptions(): SubscriptionRouter {
    return this.routers.getRouter("subscriptions");
  }

  get<T>(
    path: string,
    options: Omit<RequestOptions, "method" | "path"> = {},
  ): Promise<T> {
    return this.request<T>({
      ...options,
      method: "GET",
      path,
    });
  }

  post<T>(
    path: string,
    options: Omit<RequestOptions, "method" | "path"> = {},
  ): Promise<T> {
    return this.request<T>({
      ...options,
      method: "POST",
      path,
    });
  }

  put<T>(
    path: string,
    options: Omit<RequestOptions, "method" | "path"> = {},
  ): Promise<T> {
    return this.request<T>({
      ...options,
      method: "PUT",
      path,
    });
  }

  patch<T>(
    path: string,
    options: Omit<RequestOptions, "method" | "path"> = {},
  ): Promise<T> {
    return this.request<T>({
      ...options,
      method: "PATCH",
      path,
    });
  }

  delete<T>(
    path: string,
    options: Omit<RequestOptions, "method" | "path"> = {},
  ): Promise<T> {
    return this.request<T>({
      ...options,
      method: "DELETE",
      path,
    });
  }

  destroy(): void {
    this.rateLimiter.reset();
    this.queue.clear();
    this.#eventCleanup();
    this.removeAllListeners();
  }

  request<T>(options: RequestOptions): Promise<T> {
    return this.queue.add<T>(
      async () => {
        let attempt = 0;
        while (true) {
          try {
            this.rateLimiter.checkRateLimit(options.path, options.method);

            const response = await this.http.request<T>(options);

            this.rateLimiter.updateRateLimit(
              options.path,
              options.method,
              response.latency,
              response.headers,
              response.statusCode,
            );

            return response.data;
          } catch (error) {
            attempt++;
            await this.#handleRequestError(
              error,
              attempt,
              this.options.maxRetries,
            );
          }
        }
      },
      {
        priority: this.#getPriority(options),
      },
    ) as Promise<T>;
  }

  #getPriority(options: RequestOptions): number {
    if (options.method === "GET") {
      return 0;
    }

    if (options.method === "POST") {
      return 1;
    }

    if (options.method === "PUT" || options.method === "PATCH") {
      return 2;
    }

    return 3;
  }

  async #handleRequestError(
    error: unknown,
    attempt: number,
    maxRetries: number,
  ): Promise<void> {
    if (error instanceof RateLimitError) {
      await this.#handleRateLimitError(error);
      return;
    }

    if (error instanceof HttpError && error.retryable && attempt < maxRetries) {
      await this.#handleRetryableError(error, attempt);
      return;
    }

    this.emit("error", "Request failed", {
      attempt,
      error: error instanceof Error ? error.message : "Unknown error",
    });

    throw error;
  }

  async #handleRateLimitError(error: RateLimitError): Promise<void> {
    if (error.retryable) {
      const delay = error.getRetryDelay();
      await setTimeout(delay);
      return;
    }

    throw error;
  }

  async #handleRetryableError(
    error: HttpError,
    attempt: number,
  ): Promise<void> {
    const backoff = this.#calculateBackoff(attempt);

    this.emit("debug", "Retrying failed request", {
      attempt,
      backoff,
      status: error.status,
      code: error.code,
    });

    await setTimeout(backoff);
  }

  #calculateBackoff(attempt: number): number {
    const baseDelay = Math.min(1000 * 2 ** attempt, 30000);
    const jitter = Math.random() * 1000;
    return baseDelay + jitter;
  }

  #forward<T extends EventEmitter<RestEvents>>(
    from: T | T[],
    to: EventEmitter<RestEvents>,
  ): () => void {
    const sources = Array.isArray(from) ? from : [from];
    const cleanups: Array<() => void> = [];

    for (const source of sources) {
      for (const event of REST_FORWARDED_EVENTS) {
        const handler = (...args: unknown[]): boolean =>
          to.emit(event, ...(args as never));
        source.on(event, handler);
        cleanups.push(() => source.off(event, handler));
      }
    }

    return (): void => {
      for (const cleanup of cleanups) {
        cleanup();
      }
    };
  }
}
