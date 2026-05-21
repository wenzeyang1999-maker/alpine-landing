import { NextResponse } from "next/server";
import { INVESTOR_SESSION, investorCookieOptions } from "@/lib/investor/auth-session";

export const runtime = "nodejs";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  const opts = investorCookieOptions(process.env.NODE_ENV === "production");
  res.cookies.set(INVESTOR_SESSION.COOKIE_NAME, "", { ...opts, maxAge: 0 });
  return res;
}
