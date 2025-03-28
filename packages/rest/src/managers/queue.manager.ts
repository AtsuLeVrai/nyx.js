import type { Dispatcher } from "undici";
import type { Rest } from "../core/index.js";
import type { QueueOptions } from "../options/index.js";
import type { ApiRequestOptions, QueueCompleteEvent } from "../types/index.js";

/**
 * Priority levels for queue items
 */
export enum QueuePriority {
  Low = 0,
  Normal = 5,
  High = 10,
}

/**
 * Interface for a queue item
 */
export interface QueueItem<T = unknown> {
  /**
   * Unique ID for this queue item
   */
  id: string;

  /**
   * When this item was added to the queue
   */
  timestamp: number;

  /**
   * API path for the request
   */
  path: string;

  /**
   * HTTP method for the request
   */
  method: Dispatcher.HttpMethod;

  /**
   * Priority level for this item (higher = more important)
   */
  priority: number;

  /**
   * Execute the queued request
   */
  execute: () => Promise<T>;

  /**
   * Resolve callback for the promise
   */
  resolve: (value: T) => void;

  /**
   * Reject callback for the promise
   */
  reject: (reason: unknown) => void;

  /**
   * Timeout ID if a timeout is set
   */
  timeoutId?: NodeJS.Timeout;

  /**
   * Original request options
   */
  options: ApiRequestOptions;
}

/**
 * Manages a queue of API requests to control concurrency
 * and prioritize important operations
 */
export class QueueManager {
  /**
   * Options for this queue manager
   */
  readonly #options: QueueOptions;

  /**
   * Reference to the Rest client
   */
  readonly #rest: Rest;

  /**
   * Queue of pending requests
   */
  readonly #queue: QueueItem[] = [];

  /**
   * Count of currently executing requests
   */
  #runningCount = 0;

  /**
   * Whether the queue is currently being processed
   */
  #processing = false;

