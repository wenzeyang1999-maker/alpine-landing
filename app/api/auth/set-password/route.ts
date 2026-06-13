import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { hashPassword, isAcceptablePassword } from "@/lib/auth/password";

export const runtime = "nodejs";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24h

// POST /api/auth/set-password  { token, password }
// Used by password-reset / first-time set-password links (the migrated analyst
// accounts have a token issued out-of-band). Sets the password, marks the
// account verified+active, and consumes the token.
export async function POST(req: NextRequest) {
  try {
    const { token, password } = (await req.json()) as { token?: string; password?: string };
    if (!token) {
      return NextResponse.json({ error: "Invalid or missing link." }, { status: 400 });
    }
    const pw = isAcceptablePassword(password);
    if (!pw.ok) {
      return NextResponse.json({ error: pw.reason }, { status: 400 });
    }

    const [row] = await db
      .select({ id: users.id, verificationSentAt: users.verificationSentAt })
      .from(users)
      .where(eq(users.verificationToken, token))
      .limit(1);

    if (!row) {
      return NextResponse.json({ error: "This link is not valid." }, { status: 404 });
    }

    const sentAt = row.verificationSentAt ? new Date(row.verificationSentAt).getTime() : 0;
    if (!sentAt || Date.now() - sentAt > TOKEN_TTL_MS) {
      return NextResponse.json({ error: "This link has expired. Please request a new one." }, { status: 410 });
    }

    await db
      .update(users)
      .set({
        passwordHash: hashPassword(password as string),
        passwordSetAt: new Date().toISOString(),
        isVerified: true,
        verifiedAt: new Date().toISOString(),
        isActive: true,
        verificationToken: null,
      })
      .where(eq(users.id, row.id));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[auth/set-password] error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
