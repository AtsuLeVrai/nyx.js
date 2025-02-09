import { DefaultReactionEntity } from "@nyxjs/core";
import { z } from "zod";

export class DefaultReaction {
  readonly #data: DefaultReactionEntity;

  constructor(data: DefaultReactionEntity) {
    this.#data = DefaultReactionEntity.parse(data);
  }

  get emojiId(): unknown | null {
    return this.#data.emoji_id ?? null;
  }

  get emojiName(): string | null {
    return this.#data.emoji_name ?? null;
  }

  static fromJson(json: DefaultReactionEntity): DefaultReaction {
    return new DefaultReaction(json);
  }

  toJson(): DefaultReactionEntity {
    return { ...this.#data };
  }

  clone(): DefaultReaction {
    return new DefaultReaction(this.toJson());
  }

  validate(): boolean {
    try {
      DefaultReactionSchema.parse(this.toJson());
      return true;
    } catch {
      return false;
    }
  }

  merge(other: Partial<DefaultReactionEntity>): DefaultReaction {
    return new DefaultReaction({ ...this.toJson(), ...other });
  }

  equals(other: DefaultReaction): boolean {
    return JSON.stringify(this.#data) === JSON.stringify(other.toJson());
  }
}

export const DefaultReactionSchema = z.instanceof(DefaultReaction);
