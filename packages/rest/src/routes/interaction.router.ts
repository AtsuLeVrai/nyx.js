import type {
  InteractionCallbackEntity,
  MessageEntity,
  Snowflake,
} from "@nyxjs/core";
import type { z } from "zod";
import { fromZodError } from "zod-validation-error";
import type { Rest } from "../rest.js";
import {
  FollowupMessageEntity,
  InteractionCallbackDataEntity,
  InteractionResponseEntity,
} from "../schemas/index.js";
import type { HttpResponse } from "../types/index.js";

export class InteractionRouter {
  static ROUTES = {
    createResponse: (interactionId: Snowflake, interactionToken: string) =>
      `/interactions/${interactionId}/${interactionToken}/callback` as const,
    getOriginalResponse: (applicationId: Snowflake, interactionToken: string) =>
      `/webhooks/${applicationId}/${interactionToken}/messages/@original` as const,
    editOriginalResponse: (
      applicationId: Snowflake,
      interactionToken: string,
    ) =>
      `/webhooks/${applicationId}/${interactionToken}/messages/@original` as const,
    deleteOriginalResponse: (
      applicationId: Snowflake,
      interactionToken: string,
    ) =>
      `/webhooks/${applicationId}/${interactionToken}/messages/@original` as const,
    createFollowupMessage: (
      applicationId: Snowflake,
      interactionToken: string,
    ) => `/webhooks/${applicationId}/${interactionToken}` as const,
    getFollowupMessage: (
      applicationId: Snowflake,
      interactionToken: string,
      messageId: Snowflake,
    ) =>
      `/webhooks/${applicationId}/${interactionToken}/messages/${messageId}` as const,
    editFollowupMessage: (
      applicationId: Snowflake,
      interactionToken: string,
      messageId: Snowflake,
    ) =>
      `/webhooks/${applicationId}/${interactionToken}/messages/${messageId}` as const,
    deleteFollowupMessage: (
      applicationId: Snowflake,
      interactionToken: string,
      messageId: Snowflake,
    ) =>
      `/webhooks/${applicationId}/${interactionToken}/messages/${messageId}` as const,
  } as const;

  #rest: Rest;

  constructor(rest: Rest) {
    this.#rest = rest;
  }

  /**
   * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response}
   */
  createInteractionResponse(
    interactionId: Snowflake,
    interactionToken: string,
    options: z.input<typeof InteractionResponseEntity>,
    withResponse = true,
  ): Promise<HttpResponse<InteractionCallbackEntity | undefined>> {
    const result = InteractionResponseEntity.safeParse(options);
    if (!result.success) {
      const validationError = fromZodError(result.error);
      throw new Error(validationError.message);
    }

    return this.#rest.post(
      InteractionRouter.ROUTES.createResponse(interactionId, interactionToken),
      {
        body: JSON.stringify(result.data),
        query: { with_response: withResponse },
      },
    );
  }

  /**
   * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#get-original-interaction-response}
   */
  getOriginalInteractionResponse(
    applicationId: Snowflake,
    interactionToken: string,
  ): Promise<HttpResponse<MessageEntity>> {
    return this.#rest.get(
      InteractionRouter.ROUTES.getOriginalResponse(
        applicationId,
        interactionToken,
      ),
    );
  }

  /**
   * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#edit-original-interaction-response}
   */
  editOriginalInteractionResponse(
    applicationId: Snowflake,
    interactionToken: string,
    options: z.input<typeof InteractionCallbackDataEntity>,
  ): Promise<HttpResponse<MessageEntity>> {
    const result = InteractionCallbackDataEntity.partial().safeParse(options);
    if (!result.success) {
      const validationError = fromZodError(result.error);
      throw new Error(validationError.message);
    }

    return this.#rest.patch(
      InteractionRouter.ROUTES.editOriginalResponse(
        applicationId,
        interactionToken,
      ),
      {
        body: JSON.stringify(result.data),
      },
    );
  }

  /**
   * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#delete-original-interaction-response}
   */
  deleteOriginalInteractionResponse(
    applicationId: Snowflake,
    interactionToken: string,
  ): Promise<HttpResponse<void>> {
    return this.#rest.delete(
      InteractionRouter.ROUTES.deleteOriginalResponse(
        applicationId,
        interactionToken,
      ),
    );
  }

  /**
   * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#create-followup-message}
   */
  createFollowupMessage(
    applicationId: Snowflake,
    interactionToken: string,
    options: z.input<typeof FollowupMessageEntity>,
  ): Promise<HttpResponse<MessageEntity>> {
    const result = FollowupMessageEntity.safeParse(options);
    if (!result.success) {
      const validationError = fromZodError(result.error);
      throw new Error(validationError.message);
    }

    return this.#rest.post(
      InteractionRouter.ROUTES.createFollowupMessage(
        applicationId,
        interactionToken,
      ),
      {
        body: JSON.stringify(result.data),
      },
    );
  }

  /**
   * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#get-followup-message}
   */
  getFollowupMessage(
    applicationId: Snowflake,
    interactionToken: string,
    messageId: Snowflake,
  ): Promise<HttpResponse<MessageEntity>> {
    return this.#rest.get(
      InteractionRouter.ROUTES.getFollowupMessage(
        applicationId,
        interactionToken,
        messageId,
      ),
    );
  }

  /**
   * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#edit-followup-message}
   */
  editFollowupMessage(
    applicationId: Snowflake,
    interactionToken: string,
    messageId: Snowflake,
    options: z.input<typeof InteractionCallbackDataEntity>,
  ): Promise<HttpResponse<MessageEntity>> {
    const result = InteractionCallbackDataEntity.partial().safeParse(options);
    if (!result.success) {
      const validationError = fromZodError(result.error);
      throw new Error(validationError.message);
    }

    return this.#rest.patch(
      InteractionRouter.ROUTES.editFollowupMessage(
        applicationId,
        interactionToken,
        messageId,
      ),
      {
        body: JSON.stringify(result.data),
      },
    );
  }

  /**
   * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#delete-followup-message}
   */
  deleteFollowupMessage(
    applicationId: Snowflake,
    interactionToken: string,
    messageId: Snowflake,
  ): Promise<HttpResponse<void>> {
    return this.#rest.delete(
      InteractionRouter.ROUTES.deleteFollowupMessage(
        applicationId,
        interactionToken,
        messageId,
      ),
    );
  }
}
