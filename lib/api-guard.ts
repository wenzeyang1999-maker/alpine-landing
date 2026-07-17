import { NextResponse } from "next/server";
import { getAppAdminEmail } from "@/lib/app-portal/auth-session";

/**
 * Route guard for admin-only API routes. Reads the signed `alpine_session`
 * cookie (domain .alpinedd.com, so present on both the apex and app hosts),
 * verifies the HMAC, and checks the email against the admin allowlist.
 *
 * Returns a 401 NextResponse when the caller is not an authenticated admin, or
 * null when the request may proceed. Usage:
 *
 *   const denied = await requireAdmin(req);
 *   if (denied) return denied;
 */
export async function requireAdmin(req: Request): Promise<NextResponse | null> {
  const email = await getAppAdminEmail(req);
  if (!email) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return null;
}
