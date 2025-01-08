/**
 * @see {@link https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes}
 */
// biome-ignore lint/style/useNamingConvention: OAuth2 is a standard name that requires consecutive uppercase letters
export enum OAuth2Scope {
  ActivitiesRead = "activities.read",
  ActivitiesWrite = "activities.write",
  ApplicationsBuildsRead = "applications.builds.read",
  ApplicationsBuildsUpload = "applications.builds.upload",
  ApplicationsCommands = "applications.commands",
  ApplicationsCommandsUpdate = "applications.commands.update",
  ApplicationsCommandsPermissionsUpdate = "applications.commands.permissions.update",
  ApplicationsEntitlements = "applications.entitlements",
  ApplicationsStoreUpdate = "applications.store.update",
  Bot = "bot",
  Connections = "connections",
  DmChannelsRead = "dm_channels.read",
  Email = "email",
  GdmJoin = "gdm.join",
  Guilds = "guilds",
  GuildsJoin = "guilds.join",
  GuildsMembersRead = "guilds.members.read",
  Identify = "identify",
  MessagesRead = "messages.read",
  RelationshipsRead = "relationships.read",
  RoleConnectionsWrite = "role_connections.write",
  Rpc = "rpc",
  RpcActivitiesWrite = "rpc.activities.write",
  RpcNotificationsRead = "rpc.notifications.read",
  RpcVoiceRead = "rpc.voice.read",
  RpcVoiceWrite = "rpc.voice.write",
  Voice = "voice",
  WebhookIncoming = "webhook.incoming",
}
