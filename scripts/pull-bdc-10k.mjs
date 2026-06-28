// One-off: pull a BDC's latest 10-K from EDGAR, normalize, save to the corpus, print key greps.
// usage: node scripts/pull-bdc-10k.mjs <CIK10>
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const UA = "AlpineDD-Research admin@alpinedd.com";
const cik = process.argv[2];
if (!cik) { console.error("usage: pull-bdc-10k.mjs <CIK10>"); process.exit(1); }

const NAMED = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ldquo: "“", rdquo: "”", lsquo: "‘", rsquo: "’", mdash: "—", ndash: "–", hellip: "…" };
const dec = (s) => s
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => { try { return String.fromCodePoint(parseInt(h, 16)); } catch { return " "; } })
  .replace(/&#(\d+);/g, (_, d) => { try { return String.fromCodePoint(parseInt(d, 10)); } catch { return " "; } })
  .replace(/&([a-z]+);/gi, (m, n) => (NAMED[n.toLowerCase()] ?? m));
const norm = (raw) => dec(raw.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ")).replace(/​/g, "").replace(/ /g, " ").replace(/\s+/g, " ").trim();

const sub = await (await fetch(`https://data.sec.gov/submissions/CIK${cik}.json`, { headers: { "user-agent": UA } })).json();
const r = sub.filings.recent;
let idx = -1;
for (let i = 0; i < r.form.length; i++) { if (r.form[i] === "10-K") { idx = i; break; } }
if (idx < 0) { console.error("no 10-K"); process.exit(1); }
const acc = r.accessionNumber[idx].replace(/-/g, "");
const doc = r.primaryDocument[idx];
const url = `https://www.sec.gov/Archives/edgar/data/${Number(cik)}/${acc}/${doc}`;
console.error(`[pull] ${sub.name} ${r.form[idx]} ${r.filingDate[idx]} -> ${url}`);

const raw = await (await fetch(url, { headers: { "user-agent": UA } })).text();
const text = norm(raw);
const dir = join("lib/engine/.data/stage1/funds", cik);
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "tenk.norm.txt"), text);
console.error(`[saved] ${dir}/tenk.norm.txt (${text.length} bytes), name="${sub.name}"`);

const grep = (label, re) => { const m = text.match(re); console.log(`\n## ${label}\n${m ? m.slice(0, 3).join("\n") : "(none)"}`); };
grep("BDC status", /[^.]{0,30}closed-end[^.]{0,120}business development company/gi);
grep("domicile", /(Delaware statutory trust|Maryland corporation|incorporated in \w+|organized .{0,30}laws of the State of \w+)/gi);
grep("mgmt fee rate", /annual rate of [0-9.]+%[^.]{0,80}/gi);
grep("hurdle", /hurdle rate of [0-9.]+%[^.]{0,40}/gi);
grep("listed", /(traded on|listed on|listed and traded on)[^.]{0,60}(NYSE|New York Stock Exchange|NASDAQ|Nasdaq)[^.]{0,20}/gi);
grep("incentive", /incentive fee[^.]{0,30}([0-9.]+%)/gi);
