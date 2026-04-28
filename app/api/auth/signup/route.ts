import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = "azhang@alpinedd.com";
const FROM_EMAIL = "Alpine Due Diligence <notifications@alpinedd.com>";

function wrapEmail(body: string): string {
  return `
  <div style="background-color:#f1f0eb;padding:32px 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;">
      <div style="background-color:#ffffff;padding:24px 32px;border-radius:12px 12px 0 0;text-align:center;border-bottom:1px solid #e8e6e1;">
        <div style="display:inline-flex;align-items:center;gap:10px;">
          <img src="https://alpinedd.com/alpine-icon.svg" alt="Alpine" style="height:36px;width:36px;" />
          <div style="text-align:left;margin-left:10px;">
            <div style="font-size:17px;font-weight:700;color:#1a1a2e;letter-spacing:-0.02em;line-height:1.1;">ALPINE</div>
            <div style="font-size:9px;font-weight:600;color:#64748B;letter-spacing:0.12em;text-transform:uppercase;">Due Diligence</div>
          </div>
        </div>
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

function userTypeLabel(user_type: string) {
  if (user_type === "asset_allocator")    return "Asset Allocator";
  if (user_type === "investment_manager") return "Investment Manager";
  return "Other";
}

async function notifyAdmin(params: {
  full_name: string;
  email: string;
  organization: string;
  user_type: string;
  job_title?: string;
  aum?: string;
}) {
  const { full_name, email, organization, user_type, job_title, aum } = params;
  const timestamp = new Date().toLocaleString("en-US", {
    timeZone: "America/Toronto",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const rows = [
    { label: "Type",         value: "New Signup",                                                                            bg: false },
    { label: "Name",         value: full_name,                                                                               bg: true  },
    { label: "Email",        value: `<a href="mailto:${email}" style="color:#7B2CBF;text-decoration:none;">${email}</a>`,    bg: false },
    { label: "Company",      value: organization,                                                                            bg: true  },
    { label: "Org Type",     value: userTypeLabel(user_type),                                                                bg: false },
    { label: "Job Title",    value: job_title || "—",                                                                        bg: true  },
    { label: "AUM / Commit", value: aum || "—",                                                                             bg: false },
    { label: "Submitted",    value: timestamp,                                                                               bg: true  },
  ];

  const tableRows = rows.map(({ label, value, bg }) =>
    `<tr${bg ? ' style="background:#f8f7f4;"' : ""}>
      <td style="padding:10px 14px;font-weight:600;color:#64748B;font-size:13px;width:120px;white-space:nowrap;">${label}</td>
      <td style="padding:10px 14px;font-size:14px;color:#1a1a2e;">${value}</td>
    </tr>`
  ).join("");

  const body = `
    <h2 style="margin:0 0 6px 0;font-size:20px;font-weight:700;color:#1a1a2e;">New Account Signup</h2>
    <p style="margin:0 0 20px 0;font-size:14px;color:#64748B;">A new user has created an account on alpinedd.com.</p>

    <div style="border:1px solid #e8e6e1;border-radius:8px;overflow:hidden;margin-bottom:24px;">
      <table style="border-collapse:collapse;width:100%;">${tableRows}</table>
    </div>

    <div style="background:#f0f7ff;border:1px solid #bfdbfe;border-radius:8px;padding:14px 16px;margin-bottom:24px;">
      <p style="margin:0;font-size:13px;color:#1e40af;line-height:1.6;">
        <strong>Action:</strong> This user has been sent a verification email. Their account will be active once they confirm their address.
      </p>
    </div>

    <p style="margin:0 0 24px 0;text-align:center;">
      <a href="https://alpinedd.com/admin" style="display:inline-block;padding:11px 28px;background:#7B2CBF;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">
        View in Admin Panel &rarr;
      </a>
    </p>`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `New Signup — ${full_name}, ${organization}`,
    html: wrapEmail(body),
  });
}

async function sendVerificationEmail(email: string, full_name: string, verificationUrl: string) {
  const firstName = full_name.split(" ")[0] || "there";

  const body = `
    <p style="font-size:14px;line-height:1.6;color:#1a1a2e;margin:0 0 16px 0;">Hi ${firstName},</p>
    <p style="font-size:14px;line-height:1.6;color:#1a1a2e;margin:0 0 24px 0;">
      Welcome to Alpine. Please verify your email address to activate your account.
    </p>

    <p style="margin:0 0 28px 0;text-align:center;">
      <a href="${verificationUrl}"
         style="display:inline-block;padding:14px 32px;background:#0F0F10;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;letter-spacing:-0.01em;">
        Verify Email Address &rarr;
      </a>
    </p>

    <p style="font-size:13px;line-height:1.6;color:#64748B;margin:0 0 8px 0;">
      This link expires in 24 hours. If you didn&apos;t create an Alpine account, you can safely ignore this email.
    </p>

    <div style="border-top:1px solid #e8e6e1;padding-top:20px;margin-top:20px;">
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
    subject: "Verify your Alpine account",
    html: wrapEmail(body),
    replyTo: ADMIN_EMAIL,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { email, password, full_name, organization, user_type, job_title, aum } = await req.json();

    if (!email || !password || !full_name || !organization) {
      return NextResponse.json({ error: "Name, email, company, and password are required." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    // Create user in Supabase Auth and get a verification link in one call
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: "signup",
      email,
      password,
      options: {
        data: { full_name, organization, user_type, job_title: job_title || null, aum: aum || null },
        redirectTo: "https://alpinedd.com/login",
      },
    });

    if (linkError) {
      const msg = linkError.message.toLowerCase();
      if (msg.includes("already registered") || msg.includes("already exists") || msg.includes("unique")) {
        return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
      }
      return NextResponse.json({ error: linkError.message }, { status: 400 });
    }

    const verificationUrl = linkData.properties.action_link;

    // Persist all profile fields in the users table
    await supabase.from("users").upsert(
      {
        email,
        full_name,
        organization,
        user_type:  user_type  || null,
        job_title:  job_title  || null,
        aum:        aum        || null,
        role: "analyst",
        is_active: false, // becomes true after email verification
      },
      { onConflict: "email" }
    );

    // Fire both emails in parallel
    await Promise.all([
      notifyAdmin({ full_name, email, organization, user_type, job_title, aum }),
      sendVerificationEmail(email, full_name, verificationUrl),
    ]);

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
