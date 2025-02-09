import { TeamMemberEntity } from "@nyxjs/core";
import { z } from "zod";
import { fromError } from "zod-validation-error";

export class TeamMember {
  readonly #data: TeamMemberEntity;

  constructor(data: Partial<z.input<typeof TeamMemberEntity>> = {}) {
    try {
      this.#data = TeamMemberEntity.parse(data);
    } catch (error) {
      throw new Error(fromError(error).message);
    }
  }

  get membershipState(): unknown {
    return this.#data.membership_state;
  }

  get teamId(): unknown {
    return this.#data.team_id;
  }

  get user(): object | null {
    return this.#data.user ? { ...this.#data.user } : null;
  }

  get role(): unknown {
    return this.#data.role;
  }

  static fromJson(json: TeamMemberEntity): TeamMember {
    return new TeamMember(json);
  }

  toJson(): TeamMemberEntity {
    return { ...this.#data };
  }

  clone(): TeamMember {
    return new TeamMember(this.toJson());
  }

  validate(): boolean {
    try {
      TeamMemberSchema.parse(this.toJson());
      return true;
    } catch {
      return false;
    }
  }

  merge(other: Partial<TeamMemberEntity>): TeamMember {
    return new TeamMember({ ...this.toJson(), ...other });
  }

  equals(other: TeamMember): boolean {
    return JSON.stringify(this.#data) === JSON.stringify(other.toJson());
  }
}

export const TeamMemberSchema = z.instanceof(TeamMember);
