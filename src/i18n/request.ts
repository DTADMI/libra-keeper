import { getRequestConfig } from "next-intl/server"

export default getRequestConfig(async () => {
  // Provide a static locale, fetch it from a user setting,
  // or use a strategy like the one in the middleware.
  const locale = "en"

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
