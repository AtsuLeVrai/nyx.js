import type { MessageEntity, Snowflake } from "@nyxjs/core";
import type { z } from "zod";
import { fromZodError } from "zod-validation-error";
import type { Rest } from "../rest.js";
import {
  GetAnswerVotersQueryEntity,
  type PollVotersResponseEntity,
} from "../schemas/index.js";
import type { HttpResponse } from "../types/index.js";

export class PollRouter {
  static ROUTES = {
    channelPolls: (
      channelId: Snowflake,
      messageId: Snowflake,
      answerId: number,
    ) =>
      `/channels/${channelId}/polls/${messageId}/answers/${answerId}` as const,
    expirePoll: (channelId: Snowflake, messageId: Snowflake) =>
      `/channels/${channelId}/polls/${messageId}/expire` as const,
  } as const;

  #rest: Rest;

  constructor(rest: Rest) {
    this.#rest = rest;
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/poll#get-answer-voters}
   */
  getAnswerVoters(
    channelId: Snowflake,
    messageId: Snowflake,
    answerId: number,
    query: z.input<typeof GetAnswerVotersQueryEntity> = {},
  ): Promise<HttpResponse<PollVotersResponseEntity>> {
    const result = GetAnswerVotersQueryEntity.safeParse(query);
    if (!result.success) {
      const validationError = fromZodError(result.error);
      throw new Error(validationError.message);
    }

    return this.#rest.get(
      PollRouter.ROUTES.channelPolls(channelId, messageId, answerId),
      {
        query: result.data,
      },
    );
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/poll#end-poll}
   */
  endPoll(
    channelId: Snowflake,
    messageId: Snowflake,
  ): Promise<HttpResponse<MessageEntity>> {
    return this.#rest.post(PollRouter.ROUTES.expirePoll(channelId, messageId));
  }
}
