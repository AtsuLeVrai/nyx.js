import type {
  Integer,
  MessageEntity,
  Snowflake,
  UserEntity,
} from "@nyxjs/core";
import { Router } from "./router.js";

/**
 * @see {@link https://discord.com/developers/docs/resources/poll#get-answer-voters-response-body}
 */
export interface PollVotersResponse {
  users: UserEntity[];
}

/**
 * @see {@link https://discord.com/developers/docs/resources/poll#get-answer-voters-query-string-params}
 */
export interface GetVotersQuery {
  after?: Snowflake;
  limit?: Integer;
}

export class PollRouter extends Router {
  static routes = {
    channelPolls: (
      channelId: Snowflake,
      messageId: Snowflake,
      answerId: number,
    ): `/channels/${Snowflake}/polls/${Snowflake}/answers/${number}` => {
      return `/channels/${channelId}/polls/${messageId}/answers/${answerId}` as const;
    },
    expirePoll: (
      channelId: Snowflake,
      messageId: Snowflake,
    ): `/channels/${Snowflake}/polls/${Snowflake}/expire` => {
      return `/channels/${channelId}/polls/${messageId}/expire` as const;
    },
  } as const;

  /**
   * @see {@link https://discord.com/developers/docs/resources/poll#get-answer-voters}
   */
  getAnswerVoters(
    channelId: Snowflake,
    messageId: Snowflake,
    answerId: number,
    query?: GetVotersQuery,
  ): Promise<PollVotersResponse> {
    return this.get(
      PollRouter.routes.channelPolls(channelId, messageId, answerId),
      {
        query: {
          after: query?.after,
          limit: query?.limit,
        },
      },
    );
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/poll#end-poll}
   */
  endPoll(channelId: Snowflake, messageId: Snowflake): Promise<MessageEntity> {
    return this.post(PollRouter.routes.expirePoll(channelId, messageId));
  }
}
