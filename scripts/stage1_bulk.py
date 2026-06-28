#!/usr/bin/env python3
"""
Stage-1 extraction eval across the full BDC universe (NO API).

For each BDC in bdc-universe.json: pull its latest 10-K (+ prospectus if available),
extract a FILING-ANSWERABLE question set spanning all 8 chapters, and score every
(fund, question) as ANSWERED / MISS / CORRECT-ABSTAIN using a per-question
presence-signal (signal present but not captured => MISS; signal absent => correct
abstain). Every captured quote is verified verbatim in source (hallucination gate).

Resumable: skips funds whose questions.json already exists. Per-fund filled question
list saved to lib/engine/.data/stage1/funds/<cik>/questions.json for audit.

  python3 scripts/stage1_bulk.py            # full run (resumable)
  python3 scripts/stage1_bulk.py --extract  # re-extract from cached docs only (fast iteration)
  python3 scripts/stage1_bulk.py --limit N  # first N funds
"""
import json, os, re, sys, time, html, subprocess, urllib.parse

UA = "AlpineDD-Research admin@alpinedd.com"
BASE = "lib/engine/.data/stage1"
FUNDS = f"{BASE}/funds"

# ── Filing-answerable question set (real framework-style ids, all 8 chapters) ──
# (id, chapter, label, doc_pref 'k'|'p', presence_signal, [trap-aware capture patterns])
Q = [
 # Ch1 — Manager, Ownership & Governance
 ("01.01.mgmt-model",1,"Internal vs external management","p",
   r"internally managed|externally managed|investment adviser",
   [r"(internally managed)",
    r"(?:externally managed by|managed by|advised by)(?: its| our| the)?(?: investment adviser,?)? ([A-Z][A-Za-z .,&]+?(?:LLC|L\.P\.|LP))",
    r"([A-Z][A-Za-z .,&]+?(?:LLC|L\.P\.|LP)) (?:serves|acts) as (?:our|the|its) investment adviser"]),
 ("01.01.adviser-parent",1,"Adviser parent / sponsor","p",
   r"subsidiary of|affiliate of|division of",
   [r"(?:a |an )?(?:wholly[- ]owned |indirect )?subsidiary of ([A-Z][A-Za-z .,&]+?(?:Inc\.|Corporation|L\.P\.|LP|Group|Management|Partners|Capital|Holdings))",
    r"(?:affiliate|part|division) of ([A-Z][A-Za-z .,&]+?(?:Inc\.|Corporation|L\.P\.|LP|Group|Management|Partners|Capital|Holdings))"]),
 ("01.04.net-assets",1,"Net assets / NAV (firm scale)","k",
   r"net assets",
   [r"net assets of (?:approximately )?(\$[\d,\.]+ (?:million|billion))",
    r"(\$[\d,\.]+ (?:million|billion)) in net assets",
    r"net asset value of (?:approximately )?(\$[\d,\.]+ (?:million|billion))",
    r"[Tt]otal net assets(?: of [A-Za-z .,&']+?)? \$\s*([\d,]{6,})"]),
 ("01.11.fiscal-year",1,"Fiscal year end","k",
   r"fiscal year|year ended",
   [r"(?:fiscal year (?:end(?:ing|ed)?|of)|year ended) (December 31|March 31|June 30|September 30)"]),
 # Ch2 — Legal, Regulatory & Compliance
 ("02.01.bdc-election",2,"BDC election under 1940 Act","p",
   r"business development company",
   [r"((?:elect|regulat|treat)[A-Za-z]+[^.]{0,45}?as (?:a |an )?business development company)"]),
 ("02.01.ria-registration",2,"Adviser RIA registration","p",
   r"Advisers Act",
   [r"(investment adviser registered (?:with the SEC )?under the (?:Investment )?Advisers Act)",
    r"(registered (?:as )?an investment adviser[^.]{0,45}?(?:Investment )?Advisers Act)",
    r"([A-Z][A-Za-z .,&]+?(?:LLC|LP) is registered[^.]{0,40}?(?:Investment )?Advisers Act)"]),
 ("02.05.ric-tax",2,"RIC tax election (Subchapter M)","k",
   r"regulated investment company|Subchapter M|RIC",
   [r"((?:elected|qualify|treated)[^.]{0,40}?regulated investment company)"]),
 # Ch3 — Technology, Cybersecurity & Resilience (mostly DDQ-only -> expect correct abstain)
 ("03.04.cyber",3,"Cybersecurity program detail","k",
   r"maintains? (?:a |an )?(?:comprehensive )?(?:information|cyber).?security program|cybersecurity (?:policies and procedures|risk management program)",
   [r"(maintain[s]? (?:a |an )?(?:comprehensive )?(?:information|cyber).?security program[^.]{0,80})",
    r"(cybersecurity (?:policies and procedures|risk management program)[^.]{0,80})"]),
 # Ch4 — Fund Structure, Terms & Alignment
 ("04.06.legal-form",4,"Legal form / domicile","p",
   r"statutory trust|corporation|incorporated|organized",
   [r"a (Delaware statutory trust)", r"((?:Maryland|Delaware) corporation)"]),
 ("04.18.mgmt-fee",4,"Base management fee rate","p",
   r"management fee",
   [r"(?:base management fee|management fee)(?: is| is calculated at| equal to)?[^.]{0,90}?(?:annual rate of |rate of )?(\d+(?:\.\d+)?%)[^.]{0,45}?(?:total assets|gross assets|net assets)"]),
 ("04.18.incentive-fee",4,"Incentive fee rate","p",
   r"incentive fee",
   [r"(\d+(?:\.\d+)?%) of (?:our )?pre-incentive fee net investment income",
    r"incentive fee[^.]{0,40}?(?:calculated at a |at the )?rate of (\d+(?:\.\d+)?%)"]),
 ("04.18.hurdle",4,"Incentive fee hurdle","p",
   r"hurdle",
   [r"hurdle rate[^.]{0,30}?(\d+(?:\.\d+)?%)", r"(\d+(?:\.\d+)?%)(?: quarterly)?[^.]{0,20}?hurdle"]),
 ("04.09.leverage",4,"Asset coverage / leverage limit","k",
   r"asset coverage",
   [r"asset coverage[^.]{0,40}?(\d{2,3}%)", r"(150%|200%)[^.]{0,20}?asset coverage"]),
 # Ch5 — Service Providers & Oversight
 ("05.02.auditor",5,"Independent auditor","p",
   r"independent registered public accounting firm",
   [r"audited by ([A-Z][A-Za-z .,&']+? LLP), an independent registered public accounting firm",
    r"reports? of ([A-Z][A-Za-z .,&']+? LLP), independent registered public account",
    r"([A-Z][A-Za-z&.\- ]+? LLP)[^.]{0,90}?We have served as (?:the )?(?:Company|Fund|Corporation|Trust)(?:'|’)?s auditor",
    r"\/s\/ ([A-Z][A-Za-z&.\- ]+? LLP)"]),
 ("05.01.administrator",5,"Administrator","p",
   r"administrat",
   [# defined-term resolution: FullName ( ... "Administrator" ... )  — follows the term to its definition
    r"([A-Z][A-Za-z .,&]+?(?:LLC|L\.P\.|LP|Inc\.|Corporation|N\.A\.|National Association|Trust Company|Bank(?: and Trust)?))\s*\([^)]{0,60}?[Aa]dministrator[^)]{0,8}\)",
    r"([A-Z][A-Za-z .,&]+?(?:LLC|LP|L\.P\.|Inc\.|Corporation)) (?:also )?serves as (?:our|the) [Aa]dministrator",
    r"[Aa]dministration [Aa]greement[^.]{0,55}?(?:with|between us and|by and between (?:us|the Company) and) ([A-Z][A-Za-z .,&]+?(?:LLC|LP|Inc\.|National Association|N\.A\.|Trust Company|Bank(?: and Trust)?))",
    r"([A-Z][A-Za-z .,&]+?(?:LLC|LP|L\.P\.|Inc\.)),? (?:provides certain administrative|serves as (?:our|the) administrator|acts as (?:our|the) administrator)",
    r"([A-Z][A-Za-z .,&]+?(?:LLC|LP|L\.P\.|Inc\.|Corporation))[^.]{0,15}?provides[^.]{0,35}?administrative services",
    r"([A-Z][A-Za-z .,&]+?(?:LLC|LP|Inc\.)),? (?:our|the) administrator(?:[, ]|\.)"]),
 ("05.03.custodian",5,"Custodian","k",
   r"custod",
   [# defined-term resolution: FullName ( ... "Custodian" ... )
    r"([A-Z][A-Za-z .,&]+?(?:N\.A\.|National Association|Trust Company|Bank(?: and Trust)?))\s*\([^)]{0,45}?[Cc]ustodian[^)]{0,8}\)",
    r"([A-Z][A-Za-z .,&]+?(?:N\.A\.|National Association|Trust Company|Bank(?: and Trust)?)) (?:serves as|acts as|act as)[^.]{0,30}?custodian",
    r"custod(?:y agreement|ian)[^.]{0,70}?(?:with|by|is|:)\s+([A-Z][A-Za-z .,&]+?(?:N\.A\.|National Association|Bank(?: and Trust)?|Trust Company))",
    r"((?:U\.S\. Bank|State Street|JPMorgan|JP Morgan|The Bank of New York Mellon|Wells Fargo|Citibank|Computershare)[A-Za-z .,&]*?)[^.]{0,40}?custodian"]),
 # Ch6 — Investment Operations & Controls
 ("06.02.strategy",6,"Investment strategy","p",
   r"first lien|senior secured|direct lending|mezzanine|second lien",
   [r"(?:primarily |invest primarily in )([A-Za-z ,]*?(?:first lien|senior secured|direct lending|mezzanine)[A-Za-z ,]*?(?:loans|debt|investments))"]),
 ("06.02.num-portfolio-cos",6,"Number of portfolio companies","k",
   r"portfolio companies",
   [r"(?:investments in |portfolio (?:of|comprised of) )(\d{2,4}) portfolio companies",
    r"(\d{2,4}) portfolio companies"]),
 # Ch7 — Valuation & Investor Reporting
 ("07.01.valuation-board",7,"Valuation governance (board/2a-5)","k",
   r"fair value|valuation designee|Rule 2a-5",
   [r"(board of (?:trustees|directors))[^.]{0,60}?(?:designated|valuation designee|determines)[^.]{0,120}?fair value",
    r"(Rule 2a-5)", r"(valuation designee)", r"(fair value)[^.]{0,60}?(?:determined in good faith|in good faith by)"]),
 ("07.04.level3",7,"Level 3 fair-value exposure","k",
   r"Level 3",
   [r"(Level 3)[^.]{0,80}?(?:fair value|inputs|investments)"]),
 ("07.12.nav-per-share",7,"NAV per share","k",
   r"net asset value per share",
   [r"net asset value per share (?:of |was |equal to )?(\$\s?[\d,\.]+)",
    r"(?:NAV|net asset value) per share[^.]{0,40}?(\$\s?[\d]+\.[\d]{2})"]),
 # Ch8 — Manager Transparency & LP Communications (mostly DDQ-only -> expect correct abstain)
 ("08.04.distribution-policy",8,"Distribution / dividend frequency","k",
   r"distribution|dividend",
   [r"distributions? (?:on a |)(monthly|quarterly|semi-annual|annual) basis",
    r"distributions? (?:are |is )?(?:declared and )?paid (monthly|quarterly|semi-annually|annually)",
    r"(?:declare|pay|make)[^.]{0,30}?(monthly|quarterly|semi-annual) distributions",
    r"(?:intend to|currently)[^.]{0,30}?(monthly|quarterly)[^.]{0,15}?distributions"]),
]

