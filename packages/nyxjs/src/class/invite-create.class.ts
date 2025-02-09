import { InviteCreateEntity } from "@nyxjs/gateway";
import { z } from "zod";

export class InviteCreate {
  readonly #data: InviteCreateEntity;

  constructor(data: InviteCreateEntity) {
    this.#data = InviteCreateEntity.parse(data);
  }

  get channelId(): unknown {
    return this.#data.channel_id;
  }

  get code(): string {
    return this.#data.code;
  }

  get createdAt(): string {
    return this.#data.created_at;
  }

  get guildId(): unknown | null {
    return this.#data.guild_id ?? null;
  }

  get inviter(): object | null {
    return this.#data.inviter ?? null;
  }

  get maxAge(): number {
    return this.#data.max_age;
  }

  get maxUses(): number {
    return this.#data.max_uses;
  }

  get targetType(): unknown | null {
    return this.#data.target_type ?? null;
  }

  get targetUser(): object | null {
    return this.#data.target_user ?? null;
  }

  get targetApplication(): object | null {
    return this.#data.target_application ?? null;
  }

  get temporary(): boolean {
    return Boolean(this.#data.temporary);
  }

  get uses(): number {
    return this.#data.uses;
  }

  static fromJson(json: InviteCreateEntity): InviteCreate {
    return new InviteCreate(json);
  }

  toJson(): InviteCreateEntity {
    return { ...this.#data };
  }

  clone(): InviteCreate {
    return new InviteCreate(this.toJson());
  }

  validate(): boolean {
    try {
      InviteCreateSchema.parse(this.toJson());
      return true;
    } catch {
      return false;
    }
  }

  merge(other: Partial<InviteCreateEntity>): InviteCreate {
    return new InviteCreate({ ...this.toJson(), ...other });
  }

  equals(other: InviteCreate): boolean {
    return JSON.stringify(this.#data) === JSON.stringify(other.toJson());
  }
}

export const InviteCreateSchema = z.instanceof(InviteCreate);
