import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = "azhang@alpinedd.com";
const FROM_EMAIL = "Alpine Due Diligence <noreply@send.alpinedd.com>";

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
              <div style="font-size:9px;font-weight:600;color:#64748B;letter-spacing:0.12em;text-transform:uppercase;">For Managers</div>
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
          Your data is encrypted and never used for model training.
        </p>
      </div>
    </div>
  </div>`;
}

async function notifyAdmin(email: string, ip: string | null) {
  const timestamp = new Date().toLocaleString("en-US", {
    timeZone: "America/Toronto",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const rows = [
    { label: "Type",      value: "Manager Portal Invite Request", bg: false },
    { label: "Email",     value: `<a href="mailto:${email}" style="color:#7B2CBF;text-decoration:none;">${email}</a>`, bg: true },
    { label: "Source",    value: "manager.alpinedd.com", bg: false },
    { label: "IP",        value: ip || "unknown", bg: true },
    { label: "Submitted", value: timestamp, bg: false },
  ];

  const tableRows = rows.map(({ label, value, bg }) =>
    `<tr${bg ? ' style="background:#f8f7f4;"' : ""}>
      <td style="padding:10px 14px;font-weight:600;color:#64748B;font-size:13px;width:110px;white-space:nowrap;">${label}</td>
      <td style="padding:10px 14px;font-size:14px;color:#1a1a2e;">${value}</td>
    </tr>`
  ).join("");

  const body = `
    <h2 style="margin:0 0 6px 0;font-size:20px;font-weight:700;color:#1a1a2e;">New Manager Portal Invite Request</h2>
    <p style="margin:0 0 20px 0;font-size:14px;color:#64748B;">A manager submitted a request on manager.alpinedd.com.</p>

    <div style="border:1px solid #e8e6e1;border-radius:8px;overflow:hidden;margin-bottom:24px;">
      <table style="border-collapse:collapse;width:100%;">${tableRows}</table>
    </div>

    <div style="background:#f0f7ff;border:1px solid #bfdbfe;border-radius:8px;padding:14px 16px;margin-bottom:24px;">
      <p style="margin:0;font-size:13px;color:#1e40af;line-height:1.6;">
        <strong>Next step:</strong> Reply to ${email} within 1 business day to confirm receipt. If approved for early access, create a manager invite from the admin panel.
      </p>
    </div>`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `New Manager Portal Invite Request — ${email}`,
    html: wrapEmail(body),
  });
}

async function sendConfirmation(email: string) {
  const body = `
    <p style="font-size:14px;line-height:1.6;color:#1a1a2e;margin:0 0 16px 0;">Hi there,</p>
    <p style="font-size:14px;line-height:1.6;color:#1a1a2e;margin:0 0 16px 0;">
      Thanks for requesting early access to Alpine for Managers. Your request has been received.
    </p>
    <p style="font-size:14px;line-height:1.6;color:#1a1a2e;margin:0 0 24px 0;">
      During early access, Alpine for Managers is invite-only. We'll review your request and reply within 1 business day.
      If you'd like to share which allocators you're currently working with, reply to this email directly.
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
    subject: "Thanks for requesting access to Alpine for Managers",
    html: wrapEmail(body),
    replyTo: ADMIN_EMAIL,
  });
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") ?? "";
    let email = "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      email = (body.email ?? "").trim();
    } else {
      // form-encoded submission from the landing page
      const form = await req.formData();
      email = String(form.get("email") ?? "").trim();
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { detail: "Please enter a valid email." },
        { status: 400 },
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip");

    await Promise.all([notifyAdmin(email, ip), sendConfirmation(email)]);

    // Form submissions get a redirect to thank-you; JSON requests get JSON.
    if (contentType.includes("application/json")) {
      return NextResponse.json({
        status: "ok",
        message: "Request received. We'll be in touch within 1 business day.",
      });
    }
    return NextResponse.redirect(
      new URL("/thank-you?source=manager", req.url),
      303,
    );
  } catch (err) {
    console.error("Manager invite request error:", err);
    return NextResponse.json(
      { detail: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
