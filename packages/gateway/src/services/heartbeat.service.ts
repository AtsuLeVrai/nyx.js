import { EventEmitter } from "eventemitter3";
import { GatewayOpcodes } from "../constants/index.js";
import type { Gateway } from "../gateway.js";
import { HeartbeatMetrics, HeartbeatOptions } from "../schemas/index.js";
import type { GatewayEvents } from "../types/index.js";

export class HeartbeatService extends EventEmitter<GatewayEvents> {
  #latency = 0;
  #lastAck = 0;
  #lastSend = 0;
  #missedHeartbeats = 0;
  #sequence = 0;
  #totalBeats = 0;
  #startTime = Date.now();
  #latencyHistory: number[] = [];
  #intervalMs = 0;
  #isAcked = true;
  #interval: NodeJS.Timeout | null = null;

  readonly #gateway: Gateway;
  readonly #options: HeartbeatOptions;

  constructor(gateway: Gateway, options: Partial<HeartbeatOptions> = {}) {
    super();
    this.#gateway = gateway;
    this.#options = HeartbeatOptions.parse(options);
  }

  get metrics(): HeartbeatMetrics {
    const metrics = {
      latency: this.#latency,
      lastAck: this.#lastAck,
      lastSend: this.#lastSend,
      sequence: this.#sequence,
      missedHeartbeats: this.#missedHeartbeats,
      totalBeats: this.#totalBeats,
      uptime: Date.now() - this.#startTime,
      averageLatency: this.#calculateAverageLatency(),
    };

    return HeartbeatMetrics.parse(metrics);
  }

  get isRunning(): boolean {
    return this.#interval !== null;
  }

  get currentOptions(): Readonly<Required<HeartbeatOptions>> {
    return Object.freeze({ ...this.#options });
  }

  start(interval: number): void {
    if (interval <= 0) {
      throw new Error("Cannot start heartbeat with invalid interval");
    }

    this.stop();
    this.#intervalMs = interval;

    if (this.#options.useJitter) {
      const jitter = this.#calculateJitter();
      const jitterDelay = Math.floor(interval * jitter);

      this.emit(
        "debug",
        `[Gateway:Heartbeat] Starting - Interval: ${interval}ms, Initial delay: ${jitterDelay}ms, Jitter: ${jitter.toFixed(4)}`,
      );

      setTimeout(() => this.#initializeHeartbeat(), jitterDelay);
    } else {
      this.#initializeHeartbeat();
    }
  }

  stop(): void {
    if (this.#interval) {
      clearInterval(this.#interval);
      this.#interval = null;

      this.emit(
        "debug",
        "[Gateway:Heartbeat] Stopped - Connection maintenance halted",
      );
    }
  }

  destroy(): void {
    this.stop();
    this.#resetMetrics();

    this.emit("debug", "[Gateway:Heartbeat] Destroyed - All metrics reset");
  }

  updateSequence(sequence: number): void {
    if (
      sequence < this.#options.minSequence ||
      sequence > this.#options.maxSequence
    ) {
      throw new Error(`Invalid sequence number: ${sequence}`);
    }

    this.#sequence = sequence;

    this.emit("debug", `[Gateway:Heartbeat] Sequence updated: ${sequence}`);
  }

  ackHeartbeat(): void {
    const now = Date.now();
    this.#isAcked = true;
    this.#lastAck = now;
    this.#missedHeartbeats = 0;

    if (this.#options.monitorLatency) {
      this.#updateLatency(now);
    }

    if (this.#options.logMetrics) {
      this.emit(
        "debug",
        `[Gateway:Heartbeat] Acknowledged - Latency: ${this.#latency}ms, Sequence: ${this.#sequence}`,
      );
    }
  }

  sendHeartbeat(): void {
    this.#lastSend = Date.now();
    this.#totalBeats++;

    if (!this.#isAcked) {
      this.#handleMissedHeartbeat();
      return;
    }

    this.#isAcked = false;

    this.emit(
      "debug",
      `[Gateway:Heartbeat] Sending - Sequence: ${this.#sequence}`,
    );

    this.#gateway.send(GatewayOpcodes.Heartbeat, this.#sequence);
  }

  #initializeHeartbeat(): void {
    this.sendHeartbeat();
    this.#interval = setInterval(() => this.sendHeartbeat(), this.#intervalMs);
  }

  #handleMissedHeartbeat(): void {
    this.#missedHeartbeats++;

    this.emit(
      "debug",
      `[Gateway:Heartbeat] Missed beat - Count: ${this.#missedHeartbeats}/${this.#options.maxMissedHeartbeats}`,
    );

    if (this.#missedHeartbeats >= this.#options.maxMissedHeartbeats) {
      this.emit("warn", "[Gateway:Heartbeat] Zombie connection detected");

      if (this.#options.resetOnZombie) {
        this.destroy();
      }
    }
  }

  #updateLatency(now: number): void {
    this.#latency = now - this.#lastSend;
    this.#latencyHistory.push(this.#latency);

    if (this.#latencyHistory.length > 100) {
      this.#latencyHistory.shift();
    }

    if (this.#latency > this.#options.maxLatency) {
      this.emit(
        "warn",
        `[Gateway:Heartbeat] High latency detected: ${this.#latency}ms`,
      );
    }
  }

  #calculateAverageLatency(): number {
    if (this.#latencyHistory.length === 0) {
      return 0;
    }
    const sum = this.#latencyHistory.reduce((acc, val) => acc + val, 0);
    return Math.round(sum / this.#latencyHistory.length);
  }

  #calculateJitter(): number {
    return (
      this.#options.minJitter +
      Math.random() * (this.#options.maxJitter - this.#options.minJitter)
    );
  }

  #resetMetrics(): void {
    this.#latency = 0;
    this.#lastAck = 0;
    this.#lastSend = 0;
    this.#missedHeartbeats = 0;
    this.#sequence = 0;
    this.#totalBeats = 0;
    this.#isAcked = true;
    this.#intervalMs = 0;
    this.#latencyHistory = [];
    this.#startTime = Date.now();
  }
}
