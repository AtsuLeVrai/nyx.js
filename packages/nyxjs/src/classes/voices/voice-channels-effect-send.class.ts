import type { EmojiEntity, Snowflake } from "@nyxjs/core";
import type {
  VoiceChannelEffectSendAnimationType,
  VoiceChannelEffectSendEntity,
} from "@nyxjs/gateway";
import { BaseClass, type CacheEntityInfo } from "../../bases/index.js";
import type { EnforceCamelCase, GuildBased } from "../../types/index.js";
import { Emoji } from "../emojis/index.js";

export class VoiceChannelEffectSend
  extends BaseClass<VoiceChannelEffectSendEntity>
  implements EnforceCamelCase<VoiceChannelEffectSendEntity>
{
  get channelId(): Snowflake {
    return this.data.channel_id;
  }

  get guildId(): Snowflake {
    return this.data.guild_id;
  }

  get userId(): Snowflake {
    return this.data.user_id;
  }

  get emoji(): Emoji | null | undefined {
    if (!this.data.emoji) {
      return null;
    }

    return Emoji.from(this.client, this.data.emoji as GuildBased<EmojiEntity>);
  }

  get animationType(): VoiceChannelEffectSendAnimationType | undefined {
    return this.data.animation_type;
  }

  get animationId(): number | undefined {
    return this.data.animation_id;
  }

  get soundId(): Snowflake | number | undefined {
    return this.data.sound_id;
  }

  get soundVolume(): number | undefined {
    return this.data.sound_volume;
  }

  protected override getCacheInfo(): CacheEntityInfo | null {
    return null;
  }
}
