function createI18nConfig<Locale extends string>(opts: {
  cookieName: string;
  storageKey: string;
  defaultLocale: Locale;
  supportedLocales: Locale[];
  rtlLocales: Locale[];
}) {
  return { ...opts, COOKIE_NAME: opts.cookieName, STORAGE_KEY: opts.storageKey };
}

/**
 * Internationalization Configuration
 *
 * Supported Languages:
 * - English (en) - Default
 * - French (fr) - Official Canadian language
 * - Chinese Simplified (zh-CN)
 * - Chinese Traditional (zh-TW)
 * - Swedish (sv)
 * - Russian (ru)
 * - Polish (pl)
 * - Ukrainian (uk)
 * - First Nations Languages:
 *   - Cree (cr) - Most spoken Indigenous language in Canada
 *   - Inuktitut (iu) - Official language of Nunavut
 *   - Ojibwe/Anishinaabemowin (oj) - Spoken across Ontario, Manitoba, Saskatchewan
 *   - Mohawk/Kanien'keha (moh) - Iroquoian language
 */

export type LocaleCode =
  | "en"
  | "fr"
  | "zh-CN"
  | "zh-TW"
  | "sv"
  | "ru"
  | "pl"
  | "uk"
  // Batch 1: European
  | "de" // German
  | "es" // Spanish
  | "it" // Italian
  | "nl" // Dutch
  // Batch 2: Asian/Middle Eastern
  | "ja" // Japanese
  | "ko" // Korean
  | "ar" // Arabic (RTL)
  | "fa" // Persian/Farsi (RTL)
  // Batch 3: Creole + Indigenous
  | "ht" // Haitian Creole
  | "lou" // Louisiana Creole
  | "mic" // Mi'kmaq
  | "den" // Dene
  // Batch 4: African
  | "sw" // Swahili
  | "yo" // Yoruba
  | "zu" // Zulu
  | "am" // Amharic
  // First Nations (existing)
  | "cre" // Cree
  | "iku" // Inuktitut
  | "oji" // Ojibwe
  | "moh"; // Mohawk

export type Completeness = "complete" | "partial" | "community-contributed";

export interface Language {
  code: LocaleCode;
  name: string;
  nativeName: string;
  direction: "ltr" | "rtl";
  flag?: string;
  category: "official" | "international" | "first_nations";
  completeness: Completeness;
}

