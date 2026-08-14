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
    const rules = [
      // Friendly URL for the Mercer demo. The page keeps its own server-side
      // demo gate; API calls are absolute (/api/demo/valuation/*) so they work
      // unchanged under this path.
      { source: "/mercerdemo", destination: "/demo/valuation" },
    ];
    // Morningside OS demo: proxy /morningsidedemo to its own Web App. The
    // target app is built with basePath "/morningsidedemo", so paths pass
    // through unchanged. NOTE: rewrites() is evaluated at BUILD time, so the
    // destination must be known here — a runtime app-setting cannot toggle it.
    // The hostname is stable and public; the demo carries its own access gate.
    const MORNINGSIDE_DEMO_ORIGIN =
      process.env.MORNINGSIDE_DEMO_ORIGIN ||
      "https://morningside-web-g6hebzbxc0eqaah3.canadacentral-01.azurewebsites.net";
    rules.push(
      { source: "/morningsidedemo", destination: `${MORNINGSIDE_DEMO_ORIGIN}/morningsidedemo` },
      { source: "/morningsidedemo/:path*", destination: `${MORNINGSIDE_DEMO_ORIGIN}/morningsidedemo/:path*` },
    );
    return rules;
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