  /**
   * Last queue state - used to track significant changes
   */
  #lastState = {
    size: 0,
    running: 0,
  };

  /**
   * Creates a new queue manager
   *
   * @param rest - The Rest client instance
   * @param options - Configuration options
   */
  constructor(rest: Rest, options: QueueOptions) {
    this.#rest = rest;
    this.#options = options;
  }

  /**
   * Gets the current queue size
   */
  get size(): number {
    return this.#queue.length;
  }

  /**
   * Gets the number of currently executing requests
   */
  get running(): number {
    return this.#runningCount;
  }

  /**
   * Gets the configured maximum concurrency
   */
  get concurrency(): number {
    return this.#options.concurrency;
  }

  /**
   * Checks if the queue is enabled
   */
  get enabled(): boolean {
    return this.#options.enabled;
  }

  /**
   * Adds a request to the queue and returns a promise
   * that resolves when the request completes
   *
   * @param options - Request options
   * @param requestId - Unique ID for this request
   * @param executor - Function that executes the actual request
   * @returns Promise that resolves with the request result
   * @throws Error if the queue is full
   */
  enqueue<T>(
    options: ApiRequestOptions,
    requestId: string,
    executor: () => Promise<T>,
  ): Promise<T> {
    // If queue is disabled, execute immediately
    if (!this.#options.enabled) {
      return executor();
    }

    // Check if queue is full
    if (this.#queue.length >= this.#options.maxQueueSize) {
      // Emit reject event
      this.#rest.emit("queueReject", {
        timestamp: new Date().toISOString(),
        requestId,
        path: options.path || "unknown",
        method: options.method || "GET",
        priority: this.#getPriority(
          options.path || "",
          options.method || "GET",
        ),
        reason: "Queue size limit exceeded",
      });

      return Promise.reject(
        new Error(`Queue size limit exceeded (${this.#options.maxQueueSize})`),
      );
    }

    return new Promise<T>((resolve, reject) => {
      const timestamp = Date.now();
      const priority = this.#getPriority(
        options.path || "",
        options.method || "GET",
      );

      // Create queue item
      const item: QueueItem<T> = {
        id: requestId,
        timestamp,
        path: options.path || "unknown",
        method: options.method || "GET",
        priority,
        execute: executor,
        resolve,
        reject,
        options,
      };

      // Set timeout if configured
      if (this.#options.timeout > 0) {
        item.timeoutId = setTimeout(() => {
          this.#handleTimeout(item);
        }, this.#options.timeout);
      }

      // Add to queue
      this.#addToQueue(item);

      // Try processing the queue
      this.#processQueue().catch(reject);
    });
  }

  /**
   * Clears all pending items from the queue
   *
   * @param reason - Reason for clearing the queue
   */
  clear(reason = "Queue manually cleared"): void {
    const items = [...this.#queue];
    this.#queue.length = 0;

    for (const item of items) {
      // Clear timeout if set
      if (item.timeoutId) {
        clearTimeout(item.timeoutId);
      }

      // Reject the promise
      item.reject(new Error(reason));
    }
  }

  /**
   * Adds an item to the queue in priority order
   *
   * @param item - Queue item to add
   * @private
   */
  #addToQueue<T>(item: QueueItem<T>): void {
    // Find position based on priority (higher priority items first)
    let index = this.#queue.findIndex(
      (queueItem) => queueItem.priority < item.priority,
    );
    if (index === -1) {
      // No lower priority items found, add to end
      index = this.#queue.length;
    }

    // Insert at the determined position
    this.#queue.splice(index, 0, item as QueueItem);
  }

  /**
   * Processes the next items in the queue up to concurrency limit
   *
   * @private
   */
  async #processQueue(): Promise<void> {
    // Prevent concurrent processing
    if (this.#processing) {
      return;
    }

    this.#processing = true;

    try {
      // Process items while we have capacity and queue is not empty
      while (
        this.#runningCount < this.#options.concurrency &&
        this.#queue.length > 0
      ) {
        const item = this.#queue.shift();
        if (!item) {
          break;
        }

        // Calculate time spent in queue
        const queueTime = Date.now() - item.timestamp;

        // Clear timeout if set
        if (item.timeoutId) {
          clearTimeout(item.timeoutId);
        }

        // Increment running counter
        this.#runningCount++;

        // Execute the request
        this.#executeItem(item, queueTime).catch(() => {
          // This catch is just to prevent unhandled promise rejections
          // The actual error is handled in executeItem
        });
      }

      // Check if state changed significantly
      this.#checkStateChange();
    } finally {
      this.#processing = false;
    }
  }

  /**
   * Executes a queue item and handles completion
   *
   * @param item - Queue item to execute
   * @param queueTime - Time spent in queue (ms)
   * @private
   */
  async #executeItem<T>(item: QueueItem<T>, queueTime: number): Promise<void> {
    try {
      // Execute the request
      const result = await item.execute();

      // Resolve the promise
      item.resolve(result);

      // Emit complete event (success)
      this.#emitQueueComplete(item, queueTime, true);
    } catch (error) {
      // Reject the promise
      item.reject(error);

      // Emit complete event (failure)
      this.#emitQueueComplete(item, queueTime, false);
    } finally {
      // Decrement running counter
      this.#runningCount--;

      // Check if state changed significantly
      this.#checkStateChange();

      // Process next items
      await this.#processQueue();
    }
  }

  /**
   * Handles a queue item timeout
   *
   * @param item - Queue item that timed out
   * @private
   */
  #handleTimeout<T>(item: QueueItem<T>): void {
    // Remove from queue if still there
    const index = this.#queue.findIndex(
      (queueItem) => queueItem.id === item.id,
    );

    if (index !== -1) {
      this.#queue.splice(index, 1);

      // Emit timeout event
      this.#rest.emit("queueTimeout", {
        timestamp: new Date().toISOString(),
        requestId: item.id,
        path: item.path,
        method: item.method,
        priority: item.priority,
        queueTime: Date.now() - item.timestamp,
      });

      // Check if state changed significantly
      this.#checkStateChange();

      // Reject the promise
      item.reject(
        new Error(
          `Request timed out in queue after ${this.#options.timeout}ms`,
        ),
      );
    }
  }

  /**
   * Determines the priority for a request based on path and method
   *
   * @param path - API path
   * @param method - HTTP method
   * @returns Priority value
   * @private
   */
  #getPriority(path: string, method: Dispatcher.HttpMethod): number {
    // Default to normal priority
    let priority = QueuePriority.Normal;

    // Check for explicit priority in options
    const routeKey = `${method}:${path}`;

    if (routeKey in this.#options.priorities) {
      priority = this.#options.priorities[routeKey] ?? QueuePriority.Normal;
    }
    // Interactions should be high priority
    else if (path.includes("/interactions")) {
      priority = QueuePriority.High;
    }
    // Messages are also time-sensitive
    else if (
      path.includes("/messages") &&
      (method === "POST" || method === "PATCH")
    ) {
      priority = QueuePriority.High;
    }
    // GET requests are generally lower priority
    else if (method === "GET" && !path.includes("/gateway")) {
      priority = QueuePriority.Low;
    }

    return priority;
  }

  /**
   * Checks if queue state has changed significantly and emits event if needed
   *
   * @private
   */
  #checkStateChange(): void {
    const currentSize = this.#queue.length;
    const currentRunning = this.#runningCount;

    // Significant state changes:
    // - Queue was empty, now has items
    // - Queue had items, now empty
    // - No requests were running, now some are
    // - Requests were running, now none are
    const significantChange =
      (this.#lastState.size === 0 && currentSize > 0) ||
      (this.#lastState.size > 0 && currentSize === 0) ||
      (this.#lastState.running === 0 && currentRunning > 0) ||
      (this.#lastState.running > 0 && currentRunning === 0);

    if (significantChange) {
      // Update last state
      this.#lastState.size = currentSize;
      this.#lastState.running = currentRunning;
    }
  }

  /**
   * Emits a queue complete event
   *
   * @param item - The queue item that completed
   * @param queueTime - Time spent in queue (ms)
   * @param success - Whether the request succeeded
   * @private
   */
  #emitQueueComplete<T>(
    item: QueueItem<T>,
    queueTime: number,
    success: boolean,
  ): void {
    const event: QueueCompleteEvent = {
      timestamp: new Date().toISOString(),
      requestId: item.id,
      path: item.path,
      method: item.method,
      priority: item.priority,
      queueTime,
      success,
    };

    this.#rest.emit("queueComplete", event);
  }
}