def curl(url, retries=4):
    for a in range(retries):
        p=subprocess.run(["curl","-s","-A",UA,url],capture_output=True)
        if p.returncode==0 and p.stdout: return p.stdout
        time.sleep(0.8+a)
    return b""

def get_json(url):
    try: return json.loads(curl(url))
    except Exception: return None

def normalize(b):
    t=b.decode("utf-8","ignore")
    t=re.sub(r"<script.*?</script>"," ",t,flags=re.I|re.S)
    t=re.sub(r"<style.*?</style>"," ",t,flags=re.I|re.S)
    t=re.sub(r"<[^>]+>"," ",t)
    t=html.unescape(t).replace("​","").replace("\xa0"," ")
    return re.sub(r"\s+"," ",t).strip()

def latest(subs, pred):
    r=subs["filings"]["recent"]
    for i in range(len(r["form"])):
        if pred(r["form"][i]):
            return r["accessionNumber"][i], r["primaryDocument"][i], r["filingDate"][i], r["form"][i]
    return None

def doc_url(cik, acc, doc):
    return f"https://www.sec.gov/Archives/edgar/data/{int(cik)}/{acc.replace('-','')}/{doc}"

def fetch_doc(cik, d, kind):
    npath=f"{d}/{kind}.norm.txt"
    if os.path.exists(npath): return open(npath, errors="ignore").read()
    return None

