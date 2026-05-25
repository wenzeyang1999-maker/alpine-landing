import { NextResponse } from "next/server";
import { MANAGER_SESSION } from "@/lib/manager/auth-session";

export async function POST() {
  const res = NextResponse.json({ ok: true }, { status: 200 });
  res.cookies.set(MANAGER_SESSION.COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
