"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { GREEN, AMBER, VIOLET } from "@/lib/constants";
import FloatingSubscribe from "@/components/FloatingSubscribe";
import DownloadWhitepaperModal from "@/components/DownloadWhitepaperModal";

// ── Design tokens (match WhitepaperView) ─────────────────────────────────────
const BODY   = "#1a2744";
const MUTED  = "#4a5568";
const GOLD   = "#c8923a";
const BORDER = "#ddd8cf";
const RISK   = "#b5361c";
const RISK_BG = "#fdf2f2";

// ── Page wrapper ──────────────────────────────────────────────────────────────
function Page({ children, minH = 900 }: { children: React.ReactNode; minH?: number }) {
  return (
    <div
      data-pdf-page
      style={{
        background: "#fff",
        maxWidth: 900,
        margin: "0 auto",
        minHeight: minH,
        boxShadow: "0 2px 20px rgba(0,0,0,0.10)",
        borderRadius: 4,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {children}
    </div>
  );
}

function Gap() {
  return <div data-pdf-gap style={{ height: 28 }} />;
}

function PageFooter({ label, page }: { label: string; page: number }) {
  return (
    <div
      data-wp-page-footer
      style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "10px 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderTop: `1px solid ${BORDER}`,
      }}
    >
      <span style={{ fontSize: 9, fontWeight: 700, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        {label}
      </span>
      <span style={{ fontSize: 9, fontWeight: 600, color: MUTED }}>
        {String(page).padStart(2, "0")}
      </span>
    </div>
  );
}

function SectionHead({ title }: { title: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <div style={{ width: 3, height: 20, background: GOLD, borderRadius: 2, flexShrink: 0 }} />
        <h2 style={{ fontSize: 22, fontWeight: 700, color: BODY, lineHeight: 1.25, letterSpacing: "-0.02em", margin: 0 }}>
          {title}
        </h2>
      </div>
    </div>
  );
}

function Para({ children, mt = 16 }: { children: React.ReactNode; mt?: number }) {
  return (
    <p style={{ fontSize: 14.5, color: MUTED, lineHeight: 1.78, marginTop: mt, marginBottom: 0 }}>
      {children}
    </p>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      margin: "24px 0",
      padding: "16px 20px",
      background: RISK_BG,
      borderLeft: `3px solid ${RISK}`,
      borderRadius: "0 6px 6px 0",
    }}>
      <p style={{ fontSize: 13.5, color: RISK, lineHeight: 1.65, margin: 0, fontStyle: "italic" }}>
        {children}
      </p>
    </div>
  );
}

