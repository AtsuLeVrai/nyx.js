import type { EntitlementEntity, Snowflake } from "@nyxjs/core";
import { fromZodError } from "zod-validation-error";
import { BaseRouter } from "../base/index.js";
import {
  CreateTestEntitlementSchema,
  ListEntitlementQuerySchema,
} from "../schemas/index.js";

export class EntitlementRouter extends BaseRouter {
  static readonly ROUTES = {
    applicationEntitlements: (applicationId: Snowflake) =>
      `/applications/${applicationId}/entitlements` as const,
    applicationEntitlement: (
      applicationId: Snowflake,
      entitlementId: Snowflake,
    ) =>
      `/applications/${applicationId}/entitlements/${entitlementId}` as const,
    applicationEntitlementConsume: (
      applicationId: Snowflake,
      entitlementId: Snowflake,
    ) =>
      `/applications/${applicationId}/entitlements/${entitlementId}/consume` as const,
  } as const;

  /**
   * @see {@link https://discord.com/developers/docs/resources/entitlement#list-entitlements}
   */
  listEntitlements(
    applicationId: Snowflake,
    query: ListEntitlementQuerySchema = {},
  ): Promise<EntitlementEntity[]> {
    const result = ListEntitlementQuerySchema.safeParse(query);
    if (!result.success) {
      throw new Error(fromZodError(result.error).message);
    }

    return this.rest.get(
      EntitlementRouter.ROUTES.applicationEntitlements(applicationId),
      {
        query: result.data,
      },
      this.sessionId,
    );
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/entitlement#get-entitlement}
   */
  getEntitlement(
    applicationId: Snowflake,
    entitlementId: Snowflake,
  ): Promise<EntitlementEntity> {
    return this.rest.get(
      EntitlementRouter.ROUTES.applicationEntitlement(
        applicationId,
        entitlementId,
      ),
      undefined,
      this.sessionId,
    );
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/entitlement#consume-an-entitlement}
   */
  consumeEntitlement(
    applicationId: Snowflake,
    entitlementId: Snowflake,
  ): Promise<void> {
    return this.rest.post(
      EntitlementRouter.ROUTES.applicationEntitlementConsume(
        applicationId,
        entitlementId,
      ),
      undefined,
      this.sessionId,
    );
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/entitlement#create-test-entitlement}
   */
  createTestEntitlement(
    applicationId: Snowflake,
    test: CreateTestEntitlementSchema,
  ): Promise<EntitlementEntity> {
    const result = CreateTestEntitlementSchema.safeParse(test);
    if (!result.success) {
      throw new Error(fromZodError(result.error).message);
    }

    return this.rest.post(
      EntitlementRouter.ROUTES.applicationEntitlements(applicationId),
      {
        body: JSON.stringify(result.data),
      },
      this.sessionId,
    );
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/entitlement#delete-test-entitlement}
   */
  deleteTestEntitlement(
    applicationId: Snowflake,
    entitlementId: Snowflake,
  ): Promise<void> {
    return this.rest.delete(
      EntitlementRouter.ROUTES.applicationEntitlement(
        applicationId,
        entitlementId,
      ),
      undefined,
      this.sessionId,
    );
  }
}
