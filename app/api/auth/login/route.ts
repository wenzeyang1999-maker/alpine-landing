import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { signSession, SESSION, cookieOptions } from "@/lib/auth-session";
import { isAppAdmin } from "@/lib/app-allowlist";
import { logAudit } from "@/lib/audit-log";

const DEMO_EMAIL = "demo@alpinedd.com";
const DEMO_PASSWORD = "demo123";

// Only mint the cross-subdomain HMAC session cookie for emails that belong on
// app.alpinedd.com. Demo / regular users still get the JSON user payload (which
// the marketing site puts in localStorage), but they never carry a valid cookie
// to the app subdomain — defense in depth on top of per-API gates.
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

    // Verify credentials against Supabase Auth
    const authRes = await fetch(`${process.env.SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
      },
      body: JSON.stringify({ email, password }),
    });

    if (!authRes.ok) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    // Enrich with users table data — include demo_access flag
    const normalizedEmail = email.trim().toLowerCase();
    const { data: row } = await supabase
      .from("users")
      .select("full_name, role, demo_access")
      .eq("email", normalizedEmail)
      .single();

    const res = NextResponse.json({
      user: {
        email: normalizedEmail,
        full_name: row?.full_name ?? email,
        role: row?.role ?? "analyst",
      },
      demo_access: row?.demo_access ?? false,
    });
    await setSessionCookieIfAdmin(res, normalizedEmail);
    if (isAppAdmin(normalizedEmail)) await logAudit({ actor: normalizedEmail, action: "auth.login" });
    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
