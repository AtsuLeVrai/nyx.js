import type {
  BanEntity,
  ChannelEntity,
  GuildEntity,
  GuildMemberEntity,
  GuildOnboardingEntity,
  IntegrationEntity,
  InviteEntity,
  RoleEntity,
  Snowflake,
  VoiceRegionEntity,
  WelcomeScreenEntity,
} from "@nyxjs/core";
import type { Rest } from "../core/index.js";
import type { ImageData } from "../types/index.js";

interface CreateGuild {
  name: string;
  region?: string | null;
  icon?: ImageData;
  verification_level?: number;
  default_message_notifications?: number;
  explicit_content_filter?: number;
  roles?: RoleEntity[];
  channels?: Partial<ChannelEntity>[];
  afk_channel_id?: Snowflake;
  afk_timeout?: number;
  system_channel_id?: Snowflake;
  system_channel_flags?: number;
}

interface ModifyGuild extends Partial<CreateGuild> {
  owner_id?: Snowflake;
  splash?: ImageData | null;
  discovery_splash?: ImageData | null;
  banner?: ImageData | null;
  rules_channel_id?: Snowflake | null;
  public_updates_channel_id?: Snowflake | null;
  preferred_locale?: string;
  features?: string[];
  description?: string | null;
  premium_progress_bar_enabled?: boolean;
  safety_alerts_channel_id?: Snowflake | null;
}

interface GetGuildQuery {
  with_counts?: boolean;
}

interface GetMembersQuery {
  limit?: number;
  after?: Snowflake;
}

interface SearchMembersQuery {
  query: string;
  limit?: number;
}

interface AddMember {
  access_token: string;
  nick?: string;
  roles?: Snowflake[];
  mute?: boolean;
  deaf?: boolean;
}

interface ModifyMember {
  nick?: string | null;
  roles?: Snowflake[] | null;
  mute?: boolean | null;
  deaf?: boolean | null;
  channel_id?: Snowflake | null;
  communication_disabled_until?: string | null;
  flags?: number | null;
}

interface ModifyCurrentMember {
  nick?: string | null;
}

interface CreateRole {
  name?: string;
  permissions?: string;
  color?: number;
  hoist?: boolean;
  icon?: ImageData | null;
  unicode_emoji?: string | null;
  mentionable?: boolean;
}

interface ModifyRolePositions {
  id: Snowflake;
  position?: number | null;
}

interface GetPruneQuery {
  days?: number;
  include_roles?: string;
}

interface BeginPrune {
  days?: number;
  compute_prune_count?: boolean;
  include_roles?: Snowflake[];
}

interface BanCreate {
  delete_message_seconds?: number;
}

