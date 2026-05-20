import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";
import { checkRateLimit } from "@/lib/rate-limit";
import { notifyAdminNewMember } from "@/lib/admin-notify";

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

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

function confirmEmailHtml(confirmUrl: string, fullName: string | null): string {
  const firstName = fullName?.trim().split(/\s+/)[0] ?? "";
  const greeting = firstName
    ? `<p style="font-size:14px;line-height:1.6;color:#475569;margin:0 0 12px;">Hi ${escapeHtml(firstName)},</p>`
    : "";
  return `<!doctype html>
<html><body style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#f1f0eb;padding:32px 0;margin:0;">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">
    <div style="background:#1a1a2e;padding:20px 28px;">
      <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        <tr>
          <td style="vertical-align:middle;padding-right:14px;">
            <img src="https://alpinedd.com/logo.png" alt="Alpine" style="height:36px;width:auto;display:block;" />
          </td>
          <td style="vertical-align:middle;">
            <div style="font-size:15px;font-weight:700;color:#f5f0e8;">Alpine Due Diligence</div>
            <div style="font-size:10px;color:#f5f0e8;opacity:0.5;letter-spacing:0.1em;text-transform:uppercase;">Newsletter</div>
          </td>
        </tr>
      </table>
    </div>
    <div style="padding:32px;">
      <h1 style="font-size:18px;color:#0f172a;margin:0 0 12px;">Confirm your Alpine subscription</h1>
      ${greeting}
      <p style="font-size:14px;line-height:1.6;color:#475569;margin:0 0 20px;">
        Click the button below to confirm your email and start receiving Alpine's bi-weekly case analyses and ODD insights.
      </p>
      <p style="margin:0 0 12px;">
        <a href="${confirmUrl}" style="display:inline-block;background:#0f172a;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;">
          Confirm subscription
        </a>
      </p>
      <p style="font-size:12px;line-height:1.55;color:#94a3b8;margin:0 0 20px;">
        This link expires in 7 days.
      </p>
      <p style="font-size:12px;line-height:1.55;color:#94a3b8;margin:0 0 8px;">
        Or paste this link into your browser:
      </p>
      <p style="font-size:12px;line-height:1.55;color:#94a3b8;word-break:break-all;margin:0 0 24px;">
        ${confirmUrl}
      </p>
      <p style="font-size:11px;line-height:1.55;color:#cbd5e1;margin:0;">
        If you didn't request this, you can safely ignore this email.
      </p>
    </div>
    <div style="padding:16px 32px;background:#f8f7f4;border-top:1px solid #e8e6e1;font-size:11px;color:#94a3b8;text-align:center;">
      Alpine Due Diligence Inc. · <a href="https://alpinedd.com" style="color:#7c3aed;text-decoration:none;">alpinedd.com</a>
    </div>
  </div>
</body></html>`;
}

function confirmEmailText(confirmUrl: string, fullName: string | null): string {
  const firstName = fullName?.trim().split(/\s+/)[0] ?? "";
  const greeting = firstName ? `Hi ${firstName},\n\n` : "";
  return `Confirm your Alpine subscription\n\n${greeting}Click the link below to confirm your email:\n${confirmUrl}\n\nThis link expires in 7 days.\n\nIf you didn't request this, you can safely ignore this email.`;
}

async function sendConfirmEmail(to: string, confirmUrl: string, fullName: string | null): Promise<void> {
  await resend.emails.send({
    from: "Alpine <notifications@alpinedd.com>",
    to,
    subject: "Confirm your Alpine subscription",
    html: confirmEmailHtml(confirmUrl, fullName),
    text: confirmEmailText(confirmUrl, fullName),
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
            ...(fullName ? { full_name: fullName } : {}),
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
            ...(fullName ? { full_name: fullName } : {}),
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
          full_name: fullName,
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
