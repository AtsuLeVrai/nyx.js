import { GuildWidgetSettingsEntity } from "@nyxjs/core";
import { z } from "zod";
import { fromError } from "zod-validation-error";

export class GuildWidgetSettings {
  readonly #data: GuildWidgetSettingsEntity;

  constructor(data: Partial<z.input<typeof GuildWidgetSettingsEntity>> = {}) {
    try {
      this.#data = GuildWidgetSettingsEntity.parse(data);
    } catch (error) {
      throw new Error(fromError(error).message);
    }
  }

  get enabled(): boolean {
    return Boolean(this.#data.enabled);
  }

  get channelId(): unknown | null {
    return this.#data.channel_id ?? null;
  }

  static fromJson(json: GuildWidgetSettingsEntity): GuildWidgetSettings {
    return new GuildWidgetSettings(json);
  }

  toJson(): GuildWidgetSettingsEntity {
    return { ...this.#data };
  }

  clone(): GuildWidgetSettings {
    return new GuildWidgetSettings(this.toJson());
  }

  validate(): boolean {
    try {
      GuildWidgetSettingsSchema.parse(this.toJson());
      return true;
    } catch {
      return false;
    }
  }

  merge(other: Partial<GuildWidgetSettingsEntity>): GuildWidgetSettings {
    return new GuildWidgetSettings({ ...this.toJson(), ...other });
  }

  equals(other: GuildWidgetSettings): boolean {
    return JSON.stringify(this.#data) === JSON.stringify(other.toJson());
  }
}

export const GuildWidgetSettingsSchema = z.instanceof(GuildWidgetSettings);
