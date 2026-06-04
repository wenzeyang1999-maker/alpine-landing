/** @type {import('next').NextConfig} */
const nextConfig = {
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "media.licdn.com" },
    ],
  },
  experimental: {
    // Playwright (used by /api/investor/report-pdf for headless-Chromium PDF
    // generation) ships native binaries and dynamic requires — keep it external
    // so the server bundle requires it at runtime instead of bundling it.
    serverComponentsExternalPackages: ["playwright", "playwright-core"],
    outputFileTracingIncludes: {
      "/api/whitepaper/download": ["./docs/whitepaper.pdf"],
    },
  },
};

module.exports = nextConfig;
