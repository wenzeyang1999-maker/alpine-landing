import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/app-portal/supabase";
import { getAppAdminEmail } from "@/lib/app-portal/auth-session";
import { wrapEmail, escapeBody } from "@/lib/app-portal/email-template";
import { logAudit } from "@/lib/app-portal/audit-log";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = "Alpine Due Diligence <notifications@alpinedd.com>";
const ADMIN_NOTIFY = "azhang@alpinedd.com";

// Allow up to 5 minutes for large broadcasts (Vercel Pro: maxDuration up to 300s).
// On Hobby plan the runtime is capped at 60s — Vercel will silently clamp this.
export const maxDuration = 300;

// In-memory idempotency cache: same idempotency_key within 5 minutes is a no-op.
// Cleared on cold start / redeploy — fine for defending against double-click and
// quick retries, NOT against multi-instance race or longer windows.
const recentBroadcasts = new Map<string, number>();
const IDEMPOTENCY_TTL_MS = 5 * 60 * 1000;
function isDuplicate(key: string): boolean {
  const now = Date.now();
  Array.from(recentBroadcasts.entries()).forEach(([k, ts]) => {
    if (now - ts > IDEMPOTENCY_TTL_MS) recentBroadcasts.delete(k);
  });
  if (recentBroadcasts.has(key)) return true;
  recentBroadcasts.set(key, now);
  return false;
}

type Audience = "active_subscribers" | "all_users" | "custom";

interface BroadcastBody {
  subject?: string;
  body?: string;
  audience?: Audience;
  custom_emails?: string[];
  dry_run?: boolean;
  idempotency_key?: string;
}

function wrapHtml(subject: string, bodyText: string, unsubscribeFooter: boolean): string {
  const body = `
    <h2 style="margin:0 0 16px 0;font-size:18px;font-weight:700;color:#1a1a2e;">${subject.replace(/</g, "&lt;")}</h2>
    <div style="font-size:14px;color:#1a1a2e;line-height:1.7;">${escapeBody(bodyText)}</div>`;
  const footer = unsubscribeFooter
    ? `<p style="margin:0;font-size:12px;color:#64748B;text-align:center;">Alpine Due Diligence · <a href="https://alpinedd.com" style="color:#7B2CBF;text-decoration:none;">alpinedd.com</a></p>
       <p style="margin:6px 0 0 0;font-size:11px;color:#94a3b8;text-align:center;">You are receiving this because you subscribed to Alpine Due Diligence.</p>`
    : undefined;
  return wrapEmail(body, footer ? { footer } : {});
}

async function loadRecipients(audience: Audience, custom: string[]): Promise<string[]> {
  if (audience === "custom") {
    return custom.map((e) => e.trim().toLowerCase()).filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
  }
  if (audience === "active_subscribers") {
    const { data } = await supabase
      .from("newsletter_subscribers")
      .select("email, confirmed_at, unsubscribed_at");
    return (data ?? [])
      .filter((r) => !r.unsubscribed_at && r.confirmed_at)
      .map((r) => (r.email as string).toLowerCase());
  }
  if (audience === "all_users") {
    const { data } = await supabase.from("users").select("email");
    return (data ?? []).map((r) => (r.email as string).toLowerCase());
  }
  return [];
}

export async function POST(req: NextRequest) {
  const adminEmail = await getAppAdminEmail(req);
  if (!adminEmail) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const body = (await req.json()) as BroadcastBody;
    const subject = (body.subject ?? "").trim();
    const text = (body.body ?? "").trim();
    const audience: Audience = body.audience ?? "active_subscribers";
    const customEmails = Array.isArray(body.custom_emails) ? body.custom_emails : [];
    const dryRun = body.dry_run === true;

    if (!subject || subject.length > 200) {
      return NextResponse.json({ error: "Subject required (1-200 chars)." }, { status: 400 });
    }
    if (!text || text.length < 10) {
      return NextResponse.json({ error: "Body required (at least 10 chars)." }, { status: 400 });
    }

    const recipients = Array.from(new Set(await loadRecipients(audience, customEmails)));
    if (recipients.length === 0) {
      return NextResponse.json({ error: "No valid recipients." }, { status: 400 });
    }

    if (dryRun) {
      return NextResponse.json({ ok: true, dry_run: true, recipient_count: recipients.length, preview: recipients.slice(0, 5) });
    }

    // Idempotency check for non-dry-run sends only
    const idempotencyKey = body.idempotency_key?.trim();
    if (idempotencyKey && isDuplicate(idempotencyKey)) {
      await logAudit({ actor: adminEmail, action: "broadcast.dedupe", target: idempotencyKey });
      return NextResponse.json(
        { ok: true, deduped: true, message: "Duplicate idempotency_key seen within 5 minutes; skipped." },
        { status: 200 },
      );
    }

    const html = wrapHtml(subject, text, audience === "active_subscribers");

    // Send in parallel batches of 10 to avoid hammering the Resend API
    const results: { email: string; ok: boolean; error?: string }[] = [];
    const BATCH = 10;
    for (let i = 0; i < recipients.length; i += BATCH) {
      const slice = recipients.slice(i, i + BATCH);
      const settled = await Promise.allSettled(
        slice.map((to) =>
          resend.emails.send({ from: FROM_EMAIL, to, subject, html, replyTo: ADMIN_NOTIFY }),
        ),
      );
      settled.forEach((r, idx) => {
        if (r.status === "fulfilled") results.push({ email: slice[idx], ok: true });
        else results.push({ email: slice[idx], ok: false, error: String(r.reason).slice(0, 120) });
      });
    }

    const sent = results.filter((r) => r.ok).length;
    const failed = results.length - sent;

    // Notify admin with summary
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_NOTIFY,
        subject: `[Alpine broadcast] ${subject} — sent ${sent}, failed ${failed}`,
        html: wrapHtml(
          `Broadcast sent by ${adminEmail}`,
          `Audience: ${audience}\nSent: ${sent}\nFailed: ${failed}\n\nOriginal subject: ${subject}\n\n--- Body ---\n${text}`,
          false,
        ),
      });
    } catch {
      // best effort
    }

    await logAudit({
      actor: adminEmail,
      action: "broadcast.send",
      target: audience,
      meta: { subject, sent, failed, recipient_count: recipients.length },
    });

    return NextResponse.json({ ok: true, sent, failed, recipient_count: recipients.length });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to broadcast";
    console.error("[broadcast] error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
