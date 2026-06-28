// Fetch the real 10-K document URL + filing date for the curated funds, and save the raw
// filing HTML to the corpus so the citation panel can back "Open on EDGAR" with the actual
// document. usage: node scripts/fetch-filing-docs.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";

const UA = "AlpineDD-Research admin@alpinedd.com";
const FUNDS = [
  { ticker: "ARCC", cik: "0001287750" },
  { ticker: "BXSL", cik: "0001736035" },
  { ticker: "OBDC", cik: "0001655888" },
];

const out = {};
for (const f of FUNDS) {
  const sub = await (await fetch(`https://data.sec.gov/submissions/CIK${f.cik}.json`, { headers: { "user-agent": UA } })).json();
  const r = sub.filings.recent;
  let idx = -1;
  for (let i = 0; i < r.form.length; i++) { if (r.form[i] === "10-K") { idx = i; break; } }
  const acc = r.accessionNumber[idx].replace(/-/g, "");
  const doc = r.primaryDocument[idx];
  const docUrl = `https://www.sec.gov/Archives/edgar/data/${Number(f.cik)}/${acc}/${doc}`;
  const filingDate = r.filingDate[idx];
  // index page (human-friendly "Open on EDGAR" landing for the whole filing)
  const indexUrl = `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${f.cik}&type=10-K&dateb=&owner=include&count=10`;

  const raw = await (await fetch(docUrl, { headers: { "user-agent": UA } })).text();
  const dir = join("lib/engine/.data/stage1/funds", f.cik);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "tenk.htm.gz"), gzipSync(Buffer.from(raw, "utf8")));

  out[f.ticker] = { cik: f.cik, docUrl, indexUrl, filingDate, name: sub.name };
  console.error(`[ok] ${f.ticker} ${sub.name} 10-K ${filingDate} -> saved raw htm (${(raw.length/1e6).toFixed(1)}MB) | ${docUrl}`);
}
console.log(JSON.stringify(out, null, 2));
