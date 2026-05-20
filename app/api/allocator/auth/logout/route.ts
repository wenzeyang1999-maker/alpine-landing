import { NextResponse } from "next/server";
import { ALLOCATOR_SESSION, allocatorCookieOptions } from "@/lib/allocator/auth-session";

export const runtime = "nodejs";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  const opts = allocatorCookieOptions(process.env.NODE_ENV === "production");
  res.cookies.set(ALLOCATOR_SESSION.COOKIE_NAME, "", { ...opts, maxAge: 0 });
  return res;
}
