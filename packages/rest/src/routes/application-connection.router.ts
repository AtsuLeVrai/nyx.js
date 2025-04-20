import type {
  ApplicationRoleConnectionMetadataEntity,
  Snowflake,
} from "@nyxojs/core";
import type { Rest } from "../core/index.js";

/**
 * Router for Discord Application Connection-related API endpoints.
 *
 * This class provides methods to interact with application role connection metadata,
 * which powers Discord's role connection verification feature. Role connections allow
 * applications to associate user accounts with external services and define requirements
 * for automatic role assignments based on external service metrics or achievements.
 *
 * Role connection metadata defines what types of data your application can provide about
 * users to Discord for role assignment purposes.
 */
export class ApplicationConnectionRouter {
  /**
   * API route constants for application connection-related endpoints.
   */
  static readonly CONNECTION_ROUTES = {
    /**
     * Route for application role connection metadata endpoint.
     * This endpoint is used to manage the metadata fields that can be used
     * for role connection verification.
     *
     * @param applicationId - Snowflake ID of the target application
     * @returns The formatted API route string
     */
    roleConnectionsMetadataEndpoint: (applicationId: Snowflake) =>
      `/applications/${applicationId}/role-connections/metadata` as const,
  } as const;

  /** The REST client used to make API requests */
  readonly #rest: Rest;

  /**
   * Creates a new Application Connection Router instance.
   *
   * @param rest - The REST client to use for making Discord API requests
   */
  constructor(rest: Rest) {
    this.#rest = rest;
  }

  /**
   * Fetches the role connection metadata records for an application.
   *
   * These records define the metadata fields that can be used for role connection verification.
   * Applications can define up to 5 metadata fields that represent criteria for automatic
   * role assignment, such as game statistics, subscription levels, or other user attributes
   * from external services or platforms.
   *
   * @param applicationId - ID of the application to fetch metadata for
   * @returns A promise that resolves to an array of application role connection metadata records
   * @throws {Error} Will throw an error if the request fails or the application doesn't exist
   * @see {@link https://discord.com/developers/docs/resources/application-role-connection-metadata#get-application-role-connection-metadata-records}
   */
  fetchRoleConnectionMetadata(
    applicationId: Snowflake,
  ): Promise<ApplicationRoleConnectionMetadataEntity[]> {
    return this.#rest.get(
      ApplicationConnectionRouter.CONNECTION_ROUTES.roleConnectionsMetadataEndpoint(
        applicationId,
      ),
    );
  }

  /**
   * Updates the role connection metadata records for an application.
   *
   * This method allows you to define how your application can be used for role connection
   * verification in Discord servers. The metadata you define here will determine what
   * types of data your application can provide about users, which can then be used for
   * automatic role assignment.
   *
   * @param applicationId - ID of the application to update metadata for
   * @param metadata - Array of metadata records to update (maximum of 5 records)
   * @returns A promise that resolves to the updated array of application role connection metadata records
   * @throws {Error} Will throw an error if the provided metadata fails validation or exceeds the limit of 5 records
   * @see {@link https://discord.com/developers/docs/resources/application-role-connection-metadata#update-application-role-connection-metadata-records}
   */
  updateRoleConnectionMetadata(
    applicationId: Snowflake,
    metadata: ApplicationRoleConnectionMetadataEntity[],
  ): Promise<ApplicationRoleConnectionMetadataEntity[]> {
    return this.#rest.put(
      ApplicationConnectionRouter.CONNECTION_ROUTES.roleConnectionsMetadataEndpoint(
        applicationId,
      ),
      {
        body: JSON.stringify(metadata),
      },
    );
  }
}
