"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function DownloadPage() {
  const t = useTranslations("PWA");

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8">
      <section className="rounded-xl border border-border bg-card p-6">
        <h1 className="text-2xl font-semibold">{t("downloadTitle")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("downloadDescription")}
        </p>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">iOS Safari</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
          <li>{t("iosStep1")}</li>
          <li>{t("iosStep2")}</li>
          <li>{t("iosStep3")}</li>
          <li>{t("iosStep4")}</li>
        </ol>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Android / Chromium</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
          <li>{t("androidStep1")}</li>
          <li>{t("androidStep2")}</li>
          <li>{t("androidStep3")}</li>
        </ol>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">{t("offlineFallback")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("offlineFallbackDesc")}
        </p>
        <div className="mt-4 flex gap-3">
          <Link className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" href="/">
            {t("backHome")}
          </Link>
          <Link className="rounded-md border border-border px-4 py-2 text-sm font-medium" href="/offline">
            {t("openOffline")}
          </Link>
        </div>
      </section>
    </main>
  );
}
