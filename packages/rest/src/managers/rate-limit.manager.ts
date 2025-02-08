import { Store } from "@nyxjs/store";
import { RateLimitError } from "../errors/index.js";
import type { RateLimitOptions } from "../options/index.js";
import type { RateLimitBucket, RateLimitScope } from "../types/index.js";

// Type-safe header constants
export const RATE_LIMIT_HEADERS = {
  LIMIT: "x-ratelimit-limit",
  REMAINING: "x-ratelimit-remaining",
  RESET: "x-ratelimit-reset",
  RESET_AFTER: "x-ratelimit-reset-after",
  BUCKET: "x-ratelimit-bucket",
  SCOPE: "x-ratelimit-scope",
  GLOBAL: "x-ratelimit-global",
  RETRY_AFTER: "retry-after",
} as const;

// Route configuration with strong typing
export const ROUTES = {
  PATTERNS: {
    WEBHOOK: /^\/webhooks\/(\d+)\/([A-Za-z0-9-_]+)/,
    EXEMPT: ["/interactions", "/webhooks"] as const,
    MAJOR_PARAMETERS: new Map<RegExp, string>([
      [/^\/guilds\/(\d+)/, "guild_id"],
      [/^\/channels\/(\d+)/, "channel_id"],
      [/^\/webhooks\/(\d+)/, "webhook_id"],
    ]),
    SHARED_BUCKETS: new Map<RegExp, string>([
      [/^\/guilds\/\d+\/emojis/, "emoji"],
      [/^\/channels\/\d+\/messages\/bulk-delete/, "bulk-delete"],
      [/^\/guilds\/\d+\/channels/, "guild-channels"],
      [/^\/guilds\/\d+\/members/, "guild-members"],
    ]),
  },
} as const;

interface RateLimitAttempt {
  count: number;
  lastAttempt: number;
  nextReset: number;
  scope: RateLimitScope;
}

export class RateLimitManager {
  readonly #buckets = new Store<string, RateLimitBucket>();
  readonly #routeBuckets = new Store<string, string>();
  readonly #sharedBuckets = new Store<string, Set<string>>();
  readonly #attempts = new Store<string, RateLimitAttempt>();

  readonly #options: RateLimitOptions;
  readonly #cleanupInterval: NodeJS.Timeout;

  constructor(options: RateLimitOptions) {
    this.#options = options;
    this.#cleanupInterval = this.#startCleanupInterval();
  }

  /**
   * Checks if a request would exceed rate limits
   */
  checkRateLimit(path: string, method: string): void {
    if (this.#isExemptRoute(path)) {
      return;
    }

    const bucket = this.#getBucket(path, method);
    if (bucket) {
      this.#checkBucketLimit(bucket, path, method);
    }
  }

  /**
   * Updates rate limit information based on response headers
   */
  updateRateLimit(
    path: string,
    method: string,
    headers: Record<string, string>,
    statusCode: number,
  ): void {
    const routeKey = this.getRouteKey(method, path);

    if (statusCode === 429) {
      this.#handleRateLimitExceeded(path, method, headers, routeKey);
      return;
    }

    if (statusCode < 400) {
      this.#attempts.delete(routeKey);
    }

    this.#updateBucketInfo(path, method, headers);
  }

  /**
   * Generates a unique key for a route
   */
  getRouteKey(method: string, path: string): string {
    const webhookMatch = path.match(ROUTES.PATTERNS.WEBHOOK);
    if (webhookMatch) {
      return `webhook:${webhookMatch[1]}:${webhookMatch[2]}:${method}`;
    }

    for (const [pattern, identifier] of ROUTES.PATTERNS.SHARED_BUCKETS) {
      if (pattern.test(path)) {
        return `shared:${identifier}`;
      }
    }

    const normalizedPath = this.#normalizePath(path);
    return `${method}:${normalizedPath}`;
  }

  /**
   * Gets current rate limit status for a route
   */
  getRateLimitStatus(
    path: string,
    method: string,
  ): {
    limited: boolean;
    remaining: number;
    resetAfter: number;
    scope: RateLimitScope;
  } {
    const bucket = this.#getBucket(path, method);
    if (!bucket) {
      return {
        limited: false,
        remaining: Number.POSITIVE_INFINITY,
        resetAfter: 0,
        scope: "user",
      };
    }

    const now = Date.now();
    return {
      limited: bucket.remaining <= 0 && bucket.reset > now,
      remaining: bucket.remaining,
      resetAfter: Math.max(0, bucket.reset - now),
      scope: bucket.scope,
    };
  }

  /**
   * Cleans up the manager resources
   */
  destroy(): void {
    clearInterval(this.#cleanupInterval);
    this.#buckets.clear();
    this.#routeBuckets.clear();
    this.#sharedBuckets.clear();
    this.#attempts.clear();
  }

  // Private methods
  #startCleanupInterval(): NodeJS.Timeout {
    return setInterval(
      () => this.#cleanupExpiredLimits(),
      this.#options.cleanupInterval,
    );
  }

