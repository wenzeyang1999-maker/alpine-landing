import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import React from "react";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import { INVESTOR_SESSION, verifySession } from "@/lib/investor/auth-session";
import { isValidReportSlug, getReportEntry } from "@/lib/investor/report-registry";
import { getReportPdfUrl } from "@/lib/investor/report-content";
import { ReportPrintDocument } from "@/components/investor/ReportPrintDocument";

// Headless Chromium + react-dom/server require the Node runtime, and the
// content is per-request, so never prerender/cache.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function pageHtml(body: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"/>
<style>
  @page { size: A4; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { margin: 0; padding: 0; }
  body { font-family: Georgia, "Times New Roman", serif; }
</style></head><body>${body}</body></html>`;
}

/** Stamp a light diagonal recipient watermark on every page. */
async function watermark(pdfBytes: Uint8Array, recipient: string): Promise<Uint8Array> {
  const doc = await PDFDocument.load(pdfBytes);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const text = `CONFIDENTIAL · ${recipient}`;
  for (const page of doc.getPages()) {
    const { width, height } = page.getSize();
    page.drawText(text, {
      x: width * 0.12,
      y: height * 0.45,
      size: 22,
      font,
      color: rgb(0.55, 0.58, 0.64),
      opacity: 0.1,
      rotate: degrees(35),
    });
  }
  return doc.save();
}

export async function GET(req: NextRequest) {
  // Auth: a valid investor session is required.
  const token = cookies().get(INVESTOR_SESSION.COOKIE_NAME)?.value;
  const email = await verifySession(token);
  if (!email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const slug = req.nextUrl.searchParams.get("slug") || "";
  if (!isValidReportSlug(slug)) {
    return new Response("Not found", { status: 404 });
  }
  const entry = getReportEntry(slug);
  if (!entry) return new Response("Not found", { status: 404 });

  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  // Imported dynamically: Next forbids a static react-dom/server import in app routes.
  const { renderToStaticMarkup } = await import("react-dom/server");
  const body = renderToStaticMarkup(
    React.createElement(ReportPrintDocument, { slug, recipient: email, date }),
  );
  const html = pageHtml(body);

  // Render to PDF with headless Chromium (Playwright's bundled browser). If
  // Chromium can't launch on this host (e.g. not installed), degrade gracefully
  // to the static sample PDF rather than 500-ing the download.
  let pdf: Uint8Array;
  try {
    const { chromium } = await import("playwright");
    const browser = await chromium.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] });
    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle" });
      const buf = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "16mm", bottom: "18mm", left: "14mm", right: "14mm" },
        displayHeaderFooter: true,
        headerTemplate: "<div></div>",
        footerTemplate:
          `<div style="width:100%;font-size:8px;color:#94a3b8;font-family:Helvetica,Arial,sans-serif;padding:0 14mm;display:flex;justify-content:space-between;">` +
          `<span>${entry.fundName} · Alpine ODD · CONFIDENTIAL</span>` +
          `<span>Page <span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
      });
      pdf = new Uint8Array(buf);
    } finally {
      await browser.close();
    }
  } catch (err) {
    console.error("[report-pdf] Chromium render failed, falling back to static PDF:", err);
    const fallback = getReportPdfUrl(slug);
    if (fallback) {
      const abs = fallback.startsWith("http") ? fallback : `${req.nextUrl.origin}${fallback}`;
      return Response.redirect(abs, 302);
    }
    return new Response("PDF generation unavailable", { status: 503 });
  }

  const stamped = await watermark(pdf, email);
  const filename = `${entry.fundName.replace(/[^\w.-]+/g, "_")}_Alpine_ODD_Report.pdf`;

  return new Response(Buffer.from(stamped), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
