import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { verifyPassword, DUMMY_HASH } from "@/lib/auth/password";
import { signSession, SESSION, cookieOptions, isAppAdmin } from "@/lib/app-portal/auth-session";
import { logAudit } from "@/lib/app-portal/audit-log";

const DEMO_EMAIL = "demo@alpinedd.com";
const DEMO_PASSWORD = "demo123";

// Only mint the cross-subdomain HMAC cookie for emails on the app allowlist —
// defense in depth so non-admin Supabase users never carry a valid cookie
// even if a per-API gate is ever missed.
async function setSessionCookieIfAdmin(res: NextResponse, email: string) {
  if (!isAppAdmin(email)) return;
  const token = await signSession(email);
  res.cookies.set(SESSION.COOKIE_NAME, token, cookieOptions(process.env.NODE_ENV === "production"));
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    // Demo shortcut — always gets demo access
    if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
      const res = NextResponse.json({
        user: { email: DEMO_EMAIL, full_name: "Demo User", role: "analyst" },
        demo_access: true,
      });
      await setSessionCookieIfAdmin(res, DEMO_EMAIL);
      if (isAppAdmin(DEMO_EMAIL)) await logAudit({ actor: DEMO_EMAIL, action: "auth.login" });
      return res;
    }

    // Verify credentials against our own users table (scrypt). Identical 401 for
    // unknown email, unverified account, and bad password; dummy verify on miss
    // so response timing doesn't reveal account existence.
    const normalizedEmail = email.trim().toLowerCase();
    let row: { fullName: string | null; role: string; passwordHash: string | null; isVerified: boolean } | undefined;
    try {
      [row] = await db
        .select({ fullName: users.fullName, role: users.role, passwordHash: users.passwordHash, isVerified: users.isVerified })
        .from(users)
        .where(eq(users.email, normalizedEmail))
        .limit(1);
    } catch {
      row = undefined;
    }

    const passwordOk = verifyPassword(password, row?.passwordHash ?? DUMMY_HASH);
    if (!row || !row.passwordHash || !row.isVerified || !passwordOk) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const res = NextResponse.json({
      user: {
        email: normalizedEmail,
        full_name: row.fullName ?? email,
        role: row.role ?? "analyst",
      },
      demo_access: false,
    });
    await setSessionCookieIfAdmin(res, normalizedEmail);
    if (isAppAdmin(normalizedEmail)) await logAudit({ actor: normalizedEmail, action: "auth.login" });
    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
