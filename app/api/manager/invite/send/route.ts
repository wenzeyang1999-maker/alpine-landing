import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getCurrentManager } from "@/lib/manager/access";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = "Alpine Due Diligence <notifications@alpinedd.com>";

export async function POST(req: NextRequest) {
  try {
    const manager = await getCurrentManager();
    if (!manager) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!manager.is_verified) return NextResponse.json({ error: "Account not verified" }, { status: 403 });

    const { to, inviteUrl } = await req.json();

    if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to.trim())) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (!inviteUrl || !inviteUrl.startsWith("http")) {
      return NextResponse.json({ error: "Missing invite URL." }, { status: 400 });
    }

    const senderName = manager.full_name ?? manager.email;
    const firmName = manager.firm_name ?? "your firm";

    const html = `
<div style="background:#f1f0eb;padding:32px 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;">

    <div style="background:#1a1a2e;padding:20px 28px;border-radius:12px 12px 0 0;">
      <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        <tr>
          <td style="vertical-align:middle;padding-right:14px;">
            <img src="https://alpinedd.com/alpine-logo-light.svg" alt="Alpine" style="height:28px;width:auto;display:block;" />
          </td>
          <td style="vertical-align:middle;padding-left:14px;border-left:1px solid rgba(255,255,255,0.15);">
            <div style="font-size:11px;font-weight:700;color:#f5f0e8;opacity:0.6;letter-spacing:0.1em;text-transform:uppercase;">For Managers</div>
          </td>
        </tr>
      </table>
    </div>

    <div style="background:#fff;padding:32px 36px;">
      <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#0f172a;letter-spacing:-0.02em;">
        You've been invited to join the Alpine workspace
      </h2>
      <p style="margin:0 0 24px;font-size:14px;color:#64748b;line-height:1.6;">
        <strong style="color:#1a1a2e;">${senderName}</strong> has invited you to collaborate on the due diligence workspace for <strong style="color:#1a1a2e;">${firmName}</strong> on Alpine.
      </p>

      <p style="margin:0 0 12px;font-size:13px;color:#475569;line-height:1.6;">
        Click the button below to set up your account and get started. The link is secure and tied to this workspace.
      </p>

      <div style="margin:24px 0;">
        <a href="${inviteUrl}"
           style="display:inline-block;background:#1a1a2e;color:#fff;text-decoration:none;padding:13px 24px;border-radius:8px;font-size:14px;font-weight:600;letter-spacing:-0.01em;">
          Accept invitation →
        </a>
      </div>

      <div style="margin-top:24px;padding:14px 16px;background:#f8f7f4;border-radius:8px;border:1px solid #e8e6e1;">
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;">Or copy the link</p>
        <p style="margin:0;font-size:12px;color:#475569;word-break:break-all;font-family:'Courier New',monospace;">${inviteUrl}</p>
      </div>

      <p style="margin:24px 0 0;font-size:12px;color:#94a3b8;line-height:1.6;">
        If you weren't expecting this invitation, you can ignore this email. The link will remain active until revoked.
      </p>
    </div>

    <div style="background:#f8f7f4;padding:14px 32px;border-radius:0 0 12px 12px;border-top:1px solid #e8e6e1;font-size:11px;color:#94a3b8;text-align:center;">
      Alpine Due Diligence · <a href="https://alpinedd.com" style="color:#7c3aed;text-decoration:none;">alpinedd.com</a>
    </div>

  </div>
</div>`;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: to.trim(),
      subject: `${senderName} invited you to the Alpine workspace — ${firmName}`,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to send email";
    console.error("[invite-send] error:", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
