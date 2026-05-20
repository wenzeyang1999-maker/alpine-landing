import { NextResponse, type NextRequest } from "next/server";
import { verifySession, SESSION } from "@/lib/auth-session";
import { isAppAdmin } from "@/lib/app-allowlist";
import {
  verifySession as verifyInvestorSession,
  INVESTOR_SESSION,
} from "@/lib/investor/auth-session";

const MANAGER_HOSTS = new Set([
  "manager.alpinedd.com",
  "manager.localhost:3000",
  "manager.localhost:3001",
  "manager.localhost",
]);

const APP_HOSTS = new Set([
  "app.alpinedd.com",
  "app.localhost",
  "app.localhost:3000",
]);

const PUBLIC_APP_PATHS = ["/demo-login", "/login"];

function isManagerHost(host: string): boolean {
  return MANAGER_HOSTS.has(host);
}

function isAppHost(host: string): boolean {
  if (APP_HOSTS.has(host)) return true;
  if (host.startsWith("app.")) return true;
  return false;
}

function isPublicPath(path: string): boolean {
  return PUBLIC_APP_PATHS.some((p) => path === p || path.startsWith(`${p}/`));
}

export async function middleware(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").toLowerCase();
  const url = req.nextUrl.clone();
  const path = url.pathname;

  // Manager subdomain → rewrite to /manager/*
  if (isManagerHost(host)) {
    if (path.startsWith("/manager/") || path === "/manager") return NextResponse.next();
    url.pathname = `/manager${path === "/" ? "/landing" : path}`;
    return NextResponse.rewrite(url);
  }

  // App subdomain → auth-gated rewrite to /app-portal/*
  if (isAppHost(host)) {
    if (!isPublicPath(path)) {
      const token = req.cookies.get(SESSION.COOKIE_NAME)?.value ?? null;
      const email = await verifySession(token);
      if (!isAppAdmin(email)) {
        const redirect = req.nextUrl.clone();
        redirect.pathname = "/demo-login";
        redirect.search = "";
        redirect.searchParams.set("redirect", path === "/" ? "/" : path);
        if (email) redirect.searchParams.set("error", "forbidden");
        return NextResponse.redirect(redirect);
      }
    }
    if (path.startsWith("/app-portal")) return NextResponse.next();
    url.pathname = path === "/" ? "/app-portal" : `/app-portal${path}`;
    return NextResponse.rewrite(url);
  }

  // Apex/main host (alpinedd.com) — gate the investor report surface.
  // Evaluated only here, after the manager and app branches have returned,
  // so it can never catch `app.alpinedd.com/reports` after a rewrite.
  // This verifies the cookie ONLY; it is not authorization — whether the
  // investor may see a given report is checked in pages + APIs via
  // lib/investor/access.ts (a valid cookie for a deactivated or unassigned
  // investor still passes here).
  if (path === "/reports" || path.startsWith("/reports/")) {
    let investorEmail: string | null = null;
    try {
      const token = req.cookies.get(INVESTOR_SESSION.COOKIE_NAME)?.value ?? null;
      investorEmail = await verifyInvestorSession(token);
    } catch {
      investorEmail = null;
    }
    if (!investorEmail) {
      const redirect = req.nextUrl.clone();
      redirect.pathname = "/login";
      redirect.search = "";
      redirect.searchParams.set("redirect", path);
      return NextResponse.redirect(redirect);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|fonts|.*\\..*).*)",
  ],
};
