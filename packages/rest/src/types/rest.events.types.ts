import type { Dispatcher } from "undici";

/**
 * Base interface for all REST events
 */
export interface RestEventBase {
  /** Timestamp when the event occurred (ISO string) */
  timestamp: string;

  /** Unique identifier for this request */
  requestId: string;

  /** Unique identifier for correlating related events */
  correlationId?: string;
}

/**
 * Base interface for HTTP request-related events
 */
export interface HttpRequestEventBase extends RestEventBase {
  /** Request path */
  path: string;

  /** HTTP method used */
  method: Dispatcher.HttpMethod;

  /** Request headers */
  headers: Record<string, string>;
}

/**
 * Event emitted when an HTTP request is initiated
 */
export type RequestStartEvent = HttpRequestEventBase;

/**
 * Event emitted when an HTTP request completes
 */
export interface RequestCompleteEvent extends HttpRequestEventBase {
  /** HTTP status code received */
  statusCode: number;

  /** Response headers */
  responseHeaders: Record<string, string>;

  /** Request duration in milliseconds */
  duration: number;

  /** Size of the response in bytes */
  responseSize?: number;
}

/**
 * Event emitted when an HTTP request fails
 */
export interface RequestFailureEvent extends HttpRequestEventBase {
  /** Error object or message */
  error: Error;

  /** HTTP status code if available */
  statusCode?: number;

  /** Response headers if available */
  responseHeaders?: Record<string, string>;

  /** Request duration in milliseconds */
  duration: number;
}

/**
 * Base interface for rate limit related events
 */
export interface RateLimitEventBase extends RestEventBase {
  /** Rate limit bucket hash or identifier */
  bucketId: string;

  /** Route associated with this rate limit */
  route?: string;

  /** HTTP method associated with this rate limit */
  method?: Dispatcher.HttpMethod;

  /** Reason for the rate limit being hit */
  reason?: string;
}

/**
 * Event emitted when a rate limit is hit
 */
export interface RateLimitHitEvent extends RateLimitEventBase {
  /** Time in milliseconds until the rate limit resets */
  resetAfter: number;

  /** Global rate limit flag */
  global: boolean;

  /** Retry-After header value if present */
  retryAfter?: number;
}

/**
 * Event emitted when rate limit information is updated
 */
export interface RateLimitUpdateEvent extends RateLimitEventBase {
  /** Remaining requests in the current window */
  remaining: number;

  /** Total allowed requests in the current window */
  limit: number;

  /** Time in milliseconds until the rate limit resets */
  resetAfter: number;

  /** Full reset timestamp in ISO format */
  resetAt: string;
}

/**
 * Event emitted when a rate limit bucket expires
 */
export interface RateLimitExpireEvent extends RateLimitEventBase {
  /** Time in milliseconds the bucket was alive */
  lifespan: number;
}

/**
 * Event emitted when a request retry is attempted
 */
export interface RetryAttemptEvent extends RestEventBase {
  /** Original error that triggered the retry */
  error: Error;

  /** Current retry attempt number (1-based) */
  attemptNumber: number;

  /** Maximum number of attempts configured */
  maxAttempts: number;

  /** Delay in milliseconds before this retry attempt */
  delayMs: number;

  /** The path being requested */
  path: string;

  /** The HTTP method being used */
  method: Dispatcher.HttpMethod;

  /** Reason for the retry */
  reason: string;
}

/**
 * Union of all event types for discrimination
 */
export type RestEvent =
  | RequestStartEvent
  | RequestCompleteEvent
  | RequestFailureEvent
  | RateLimitHitEvent
  | RateLimitUpdateEvent
  | RateLimitExpireEvent
  | RetryAttemptEvent;

/**
 * Map of event names to their corresponding payload types
 */
export interface RestEvents {
  /** Emitted when a request is about to be sent */
  requestStart: [event: RequestStartEvent];

  /** Emitted when a request completes successfully */
  requestComplete: [event: RequestCompleteEvent];

  /** Emitted when a request fails */
  requestFailure: [event: RequestFailureEvent];

  /** Emitted when a rate limit is hit */
  rateLimitHit: [event: RateLimitHitEvent];

  /** Emitted when rate limit information is updated */
  rateLimitUpdate: [event: RateLimitUpdateEvent];

  /** Emitted when a rate limit bucket expires */
  rateLimitExpire: [event: RateLimitExpireEvent];

  /** Emitted when a request retry is attempted */
  retryAttempt: [event: RetryAttemptEvent];
}
