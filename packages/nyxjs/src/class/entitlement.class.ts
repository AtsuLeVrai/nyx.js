import {
  EntitlementEntity,
  type EntitlementType,
  type Snowflake,
} from "@nyxjs/core";
import { z } from "zod";
import { fromError } from "zod-validation-error";

export class Entitlement {
  readonly #data: EntitlementEntity;

  constructor(data: Partial<z.input<typeof EntitlementEntity>> = {}) {
    try {
      this.#data = EntitlementEntity.parse(data);
    } catch (error) {
      throw new Error(fromError(error).message);
    }
  }

  get id(): Snowflake {
    return this.#data.id;
  }

  get skuId(): Snowflake {
    return this.#data.sku_id;
  }

  get applicationId(): Snowflake {
    return this.#data.application_id;
  }

  get userId(): Snowflake | null {
    return this.#data.user_id ?? null;
  }

  get type(): EntitlementType {
    return this.#data.type;
  }

  get deleted(): boolean {
    return Boolean(this.#data.deleted);
  }

  get startsAt(): string | null {
    return this.#data.starts_at ?? null;
  }

  get endsAt(): string | null {
    return this.#data.ends_at ?? null;
  }

  get guildId(): Snowflake | null {
    return this.#data.guild_id ?? null;
  }

  get consumed(): boolean {
    return Boolean(this.#data.consumed);
  }

  toJson(): EntitlementEntity {
    return { ...this.#data };
  }

  clone(): Entitlement {
    return new Entitlement(this.toJson());
  }

  validate(): boolean {
    try {
      EntitlementSchema.parse(this.toJson());
      return true;
    } catch {
      return false;
    }
  }

  merge(other: Partial<EntitlementEntity>): Entitlement {
    return new Entitlement({ ...this.toJson(), ...other });
  }

  equals(other: Entitlement): boolean {
    return JSON.stringify(this.#data) === JSON.stringify(other.toJson());
  }
}

export const EntitlementSchema = z.instanceof(Entitlement);
