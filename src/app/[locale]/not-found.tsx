import Link from "next/link"
import { getTranslations } from "next-intl/server"

export default async function NotFound() {
  // Use getTranslations on the server
  const t = await getTranslations("NotFound")

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 text-center">
        <div className="text-6xl font-bold text-gray-900">404</div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t("title", "Page Not Found")}
        </h1>
        <p className="mt-2 text-gray-600">
          {t("message", "The page you are looking for does not exist.")}
        </p>
        <div className="mt-6">
          <Link
            href="/en"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {t("backToHome", "Go back home")}
          </Link>
        </div>
      </div>
    </div>
  )
}
