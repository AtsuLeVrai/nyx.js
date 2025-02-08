import {
  ApplicationRoleConnectionMetadataEntity,
  type Snowflake,
} from "@nyxjs/core";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { BaseRouter } from "../base/index.js";

export class ApplicationConnectionRouter extends BaseRouter {
  static readonly ROUTES = {
    applicationsRoleConnectionsMetadata: (applicationId: Snowflake) =>
      `/applications/${applicationId}/role-connections/metadata` as const,
  } as const;

  /**
   * @see {@link https://discord.com/developers/docs/resources/application-role-connection-metadata#get-application-role-connection-metadata-records}
   */
  getApplicationRoleConnectionMetadata(
    applicationId: Snowflake,
  ): Promise<ApplicationRoleConnectionMetadataEntity[]> {
    return this.rest.get(
      ApplicationConnectionRouter.ROUTES.applicationsRoleConnectionsMetadata(
        applicationId,
      ),
      undefined,
      this.sessionId,
    );
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/application-role-connection-metadata#update-application-role-connection-metadata-records}
   */
  updateApplicationRoleConnectionMetadata(
    applicationId: Snowflake,
    metadata: z.input<typeof ApplicationRoleConnectionMetadataEntity>[],
  ): Promise<ApplicationRoleConnectionMetadataEntity[]> {
    const result = z
      .array(ApplicationRoleConnectionMetadataEntity)
      .max(5)
      .safeParse(metadata);
    if (!result.success) {
      throw new Error(fromZodError(result.error).message);
    }

    return this.rest.put(
      ApplicationConnectionRouter.ROUTES.applicationsRoleConnectionsMetadata(
        applicationId,
      ),
      {
        body: JSON.stringify(result.data),
      },
      this.sessionId,
    );
  }
}