export class GuildRoutes {
  static routes = {
    guilds: "/guilds",
    guild: (guildId: Snowflake): `/guilds/${Snowflake}` => {
      return `/guilds/${guildId}` as const;
    },
    guildPreview: (guildId: Snowflake): `/guilds/${Snowflake}/preview` => {
      return `/guilds/${guildId}/preview` as const;
    },
    guildChannels: (guildId: Snowflake): `/guilds/${Snowflake}/channels` => {
      return `/guilds/${guildId}/channels` as const;
    },
    guildMembers: (guildId: Snowflake): `/guilds/${Snowflake}/members` => {
      return `/guilds/${guildId}/members` as const;
    },
    guildMember: (
      guildId: Snowflake,
      userId: Snowflake,
    ): `/guilds/${Snowflake}/members/${Snowflake}` => {
      return `/guilds/${guildId}/members/${userId}` as const;
    },
    guildCurrentMember: (
      guildId: Snowflake,
    ): `/guilds/${Snowflake}/members/@me` => {
      return `/guilds/${guildId}/members/@me` as const;
    },
    guildMemberRole: (
      guildId: Snowflake,
      userId: Snowflake,
      roleId: Snowflake,
    ): `/guilds/${Snowflake}/members/${Snowflake}/roles/${Snowflake}` => {
      return `/guilds/${guildId}/members/${userId}/roles/${roleId}` as const;
    },
    guildBans: (guildId: Snowflake): `/guilds/${Snowflake}/bans` => {
      return `/guilds/${guildId}/bans` as const;
    },
    guildBan: (
      guildId: Snowflake,
      userId: Snowflake,
    ): `/guilds/${Snowflake}/bans/${Snowflake}` => {
      return `/guilds/${guildId}/bans/${userId}` as const;
    },
    guildRoles: (guildId: Snowflake): `/guilds/${Snowflake}/roles` => {
      return `/guilds/${guildId}/roles` as const;
    },
    guildRole: (
      guildId: Snowflake,
      roleId: Snowflake,
    ): `/guilds/${Snowflake}/roles/${Snowflake}` => {
      return `/guilds/${guildId}/roles/${roleId}` as const;
    },
    guildMfa: (guildId: Snowflake): `/guilds/${Snowflake}/mfa` => {
      return `/guilds/${guildId}/mfa` as const;
    },
    guildPrune: (guildId: Snowflake): `/guilds/${Snowflake}/prune` => {
      return `/guilds/${guildId}/prune` as const;
    },
    guildRegions: (guildId: Snowflake): `/guilds/${Snowflake}/regions` => {
      return `/guilds/${guildId}/regions` as const;
    },
    guildInvites: (guildId: Snowflake): `/guilds/${Snowflake}/invites` => {
      return `/guilds/${guildId}/invites` as const;
    },
    guildIntegrations: (
      guildId: Snowflake,
    ): `/guilds/${Snowflake}/integrations` => {
      return `/guilds/${guildId}/integrations` as const;
    },
    guildIntegration: (
      guildId: Snowflake,
      integrationId: Snowflake,
    ): `/guilds/${Snowflake}/integrations/${Snowflake}` => {
      return `/guilds/${guildId}/integrations/${integrationId}` as const;
    },
    guildWidgetSettings: (
      guildId: Snowflake,
    ): `/guilds/${Snowflake}/widget` => {
      return `/guilds/${guildId}/widget` as const;
    },
    guildWidget: (guildId: Snowflake): `/guilds/${Snowflake}/widget.json` => {
      return `/guilds/${guildId}/widget.json` as const;
    },
    guildVanityUrl: (guildId: Snowflake): `/guilds/${Snowflake}/vanity-url` => {
      return `/guilds/${guildId}/vanity-url` as const;
    },
    guildWidgetImage: (
      guildId: Snowflake,
    ): `/guilds/${Snowflake}/widget.png` => {
      return `/guilds/${guildId}/widget.png` as const;
    },
    guildWelcomeScreen: (
      guildId: Snowflake,
    ): `/guilds/${Snowflake}/welcome-screen` => {
      return `/guilds/${guildId}/welcome-screen` as const;
    },
    guildOnboarding: (
      guildId: Snowflake,
    ): `/guilds/${Snowflake}/onboarding` => {
      return `/guilds/${guildId}/onboarding` as const;
    },
  } as const;

  readonly #rest: Rest;

  constructor(rest: Rest) {
    this.#rest = rest;
  }

