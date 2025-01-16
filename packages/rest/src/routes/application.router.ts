import type { ApplicationEntity, Snowflake } from "@nyxjs/core";
import type { z } from "zod";
import { fromZodError } from "zod-validation-error";
import type { Rest } from "../rest.js";
import {
  type ActivityInstanceEntity,
  EditCurrentApplicationEntity,
} from "../schemas/index.js";

export class ApplicationRouter {
  static ROUTES = {
    currentApplication: "/applications/@me" as const,
    activityInstance: (applicationId: Snowflake, instanceId: string) =>
      `/applications/${applicationId}/activity-instances/${instanceId}` as const,
  } as const;

  #rest: Rest;

  constructor(rest: Rest) {
    this.#rest = rest;
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/application#get-current-application}
   */
  getCurrentApplication(): Promise<ApplicationEntity> {
    return this.#rest.get(ApplicationRouter.ROUTES.currentApplication);
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/application#edit-current-application}
   */
  editCurrentApplication(
    options: z.input<typeof EditCurrentApplicationEntity>,
  ): Promise<ApplicationEntity> {
    const result = EditCurrentApplicationEntity.safeParse(options);
    if (!result.success) {
      throw new Error(fromZodError(result.error).message);
    }

    return this.#rest.patch(ApplicationRouter.ROUTES.currentApplication, {
      body: JSON.stringify(result.data),
    });
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/application#get-application-activity-instance}
   */
  getApplicationActivityInstance(
    applicationId: Snowflake,
    instanceId: string,
  ): Promise<ActivityInstanceEntity> {
    return this.#rest.get(
      ApplicationRouter.ROUTES.activityInstance(applicationId, instanceId),
    );
  }
}
