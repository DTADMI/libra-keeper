"use client";

import { useI18n } from "@/lib/i18n";

export default function OfflinePage() {
  const { t } = useI18n();

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8">
      <section className="rounded-xl border border-border bg-card p-6">
        <h1 className="text-2xl font-semibold">{t("PWA.offlineTitle")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("PWA.offlineMessage")}
        </p>
      </section>
    </main>
  );
}
