/**
 * Server-side helper: resolve the currently authenticated manager from the
 * `manager_session` cookie.  Node runtime ONLY (uses Supabase service role).
 * Safe to call from API routes and Server Components — never from middleware.
 */

import { cookies } from "next/headers";
import { verifySession, MANAGER_SESSION } from "./auth-session";
import { managerDb } from "./db";

export interface ManagerUser {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  is_verified: boolean;
  job_title: string | null;
  firm_id: string;
  firm_name: string | null;
}

type UserRow = {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  is_verified: boolean;
  job_title: string | null;
  firm_id: string;
};

type FirmRow = { name: string };

/**
 * Returns the authenticated manager user, or null if not signed in / session
 * expired / user no longer exists in the database.
 */
export async function getCurrentManager(): Promise<ManagerUser | null> {
  const jar = await cookies();
  const token = jar.get(MANAGER_SESSION.COOKIE_NAME)?.value;
  const email = await verifySession(token);
  if (!email) return null;

  const db = managerDb();
  const { data: userRaw } = await db
    .from("users")
    .select("id, email, full_name, role, is_verified, job_title, firm_id")
    .eq("email", email)
    .maybeSingle();

  const user = userRaw as UserRow | null;
  if (!user) return null;

  const { data: firmRaw } = await db
    .from("firms")
    .select("name")
    .eq("id", user.firm_id)
    .maybeSingle();

  const firm = firmRaw as FirmRow | null;

  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name ?? null,
    role: user.role ?? "member",
    is_verified: user.is_verified ?? false,
    job_title: user.job_title ?? null,
    firm_id: user.firm_id,
    firm_name: firm?.name ?? null,
  };
}

/**
 * Asserts the current request is authenticated.
 * Throws a `Response` with 401 status if not — use inside API routes:
 *   const user = await requireManager();
 */
export async function requireManager(): Promise<ManagerUser> {
  const user = await getCurrentManager();
  if (!user) throw new Response("Unauthorized", { status: 401 });
  return user;
}
