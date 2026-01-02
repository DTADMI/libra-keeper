import type { NextConfig } from "next"

// Only apply PWA in production or when explicitly enabled in development
const withPWA =
  process.env.ENABLE_PWA === "true"
    ? require("next-pwa")({
      dest: "public",
      disable: process.env.NODE_ENV !== "production",
    })
    : (config: NextConfig) => config

const nextConfig: NextConfig = withPWA({
  // Configure output file tracing
  output: "standalone",

  // Set the root directory for file tracing
  outputFileTracingRoot: __dirname,

  // Your other Next.js config options here
  experimental: {
    // Add any experimental features here
  },
});

export default nextConfig;
