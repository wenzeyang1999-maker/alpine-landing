/**
 * Demo gate auth (T10/T11, DD9). POST a password → set a signed httpOnly cookie.
 * DELETE clears it. The page + the other demo routes verify this cookie server-side.
 */
import { NextResponse } from "next/server";
import { checkPassword, signDemoToken, DEMO_COOKIE, demoCookieOptions } from "@/lib/engine/demo/gate";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let password = "";
  try {
    password = String(((await req.json()) as { password?: unknown }).password ?? "");
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  if (!checkPassword(password)) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(DEMO_COOKIE, await signDemoToken(), demoCookieOptions(process.env.NODE_ENV === "production"));
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(DEMO_COOKIE, "", { ...demoCookieOptions(process.env.NODE_ENV === "production"), maxAge: 0 });
  return res;
}
