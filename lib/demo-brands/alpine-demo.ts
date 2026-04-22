import type { DemoBrand } from "../demo-brand-types";
import { mockApi } from "../mock-api";
// When connecting a real backend, replace mockApi with:
// import { createDemoApi } from "../demo-api-factory";
// const api = createDemoApi("/api/demo/v2", "/api/demo/v2/mon-agent");

export const alpineDemoBrand: DemoBrand = {
  name: "Alpine ODD",
  slug: "alpine",
  logoSrc: "/alpine-icon.svg",
  portfolioHref: "/portfolio",
  reviewHref: (slug: string) => `/review/${slug}`,
  demoBase: "/",
  userStorageKey: "alpine_demo_user",
  themeStorageKey: "alpine_demo_theme",
  tourPrefix: "alpine-demo-tour",
  emailPlaceholder: "you@allocator.com",
  credentials: [
    { name: "Demo User", email: "demo@alpinedd.com", role: "Demo", password: "demo123" },
  ],
  api: mockApi,
};
