#!/usr/bin/env python3
"""
Stage-1 extraction harness (NO API) — pull each BDC's prospectus + 10-K from EDGAR,
apply trap-aware capture regexes across both, emit grounded answers (or abstain),
and quote-gate everything. Deterministic baseline for the Stage-1 extractor.

  python3 scripts/stage1_pull_extract.py

Output under lib/engine/.data/stage1/<slug>/ (gitignored).
"""
import json, os, re, time, html, urllib.request

UA = "AlpineDD-Research admin@alpinedd.com"
BASE = "lib/engine/.data/stage1"
TICKERS = ["ARCC","MAIN","BXSL","OBDC","FSK","GBDC","TSLX","HTGC","CSWC","BCSF","OCSL","NMFC","CGBD"]

def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()

def norm(b):
    t = b.decode("utf-8", "ignore")
    t = re.sub(r"<script.*?</script>", " ", t, flags=re.I|re.S)
    t = re.sub(r"<style.*?</style>", " ", t, flags=re.I|re.S)
    t = re.sub(r"<[^>]+>", " ", t)
    t = html.unescape(t).replace("​","").replace("\xa0"," ")
    return re.sub(r"\s+", " ", t).strip()

def tickmap():
    d = json.loads(get("https://www.sec.gov/files/company_tickers.json"))
    return {v["ticker"]: (str(v["cik_str"]).zfill(10), v["title"]) for v in d.values()}

def latest(filings, pred):
    r = filings["filings"]["recent"]
    for i in range(len(r["form"])):
        if pred(r["form"][i]):
            return r["form"][i], r["accessionNumber"][i], r["primaryDocument"][i], r["filingDate"][i]
    return None

def doc_url(cik, acc, doc):
    return f"https://www.sec.gov/Archives/edgar/data/{int(cik)}/{acc.replace('-','')}/{doc}"

def ensure(slug, kind, url):
    """Download+normalize a doc unless already present. Returns norm text."""
    d = f"{BASE}/{slug}/source"
    os.makedirs(d, exist_ok=True)
    npath = f"{d}/{kind}.norm.txt"
    if os.path.exists(npath):
        return open(npath).read()
    raw = get(url); time.sleep(0.4)
    open(f"{d}/{kind}.htm","wb").write(raw)
    t = norm(raw); open(npath,"w").write(t)
    return t

# field -> (chapter, doc-preference, [trap-aware capture patterns])
FIELDS = [
 ("01-mgmt-structure", 1, "p", [
    r"(internally managed),? closed-end",
    r"externally managed by(?: our investment adviser,?)? ([A-Z][A-Za-z .,&]+?(?:LLC|L\.P\.|LP))",
    r"investment activities are managed by ([A-Z][A-Za-z .,&]+?(?:LLC|LP))",
    r"([A-Z][A-Za-z .,&]+?(?:LLC|L\.P\.|LP)) (?:serves|acts) as (?:our|the) investment adviser",
 ]),
 ("04-legal-structure", 4, "p", [
    r"a (Delaware statutory trust) formed",
    r"((?:Maryland|Delaware) corporation)",
 ]),
 ("04-mgmt-fee", 4, "p", [
    r"(?:base management fee|management fee)(?: is| is calculated at)?[^.]{0,80}?(?:annual rate of |rate of )?(\d+(?:\.\d+)?%)[^.]{0,40}?(?:total assets|gross assets)",
 ]),
 ("04-incentive-fee", 4, "p", [
    r"(\d+(?:\.\d+)?%) of (?:our )?pre-incentive fee net investment income",
    r"incentive fee calculated at a rate of (\d+(?:\.\d+)?%)",
 ]),
 ("05-auditor", 5, "p", [
    r"audited by ([A-Z][A-Za-z .,&']+? LLP), an independent registered public accounting firm",
    r"reports? of ([A-Z][A-Za-z .,&']+? LLP), independent registered public account",
 ]),
 ("05-administrator", 5, "p", [
    r"([A-Z][A-Za-z .,&]+?(?:LLC|LP|L\.P\.|Inc\.)),? (?:provides certain administrative|serves as (?:our|the) administrator|acts as (?:our|the) administrator)",
    r"(?:administration|administrative services) agreement[^.]{0,60}?(?:with|by|between us and) ([A-Z][A-Za-z .,&]+?(?:LLC|LP|Inc\.))",
    r"([A-Z][A-Za-z .,&]+?(?:LLC|LP|Inc\.)),? (?:our|the) administrator",
 ]),
 ("05-custodian", 5, "k", [
    r"([A-Z][A-Za-z .,&]+?(?:N\.A\.|National Association|Trust Company|Bank(?: and Trust)?)) (?:serves as|acts as|act as)[^.]{0,30}?custodian",
    r"custod(?:y agreement|ian)[^.]{0,70}?(?:with|by|is|:)\s+([A-Z][A-Za-z .,&]+?(?:N\.A\.|National Association|Bank(?: and Trust)?|Trust Company))",
    r"((?:U\.S\. Bank|State Street|JPMorgan|JP Morgan|The Bank of New York Mellon|Wells Fargo|Customers Bank|Citibank|Computershare)[A-Za-z .,&]*?(?:N\.A\.|National Association|Trust Company|Bank)?)[^.]{0,40}?custodian",
 ]),
 ("07-valuation", 7, "k", [
    r"(board of (?:trustees|directors))[^.]{0,60}?(?:designated|valuation designee|determines)[^.]{0,120}?fair value",
    r"(Rule 2a-5)[^.]{0,140}",
    r"(valuation designee)[^.]{0,160}",
    r"(fair value)[^.]{0,60}?(?:determined in good faith|in good faith by)[^.]{0,120}",
 ]),
]

