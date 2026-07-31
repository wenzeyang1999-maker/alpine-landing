import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = "Alpine Due Diligence <notifications@alpinedd.com>";

// Always return this, whether or not the email maps to a real account, so the
// endpoint cannot be used to enumerate which addresses have accounts.
const GENERIC_OK = NextResponse.json({ ok: true });

// Resolve the canonical apex origin (alpinedd.com) regardless of which host the
// request arrived on. The /set-password page lives on the apex host only; the
// app./manager. subdomains gate it behind auth, so a link there would 404/redirect.
function apexOrigin(req: NextRequest): string {
  const host = (req.headers.get("host") ?? "alpinedd.com").toLowerCase();
  const apex = host.replace(/^(app|manager)\./, "");
  const proto = req.headers.get("x-forwarded-proto") ?? (apex.startsWith("localhost") ? "http" : "https");
  return `${proto}://${apex}`;
}

function wrapEmail(body: string): string {
  return `
  <div style="background-color:#f1f0eb;padding:32px 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;">
      <div style="background-color:#ffffff;padding:24px 32px;border-radius:12px 12px 0 0;text-align:center;border-bottom:1px solid #e8e6e1;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:0 auto;">
          <tr>
            <td style="vertical-align:middle;padding-right:12px;">
              <img src="https://alpinedd.com/logo.png" alt="Alpine" style="height:36px;width:auto;display:block;" />
            </td>
            <td style="vertical-align:middle;text-align:left;">
              <div style="font-size:17px;font-weight:700;color:#1a1a2e;letter-spacing:-0.02em;line-height:1.1;">ALPINE</div>
              <div style="font-size:9px;font-weight:600;color:#64748B;letter-spacing:0.12em;text-transform:uppercase;">Due Diligence</div>
            </td>
          </tr>
        </table>
      </div>
      <div style="background-color:#ffffff;padding:36px 32px 32px 32px;">
        ${body}
      </div>
      <div style="background-color:#f8f7f4;padding:20px 32px;border-radius:0 0 12px 12px;border-top:1px solid #e8e6e1;">
        <p style="margin:0;font-size:12px;color:#64748B;text-align:center;">
          Alpine Due Diligence Inc. &middot;
          <a href="https://alpinedd.com" style="color:#7B2CBF;text-decoration:none;">alpinedd.com</a>
        </p>
        <p style="margin:6px 0 0 0;font-size:11px;color:#94a3b8;text-align:center;">
          Your data is encrypted and never used for AI training.
        </p>
      </div>
    </div>
  </div>`;
}

async function sendResetEmail(email: string, fullName: string | null, resetUrl: string) {
  const firstName = (fullName ?? "").split(" ")[0] || "there";
  const body = `
    <p style="font-size:14px;line-height:1.6;color:#1a1a2e;margin:0 0 16px 0;">Hi ${firstName},</p>
    <p style="font-size:14px;line-height:1.6;color:#1a1a2e;margin:0 0 24px 0;">
      We received a request to reset the password for your Alpine account. Click the button below to choose a new password.
    </p>
    <p style="margin:0 0 24px 0;text-align:center;">
      <a href="${resetUrl}" style="display:inline-block;padding:12px 30px;background:#7B2CBF;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">
        Reset your password &rarr;
      </a>
    </p>
    <p style="font-size:13px;line-height:1.6;color:#64748B;margin:0 0 8px 0;">
      This link expires in 24 hours and can be used once. If you did not request a reset, you can safely ignore this email; your password will not change.
    </p>
    <p style="font-size:12px;line-height:1.6;color:#94a3b8;margin:16px 0 0 0;word-break:break-all;">
      If the button does not work, paste this link into your browser:<br />${resetUrl}
    </p>`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Reset your Alpine password",
    html: wrapEmail(body),
  });
}

// POST /api/auth/forgot-password  { email }
// Mints a single-use verification_token on the users row (24h TTL, consumed by
// /api/auth/set-password) and emails a /set-password link. Response is identical
// whether or not the account exists, to prevent account enumeration.
export async function POST(req: NextRequest) {
  let email = "";
  try {
    const body = (await req.json()) as { email?: string };
    email = (body.email ?? "").trim().toLowerCase();
  } catch {
    return GENERIC_OK;
  }

  // Basic shape check; on anything invalid, still return the generic response.
  if (!email || !email.includes("@")) {
    return GENERIC_OK;
  }

  try {
    const [row] = await db
      .select({ id: users.id, email: users.email, fullName: users.fullName })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (row) {
      const token = crypto.randomBytes(32).toString("hex");
      await db
        .update(users)
        .set({ verificationToken: token, verificationSentAt: new Date().toISOString() })
        .where(eq(users.id, row.id));

      const resetUrl = `${apexOrigin(req)}/set-password?token=${token}`;
      await sendResetEmail(row.email, row.fullName, resetUrl);
    }
  } catch (err) {
    // Never surface internal state to the caller; log for ops.
    console.error("[auth/forgot-password] error:", err);
  }

  return GENERIC_OK;
}
