import type { Snowflake, StageInstanceEntity } from "@nyxjs/core";
import { fromZodError } from "zod-validation-error";
import type { Rest } from "../rest.js";
import {
  CreateStageInstanceEntity,
  ModifyStageInstanceEntity,
} from "../schemas/index.js";
import type { HttpResponse } from "../types/index.js";

export class StageInstanceRouter {
  static readonly ROUTES = {
    stageInstances: "/stage-instances" as const,
    stageInstance: (channelId: Snowflake) =>
      `/stage-instances/${channelId}` as const,
  } as const;

  #rest: Rest;

  constructor(rest: Rest) {
    this.#rest = rest;
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/stage-instance#create-stage-instance}
   */
  createStageInstance(
    options: CreateStageInstanceEntity,
    reason?: string,
  ): Promise<HttpResponse<StageInstanceEntity>> {
    const result = CreateStageInstanceEntity.safeParse(options);
    if (!result.success) {
      const validationError = fromZodError(result.error);
      throw new Error(validationError.message);
    }

    return this.#rest.post(StageInstanceRouter.ROUTES.stageInstances, {
      body: JSON.stringify(result.data),
      reason,
    });
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/stage-instance#get-stage-instance}
   */
  getStageInstance(
    channelId: Snowflake,
  ): Promise<HttpResponse<StageInstanceEntity>> {
    return this.#rest.get(StageInstanceRouter.ROUTES.stageInstance(channelId));
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/stage-instance#modify-stage-instance}
   */
  modifyStageInstance(
    channelId: Snowflake,
    options: ModifyStageInstanceEntity,
    reason?: string,
  ): Promise<HttpResponse<StageInstanceEntity>> {
    const result = ModifyStageInstanceEntity.safeParse(options);
    if (!result.success) {
      const validationError = fromZodError(result.error);
      throw new Error(validationError.message);
    }

    return this.#rest.patch(
      StageInstanceRouter.ROUTES.stageInstance(channelId),
      {
        body: JSON.stringify(result.data),
        reason,
      },
    );
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/stage-instance#delete-stage-instance}
   */
  deleteStageInstance(
    channelId: Snowflake,
    reason?: string,
  ): Promise<HttpResponse<void>> {
    return this.#rest.delete(
      StageInstanceRouter.ROUTES.stageInstance(channelId),
      {
        reason,
      },
    );
  }
}
