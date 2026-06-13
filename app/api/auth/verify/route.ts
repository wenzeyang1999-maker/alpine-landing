import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export const runtime = "nodejs";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24h

function redirectTo(req: NextRequest, path: string): NextResponse {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "alpinedd.com";
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  return NextResponse.redirect(`${proto}://${host}${path}`, { status: 302 });
}

// GET /api/auth/verify?token=...  — confirm an analyst/admin email after signup.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  if (!token) return redirectTo(req, "/login?verify=invalid");

  try {
    const [row] = await db
      .select({ id: users.id, verificationSentAt: users.verificationSentAt })
      .from(users)
      .where(eq(users.verificationToken, token))
      .limit(1);

    if (!row) return redirectTo(req, "/login?verify=invalid");

    const sentAt = row.verificationSentAt ? new Date(row.verificationSentAt).getTime() : 0;
    if (!sentAt || Date.now() - sentAt > TOKEN_TTL_MS) {
      return redirectTo(req, "/login?verify=expired");
    }

    await db
      .update(users)
      .set({
        isVerified: true,
        verifiedAt: new Date().toISOString(),
        isActive: true,
        verificationToken: null,
      })
      .where(eq(users.id, row.id));

    return redirectTo(req, "/login?verify=ok");
  } catch (err) {
    console.error("[auth/verify] error:", err);
    return redirectTo(req, "/login?verify=invalid");
  }
}
