import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyPassword } from "@/lib/manager/password";
import { signSession, managerCookieOptions, MANAGER_SESSION } from "@/lib/manager/auth-session";

type UserRow = {
  id: string;
  email: string;
  password_hash: string | null;
  is_verified: boolean;
};

function db() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false }, db: { schema: "manager" } }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email: string = (body.email ?? "").trim().toLowerCase();
    const password: string = body.password ?? "";

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const { data: userRaw, error: dbErr } = await db()
      .from("users")
      .select("id, email, password_hash, is_verified")
      .eq("email", email)
      .maybeSingle() as { data: UserRow | null; error: unknown };

    if (dbErr) {
      console.error("Login DB error:", dbErr);
      return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }

    const storedHash: string | null = userRaw?.password_hash ?? null;
    const match = verifyPassword(password, storedHash);

    if (!userRaw || !match) {
      return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
    }

    db().from("users").update({ last_login_at: new Date().toISOString() }).eq("id", userRaw.id);

    const token = await signSession(email);
    const isProd = process.env.NODE_ENV === "production";
    const redirect = userRaw.is_verified ? "/manager/workspace" : "/manager/pending";
    const res = NextResponse.json({ ok: true, redirect }, { status: 200 });
    res.cookies.set(MANAGER_SESSION.COOKIE_NAME, token, managerCookieOptions(isProd));
    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
