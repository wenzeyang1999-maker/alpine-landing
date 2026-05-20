import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getAppAdminEmail } from "@/lib/app-portal/auth-session";
import { wrapEmail, escapeBody } from "@/lib/app-portal/email-template";
import { logAudit } from "@/lib/app-portal/audit-log";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = "Alpine Due Diligence <notifications@alpinedd.com>";

export async function POST(req: NextRequest) {
  const adminEmail = await getAppAdminEmail(req);
  if (!adminEmail) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const { to, subject, body } = await req.json();
    if (!to || !subject || !body) {
      return NextResponse.json({ error: "Missing to, subject, or body" }, { status: 400 });
    }

    const html = wrapEmail(
      `<div style="font-size:14px;color:#1a1a2e;line-height:1.8;white-space:pre-wrap;">${escapeBody(body)}</div>`,
      { brandSubtitle: "ODD Admin" },
    );

    await resend.emails.send({ from: FROM_EMAIL, to, subject, html });
    await logAudit({ actor: adminEmail, action: "admin-email.send", target: to, meta: { subject } });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to send email";
    console.error("[admin-email] error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
