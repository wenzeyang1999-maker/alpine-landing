import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { usersInManager, firmsInManager } from "@/lib/db/schema";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = "Alpine Due Diligence <noreply@send.alpinedd.com>";
const ADMIN_EMAIL = "azhang@alpinedd.com";

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
      <div style="background-color:#ffffff;padding:36px 32px 32px 32px;">${body}</div>
      <div style="background-color:#f8f7f4;padding:20px 32px;border-radius:0 0 12px 12px;border-top:1px solid #e8e6e1;">
        <p style="margin:0;font-size:12px;color:#64748B;text-align:center;">
          Alpine Due Diligence Inc. &middot;
          <a href="https://alpinedd.com" style="color:#7B2CBF;text-decoration:none;">alpinedd.com</a>
        </p>
        <p style="margin:6px 0 0 0;font-size:11px;color:#94a3b8;text-align:center;">
          If you have questions, reply directly to
          <a href="mailto:${ADMIN_EMAIL}" style="color:#7B2CBF;text-decoration:none;">${ADMIN_EMAIL}</a>.
        </p>
      </div>
    </div>
  </div>`;
}

type UserRow = {
  id: string;
  email: string;
  full_name: string | null;
  is_verified: boolean;
  firm_id: string;
};

type FirmRow = { name: string };

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json() as { userId: string };
    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const [userRaw] = (await db
      .select({ id: usersInManager.id, email: usersInManager.email, full_name: usersInManager.fullName, is_verified: usersInManager.isVerified, firm_id: usersInManager.firmId })
      .from(usersInManager)
      .where(eq(usersInManager.id, userId))
      .limit(1)) as UserRow[];

    if (!userRaw) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (userRaw.is_verified) {
      return NextResponse.json({ error: "Already verified" }, { status: 409 });
    }

    // Approve
    try {
      await db
        .update(usersInManager)
        .set({ isVerified: true, verifiedAt: new Date().toISOString(), verifiedBy: ADMIN_EMAIL })
        .where(eq(usersInManager.id, userId));
    } catch (updateErr) {
      console.error("Verify update error:", updateErr);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    // Get firm name for email
    const [firmRaw] = (await db
      .select({ name: firmsInManager.name })
      .from(firmsInManager)
      .where(eq(firmsInManager.id, userRaw.firm_id))
      .limit(1)) as FirmRow[];

    const firmName = firmRaw?.name ?? "your firm";
    const displayName = userRaw.full_name ? `, ${userRaw.full_name.split(" ")[0]}` : "";

    // Notify the manager
    const body = `
      <p style="font-size:14px;line-height:1.6;color:#1a1a2e;margin:0 0 16px 0;">Hi${displayName},</p>
      <p style="font-size:14px;line-height:1.6;color:#1a1a2e;margin:0 0 16px 0;">
        Your Alpine Manager Portal account for <strong>${firmName}</strong> has been approved.
        You can now access your workspace and start building your Living DDQ.
      </p>
      <div style="margin:24px 0;">
        <a href="https://manager.alpinedd.com/login"
           style="display:inline-block;background:#1a1a2e;color:#ffffff;font-size:14px;font-weight:600;
                  padding:12px 24px;border-radius:8px;text-decoration:none;">
          Sign in to your workspace →
        </a>
      </div>
      <p style="font-size:14px;line-height:1.6;color:#1a1a2e;margin:0 0 24px 0;">
        Once signed in, you can respond to Alpine&rsquo;s 8-chapter institutional DDQ framework
        and generate shareable links for any LP.
      </p>
      <div style="border-top:1px solid #e8e6e1;padding-top:20px;margin-top:8px;">
        <p style="margin:0;font-size:13px;color:#64748B;line-height:1.6;">
          Best,<br/>The Alpine Team
        </p>
      </div>`;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: userRaw.email,
      subject: "Your Alpine Manager Portal account is approved",
      html: wrapEmail(body),
      replyTo: ADMIN_EMAIL,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Manager verify error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
