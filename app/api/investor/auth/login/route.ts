import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyPassword } from "@/lib/investor/password";
import {
  signSession,
  INVESTOR_SESSION,
  investorCookieOptions,
} from "@/lib/investor/auth-session";

export const runtime = "nodejs";

// A real scrypt hash of a random string. When the email is unknown we still
// run a verify against this so response timing does not reveal whether an
// account exists (no enumeration via timing).
const DUMMY_HASH =
  "f081864549795c6216fb10eb3f86dbb1:e8542fe54917c975f4a1ccfc7345edb7a2d89f6193619d1642210ebe34a19233bc3c16010ca1faffc18fc97f78217908fda3ca6d8748a7a286ffde80a51eac41";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = null;
  }
  const raw = (body ?? {}) as Record<string, unknown>;
  const email = typeof raw.email === "string" ? raw.email.trim().toLowerCase() : "";
  const password = typeof raw.password === "string" ? raw.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  try {
    const { data: investor, error } = await supabase
      .from("investors")
      .select("id, email, password_hash, is_active")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error("[investor/login] DB error:", error);
      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 500 },
      );
    }

    const active = investor && investor.is_active ? investor : null;
    const passwordOk = verifyPassword(password, active ? active.password_hash : DUMMY_HASH);

    // Identical 401 for unknown email, inactive account, and bad password.
    if (!active || !passwordOk) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = await signSession(active.email);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(
      INVESTOR_SESSION.COOKIE_NAME,
      token,
      investorCookieOptions(process.env.NODE_ENV === "production"),
    );

    // Best-effort — never block login on this write.
    await supabase
      .from("investors")
      .update({ last_login: new Date().toISOString() })
      .eq("id", active.id);

    return res;
  } catch (err) {
    console.error("[investor/login] error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