function KeyStat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: "center", padding: "16px 12px" }}>
      <div style={{ fontSize: 28, fontWeight: 800, color: RISK, letterSpacing: "-0.03em", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: MUTED, marginTop: 6, lineHeight: 1.4 }}>{label}</div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CarvanaView() {
  const router = useRouter();
  const [zoom, setZoom] = useState(1);
  const [dlOpen, setDlOpen] = useState(false);
  const changeZoom = (delta: number) =>
    setZoom((z) => Math.min(2, Math.max(0.5, Math.round((z + delta) * 10) / 10)));

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
          <div
            data-cs-header-inner
            style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", gap: 16 }}
          >
            {/* Back */}
            <button
              data-cs-back-btn type="button" onClick={() => router.back()}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", fontSize: 13, fontWeight: 500, color: "#374151", cursor: "pointer", flexShrink: 0 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
              <span data-cs-back-label>Back</span>
            </button>

            {/* Logo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/alpine-logo-dark.svg?v=5" alt="Alpine Due Diligence" style={{ height: 36, width: "auto" }} />

            <div style={{ flex: 1 }} />

            {/* Book a Meeting */}
            <a data-cs-book href="https://calendly.com/alpinedd" target="_blank" rel="noopener noreferrer"
              style={{ padding: "7px 16px", borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", fontSize: 13, fontWeight: 500, color: "#374151", cursor: "pointer", textDecoration: "none", flexShrink: 0 }}>
              Book a Meeting
            </a>

            {/* Download */}
            <button data-cs-download-btn onClick={() => setDlOpen(true)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 6, background: "#0f0f10", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download
            </button>

            {/* Zoom */}
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
        <div
          data-cs-root
          style={{ transformOrigin: "top center", transform: `scale(${zoom})`, transition: "transform 0.15s ease" }}
        >

          {/* ── Page 1 — Cover ── */}
          <Page minH={900}>
            {/* Topbar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 48px", borderBottom: `1px solid ${BORDER}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: BODY, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  ALPINE DUE DILIGENCE
                </span>
                <div style={{ width: 1, height: 16, background: BORDER }} />
                <span style={{ fontSize: 10, fontWeight: 500, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  CONFIDENTIAL
                </span>
              </div>
              <span style={{ fontSize: 10, fontWeight: 500, color: MUTED, letterSpacing: "0.08em" }}>2025</span>
            </div>

            {/* Cover content */}
            <div style={{ padding: "56px 48px 48px", display: "flex", flexDirection: "column", gap: 0 }}>
              {/* Eyebrow */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 36, padding: "5px 14px", border: `1px solid ${RISK}80`, borderRadius: 3, alignSelf: "flex-start" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: RISK, display: "inline-block" }} />
                <span style={{ fontSize: 9, fontWeight: 700, color: RISK, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                  ODD CASE STUDY
                </span>
              </div>

              {/* Title */}
              <h1 style={{ fontSize: 52, fontWeight: 800, color: BODY, lineHeight: 1.05, letterSpacing: "-0.03em", margin: "0 0 8px" }}>
                The Carvana Case
              </h1>
              <h2 style={{ fontSize: 26, fontWeight: 500, color: GOLD, lineHeight: 1.25, letterSpacing: "-0.01em", margin: "0 0 32px" }}>
                Why Operational Due Diligence Matters<br />Before the Fraud Becomes Obvious
              </h2>

              <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.7, maxWidth: 540, marginBottom: 40 }}>
                A structured analysis of governance conflicts, related-party opacity, key person concentration, and reporting quality — and how a proper ODD review would have surfaced these risks before Hindenburg&apos;s report made them headlines.
              </p>

              {/* Key stats row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: BORDER, border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", marginBottom: 48 }}>
                <div style={{ background: "#fff" }}><KeyStat value="$5B+" label="Insider stock sold across two cycles before each collapse" /></div>
                <div style={{ background: "#fff" }}><KeyStat value="284%" label="Stock recovery before Hindenburg report in Jan 2025" /></div>
                <div style={{ background: "#fff" }}><KeyStat value="4×" label="Delinquency rate vs. industry average on 'prime' loans" /></div>
              </div>

              {/* Topic chips */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["Governance Conflicts", "Related-Party Risk", "Reporting Quality", "Key Person Concentration"].map((t) => (
                  <span key={t} style={{ fontSize: 9, fontWeight: 700, color: BODY, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 10px", border: `1px solid ${BORDER}`, borderRadius: 3, background: "#fafafa" }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Cover footer */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 48px", borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase" }}>ALPINE DUE DILIGENCE · THE CARVANA CASE</span>
              <span style={{ fontSize: 9, color: MUTED }}>01</span>
            </div>
          </Page>
          <Gap />

          {/* ── Page 2 — Overview ── */}
          <Page>
            <div style={{ padding: "48px 48px 80px" }}>
              {/* Intro with floated image — mirrors the PDF layout */}
              <div style={{ overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/carvana-vending.jpg"
                  alt="Carvana car vending machine"
                  style={{
                    float: "right",
                    width: "48%",
                    maxWidth: 360,
                    marginLeft: 24,
                    marginBottom: 12,
                    borderRadius: 6,
                    display: "block",
                  }}
                />
                <Para mt={0}>
                  Carvana is widely known as a company that tried to change how Americans buy used cars. Its public image is simple and attractive: buying a used car should not feel like walking into a dealership from another era. Customers could search online, choose a vehicle, arrange financing, and have the car delivered to their home. The company&apos;s car vending machines became a powerful symbol of that promise — making Carvana look less like a traditional dealer and more like a technology company solving an old consumer problem.
                </Para>
              </div>
              <Para>
                In a market as large and fragmented as used vehicle retail, the idea of a cleaner, faster, digital model was easy to understand. Consumers liked the convenience. Investors liked the scale story. Management presented the company as a modern platform in an industry that had long been inefficient. For a time, the market accepted that story.
              </Para>
              <Para>
                Then the business nearly broke. After the pandemic period, Carvana&apos;s stock collapsed, carrying heavy debt, high operating costs, and pressure from a changing used car market. What once looked like a disruptive growth company began to look like a business that had expanded faster than its economics could support.
              </Para>
              <Para>
                But then the story changed again. Carvana staged a dramatic recovery. Its stock rebounded sharply, and management pointed to improved execution, stronger efficiency, and better financial results. To many observers, the company appeared to have completed a rare turnaround. A business that had once looked close to failure was now being discussed again as a major winner in online auto retail.
              </Para>

              <Callout>
                In January 2025, short-seller Hindenburg Research published a detailed report describing related-party accounting games, lax underwriting, conflicted governance, and a pattern of insider selling that appeared to repeat itself with surgical precision — twice.
              </Callout>

              <Para>
                That is why Carvana is a due diligence case, not just a market story. The issue was not whether the company had real cars, customers, or revenue. It did. The issue was whether its reported recovery reflected a self-sustaining business, or whether profits appeared in the public company while credit risk, related-party exposure, and financial pressure sat elsewhere.
              </Para>
              <Para>
                This article is not about whether Carvana committed fraud. That question belongs to the courts. This article is about whether a structured operational due diligence review would have identified these risks before they became headlines. <strong>The answer is yes.</strong>
              </Para>

              <div style={{ marginTop: 32 }}>
                <SectionHead title="Governance Was Compromised From the Start" />
                <Para mt={0}>
                  Carvana&apos;s pitch was compelling. An online platform disrupting a fragmented, inefficient used car market. A founder-led business with bold ambitions. A stock that recovered 284% in 2024 after nearly going bankrupt in 2022.
                </Para>
                <Para>
                  However, the company and management structure was compromised at the very beginning. Start with the board. Carvana&apos;s audit committee — the body responsible for independent financial oversight — included two individuals who had previously served on the board of DriveTime, a private used car dealership run by the CEO&apos;s father, Ernest Garcia II.
                </Para>
                <Para>
                  One audit committee member, Greg Sullivan, had been suspended by the New York Stock Exchange in 1992 for sending money to Ernest Garcia II in violation of a prohibition order. That history was not prominently disclosed in Carvana&apos;s filings.
                </Para>
                <Para>
                  The audit committee chairman, Ira Platt, had worked as a banker for DriveTime stretching back to 1998 and later served as a DriveTime board member before joining Carvana&apos;s board at the time of its IPO.
                </Para>
                <Para>
                  Ernest Garcia II himself is the largest shareholder and operator of the primary related-party entity — and had pleaded guilty to felony bank fraud in 1990 over charges involving sham accounting transactions and falsified letters to auditors. His son has been Carvana&apos;s CEO since inception.
                </Para>
              </div>
            </div>
            <PageFooter label="Alpine Due Diligence · The Carvana Case" page={2} />
          </Page>
          <Gap />

          {/* ── Page 3 — Related-Party + Insider ── */}
          <Page>
            <div style={{ padding: "48px 48px 80px" }}>
              <Para mt={0}>
                None of this required investigative skill to find. But it required someone to look and to treat governance structure as a substantive risk area, not a formality. In any institutional due diligence review, board composition, director independence, and related-party relationships are examined specifically because conflicts at the governance level tend to enable problems everywhere else. <strong>Carvana&apos;s board structure would have generated material flags from the first page.</strong>
              </Para>

              <div style={{ marginTop: 36 }}>
                <SectionHead title="The Related-Party Architecture Nobody Talked About" />
                <Para mt={0}>
                  The deeper operational risk at Carvana was structural. Multiple critical business functions ran through DriveTime — the private company controlled by the CEO&apos;s father — which created a web of transactions that were difficult for outside investors to evaluate.
                </Para>
                <Para>
                  Carvana&apos;s extended warranties were administered by DriveTime. Carvana recognized commission revenue and profit-sharing from these arrangements upfront. A former Carvana director described the terms as &quot;pretty generous&quot; back to Carvana, noting that the related-party structure allowed them to &quot;pull as much of that profit forward&quot; as possible. Carvana&apos;s warranty income per unit was estimated to be roughly <strong>58% higher</strong> than its closest comparable peer.
                </Para>
                <Para>
                  Carvana&apos;s auto loans were serviced by a DriveTime affiliate. This arrangement was identified as a dealbreaker by at least one prospective financing partner. In 2024, Carvana sold $800 million in loans to what it described in SEC filings as an &quot;unrelated third party.&quot; Lien filings and corporate registration records suggest the buyer was a trust affiliated with Cerberus Capital Management, where a sitting Carvana board member served as Chairman of Global Investments. Carvana did not mention the new buyer on either of its earnings calls.
                </Para>

                <Callout>
                  Related-party review is a core component of operational due diligence precisely because this kind of architecture is not always visible in a DDQ or an IR presentation. It requires document-level examination — audited financials, regulatory filings, service provider agreements, and counterparty verification.
                </Callout>
              </div>

              <div style={{ marginTop: 36 }}>
                <SectionHead title="Insider Behavior as an Operational Signal" />
                <Para mt={0}>
                  Between August 2020 and August 2021, Ernest Garcia II sold <strong>$3.6 billion</strong> in Carvana stock while his son&apos;s company was publicly projecting record growth. Within sixteen months of the last sale, the stock had dropped 99% and Carvana was facing bankruptcy concerns.
                </Para>
                <Para>
                  The pattern repeated. During 2023 and 2024, with the CEO again touting exceptional results, Garcia II sold another <strong>$1.4 billion</strong>. In July 2023, the Garcias purchased $126 million in Carvana stock. Two days later, the company announced its &quot;best quarter in company history,&quot; driven by a surge in loan sales that had been artificially suppressed the prior quarter.
                </Para>
                <Para>
                  Due diligence does not adjudicate insider intent. But it does evaluate key person concentration, succession risk, and whether control structures create asymmetric exposure for outside investors. When a single family controls the CEO role, the largest shareholder position, the primary service provider, and the loan servicer simultaneously, that concentration is an operational risk regardless of whether fraud is ever proven.
                </Para>
              </div>
            </div>
            <PageFooter label="Alpine Due Diligence · The Carvana Case" page={3} />
          </Page>
          <Gap />

          {/* ── Page 4 — Financial Reporting + Conclusion ── */}
          <Page>
            <div style={{ padding: "48px 48px 80px" }}>
              <SectionHead title="Financial Reporting Quality: The Questions Due Diligence Asks" />
              <Para mt={0}>
                Due diligence does not audit financial statements. But it evaluates whether management&apos;s reported results are supported by consistent, verifiable operational evidence and whether accounting policies are transparent, conservative, and comparable to industry peers.
              </Para>
              <Para>
                At Carvana, several areas would have warranted structured scrutiny:
              </Para>

              {/* Findings grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "24px 0" }}>
                {[
                  { title: "Gain on Loan Sales", body: "Represented 2.2× net income over the nine months prior to the Hindenburg report. If the primary driver of reported profitability is the ability to sell risky loans to third parties, how durable is that model?" },
                  { title: "Aggressive Accounting", body: "Carvana designated all loans as \"held for sale,\" avoiding credit loss reserves at origination. A former director called this \"a relatively aggressive accounting practice.\"" },
                  { title: "Balance Sheet Growth", body: "Loans held on the balance sheet grew 50% between 2021 and late 2024, even as retail unit sales declined — an unusual divergence." },
                  { title: "Delinquency Rate", body: "Loan extensions granted by the related-party servicer exceeded every other subprime auto issuer tracked by S&P. Delinquencies ran at more than 4× the industry average." },
                ].map(({ title, body }) => (
                  <div key={title} style={{ padding: "16px 18px", background: "#fafafa", border: `1px solid ${BORDER}`, borderRadius: 6 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: BODY, marginBottom: 8 }}>{title}</div>
                    <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>{body}</div>
                  </div>
                ))}
              </div>

              <Para>
                None of these data points require predicting outcomes. They are the inputs to a structured conversation — one that an institutional allocator should be having with any manager before committing capital.
              </Para>

              <div style={{ marginTop: 36 }}>
                <SectionHead title="What Due Diligence Is Actually Built to Do" />
                <Para mt={0}>
                  The Carvana case is extreme. Most managers do not have a convicted felon as their largest shareholder and primary service provider. Most audit committees do not include individuals with documented ties to related-party fraud.
                </Para>
                <Para>
                  But the underlying risk categories — governance conflicts, related-party opacity, key person concentration, reporting quality concerns, and service provider independence — exist across the manager universe at every size level. They are more common in emerging managers where infrastructure is still being built and where institutional oversight is less consistent.
                </Para>

                <Callout>
                  A manager can present strong performance while risk is hidden in valuation methods, affiliated transactions, weak service providers, concentrated control, or opaque counterparties. Investors need to know not only what the return was, but how it was generated, who touched the assets, who valued them, who serviced them, and who stood to benefit.
                </Callout>

                <Para>
                  The Carvana story is a reminder that serious risks often become obvious only after they have already damaged investors. Due diligence exists to ask the uncomfortable questions earlier. It traces the relationships, tests the economics, challenges the governance, and determines whether performance can be trusted before capital moves.
                </Para>
              </div>

              {/* Closing rule */}
              <div style={{ marginTop: 48, paddingTop: 24, borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <img src="/alpine-icon.svg" alt="Alpine" style={{ height: 20, width: "auto" }} />
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: BODY }}>Alpine Due Diligence</div>
                    <div style={{ fontSize: 10, color: MUTED }}>alpinedd.com</div>
                  </div>
                </div>
                <div style={{ fontSize: 10, color: MUTED, textAlign: "right", lineHeight: 1.5 }}>
                  This case study is for informational purposes only.<br />
                  It does not constitute legal, financial, or investment advice.
                </div>
              </div>
            </div>
            <PageFooter label="Alpine Due Diligence · The Carvana Case" page={4} />
          </Page>

        </div>
      </div>

      <FloatingSubscribe source="carvana-case" heading="ODD case study, every other Thursday." />
      <DownloadWhitepaperModal
        open={dlOpen}
        onClose={() => setDlOpen(false)}
        apiEndpoint="/api/case-study/carvana/download"
        docLabel="Case Study"
      />
    </div>
  );
}
