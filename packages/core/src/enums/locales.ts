/**
 * Enum representing various locales supported by Discord.
 * @see {@link https://discord.com/developers/docs/reference#locales|Locales}
 */
export enum Locales {
    Indonesian = "id",
    Danish = "da",
    German = "de",
    EnglishUK = "en-GB",
    EnglishUS = "en-US",
    Spanish = "es-ES",
    SpanishLATAM = "es-419",
    French = "fr",
    Croatian = "hr",
    Italian = "it",
    Lithuanian = "lt",
    Hungarian = "hu",
    Dutch = "nl",
    Norwegian = "no",
    Polish = "pl",
    PortugueseBrazilian = "pt-BR",
    Romanian = "ro",
    Finnish = "fi",
    Swedish = "sv-SE",
    Vietnamese = "vi",
    Turkish = "tr",
    Czech = "cs",
    Greek = "el",
    Bulgarian = "bg",
    Russian = "ru",
    Ukrainian = "uk",
    Hindi = "hi",
    Thai = "th",
    ChineseChina = "zh-CN",
    Japanese = "ja",
    ChineseTaiwan = "zh-TW",
    Korean = "ko",
}

/**
 * Type representing the keys of the Locales enum.
 * @typedef {`${Locales}`} LocaleKeys
 */
export type LocaleKeys = `${Locales}`;