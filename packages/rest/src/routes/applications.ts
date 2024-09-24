import type { ApplicationRoleConnectionStructure, ApplicationStructure, Snowflake } from "@nyxjs/core";
import type { RestRequestOptions } from "../types";
import { BaseRoutes } from "./base";

/**
 * @see {@link https://discord.com/developers/docs/resources/application#get-application-activity-instance-activity-location-kind-enum|Application Activity Instance Activity Location Kind Enum}
 */
export enum ActivityLocationKindTypes {
    /**
     * The Location is a Guild Channel
     */
    GuildChannel = "gc",
    /**
     * The Location is a Private Channel, such as a DM or GDM
     */
    PrivateChannel = "pc",
}

/**
 * @see {@link https://discord.com/developers/docs/resources/application#get-application-activity-instance-activity-location-object|Application Activity Instance Activity Location Structure}
 */
export type ActivityLocationStructure = {
    /**
     * The id of the Channel
     */
    channel_id: Snowflake;
    /**
     * The id of the Guild
     */
    guild_id?: Snowflake;
    /**
     * The unique identifier for the location
     */
    id: string;
    /**
     * Enum describing kind of location
     */
    kind: ActivityLocationKindTypes;
};

/**
 * @see {@link https://discord.com/developers/docs/resources/application#get-application-activity-instance-activity-instance-object|Application Activity Instance Activity Instance Structure}
 */
export type ActivityInstanceStructure = {
    /**
     * Application ID
     */
    application_id: Snowflake;
    /**
     * Activity Instance ID
     */
    instance_id: string;
    /**
     * Unique identifier for the launch
     */
    launch_id: Snowflake;
    /**
     * The Location the instance is runnning in
     */
    location: ActivityLocationStructure;
    /**
     * The IDs of the Users currently connected to the instance
     */
    users: Snowflake[];
};

/**
 * @see {@link https://discord.com/developers/docs/resources/application#edit-current-application|Edit Current Application}
 */
export type EditCurrentApplicationJsonParams = Partial<
    Pick<
        ApplicationStructure,
        | "cover_image"
        | "custom_install_url"
        | "description"
        | "flags"
        | "icon"
        | "install_params"
        | "integration_types_config"
        | "interactions_endpoint_url"
        | "role_connections_verification_url"
        | "tags"
    >
>;

export class ApplicationRoutes extends BaseRoutes {
    /**
     * @see {@link https://discord.com/developers/docs/resources/application-role-connection-metadata#update-application-role-connection-metadata-records|Update Application Role Connection Metadata Records}
     */
    public static updateApplicationRoleConnectionMetadata(
        applicationId: Snowflake,
        params: ApplicationRoleConnectionStructure[]
    ): RestRequestOptions<ApplicationRoleConnectionStructure> {
        return this.put(`/applications/${applicationId}/role-connections/metadata`, {
            body: JSON.stringify(params),
        });
    }

    /**
     * @see {@link https://discord.com/developers/docs/resources/application-role-connection-metadata#get-application-role-connection-metadata-records|Get Application Role Connection Metadata Records}
     */
    public static getApplicationRoleConnectionMetadata(
        applicationId: Snowflake
    ): RestRequestOptions<ApplicationRoleConnectionStructure[]> {
        return this.get(`/applications/${applicationId}/role-connections/metadata`);
    }

    /**
     * @see {@link https://discord.com/developers/docs/resources/application#get-application-activity-instance|Get Application Activity Instance}
     */
    public static getApplicationActivityInstance(
        applicationId: Snowflake,
        instanceId: string
    ): RestRequestOptions<ActivityInstanceStructure> {
        return this.get(`/applications/${applicationId}/activity-instances/${instanceId}`);
    }

    /**
     * @see {@link https://discord.com/developers/docs/resources/application#edit-current-application|Edit Current Application}
     */
    public static editCurrentApplication(
        params: EditCurrentApplicationJsonParams
    ): RestRequestOptions<ApplicationStructure> {
        return this.patch(`/applications/@me`, {
            body: JSON.stringify(params),
        });
    }

    /**
     * @see {@link https://discord.com/developers/docs/resources/application#get-current-application|Get Current Application}
     */
    public static getCurrentApplication(): RestRequestOptions<ApplicationStructure> {
        return this.get(`/applications/@me`);
    }
}