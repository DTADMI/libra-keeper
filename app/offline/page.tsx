"use client";

import { useTranslations } from "next-intl";

export default function OfflinePage() {
  const t = useTranslations("PWA");

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8">
      <section className="rounded-xl border border-border bg-card p-6">
        <h1 className="text-2xl font-semibold">{t("offlineTitle")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("offlineMessage")}
        </p>
      </section>
    </main>
  );
}
