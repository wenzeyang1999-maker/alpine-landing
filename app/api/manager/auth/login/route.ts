import { NextRequest, NextResponse } from "next/server";
import { verifyPassword } from "@/lib/manager/password";
import { signSession, managerCookieOptions, MANAGER_SESSION } from "@/lib/manager/auth-session";
import { managerDb } from "@/lib/manager/db";

type UserRow = {
  id: string;
  email: string;
  password_hash: string | null;
  is_verified: boolean;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email: string = (body.email ?? "").trim().toLowerCase();
    const password: string = body.password ?? "";

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const db = managerDb();
    const { data: userRaw } = await db
      .from("users")
      .select("id, email, password_hash, is_verified")
      .eq("email", email)
      .maybeSingle() as { data: UserRow | null };

    // Always attempt verify to avoid timing-based user enumeration
    const storedHash: string | null = userRaw?.password_hash ?? null;
    const match = verifyPassword(password, storedHash);

    if (!userRaw || !match) {
      return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
    }

    // Fire-and-forget last_login_at update
    db.from("users")
      .update({ last_login_at: new Date().toISOString() })
      .eq("id", userRaw.id);

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
