import { PollAnswerEntity } from "@nyxjs/core";
import { z } from "zod";
import { fromError } from "zod-validation-error";

export class PollAnswer {
  readonly #data: PollAnswerEntity;

  constructor(data: Partial<z.input<typeof PollAnswerEntity>> = {}) {
    try {
      this.#data = PollAnswerEntity.parse(data);
    } catch (error) {
      throw new Error(fromError(error).message);
    }
  }

  get answerId(): number {
    return this.#data.answer_id;
  }

  get pollMedia(): object | null {
    return this.#data.poll_media ? { ...this.#data.poll_media } : null;
  }

  static fromJson(json: PollAnswerEntity): PollAnswer {
    return new PollAnswer(json);
  }

  toJson(): PollAnswerEntity {
    return { ...this.#data };
  }

  clone(): PollAnswer {
    return new PollAnswer(this.toJson());
  }

  validate(): boolean {
    try {
      PollAnswerSchema.parse(this.toJson());
      return true;
    } catch {
      return false;
    }
  }

  merge(other: Partial<PollAnswerEntity>): PollAnswer {
    return new PollAnswer({ ...this.toJson(), ...other });
  }

  equals(other: PollAnswer): boolean {
    return JSON.stringify(this.#data) === JSON.stringify(other.toJson());
  }
}

export const PollAnswerSchema = z.instanceof(PollAnswer);
