import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { and, desc, isNull, isNotNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { newsletterSubscribers } from "@/lib/db/schema";
import { getAppAdminEmail } from "@/lib/app-portal/auth-session";
import { wrapEmail } from "@/lib/app-portal/email-template";
import { logAudit } from "@/lib/app-portal/audit-log";
import { getPublications, getPublicationByHref, publicationUrl } from "@/lib/publications";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = "Alpine Due Diligence <notifications@alpinedd.com>";
const ADMIN_NOTIFY = "azhang@alpinedd.com";

export const maxDuration = 300;

// In-memory idempotency (double-click / quick-retry defence). Cleared on cold start.
const recentSends = new Map<string, number>();
const IDEMPOTENCY_TTL_MS = 5 * 60 * 1000;
function isDuplicate(key: string): boolean {
  const now = Date.now();
  Array.from(recentSends.entries()).forEach(([k, ts]) => { if (now - ts > IDEMPOTENCY_TTL_MS) recentSends.delete(k); });
  if (recentSends.has(key)) return true;
  recentSends.set(key, now);
  return false;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── GET: list active subscribers for the picker (confirmed + not unsubscribed) ──
export async function GET(req: NextRequest) {
  const adminEmail = await getAppAdminEmail(req);
  if (!adminEmail) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const rows = await db
    .select({ email: newsletterSubscribers.email, fullName: newsletterSubscribers.fullName, createdAt: newsletterSubscribers.createdAt })
    .from(newsletterSubscribers)
    .where(and(isNull(newsletterSubscribers.unsubscribedAt), isNotNull(newsletterSubscribers.confirmedAt)))
    .orderBy(desc(newsletterSubscribers.createdAt));

  const pubs = await getPublications();

  return NextResponse.json({
    subscribers: rows.map((r) => ({ email: r.email.toLowerCase(), name: r.fullName ?? null, subscribed_at: r.createdAt })),
    publications: pubs.map((p) => ({ href: p.href, category: p.category, title: p.title, description: p.description })),
  });
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Rich announcement email — title, blurb, and a real "Read" button linking to the paper.
function announcementHtml(title: string, description: string, url: string, category: string): string {
  const body = `
    <p style="margin:0 0 6px 0;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#1f6e78;">New from Alpine · ${escapeHtml(category)}</p>
    <h2 style="margin:0 0 14px 0;font-size:20px;font-weight:700;color:#17323b;line-height:1.3;letter-spacing:-0.01em;">${escapeHtml(title)}</h2>
    <div style="font-size:14px;color:#4a5568;line-height:1.7;margin:0 0 22px 0;">${escapeHtml(description)}</div>
    <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:0 0 4px 0;">
      <tr><td style="border-radius:8px;background:#0f0f10;">
        <a href="${url}" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">Read the case study →</a>
      </td></tr>
    </table>`;
  const footer =
    `<p style="margin:0;font-size:12px;color:#64748B;text-align:center;">Alpine Due Diligence · <a href="https://alpinedd.com" style="color:#1f6e78;text-decoration:none;">alpinedd.com</a></p>
     <p style="margin:6px 0 0 0;font-size:11px;color:#94a3b8;text-align:center;">You are receiving this because you subscribed to Alpine Due Diligence.</p>`;
  return wrapEmail(body, { footer });
}

interface AnnounceBody {
  href?: string;                 // which publication (from lib/publications)
  recipients?: string[];         // selected subscriber emails
  dry_run?: boolean;
  idempotency_key?: string;
}

// ── POST: send a publication announcement to the selected recipients ──
export async function POST(req: NextRequest) {
  const adminEmail = await getAppAdminEmail(req);
  if (!adminEmail) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const body = (await req.json()) as AnnounceBody;
    const href = (body.href ?? "").trim();
    const dryRun = body.dry_run === true;

    const pub = await getPublicationByHref(href);
    if (!pub) return NextResponse.json({ error: "Unknown publication." }, { status: 400 });

    const recipients = Array.from(
      new Set((Array.isArray(body.recipients) ? body.recipients : []).map((e) => e.trim().toLowerCase()).filter((e) => EMAIL_RE.test(e))),
    );
    if (recipients.length === 0) {
      return NextResponse.json({ error: "Select at least one recipient." }, { status: 400 });
    }

    const subject = `New from Alpine: ${pub.title}`;

    if (dryRun) {
      return NextResponse.json({ ok: true, dry_run: true, recipient_count: recipients.length, subject, preview: recipients.slice(0, 5) });
    }

    const idempotencyKey = body.idempotency_key?.trim();
    if (idempotencyKey && isDuplicate(idempotencyKey)) {
      await logAudit({ actor: adminEmail, action: "announce.dedupe", target: idempotencyKey });
      return NextResponse.json({ ok: true, deduped: true, message: "Duplicate send skipped (within 5 minutes)." });
    }

    const html = announcementHtml(pub.title, pub.description, publicationUrl(pub.href), pub.category);

    const results: { ok: boolean }[] = [];
    const BATCH = 10;
    for (let i = 0; i < recipients.length; i += BATCH) {
      const slice = recipients.slice(i, i + BATCH);
      const settled = await Promise.allSettled(
        slice.map((to) => resend.emails.send({ from: FROM_EMAIL, to, subject, html, replyTo: ADMIN_NOTIFY })),
      );
      settled.forEach((r) => results.push({ ok: r.status === "fulfilled" }));
    }
    const sent = results.filter((r) => r.ok).length;
    const failed = results.length - sent;

    try {
      await resend.emails.send({
        from: FROM_EMAIL, to: ADMIN_NOTIFY,
        subject: `[Alpine announce] ${pub.title} — sent ${sent}, failed ${failed}`,
        html: wrapEmail(`<p style="font-size:14px;color:#1a1a2e;">Announcement sent by ${escapeHtml(adminEmail)}.<br/>Publication: ${escapeHtml(pub.title)}<br/>Sent: ${sent} · Failed: ${failed} · Selected: ${recipients.length}</p>`),
      });
    } catch { /* best effort */ }

    await logAudit({ actor: adminEmail, action: "announce.send", target: pub.href, meta: { title: pub.title, sent, failed, recipient_count: recipients.length } });

    return NextResponse.json({ ok: true, sent, failed, recipient_count: recipients.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send announcement";
    console.error("[announce] error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
