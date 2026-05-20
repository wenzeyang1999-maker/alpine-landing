import { NextRequest, NextResponse } from "next/server";
import { SESSION, cookieOptions, verifySession } from "@/lib/auth-session";
import { isAppAdmin } from "@/lib/app-allowlist";
import { logAudit } from "@/lib/audit-log";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION.COOKIE_NAME)?.value ?? null;
  const email = await verifySession(token);

  const res = NextResponse.json({ ok: true });
  const opts = cookieOptions(process.env.NODE_ENV === "production");
  res.cookies.set(SESSION.COOKIE_NAME, "", { ...opts, maxAge: 0 });

  if (email && isAppAdmin(email)) {
    await logAudit({ actor: email, action: "auth.logout" });
  }
  return res;
}
