import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = new Set([
  "manager.alpinedd.com",
  "manager.localhost:3001",
  "manager.localhost",
]);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon).*)"],
};

export function middleware(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").toLowerCase();
  if (!ALLOWED_HOSTS.has(host)) return;

  const path = req.nextUrl.pathname;
  if (path.startsWith("/manager/") || path === "/manager") return;

  const url = req.nextUrl.clone();
  url.pathname = `/manager${path === "/" ? "/landing" : path}`;
  return NextResponse.rewrite(url);
}