  create(guild: CreateGuild): Promise<GuildEntity> {
    return this.#rest.post(GuildRoutes.routes.guilds, {
      body: JSON.stringify(guild),
    });
  }

  get(guildId: Snowflake, query?: GetGuildQuery): Promise<GuildEntity> {
    return this.#rest.get(GuildRoutes.routes.guild(guildId), { query });
  }

  getPreview(guildId: Snowflake): Promise<GuildEntity> {
    return this.#rest.get(GuildRoutes.routes.guildPreview(guildId));
  }

  modify(
    guildId: Snowflake,
    guild: ModifyGuild,
    reason?: string,
  ): Promise<GuildEntity> {
    return this.#rest.patch(GuildRoutes.routes.guild(guildId), {
      body: JSON.stringify(guild),
      reason,
    });
  }

  delete(guildId: Snowflake): Promise<void> {
    return this.#rest.delete(GuildRoutes.routes.guild(guildId));
  }

  getChannels(guildId: Snowflake): Promise<ChannelEntity[]> {
    return this.#rest.get(GuildRoutes.routes.guildChannels(guildId));
  }

  createChannel(
    guildId: Snowflake,
    channel: Partial<ChannelEntity>,
    reason?: string,
  ): Promise<ChannelEntity> {
    return this.#rest.post(GuildRoutes.routes.guildChannels(guildId), {
      body: JSON.stringify(channel),
      reason,
    });
  }

  modifyChannelPositions(
    guildId: Snowflake,
    channels: { id: Snowflake; position?: number | null }[],
  ): Promise<void> {
    return this.#rest.patch(GuildRoutes.routes.guildChannels(guildId), {
      body: JSON.stringify(channels),
    });
  }

  getMember(guildId: Snowflake, userId: Snowflake): Promise<GuildMemberEntity> {
    return this.#rest.get(GuildRoutes.routes.guildMember(guildId, userId));
  }

  listMembers(
    guildId: Snowflake,
    query?: GetMembersQuery,
  ): Promise<GuildMemberEntity[]> {
    return this.#rest.get(GuildRoutes.routes.guildMembers(guildId), { query });
  }

  searchMembers(
    guildId: Snowflake,
    query: SearchMembersQuery,
  ): Promise<GuildMemberEntity[]> {
    return this.#rest.get(
      `${GuildRoutes.routes.guildMembers(guildId)}/search`,
      {
        query,
      },
    );
  }

  addMember(
    guildId: Snowflake,
    userId: Snowflake,
    member: AddMember,
  ): Promise<GuildMemberEntity> {
    return this.#rest.put(GuildRoutes.routes.guildMember(guildId, userId), {
      body: JSON.stringify(member),
    });
  }

  modifyMember(
    guildId: Snowflake,
    userId: Snowflake,
    member: ModifyMember,
    reason?: string,
  ): Promise<GuildMemberEntity> {
    return this.#rest.patch(GuildRoutes.routes.guildMember(guildId, userId), {
      body: JSON.stringify(member),
      reason,
    });
  }

  modifyCurrentMember(
    guildId: Snowflake,
    member: ModifyCurrentMember,
    reason?: string,
  ): Promise<GuildMemberEntity> {
    return this.#rest.patch(GuildRoutes.routes.guildCurrentMember(guildId), {
      body: JSON.stringify(member),
      reason,
    });
  }

  addMemberRole(
    guildId: Snowflake,
    userId: Snowflake,
    roleId: Snowflake,
    reason?: string,
  ): Promise<void> {
    return this.#rest.put(
      GuildRoutes.routes.guildMemberRole(guildId, userId, roleId),
      { reason },
    );
  }

  removeMemberRole(
    guildId: Snowflake,
    userId: Snowflake,
    roleId: Snowflake,
    reason?: string,
  ): Promise<void> {
    return this.#rest.delete(
      GuildRoutes.routes.guildMemberRole(guildId, userId, roleId),
      { reason },
    );
  }

  removeMember(
    guildId: Snowflake,
    userId: Snowflake,
    reason?: string,
  ): Promise<void> {
    return this.#rest.delete(GuildRoutes.routes.guildMember(guildId, userId), {
      reason,
    });
  }

  getBans(guildId: Snowflake): Promise<BanEntity[]> {
    return this.#rest.get(GuildRoutes.routes.guildBans(guildId));
  }

  getBan(guildId: Snowflake, userId: Snowflake): Promise<BanEntity> {
    return this.#rest.get(GuildRoutes.routes.guildBan(guildId, userId));
  }

  createBan(
    guildId: Snowflake,
    userId: Snowflake,
    ban: BanCreate,
    reason?: string,
  ): Promise<void> {
    return this.#rest.put(GuildRoutes.routes.guildBan(guildId, userId), {
      body: JSON.stringify(ban),
      reason,
    });
  }

  removeBan(
    guildId: Snowflake,
    userId: Snowflake,
    reason?: string,
  ): Promise<void> {
    return this.#rest.delete(GuildRoutes.routes.guildBan(guildId, userId), {
      reason,
    });
  }

  getRoles(guildId: Snowflake): Promise<RoleEntity[]> {
    return this.#rest.get(GuildRoutes.routes.guildRoles(guildId));
  }

  getRole(guildId: Snowflake, roleId: Snowflake): Promise<RoleEntity> {
    return this.#rest.get(GuildRoutes.routes.guildRole(guildId, roleId));
  }

  createRole(
    guildId: Snowflake,
    role: CreateRole,
    reason?: string,
  ): Promise<RoleEntity> {
    return this.#rest.post(GuildRoutes.routes.guildRoles(guildId), {
      body: JSON.stringify(role),
      reason,
    });
  }

  modifyRolePositions(
    guildId: Snowflake,
    roles: ModifyRolePositions[],
  ): Promise<RoleEntity[]> {
    return this.#rest.patch(GuildRoutes.routes.guildRoles(guildId), {
      body: JSON.stringify(roles),
    });
  }

  modifyRole(
    guildId: Snowflake,
    roleId: Snowflake,
    role: Partial<CreateRole>,
    reason?: string,
  ): Promise<RoleEntity> {
    return this.#rest.patch(GuildRoutes.routes.guildRole(guildId, roleId), {
      body: JSON.stringify(role),
      reason,
    });
  }

  deleteRole(
    guildId: Snowflake,
    roleId: Snowflake,
    reason?: string,
  ): Promise<void> {
    return this.#rest.delete(GuildRoutes.routes.guildRole(guildId, roleId), {
      reason,
    });
  }

  getPruneCount(
    guildId: Snowflake,
    query?: GetPruneQuery,
  ): Promise<{ pruned: number }> {
    return this.#rest.get(GuildRoutes.routes.guildPrune(guildId), { query });
  }

  beginPrune(
    guildId: Snowflake,
    prune: BeginPrune,
    reason?: string,
  ): Promise<{ pruned: number | null }> {
    return this.#rest.post(GuildRoutes.routes.guildPrune(guildId), {
      body: JSON.stringify(prune),
      reason,
    });
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-voice-regions}
   */
  getVoiceRegions(guildId: Snowflake): Promise<VoiceRegionEntity[]> {
    return this.#rest.get(GuildRoutes.routes.guildRegions(guildId));
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-invites}
   */
  getInvites(guildId: Snowflake): Promise<InviteEntity[]> {
    return this.#rest.get(GuildRoutes.routes.guildInvites(guildId));
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-integrations}
   */
  getIntegrations(guildId: Snowflake): Promise<IntegrationEntity[]> {
    return this.#rest.get(GuildRoutes.routes.guildIntegrations(guildId));
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/guild#delete-guild-integration}
   */
  deleteIntegration(
    guildId: Snowflake,
    integrationId: Snowflake,
    reason?: string,
  ): Promise<void> {
    return this.#rest.delete(
      GuildRoutes.routes.guildIntegration(guildId, integrationId),
      { reason },
    );
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-widget-settings}
   */
  getWidgetSettings(
    guildId: Snowflake,
  ): Promise<{ enabled: boolean; channel_id: Snowflake | null }> {
    return this.#rest.get(GuildRoutes.routes.guildWidgetSettings(guildId));
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-widget}
   */
  modifyWidget(
    guildId: Snowflake,
    widget: { enabled: boolean; channel_id: Snowflake | null },
    reason?: string,
  ): Promise<{ enabled: boolean; channel_id: Snowflake | null }> {
    return this.#rest.patch(GuildRoutes.routes.guildWidgetSettings(guildId), {
      body: JSON.stringify(widget),
      reason,
    });
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-widget}
   */
  getWidget(guildId: Snowflake): Promise<{
    id: Snowflake;
    name: string;
    instant_invite: string | null;
    channels: Partial<ChannelEntity>[];
    members: Partial<GuildMemberEntity>[];
    presence_count: number;
  }> {
    return this.#rest.get(GuildRoutes.routes.guildWidget(guildId));
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-vanity-url}
   */
  getVanityUrl(
    guildId: Snowflake,
  ): Promise<{ code: string | null; uses: number }> {
    return this.#rest.get(GuildRoutes.routes.guildVanityUrl(guildId));
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-widget-image}
   */
  getWidgetImage(
    guildId: Snowflake,
    style?: "shield" | "banner1" | "banner2" | "banner3" | "banner4",
  ): Promise<Buffer> {
    return this.#rest.get(GuildRoutes.routes.guildWidgetImage(guildId), {
      query: { style },
    });
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-welcome-screen}
   */
  getWelcomeScreen(guildId: Snowflake): Promise<WelcomeScreenEntity> {
    return this.#rest.get(GuildRoutes.routes.guildWelcomeScreen(guildId));
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-welcome-screen}
   */
  modifyWelcomeScreen(
    guildId: Snowflake,
    welcomeScreen: Partial<WelcomeScreenEntity>,
    reason?: string,
  ): Promise<WelcomeScreenEntity> {
    return this.#rest.patch(GuildRoutes.routes.guildWelcomeScreen(guildId), {
      body: JSON.stringify(welcomeScreen),
      reason,
    });
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-onboarding}
   */
  getOnboarding(guildId: Snowflake): Promise<GuildOnboardingEntity> {
    return this.#rest.get(GuildRoutes.routes.guildOnboarding(guildId));
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-onboarding}
   */
  modifyOnboarding(
    guildId: Snowflake,
    onboarding: GuildOnboardingEntity,
    reason?: string,
  ): Promise<GuildOnboardingEntity> {
    return this.#rest.put(GuildRoutes.routes.guildOnboarding(guildId), {
      body: JSON.stringify(onboarding),
      reason,
    });
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-mfa-level}
   */
  modifyMfaLevel(
    guildId: Snowflake,
    level: number,
    reason?: string,
  ): Promise<number> {
    return this.#rest.post(GuildRoutes.routes.guildMfa(guildId), {
      body: JSON.stringify({ level }),
      reason,
    });
  }
}