import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = "azhang@alpinedd.com";
const FROM_EMAIL = "Alpine Due Diligence <notifications@alpinedd.com>";

function wrapEmail(body: string): string {
  return `
  <div style="background-color:#f1f0eb;padding:32px 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;">
      <div style="background-color:#1E2A3A;padding:28px 32px;border-radius:12px 12px 0 0;text-align:center;">
        <span style="font-size:22px;font-weight:700;letter-spacing:1.5px;color:#F5F0E8;">ALPINE</span>
        <span style="display:block;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#9B7EC8;margin-top:2px;">Due Diligence</span>
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

async function notifyAdmin(full_name: string, email: string, organization?: string, phone?: string) {
  const org = organization || "Not provided";
  const body = `
    <h2 style="margin:0 0 20px 0;font-size:20px;font-weight:700;color:#1a1a2e;">New Early Access Request</h2>
    <div style="border:1px solid #e8e6e1;border-radius:8px;overflow:hidden;">
      <table style="border-collapse:collapse;width:100%;">
        <tr><td style="padding:8px 12px;font-weight:600;color:#64748B;font-size:13px;width:110px;">Name</td><td style="padding:8px 12px;font-size:14px;color:#1a1a2e;">${full_name}</td></tr>
        <tr style="background:#f8f7f4;"><td style="padding:8px 12px;font-weight:600;color:#64748B;font-size:13px;">Email</td><td style="padding:8px 12px;font-size:14px;"><a href="mailto:${email}" style="color:#7B2CBF;text-decoration:none;">${email}</a></td></tr>
        <tr><td style="padding:8px 12px;font-weight:600;color:#64748B;font-size:13px;">Org</td><td style="padding:8px 12px;font-size:14px;color:#1a1a2e;">${org}</td></tr>
        ${phone ? `<tr style="background:#f8f7f4;"><td style="padding:8px 12px;font-weight:600;color:#64748B;font-size:13px;">Phone</td><td style="padding:8px 12px;font-size:14px;color:#1a1a2e;">${phone}</td></tr>` : ""}
      </table>
    </div>`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `New Early Access Request: ${full_name} (${org})`,
    html: wrapEmail(body),
  });
}

async function sendConfirmation(email: string, full_name: string) {
  const firstName = full_name.split(" ")[0] || "there";
  const body = `
    <p style="font-size:14px;line-height:1.6;color:#1a1a2e;margin:0 0 16px 0;">Hi ${firstName},</p>
    <p style="font-size:14px;line-height:1.6;color:#1a1a2e;margin:0 0 16px 0;">
      Thanks for requesting early access to Alpine. Your request has been received and our team will review it shortly.
      You'll hear back within 1 business day.
    </p>
    <p style="font-size:14px;line-height:1.6;color:#1a1a2e;margin:0 0 24px 0;">
      If you'd like to share context about what you're looking to evaluate ahead of our first conversation,
      please reach out to our founder Allen Zhang directly at
      <a href="mailto:azhang@alpinedd.com" style="color:#7B2CBF;text-decoration:none;">azhang@alpinedd.com</a>.
    </p>
    <div style="border-top:1px solid #e8e6e1;padding-top:20px;margin-top:8px;">
      <p style="margin:0;font-size:13px;color:#64748B;line-height:1.6;">
        Best,<br/>
        The Alpine Team<br/>
        Alpine Due Diligence<br/>
        <a href="https://alpinedd.com" style="color:#7B2CBF;text-decoration:none;">alpinedd.com</a>
      </p>
    </div>`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Thanks for requesting early access to Alpine",
    html: wrapEmail(body),
    replyTo: ADMIN_EMAIL,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { full_name, email, organization, phone } = await req.json();

    if (!full_name || !email) {
      return NextResponse.json({ detail: "Name and email are required." }, { status: 400 });
    }

    await Promise.all([
      notifyAdmin(full_name, email, organization, phone),
      sendConfirmation(email, full_name),
    ]);

    return NextResponse.json({ status: "ok", message: "You're on the list! We'll contact you within 1 business day." });
  } catch (err) {
    console.error("Early access email error:", err);
    return NextResponse.json({ detail: "Something went wrong. Please try again." }, { status: 500 });
  }
}
