import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyPassword } from "@/lib/manager/password";
import { signSession, managerCookieOptions, MANAGER_SESSION } from "@/lib/manager/auth-session";

function publicDb() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

type SessionRow = {
  id: string;
  email: string;
  password_hash: string | null;
  is_verified: boolean;
  firm_id: string;
  full_name: string | null;
  role: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email: string = (body.email ?? "").trim().toLowerCase();
    const password: string = body.password ?? "";

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const { data, error: rpcErr } = await publicDb().rpc("get_manager_session", { p_email: email });

    if (rpcErr) {
      console.error("Login RPC error:", rpcErr);
      return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }

    const userRaw: SessionRow | null = Array.isArray(data) && data.length > 0 ? data[0] : null;
    const storedHash: string | null = userRaw?.password_hash ?? null;
    const match = verifyPassword(password, storedHash);

    if (!userRaw || !match) {
      return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
    }

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
