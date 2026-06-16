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
<style>
  @page { size: A4; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { margin: 0; padding: 0; }
  body { font-family: Georgia, "Times New Roman", serif; }
</style></head><body>${body}</body></html>`;
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
  // Imported dynamically: Next forbids a static react-dom/server import in app routes.
  const { renderToStaticMarkup } = await import("react-dom/server");
  const body = renderToStaticMarkup(
    React.createElement(ReportPrintDocument, { slug, recipient: email, date }),
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
      const page = await browser.newPage({ viewport: { width: 665, height: 986 } });
      await page.emulateMedia({ media: "print" });
      await page.setContent(html, { waitUntil: "networkidle" });

      // Measure where each [data-section]/[data-subsection] lands so the TOC can
      // show real page numbers. We simulate Chrome's pagination: walk the document
      // in order, filling a page-height cursor, advancing a page whenever a
      // break-inside:avoid block (chart, table group) won't fit in the remaining
      // space — the same gaps a naive height/page estimate misses.
      const PAGE_PX = 986; // A4 content height: (297 − 20 − 16)mm at 96dpi
      const pageOf: Record<string, number> = await page.evaluate((PX) => {
        const map: Record<string, number> = {};
        let pageNo = 1; // cover is page 1
        let y = 0;
        const advance = () => { pageNo += 1; y = 0; };
        const num = (v: string) => parseFloat(v) || 0;
        const mark = (el: Element) => {
          const ds = (el as HTMLElement).dataset;
          if (ds.section) map[ds.section] = pageNo;
          if (ds.subsection) map[ds.subsection] = pageNo;
        };
        const FLOW = /^(P|UL|OL|TABLE|H1|H2|H3|H4|H5|IMG|SVG|HR)$/;

        // Place an element's border-box (margins handled by the caller, so adjacent
        // sibling margins collapse correctly instead of being summed).
        const placeBox = (el: Element) => {
          mark(el);
          const cs = getComputedStyle(el);
          const isAvoid = cs.breakInside === "avoid";
          const horizontal = cs.display.indexOf("flex") >= 0 || cs.display.indexOf("grid") >= 0;
          if (isAvoid || horizontal || FLOW.test(el.tagName) || el.children.length === 0) {
            const h = (el as HTMLElement).getBoundingClientRect().height;
            if (isAvoid) {
              if (y > 0 && y + h > PX) advance();
              y += h;
              while (y > PX) advance();
            } else {
              let rem = h;
              while (y + rem > PX) { rem -= PX - y; advance(); }
              y += rem;
            }
            return;
          }
          // vertical block container: add padding/border, recurse with collapsing
          y += num(cs.paddingTop) + num(cs.borderTopWidth);
          placeChildren(Array.from(el.children));
          y += num(cs.paddingBottom) + num(cs.borderBottomWidth);
          if (y > PX) advance();
        };

        // Walk siblings, collapsing the gap between them to max(prevBottom, nextTop).
        function placeChildren(children: Element[]) {
          let carry = 0;
          for (const c of children) {
            const cs = getComputedStyle(c);
            y += Math.max(carry, num(cs.marginTop));
            while (y > PX) advance();
            placeBox(c);
            carry = num(cs.marginBottom);
          }
          y += carry;
          while (y > PX) advance();
        }

        Array.from(document.querySelectorAll("[data-section]")).forEach((sec, i) => {
          if (i > 0) advance(); // break-before:page on every section after the cover
          const id = (sec as HTMLElement).dataset.section as string;
          map[id] = pageNo;
          // the cover and chapter-divider pages are exactly one full page
          if (id === "cover" || id.startsWith("ch-div-")) return;
          placeChildren(Array.from(sec.children));
        });
        return map;
      }, PAGE_PX);
      await page.evaluate((map) => {
        document.querySelectorAll("[data-page-for]").forEach((el) => {
          const id = (el as HTMLElement).dataset.pageFor as string;
          if (map[id] != null) el.textContent = String(map[id]);
        });
      }, pageOf);

      const buf = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "20mm", bottom: "16mm", left: "20mm", right: "14mm" },
      });
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
