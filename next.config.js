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
  async rewrites() {
    return [
      // Friendly URL for the Mercer demo. The page keeps its own server-side
      // demo gate; API calls are absolute (/api/demo/valuation/*) so they work
      // unchanged under this path.
      { source: "/mercerdemo", destination: "/demo/valuation" },
    ];
  },
  experimental: {
    outputFileTracingIncludes: {
      "/api/whitepaper/download": ["./docs/whitepaper.pdf"],
      // Ship the 3 curated funds' cached filings so the citation viewer (full
      // real 10-K, jumped + highlighted) and the context route work in prod.
      // The corpus is otherwise gitignored; only these 3 CIKs are committed.
      "/api/demo/valuation/filing": [
        "./lib/engine/.data/stage1/funds/0001287750/tenk.htm.gz",
        "./lib/engine/.data/stage1/funds/0001736035/tenk.htm.gz",
        "./lib/engine/.data/stage1/funds/0001655888/tenk.htm.gz",
      ],
      "/api/demo/valuation/context": [
        "./lib/engine/.data/stage1/funds/0001287750/tenk.norm.txt",
        "./lib/engine/.data/stage1/funds/0001736035/tenk.norm.txt",
        "./lib/engine/.data/stage1/funds/0001655888/tenk.norm.txt",
      ],
    },
    // Keep Playwright (headless-Chromium PDF generation) and pdfjs-dist (two-pass
    // TOC text extraction) out of the webpack bundle so the standalone server
    // requires them from node_modules at runtime (Chromium comes from the
    // Playwright base image, not the bundle).
    serverComponentsExternalPackages: ["playwright", "playwright-core", "pdfjs-dist"],
  },
};

module.exports = nextConfig;
