import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, rgb, degrees } from "pdf-lib";
import { Resend } from "resend";
import { readFile } from "fs/promises";
import path from "path";
import { supabase } from "@/lib/supabase";
import { checkRateLimit } from "@/lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = "Alpine Due Diligence <notifications@alpinedd.com>";
const PDF_FILENAME = "Alpine_LP_Readiness_Gap_Whitepaper.pdf";
const PDF_PATH = path.join(process.cwd(), "docs", "whitepaper.pdf");

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

function buildEmailHtml(recipientName: string) {
  const firstName = recipientName.trim().split(/\s+/)[0] || recipientName;
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  return `
<div style="background:#f1f0eb;padding:32px 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">
    <div style="background:#1a1a2e;padding:20px 28px;">
      <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        <tr>
          <td style="vertical-align:middle;padding-right:14px;">
            <img src="https://alpinedd.com/logo.png" alt="Alpine" style="height:36px;width:auto;display:block;" />
          </td>
          <td style="vertical-align:middle;">
            <div style="font-size:15px;font-weight:700;color:#f5f0e8;">Alpine Due Diligence</div>
            <div style="font-size:10px;color:#f5f0e8;opacity:0.5;letter-spacing:0.1em;text-transform:uppercase;">White Paper</div>
          </td>
        </tr>
      </table>
    </div>
    <div style="padding:32px 32px 24px;">
      <p style="font-size:15px;font-weight:600;color:#0f172a;margin:0 0 16px;">Hi ${escapeHtml(firstName)},</p>
      <p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 14px;">
        Thank you for your interest. Attached is your personal copy of <strong>The LP Readiness Gap</strong> — the Alpine × Acephalt white paper on emerging-manager ODD trajectory.
      </p>
      <p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 14px;">
        This document has been watermarked for your personal use and should not be reproduced or distributed further.
      </p>
      <div style="margin:24px 0;padding:16px 18px;background:#f8f7f4;border-left:3px solid #7c3aed;border-radius:4px;">
        <div style="font-size:11px;font-weight:700;color:#7c3aed;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Document Details</div>
        <div style="font-size:13px;color:#475569;line-height:1.8;">
          <div><span style="color:#94a3b8;">Title:</span> The LP Readiness Gap</div>
          <div><span style="color:#94a3b8;">Distributed to:</span> ${escapeHtml(recipientName)}</div>
          <div><span style="color:#94a3b8;">Date:</span> ${today}</div>
          <div><span style="color:#94a3b8;">Classification:</span> Confidential — Single Recipient</div>
        </div>
      </div>
      <p style="font-size:13px;color:#94a3b8;line-height:1.6;margin:0 0 8px;">
        Please do not reply to this automated message. If you have questions, contact <a href="mailto:azhang@alpinedd.com" style="color:#7c3aed;text-decoration:none;">azhang@alpinedd.com</a> or reach out to your Alpine contact.
      </p>
      <p style="font-size:11px;color:#cbd5e1;line-height:1.55;margin:0 0 20px;">
        This mailbox is not monitored.
      </p>
      <p style="font-size:14px;color:#0f172a;line-height:1.6;margin:0;">
        Best,<br/>
        <span style="font-weight:600;">The Alpine Team</span>
      </p>
    </div>
    <div style="padding:16px 32px;background:#f8f7f4;border-top:1px solid #e8e6e1;font-size:11px;color:#94a3b8;text-align:center;">
      Alpine Due Diligence Inc. · <a href="https://alpinedd.com" style="color:#7c3aed;text-decoration:none;">alpinedd.com</a>
    </div>
  </div>
</div>`;
}

// pdf-lib's default Helvetica only supports WinAnsi — drawing CJK / other
// non-Latin characters throws. Strip them for the watermark; the email
// address (always ASCII) still uniquely identifies the recipient.
function asciiOnly(s: string): string {
  // eslint-disable-next-line no-control-regex
  return s.replace(/[^\x00-\x7E]/g, "").trim();
}

async function watermarkPdf(pdfBytes: Buffer, recipientName: string, recipientEmail: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const safeName = asciiOnly(recipientName);
  const wmLine1 = safeName ? `CONFIDENTIAL — ${safeName}` : "CONFIDENTIAL";
  const wmLine2 = recipientEmail;

  for (const page of pdfDoc.getPages()) {
    const { width, height } = page.getSize();
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const x = (width / 3) * c + width / 3 / 2 - 90;
        const y = (height / 3) * r + height / 3 / 2;
        page.drawText(wmLine1, {
          x, y,
          size: 16,
          color: rgb(0.65, 0.65, 0.65),
          opacity: 0.18,
          rotate: degrees(45),
        });
        page.drawText(wmLine2, {
          x: x + 14,
          y: y - 20,
          size: 13,
          color: rgb(0.65, 0.65, 0.65),
          opacity: 0.18,
          rotate: degrees(45),
        });
      }
    }
  }

  return pdfDoc.save();
}

export async function POST(req: NextRequest) {
  const ip = req.ip || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = checkRateLimit(ip);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds ?? 60) } },
    );
  }

  try {
    const body = (await req.json().catch(() => ({}))) as { name?: unknown; email?: unknown };
    const rawName = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
    const rawEmail = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!rawName) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!isValidEmail(rawEmail)) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }

    const pdfBytes = await readFile(PDF_PATH);
    const watermarkedBytes = await watermarkPdf(pdfBytes, rawName, rawEmail);

    await resend.emails.send({
      from: FROM_EMAIL,
      to: rawEmail,
      subject: "Your copy of The LP Readiness Gap white paper",
      html: buildEmailHtml(rawName),
      attachments: [
        {
          filename: PDF_FILENAME,
          content: Buffer.from(watermarkedBytes),
        },
      ],
    });

    // Best-effort log — don't fail the request if logging fails.
    try {
      await supabase.from("watermark_distributions").insert({
        recipient_name: rawName,
        recipient_email: rawEmail,
        filename: PDF_FILENAME,
        distributed_by: "whitepaper-self-serve",
        email_sent: true,
      });
    } catch (logErr) {
      console.error("Watermark distribution log error:", logErr);
    }

    return NextResponse.json({ status: "ok", message: "Sent. Check your inbox." });
  } catch (err) {
    console.error("Whitepaper download error:", err);
    return NextResponse.json({ error: "Failed to send white paper. Please try again." }, { status: 500 });
  }
}
