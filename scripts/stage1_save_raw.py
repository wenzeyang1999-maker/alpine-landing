#!/usr/bin/env python3
"""
Backfill: save the RAW 10-K + prospectus filing for every BDC (gzipped, ~10x smaller)
plus full provenance (accession / URL / date / form) in meta.json. The earlier bulk
harness kept only normalized text; this preserves the actual source documents for audit.

  python3 scripts/stage1_save_raw.py        # all funds (resumable)

Resumable: skips a fund whose tenk.htm.gz already exists.
"""
import json, os, gzip, time, subprocess
BASE="lib/engine/.data/stage1"; FUNDS=f"{BASE}/funds"
UA="AlpineDD-Research admin@alpinedd.com"

def curl(url, retries=4):
    for a in range(retries):
        p=subprocess.run(["curl","-s","-A",UA,url],capture_output=True)
        if p.returncode==0 and p.stdout: return p.stdout
        time.sleep(0.8+a)
    return b""

def latest(subs, pred):
    r=subs["filings"]["recent"]
    for i in range(len(r["form"])):
        if pred(r["form"][i]):
            return {"accession":r["accessionNumber"][i],"primaryDoc":r["primaryDocument"][i],
                    "date":r["filingDate"][i],"form":r["form"][i]}
    return None

def doc_url(cik, acc, doc):
    return f"https://www.sec.gov/Archives/edgar/data/{int(cik)}/{acc.replace('-','')}/{doc}"

def save_raw(cikz, d, kind, filing):
    gz=f"{d}/{kind}.htm.gz"
    if os.path.exists(gz) or not filing: return os.path.exists(gz)
    doc=filing["primaryDoc"]
    if not doc or not doc.lower().endswith((".htm",".html")): return False
    raw=curl(doc_url(cikz,filing["accession"],doc)); time.sleep(0.35)
    if not raw: return False
    with gzip.open(gz,"wb") as f: f.write(raw)
    filing["url"]=doc_url(cikz,filing["accession"],doc)
    return True

def main():
    uni=json.load(open(f"{BASE}/bdc-universe.json"))
    funds=[f for f in uni["funds"] if not f.get("likelyNonBDC")]
    done=0; saved_k=0; saved_p=0
    for fnd in funds:
        cikz=str(fnd["cik"]).zfill(10); d=f"{FUNDS}/{cikz}"; os.makedirs(d,exist_ok=True)
        if os.path.exists(f"{d}/tenk.htm.gz") and os.path.exists(f"{d}/meta.json"):
            try:
                if json.load(open(f"{d}/meta.json")).get("tenK",{}).get("url"): done+=1; continue
            except Exception: pass
        subs=None
        try: subs=json.loads(curl(f"https://data.sec.gov/submissions/CIK{cikz}.json")); time.sleep(0.3)
        except Exception: pass
        if not subs:
            print(f"  {fnd['name'][:28]}: no submissions", flush=True); continue
        kf=latest(subs, lambda x:x=="10-K")
        pf=latest(subs, lambda x:x.startswith("424B") or x.startswith("N-2"))
        if save_raw(cikz,d,"tenk",kf): saved_k+=1
        if save_raw(cikz,d,"prospectus",pf): saved_p+=1
        meta={"cik":cikz,"name":fnd["name"],"ticker":fnd.get("ticker"),
              "tenK":kf,"prospectus":pf,"savedAt":"2026-06-24",
              "note":"Raw filings stored gzipped (tenk.htm.gz / prospectus.htm.gz); normalized text in *.norm.txt; provenance URLs above."}
        json.dump(meta,open(f"{d}/meta.json","w"),indent=2)
        done+=1
        if done%10==0: print(f"  {done}/{len(funds)} (raw 10-K saved={saved_k}, prospectus={saved_p})", flush=True)
    print(f"DONE: {done} funds, raw 10-K saved={saved_k}, prospectus saved={saved_p}")

if __name__=="__main__": main()