  #isExemptRoute(path: string): boolean {
    return ROUTES.PATTERNS.EXEMPT.some((route) => path.startsWith(route));
  }

  #handleRateLimitExceeded(
    path: string,
    method: string,
    headers: Record<string, string>,
    routeKey: string,
  ): void {
    const retryAfter = Number(headers[RATE_LIMIT_HEADERS.RETRY_AFTER]);
    const scope =
      (headers[RATE_LIMIT_HEADERS.SCOPE] as RateLimitScope) ?? "user";
    const isGlobal = headers[RATE_LIMIT_HEADERS.GLOBAL] === "true";

    const attempt = this.#updateRateLimitAttempt(routeKey, retryAfter, scope);

    // Ajuster le retryAfter en fonction du nombre de tentatives
    const adjustedRetryAfter = this.#calculateAdjustedRetryAfter(
      retryAfter,
      attempt.count,
    );

    throw new RateLimitError({
      method,
      path,
      retryAfter: adjustedRetryAfter,
      scope,
      global: isGlobal,
      attempts: attempt.count,
    });
  }

  #calculateAdjustedRetryAfter(baseDelay: number, attempts: number): number {
    // Facteur de base pour l'augmentation exponentielle
    const backoffFactor = Math.min(2 ** (attempts - 1), 8);
    return baseDelay * backoffFactor;
  }

  #updateRateLimitAttempt(
    routeKey: string,
    retryAfter: number,
    scope: RateLimitScope,
  ): RateLimitAttempt {
    const now = Date.now();
    const existing = this.#attempts.get(routeKey);
    const attempt: RateLimitAttempt = {
      count: (existing?.count ?? 0) + 1,
      lastAttempt: now,
      nextReset: now + retryAfter * 1000,
      scope,
    };

    this.#attempts.set(routeKey, attempt);
    return attempt;
  }

  #updateBucketInfo(
    path: string,
    method: string,
    headers: Record<string, string>,
  ): void {
    const bucketHash = headers[RATE_LIMIT_HEADERS.BUCKET];
    if (!bucketHash) {
      return;
    }

    const bucket: RateLimitBucket = {
      hash: bucketHash,
      limit: Number(headers[RATE_LIMIT_HEADERS.LIMIT]),
      remaining: Number(headers[RATE_LIMIT_HEADERS.REMAINING]),
      reset: Number(headers[RATE_LIMIT_HEADERS.RESET]) * 1000,
      resetAfter: Number(headers[RATE_LIMIT_HEADERS.RESET_AFTER]) * 1000,
      scope: (headers[RATE_LIMIT_HEADERS.SCOPE] as RateLimitScope) ?? "user",
      sharedRoute: this.#getSharedRoute(path),
    };

    this.#buckets.set(bucketHash, bucket);
    this.#routeBuckets.set(this.getRouteKey(method, path), bucketHash);

    if (bucket.sharedRoute) {
      this.#linkSharedBucket(bucket.sharedRoute, bucketHash);
    }
  }

  #checkBucketLimit(
    bucket: RateLimitBucket,
    path: string,
    method: string,
  ): void {
    const now = Date.now();

    if (bucket.remaining <= 0 && bucket.reset > now) {
      throw new RateLimitError({
        method,
        path,
        retryAfter: bucket.reset - now,
        scope: bucket.scope,
        bucketHash: bucket.hash,
      });
    }

    if (bucket.remaining === 1) {
      const timeUntilReset = bucket.reset - now;
      if (timeUntilReset < this.#options.safetyMargin) {
        throw new RateLimitError({
          method,
          path,
          retryAfter: this.#options.safetyMargin - timeUntilReset,
          scope: bucket.scope,
          bucketHash: bucket.hash,
        });
      }
    }
  }

  #getBucket(path: string, method: string): RateLimitBucket | undefined {
    const routeKey = this.getRouteKey(method, path);
    const bucketHash = this.#routeBuckets.get(routeKey);
    return bucketHash ? this.#buckets.get(bucketHash) : undefined;
  }

  #normalizePath(path: string): string {
    let normalizedPath = path;
    for (const [regex, param] of ROUTES.PATTERNS.MAJOR_PARAMETERS) {
      const match = path.match(regex);
      if (match) {
        normalizedPath = normalizedPath.replace(
          match[1] as string,
          `{${param}}`,
        );
      }
    }
    return normalizedPath;
  }

  #getSharedRoute(path: string): string | undefined {
    for (const [pattern, identifier] of ROUTES.PATTERNS.SHARED_BUCKETS) {
      if (pattern.test(path)) {
        return identifier;
      }
    }
    return undefined;
  }

  #linkSharedBucket(sharedRoute: string, bucketHash: string): void {
    const buckets = this.#sharedBuckets.get(sharedRoute) ?? new Set();
    buckets.add(bucketHash);
    this.#sharedBuckets.set(sharedRoute, buckets);
  }

  #cleanupExpiredLimits(): void {
    const now = Date.now();
    const activeHashes = new Set<string>();

    // Clean buckets
    for (const [hash, bucket] of this.#buckets.entries()) {
      if (bucket.reset < now) {
        this.#buckets.delete(hash);
      } else {
        activeHashes.add(hash);
      }
    }

    // Clean route mappings
    for (const [route, hash] of this.#routeBuckets.entries()) {
      if (!activeHashes.has(hash)) {
        this.#routeBuckets.delete(route);
      }
    }

    // Clean shared buckets
    for (const [route, hashes] of this.#sharedBuckets.entries()) {
      const validHashes = new Set(
        [...hashes].filter((hash) => activeHashes.has(hash)),
      );
      if (validHashes.size === 0) {
        this.#sharedBuckets.delete(route);
      } else {
        this.#sharedBuckets.set(route, validHashes);
      }
    }

    // Clean attempts
    for (const [route, attempt] of this.#attempts.entries()) {
      if (attempt.nextReset < now) {
        this.#attempts.delete(route);
      }
    }
  }
}
