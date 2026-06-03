/** @type {import('next').NextConfig} */
const nextConfig = {
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
  },
};

module.exports = nextConfig;
