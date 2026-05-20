import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/app-portal/supabase";
import { getAppAdminEmail } from "@/lib/app-portal/auth-session";
import { wrapEmail } from "@/lib/app-portal/email-template";
import { logAudit } from "@/lib/app-portal/audit-log";

async function persistCustomer(payload: {
  name: string;
  email: string;
  organization?: string;
  fund_name?: string;
  portal_token: string;
  notes?: string;
  onboarded_by: string;
}) {
  try {
    await supabase.from("customers").upsert(
      {
        name: payload.name,
        email: payload.email,
        organization: payload.organization || null,
        fund_name: payload.fund_name || null,
        portal_token: payload.portal_token,
        notes: payload.notes || null,
        onboarded_by: payload.onboarded_by,
        plan: "starter",
        status: "active",
      },
      { onConflict: "portal_token" },
    );
  } catch (err) {
    console.warn("[onboard] persist customer failed (non-blocking):", err);
  }
}

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = "Alpine Due Diligence <notifications@alpinedd.com>";
const ADMIN_BCC = "azhang@alpinedd.com";

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,40}$/;

interface OnboardBody {
  customer_name?: string;
  customer_email?: string;
  fund_name?: string;
  token?: string;
  notes?: string;
}

function appBaseUrl(req: NextRequest): string {
  const proto = req.headers.get("x-forwarded-proto") ?? "http";
  const host = req.headers.get("host") ?? "app.alpinedd.com";
  // If admin is hitting this from the marketing host by mistake, still link to app subdomain
  const appHost = host.startsWith("app.") ? host : `app.${host.replace(/^www\./, "")}`;
  return `${proto}://${appHost}`;
}

function deriveToken(fund_name: string): string {
  // Human-recognizable prefix (so admin can eyeball which customer this is)…
  const slug = fund_name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
  // …plus a high-entropy suffix so the token is not guessable from the fund name.
  // 8 hex chars = 2^32 ≈ 4 billion possibilities, infeasible to brute-force.
  const suffix = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  return slug ? `${slug}-${suffix}` : suffix;
}

function inviteHtml(name: string | undefined, fundName: string | undefined, portalUrl: string) {
  const greeting = name ? `Hi ${name.split(" ")[0]},` : "Hello,";
  const fundLine = fundName
    ? `Alpine has prepared a private due-diligence workspace for <b>${fundName}</b>.`
    : `Alpine has prepared a private due-diligence workspace for you.`;
  const body = `
    <p style="margin:0 0 12px 0;font-size:14px;color:#1a1a2e;">${greeting}</p>
    <p style="margin:0 0 20px 0;font-size:14px;color:#1a1a2e;line-height:1.6;">${fundLine} You can use the link below to upload documents and follow the review.</p>
    <p style="margin:0 0 24px 0;text-align:center;">
      <a href="${portalUrl}" style="display:inline-block;padding:13px 28px;background:#0F0F10;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">Open your workspace →</a>
    </p>
    <p style="margin:0;font-size:12px;color:#64748B;line-height:1.6;">Or paste this link: <a href="${portalUrl}" style="color:#7B2CBF;">${portalUrl}</a></p>
    <p style="margin:24px 0 0 0;font-size:12px;color:#64748B;line-height:1.6;">Reply to this email with any questions.<br/>— Alpine Due Diligence</p>`;
  return wrapEmail(body);
}

export async function POST(req: NextRequest) {
  const adminEmail = await getAppAdminEmail(req);
  if (!adminEmail) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const body = (await req.json()) as OnboardBody;
    const customer_email = (body.customer_email ?? "").trim().toLowerCase();
    const customer_name = (body.customer_name ?? "").trim();
    const fund_name = (body.fund_name ?? "").trim();
    let token = (body.token ?? "").trim().toLowerCase();

    if (!customer_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer_email)) {
      return NextResponse.json({ error: "Valid customer_email required" }, { status: 400 });
    }
    if (!token) token = deriveToken(fund_name || customer_name || customer_email.split("@")[0]);
    if (!SLUG_RE.test(token)) {
      return NextResponse.json({ error: "Token must be lowercase letters/digits/hyphens (1-40 chars)." }, { status: 400 });
    }

    const portalUrl = `${appBaseUrl(req)}/portal/${token}`;

    await Promise.all([
      resend.emails.send({
        from: FROM_EMAIL,
        to: customer_email,
        bcc: ADMIN_BCC,
        subject: fund_name ? `Your Alpine workspace — ${fund_name}` : "Your Alpine workspace",
        html: inviteHtml(customer_name, fund_name, portalUrl),
        replyTo: ADMIN_BCC,
      }),
      persistCustomer({
        name: customer_name || customer_email.split("@")[0],
        email: customer_email,
        fund_name,
        portal_token: token,
        onboarded_by: adminEmail,
      }),
    ]);

    await logAudit({
      actor: adminEmail,
      action: "onboard.create",
      target: token,
      meta: { customer_email, customer_name, fund_name },
    });

    return NextResponse.json({
      ok: true,
      token,
      portal_url: portalUrl,
      created_by: adminEmail,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to onboard";
    console.error("[onboard] error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
