import type { ApplicationStructure, Iso8601Timestamp, OAuth2Scopes, UserStructure } from "@nyxjs/core";
import type { RestRequestOptions } from "../types";
import { BaseRoutes } from "./base";

/**
 * @see {@link https://discord.com/developers/docs/topics/oauth2#get-current-authorization-information-response-structure|Get Current Authorization Information Response Structure}
 */
export type GetCurrentAuthorizationInformationResponse = {
    /**
     * The current application.
     *
     * @todo Verify if this is a partial application object.
     */
    application: Pick<
        ApplicationStructure,
        "bot_public" | "bot_require_code_grant" | "description" | "icon" | "id" | "name" | "verify_key"
    >;
    /**
     * When the access token expires.
     */
    expires: Iso8601Timestamp;
    /**
     * The scopes the user has authorized the application for.
     */
    scopes: OAuth2Scopes[];
    /**
     * The user who has authorized, if the user has authorized with the identify scope.
     */
    user?: UserStructure;
};

export class OAuth2Routes extends BaseRoutes {
    /**
     * @see {@link https://discord.com/developers/docs/topics/oauth2#get-current-authorization-information|Get Current Authorization Information}
     */
    public static getCurrentAuthorizationInformation(): RestRequestOptions<GetCurrentAuthorizationInformationResponse> {
        return this.get("/oauth2/@me");
    }

    /**
     * @see {@link https://discord.com/developers/docs/topics/oauth2#get-current-bot-application-information|Get Current Bot Application Information}
     */
    public static getCurrentBotApplicationInformation(): RestRequestOptions<ApplicationStructure> {
        return this.get("/oauth2/applications/@me");
    }
}
