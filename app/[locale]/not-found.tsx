import Link from "next/link";
import { getServerTranslations } from "@/lib/i18n/server";

export default async function NotFound() {
  const { t } = await getServerTranslations();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 text-center">
        <div className="text-6xl font-bold text-gray-900">404</div>
        <h1 className="text-3xl font-bold text-gray-900">{t("NotFound.title")}</h1>
        <p className="mt-2 text-gray-600">
          {t("NotFound.message")}
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {t("Navigation.home")}
        </Link>
      </div>
    </div>
  );
}