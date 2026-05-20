/**
 * The single source of truth for which emails can access app.alpinedd.com.
 *
 * Edge-compatible (no Node APIs) so middleware can import it directly.
 *
 * To grant or revoke a teammate, edit this list, redeploy, and (optionally)
 * sync the public.app_admins Supabase table via /admin/admins UI.
 */
export const APP_ADMIN_ALLOWLIST: ReadonlySet<string> = new Set([
  "awen@alpinedd.com",
  "azhang@alpinedd.com",
  "zkaishen@gmail.com",
  // Demo account — credentials handled by the demo shortcut in
  // app/api/app-portal/auth/login (demo@alpinedd.com / demo123). Listed here so
  // it clears the login-page gate, the cookie-minting check, and middleware.
  "demo@alpinedd.com",
]);

export function isAppAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return APP_ADMIN_ALLOWLIST.has(email.trim().toLowerCase());
}
