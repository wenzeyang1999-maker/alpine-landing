import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, rgb, degrees } from "pdf-lib";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = "Alpine Due Diligence <notifications@alpinedd.com>";

function buildEmailHtml(recipientName: string, filename: string, distributedBy: string) {
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
            <div style="font-size:10px;color:#f5f0e8;opacity:0.5;letter-spacing:0.1em;text-transform:uppercase;">Operational Due Diligence</div>
          </td>
        </tr>
      </table>
    </div>
    <div style="padding:32px 32px 24px;">
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
      </p>
    </div>
    <div style="padding:16px 32px;background:#f8f7f4;border-top:1px solid #e8e6e1;font-size:11px;color:#94a3b8;text-align:center;">
      Alpine Due Diligence Inc. · <a href="https://alpinedd.com" style="color:#7c3aed;text-decoration:none;">alpinedd.com</a>
    </div>
  </div>
</div>`;
}

export async function POST(req: NextRequest) {
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

    return new NextResponse(Buffer.from(watermarkedBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${attachmentFilename}"`,
        "X-Email-Sent": emailSent ? "true" : "false",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error("Watermark error:", err);
    return NextResponse.json({ error: "Failed to process PDF" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
