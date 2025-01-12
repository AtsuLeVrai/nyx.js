import { z } from "zod";
import { AvailableLocale, createAvailableLocale } from "../enums/index.js";
import { Snowflake } from "../managers/index.js";
import { ApplicationIntegrationType } from "./application.entity.js";
import { ChannelType } from "./channel.entity.js";
import { InteractionContextType } from "./interaction.entity.js";

/**
 * @see {@link https://discord.com/developers/docs/interactions/application-commands#application-command-permissions-object-application-command-permission-type}
 */
export enum ApplicationCommandPermissionType {
  Role = 1,
  User = 2,
  Channel = 3,
}

/**
 * @see {@link https://discord.com/developers/docs/interactions/application-commands#application-command-permissions-object-application-command-permissions-structure}
 */
export const ApplicationCommandPermissionEntity = z.object({
  id: Snowflake,
  type: z.nativeEnum(ApplicationCommandPermissionType),
  permission: z.boolean(),
});

export type ApplicationCommandPermissionEntity = z.infer<
  typeof ApplicationCommandPermissionEntity
>;

/**
 * @see {@link https://discord.com/developers/docs/interactions/application-commands#application-command-permissions-object-guild-application-command-permissions-structure}
 */
export const GuildApplicationCommandPermissionEntity = z.object({
  id: Snowflake,
  application_id: Snowflake,
  guild_id: Snowflake,
  permissions: z.array(ApplicationCommandPermissionEntity),
});

export type GuildApplicationCommandPermissionEntity = z.infer<
  typeof GuildApplicationCommandPermissionEntity
>;

/**
 * @see {@link https://discord.com/developers/docs/interactions/application-commands#application-command-object-entry-point-command-handler-types}
 */
export enum ApplicationCommandEntryPointType {
  AppHandler = 1,
  DiscordLaunchActivity = 2,
}

/**
 * @see {@link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-choice-structure}
 */
export const ApplicationCommandOptionChoiceEntity = z.object({
  name: z.string().min(1).max(100),
  name_localizations: AvailableLocale.nullish(),
  value: z.union([z.string(), z.number()]),
});

export type ApplicationCommandOptionChoiceEntity = z.infer<
  typeof ApplicationCommandOptionChoiceEntity
>;

/**
 * @see {@link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type}
 */
export enum ApplicationCommandOptionType {
  SubCommand = 1,
  SubCommandGroup = 2,
  String = 3,
  Integer = 4,
  Boolean = 5,
  User = 6,
  Channel = 7,
  Role = 8,
  Mentionable = 9,
  Number = 10,
  Attachment = 11,
}

/**
 * @see {@link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure}
 */
export interface ApplicationCommandOptionEntity {
  type: ApplicationCommandOptionType;
  name: string;
  name_localizations?: AvailableLocale | null;
  description: string;
  description_localizations?: AvailableLocale | null;
  required?: boolean;
  choices?: ApplicationCommandOptionChoiceEntity[];
  options?: ApplicationCommandOptionEntity[];
  channel_types?: ChannelType[];
  min_value?: number;
  max_value?: number;
  min_length?: number;
  max_length?: number;
  autocomplete?: boolean;
}

export const APPLICATION_COMMAND_NAME_REGEX =
  /^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/u;

export const ApplicationCommandOptionEntity: z.ZodType<ApplicationCommandOptionEntity> =
  z.lazy(() =>
    z.object({
      type: z.nativeEnum(ApplicationCommandOptionType),
      name: z.string().min(1).max(32).regex(APPLICATION_COMMAND_NAME_REGEX),
      name_localizations: createAvailableLocale(
        z.string().min(1).max(32).regex(APPLICATION_COMMAND_NAME_REGEX),
      ).nullish(),
      description: z.string().min(1).max(100),
      description_localizations: createAvailableLocale(
        z.string().min(1).max(100),
      ).nullish(),
      required: z.boolean().optional(),
      choices: z.array(ApplicationCommandOptionChoiceEntity).max(25).optional(),
      options: z.array(ApplicationCommandOptionEntity).max(25).optional(),
      channel_types: z.array(z.nativeEnum(ChannelType)).optional(),
      min_value: z.number().int().optional(),
      max_value: z.number().int().optional(),
      min_length: z.number().int().min(0).max(6000).optional(),
      max_length: z.number().int().min(1).max(6000).optional(),
      autocomplete: z.boolean().optional(),
    }),
  );

/**
 * @see {@link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-types}
 */
export enum ApplicationCommandType {
  ChatInput = 1,
  User = 2,
  Message = 3,
  PrimaryEntryPoint = 4,
}

/**
 * @see {@link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-structure}
 */
export const ApplicationCommandEntity = z.object({
  id: Snowflake,
  type: z
    .nativeEnum(ApplicationCommandType)
    .default(ApplicationCommandType.ChatInput),
  application_id: Snowflake,
  guild_id: Snowflake.optional(),
  name: z.string().min(1).max(32).regex(APPLICATION_COMMAND_NAME_REGEX),
  name_localizations: createAvailableLocale(
    z.string().min(1).max(32).regex(APPLICATION_COMMAND_NAME_REGEX),
  ).nullish(),
  description: z.string().min(1).max(100),
  description_localizations: createAvailableLocale(
    z.string().min(1).max(100),
  ).nullish(),
  options: z.array(ApplicationCommandOptionEntity).max(25).optional(),
  default_member_permissions: z.string().nullable(),
  dm_permission: z.boolean().optional(),
  default_permission: z.boolean().nullish(),
  nsfw: z.boolean().optional(),
  integration_types: z
    .array(z.nativeEnum(ApplicationIntegrationType))
    .optional(),
  contexts: z
    .array(z.lazy(() => z.nativeEnum(InteractionContextType)))
    .nullish(),
  version: Snowflake,
  handler: z.nativeEnum(ApplicationCommandEntryPointType).optional(),
});

export type ApplicationCommandEntity = z.infer<typeof ApplicationCommandEntity>;
