import type { NextConfig } from "next"
import path from "path"

// Only apply PWA in production or when explicitly enabled in development
const withPWA = process.env.ENABLE_PWA === "true" ? require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV !== "production",
}) : (config: NextConfig) => config;

const nextConfig: NextConfig = withPWA({
  // Disable experimental features that might cause issues
  experimental: {
    // Add any experimental features you want to enable here
    turbopack: {
      // Set the root directory for Turbopack to current directory
    },
    outputFileTracingRoot: path.join(__dirname),
  },
  // Configure output file tracing to handle multiple lockfiles
  output: "standalone",
  // Your other Next.js config options here
});

export default nextConfig;