export const languages: Language[] = [
  // Official Canadian Languages
  {
    code: "en",
    name: "English",
    nativeName: "English",
    direction: "ltr",
    flag: "🇨🇦",
    category: "official",
    completeness: "complete",
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    direction: "ltr",
    flag: "🇨🇦",
    category: "official",
    completeness: "complete",
  },

  // European Languages
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    direction: "ltr",
    flag: "🇩🇪",
    category: "international",
    completeness: "partial",
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    direction: "ltr",
    flag: "🇪🇸",
    category: "international",
    completeness: "partial",
  },
  {
    code: "it",
    name: "Italian",
    nativeName: "Italiano",
    direction: "ltr",
    flag: "🇮🇹",
    category: "international",
    completeness: "partial",
  },
  {
    code: "nl",
    name: "Dutch",
    nativeName: "Nederlands",
    direction: "ltr",
    flag: "🇳🇱",
    category: "international",
    completeness: "community-contributed",
  },
  {
    code: "sv",
    name: "Swedish",
    nativeName: "Svenska",
    direction: "ltr",
    flag: "🇸🇪",
    category: "international",
    completeness: "partial",
  },
  {
    code: "pl",
    name: "Polish",
    nativeName: "Polski",
    direction: "ltr",
    flag: "🇵🇱",
    category: "international",
    completeness: "partial",
  },
  {
    code: "ru",
    name: "Russian",
    nativeName: "Русский",
    direction: "ltr",
    flag: "🇷🇺",
    category: "international",
    completeness: "partial",
  },
  {
    code: "uk",
    name: "Ukrainian",
    nativeName: "Українська",
    direction: "ltr",
    flag: "🇺🇦",
    category: "international",
    completeness: "partial",
  },

  // Asian Languages
  {
    code: "zh-CN",
    name: "Chinese (Simplified)",
    nativeName: "简体中文",
    direction: "ltr",
    flag: "🇨🇳",
    category: "international",
    completeness: "partial",
  },
  {
    code: "zh-TW",
    name: "Chinese (Traditional)",
    nativeName: "繁體中文",
    direction: "ltr",
    flag: "🇹🇼",
    category: "international",
    completeness: "partial",
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    direction: "ltr",
    flag: "🇯🇵",
    category: "international",
    completeness: "community-contributed",
  },
  {
    code: "ko",
    name: "Korean",
    nativeName: "한국어",
    direction: "ltr",
    flag: "🇰🇷",
    category: "international",
    completeness: "community-contributed",
  },

  // Middle Eastern Languages
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    direction: "rtl",
    flag: "🇸🇦",
    category: "international",
    completeness: "community-contributed",
  },
  {
    code: "fa",
    name: "Persian",
    nativeName: "فارسی",
    direction: "rtl",
    flag: "🇮🇷",
    category: "international",
    completeness: "community-contributed",
  },

  // Creole Languages
  {
    code: "ht",
    name: "Haitian Creole",
    nativeName: "Kreyòl Ayisyen",
    direction: "ltr",
    flag: "🇭🇹",
    category: "international",
    completeness: "community-contributed",
  },
  {
    code: "lou",
    name: "Louisiana Creole",
    nativeName: "Kréyòl Lalwizyàn",
    direction: "ltr",
    flag: "🇺🇸",
    category: "international",
    completeness: "community-contributed",
  },

  // African Languages
  {
    code: "sw",
    name: "Swahili",
    nativeName: "Kiswahili",
    direction: "ltr",
    flag: "🇹🇿",
    category: "international",
    completeness: "community-contributed",
  },
  {
    code: "yo",
    name: "Yoruba",
    nativeName: "Èdè Yorùbá",
    direction: "ltr",
    flag: "🇳🇬",
    category: "international",
    completeness: "community-contributed",
  },
  {
    code: "zu",
    name: "Zulu",
    nativeName: "isiZulu",
    direction: "ltr",
    flag: "🇿🇦",
    category: "international",
    completeness: "community-contributed",
  },
  {
    code: "am",
    name: "Amharic",
    nativeName: "አማርኛ",
    direction: "ltr",
    flag: "🇪🇹",
    category: "international",
    completeness: "community-contributed",
  },

  // First Nations Languages
  {
    code: "cre",
    name: "Cree",
    nativeName: "ᓀᐦᐃᔭᐍᐏᐣ (Nêhiyawêwin)",
    direction: "ltr",
    flag: "🪶",
    category: "first_nations",
    completeness: "community-contributed",
  },
  {
    code: "iku",
    name: "Inuktitut",
    nativeName: "ᐃᓄᒃᑎᑐᑦ",
    direction: "ltr",
    flag: "🪶",
    category: "first_nations",
    completeness: "community-contributed",
  },
  {
    code: "oji",
    name: "Ojibwe",
    nativeName: "Anishinaabemowin",
    direction: "ltr",
    flag: "🪶",
    category: "first_nations",
    completeness: "community-contributed",
  },
  {
    code: "moh",
    name: "Mohawk",
    nativeName: "Kanien’kéha",
    direction: "ltr",
    flag: "🪶",
    category: "first_nations",
    completeness: "community-contributed",
  },
  {
    code: "mic",
    name: "Mi'kmaq",
    nativeName: "Mi'kmawi'simk",
    direction: "ltr",
    flag: "🪶",
    category: "first_nations",
    completeness: "community-contributed",
  },
  {
    code: "den",
    name: "Dene",
    nativeName: "Dene K'e",
    direction: "ltr",
    flag: "🪶",
    category: "first_nations",
    completeness: "community-contributed",
  },
];

export const defaultLocale: LocaleCode = "fr";

export const ALL_LOCALES = languages;
export const BASE_LOCALES = languages.filter((lang) => ["en", "fr"].includes(lang.code));

export const getLanguage = (code: LocaleCode): Language | undefined =>
  ALL_LOCALES.find((lang) => lang.code === code);

export const getSupportedLanguage = (code: LocaleCode): Language | undefined =>
  ALL_LOCALES.find((lang) => lang.code === code);

export const getLanguagesByCategory = (category: Language["category"]): Language[] =>
  ALL_LOCALES.filter((lang) => lang.category === category);

export const isRTL = (code: LocaleCode): boolean => getLanguage(code)?.direction === "rtl";

const allLocaleCodes = languages.map((l) => l.code) as LocaleCode[];
const rtlLocaleCodes = languages
  .filter((l) => l.direction === "rtl")
  .map((l) => l.code) as LocaleCode[];

export const i18nConfig = createI18nConfig<LocaleCode>({
  cookieName: "libra-keeper-locale",
  storageKey: "libra-keeper-locale",
  defaultLocale: "fr" as LocaleCode,
  supportedLocales: allLocaleCodes,
  rtlLocales: rtlLocaleCodes,
});

export const { COOKIE_NAME, STORAGE_KEY } = i18nConfig;

// Alias for backwards compatibility with LanguageSelector component
export const SUPPORTED_LOCALES = BASE_LOCALES;

// Type alias for backwards compatibility
export type Locale = LocaleCode;
