import {
  GuildOnboardingPromptEntity,
  type GuildOnboardingPromptType,
  type Snowflake,
} from "@nyxjs/core";
import { z } from "zod";
import { fromError } from "zod-validation-error";
import { GuildOnboardingPromptOption } from "./guild-onboarding-prompt-option.class.js";

export class GuildOnboardingPrompt {
  readonly #data: GuildOnboardingPromptEntity;

  constructor(data: Partial<z.input<typeof GuildOnboardingPromptEntity>> = {}) {
    try {
      this.#data = GuildOnboardingPromptEntity.parse(data);
    } catch (error) {
      throw new Error(fromError(error).message);
    }
  }

  get id(): Snowflake {
    return this.#data.id;
  }

  get type(): GuildOnboardingPromptType {
    return this.#data.type;
  }

  get options(): GuildOnboardingPromptOption[] {
    return Array.isArray(this.#data.options)
      ? this.#data.options.map(
          (option) => new GuildOnboardingPromptOption(option),
        )
      : [];
  }

  get title(): string {
    return this.#data.title;
  }

  get singleSelect(): boolean {
    return Boolean(this.#data.single_select);
  }

  get required(): boolean {
    return Boolean(this.#data.required);
  }

  get inOnboarding(): boolean {
    return Boolean(this.#data.in_onboarding);
  }

  toJson(): GuildOnboardingPromptEntity {
    return { ...this.#data };
  }

  clone(): GuildOnboardingPrompt {
    return new GuildOnboardingPrompt(this.toJson());
  }

  validate(): boolean {
    try {
      GuildOnboardingPromptSchema.parse(this.toJson());
      return true;
    } catch {
      return false;
    }
  }

  merge(other: Partial<GuildOnboardingPromptEntity>): GuildOnboardingPrompt {
    return new GuildOnboardingPrompt({ ...this.toJson(), ...other });
  }

  equals(other: GuildOnboardingPrompt): boolean {
    return JSON.stringify(this.#data) === JSON.stringify(other.toJson());
  }
}

export const GuildOnboardingPromptSchema = z.instanceof(GuildOnboardingPrompt);
