import type {
  GuildScheduledEventEntity,
  GuildScheduledEventEntityMetadata,
  GuildScheduledEventPrivacyLevel,
  GuildScheduledEventRecurrenceRuleEntity,
  GuildScheduledEventStatus,
  GuildScheduledEventType,
  Snowflake,
} from "@nyxjs/core";
import type { GuildScheduledEventUserAddRemoveEntity } from "@nyxjs/gateway";
import type { CamelCasedProperties } from "type-fest";
import { BaseClass, Cacheable } from "../bases/index.js";
import type { Enforce } from "../types/index.js";
import { User } from "./user.class.js";

@Cacheable("scheduledEvents")
export class GuildScheduledEvent
  extends BaseClass<GuildScheduledEventEntity>
  implements Enforce<CamelCasedProperties<GuildScheduledEventEntity>>
{
  get id(): Snowflake {
    return this.data.id;
  }

  get guildId(): Snowflake {
    return this.data.guild_id;
  }

  get channelId(): Snowflake | null | undefined {
    return this.data.channel_id;
  }

  get creatorId(): Snowflake | null | undefined {
    return this.data.creator_id;
  }

  get name(): string {
    return this.data.name;
  }

  get description(): string | null | undefined {
    return this.data.description;
  }

  get scheduledStartTime(): string {
    return this.data.scheduled_start_time;
  }

  get scheduledEndTime(): string | null | undefined {
    return this.data.scheduled_end_time;
  }

  get privacyLevel(): GuildScheduledEventPrivacyLevel {
    return this.data.privacy_level;
  }

  get status(): GuildScheduledEventStatus {
    return this.data.status;
  }

  get entityType(): GuildScheduledEventType {
    return this.data.entity_type;
  }

  get entityId(): Snowflake | null {
    return this.data.entity_id;
  }

  get entityMetadata(): GuildScheduledEventEntityMetadata | null {
    return this.data.entity_metadata;
  }

  get creator(): User | undefined {
    if (!this.data.creator) {
      return undefined;
    }

    return new User(this.client, this.data.creator);
  }

  get userCount(): number | undefined {
    return this.data.user_count;
  }

  get image(): string | null | undefined {
    return this.data.image;
  }

  get recurrenceRule():
    | GuildScheduledEventRecurrenceRuleEntity
    | null
    | undefined {
    return this.data.recurrence_rule;
  }
}

export class GuildScheduledEventUser
  extends BaseClass<GuildScheduledEventUserAddRemoveEntity>
  implements
    Enforce<CamelCasedProperties<GuildScheduledEventUserAddRemoveEntity>>
{
  get guildScheduledEventId(): Snowflake {
    return this.data.guild_scheduled_event_id;
  }

  get userId(): Snowflake {
    return this.data.user_id;
  }

  get guildId(): Snowflake {
    return this.data.guild_id;
  }
}