def window(t, m, w=240):
    s=max(0,m.start()-40); e=min(len(t), m.end()+w)
    return re.sub(r"\s+"," ", t[s:e]).strip()

def extract(slug, firm, pros, tenk):
    docs = {"p": (pros, "prospectus"), "k": (tenk, "10-K")}
    answers=[]; gate=[]
    for qid, ch, pref, pats in FIELDS:
        order = [pref, "k" if pref=="p" else "p"]  # try preferred doc, then the other
        hit=None
        for dk in order:
            txt, dname = docs[dk]
            if not txt: continue
            for p in pats:
                m = re.search(p, txt, re.I)
                if m:
                    val = m.group(1) if m.lastindex else m.group(0)
                    hit = (val.strip(), window(txt, m), dname)
                    break
            if hit: break
        if hit:
            val, quote, dname = hit
            ok = quote in (pros if dname=="prospectus" else tenk)
            gate.append((qid, ok))
            answers.append({"questionId":qid,"chapterNum":ch,"value":val,"origin":"engine_extracted",
                "grounding":{"sources":[{"id":f"src_{slug}_{qid}","kind":"manager_upload",
                   "docName":f"{firm['name']} {dname}","quote":quote}],
                   "confidence":"high","abstained":False,"verifier":"verified" if ok else "unsupported"}})
        else:
            answers.append({"questionId":qid,"chapterNum":ch,"value":None,"origin":"engine_extracted",
                "grounding":{"sources":[],"confidence":"low","abstained":True,"verifier":"unchecked"},
                "gap":{"severity":"recommended","reason":"Not located in prospectus or 10-K by the deterministic extractor.","routedTo":"analyst"}})
    out={"runId":f"run_{slug}_stage1","firm":firm,"frameworkVersion":"v3.2026.06","sku":"full",
         "answers":answers,"completeness":round(sum(1 for a in answers if not a["grounding"]["abstained"])/len(answers),2),
         "generatedAt":"2026-06-24","engineVersion":"deterministic-harness"}
    os.makedirs(f"{BASE}/{slug}/output", exist_ok=True)
    json.dump(out, open(f"{BASE}/{slug}/output/extraction.json","w"), indent=2)
    gr=sum(1 for a in answers if not a["grounding"]["abstained"])
    allok=all(ok for _,ok in gate)
    return gr, len(answers), out["completeness"], allok

def main():
    tm = tickmap(); time.sleep(0.3)
    rows=[]
    for tk in TICKERS:
        if tk not in tm:
            print(f"{tk}: not in ticker map, skipping"); continue
        cik, name = tm[tk]; slug = tk.lower()
        try:
            subs = json.loads(get(f"https://data.sec.gov/submissions/CIK{cik}.json")); time.sleep(0.35)
            pf = latest(subs, lambda f: f.startswith("424B") or f.startswith("N-2"))
            kf = latest(subs, lambda f: f=="10-K")
            pros = ensure(slug, "prospectus", doc_url(cik, pf[1], pf[2])) if pf else ""
            tenk = ensure(slug, "tenk", doc_url(cik, kf[1], kf[2])) if kf else ""
            firm={"id":slug,"name":name,"strategy":"BDC","ticker":tk,"cik":cik}
            json.dump({"slug":slug,"ticker":tk,"name":name,"cik":cik,
                       "prospectus":{"form":pf[0],"acc":pf[1],"date":pf[3]} if pf else None,
                       "tenK":{"form":kf[0],"acc":kf[1],"date":kf[3]} if kf else None,
                       "fetchedAt":"2026-06-24"}, open(f"{BASE}/{slug}/meta.json","w"), indent=2)
            gr,n,comp,allok = extract(slug, firm, pros, tenk)
            rows.append((tk, gr, n, comp, allok, bool(tenk)))
            print(f"{tk:6} grounded={gr}/{n} completeness={comp} gate_ok={allok} tenk={'Y' if tenk else 'N'}")
        except Exception as e:
            print(f"{tk:6} ERROR: {e}")
    print("\n=== ROLLUP ===")
    print(f"{'BDC':6} {'grounded':9} {'compl':6} {'gate':5} {'10-K':4}")
    for tk,gr,n,comp,allok,tk10 in rows:
        print(f"{tk:6} {str(gr)+'/'+str(n):9} {comp:<6} {'PASS' if allok else 'FAIL':5} {'Y' if tk10 else 'N'}")

if __name__=="__main__":
    main()
