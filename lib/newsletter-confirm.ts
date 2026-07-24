// Newsletter double-opt-in confirmation email — single source of truth.
// Used by /api/subscribe (first send) and the admin "Resend confirmation" action.

import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export function newToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/** Confirmation link the recipient clicks to confirm their email. */
export function buildConfirmUrl(baseUrl: string, token: string): string {
  return `${baseUrl.replace(/\/$/, "")}/api/subscribe/confirm?token=${token}`;
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

export async function sendConfirmEmail(to: string, confirmUrl: string, fullName: string | null): Promise<void> {
  await resend.emails.send({
    from: "Alpine <notifications@alpinedd.com>",
    to,
    subject: "Confirm your Alpine subscription",
    html: confirmEmailHtml(confirmUrl, fullName),
    text: confirmEmailText(confirmUrl, fullName),
  });
}
