import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

// Only apply PWA in production or when explicitly enabled in development
const withPWA =
  process.env.ENABLE_PWA === "true" || process.env.NODE_ENV === "production"
    ? require("next-pwa")({
      dest: "public",
      register: false,
      disable: process.env.NODE_ENV !== "production",
    })
    : (config: NextConfig) => config
const withNextIntl = createNextIntlPlugin("./next-intl.config.ts")

const nextConfig: NextConfig = withNextIntl(withPWA({
  // Configure output file tracing
  output: "standalone",

  // Set the root directory for file tracing
  outputFileTracingRoot: __dirname,

  // Your other Next.js config options here
  experimental: {
    // Add any experimental features here
  },
}));

export default nextConfig;
