import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { newsletterSubscribers } from "@/lib/db/schema";
import { checkRateLimit } from "@/lib/rate-limit";
import { notifyAdminNewMember } from "@/lib/admin-notify";
import { newToken, sendConfirmEmail } from "@/lib/newsletter-confirm";

const ALLOWED_SOURCES = [
  "landing",
  "navbar",
  "contact",
  "footer",
  "signup",
  "early-access",
  "demo",
] as const;

const GENERIC_OK_MESSAGE =
  "Almost there. Check your email to confirm your subscription.";

// Basic email shape check — server-side validation, not a deliverability promise.
function isValidEmail(email: string): boolean {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return req.ip || fwd || "unknown";
}

function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT || "alpine-default-salt";
  return crypto.createHash("sha256").update(ip + salt).digest("hex");
}


export async function POST(req: NextRequest) {
  // 1) IP + UA extraction
  const ip = getClientIp(req);
  const userAgent = req.headers.get("user-agent") ?? "";

  // 2) Rate limit
  const rl = checkRateLimit(ip);
  if (!rl.ok) {
    return NextResponse.json(
      { detail: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfterSeconds ?? 60) },
      }
    );
  }

  try {
    // 3) Parse + validate email
    const body = (await req.json().catch(() => ({}))) as {
      email?: unknown;
      source?: unknown;
      name?: unknown;
    };
    const rawEmail = typeof body.email === "string" ? body.email : "";
    if (!isValidEmail(rawEmail)) {
      return NextResponse.json(
        { detail: "A valid email is required." },
        { status: 400 }
      );
    }
    const normalized = rawEmail.toLowerCase().trim();
    const rawName = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
    const fullName = rawName.length > 0 ? rawName : null;

    // 4) Validate source against allow-list, default to 'landing'
    const subSource =
      typeof body.source === "string" &&
      (ALLOWED_SOURCES as readonly string[]).includes(body.source)
        ? body.source
        : "landing";

    // 5) Hash IP, generate tokens
    const ipHash = hashIp(ip);
    const confirmToken = newToken();
    const unsubscribeToken = newToken();

    // 6) Lookup existing row
    let existing: { confirmedAt: string | null; unsubscribedAt: string | null; unsubscribeToken: string | null } | undefined;
    try {
      [existing] = await db
        .select({
          confirmedAt: newsletterSubscribers.confirmedAt,
          unsubscribedAt: newsletterSubscribers.unsubscribedAt,
          unsubscribeToken: newsletterSubscribers.unsubscribeToken,
        })
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.email, normalized))
        .limit(1);
    } catch (lookupErr) {
      console.error("Subscribe lookup error:", lookupErr);
      return NextResponse.json(
        { detail: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }

    const host =
      req.headers.get("x-forwarded-host") ??
      req.headers.get("host") ??
      "alpinedd.com";
    const proto = req.headers.get("x-forwarded-proto") ?? "https";
    const baseUrl = `${proto}://${host}`;

    let mustSendEmail = false;
    let activeConfirmToken = confirmToken;

    if (existing) {
      const isConfirmed = !!existing.confirmedAt;
      const isUnsubscribed = !!existing.unsubscribedAt;

      if (isConfirmed && !isUnsubscribed) {
        // Already confirmed — idempotent, no email re-send.
        mustSendEmail = false;
      } else {
        // Re-issue confirm token. For confirmed+unsubscribed we do NOT silently
        // restore — clearing unsubscribed_at happens at confirm time. For pending,
        // re-issue in case the original token expired.
        try {
          await db
            .update(newsletterSubscribers)
            .set({
              confirmToken,
              confirmTokenSentAt: new Date().toISOString(),
              source: subSource,
              consentIpHash: ipHash,
              consentUserAgent: userAgent,
              ...(fullName ? { fullName } : {}),
            })
            .where(eq(newsletterSubscribers.email, normalized));
        } catch (upErr) {
          console.error("Subscribe re-issue error:", upErr);
          return NextResponse.json(
            { detail: "Something went wrong. Please try again." },
            { status: 500 }
          );
        }
        mustSendEmail = true;
        activeConfirmToken = confirmToken;
      }
    } else {
      // 7) Brand-new row
      try {
        await db.insert(newsletterSubscribers).values({
          email: normalized,
          source: subSource,
          confirmToken,
          confirmTokenSentAt: new Date().toISOString(),
          unsubscribeToken,
          consentIpHash: ipHash,
          consentUserAgent: userAgent,
          fullName,
        });
      } catch (insertErr) {
        console.error("Subscribe insert error:", insertErr);
        return NextResponse.json(
          { detail: "Something went wrong. Please try again." },
          { status: 500 }
        );
      }
      mustSendEmail = true;
      activeConfirmToken = confirmToken;

      // Notify admin of new subscriber (fire-and-forget)
      notifyAdminNewMember({ event: "subscribe", email: normalized, source: subSource, name: fullName ?? undefined });
    }

    // 8) Send confirmation email (best-effort)
    if (mustSendEmail) {
      const confirmUrl = `${baseUrl}/api/subscribe/confirm?token=${activeConfirmToken}`;
      try {
        await sendConfirmEmail(normalized, confirmUrl, fullName);
      } catch (e) {
        // Log but still return 200 — consent + token are persisted; we can resend later.
        console.error("Subscribe Resend send error:", e);
      }
    }

    // 9) Always return generic — don't leak existence.
    return NextResponse.json({ status: "ok", message: GENERIC_OK_MESSAGE });
  } catch (err) {
    console.error("Subscribe handler error:", err);
    return NextResponse.json(
      { detail: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
