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
  output: "standalone",
  outputFileTracingRoot: __dirname,

  experimental: {},

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://*.supabase.co https://*.googleusercontent.com",
              "font-src 'self'",
              "connect-src 'self' https://*.upstash.io https://*.supabase.co https://api.resend.com",
              "frame-src 'self'",
              "worker-src 'self' blob:",
              "manifest-src 'self'",
            ].join("; "),
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ]
  },
}));

export default nextConfig;
