import { cookies, headers } from "next/headers";
import { i18nConfig } from "./config";
import translationsMap from "./translations/map";

type Config = {
  cookieName: string; storageKey: string; defaultLocale: string;
  supportedLocales: string[]; rtlLocales: string[];
};

function createServerI18n(
  config: Config, translations: Record<string, Record<string, unknown>>, fallbackLocale: string,
) {
  async function resolveLocale(): Promise<string> {
    try { const c = await cookies(); const v = c.get(config.cookieName)?.value;
      if (v && config.supportedLocales.includes(v)) return v; } catch {}
    try { const h = await headers(); const m = (h.get("accept-language")||"").match(/[a-z]{2}(?:-[A-Z]{2})?/g);
      if (m) for (const l of m) { const b = l.split("-")[0].toLowerCase();
        if (config.supportedLocales.includes(b)) return b; } } catch {}
    return config.defaultLocale;
  }
  async function getServerTranslations() {
    // Warm caches if needed (non-blocking, fire-and-forget)
    // prefetchRates().catch(() => {});

    const locale = await resolveLocale();
    const t = translations[locale] || translations[fallbackLocale] || {};
    function tr(key: string, params?: Record<string, unknown>): string {
      const keys = key.split("."); let v: unknown = t;
      for (const k of keys) { if (v && typeof v === "object" && k in v) v = (v as Record<string, unknown>)[k]; else return key; }
      let r = String(v ?? key);
      if (params) for (const [pk, pv] of Object.entries(params)) r = r.replace(`{{${pk}}}`, String(pv));
      return r;
    }
    return { locale: locale as string, t: tr };
  }
  return { getServerTranslations, resolveLocale };
}

const { getServerTranslations, resolveLocale } = createServerI18n(i18nConfig, translationsMap, "en" as const);
export { getServerTranslations, resolveLocale };
