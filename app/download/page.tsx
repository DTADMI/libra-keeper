"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function DownloadPage() {
  const { t } = useI18n();

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8">
      <section className="rounded-xl border border-border bg-card p-6">
        <h1 className="text-2xl font-semibold">{t("PWA.downloadTitle")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("PWA.downloadDescription")}
        </p>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">iOS Safari</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
          <li>{t("PWA.iosStep1")}</li>
          <li>{t("PWA.iosStep2")}</li>
          <li>{t("PWA.iosStep3")}</li>
          <li>{t("PWA.iosStep4")}</li>
        </ol>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Android / Chromium</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
          <li>{t("PWA.androidStep1")}</li>
          <li>{t("PWA.androidStep2")}</li>
          <li>{t("PWA.androidStep3")}</li>
        </ol>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">{t("PWA.offlineFallback")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("PWA.offlineFallbackDesc")}
        </p>
        <div className="mt-4 flex gap-3">
          <Link className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" href="/">
            {t("PWA.backHome")}
          </Link>
          <Link className="rounded-md border border-border px-4 py-2 text-sm font-medium" href="/offline">
            {t("PWA.openOffline")}
          </Link>
        </div>
      </section>
    </main>
  );
}
