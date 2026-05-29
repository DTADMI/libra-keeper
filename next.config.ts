import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Only apply PWA in production or when explicitly enabled in development
const withPWA =
  process.env.ENABLE_PWA === "true" || process.env.NODE_ENV === "production"
    ? require("next-pwa")({
        dest: "public",
        register: false,
        disable: process.env.NODE_ENV !== "production",
      })
    : (config: NextConfig) => config;
const withNextIntl = createNextIntlPlugin("./next-intl.config.ts");

const nextConfig: NextConfig = withNextIntl(
  withPWA({
    output: "standalone",
    outputFileTracingRoot: __dirname,
    experimental: {
      staleTimes: {
        dynamic: 30,
        static: 300,
      },
      optimizePackageImports: [
        "lucide-react",
        "date-fns",
        "@radix-ui/react-accordion",
        "@radix-ui/react-alert-dialog",
        "@radix-ui/react-avatar",
        "@radix-ui/react-checkbox",
        "@radix-ui/react-collapsible",
        "@radix-ui/react-context-menu",
        "@radix-ui/react-dialog",
        "@radix-ui/react-dropdown-menu",
        "@radix-ui/react-label",
        "@radix-ui/react-menubar",
        "@radix-ui/react-navigation-menu",
        "@radix-ui/react-popover",
        "@radix-ui/react-radio-group",
        "@radix-ui/react-scroll-area",
        "@radix-ui/react-select",
        "@radix-ui/react-separator",
        "@radix-ui/react-slider",
        "@radix-ui/react-slot",
        "@radix-ui/react-switch",
        "@radix-ui/react-tabs",
        "@radix-ui/react-toast",
        "@radix-ui/react-toggle",
        "@radix-ui/react-tooltip",
      ],
    },
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
      ];
    },
  }),
);

export default nextConfig;
