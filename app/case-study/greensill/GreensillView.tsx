"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { GREEN, AMBER, VIOLET } from "@/lib/constants";
import FloatingSubscribe from "@/components/FloatingSubscribe";

// ── Design tokens (PDF palette — petrol-teal accent on deep teal-navy) ───────
const BODY    = "#17323b";
const MUTED   = "#4a5568";
const GOLD    = "#1f6e78";
const BORDER  = "#ddd8cf";
const RISK    = "#1f6e78";
const RISK_BG = "#edf4f5";
const DANGER  = "#b5361c";   // reserved for the "future receivable / illiquid" side of comparisons

// ── Shared building blocks ───────────────────────────────────────────────────
function Page({ children, minH = 900 }: { children: React.ReactNode; minH?: number }) {
  return (
    <div data-pdf-page style={{ background: "#fff", maxWidth: 900, margin: "0 auto", minHeight: minH, boxShadow: "0 2px 20px rgba(0,0,0,0.10)", borderRadius: 4, overflow: "hidden", position: "relative" }}>
      {children}
    </div>
  );
}

function Gap() {
  return <div data-pdf-gap style={{ height: 28 }} />;
}

function PageFooter({ page }: { page: number }) {
  return (
    <div data-wp-page-footer style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${BORDER}` }}>
      <span style={{ fontSize: 9, fontWeight: 700, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase" }}>Alpine Due Diligence · The Credit Suisse Greensill Case</span>
      <span style={{ fontSize: 9, fontWeight: 600, color: MUTED }}>{String(page).padStart(2, "0")}</span>
    </div>
  );
}

function SectionHead({ title }: { title: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <div style={{ width: 3, height: 20, background: GOLD, borderRadius: 2, flexShrink: 0 }} />
        <h2 style={{ fontSize: 22, fontWeight: 700, color: BODY, lineHeight: 1.25, letterSpacing: "-0.02em", margin: 0 }}>{title}</h2>
      </div>
    </div>
  );
}

function Para({ children, mt = 16 }: { children: React.ReactNode; mt?: number }) {
  return <p style={{ fontSize: 14.5, color: MUTED, lineHeight: 1.78, marginTop: mt, marginBottom: 0 }}>{children}</p>;
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ margin: "24px 0", padding: "16px 20px", background: RISK_BG, borderLeft: `3px solid ${RISK}`, borderRadius: "0 6px 6px 0" }}>
      <p style={{ fontSize: 13.5, color: RISK, lineHeight: 1.65, margin: 0, fontStyle: "italic" }}>{children}</p>
    </div>
  );
}

function KeyStat({ value, label, kicker }: { value: string; label: string; kicker: string }) {
  return (
    <div style={{ textAlign: "center", padding: "18px 12px" }}>
      <div style={{ fontSize: 28, fontWeight: 800, color: RISK, letterSpacing: "-0.03em", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: MUTED, marginTop: 8, lineHeight: 1.4 }}>{label}</div>
      <div style={{ fontSize: 9, fontWeight: 700, color: BODY, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 8 }}>{kicker}</div>
    </div>
  );
}

function EyebrowRow({ label, title }: { label: string; title: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: GOLD, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: BODY, margin: 0, letterSpacing: "-0.01em" }}>{title}</h3>
    </div>
  );
}

function TimelineRow({ date, head, body, last }: { date: string; head: string; body: string; last?: boolean }) {
  return (
    <div style={{ display: "flex", gap: 16, paddingBottom: last ? 0 : 18 }}>
      <div style={{ flexShrink: 0, width: 120 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: BODY, letterSpacing: "-0.01em" }}>{date}</div>
      </div>
      <div style={{ position: "relative", paddingLeft: 18, borderLeft: `2px solid ${BORDER}` }}>
        <span style={{ position: "absolute", left: -6, top: 4, width: 9, height: 9, borderRadius: "50%", background: GOLD }} />
        <div style={{ fontSize: 13.5, fontWeight: 700, color: BODY, marginBottom: 4 }}>{head}</div>
        <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>{body}</div>
      </div>
    </div>
  );
}

function Finding({ head, children }: { head: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 12, padding: "14px 16px", background: "#fafafa", border: `1px solid ${BORDER}`, borderRadius: 6 }}>
      <span style={{ color: RISK, fontSize: 13, flexShrink: 0, lineHeight: 1.5 }}>▲</span>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: BODY, marginBottom: 3 }}>{head}</div>
        <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>{children}</div>
      </div>
    </div>
  );
}

function Question({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div style={{ display: "flex", gap: 14, marginTop: 16 }}>
      <div style={{ flexShrink: 0, width: 28, height: 28, borderRadius: "50%", background: BODY, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>{n}</div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: BODY, marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 13.5, color: MUTED, lineHeight: 1.7 }}>{body}</div>
      </div>
    </div>
  );
}

function SourceNote({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 10.5, color: MUTED, fontStyle: "italic", lineHeight: 1.5, marginTop: 18, marginBottom: 0 }}>{children}</p>;
}

// Dependency-chain box
function ChainBox({ head, body, accent }: { head: string; body: string; accent?: boolean }) {
  return (
    <div style={{ flex: 1, minWidth: 120, padding: "12px 12px", background: accent ? RISK_BG : "#fafafa", border: `1px solid ${accent ? RISK : BORDER}`, borderRadius: 6, textAlign: "center" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: BODY, marginBottom: 4 }}>{head}</div>
      <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.45 }}>{body}</div>
    </div>
  );
}

// Two-column comparison row
function CompareRow({ left, right, header }: { left: string; right: string; header?: boolean }) {
  const base: React.CSSProperties = { padding: "10px 14px", fontSize: header ? 11 : 12.5, lineHeight: 1.5 };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: `1px solid ${BORDER}` }}>
      <div style={{ ...base, fontWeight: header ? 700 : 500, color: header ? BODY : MUTED, borderRight: `1px solid ${BORDER}`, textTransform: header ? "uppercase" : "none", letterSpacing: header ? "0.08em" : "normal" }}>{left}</div>
      <div style={{ ...base, fontWeight: header ? 700 : 500, color: header ? DANGER : MUTED, textTransform: header ? "uppercase" : "none", letterSpacing: header ? "0.08em" : "normal" }}>{right}</div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function GreensillView() {
  const router = useRouter();
  const [zoom, setZoom] = useState(1);
  const changeZoom = (delta: number) => setZoom((z) => Math.min(2, Math.max(0.5, Math.round((z + delta) * 10) / 10)));

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      setZoom((z) => Math.min(2, Math.max(0.5, Math.round((z - e.deltaY * 0.01) * 100) / 100)));
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#ebebeb" }}>
      <style suppressHydrationWarning>{`
        @media (max-width: 768px) {
          [data-cs-zoom]         { display: none !important; }
          [data-cs-book]         { display: none !important; }
          [data-cs-back-label]   { display: none !important; }
          [data-cs-back-btn]     { padding: 6px 8px !important; }
          [data-cs-download-btn] { padding: 6px 12px !important; font-size: 12px !important; }
          [data-cs-header-inner] { padding: 0 12px !important; height: 56px !important; }
          [data-cs-scroll]       { padding: 16px 0 !important; }
          [data-cs-root]         { padding: 0 !important; }
          [data-pdf-page]        { min-height: auto !important; box-shadow: none !important; border-radius: 0 !important; }
          [data-pdf-gap]         { display: none !important; }
          [data-wp-page-footer]  { display: none !important; }
          [data-cs-statband]     { grid-template-columns: repeat(2, 1fr) !important; }
          [data-cs-chain]        { flex-direction: column !important; }
        }
        @media print {
          header, .floating-subscribe-root { display: none !important; }
          [data-pdf-gap] { display: none !important; }
          [data-pdf-page] { page-break-after: always; break-after: page; box-shadow: none !important; }
        }
      `}</style>

      {/* ── Header ── */}
      <header>
        <div style={{ height: 2, background: `linear-gradient(90deg, ${GREEN}, ${AMBER}, ${VIOLET})` }} />
        <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
          <div data-cs-header-inner style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", gap: 16 }}>
            <button data-cs-back-btn type="button" onClick={() => router.back()}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", fontSize: 13, fontWeight: 500, color: "#374151", cursor: "pointer", flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
              <span data-cs-back-label>Back</span>
            </button>
            <Link href="/" aria-label="Alpine home" style={{ display: "inline-flex", alignItems: "center", flexShrink: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/alpine-logo-dark.svg?v=5" alt="Alpine Due Diligence" style={{ height: 36, width: "auto" }} />
            </Link>
            <div style={{ flex: 1 }} />
            <a data-cs-book href="https://calendly.com/alpinedd" target="_blank" rel="noopener noreferrer"
              style={{ padding: "7px 16px", borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", fontSize: 13, fontWeight: 500, color: "#374151", cursor: "pointer", textDecoration: "none", flexShrink: 0 }}>
              Book a Meeting
            </a>
            <a data-cs-download-btn href="/credit-suisse-greensill.pdf" target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 6, background: "#0f0f10", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none", flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              Download PDF
            </a>
            <div data-cs-zoom style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff" }}>
              <button type="button" onClick={() => changeZoom(-0.1)} style={{ width: 24, height: 24, border: "none", background: "none", cursor: "pointer", fontSize: 16, color: "#374151", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
              <span style={{ fontSize: 12, fontWeight: 500, color: "#374151", minWidth: 36, textAlign: "center" }}>{Math.round(zoom * 100)}%</span>
              <button type="button" onClick={() => changeZoom(0.1)} style={{ width: 24, height: 24, border: "none", background: "none", cursor: "pointer", fontSize: 16, color: "#374151", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Scrollable content ── */}
      <div data-cs-scroll style={{ flex: 1, overflowY: "auto", padding: "32px 16px 64px" }}>
        <div data-cs-root style={{ transformOrigin: "top center", transform: `scale(${zoom})`, transition: "transform 0.15s ease" }}>

          {/* ── Page 1 — Cover ── */}
          <Page minH={900}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 48px", borderBottom: `1px solid ${BORDER}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: BODY, letterSpacing: "0.12em", textTransform: "uppercase" }}>Alpine Due Diligence</span>
                <div style={{ width: 1, height: 16, background: BORDER }} />
                <span style={{ fontSize: 10, fontWeight: 500, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" }}>Learning Center · Case Study</span>
              </div>
              <span style={{ fontSize: 10, fontWeight: 500, color: MUTED, letterSpacing: "0.08em" }}>2026 Jul 16 · 9 AM</span>
            </div>

            <div style={{ padding: "56px 48px 48px", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 36, padding: "5px 14px", border: `1px solid ${RISK}80`, borderRadius: 3, alignSelf: "flex-start" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: RISK, display: "inline-block" }} />
                <span style={{ fontSize: 9, fontWeight: 700, color: RISK, letterSpacing: "0.18em", textTransform: "uppercase" }}>ODD Case Study</span>
              </div>

              <h1 style={{ fontSize: 46, fontWeight: 800, color: BODY, lineHeight: 1.07, letterSpacing: "-0.03em", margin: "0 0 8px" }}>
                The Credit Suisse Greensill Case
              </h1>
              <h2 style={{ fontSize: 27, fontWeight: 600, color: BODY, lineHeight: 1.2, letterSpacing: "-0.02em", margin: "0 0 32px" }}>
                When the Story Was More Confident Than the Records
              </h2>

              <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.7, maxWidth: 580, marginBottom: 40 }}>
                A supply-chain-finance fund can look like disciplined trade credit at the portfolio level and still be unverifiable at the claim level. This is a study in what happens when a manager cannot independently prove what a fund actually owns.
              </p>

              <div data-cs-statband style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: BORDER, border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", marginBottom: 40 }}>
                <div style={{ background: "#fff" }}><KeyStat value="$10B" kicker="Investor exposure" label="Approximate client investment when the four funds entered liquidation, per FINMA." /></div>
                <div style={{ background: "#fff" }}><KeyStat value="4" kicker="Fund structures" label="Supply-chain-finance funds launched with Greensill, plus four related funds frozen in the same unit." /></div>
                <div style={{ background: "#fff" }}><KeyStat value="2017" kicker="Origin" label="Year Credit Suisse launched the first fund with Greensill, per FINMA findings." /></div>
                <div style={{ background: "#fff" }}><KeyStat value="Mar '21" kicker="Liquidation" label="Dealing suspended, then the four funds terminated and placed into liquidation." /></div>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["Asset Verification", "Originator Risk", "Insurance Diligence", "Fund Governance"].map((t) => (
                  <span key={t} style={{ fontSize: 9, fontWeight: 700, color: BODY, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 10px", border: `1px solid ${BORDER}`, borderRadius: 3, background: "#fafafa" }}>{t}</span>
                ))}
              </div>
            </div>

            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 48px", borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase" }}>Alpine Due Diligence · The Credit Suisse Greensill Case</span>
              <span style={{ fontSize: 9, color: MUTED }}>01</span>
            </div>
          </Page>
          <Gap />

          {/* ── Page 2 — What changed + the story ── */}
          <Page>
            <div style={{ padding: "48px 48px 80px" }}>
              <Para mt={0}>
                In March 2021, the boards of four Credit Suisse supply-chain-finance funds first suspended subscriptions and redemptions, then terminated the funds and placed them into liquidation. For investors who had accepted the products as controlled exposure to short-dated receivables, the event changed the central question. Yield became secondary. Investors needed to know what the funds legally owned, which debtors owed each amount, whether the claims were enforceable, which assets were insured, and when recoveries could be distributed.
              </Para>
              <Para>
                The scale made those questions material. FINMA reported that clients had invested about USD 10 billion and that the client documentation presented the funds as low-risk. Yet Credit Suisse had limited knowledge and control over the specific claims. Greensill selected and reviewed the assets, securitised them, and arranged the insurance in its own name.
              </Para>
              <Callout>
                The due-diligence failure was specific: Credit Suisse could not independently establish asset existence, eligibility, enforceability, debtor concentration, maturity, or insurance coverage at the claim level. Some positions represented future receivables for which no invoice or contractually due obligation yet existed.
              </Callout>

              <div style={{ marginTop: 32 }}>
                <SectionHead title="The Story Investors Were Sold" />
                <Para mt={0}>
                  The appeal was easy to understand. Supply-chain finance sounds practical, familiar, and low-drama. A supplier wants to be paid early; a finance provider pays the supplier at a discount; the buyer later pays the finance provider. When the underlying buyer is strong, the exposure can look safer than ordinary corporate credit because repayment is tied to a specific commercial obligation.
                </Para>
                <Para>
                  Credit Suisse offered the funds to qualified investors through its asset-management business. The products appeared to combine a conservative financial concept with the credibility of a global bank platform. FINMA later said the client documentation indicated low risk. The story worked because several pieces seemed to fit: receivables were supposed to be identifiable, repayment was supposed to arrive within a short period, and insurance was supposed to protect most claims against buyer default.
                </Para>
                <Para>
                  Those assumptions mattered because each one required proof. A receivable becomes lower-risk only when a reviewer can trace it to a real buyer, a real obligation, a real maturity date, and a real payment history. Once traceability weakened, the same product could become much closer to concentrated corporate lending.
                </Para>
              </div>
            </div>
            <PageFooter page={2} />
          </Page>
          <Gap />

          {/* ── Page 3 — How SCF works + how Greensill changed it + dependency chain ── */}
          <Page>
            <div style={{ padding: "48px 48px 80px" }}>
              <SectionHead title="How Supply-Chain Finance Normally Works" />
              <Para mt={0}>
                The clean version is straightforward. A supplier sells goods or services to a buyer and issues an invoice. Instead of waiting for the buyer to pay, the supplier receives early payment from a finance provider, who later collects the full invoice amount from the buyer. A reviewer can test the clean version with three questions: does an invoice connect the financing to goods or services already delivered; does a buyer owe a fixed amount on a defined date; does the payment history support the expectation that the buyer will pay. When each answer is supported by documents from more than one source, the asset has an observable commercial base.
              </Para>
              <Para>
                This is why claim-level review matters. A fund holding thousands of trade claims does not own a single abstract exposure. It owns thousands of small credit exposures — each with an obligor, amount, maturity, supporting documents, eligibility status, and coverage status. Fund-level reporting can summarise the portfolio, but it cannot replace review of the assets that make up the portfolio.
              </Para>

              <div style={{ marginTop: 36 }}>
                <SectionHead title="How Greensill Changed the Product" />
                <Para mt={0}>
                  Greensill took a traditionally bank-balance-sheet product and moved it into the capital markets. The UK Treasury Committee described Greensill as funding its operations mainly from outside investors; the Bank of England described the model as complex, with nonstandard features. Exposure moved away from a bank retaining and monitoring its own credit book, and toward investors funding receivables through fund structures and securitised claims.
                </Para>
                <Para>
                  That change altered the due-diligence burden. In a classic bank model, the originator keeps the exposure on its own balance sheet and has a direct incentive to monitor credit quality. In the Greensill model, fund investors absorbed the risk while Greensill acted as originator and servicer, with Credit Suisse sitting between Greensill and investors as fund platform and asset manager.
                </Para>

                <div style={{ margin: "26px 0", padding: "20px 22px", background: "#fafafa", border: `1px solid ${BORDER}`, borderRadius: 8 }}>
                  <EyebrowRow label="Structure · The dependency chain" title="Five links, each one a point where verification could fail" />
                  <div data-cs-chain style={{ display: "flex", gap: 8, alignItems: "stretch", marginTop: 16 }}>
                    <ChainBox head="Buyer & Supplier" body="Invoice originates here, or is expected to" />
                    <ChainBox head="Greensill" body="Selects, originates, securitises claims" accent />
                    <ChainBox head="Insurance Cover" body="Arranged by Greensill, in its own name" accent />
                    <ChainBox head="Credit Suisse" body="Fund platform & asset manager" />
                    <ChainBox head="Investors" body="Absorb the underlying risk" />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: MUTED, textTransform: "uppercase" }}>
                    <span>Asset knowledge concentrated here</span>
                    <span>Investor obligation sat here</span>
                  </div>
                  <SourceNote>A fund manager can use an outside originator, but outsourcing origination does not outsource responsibility for verification.</SourceNote>
                </div>
              </div>
            </div>
            <PageFooter page={3} />
          </Page>
          <Gap />

          {/* ── Page 4 — Structure + visibility + future receivables + compare table ── */}
          <Page>
            <div style={{ padding: "48px 48px 80px" }}>
              <SectionHead title="The Structure Credit Suisse Built" />
              <Para mt={0}>
                FINMA said Credit Suisse launched the first of four supply-chain-finance funds with Greensill in 2017. Greensill acted as the financing company, securitised the claims, and transferred securities to the funds; insurance was expected to secure most claims against buyer default. Credit Suisse occupied two roles at once — fund platform and asset manager — while Greensill controlled the asset pipeline. That division of labour placed investor obligations on Credit Suisse while leaving much of the asset knowledge with Greensill.
              </Para>

              <div style={{ marginTop: 32 }}>
                <SectionHead title="Where Visibility Broke Down" />
                <Para mt={0}>
                  FINMA found that Credit Suisse&apos;s asset-management company had little knowledge and control over the specific claims. Greensill selected and reviewed them, and Credit Suisse left Greensill to arrange insurance in its own name. In due-diligence terms, the party creating the exposure also supplied much of the evidence used to explain it — a structural weakness. Credit Suisse needed direct access to invoice files, buyer confirmations, payment records, eligibility files, insurance records, and exception logs, and the ability to test samples without relying on Greensill to frame what they meant.
                </Para>
              </div>

              <div style={{ marginTop: 32 }}>
                <SectionHead title="Future Receivables Changed the Risk" />
                <Para mt={0}>
                  The case became more serious because some claims were not ordinary current receivables. FINMA said Greensill transferred future claims to the funds in some cases — claims that had not yet arisen, reflecting expectations about possible future business rather than documented present obligations. FINMA also said this allowed Greensill to finance companies whose creditworthiness was doubtful.
                </Para>

                <div style={{ margin: "24px 0", border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden" }}>
                  <div style={{ padding: "12px 14px", background: "#fafafa" }}>
                    <EyebrowRow label="Asset verification · The distinction that mattered" title="Current receivable versus future receivable" />
                  </div>
                  <CompareRow header left="Current receivable" right="Future receivable" />
                  <CompareRow left="Goods or services already delivered" right="Expected future business, not yet transacted" />
                  <CompareRow left="Invoice already issued" right="No invoice exists yet to confirm" />
                  <CompareRow left="Buyer owes a fixed amount, on a fixed date" right="Obligation assumed, not documented" />
                  <CompareRow left="Verifiable via invoice, buyer, payment history" right="Verifiable only via forecasts and assumptions" />
                  <CompareRow left="Observable commercial base" right="Financing of doubtful-creditworthiness companies" />
                </div>
                <SourceNote>FINMA said Greensill transferred future claims to the funds in some cases, allowing it to finance companies whose creditworthiness was doubtful.</SourceNote>
              </div>
            </div>
            <PageFooter page={4} />
          </Page>
          <Gap />

          {/* ── Page 5 — Insurance + debtor + warnings + chronology ── */}
          <Page>
            <div style={{ padding: "48px 48px 80px" }}>
              <SectionHead title="Insurance Became Comfort Instead of Proof" />
              <Para mt={0}>
                Insurance also looked reassuring from a distance. FINMA said the structure expected insurance to secure most claims against buyer default, and that Credit Suisse relied on cover organised by Greensill without enough knowledge or control over how many claims were contractually owed. Insurance reduces risk only when coverage can be matched to assets: policy terms, covered obligors, exclusions, concentration limits, renewal and cancellation rights, insurer credit quality, and claim history — and whether the specific claims are within coverage at the time the fund relies on it. Due diligence should treat insurance as a document set to be tested, not a label attached to the portfolio.
              </Para>

              <div style={{ marginTop: 32 }}>
                <SectionHead title="Debtor Exposure Told a Different Story" />
                <Para mt={0}>
                  FINMA said Credit Suisse made partly false and overly positive statements to FINMA about the claims-selection process and the funds&apos; exposure to certain debtors. Apparent diversity of receivables can hide concentrated credit risk: a fund can hold many claims and still depend heavily on a small number of ultimate debtors or related corporate groups. If many claims point back to weak or connected debtors, the fund behaves less like diversified trade finance and more like concentrated credit — changing expected loss, recovery timing, and investor liquidity.
                </Para>
              </div>

              <div style={{ marginTop: 32 }}>
                <SectionHead title="Warnings That Should Have Forced a Review" />
                <Para mt={0}>
                  The warning record was extensive. A 2018 fund closure at another provider prompted enquiries; media and FINMA repeatedly raised concerns; a Credit Suisse risk manager identified risks in Greensill&apos;s business model and recommended against a bridge loan, but a senior manager overruled it. Each should have triggered an independent, documented review before liquidation became necessary.
                </Para>

                <div style={{ marginTop: 28, marginBottom: 8 }}>
                  <EyebrowRow label="Chronology · Warnings received, no holistic review" title="Each signal required independent, documented escalation" />
                  <div style={{ marginTop: 20 }}>
                    <TimelineRow date="2017" head="First Credit Suisse fund launches" body="The first of four supply-chain-finance funds launches with Greensill as originator and structurer." />
                    <TimelineRow date="2018" head="External fund closure prompts enquiries" body="FINMA later said a fund closure at another Greensill provider prompted questions inside Credit Suisse." />
                    <TimelineRow date="2018–2021" head="Media and FINMA repeatedly raise concerns" body="Critical questions reached senior governance bodies, yet FINMA found no holistic, independent review." />
                    <TimelineRow date="Before Mar 2021" head="Risk manager recommends rejecting bridge loan" body="The responsible risk manager identified business-model risks; a senior manager overruled the recommendation." />
                    <TimelineRow date="1 Mar 2021" head="Subscriptions and redemptions suspended" body="The boards suspended dealing because a substantial part of the assets could not be valued reliably." />
                    <TimelineRow date="4 Mar 2021" head="Four funds terminated and placed into liquidation" body="The boards terminated the funds and began liquidation. Investor focus shifted from yield to recovery." last />
                  </div>
                  <SourceNote>Sources: FINMA findings (1); Credit Suisse 2021 Annual Report (2).</SourceNote>
                </div>
              </div>
            </div>
            <PageFooter page={5} />
          </Page>
          <Gap />

          {/* ── Page 6 — Independence + findings + records + ODD framework ── */}
          <Page>
            <div style={{ padding: "48px 48px 80px" }}>
              <SectionHead title="Independence Inside the Review Process" />
              <Para mt={0}>
                FINMA found that Credit Suisse used employees responsible for the Greensill business relationship to deal with critical questions and warnings, and repeatedly asked Lex Greensill himself and relied on his answers for its own statements. That structure weakened the review before any document was examined. A relationship team has incentives that differ from an independent control function — when the same people defending the relationship also answer questions about its weaknesses, the review can become confirmation rather than challenge.
              </Para>

              <div style={{ margin: "26px 0" }}>
                <EyebrowRow label="Governance failure · FINMA findings" title="Where independent challenge should have existed, and did not" />
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
                  <Finding head="The relationship team answered the critical questions">Employees responsible for the Greensill business relationship were used to respond to critical questions and warnings about it.</Finding>
                  <Finding head="The originator&apos;s own answers became the manager&apos;s evidence">Credit Suisse repeatedly asked Lex Greensill himself and relied on his answers for its own statements.</Finding>
                  <Finding head="Statements to the regulator were partly false and overly positive">FINMA said this applied to the claims-selection process and debtor-exposure disclosures.</Finding>
                  <Finding head="FINMA concluded a serious breach of supervisory duty">It found serious deficiencies in organisational structures around identifying, limiting, and monitoring risk.</Finding>
                </div>
                <SourceNote>FINMA findings on Credit Suisse&apos;s supervision of the Greensill-linked supply-chain-finance funds.</SourceNote>
              </div>

              <div style={{ marginTop: 32 }}>
                <SectionHead title="The Records That Should Have Carried the Review" />
                <Para mt={0}>
                  A receivables-fund review starts with the holding and traces backward — from fund position to security, from security to claim pool, from claim pool to receivable, and from receivable to invoice, buyer obligation, supplier record, payment history, and insurance status. Each step should have documents that can be tested independently.
                </Para>

                <div style={{ margin: "24px 0 8px" }}>
                  <EyebrowRow label="ODD framework · The core record set" title="What a claim-level review traces, step by step" />
                  <Question n={1} title="Fund position → security." body="Which securities does the fund hold, and what claim pools do they represent?" />
                  <Question n={2} title="Claim pool → receivable → invoice." body="Invoices, purchase orders, and buyer acknowledgments that connect financing to delivered goods or services." />
                  <Question n={3} title="Debtor confirmation and payment history." body="Supplier records, debtor confirmations, aging reports, and exception logs that show whether exceptions are isolated or systematic." />
                  <Question n={4} title="Insurance and eligibility." body="Policies, covered obligors, exclusions, concentration limits, eligibility files, and concentration reports — tested, not summarised." />
                  <Question n={5} title="Future receivables, reviewed separately." body="What obligation exists today, what commercial assumption supports the future claim, and who bears loss if the future sales do not occur." />
                </div>
              </div>
            </div>
            <PageFooter page={6} />
          </Page>
          <Gap />

          {/* ── Page 7 — Conclusion + references ── */}
          <Page>
            <div style={{ padding: "48px 48px 80px" }}>
              <SectionHead title="Conclusion: How the Story Ended" />
              <Para mt={0}>
                The four Credit Suisse funds entered liquidation in March 2021. Greensill Capital (UK) Limited entered administration on 8 March with liabilities later reported at more than GBP 1.6 billion; the Australian parent entered administration the next day and liquidation in April, and other group companies followed. FINMA later found that Credit Suisse had seriously breached its duties to identify, limit, and monitor risk, ordered governance and risk-management reforms, and opened proceedings against four former managers.
              </Para>
              <Para>
                Lex Greensill did not receive a prison sentence or criminal fine in the outcome documented here. In June 2026 he agreed to a nine-year UK director disqualification lasting until June 2035, concerning Katerra transactions that removed legal protections from a Credit Suisse fund investment and the use of USD 440 million for purposes other than repaying the fund.
              </Para>
              <Callout>
                The sequence ended in fund liquidation, corporate insolvency, regulatory enforcement, prolonged recovery, and a director ban. Claim-level proof, direct debtor evidence, independent insurance verification, and documented escalation were the controls that should have interrupted it.
              </Callout>

              <div style={{ marginTop: 36 }}>
                <EyebrowRow label="References" title="Public sources cited in this analysis" />
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
                  {[
                    ["1", "FINMA — “FINMA concludes Greensill proceedings against Credit Suisse,” 28 February 2023."],
                    ["2", "Credit Suisse Group AG — Annual Report 2021, supply-chain-finance funds section (Form 20-F, 2022)."],
                    ["3", "House of Commons Treasury Committee — Lessons from Greensill Capital, HC 151, Ch. 2, 20 July 2021."],
                    ["4", "Reuters — “Credit Suisse freezes four funds invested in supply chain finance,” 11 March 2021."],
                    ["5", "UK Insolvency Service — “Lex Greensill to be disqualified… for nine years,” 4 June 2026."],
                  ].map(([n, src]) => (
                    <div key={n} style={{ display: "flex", gap: 10, fontSize: 12, color: MUTED, lineHeight: 1.55 }}>
                      <span style={{ flexShrink: 0, fontWeight: 700, color: BODY }}>{n}</span>
                      <span>{src}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 44, paddingTop: 24, borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/alpine-icon.svg" alt="Alpine" style={{ height: 20, width: "auto" }} />
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: BODY }}>Alpine Due Diligence</div>
                    <div style={{ fontSize: 10, color: MUTED }}>alpinedd.com</div>
                  </div>
                </div>
                <div style={{ fontSize: 10, color: MUTED, textAlign: "right", lineHeight: 1.5, maxWidth: 360 }}>
                  Educational case study drawing on the numbered public sources above; it distinguishes source findings from Alpine&apos;s interpretation. Not legal, compliance, or investment advice.
                </div>
              </div>
            </div>
            <PageFooter page={7} />
          </Page>

        </div>
      </div>

      <FloatingSubscribe source="greensill-case" heading="ODD case study, every Thursday." />
    </div>
  );
}