def ensure_doc(cik, subs, d, kind, pred):
    npath=f"{d}/{kind}.norm.txt"
    if os.path.exists(npath): return open(npath, errors="ignore").read()
    f=latest(subs, pred)
    if not f: return ""
    acc,doc,date,form=f
    if not doc or not doc.lower().endswith((".htm",".html")): return ""
    raw=curl(doc_url(cik,acc,doc)); time.sleep(0.35)
    if not raw: return ""
    t=normalize(raw); open(npath,"w").write(t)
    return t

def win(t,m,w=240):
    s=max(0,m.start()-40); e=min(len(t),m.end()+w)
    return re.sub(r"\s+"," ",t[s:e]).strip()

def classify(q, pros, tenk):
    qid,ch,label,pref,signal,pats=q
    docs={"p":(pros,"prospectus"),"k":(tenk,"10-K")}
    order=[pref,"k" if pref=="p" else "p"]
    for dk in order:
        txt,dname=docs[dk]
        if not txt: continue
        for p in pats:
            m=re.search(p,txt,re.I)
            if m:
                val=m.group(1) if m.lastindex else m.group(0)
                quote=win(txt,m)
                ok=quote in txt
                return {"questionId":qid,"chapterNum":ch,"label":label,"status":"answered",
                        "value":val.strip(),"sourceDoc":dname,"quote":quote,"gate":ok}
    # not captured: signal present anywhere -> MISS, else CORRECT-ABSTAIN
    sig=False
    for txt,_ in docs.values():
        if txt and re.search(signal,txt,re.I): sig=True; break
    return {"questionId":qid,"chapterNum":ch,"label":label,
            "status":"miss" if sig else "abstain_correct","value":None,"sourceDoc":None,"quote":None,"gate":True}

