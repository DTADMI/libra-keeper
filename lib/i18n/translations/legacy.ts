import en from "./en";
import type { LegacyTranslationStrings, Translations, TranslationsBase } from "./types";

function cloneTranslations(): TranslationsBase {
  return JSON.parse(JSON.stringify(en)) as TranslationsBase;
}

/**
 * Recursively merge string leaves from `source` into `target`.
 * Never throws on missing namespaces: it creates empty objects as needed and
 * skips null/undefined/array values. This replaces the previous QuestHunt-
 * specific per-field mapping (which referenced namespaces that do not exist in
 * LibraKeeper — `hero`, `features`, `cta`, `quests`, `settings`, `pages` — and
 * crashed at build time with "Cannot set properties of undefined").
 */
function deepMergeStrings(target: Record<string, unknown>, source: Record<string, unknown>): void {
  for (const [k, v] of Object.entries(source)) {
    if (v == null) continue;
    if (typeof v === "string") {
      target[k] = v;
    } else if (typeof v === "object" && !Array.isArray(v)) {
      const existing = target[k];
      if (typeof existing !== "object" || existing == null || Array.isArray(existing)) {
        target[k] = {};
      }
      deepMergeStrings(target[k] as Record<string, unknown>, v as Record<string, unknown>);
    }
  }
}

export function createLegacyTranslations(legacy: LegacyTranslationStrings): Translations {
  const translations = cloneTranslations() as TranslationsBase;
  const target = translations as unknown as Record<string, unknown>;

  // Case-insensitive namespace resolution so legacy `nav` maps to canonical
  // `Navigation`, `auth` → `Auth`, `dashboard` → `Dashboard`, `profile` → `Profile`.
  const canonicalKeys = Object.keys(target);
  const resolve = (k: string): string =>
    canonicalKeys.find((ck) => ck.toLowerCase() === k.toLowerCase()) ?? k;

  for (const [legacyKey, legacyVal] of Object.entries(legacy as Record<string, unknown>)) {
    if (legacyVal == null || typeof legacyVal !== "object" || Array.isArray(legacyVal)) continue;
    const canonKey = resolve(legacyKey);
    // Only merge into namespaces that actually exist in LibraKeeper's canonical
    // structure. QuestHunt leftovers (landing, quests, settings, success, …) are
    // skipped — they fall back to English until a proper per-locale migration.
    if (!(canonKey in target)) continue;
    deepMergeStrings(target[canonKey] as Record<string, unknown>, legacyVal as Record<string, unknown>);
  }

  return translations as Translations;
}
