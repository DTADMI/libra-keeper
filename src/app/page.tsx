// src/app/page.tsx
import { useTranslations } from "next-intl"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  const t = useTranslations("HomePage")

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">{t("title")}</h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">{t("description")}</p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild size="lg">
            <Link href="/dashboard">{t("getStarted")}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/about">{t("learnMore")}</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