def process(fund, extract_only):
    cik=str(fund["cik"]).lstrip("0") or fund["cik"]
    cikz=str(fund["cik"]).zfill(10)
    d=f"{FUNDS}/{cikz}"; os.makedirs(d,exist_ok=True)
    qpath=f"{d}/questions.json"
    if os.path.exists(qpath) and not extract_only:
        return json.load(open(qpath))  # resume
    subs=None
    if not extract_only:
        subs=get_json(f"https://data.sec.gov/submissions/CIK{cikz}.json"); time.sleep(0.3)
    if extract_only:
        pros=fetch_doc(cikz,d,"prospectus") or ""; tenk=fetch_doc(cikz,d,"tenk") or ""
    else:
        if not subs: return None
        tenk=ensure_doc(cikz,subs,d,"tenk",lambda f:f=="10-K") or ""
        pros=ensure_doc(cikz,subs,d,"prospectus",lambda f:f.startswith("424B") or f.startswith("N-2")) or ""
    if not tenk and not pros: return None
    rows=[classify(q,pros,tenk) for q in Q]
    # Fairness rule: internally-managed BDCs have no external advisory fee and are
    # self-administered, so a non-capture on those fields is correct-N/A, not a miss.
    mm=next((r for r in rows if r["questionId"]=="01.01.mgmt-model"),None)
    internal = bool(mm and mm["status"]=="answered" and mm["value"] and "internally managed" in str(mm["value"]).lower())
    if internal:
        for r in rows:
            if r["questionId"] in ("04.18.mgmt-fee","04.18.incentive-fee","04.18.hurdle","05.01.administrator") and r["status"]=="miss":
                r["status"]="abstain_correct"; r["note"]="N/A — internally managed (no external fee / self-administered)"
    res={"cik":cikz,"name":fund["name"],"ticker":fund.get("ticker"),
         "hasTenK":bool(tenk),"hasProspectus":bool(pros),
         "answered":sum(1 for r in rows if r["status"]=="answered"),
         "miss":sum(1 for r in rows if r["status"]=="miss"),
         "abstainCorrect":sum(1 for r in rows if r["status"]=="abstain_correct"),
         "hallucinations":sum(1 for r in rows if r["status"]=="answered" and not r["gate"]),
         "questions":rows}
    json.dump(res,open(qpath,"w"),indent=2)
    json.dump({"cik":cikz,"name":fund["name"],"ticker":fund.get("ticker")},open(f"{d}/meta.json","w"),indent=2)
    return res

