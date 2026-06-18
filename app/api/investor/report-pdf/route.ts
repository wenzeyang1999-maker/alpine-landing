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

// Cap concurrent Chromium renders so a burst of downloads can't exhaust memory.
// Each render peaks ~0.6–1 GB; the B2 plan (3.5 GB) comfortably holds 2 at once.
const MAX_CONCURRENT_RENDERS = 2;
let activeRenders = 0;
const renderQueue: Array<() => void> = [];
async function acquireRenderSlot(): Promise<void> {
  if (activeRenders >= MAX_CONCURRENT_RENDERS) {
    await new Promise<void>((resolve) => renderQueue.push(resolve));
  }
  activeRenders += 1;
}
function releaseRenderSlot(): void {
  activeRenders -= 1;
  renderQueue.shift()?.();
}

function pageHtml(body: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet"/>
<style>
  @page { size: Letter; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { margin: 0; padding: 0; }
  body { font-family: Georgia, "Times New Roman", serif; }
</style></head><body>${body}</body></html>`;
}

/**
 * Read the actual page each `@@T:<id>@@` marker landed on in a rendered PDF.
 * Uses pdfjs to extract text per page — Chrome's real pagination, so the TOC
 * never drifts. Returns { id: pageNumber }.
 */
async function extractMarkerPages(bytes: Uint8Array): Promise<Record<string, number>> {
  const map: Record<string, number> = {};
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfjs: any = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const doc = await pdfjs.getDocument({ data: bytes, isEvalSupported: false, useSystemFonts: false }).promise;
    for (let p = 1; p <= doc.numPages; p++) {
      const pg = await doc.getPage(p);
      const tc = await pg.getTextContent();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const text = (tc.items as any[]).map((it) => it.str || "").join("");
      const re = /@@T:([^@]+)@@/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(text)) !== null) {
        if (map[m[1]] === undefined) map[m[1]] = p;
      }
    }
    if (typeof doc.cleanup === "function") doc.cleanup();
  } catch (err) {
    console.error("[report-pdf] TOC marker extraction failed:", err);
  }
  return map;
}

/**
 * Stamp the per-page chrome onto every page: navy left spine, running header
 * (fund name / ALPINE + rule), footer (Confidential / page number) and the
 * diagonal recipient watermark. The cover (page 0) gets only the spine and
 * watermark — no header/footer/number — matching the reference layout.
 */
async function stampChrome(pdfBytes: Uint8Array, opts: { fundName: string; recipient: string }): Promise<Uint8Array> {
  const { fundName, recipient } = opts;
  const doc = await PDFDocument.load(pdfBytes);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const navy = rgb(0.122, 0.227, 0.372); // #1f3a5f
  const gray = rgb(0.42, 0.45, 0.5);
  const faint = rgb(0.6, 0.62, 0.66);
  const rule = rgb(0.86, 0.88, 0.9);
  const pages = doc.getPages();
  pages.forEach((page, i) => {
    const { width, height } = page.getSize();
    // navy left spine on every page
    page.drawRectangle({ x: 0, y: 0, width: 6, height, color: navy });
    // diagonal recipient watermark
    page.drawText(`CONFIDENTIAL · ${recipient}`, {
      x: width * 0.14,
      y: height * 0.42,
      size: 22,
      font,
      color: rgb(0.55, 0.58, 0.64),
      opacity: 0.08,
      rotate: degrees(35),
    });
    if (i === 0) return; // cover: spine + watermark only
    // running header
    const hy = height - 34;
    page.drawText(fundName, { x: 50, y: hy, size: 8, font, color: gray });
    const aw = bold.widthOfTextAtSize("ALPINE", 8);
    page.drawText("ALPINE", { x: width - 40 - aw, y: hy, size: 8, font: bold, color: navy });
    page.drawLine({ start: { x: 50, y: hy - 7 }, end: { x: width - 40, y: hy - 7 }, thickness: 0.5, color: rule });
    // footer
    page.drawText("Confidential", { x: 50, y: 26, size: 7.5, font, color: faint });
    const pn = String(i + 1);
    const pw = font.widthOfTextAtSize(pn, 7.5);
    page.drawText(pn, { x: width - 40 - pw, y: 26, size: 7.5, font, color: faint });
  });
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
  // Render everything one size larger via page.pdf({ scale }). Full-page sections
  // (cover, chapter dividers) need a height that, once magnified by SCALE, still
  // fits the US-Letter content box (~243mm) — otherwise each spills onto a second page.
  const SCALE = 1.1;
  const fillHeight = `${Math.floor(243.4 / SCALE - 2)}mm`;
  // Imported dynamically: Next forbids a static react-dom/server import in app routes.
  const { renderToStaticMarkup } = await import("react-dom/server");
  const body = renderToStaticMarkup(
    React.createElement(ReportPrintDocument, { slug, recipient: email, date, fillHeight }),
  );
  const html = pageHtml(body);

  // Render to PDF with headless Chromium (Playwright's bundled browser). If
  // Chromium can't launch on this host (e.g. not installed), degrade gracefully
  // to the static sample PDF rather than 500-ing the download.
  let pdf: Uint8Array | null = null;
  await acquireRenderSlot();
  try {
    const { chromium } = await import("playwright");
    const browser = await chromium.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] });
    try {
      // page.pdf paginates at the US-Letter paper content box (not the browser
      // viewport), and page.pdf({ scale }) magnifies the rendering without changing
      // where the flow breaks — so the marker pass measures at the unscaled paper box.
      const VW = 687; // Letter content width  in CSS px (215.9 − 20 − 14 mm @ 96dpi)
      const VH = 920; // Letter content height in CSS px (279.4 − 20 − 16 mm @ 96dpi)
      const page = await browser.newPage({ viewport: { width: VW, height: VH } });
      await page.emulateMedia({ media: "print" });
      await page.setContent(html, { waitUntil: "networkidle" });

      // Measure where each [data-section]/[data-subsection] lands so the TOC can
      // show real page numbers. We simulate Chrome's pagination: walk the document
      // in order, filling a page-height cursor, advancing a page whenever a
      // break-inside:avoid block (chart, table group) won't fit in the remaining
      // space — the same gaps a naive height/page estimate misses.
      const pdfOpts = {
        format: "Letter" as const,
        printBackground: true,
        scale: SCALE,
        margin: { top: "20mm", bottom: "16mm", left: "20mm", right: "14mm" },
      };
      // ── Two-pass TOC ── Render once to discover the REAL page each section
      // lands on, then number the TOC exactly. Inject an invisible,
      // absolutely-positioned marker into every [data-section]/[data-subsection]
      // (absolute → zero layout shift, so the measure and final renders paginate
      // identically), render, and read each marker's actual PDF page. No estimation.
      await page.evaluate(() => {
        document.querySelectorAll("[data-section],[data-subsection]").forEach((el) => {
          const h = el as HTMLElement;
          const id = h.dataset.section || h.dataset.subsection;
          if (!id) return;
          if (!h.style.position) h.style.position = "relative";
          const m = document.createElement("span");
          m.textContent = `@@T:${id}@@`;
          m.setAttribute("data-tocmark", "1");
          m.style.cssText = "position:absolute;top:0;left:0;font-size:6px;color:#fff;opacity:0.01;white-space:nowrap;pointer-events:none";
          h.insertBefore(m, h.firstChild);
        });
      });
      const pageOf = await extractMarkerPages(new Uint8Array(await page.pdf(pdfOpts)));

      // Fill the real page numbers into the TOC, drop the markers, render final.
      await page.evaluate((map) => {
        document.querySelectorAll("[data-page-for]").forEach((el) => {
          const id = (el as HTMLElement).dataset.pageFor as string;
          if (map[id] != null) el.textContent = String(map[id]);
        });
        document.querySelectorAll("[data-tocmark]").forEach((el) => el.remove());
      }, pageOf);

      const buf = await page.pdf(pdfOpts);
      pdf = new Uint8Array(buf);
    } finally {
      await browser.close();
    }
  } catch (err) {
    console.error("[report-pdf] Chromium render failed, falling back to static PDF:", err);
  } finally {
    releaseRenderSlot();
  }

  // Chromium unavailable or render failed → degrade to the static sample PDF.
  if (!pdf) {
    const fallback = getReportPdfUrl(slug);
    if (fallback) {
      const abs = fallback.startsWith("http") ? fallback : `${req.nextUrl.origin}${fallback}`;
      return Response.redirect(abs, 302);
    }
    return new Response("PDF generation unavailable", { status: 503 });
  }

  const stamped = await stampChrome(pdf, { fundName: entry.fundName, recipient: email });
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
