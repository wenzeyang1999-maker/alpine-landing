/**
 * Demo Brand Configuration Type
 *
 * Defines the shape of a brand config object used by shared demo components.
 */

import type { DemoApi } from "./demo-api-factory";

export interface DemoBrandCredential {
  name: string;
  email: string;
  role: string;
  password: string;
}

export interface DemoBrandLoginPanel {
  /** Headline text on the left branding panel */
  headline: string;
  /** Description paragraph */
  description: string;
  /** Feature pill labels */
  features: string[];
  /** Stats row */
  stats: { value: string; label: string; color?: string }[];
}

export interface DemoBrand {
  /** Display name (e.g., "BlackRock", "Ewing Morris") */
  name: string;
  /** URL-safe slug (e.g., "blackrock", "ewingmorris") */
  slug: string;
  /** Path to logo SVG in /public/ */
  logoSrc: string;
  /** Portfolio page route */
  portfolioHref: string;
  /** Review detail page route builder */
  reviewHref: (slug: string) => string;
  /** Demo base route (e.g., "/blackrock/demo2") */
  demoBase: string;
  /** localStorage key for user data */
  userStorageKey: string;
  /** localStorage key for theme preference */
  themeStorageKey: string;
  /** Prefix for tour localStorage keys */
  tourPrefix: string;
  /** Email placeholder on login form */
  emailPlaceholder: string;
  /** Demo credentials shown on login page */
  credentials: DemoBrandCredential[];
  /** API client instance */
  api: DemoApi;
  /** Optional left-panel config for login page (defaults to Alpine branding) */
  loginPanel?: DemoBrandLoginPanel;
}
