import type { Float, Snowflake, SoundboardSoundStructure } from "@nyxjs/core";
import { User } from "./Users";

export class SoundboardSound {
    public available!: boolean;

    public emojiId!: Snowflake | null;

    public emojiName!: string | null;

    public guildId?: Snowflake;

    public name!: string;

    public soundId!: Snowflake;

    public user?: User;

    public volume!: Float;

    public constructor(data: Partial<SoundboardSoundStructure>) {
        this.#patch(data);
    }

    #patch(data: Partial<SoundboardSoundStructure>): void {
        if (data.available) this.available = data.available;
        if (data.emoji_id) this.emojiId = data.emoji_id;
        if (data.emoji_name) this.emojiName = data.emoji_name;
        if (data.guild_id) this.guildId = data.guild_id;
        if (data.name) this.name = data.name;
        if (data.sound_id) this.soundId = data.sound_id;
        if (data.user) this.user = new User(data.user);
        if (data.volume) this.volume = data.volume;
    }
}