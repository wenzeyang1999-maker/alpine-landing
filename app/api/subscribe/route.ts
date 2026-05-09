import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";
import { checkRateLimit } from "@/lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);

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

function newToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function confirmEmailHtml(confirmUrl: string): string {
  return `<!doctype html>
<html><body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; background:#F7F8F8; padding:32px;">
  <div style="max-width:520px; margin:0 auto; background:#FFFFFF; border:1px solid #E5E7EB; border-radius:12px; padding:32px;">
    <h1 style="font-size:18px; color:#0F0F10; margin:0 0 12px;">Confirm your Alpine subscription</h1>
    <p style="font-size:14px; line-height:1.55; color:#3A3A4A; margin:0 0 20px;">
      Click the button below to confirm your email and start receiving Alpine's monthly ODD insights.
    </p>
    <p style="margin:0 0 24px;">
      <a href="${confirmUrl}" style="display:inline-block; background:#0F0F10; color:#FFFFFF; text-decoration:none; padding:12px 20px; border-radius:8px; font-size:14px; font-weight:600;">
        Confirm subscription
      </a>
    </p>
    <p style="font-size:12px; line-height:1.55; color:#6B7280; margin:0 0 8px;">
      Or paste this link into your browser:
    </p>
    <p style="font-size:12px; line-height:1.55; color:#6B7280; word-break:break-all; margin:0;">
      ${confirmUrl}
    </p>
    <p style="font-size:11px; line-height:1.55; color:#9CA3AF; margin:24px 0 0;">
      If you didn't request this, you can safely ignore this email.
    </p>
  </div>
</body></html>`;
}

function confirmEmailText(confirmUrl: string): string {
  return `Confirm your Alpine subscription\n\nClick the link below to confirm your email:\n${confirmUrl}\n\nIf you didn't request this, you can safely ignore this email.`;
}

async function sendConfirmEmail(to: string, confirmUrl: string): Promise<void> {
  await resend.emails.send({
    from: "Alpine <noreply@alpinedd.com>",
    to,
    subject: "Confirm your Alpine subscription",
    html: confirmEmailHtml(confirmUrl),
    text: confirmEmailText(confirmUrl),
  });
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
    };
    const rawEmail = typeof body.email === "string" ? body.email : "";
    if (!isValidEmail(rawEmail)) {
      return NextResponse.json(
        { detail: "A valid email is required." },
        { status: 400 }
      );
    }
    const normalized = rawEmail.toLowerCase().trim();

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
    const { data: existing, error: lookupErr } = await supabase
      .from("newsletter_subscribers")
      .select("email, confirmed_at, unsubscribed_at, unsubscribe_token")
      .eq("email", normalized)
      .maybeSingle();

    if (lookupErr) {
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
      const isConfirmed = !!existing.confirmed_at;
      const isUnsubscribed = !!existing.unsubscribed_at;

      if (isConfirmed && isUnsubscribed) {
        // Re-subscribe-after-unsubscribe: do NOT silently restore.
        // Issue NEW confirm token; clearing unsubscribed_at happens at confirm time.
        const { error: upErr } = await supabase
          .from("newsletter_subscribers")
          .update({
            confirm_token: confirmToken,
            confirm_token_sent_at: new Date().toISOString(),
            source: subSource,
            consent_ip_hash: ipHash,
            consent_user_agent: userAgent,
          })
          .eq("email", normalized);
        if (upErr) {
          console.error("Subscribe re-issue (unsubscribed) error:", upErr);
          return NextResponse.json(
            { detail: "Something went wrong. Please try again." },
            { status: 500 }
          );
        }
        mustSendEmail = true;
        activeConfirmToken = confirmToken;
      } else if (isConfirmed) {
        // Already confirmed — idempotent, no email re-send.
        mustSendEmail = false;
      } else {
        // Pending — re-issue confirm token in case original expired.
        const { error: upErr } = await supabase
          .from("newsletter_subscribers")
          .update({
            confirm_token: confirmToken,
            confirm_token_sent_at: new Date().toISOString(),
            source: subSource,
            consent_ip_hash: ipHash,
            consent_user_agent: userAgent,
          })
          .eq("email", normalized);
        if (upErr) {
          console.error("Subscribe re-issue (pending) error:", upErr);
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
      const { error: insertErr } = await supabase
        .from("newsletter_subscribers")
        .insert({
          email: normalized,
          source: subSource,
          confirm_token: confirmToken,
          confirm_token_sent_at: new Date().toISOString(),
          unsubscribe_token: unsubscribeToken,
          consent_ip_hash: ipHash,
          consent_user_agent: userAgent,
        });
      if (insertErr) {
        console.error("Subscribe insert error:", insertErr);
        return NextResponse.json(
          { detail: "Something went wrong. Please try again." },
          { status: 500 }
        );
      }
      mustSendEmail = true;
      activeConfirmToken = confirmToken;
    }

    // 8) Send confirmation email (best-effort)
    if (mustSendEmail) {
      const confirmUrl = `${baseUrl}/api/subscribe/confirm?token=${activeConfirmToken}`;
      try {
        await sendConfirmEmail(normalized, confirmUrl);
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