def main():
    extract_only="--extract" in sys.argv
    limit=None
    if "--limit" in sys.argv: limit=int(sys.argv[sys.argv.index("--limit")+1])
    uni=json.load(open(f"{BASE}/bdc-universe.json"))
    funds=[f for f in uni["funds"] if not f.get("likelyNonBDC")]
    if limit: funds=funds[:limit]
    os.makedirs(FUNDS,exist_ok=True)
    agg=[]; done=0
    for f in funds:
        try:
            r=process(f,extract_only)
            if r: agg.append(r); done+=1
            if done%10==0: print(f"  {done}/{len(funds)} processed…", flush=True)
        except Exception as e:
            print(f"  ERR {f.get('name','?')[:30]}: {e}", flush=True)
    n=len(agg); cells=len(Q)
    A=sum(x["answered"] for x in agg); M=sum(x["miss"] for x in agg)
    C=sum(x["abstainCorrect"] for x in agg); H=sum(x["hallucinations"] for x in agg)
    tot=n*cells
    summary={"funds":n,"questionsPerFund":cells,"totalCells":tot,
             "answered":A,"miss":M,"abstainCorrect":C,"hallucinations":H,
             "answeredPct":round(A/tot*100,1) if tot else 0,
             "missPct":round(M/tot*100,1) if tot else 0,
             "recallOfAnswerable":round(A/(A+M)*100,1) if (A+M) else 0}
    json.dump({"summary":summary,"perFund":[{k:x[k] for k in ("cik","name","ticker","answered","miss","abstainCorrect","hallucinations")} for x in agg]},
              open(f"{FUNDS}/_aggregate.json","w"),indent=2)
    print("\n=== AGGREGATE ===")
    for k,v in summary.items(): print(f"  {k}: {v}")
    # per-question rollup
    from collections import Counter
    perq={q[0]:Counter() for q in Q}
    for x in agg:
        for r in x["questions"]: perq[r["questionId"]][r["status"]]+=1
    print("\n=== PER-QUESTION (answered / miss / correct-abstain) ===")
    for q in Q:
        c=perq[q[0]]; print(f"  {q[0]:22} ch{q[1]}  A={c['answered']:>3} M={c['miss']:>3} N/A={c['abstain_correct']:>3}  {q[2]}")

if __name__=="__main__": main()
