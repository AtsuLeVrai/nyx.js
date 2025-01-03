import type { ApplicationEntity } from "@nyxjs/core";
import { BaseRouter } from "../base/index.js";
import type { AuthorizationEntity } from "../schemas/index.js";

// biome-ignore lint/style/useNamingConvention: This is a router class, not an entity class
export class OAuth2Router extends BaseRouter {
  static ROUTES = {
    currentApplication: "/oauth2/applications/@me" as const,
    currentAuthorization: "/oauth2/@me" as const,
  } as const;

  /**
   * @see {@link https://discord.com/developers/docs/topics/oauth2#get-current-bot-application-information}
   */
  getCurrentBotApplicationInformation(): Promise<ApplicationEntity> {
    return this.get(OAuth2Router.ROUTES.currentApplication);
  }

  /**
   * @see {@link https://discord.com/developers/docs/topics/oauth2#get-current-authorization-information}
   */
  getCurrentAuthorizationInformation(): Promise<AuthorizationEntity> {
    return this.get(OAuth2Router.ROUTES.currentAuthorization);
  }
}
