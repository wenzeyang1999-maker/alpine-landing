import { defineConfig, devices } from "@playwright/test";

/**
 * E2E config for the investor portal.
 *
 * The authenticated specs require the investor migrations (020 + 021) to have
 * been run against the Supabase instance the dev server points at. The public
 * specs (login render, logged-out redirect) need only the dev server.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: { timeout: 7_000 },
  fullyParallel: false,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3001",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "next dev -p 3001",
    url: "http://localhost:3001/login",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
