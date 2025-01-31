import { z } from "zod";
import { BitwisePermissionFlags, LocaleKey } from "../enums/index.js";
import { Snowflake } from "../managers/index.js";
import {
  ApplicationCommandOptionChoiceEntity,
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "./application-commands.entity.js";
import { ApplicationIntegrationType } from "./application.entity.js";
import { ChannelEntity } from "./channel.entity.js";
import { EntitlementEntity } from "./entitlement.entity.js";
import { GuildEntity, GuildMemberEntity } from "./guild.entity.js";
import {
  ActionRowEntity,
  ComponentType,
  SelectMenuEntity,
} from "./message-components.entity.js";
import {
  AllowedMentionsEntity,
  AttachmentEntity,
  EmbedEntity,
  MessageEntity,
  MessageFlags,
} from "./message.entity.js";
import { PollCreateRequestEntity } from "./poll.entity.js";
import { RoleEntity } from "./role.entity.js";
import { UserEntity } from "./user.entity.js";

/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-type}
 */
export enum InteractionType {
  Ping = 1,
  ApplicationCommand = 2,
  MessageComponent = 3,
  ApplicationCommandAutocomplete = 4,
  ModalSubmit = 5,
}

/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-callback-type}
 */
export enum InteractionCallbackType {
  Pong = 1,
  ChannelMessageWithSource = 4,
  DeferredChannelMessageWithSource = 5,
  DeferredUpdateMessage = 6,
  UpdateMessage = 7,
  ApplicationCommandAutocompleteResult = 8,
  Modal = 9,
  PremiumRequired = 10,
  LaunchActivity = 12,
}

/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-context-types}
 */
export enum InteractionContextType {
  Guild = 0,
  BotDm = 1,
  PrivateChannel = 2,
}

/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#resolved-data-structure}
 */
export const InteractionResolvedDataEntity = z.object({
  users: z.record(Snowflake, UserEntity).optional(),
  members: z
    .record(
      Snowflake,
      GuildMemberEntity.omit({ user: true, deaf: true, mute: true }),
    )
    .optional(),
  roles: z.record(Snowflake, RoleEntity).optional(),
  channels: z
    .record(
      Snowflake,
      ChannelEntity.pick({
        id: true,
        name: true,
        type: true,
        permissions: true,
        thread_metadata: true,
        parent_id: true,
      }),
    )
    .optional(),
  /**
   * TODO: Of course, circular references... why discord ?
   * messages: z.record(Snowflake, MessageEntity.partial()).optional(),
   */
  attachments: z.record(Snowflake, AttachmentEntity).optional(),
});

export type InteractionResolvedDataEntity = z.infer<
  typeof InteractionResolvedDataEntity
>;

/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#message-component-data-structure}
 */
export const MessageComponentInteractionData = z.object({
  custom_id: z.string(),
  component_type: z.nativeEnum(ComponentType),
  values: z.array(SelectMenuEntity).optional(),
  resolved: InteractionResolvedDataEntity.optional(),
});

/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#modal-submit-data-structure}
 */
export const ModalSubmitInteractionData = z.object({
  custom_id: z.string(),
  components: z.array(ActionRowEntity),
});

/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-callback-activity-instance-resource}
 */
export const InteractionCallbackActivityInstanceEntity = z.object({
  id: z.string(),
});

export type InteractionCallbackActivityInstanceEntity = z.infer<
  typeof InteractionCallbackActivityInstanceEntity
>;

/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-callback-resource-object}
 */
export const InteractionCallbackResource = z.object({
  type: z.nativeEnum(InteractionCallbackType),
  activity_instance: InteractionCallbackActivityInstanceEntity.optional(),
  message: MessageEntity.optional(),
});

export type InteractionCallbackResource = z.infer<
  typeof InteractionCallbackResource
>;

/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-callback-object}
 */
