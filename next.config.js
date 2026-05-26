/** @type {import('next').NextConfig} */
const nextConfig = {
  skipTrailingSlashRedirect: true,
  experimental: {
    outputFileTracingIncludes: {
      "/api/whitepaper/download": ["./docs/whitepaper.pdf"],
    },
  },
};

module.exports = nextConfig;
