/**
 * Excerpt PDF (CD2): render the one-page source-excerpt card (passage + highlighted quote
 * + Alpine document chrome) to a PDF the analyst can save or attach. Gated. Uses the same
 * headless Chromium the investor report PDF route uses. This is the citation evidence, not
 * the whole 200-page filing.
 */
import { isGatedRequestOk } from "@/lib/engine/demo/gate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const esc = (s: string) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function highlight(context: string, quote: string): string {
  const c = esc(context), q = esc(quote);
  const i = c.indexOf(q);
  if (i < 0) return c;
  return `${c.slice(0, i)}<mark>${q}</mark>${c.slice(i + q.length)}`;
}

export async function POST(req: Request) {
  if (!(await isGatedRequestOk(req))) return Response.json({ error: "Unauthorized" }, { status: 401 });
  let d: { context: string; quote: string; section: string; sourceLabel: string; sourceUrl: string; filingDate: string; docType: string; name: string };
  try { d = await req.json(); } catch { return Response.json({ error: "Bad request" }, { status: 400 }); }

  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    @page{size:Letter;margin:18mm}
    body{font-family:Georgia,serif;color:#1a1a1a;margin:0}
    .chrome{display:flex;justify-content:space-between;align-items:center;background:#1d2b4d;padding:10px 18px;border-radius:8px 8px 0 0}
    .chrome .k{font-family:Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:1px;color:#cdb98a}
    .chrome .c{font-family:Helvetica,Arial,sans-serif;font-size:9px;letter-spacing:.6px;color:#e0857f;border:1px solid #e0857f;padding:2px 7px;border-radius:4px}
    .card{border:1px solid #E5E7EB;border-top:none;border-radius:0 0 8px 8px;padding:26px 30px}
    h1{font-size:21px;margin:0 0 3px}
    .meta{font-size:11.5px;color:#6B7280;padding-bottom:12px;border-bottom:1px solid #E5E7EB;margin-bottom:14px}
    .sec{font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:.6px;color:#1d2b4d;text-transform:uppercase;margin-bottom:10px}
    p{font-size:13.5px;line-height:1.85;text-align:justify;margin:0 0 14px}
    mark{background:#FBEFA6;color:#1a1a1a;padding:0 2px}
    .ft{display:flex;justify-content:space-between;padding-top:12px;border-top:1px solid #E5E7EB;font-size:10px;color:#9CA3AF;font-family:Helvetica,Arial,sans-serif}
    .src{font-family:Helvetica,Arial,sans-serif;font-size:10px;color:#9CA3AF;margin-top:14px;word-break:break-all}
  </style></head><body>
    <div class="chrome"><span class="k">ALPINE × ${esc(d.name).toUpperCase()}</span><span class="c">CONFIDENTIAL</span></div>
    <div class="card">
      <h1>${esc(d.docType)}</h1>
      <div class="meta">${esc(d.name)}${d.filingDate ? " · Filed " + esc(d.filingDate) : ""}</div>
      ${d.section ? `<div class="sec">${esc(d.section)}</div>` : ""}
      <p>${highlight(d.context, d.quote)}</p>
      <div class="ft"><span>${esc(d.name)}</span><span>Source excerpt · full filing on EDGAR</span></div>
      <div class="src">Source: ${esc(d.sourceUrl)}</div>
    </div>
  </body></html>`;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { chromium }: any = await import("playwright");
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle" });
    const pdf = await page.pdf({ format: "Letter", printBackground: true });
    await browser.close();
    return new Response(new Uint8Array(pdf), {
      headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${d.name.replace(/\W+/g, "_")}_excerpt.pdf"`, "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json({ error: "PDF generation unavailable." }, { status: 500 });
  }
}
