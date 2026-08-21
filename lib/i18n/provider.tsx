"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import { i18nConfig } from "./config";
import translationsMap from "./translations/map";
import type { LocaleCode } from "./config";

function createClientI18n<Locale extends string>(opts: {
  config: { cookieName: string; storageKey: string; defaultLocale: string; supportedLocales: string[]; rtlLocales: string[]; [key: string]: unknown };
  translationsMap: Record<string, Record<string, unknown>>;
  fallbackLocale: Locale;
}) {
  const { config, translationsMap, fallbackLocale } = opts;

  const I18nContext = createContext<{
    locale: Locale; setLocale: (next: Locale) => void;
    t: (key: string, params?: Record<string, unknown>) => string;
  }>({ locale: config.defaultLocale as Locale, setLocale: () => {}, t: (key: string) => key });

  function I18nProvider({ children, initialLocale }: { children: ReactNode; initialLocale?: string }) {
    const [locale, setLocaleState] = useState<Locale>((initialLocale as Locale) || config.defaultLocale as Locale);
    // Sync with server when router.refresh() changes initialLocale (e.g., language toggle).
    // Without this, useState ignores changes to initialLocale after mount.
    const initialRef = useRef(initialLocale);
    useEffect(() => {
      const next = initialLocale;
      if (next && next !== initialRef.current) {
        initialRef.current = next;
        setLocaleState(next as Locale);
      }
    }, [initialLocale]);
    const setLocale = useCallback((next: Locale) => {
      setLocaleState(next);
      try { localStorage.setItem(config.storageKey, next); } catch {}
      try { document.cookie = `${config.cookieName}=${next};path=/;max-age=31536000`; } catch {}
    }, []);
    const t = useCallback((key: string, params?: Record<string, unknown>): string => {
      const tMap = translationsMap[locale] || translationsMap[fallbackLocale as string] || {};
      const keys = key.split("."); let v: unknown = tMap;
      for (const k of keys) { if (v && typeof v === "object" && k in v) v = (v as Record<string, unknown>)[k]; else return key; }
      let r = String(v ?? key);
      if (params) for (const [pk, pv] of Object.entries(params)) r = r.replace(`{{${pk}}}`, String(pv));
      return r;
    }, [locale]);
    return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>;
  }
  function useI18n() { return useContext(I18nContext); }
  function useTranslation() { return useContext(I18nContext); }
  return { I18nProvider, useI18n, useTranslation };
}

const { I18nProvider, useI18n, useTranslation } = createClientI18n<LocaleCode>({
  config: i18nConfig, translationsMap, fallbackLocale: "en" as LocaleCode,
});
export { I18nProvider, useI18n, useTranslation };
