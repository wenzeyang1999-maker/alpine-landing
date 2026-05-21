import { test, expect } from "@playwright/test";

const DEMO_EMAIL = "demo@alpinedd.com";
const DEMO_PASSWORD = "demo123";

// ── Public surface — needs only the dev server ───────────────────────────────
test.describe("Investor portal — public surface", () => {
  test("/login renders the investor login form with no public signup", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /sign in to your odd report/i })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("link", { name: /create an account/i })).toHaveCount(0);
  });

  test("/reports redirects to /login when logged out", async ({ page }) => {
    await page.goto("/reports");
    await expect(page).toHaveURL(/\/login/);
  });
});

// ── Authenticated flow — requires the investor migrations + seed to be run ──
// (020_investor_portal.sql + 021_investor_seed.sql applied to Supabase).
test.describe("Investor portal — authenticated flow (requires seeded DB)", () => {
  test("invalid credentials show a generic error", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("nobody@example.com");
    await page.getByLabel("Password").fill("wrong-password");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
  });

  async function login(page: import("@playwright/test").Page) {
    await page.goto("/login");
    await page.getByLabel("Email").fill(DEMO_EMAIL);
    await page.getByLabel("Password").fill(DEMO_PASSWORD);
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/reports/);
  }

  test("demo investor logs in and sees the two seeded reports", async ({ page }) => {
    await login(page);
    await expect(page.getByText(/Aurora Ventures IV/i)).toBeVisible();
    await expect(page.getByText(/Trellis Capital IV/i)).toBeVisible();
  });

  test("opening a report shows the reader with sections", async ({ page }) => {
    await login(page);
    await page.getByText(/Aurora Ventures IV/i).first().click();
    await expect(page).toHaveURL(/\/reports\/aurora-capital-iv/);
    await expect(page.getByRole("heading", { name: "Overview", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Executive Brief/i }).first()).toBeVisible();
  });

  test("an unknown / unassigned report slug 404s (no existence leak)", async ({ page }) => {
    await login(page);
    await page.goto("/reports/ridgeline-capital-partners");
    await expect(page.getByText(/report not available/i)).toBeVisible();
  });
});
