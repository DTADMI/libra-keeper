import Link from "next/link";
import { getServerTranslations } from "@/lib/i18n/server";

export const revalidate = 3600;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { t } = await getServerTranslations();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex flex-col">
        <h1 className="text-4xl font-bold mb-8">{t("Index.title")}</h1>
        <p className="text-xl mb-8">{t("Index.description")}</p>

        <div className="flex gap-4 mt-8">
          <Link
            href="/auth/signin"
            className="rounded-lg bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90"
          >
            {t("Navigation.signIn")}
          </Link>
          <Link
            href="/auth/register"
            className="rounded-lg border border-primary px-6 py-3 text-primary hover:bg-primary/10"
          >
            {t("Navigation.register")}
          </Link>
        </div>
      </div>
    </main>
  );
}