export const InteractionCallbackEntity = z.object({
  id: Snowflake,
  type: z.nativeEnum(InteractionCallbackType),
  activity_instance_id: z.string().optional(),
  response_message_id: Snowflake.optional(),
  response_message_loading: z.boolean().optional(),
  response_message_ephemeral: z.boolean().optional(),
});

export type InteractionCallbackEntity = z.infer<
  typeof InteractionCallbackEntity
>;

/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#message-interaction-structure}
 */
export const MessageInteractionEntity = z.object({
  id: Snowflake,
  type: z.nativeEnum(InteractionType),
  name: z.string(),
  user: UserEntity,
  member: GuildMemberEntity.partial().optional(),
});

export type MessageInteractionEntity = z.infer<typeof MessageInteractionEntity>;

/**
 * Base structure for all command options
 */
const BaseCommandOption = z.object({
  name: z.string(),
  type: z.nativeEnum(ApplicationCommandOptionType),
});

/**
 * String Option - {@link ApplicationCommandOptionType.String}
 */
const StringCommandOption = BaseCommandOption.extend({
  type: z.literal(3),
  value: z.string(),
  focused: z.boolean().optional(),
});

/**
 * Number (Float) Option - {@link ApplicationCommandOptionType.Number}
 */
const NumberCommandOption = BaseCommandOption.extend({
  type: z.literal(10),
  value: z.number(),
  focused: z.boolean().optional(),
});

/**
 * Integer Option - {@link ApplicationCommandOptionType.Integer}
 */
const IntegerCommandOption = BaseCommandOption.extend({
  type: z.literal(4),
  value: z.number(),
  focused: z.boolean().optional(),
});

/**
 * Boolean Option - {@link ApplicationCommandOptionType.Boolean}
 */
const BooleanCommandOption = BaseCommandOption.extend({
  type: z.literal(5),
  value: z.boolean(),
  focused: z.boolean().optional(),
});

/**
 * Union of simple (non-nested) command option types
 */
const SimpleCommandOption = z.discriminatedUnion("type", [
  StringCommandOption,
  NumberCommandOption,
  IntegerCommandOption,
  BooleanCommandOption,
]);

/**
 * SubCommand Option - {@link ApplicationCommandOptionType.SubCommand}
 */
const SubCommandOption = BaseCommandOption.extend({
  type: z.literal(1),
  options: z.array(z.lazy(() => SimpleCommandOption)).optional(),
});

/**
 * SubCommandGroup Option - {@link ApplicationCommandOptionType.SubCommandGroup}
 */
const SubCommandGroupOption = BaseCommandOption.extend({
  type: z.literal(2),
  options: z.array(SubCommandOption),
});

/**
 * Union of all possible command interaction data options
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-data-structure}
 */
export const ApplicationCommandInteractionDataOptionEntity =
  z.discriminatedUnion("type", [
    SubCommandOption,
    SubCommandGroupOption,
    ...SimpleCommandOption.options,
  ]);

export type ApplicationCommandInteractionDataOptionEntity = z.infer<
  typeof ApplicationCommandInteractionDataOptionEntity
>;

/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#application-command-data-structure}
 */
export const ApplicationCommandInteractionData = z.object({
  id: Snowflake,
  name: z.string(),
  type: z.nativeEnum(ApplicationCommandType),
  resolved: InteractionResolvedDataEntity.optional(),
  options: z.array(ApplicationCommandInteractionDataOptionEntity).optional(),
  guild_id: Snowflake.optional(),
  target_id: Snowflake.optional(),
});

/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-data}
 */
export const InteractionDataEntity = z.discriminatedUnion("type", [
  z.object({
    type: z.literal(InteractionType.ApplicationCommand),
    data: ApplicationCommandInteractionData,
  }),
  z.object({
    type: z.literal(InteractionType.ApplicationCommandAutocomplete),
    data: ApplicationCommandInteractionData,
  }),
  z.object({
    type: z.literal(InteractionType.MessageComponent),
    data: MessageComponentInteractionData,
  }),
  z.object({
    type: z.literal(InteractionType.ModalSubmit),
    data: ModalSubmitInteractionData,
  }),
]);

