import { PollResultsEntity } from "@nyxjs/core";
import { z } from "zod";
import { fromError } from "zod-validation-error";

export class PollResults {
  readonly #data: PollResultsEntity;

  constructor(data: Partial<z.input<typeof PollResultsEntity>> = {}) {
    try {
      this.#data = PollResultsEntity.parse(data);
    } catch (error) {
      throw new Error(fromError(error).message);
    }
  }

  get isFinalized(): boolean {
    return Boolean(this.#data.is_finalized);
  }

  get answerCounts(): object[] {
    return Array.isArray(this.#data.answer_counts)
      ? [...this.#data.answer_counts]
      : [];
  }

  static fromJson(json: PollResultsEntity): PollResults {
    return new PollResults(json);
  }

  toJson(): PollResultsEntity {
    return { ...this.#data };
  }

  clone(): PollResults {
    return new PollResults(this.toJson());
  }

  validate(): boolean {
    try {
      PollResultsSchema.parse(this.toJson());
      return true;
    } catch {
      return false;
    }
  }

  merge(other: Partial<PollResultsEntity>): PollResults {
    return new PollResults({ ...this.toJson(), ...other });
  }

  equals(other: PollResults): boolean {
    return JSON.stringify(this.#data) === JSON.stringify(other.toJson());
  }
}

export const PollResultsSchema = z.instanceof(PollResults);
