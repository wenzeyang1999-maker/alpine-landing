import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { newsletterSubscribers } from "@/lib/db/schema";

const resend = new Resend(process.env.RESEND_API_KEY);
const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

const TOKEN_TTL_DAYS = 7;
const TOKEN_TTL_MS = TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000;

function redirectTo(req: NextRequest, path: string): NextResponse {
  const host =
    req.headers.get("x-forwarded-host") ??
    req.headers.get("host") ??
    "alpinedd.com";
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  return NextResponse.redirect(`${proto}://${host}${path}`, { status: 302 });
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";

  if (!token) {
    return redirectTo(req, "/subscribe/confirmed?error=invalid");
  }

  try {
    const [row] = await db
      .select({ email: newsletterSubscribers.email, confirmTokenSentAt: newsletterSubscribers.confirmTokenSentAt })
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.confirmToken, token))
      .limit(1);

    if (!row) {
      return redirectTo(req, "/subscribe/confirmed?error=invalid");
    }

    // Check token age (≤ 7 days)
    const sentAt = row.confirmTokenSentAt
      ? new Date(row.confirmTokenSentAt).getTime()
      : 0;
    if (!sentAt || Date.now() - sentAt > TOKEN_TTL_MS) {
      return redirectTo(req, "/subscribe/confirmed?error=invalid");
    }

    // Confirm: set confirmed_at, clear token (one-time use), clear unsubscribed_at.
    await db
      .update(newsletterSubscribers)
      .set({
        confirmedAt: new Date().toISOString(),
        confirmToken: null,
        unsubscribedAt: null,
      })
      .where(eq(newsletterSubscribers.email, row.email));

    // Best-effort Resend Audience sync.
    if (RESEND_AUDIENCE_ID) {
      try {
        const { data, error: rErr } = await resend.contacts.create({
          email: row.email,
          unsubscribed: false,
          audienceId: RESEND_AUDIENCE_ID,
        });
        if (rErr) {
          console.error("Subscribe confirm Resend sync error:", rErr);
        } else if (data?.id) {
          await db
            .update(newsletterSubscribers)
            .set({ resendContactId: data.id, resendSyncedAt: new Date().toISOString() })
            .where(eq(newsletterSubscribers.email, row.email));
        }
      } catch (e) {
        console.error("Subscribe confirm Resend sync exception:", e);
      }
    }

    return redirectTo(req, "/subscribe/confirmed");
  } catch (err) {
    console.error("Subscribe confirm handler error:", err);
    return redirectTo(req, "/subscribe/confirmed?error=invalid");
  }
}
