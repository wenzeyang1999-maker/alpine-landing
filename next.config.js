/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained server bundle for Azure App Service deploy (node server.js).
  output: "standalone",
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "media.licdn.com" },
    ],
  },
  experimental: {
    outputFileTracingIncludes: {
      "/api/whitepaper/download": ["./docs/whitepaper.pdf"],
    },
    // Keep Playwright out of the webpack bundle so the standalone server
    // requires it from node_modules at runtime (Chromium comes from the
    // Playwright base image, not the bundle).
    serverComponentsExternalPackages: ["playwright", "playwright-core"],
  },
};

module.exports = nextConfig;
