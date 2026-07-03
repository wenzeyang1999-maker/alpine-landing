"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { GREEN, AMBER, VIOLET } from "@/lib/constants";
import FloatingSubscribe from "@/components/FloatingSubscribe";
import DownloadWhitepaperModal from "@/components/DownloadWhitepaperModal";

// ── Design tokens (match CarvanaView / WhitepaperView) ───────────────────────
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

const FOOTER = "Alpine Due Diligence · The Abraaj Case";

// ── Main component ────────────────────────────────────────────────────────────
export default function AbraajView() {
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
          [data-cs-statband]     { grid-template-columns: repeat(2, 1fr) !important; }
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
            <button
              data-cs-back-btn type="button" onClick={() => router.back()}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", fontSize: 13, fontWeight: 500, color: "#374151", cursor: "pointer", flexShrink: 0 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
              <span data-cs-back-label>Back</span>
            </button>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/alpine-logo-dark.svg?v=5" alt="Alpine Due Diligence" style={{ height: 36, width: "auto" }} />

            <div style={{ flex: 1 }} />

            <a data-cs-book href="https://calendly.com/alpinedd" target="_blank" rel="noopener noreferrer"
              style={{ padding: "7px 16px", borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", fontSize: 13, fontWeight: 500, color: "#374151", cursor: "pointer", textDecoration: "none", flexShrink: 0 }}>
              Book a Meeting
            </a>

            <button data-cs-download-btn onClick={() => setDlOpen(true)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 6, background: "#0f0f10", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download
            </button>

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
              <span style={{ fontSize: 10, fontWeight: 500, color: MUTED, letterSpacing: "0.08em" }}>2026</span>
            </div>

            <div style={{ padding: "56px 48px 48px", display: "flex", flexDirection: "column", gap: 0 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 36, padding: "5px 14px", border: `1px solid ${RISK}80`, borderRadius: 3, alignSelf: "flex-start" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: RISK, display: "inline-block" }} />
                <span style={{ fontSize: 9, fontWeight: 700, color: RISK, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                  ODD CASE STUDY
                </span>
              </div>

              <h1 style={{ fontSize: 52, fontWeight: 800, color: BODY, lineHeight: 1.05, letterSpacing: "-0.03em", margin: "0 0 8px" }}>
                The Abraaj Case
              </h1>
              <h2 style={{ fontSize: 26, fontWeight: 500, color: GOLD, lineHeight: 1.25, letterSpacing: "-0.01em", margin: "0 0 32px" }}>
                Where Did the Money Go?<br />The Collapse of Impact Private Equity
              </h2>

              <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.7, maxWidth: 560, marginBottom: 40 }}>
                A structured analysis of cash commingling, governance concentration, valuation oversight, and key person control at Abraaj Group, and how a proper operational due diligence review would have tested the cash trail before USD 13 billion of investor confidence unwound.
              </p>

              <div data-cs-statband style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: BORDER, border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", marginBottom: 48 }}>
                <div style={{ background: "#fff" }}><KeyStat value="$13B" label="Peak AUM across Africa, Asia, Latin America and the Middle East" /></div>
                <div style={{ background: "#fff" }}><KeyStat value="$1B" label="Healthcare fund whose missing cash first broke investor confidence" /></div>
                <div style={{ background: "#fff" }}><KeyStat value="0" label="Standalone entity accounts a later PwC review could obtain to trace the cash" /></div>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["Cash Commingling", "Fund Governance", "Valuation Oversight", "Key Person Concentration"].map((t) => (
                  <span key={t} style={{ fontSize: 9, fontWeight: 700, color: BODY, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 10px", border: `1px solid ${BORDER}`, borderRadius: 3, background: "#fafafa" }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 48px", borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase" }}>{FOOTER}</span>
              <span style={{ fontSize: 9, color: MUTED }}>01</span>
            </div>
          </Page>
          <Gap />

          {/* ── Page 2 — Overview + The Question That Broke Confidence ── */}
          <Page>
            <div style={{ padding: "48px 48px 80px" }}>
              <Para mt={0}>
                Abraaj Group was a Dubai based private equity firm focused on emerging markets. It built its reputation around a simple proposition: institutional capital could be deployed at scale in markets many traditional fund managers viewed as too complex to underwrite. Arif Naqvi appeared at Davos, co-chaired sessions with heads of state, and built a public profile few fund managers could match. At its peak, the firm managed more than USD 13 billion across Africa, Asia, Latin America, and the Middle East.
              </Para>
              <Para>
                The firm&apos;s healthcare fund drew particular attention because it combined private equity, development finance, and a clear social mission. The USD 1 billion vehicle targeted hospitals, clinics, and diagnostic centers in underserved markets. Its investor base included the Bill &amp; Melinda Gates Foundation, OPIC, PROPARCO, and IFC. The fund stated that it supported access to care for roughly two million patients each year. On paper, it was the kind of strategy that fit neatly into the rise of impact investing.
              </Para>
              <Para>
                That made the later collapse more difficult to read from the outside. Abraaj did not look like a marginal manager operating away from scrutiny. It had recognizable investors, a strong public narrative, and a founder who moved comfortably among global policy and finance circles. The firm appeared mission driven, institutionally endorsed, globally connected, and active in markets with real demand for capital.
              </Para>

              <Callout>
                The scandal emerged when investors began questioning what had happened to money committed to Abraaj&apos;s healthcare fund. Capital that had been called from investors was not deployed into healthcare investments as expected, raising concerns about the location and use of the funds.
              </Callout>

              <Para>
                This article is not about whether Abraaj committed fraud. That question belongs to regulators and the courts. It is about whether a structured operational due diligence review would have surfaced the cash and control risks before they became a forensic problem. <strong>The answer is yes.</strong>
              </Para>

              <div style={{ marginTop: 32 }}>
                <SectionHead title="The Question That Broke Confidence" />
                <Para mt={0}>
                  Abraaj&apos;s collapse began with a basic question from investors: where was the healthcare fund&apos;s money? Investors had committed capital to a USD 1 billion fund that was supposed to build and support hospitals, clinics, and diagnostic centers in underserved markets. From the outside, the strategy looked credible. The problem emerged when capital that had been called from investors was not deployed into healthcare assets as expected.
                </Para>
                <Para>
                  When investors asked for answers, the explanations did not resolve the concern. The matter escalated from ordinary investor questioning to forensic review. Later regulatory findings alleged a deeper failure: investor money had been mixed with corporate funds, used to support the management company&apos;s liquidity needs, and reported in ways that did not give LPs an accurate view of the cash.
                </Para>
                <Para>
                  The control issues were basic. Capital calls needed to match approved investments or expenses. Fund accounts needed to remain separate from manager liquidity. Intercompany movements needed formal approval and repayment records. Distributions needed to follow the agreed waterfall. Reporting needed to reconcile back to bank statements and entity level accounts. In private markets, these controls decide whether LP capital remains protected.
                </Para>
              </div>
            </div>
            <PageFooter label={FOOTER} page={2} />
          </Page>
          <Gap />

          {/* ── Page 3 — Governance + Cash Controls ── */}
          <Page>
            <div style={{ padding: "48px 48px 80px" }}>
              <SectionHead title="Fund Governance Failed as a Practical Control System" />
              <Para mt={0}>
                The cash question exposed a governance question. If LP capital could be called, held, moved, or reported in ways investors could not verify, then the issue was not limited to accounting records. It also concerned who had authority inside Abraaj, who could challenge that authority, and whether formal oversight bodies received enough information to act.
              </Para>
              <Para>
                The DFSA found that Arif Naqvi was Abraaj&apos;s largest shareholder, CEO, executive vice chair, public face, and dominant figure inside the firm. That concentration mattered because key decisions did not appear to move through a balanced internal process. Senior management ignored compliance concerns raised internally about unauthorized activity. The firm had committees, policies, and formal reporting lines, but the actual organization depended heavily on Naqvi and a small senior group around him.
              </Para>
              <Para>
                The LPAC structure had the same practical limitation. It could only act on the information provided to it. If capital calls, fund expenses, intercompany movements, or exceptions were not reported clearly, the committee had little ability to intervene. Abraaj&apos;s governance problem was therefore direct: the formal structure existed, but the flow of authority and information did not give investors a reliable check on management.
              </Para>

              <div style={{ marginTop: 36 }}>
                <SectionHead title="Cash Controls Were the Center of the Failure" />
                <Para mt={0}>
                  In private markets, cash control is the boundary between investor capital and manager liquidity. At Abraaj, that boundary became one of the central issues in the collapse. The SEC alleged that investor money was commingled with corporate funds when it should have been held separately. The DFSA found that investor monies were used to cover operating expenses and cash shortfalls at the management company level.
                </Para>
                <Callout>
                  AIML borrowed before reporting dates to show bank balances that would satisfy LP expectations, then repaid those balances after the relevant dates passed.
                </Callout>
                <Para mt={0}>
                  The problem turned on basic cash mechanics. Fund accounts, manager accounts, administrator access, and bank statement delivery all mattered. If LP capital and manager operating cash were not clearly separated, and if the administrator did not receive statements directly from the bank, investors had limited ability to verify where the money was. Intercompany transfers required the same discipline: loans or advances between a fund entity and the management company should carry formal approval, documented terms, and a visible repayment history.
                </Para>
              </div>
            </div>
            <PageFooter label={FOOTER} page={3} />
          </Page>
          <Gap />

          {/* ── Page 4 — Reporting + Valuation + findings grid ── */}
          <Page>
            <div style={{ padding: "48px 48px 80px" }}>
              <SectionHead title="LP Reporting Did Not Close the Verification Gap" />
              <Para mt={0}>
                Abraaj&apos;s reporting described positions without proving the cash behind them. The DFSA found that AIML gave investors misleading financial information, made false statements about how money was being used, deflected requests for updated bank statements, and gave false explanations for delayed distributions. Those findings concerned basic cash movements: where investor money sat, when it moved, why it moved, and whether the movement matched what LPs had been told.
              </Para>
              <Para>
                A PwC review later found that standalone annual financial statements and standalone monthly management accounts could not be obtained for the relevant entities. Without entity level accounts, bank records, and reconciliations, investors could not trace capital from the call notice to the fund account, from the fund account to the investment or expense, and from exits back through the distribution process.
              </Para>

              <div style={{ marginTop: 36 }}>
                <SectionHead title="Valuation and Track Record Oversight Needed Independent Challenge" />
                <Para mt={0}>
                  Abraaj was raising successor capital on the strength of its prior record. In that setting, valuation was tied directly to fundraising: unrealized marks shaped reported performance, and reported performance shaped what new investors were asked to believe. The SEC alleged that a senior executive approved valuations he knew were inflated while resisting attempts by others to mark them down, and that potential investors were misled about the firm&apos;s financial health and a materially overstated track record.
                </Para>
                <Para>
                  The basic questions were practical. Who sat on the valuation committee, and who had independence from the deal team and the fundraising team? Who could override a valuation decision? How did fundraising materials separate gross, net, realized, and unrealized performance? Abraaj&apos;s case shows why valuation controls matter most when a manager is using its record to raise the next pool of capital.
                </Para>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "28px 0 0" }}>
                {[
                  { title: "Cash Commingling", body: "Capital investors understood to be reserved for fund investments was used for management company working capital and cash shortfalls (SEC and DFSA)." },
                  { title: "Balance Window Dressing", body: "AIML borrowed before reporting dates to show bank balances that met LP expectations, then repaid after the dates passed." },
                  { title: "Reporting Gap", body: "Standalone annual and monthly entity accounts could not later be obtained, so capital could not be traced from call to investment to exit." },
                  { title: "Inflated Marks", body: "A senior executive approved valuations known to be inflated while resisting markdowns, supporting an overstated record used to raise the next fund." },
                ].map(({ title, body }) => (
                  <div key={title} style={{ padding: "16px 18px", background: "#fafafa", border: `1px solid ${BORDER}`, borderRadius: 6 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: BODY, marginBottom: 8 }}>{title}</div>
                    <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>{body}</div>
                  </div>
                ))}
              </div>
            </div>
            <PageFooter label={FOOTER} page={4} />
          </Page>
          <Gap />

          {/* ── Page 5 — Key Person + What ODD Prevents + What LPs Learn + close ── */}
          <Page>
            <div style={{ padding: "48px 48px 80px" }}>
              <SectionHead title="Key Person Risk Became Control Risk" />
              <Para mt={0}>
                Key person risk usually starts with succession. At Abraaj, the larger issue was control. The DFSA found that Arif Naqvi was the ultimate decision maker at the firm: centrally involved in directing the use of investor monies, approving statements to investors the regulator later described as misleading, and managing the firm&apos;s responses when LPs pressed for answers. His influence extended across fundraising, investor communications, cash decisions, and the handling of exceptions.
              </Para>
              <Para>
                The problem was not only that one person mattered too much to the franchise. It was that the same person sat close to the areas that should have been checked independently. A control function cannot operate effectively when it depends on the judgment or permission of the person it may need to challenge. Abraaj shows why key person review should go beyond replacement planning to whether the firm can surface and escalate a serious problem involving senior leadership.
              </Para>

              <div style={{ marginTop: 36 }}>
                <SectionHead title="What Proper ODD Would Have Prevented" />
                <Callout>
                  Each capital call should have matched an approved investment or fund expense. Fund bank accounts should have remained separate from management company accounts. The administrator should have received bank statements directly from the bank. Intercompany transfers should have carried formal approval, documented terms, and clear reporting to the LPAC.
                </Callout>
                <Para mt={0}>
                  The same discipline applied to expenses, distributions, and valuations. If an LP needed to verify cash balances on a given date, the fund should have been able to produce direct bank evidence, administrator records, capital call support, and transaction level reconciliations. In Abraaj&apos;s case, the answers became incomplete, delayed, and disputed. That was the signal.
                </Para>
              </div>

              <div style={{ marginTop: 36 }}>
                <SectionHead title="What LPs Should Learn" />
                <Para mt={0}>
                  Abraaj did not collapse because investors missed a red flag in a marketing deck. It collapsed because investors could not rely on the operating structure underneath the manager&apos;s story. Reputation, mission, and a roster of institutional co-investors are not substitutes for verification.
                </Para>
                <Para>
                  Private market due diligence must go beyond what a manager says and test whether those statements can be independently confirmed. Capital calls, fund expenses, valuations, distributions, and intercompany movements need to be controlled, documented, and reviewable by someone other than the manager. <strong>That is the role of serious ODD: asking the structural questions before capital moves, before confidence breaks, and before the only remaining option is a forensic review.</strong>
                </Para>
              </div>

              <div style={{ marginTop: 48, paddingTop: 24, borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
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
            <PageFooter label={FOOTER} page={5} />
          </Page>

        </div>
      </div>

      <FloatingSubscribe source="abraaj-case" heading="ODD case study, every other Tuesday." />
      <DownloadWhitepaperModal
        open={dlOpen}
        onClose={() => setDlOpen(false)}
        apiEndpoint="/api/case-study/abraaj/download"
        docLabel="Case Study"
      />
    </div>
  );
}
