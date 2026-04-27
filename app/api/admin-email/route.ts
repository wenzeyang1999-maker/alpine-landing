import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = "Alpine Due Diligence <notifications@alpinedd.com>";

export async function POST(req: NextRequest) {
  try {
    const { to, subject, body } = await req.json();

    if (!to || !subject || !body) {
      return NextResponse.json({ error: "Missing to, subject, or body" }, { status: 400 });
    }

    const html = `
      <div style="background:#f1f0eb;padding:32px 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
        <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">
          <div style="background:#1a1a2e;padding:20px 28px;display:flex;align-items:center;gap:12px;">
            <img src="https://alpinedd.com/alpine-icon.svg" alt="Alpine" style="height:28px;width:28px;" />
            <div>
              <div style="font-size:15px;font-weight:700;color:#f5f0e8;">Alpine Due Diligence</div>
              <div style="font-size:10px;color:#f5f0e8;opacity:0.5;letter-spacing:0.1em;text-transform:uppercase;">ODD Admin</div>
            </div>
          </div>
          <div style="padding:28px 32px;">
            <div style="font-size:14px;color:#1a1a2e;line-height:1.8;white-space:pre-wrap;">${body.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
          </div>
          <div style="padding:16px 32px;background:#f8f7f4;border-top:1px solid #e8e6e1;font-size:11px;color:#94a3b8;text-align:center;">
            Sent via Alpine ODD Admin Portal · <a href="https://alpinedd.com" style="color:#7B2CBF;text-decoration:none;">alpinedd.com</a>
          </div>
        </div>
      </div>`;

    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[admin-email] error:", err);
    return NextResponse.json({ error: err.message || "Failed to send email" }, { status: 500 });
  }
}
