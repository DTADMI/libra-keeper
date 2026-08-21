export { I18nProvider, useI18n, useTranslation } from "./provider";
export {
  SUPPORTED_LOCALES,
  defaultLocale,
  getLanguage,
  getSupportedLanguage,
  getLanguagesByCategory,
  isRTL,
  i18nConfig,
  COOKIE_NAME,
  STORAGE_KEY,
  type Completeness,
  type LocaleCode,
  type Locale,
  type Language,
} from "./config";
export type Translations = Record<string, unknown>;
