import type { MessageEntity, Snowflake } from "@nyxjs/core";
import { BaseRouter } from "../base/index.js";
import {
  type GetAnswerVotersQueryEntity,
  GetAnswerVotersQuerySchema,
  type PollVotersResponseEntity,
} from "../schemas/index.js";

export class PollRouter extends BaseRouter {
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

  /**
   * @see {@link https://discord.com/developers/docs/resources/poll#get-answer-voters}
   */
  getAnswerVoters(
    channelId: Snowflake,
    messageId: Snowflake,
    answerId: number,
    query: GetAnswerVotersQueryEntity = {},
  ): Promise<PollVotersResponseEntity> {
    const result = GetAnswerVotersQuerySchema.safeParse(query);
    if (!result.success) {
      throw new Error(
        result.error.errors
          .map((e) => `[${e.path.join(".")}] ${e.message}`)
          .join(", "),
      );
    }

    return this.get(
      PollRouter.ROUTES.channelPolls(channelId, messageId, answerId),
      {
        query: result.data,
      },
    );
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/poll#end-poll}
   */
  endPoll(channelId: Snowflake, messageId: Snowflake): Promise<MessageEntity> {
    return this.post(PollRouter.ROUTES.expirePoll(channelId, messageId));
  }
}