/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-messages}
 */
export const InteractionCallbackMessagesEntity = z
  .object({
    tts: z.boolean().optional(),
    content: z.string().optional(),
    embeds: z.array(EmbedEntity).max(10).optional(),
    allowed_mentions: AllowedMentionsEntity.optional(),
    flags: z.nativeEnum(MessageFlags).optional(),
    components: z.array(ActionRowEntity).optional(),
    attachments: z.array(AttachmentEntity).optional(),
    poll: PollCreateRequestEntity.optional(),
  })
  .refine(
    (data) => {
      const hasContent = Boolean(data.content);
      const hasEmbeds = data.embeds && data.embeds.length > 0;
      const hasComponents = data.components && data.components.length > 0;
      return hasContent || hasEmbeds || hasComponents;
    },
    {
      message:
        "At least one of content, embeds, or components must be provided",
    },
  );

export type InteractionCallbackMessagesEntity = z.infer<
  typeof InteractionCallbackMessagesEntity
>;

/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#modal}
 */
export const InteractionCallbackModalEntity = z.object({
  custom_id: z.string().max(100),
  title: z.string().max(45),
  components: z.array(ActionRowEntity).min(1).max(5),
});

export type InteractionCallbackModalEntity = z.infer<
  typeof InteractionCallbackModalEntity
>;

/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#autocomplete}
 */
export const InteractionCallbackAutocompleteEntity = z.object({
  choices: z.array(z.lazy(() => ApplicationCommandOptionChoiceEntity)).max(25),
});

export type InteractionCallbackAutocompleteEntity = z.infer<
  typeof InteractionCallbackAutocompleteEntity
>;

/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-structure}
 */
export const InteractionCallbackResponseEntity = z
  .object({
    type: z.nativeEnum(InteractionCallbackType),
    data: z
      .union([
        InteractionCallbackMessagesEntity,
        InteractionCallbackAutocompleteEntity,
        InteractionCallbackModalEntity,
      ])
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.type === InteractionCallbackType.ChannelMessageWithSource &&
      !data.data
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Data is required for CHANNEL_MESSAGE_WITH_SOURCE",
      });
    }
    if (
      data.type ===
        InteractionCallbackType.ApplicationCommandAutocompleteResult &&
      !(data.data && "choices" in data.data)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Choices are required for APPLICATION_COMMAND_AUTOCOMPLETE_RESULT",
      });
    }
    if (
      data.type === InteractionCallbackType.Modal &&
      !(data.data && "custom_id" in data.data)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Modal data is required for MODAL response",
      });
    }
  });

export type InteractionCallbackResponseEntity = z.infer<
  typeof InteractionCallbackResponseEntity
>;

/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object}
 */
export const InteractionEntity = z.object({
  id: Snowflake,
  application_id: Snowflake,
  type: z.nativeEnum(InteractionType),
  data: InteractionDataEntity.optional(),
  guild: GuildEntity.partial().optional(),
  guild_id: Snowflake.optional(),
  channel: ChannelEntity.partial().optional(),
  channel_id: Snowflake.optional(),
  member: GuildMemberEntity.optional(),
  user: UserEntity.optional(),
  token: z.string(),
  version: z.literal(1),
  message: MessageEntity.optional(),
  app_permissions: z.nativeEnum(BitwisePermissionFlags),
  locale: LocaleKey.optional(),
  guild_locale: LocaleKey.optional(),
  entitlements: z.array(EntitlementEntity),
  authorizing_integration_owners: z.record(
    z.nativeEnum(ApplicationIntegrationType),
    Snowflake,
  ),
  context: z.nativeEnum(InteractionContextType).optional(),
});

export type InteractionEntity = z.infer<typeof InteractionEntity>;
