# Interactions

An [Interaction](/docs/interactions/receiving-and-responding#interaction-object) is the message that your application receives when a user uses an application command or a message component.

For [Slash Commands](/docs/interactions/application-commands#slash-commands), it includes the values that the user submitted.

For [User Commands](/docs/interactions/application-commands#user-commands) and [Message Commands](/docs/interactions/application-commands#message-commands), it includes the resolved user or message on which the action was taken.

For [Message Components](/docs/interactions/message-components) it includes identifying information about the component that was used. It will also include some metadata about how the interaction was triggered: the `guild_id`, `channel`, `member` and other fields. You can find all the values in our data models below.


### Interaction Object


### Interaction Structure

Field | Type | Description
--- | --- | ---
id | snowflake | ID of the interaction
application_id | snowflake | ID of the application this interaction is for
type | interaction type | Type of interaction
data?* | interaction data | Interaction data payload
guild? | partial guild object | Guild that the interaction was sent from
guild_id? | snowflake | Guild that the interaction was sent from
channel? | partial channel object | Channel that the interaction was sent from
channel_id? | snowflake | Channel that the interaction was sent from
member?** | guild member object | Guild member data for the invoking user, including permissions
user? | user object | User object for the invoking user, if invoked in a DM
token | string | Continuation token for responding to the interaction
version | integer | Read-only property, always 1
message? | message object | For components, the message they were attached to
app_permissions*** | string | Bitwise set of permissions the app has in the source location of the interaction
locale?**** | string | Selected language of the invoking user
guild_locale? | string | Guild's preferred locale, if invoked in a guild
entitlements | array of entitlement objects | For monetized apps, any entitlements for the invoking user, representing access to premium SKUs
authorizing_integration_owners | dictionary with keys of application integration types | Mapping of installation contexts that the interaction was authorized for to related user or guild IDs. See Authorizing Integration Owners Object for details
context? | interaction context type | Context where the interaction was triggered from

\* This is always present on application command, message component, and modal submit interaction types. It is optional for future-proofing against new interaction types

\*\* `member` is sent when the interaction is invoked in a guild, and `user` is sent when invoked in a DM

\*\*\* `app_permissions` includes `ATTACH_FILES | EMBED_LINKS | MENTION_EVERYONE` permissions for (G)DMs with other users, and additionally includes `USE_EXTERNAL_EMOJIS` for DMs with the app's bot user

\*\*\*\* This is available on all interaction types except PING


### Interaction Type

Name | Value
--- | ---
PING | 1
APPLICATION_COMMAND | 2
MESSAGE_COMPONENT | 3
APPLICATION_COMMAND_AUTOCOMPLETE | 4
MODAL_SUBMIT | 5


### Interaction Context Types

Context in Discord where an interaction can be used, or where it was triggered from. Details about using interaction contexts for application commands is in the [commands context documentation](/docs/interactions/application-commands#interaction-contexts).

Name | Type | Description
--- | --- | ---
GUILD | 0 | Interaction can be used within servers
BOT_DM | 1 | Interaction can be used within DMs with the app's bot user
PRIVATE_CHANNEL | 2 | Interaction can be used within Group DMs and DMs other than the app's bot user


### Authorizing Integration Owners Object

The `authorizing_integration_owners` field includes details about the authorizing user or server for the installation(s) relevant to the interaction. For apps installed to a user, it can be used to tell the difference between the authorizing user and the user that triggered an interaction (like a message component).

A key will only be present if the following are true:

-   The app has been authorized to the [installation context](/docs/resources/application#application-object-application-integration-types) corresponding to the key (`GUILD_INSTALL` or `USER_INSTALL`)
-   The interaction is supported in the source [interaction context](/docs/interactions/receiving-and-responding#interaction-object-interaction-context-types) (`GUILD`, `BOT_DM`, or `PRIVATE_CHANNEL`) for the installation context corresponding to the key
-   And for command invocations, the command must be supported in the installation context (using [`integration_types`](/docs/interactions/application-commands#contexts))

The values in `authorizing_integration_owners` depend on the key—

-   If the key is `GUILD_INSTALL` (`"0"`), the value depends on the source of the interaction:
    -   The value will be the guild ID if the interaction is triggered from a server
    -   The value will be `"0"` if the interaction is triggered from a DM with the app's bot user
-   If the key is `USER_INSTALL` (`"1"`), the value will be the ID of the authorizing user


### Interaction Data

While the `data` field is guaranteed to be present for all [interaction types](/docs/interactions/receiving-and-responding#interaction-object-interaction-type) besides `PING`, its structure will vary. The following tables detail the inner `data` payload for each interaction type.


### Application Command Data Structure

Sent in `APPLICATION_COMMAND` and `APPLICATION_COMMAND_AUTOCOMPLETE` interactions.

Field | Type | Description
--- | --- | ---
id | snowflake | ID of the invoked command
name | string | name of the invoked command
type | integer | type of the invoked command
resolved? | resolved data | Converted users + roles + channels + attachments
options?* | array of application command interaction data option | Params + values from the user
guild_id? | snowflake | ID of the guild the command is registered to
target_id? | snowflake | ID of the user or message targeted by a user or message command

\* This [can be partial](/docs/interactions/application-commands#autocomplete) when in response to `APPLICATION_COMMAND_AUTOCOMPLETE`


### Message Component Data Structure

Field | Type | Description
--- | --- | ---
custom_id | string | custom_id of the component
component_type | integer | type of the component
values?* | array of select option values | Values the user selected in a select menu component
resolved? | resolved data | Resolved entities from selected options

\* This is always present for select menu components


### Modal Submit Data Structure

Field | Type | Description
--- | --- | ---
custom_id | string | custom_id of the modal
components | array of message components | Values submitted by the user


### Resolved Data Structure

If data for a Member is included, data for its corresponding User will also be included.

Field | Type | Description
--- | --- | ---
users? | Map of Snowflakes to user objects | IDs and User objects
members?* | Map of Snowflakes to partial member objects | IDs and partial Member objects
roles? | Map of Snowflakes to role objects | IDs and Role objects
channels?** | Map of Snowflakes to partial channel objects | IDs and partial Channel objects
messages? | Map of Snowflakes to partial messages objects | IDs and partial Message objects
attachments? | Map of Snowflakes to attachment objects | IDs and attachment objects

\* Partial `Member` objects are missing `user`, `deaf` and `mute` fields

\*\* Partial `Channel` objects only have `id`, `name`, `type` and `permissions` fields. Threads will also have `thread_metadata` and `parent_id` fields.


### Application Command Interaction Data Option Structure

All options have names, and an option can either be a parameter and input value--in which case `value` will be set--or it can denote a subcommand or group--in which case it will contain a top-level key and another array of `options`.

`value` and `options` are mutually exclusive.

Field | Type | Description
--- | --- | ---
name | string | Name of the parameter
type | integer | Value of application command option type
value? | string, integer, double, or boolean | Value of the option resulting from user input
options? | array of application command interaction data option | Present if this option is a group or subcommand
focused? | boolean | true if this option is the currently focused option for autocomplete


### Message Interaction Object

This is sent on the [message object](/docs/resources/message#message-object) when the message is a response to an Interaction without an existing message.

This means responses to [Message Components](/docs/interactions/message-components) do not include this property, instead including a [message reference](/docs/resources/message#message-reference-structure) object as components always exist on preexisting messages.


### Message Interaction Structure

Field | Type | Description
--- | --- | ---
id | snowflake | ID of the interaction
type | interaction type | Type of interaction
name | string | Name of the application command, including subcommands and subcommand groups
user | user object | User who invoked the interaction
member? | partial member object | Member who invoked the interaction in the guild



---

## Receiving an Interaction

When a user interacts with your app, your app will receive an [Interaction](/docs/interactions/receiving-and-responding#interaction-object). Your app can receive an interaction in one of two ways:

-   Via [Interaction Create](/docs/events/gateway-events#interaction-create) gateway event
-   Via outgoing webhook

These two methods are mutually exclusive; you can only receive Interactions one of the two ways. The `INTERACTION_CREATE` [Gateway Event](/docs/events/gateway-events#interaction-create) may be handled by connected clients, while the webhook method detailed below does not require a connected client.

If you want to receive interactions via HTTP-based outgoing webhooks, you must configure an Interactions Endpoint URL for your app. You can read about preparing and adding an Interactions Endpoint URL to your app in the [Preparing for Interactions](/docs/interactions/overview#preparing-for-interactions) section in Interactions Overview.


### Interaction Metadata

An [Interaction](/docs/interactions/receiving-and-responding#interaction-object) includes metadata to aid your application in handling it as well as `data` specific to the interaction type. You can find samples for each interaction type on their respective pages:

-   [Slash Commands](/docs/interactions/application-commands#slash-commands-example-interaction)
-   [User Commands](/docs/interactions/application-commands#user-commands-example-interaction)
-   [Message Commands](/docs/interactions/application-commands#message-commands-example-interaction)
-   [Message Components](/docs/interactions/message-components#component-interaction-object-sample-component-interaction)
-   [Select Menu Message Components](/docs/interactions/message-components#select-menu-object-select-menu-interaction)

An explanation of all the fields can be found in our [data models](/docs/interactions/receiving-and-responding#interaction-object).

Now that you've gotten the data from the user, it's time to respond to them.



---

## Responding to an Interaction

Interactions--both receiving and responding--are webhooks under the hood. So responding to an Interaction is just like sending a webhook request!

Interaction responses have the same header requirements as normal HTTP API requests. See [here](/docs/reference#http-api) for further information.

There are a number of ways you can respond to an interaction:


### Interaction Response Object


### Interaction Response Structure

Field | Type | Description
--- | --- | ---
type | interaction callback type | Type of response
data? | interaction callback data | An optional response message


### Interaction Callback Type

Name | Value | Description
--- | --- | ---
PONG | 1 | ACK a Ping
CHANNEL_MESSAGE_WITH_SOURCE | 4 | Respond to an interaction with a message
DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE | 5 | ACK an interaction and edit a response later, the user sees a loading state
DEFERRED_UPDATE_MESSAGE* | 6 | For components, ACK an interaction and edit the original message later; the user does not see a loading state
UPDATE_MESSAGE* | 7 | For components, edit the message the component was attached to
APPLICATION_COMMAND_AUTOCOMPLETE_RESULT | 8 | Respond to an autocomplete interaction with suggested choices
MODAL** | 9 | Respond to an interaction with a popup modal
PREMIUM_REQUIRED | 10 | Deprecated; respond to an interaction with an upgrade button, only available for apps with monetization enabled
LAUNCH_ACTIVITY | 12 | Launch the Activity associated with the app. Only available for apps with Activities enabled

\* Only valid for [component-based](/docs/interactions/message-components) interactions

\*\* Not available for `MODAL_SUBMIT` and `PING` interactions.


### Interaction Callback Data Structure


### Messages

Not all message fields are currently supported.

Field | Type | Description
--- | --- | ---
tts? | boolean | Whether the response is TTS
content? | string | Message content
embeds? | array of embeds | Supports up to 10 embeds
allowed_mentions? | allowed mentions | Allowed mentions object
flags? | integer | Message flags combined as a bitfield (only SUPPRESS_EMBEDS, EPHEMERAL, and SUPPRESS_NOTIFICATIONS can be set)
components? | array of components | Message components
attachments? * | array of partial attachment objects | Attachment objects with filename and description
poll? | poll request object | Details about the poll

\* See [Uploading Files](/docs/reference#uploading-files) for details.


### Autocomplete

Field | Type | Description
--- | --- | ---
choices | array of choices | autocomplete choices (max of 25 choices)


### Modal

Support for components in modals is currently limited to type 4 (Text Input).

Field | Type | Description
--- | --- | ---
custom_id | string | Developer-defined identifier for the modal, max 100 characters
title | string | Title of the popup modal, max 45 characters
components | array of components | Between 1 and 5 (inclusive) components that make up the modal

If your application responds with user data, you should use [`allowed_mentions`](/docs/resources/message#allowed-mentions-object) to filter which mentions in the content actually ping.



---

## Interaction Callback

When responding to an interaction received, you can make a `POST` request to `/interactions/<interaction_id>/<interaction_token>/callback`. `interaction_id` is the unique id of that individual Interaction from the received payload. `interaction_token` is the unique token for that interaction from the received payload.

If you are receiving Interactions over the gateway, you have to respond via HTTP. Responses to Interactions are not sent as commands over the gateway.

If you send this request for an interaction received over HTTP, respond to the original HTTP request with a 202 and no body.
```py
import requests

url = "https://discord.com/api/v10/interactions/<interaction_id>/<interaction_token>/callback"

json = {
    "type": 4,
    "data": {
        "content": "Congrats on sending your command!"
    }
}
r = requests.post(url, json=json)
```

Interaction `tokens` are valid for 15 minutes and can be used to send followup messages but you must send an initial response within 3 seconds of receiving the event. If the 3 second deadline is exceeded, the token will be invalidated.

Inline HTTP Response Behavior

If you receive interactions over HTTP, your server can also respond to the received `POST` request. You'll want to respond with a `200` status code (if everything went well), as well as specifying a `type` and `data`, which is an [Interaction Response](/docs/interactions/receiving-and-responding#interaction-response-object) object:
```py
@app.route('/', methods=['POST'])
def my_command():
    if request.json["type"] == 1:
        return jsonify({
            "type": 1
        })

    else:
        return jsonify({
            "type": 4,
            "data": {
                "tts": False,
                "content": "Congrats on sending your command!",
                "embeds": [],
                "allowed_mentions": { "parse": [] }
            }
        })
```


### Interaction Callback Response Object

Field | Type | Description
--- | --- | ---
interaction | interaction callback object | The interaction object associated with the interaction response.
resource? | interaction resource object | The resource that was created by the interaction response.


### Interaction Callback Object

Field | Type | Description
--- | --- | ---
id | snowflake | ID of the interaction
type | integer | Interaction type
activity_instance_id? | string | Instance ID of the Activity if one was launched or joined
response_message_id? | snowflake | ID of the message that was created by the interaction
response_message_loading? | boolean | Whether or not the message is in a loading state
response_message_ephemeral? | boolean | Whether or not the response message was ephemeral


### Interaction Callback Resource Object

Field | Type | Description
--- | --- | ---
type | integer | Interaction callback type
activity_instance?* | Activity instance resource | Represents the Activity launched by this interaction.
message?** | message object | Message created by the interaction.

\* Only present if type is `LAUNCH_ACTIVITY`.

\*\* Only present if type is either `CHANNEL_MESSAGE_WITH_SOURCE` or `UPDATE_MESSAGE`.


### Interaction Callback Activity Instance Resource

Field | Type | Description
--- | --- | ---
id | string | Instance ID of the Activity if one was launched or joined.



---

## Followup Messages

Sometimes, your bot will want to send followup messages to a user after responding to an interaction. Or, you may want to edit your original response. Whether you receive Interactions over the gateway or by outgoing webhook, you can use the following endpoints to edit your initial response or send followup messages:

-   [`PATCH /webhooks/<application_id>/<interaction_token>/messages/@original`](/docs/interactions/receiving-and-responding#edit-original-interaction-response) to edit your initial response to an Interaction
-   [`DELETE /webhooks/<application_id>/<interaction_token>/messages/@original`](/docs/interactions/receiving-and-responding#delete-original-interaction-response) to delete your initial response to an Interaction
-   [`POST /webhooks/<application_id>/<interaction_token>`](/docs/interactions/receiving-and-responding#create-followup-message) to send a new followup message
-   [`PATCH /webhooks/<application_id>/<interaction_token>/messages/<message_id>`](/docs/interactions/receiving-and-responding#edit-followup-message) to edit a message sent with that `token`

Interactions webhooks share the same rate limit properties as normal webhooks.

Interaction tokens are valid for 15 minutes, meaning you can respond to an interaction within that amount of time.


### Endpoints

The endpoints below are not bound to the application's [Global Rate Limit](/docs/topics/rate-limits#global-rate-limit).



---

## Create Interaction Response

`POST` `/interactions/` [{interaction.id}](/docs/interactions/receiving-and-responding#interaction-object)/[{interaction.token}](/docs/interactions/receiving-and-responding#interaction-object)/callback

Create a response to an Interaction. Body is an [interaction response](/docs/interactions/receiving-and-responding#interaction-response-object). Returns `204` unless `with_response` is set to `true` which returns `200` with the body as [interaction callback response](/docs/interactions/receiving-and-responding#interaction-callback-interaction-callback-response-object).

This endpoint also supports file attachments similar to the webhook endpoints. Refer to [Uploading Files](/docs/reference#uploading-files) for details on uploading files and `multipart/form-data` requests.


### Query String Params

Field | Type | Description
--- | --- | ---
with_response? | boolean | Whether to include an interaction callback object as the response



---

## Get Original Interaction Response

`GET` `/webhooks/` [{application.id}](/docs/resources/application#application-object)/[{interaction.token}](/docs/interactions/receiving-and-responding#interaction-object)/messages/@original

Returns the initial Interaction response. Functions the same as [Get Webhook Message](/docs/resources/webhook#get-webhook-message).



---

## Edit Original Interaction Response

`PATCH` `/webhooks/` [{application.id}](/docs/resources/application#application-object)/[{interaction.token}](/docs/interactions/receiving-and-responding#interaction-object)/messages/@original

Edits the initial Interaction response. Functions the same as [Edit Webhook Message](/docs/resources/webhook#edit-webhook-message).



---

## Delete Original Interaction Response

`DELETE` `/webhooks/` [{application.id}](/docs/resources/application#application-object)/[{interaction.token}](/docs/interactions/receiving-and-responding#interaction-object)/messages/@original

Deletes the initial Interaction response. Returns `204 No Content` on success.



---

## Create Followup Message

`POST` `/webhooks/` [{application.id}](/docs/resources/application#application-object)/[{interaction.token}](/docs/interactions/receiving-and-responding#interaction-object)

Apps are limited to 5 followup messages per interaction if it was initiated from a user-installed app and isn't installed in the server (meaning the [authorizing integration owners object](/docs/interactions/receiving-and-responding#interaction-object-authorizing-integration-owners-object) only contains `USER_INSTALL`)

Create a followup message for an Interaction. Functions the same as [Execute Webhook](/docs/resources/webhook#execute-webhook), but `wait` is always true. The `thread_id`, `avatar_url`, and `username` parameters are not supported when using this endpoint for interaction followups. You can use the `EPHEMERAL` [message flag](/docs/resources/message#message-object-message-flags) `1 << 6` (64) to send a message that only the user can see.

When using this endpoint directly after responding to an interaction with `DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE`, this endpoint will function as [Edit Original Interaction Response](/docs/interactions/receiving-and-responding#edit-original-interaction-response) for backwards compatibility. In this case, no new message will be created, and the loading message will be edited instead. The ephemeral flag will be ignored, and the value you provided in the initial defer response will be preserved, as an existing message's ephemeral state cannot be changed. This behavior is deprecated, and you should use the Edit Original Interaction Response endpoint in this case instead.



---

## Get Followup Message

`GET` `/webhooks/` [{application.id}](/docs/resources/application#application-object)/[{interaction.token}](/docs/interactions/receiving-and-responding#interaction-object)/messages/[{message.id}](/docs/resources/channel#message-object)

Returns a followup message for an Interaction. Functions the same as [Get Webhook Message](/docs/resources/webhook#get-webhook-message).



---

## Edit Followup Message

`PATCH` `/webhooks/` [{application.id}](/docs/resources/application#application-object)/[{interaction.token}](/docs/interactions/receiving-and-responding#interaction-object)/messages/[{message.id}](/docs/resources/channel#message-object)

Edits a followup message for an Interaction. Functions the same as [Edit Webhook Message](/docs/resources/webhook#edit-webhook-message).



---

## Delete Followup Message

`DELETE` `/webhooks/` [{application.id}](/docs/resources/application#application-object)/[{interaction.token}](/docs/interactions/receiving-and-responding#interaction-object)/messages/[{message.id}](/docs/resources/channel#message-object)

Deletes a followup message for an Interaction. Returns `204 No Content` on success.