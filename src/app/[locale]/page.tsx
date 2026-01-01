import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function Home({
                                     params: { locale },
                                   }: {
  params: { locale: string }
}) {
  // Use getTranslations on the server
  const t = await getTranslations("Index")

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex flex-col">
        <h1 className="text-4xl font-bold mb-8">{t("title")}</h1>
        <p className="text-xl mb-8">{t("description")}</p>

        <nav className="flex gap-4">
          <Link href={`/${locale}/books`} className="hover:underline">
            {t("Navigation.books")}
          </Link>
          <Link href={`/${locale}/borrowers`} className="hover:underline">
            {t("Navigation.borrowers")}
          </Link>
          <Link href={`/${locale}/settings`} className="hover:underline">
            {t("Navigation.settings")}
          </Link>
        </nav>
      </div>
    </main>
  )
}

// Generate static params for all locales
export async function generateStaticParams() {
  return [{ locale: "en" }]
}
