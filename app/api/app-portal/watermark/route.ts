import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, rgb, degrees } from "pdf-lib";
import { Resend } from "resend";
import { supabase } from "@/lib/app-portal/supabase";
import { getAppAdminEmail } from "@/lib/app-portal/auth-session";
import { wrapEmail } from "@/lib/app-portal/email-template";
import { logAudit } from "@/lib/app-portal/audit-log";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = "Alpine Due Diligence <notifications@alpinedd.com>";

function buildEmailHtml(recipientName: string, filename: string, distributedBy: string) {
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const body = `
    <p style="font-size:15px;font-weight:600;color:#0f172a;margin:0 0 16px;">Dear ${recipientName},</p>
    <p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 14px;">
      Please find attached the confidential ODD Report prepared by Alpine Due Diligence Inc.
      This document has been watermarked for your personal use and should not be reproduced or distributed further.
    </p>
    <p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 14px;">
      If you have any questions regarding the contents of this report, please do not hesitate to reach out to your Alpine contact directly.
    </p>
    <div style="margin:24px 0;padding:16px 18px;background:#f8f7f4;border-left:3px solid #7c3aed;border-radius:4px;">
      <div style="font-size:11px;font-weight:700;color:#7c3aed;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Document Details</div>
      <div style="font-size:13px;color:#475569;line-height:1.8;">
        <div><span style="color:#94a3b8;">File:</span> ${filename}</div>
        <div><span style="color:#94a3b8;">Distributed by:</span> ${distributedBy}</div>
        <div><span style="color:#94a3b8;">Date:</span> ${today}</div>
        <div><span style="color:#94a3b8;">Classification:</span> Confidential — Single Recipient</div>
      </div>
    </div>
    <p style="font-size:13px;color:#94a3b8;line-height:1.6;margin:0;">
      This email and its attachments are confidential and intended solely for the named recipient.
      Unauthorized use, disclosure, or distribution is strictly prohibited.
    </p>`;
  return wrapEmail(body, { brandSubtitle: "Operational Due Diligence" });
}

export async function POST(req: NextRequest) {
  const adminEmail = await getAppAdminEmail(req);
  if (!adminEmail) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const recipientName = (formData.get("recipientName") as string | null)?.trim();
    const recipientEmail = (formData.get("recipientEmail") as string | null)?.trim();
    const distributedBy = (formData.get("distributedBy") as string | null)?.trim() ?? "admin";

    if (!file || !recipientName) {
      return NextResponse.json({ error: "file and recipientName are required" }, { status: 400 });
    }

    const pdfBytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const wmLine1 = `CONFIDENTIAL — ${recipientName}`;
    const wmLine2 = recipientEmail ?? "";

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
          if (wmLine2) {
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
    }

    const watermarkedBytes = await pdfDoc.save();
    const attachmentFilename = `${file.name.replace(".pdf", "")}_${recipientName.replace(/\s+/g, "_")}_CONFIDENTIAL.pdf`;

    // Send email if address provided
    let emailSent = false;
    if (recipientEmail) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: recipientEmail,
        subject: `Alpine ODD Report — Confidential Copy for ${recipientName}`,
        html: buildEmailHtml(recipientName, attachmentFilename, distributedBy),
        attachments: [
          {
            filename: attachmentFilename,
            content: Buffer.from(watermarkedBytes),
          },
        ],
      });
      emailSent = true;
    }

    // Log to Supabase
    await supabase.from("watermark_distributions").insert({
      recipient_name: recipientName,
      recipient_email: recipientEmail ?? null,
      filename: file.name,
      distributed_by: distributedBy,
      email_sent: emailSent,
    });
    await logAudit({
      actor: adminEmail,
      action: "watermark.distribute",
      target: recipientEmail ?? recipientName,
      meta: { filename: file.name, email_sent: emailSent },
    });

    return new NextResponse(Buffer.from(watermarkedBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${attachmentFilename}"`,
        "X-Email-Sent": emailSent ? "true" : "false",
      },
    });
  } catch (err) {
    console.error("Watermark error:", err);
    return NextResponse.json({ error: "Failed to process PDF" }, { status: 500 });
  }
}
