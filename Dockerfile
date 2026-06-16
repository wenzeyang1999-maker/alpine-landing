# syntax=docker/dockerfile:1
# ─────────────────────────────────────────────────────────────────────────────
# Alpine Landing — containerized for Azure App Service so the investor report
# PDF route can run headless Chromium (Playwright). The build stage produces the
# Next.js standalone bundle; the runtime stage is Microsoft's Playwright image,
# which ships Chromium + every system library it needs, version-matched to the
# `playwright` npm package (1.60.0).
# ─────────────────────────────────────────────────────────────────────────────

# ===== build =====
FROM node:22-bookworm AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Install deps first (cached). Skip the browser download here — Chromium comes
# from the Playwright base image at runtime, not from the bundle.
COPY package.json package-lock.json ./
RUN PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm ci

COPY . .

# NEXT_PUBLIC_* are inlined into the client bundle at build time, so they must
# carry the real production values (passed as build args by CI). RESEND_API_KEY
# is only needed so the module-load `new Resend(...)` doesn't throw during build;
# the real key is read from App Service env at runtime.
ARG NEXT_PUBLIC_BLOB_BASE_URL
ARG NEXT_PUBLIC_NOTES_TOKEN
ENV NEXT_PUBLIC_BLOB_BASE_URL=$NEXT_PUBLIC_BLOB_BASE_URL \
    NEXT_PUBLIC_NOTES_TOKEN=$NEXT_PUBLIC_NOTES_TOKEN \
    RESEND_API_KEY=re_build_placeholder_not_used_at_runtime \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
RUN npm run build

# ===== runtime =====
FROM mcr.microsoft.com/playwright:v1.60.0-jammy AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000 \
    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# Next's `output: "standalone"` emits a self-contained server but does NOT copy
# static assets or /public — bring them in alongside it.
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
