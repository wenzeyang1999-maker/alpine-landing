/**
 * Original-filing viewer source. GET ?ticker=ARCC&q=<verbatim quote> returns the FULL real
 * filing HTML (so the analyst can scroll the whole document), with the cited passage
 * highlighted and auto-scrolled into view, and a <base> so images/styles resolve from EDGAR.
 * Served same-origin so the panel can iframe it. Gated.
 */
import { existsSync, readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { join } from "node:path";
import { isGatedRequestOk } from "@/lib/engine/demo/gate";
import { CURATED_FUNDS } from "@/lib/engine/demo/questions";
import { getCuratedCh4 } from "@/lib/engine/demo/fixtures/curated-ch4";

export const runtime = "nodejs";

const escRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const escHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const SEC_UA = "AlpineDD-Research admin@alpinedd.com";

export async function GET(req: Request) {
  if (!(await isGatedRequestOk(req))) return new Response("Unauthorized", { status: 401 });
  const url = new URL(req.url);
  const ticker = (url.searchParams.get("ticker") ?? "").toUpperCase();
  const q = url.searchParams.get("q") ?? "";
  const download = url.searchParams.get("download") === "1";
  const fund = CURATED_FUNDS.find((f) => f.ticker === ticker);
  const fixture = getCuratedCh4(ticker);
  const docUrl = fixture?.provenance.sourceUrl ?? "";
  const baseHref = docUrl ? docUrl.slice(0, docUrl.lastIndexOf("/") + 1) : "";

  // ── Download branch: serve the source filing as an attachment. ──
  if (download) {
    // BYO-url: stream the EDGAR document through (sends UA, sets attachment headers).
    const src = url.searchParams.get("url") ?? docUrl;
    if (src && /^https?:\/\/(www\.|efts\.)?sec\.gov\//i.test(src)) {
      const res = await fetch(src, { headers: { "user-agent": SEC_UA } });
      if (!res.ok) return new Response("Could not fetch filing (" + res.status + ").", { status: 502 });
      const filename = src.split("/").pop() || "filing.htm";
      return new Response(res.body, {
        headers: {
          "Content-Type": res.headers.get("content-type") ?? "text/html; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Cache-Control": "no-store",
        },
      });
    }
    // Curated: serve the cached raw 10-K bytes as an attachment.
    const gzPath = fund ? join(process.cwd(), "lib/engine/.data/stage1/funds", fund.cik, "tenk.htm.gz") : "";
    if (fund && existsSync(gzPath)) {
      const html = gunzipSync(readFileSync(gzPath)).toString("utf8");
      return new Response(html, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Content-Disposition": `attachment; filename="${ticker || "fund"}-10K.htm"`,
          "Cache-Control": "no-store",
        },
      });
    }
    return new Response("Source filing not available for download.", { status: 404 });
  }

  const rawPath = fund ? join(process.cwd(), "lib/engine/.data/stage1/funds", fund.cik, "tenk.htm.gz") : "";
  if (fund && existsSync(rawPath)) {
    let html = gunzipSync(readFileSync(rawPath)).toString("utf8");

    // highlight the first occurrence of the quote (words in order, tolerating tags/whitespace between)
    let found = false;
    if (q) {
      const words = q.trim().split(/\s+/).map(escRe);
      const re = new RegExp(words.join("(?:\\s|&#?[a-z0-9]+;|<[^>]+>)+"), "i");
      const m = re.exec(html);
      if (m && m.index >= 0) {
        html = html.slice(0, m.index) + `<mark id="alpine-cite">` + m[0] + `</mark>` + html.slice(m.index + m[0].length);
        found = true;
      }
    }

    // inject <base> + highlight style into <head>, and the scroll script before </body>
    const head = `${baseHref ? `<base href="${baseHref}">` : ""}<style>#alpine-cite,#alpine-cite *{background:#FBEFA6!important}</style>`;
    const hm = html.match(/<head[^>]*>/i);
    html = hm ? html.replace(hm[0], hm[0] + head) : head + html;
    const script = found
      ? `<script>function _j(){var m=document.getElementById('alpine-cite');if(m){m.scrollIntoView({block:'center'});}}window.addEventListener('load',function(){setTimeout(_j,80);});<\/script>`
      : "";
    html = /<\/body>/i.test(html) ? html.replace(/<\/body>/i, script + "</body>") : html + script;

    return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
  }

  // fallback: no raw filing on disk — show the source sentence from the normalized text
  const normPath = fund ? join(process.cwd(), "lib/engine/.data/stage1/funds", fund.cik, "tenk.norm.txt") : "";
  if (fund && existsSync(normPath) && q) {
    const text = readFileSync(normPath, "utf8");
    const i = text.indexOf(q);
    if (i >= 0) {
      const ctx = text.slice(Math.max(0, i - 300), Math.min(text.length, i + q.length + 300));
      const hl = escHtml(ctx).replace(escHtml(q), `<mark style="background:#FBEFA6">${escHtml(q)}</mark>`);
      return new Response(`<!doctype html><meta charset="utf-8"><body style="font-family:Georgia,serif;padding:18px;color:#1a1a1a;line-height:1.7"><p>&hellip;${hl}&hellip;</p>`, { headers: { "Content-Type": "text/html; charset=utf-8" } });
    }
  }
  return new Response(`<!doctype html><meta charset="utf-8"><body style="font-family:Georgia,serif;padding:18px"><p>${escHtml(q)}</p>`, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
