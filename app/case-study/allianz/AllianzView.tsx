"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { GREEN, AMBER, VIOLET } from "@/lib/constants";
import FloatingSubscribe from "@/components/FloatingSubscribe";

// ── Design tokens (petrol-teal accent, matches the Chatham/Greensill cases) ──
const BODY    = "#17323b";
const MUTED   = "#4a5568";
const GOLD    = "#1f6e78";
const BORDER  = "#ddd8cf";
const RISK    = "#1f6e78";
const RISK_BG = "#edf4f5";

// ── Shared building blocks ───────────────────────────────────────────────────
function Page({ children, minH = 900 }: { children: React.ReactNode; minH?: number }) {
  return (
    <div data-pdf-page style={{ background: "#fff", maxWidth: 900, margin: "0 auto", minHeight: minH, boxShadow: "0 2px 20px rgba(0,0,0,0.10)", borderRadius: 4, overflow: "hidden", position: "relative" }}>
      {children}
    </div>
  );
}
function Gap() { return <div data-pdf-gap style={{ height: 28 }} />; }
function PageFooter({ page }: { page: number }) {
  return (
    <div data-cs-coverfoot style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${BORDER}` }}>
      <span style={{ fontSize: 9, fontWeight: 700, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase" }}>Alpine Due Diligence · The Allianz Structured Alpha Case</span>
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
      <div style={{ fontSize: 26, fontWeight: 800, color: RISK, letterSpacing: "-0.03em", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: MUTED, marginTop: 8, lineHeight: 1.4 }}>{label}</div>
      <div style={{ fontSize: 9, fontWeight: 700, color: BODY, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 8 }}>{kicker}</div>
    </div>
  );
}
function StatBand({ children }: { children: React.ReactNode }) {
  return (
    <div data-cs-statband style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: BORDER, border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", margin: "26px 0 0" }}>
      {children}
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
function Numbered({ n, title, body }: { n: number; title: string; body: string }) {
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
function ChainBox({ head, body, accent }: { head: string; body: string; accent?: boolean }) {
  return (
    <div style={{ flex: 1, minWidth: 120, padding: "12px 12px", background: accent ? RISK_BG : "#fafafa", border: `1px solid ${accent ? RISK : BORDER}`, borderRadius: 6, textAlign: "center" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: BODY, marginBottom: 4 }}>{head}</div>
      <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.45 }}>{body}</div>
    </div>
  );
}

/** Original figure on the left, the number investors received on the right. */
function AlteredRow({ origLabel, orig, sentLabel, sent, note, last }: { origLabel: string; orig: string; sentLabel: string; sent: string; note: string; last?: boolean }) {
  return (
    <div data-cs-altered style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 16, padding: "14px 0", borderBottom: last ? "none" : `1px solid ${BORDER}` }}>
      <div>
        <div style={{ fontSize: 9, fontWeight: 700, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>{origLabel}</div>
        <div style={{ fontSize: 21, fontWeight: 800, color: BODY, letterSpacing: "-0.02em" }}>{orig}</div>
        <div style={{ fontSize: 11, color: MUTED, marginTop: 3 }}>{note}</div>
      </div>
      <div style={{ fontSize: 10, color: MUTED, fontWeight: 600, whiteSpace: "nowrap" }}>became</div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>{sentLabel}</div>
        <div style={{ fontSize: 21, fontWeight: 800, color: "#a03232", letterSpacing: "-0.02em" }}>{sent}</div>
        <div style={{ fontSize: 11, color: MUTED, marginTop: 3 }}>As reported to investors</div>
      </div>
    </div>
  );
}

/** Horizontal band showing how far below the market the hedges actually sat. */
function HedgeBar({ label, rangeLabel, leftPct, widthPct, accent }: { label: string; rangeLabel: string; leftPct: number; widthPct: number; accent?: boolean }) {
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <div style={{ position: "relative", height: 30, background: "#f5f5f3", border: `1px solid ${BORDER}`, borderRadius: 4 }}>
        <div style={{ position: "absolute", top: 3, bottom: 3, left: `${leftPct}%`, width: `${widthPct}%`, background: accent ? "#a03232" : RISK, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>{rangeLabel}</span>
        </div>
      </div>
    </div>
  );
}

export default function AllianzView() {
  const router = useRouter();
  const [zoom, setZoom] = useState(1);
  const changeZoom = (d: number) => setZoom((z) => Math.min(2, Math.max(0.5, Math.round((z + d) * 10) / 10)));
  useEffect(() => {
    const onWheel = (e: WheelEvent) => { if (!e.ctrlKey) return; e.preventDefault(); setZoom((z) => Math.min(2, Math.max(0.5, Math.round((z - e.deltaY * 0.01) * 100) / 100))); };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div data-cs-outer style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#ebebeb" }}>
      <style suppressHydrationWarning>{`
        @media (max-width: 768px) {
          [data-cs-zoom]{display:none!important;} [data-cs-book]{display:none!important;}
          [data-cs-back-label]{display:none!important;} [data-cs-back-btn]{padding:6px 8px!important;}
          [data-cs-download-btn]{padding:6px 12px!important;font-size:12px!important;}
          [data-cs-header-inner]{padding:0 12px!important;height:56px!important;}
          [data-cs-scroll]{padding:16px 0!important;} [data-cs-root]{padding:0!important;}
          [data-pdf-page]{min-height:auto!important;box-shadow:none!important;border-radius:0!important;}
          [data-pdf-gap]{display:none!important;} [data-cs-coverfoot]{display:none!important;}
          [data-cs-statband]{grid-template-columns:repeat(2,1fr)!important;}
          [data-cs-chain]{flex-direction:column!important;}
          [data-cs-altered]{grid-template-columns:1fr!important;gap:6px!important;text-align:left!important;}
          [data-cs-altered] > div:last-child{text-align:left!important;}
          [data-cs-topbar]{padding:14px 22px!important;} [data-cs-cover]{padding:30px 22px 34px!important;}
          [data-cs-body]{padding:30px 22px 40px!important;}
          [data-cs-h1]{font-size:32px!important;line-height:1.1!important;} [data-cs-h2]{font-size:18px!important;margin:0 0 24px!important;}
        }
        @media print {
          header, .floating-subscribe-root { display: none !important; }
          [data-pdf-gap] { display: none !important; }
          [data-pdf-page] { page-break-after: always; break-after: page; box-shadow: none !important; border-radius: 0 !important; }
          /* Without this the final break emits a trailing blank page. */
          [data-pdf-page]:last-of-type { page-break-after: auto; break-after: auto; }
          /* One page box == one physical sheet, so the footer pins to the true
             bottom edge instead of floating partway down. A Letter sheet is
             816x1056 CSS px at 96dpi; printed at scale 0.9 it holds
             816/0.9 = 906 wide by 1056/0.9 = 1173 tall. 1170 leaves a hair of
             slack so rounding can never spill a page in two. */
          @page { size: Letter; margin: 0; }
          [data-pdf-page] { height: 1170px !important; min-height: 1170px !important; }
          [data-cs-outer] { background: #fff !important; }
          [data-cs-scroll] { padding: 0 !important; }
        }
      `}</style>

      {/* ── Header ── */}
      <header>
        <div style={{ height: 2, background: `linear-gradient(90deg, ${GREEN}, ${AMBER}, ${VIOLET})` }} />
        <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
          <div data-cs-header-inner style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", gap: 16 }}>
            <button data-cs-back-btn type="button" onClick={() => router.back()} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", fontSize: 13, fontWeight: 500, color: "#374151", cursor: "pointer", flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
              <span data-cs-back-label>Back</span>
            </button>
            <Link href="/" aria-label="Alpine home" style={{ display: "inline-flex", alignItems: "center", flexShrink: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/alpine-logo-dark.svg?v=5" alt="Alpine Due Diligence" style={{ height: 36, width: "auto" }} />
            </Link>
            <div style={{ flex: 1 }} />
            <a data-cs-book href="https://calendly.com/alpinedd" target="_blank" rel="noopener noreferrer" style={{ padding: "7px 16px", borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", fontSize: 13, fontWeight: 500, color: "#374151", textDecoration: "none", flexShrink: 0 }}>Book a Meeting</a>
            <a data-cs-download-btn href="/allianz-structured-alpha.pdf" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 6, background: "#0f0f10", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none", flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              Download PDF
            </a>
            <div data-cs-zoom style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff" }}>
              <button type="button" onClick={() => changeZoom(-0.1)} style={{ width: 24, height: 24, border: "none", background: "none", cursor: "pointer", fontSize: 16, color: "#374151" }}>−</button>
              <span style={{ fontSize: 12, fontWeight: 500, color: "#374151", minWidth: 36, textAlign: "center" }}>{Math.round(zoom * 100)}%</span>
              <button type="button" onClick={() => changeZoom(0.1)} style={{ width: 24, height: 24, border: "none", background: "none", cursor: "pointer", fontSize: 16, color: "#374151" }}>+</button>
            </div>
          </div>
        </div>
      </header>

      <div data-cs-scroll style={{ flex: 1, overflowY: "auto", padding: "32px 16px 64px" }}>
        <div data-cs-root style={{ transformOrigin: "top center", transform: `scale(${zoom})`, transition: "transform 0.15s ease" }}>

          {/* ── Page 1 — Cover ── */}
          <Page minH={900}>
            <div data-cs-topbar style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 48px", borderBottom: `1px solid ${BORDER}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: BODY, letterSpacing: "0.12em", textTransform: "uppercase" }}>Alpine Due Diligence</span>
                <div style={{ width: 1, height: 16, background: BORDER }} />
                <span style={{ fontSize: 10, fontWeight: 500, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" }}>Learning Center · Case Study</span>
              </div>
              <span style={{ fontSize: 10, fontWeight: 500, color: MUTED, letterSpacing: "0.08em" }}>2026 Aug 13 · 9 AM</span>
            </div>

            <div data-cs-cover style={{ padding: "56px 48px 48px", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 36, padding: "5px 14px", border: `1px solid ${RISK}80`, borderRadius: 3, alignSelf: "flex-start" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: RISK, display: "inline-block" }} />
                <span style={{ fontSize: 9, fontWeight: 700, color: RISK, letterSpacing: "0.18em", textTransform: "uppercase" }}>Risk Reporting Integrity · Data Governance · Case Study</span>
              </div>
              <h1 data-cs-h1 style={{ fontSize: 46, fontWeight: 800, color: BODY, lineHeight: 1.07, letterSpacing: "-0.03em", margin: "0 0 8px" }}>The Allianz Structured Alpha Case</h1>
              <h2 data-cs-h2 style={{ fontSize: 27, fontWeight: 600, color: BODY, lineHeight: 1.2, letterSpacing: "-0.02em", margin: "0 0 32px" }}>How Altered Risk Reports Hid the Portfolios Investors Actually Owned</h2>
              <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.7, maxWidth: 580, marginBottom: 8 }}>
                A risk report is only evidence if the people it describes cannot edit it. Structured Alpha had stress tests, option Greeks, and performance records that looked precise, and portfolio managers who could change the numbers before investors saw them.
              </p>

              <StatBand>
                <div style={{ background: "#fff" }}><KeyStat value="17" kicker="Fund count" label="Private funds operating under the Structured Alpha strategy, serving about 114 institutional investors." /></div>
                <div style={{ background: "#fff" }}><KeyStat value="$11B" kicker="Peak AUM" label="Assets under management across the funds by December 2019." /></div>
                <div style={{ background: "#fff" }}><KeyStat value="$550M+" kicker="Investor fees" label="Fees paid by investors during the period examined by the SEC." /></div>
                <div style={{ background: "#fff" }}><KeyStat value="$403.7M" kicker="Allianz profit" label="Net profit Allianz retained after direct costs and revenue sharing." /></div>
              </StatBand>
              <SourceNote>Source: SEC Administrative Proceeding File No. 3-20855; Investment Advisers Act Release No. 6027, May 17, 2022.</SourceNote>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 26 }}>
                {["Risk Report Integrity", "Hedge Verification", "Data Governance", "Client Limit Reconciliation"].map((t) => (
                  <span key={t} style={{ fontSize: 9, fontWeight: 700, color: BODY, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 10px", border: `1px solid ${BORDER}`, borderRadius: 3, background: "#fafafa" }}>{t}</span>
                ))}
              </div>
            </div>

            <div data-cs-coverfoot style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 48px", borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase" }}>Alpine Due Diligence · The Allianz Structured Alpha Case</span>
              <span style={{ fontSize: 9, color: MUTED }}>01</span>
            </div>
          </Page>
          <Gap />

          {/* ── Page 2 — What it looked like + how it made money ── */}
          <Page>
            <div data-cs-body style={{ padding: "48px 48px 80px" }}>
              <Para mt={0}>
                Allianz Global Investors U.S. marketed Structured Alpha to pension plans, universities, charitable organisations, and other institutional investors. The strategy operated through 17 private funds and served about 114 investors. By December 2019 the funds held approximately $11 billion in assets under management. Investors paid more than $550 million in fees during the period later examined by the Securities and Exchange Commission.
              </Para>
              <Para>
                The funds carried the institutional features expected of a sophisticated investment product. A major global asset manager operated them. Experienced portfolio managers ran the trading strategy. An affiliated risk unit produced stress reports. Investors received performance records, option sensitivity measures, and descriptions of the positions intended to protect the portfolios during a market decline.
              </Para>
              <Para>
                These controls created an appearance of precision. The strategy used traded instruments with observable terms. Risk models calculated the effect of market shocks. Client agreements set return targets and risk limits. The portfolio team could explain its approach through strike prices, volatility assumptions, and option Greeks.
              </Para>
              <Callout>
                The later regulatory record showed that the live portfolios differed from the version described to investors. Protective options sat further from the market than marketing materials indicated. Certain client risk limits were not followed. Portfolio managers altered stress tests, performance records, and option sensitivity figures before investors received them. The funds carried one set of positions while investor reporting described a safer structure.
              </Callout>

            </div>
            <PageFooter page={2} />
          </Page>
          <Gap />

          {/* ── Page 3 — Return mechanics ── */}
          <Page>
            <div data-cs-body style={{ padding: "48px 48px 80px" }}>
              <div>
                <SectionHead title="How Structured Alpha Generated Returns" />
                <Para mt={0}>
                  Each Structured Alpha fund combined a base portfolio with an options strategy. Allianz called the base portfolio the beta component. Depending on the fund, the base exposure could consist of equities linked to the S&amp;P 500, Treasury instruments, or another portfolio selected by the investor.
                </Para>
                <Para>
                  The options strategy pursued an additional annual return known as the alpha target. A fund might combine S&amp;P 500 exposure with a target of five percent above the base return. Another fund might hold Treasury instruments while targeting ten percent through options.
                </Para>
                <Para>
                  Structured Alpha generated much of this additional return by selling put and call options. The fund collected premiums from option buyers. During stable markets, many of those options expired without requiring a large payment from the seller. The repeated premium income produced a steady return stream.
                </Para>
                <Para>
                  The risk changed as markets moved outside the expected range. A sold put option can create increasing losses as the underlying market falls. Rising volatility can increase the option&apos;s value at the same time, making the position more expensive to close. The fund may also face margin calls because brokers require additional collateral against the growing exposure.
                </Para>
                <Para>
                  Protective put options were intended to reduce these losses. A protective put gains value when the market falls toward and below its strike price. Its usefulness depends on the strike price, size, maturity, and relationship to the options sold by the fund.
                </Para>
                <Para>
                  A put positioned close to the current market begins responding during a smaller decline. A put positioned far below the market costs less, but offers limited protection until the decline becomes much larger. Hedge placement therefore affects both ordinary returns and crash losses. Cheaper protection improves performance during calm periods while leaving a wider range of losses unprotected.
                </Para>
              </div>
            </div>
            <PageFooter page={3} />
          </Page>
          <Gap />

          {/* ── Page 3 — The hedge gap ── */}
          <Page>
            <div data-cs-body style={{ padding: "48px 48px 80px" }}>
              <SectionHead title="The Hedge Structure Investors Were Shown" />
              <Para mt={0}>
                Allianz marketing materials described long put options with strikes positioned approximately 10 percent to 25 percent below the market. The materials said these positions were intended to protect the funds against a rapid market decline of roughly 10 percent to 15 percent over fewer than five days.
              </Para>
              <Para>
                That description gave investors a defined protection range. If the S&amp;P 500 fell sharply, the long puts would gain value and offset part of the losses from the options the funds had sold. The hedge ladder suggested that protection would begin responding before the market had fallen far enough to threaten most of the portfolio.
              </Para>
              <Para>
                The actual positions offered weaker protection. The SEC found that, beginning in February 2018, the strike prices of the tail risk hedges averaged approximately 30 percent to 50 percent below the market.
              </Para>
              <Para>
                A put positioned 40 percent below the market provides little immediate help during a decline of 15 percent or 20 percent. The short option positions can lose substantial value while the protective option remains far from its strike. The portfolio continues absorbing losses before the hedge begins to respond with force.
              </Para>
              <Para>
                The distant options also cost less. Lower hedge expenses left more premium income inside the funds and supported stronger reported returns during stable markets. This improved performance came from a portfolio carrying a larger unprotected loss range.
              </Para>

              <div style={{ marginTop: 30, padding: "22px 24px", border: `1px solid ${BORDER}`, borderRadius: 8, background: "#fdfdfc" }}>
                <EyebrowRow label="Hedge placement · stated vs actual" title="How far below the market the protection really sat" />
                {/* Axis runs 0 to 50 percent, so a distance d maps to d/50 of the track. */}
                <HedgeBar label="Materials shown to investors" rangeLabel="10% to 25% below market" leftPct={20} widthPct={30} />
                <HedgeBar label="Actual positions, from February 2018" rangeLabel="30% to 50% below market" leftPct={60} widthPct={40} accent />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 9, color: MUTED, letterSpacing: "0.06em" }}>
                  <span>0%</span><span>10%</span><span>20%</span><span>30%</span><span>40%</span><span>50%+ below market</span>
                </div>
                <SourceNote>Source: SEC Administrative Proceeding File No. 3-20855. Distances shown as approximate ranges per SEC findings.</SourceNote>
              </div>

              <Callout>
                Allianz did not maintain an effective independent process for comparing the hedge methodology in investor materials with live broker records. Portfolio managers controlled strike placement and operated with limited daily supervision. The fund documents described one protection range. The trading book contained another.
              </Callout>
            </div>
            <PageFooter page={4} />
          </Page>
          <Gap />

          {/* ── Page 4 — The VIX agreement ── */}
          <Page>
            <div data-cs-body style={{ padding: "48px 48px 80px" }}>
              <SectionHead title="The Largest Investor Negotiated Lower Risk" />
              <Para mt={0}>
                The largest Structured Alpha investor became concerned about downside exposure and negotiated a separate risk reduction program. The investor administered retirement plans governed by United States pension law and had committed substantial capital to the strategy.
              </Para>
              <Para>
                The agreement linked the funds&apos; alpha targets to the VIX, a measure of expected market volatility. Lower volatility required a lower alpha target. A lower target reduced the amount of option premium the portfolio needed to collect and allowed the managers to take less risk. Higher volatility permitted a higher target.
              </Para>
              <Para>
                During periods when the VIX stood below 15, certain agreed alpha targets ranged from 2.5 percent to 4 percent. Higher VIX levels permitted larger targets. The structure was designed to adjust portfolio risk as market conditions changed.
              </Para>
              <Para>
                The portfolio team did not consistently follow the agreement. During 2018 and 2019, actual alpha targets for some equity based funds were often 40 percent to 50 percent higher than the levels reported to the investor.
              </Para>
              <Para>
                Higher targets required the portfolio to seek more option income. That generally meant selling more options, accepting greater exposure, or reducing the cost of protection. The investor received reports showing the agreed settings while the funds operated at higher levels.
              </Para>
              <Callout>
                The control failure involved reconciliation. Allianz had the client agreement and the trading records, but lacked an effective process that compared them. A client limit remained inside a document while the live portfolio moved beyond it.
              </Callout>

            </div>
            <PageFooter page={5} />
          </Page>
          <Gap />

          {/* ── Page 7 — Stress tests altered ── */}
          <Page>
            <div data-cs-body style={{ padding: "48px 48px 80px" }}>
              <div>
                <SectionHead title="Stress Tests Were Altered Before Delivery" />
                <Para mt={0}>
                  An Allianz affiliate called IDS GmbH produced risk reports for Structured Alpha. Allianz described the affiliate as supporting an independent risk management function.
                </Para>
                <Para>
                  The reports modelled how the funds might perform under adverse conditions. One scenario assumed a 20 percent fall in the S&amp;P 500 combined with a 300 percent increase in implied volatility. The scenario resembled the market conditions surrounding the October 1987 crash.
                </Para>
                <Para>
                  This combination created severe pressure for the strategy. Falling equity prices increased losses on sold puts. Rising volatility increased the market value of those options and the cost of closing them. The stress test measured the interaction between market direction and option pricing.
                </Para>
                <Para>
                  Some original reports projected substantial losses. Portfolio managers changed the figures before sending them to investors. The SEC identified more than 200 data alterations across risk reports and found that at least 87 altered reports reached investors or prospective investors.
                </Para>
              </div>
            </div>
            <PageFooter page={6} />
          </Page>
          <Gap />

          {/* ── Page 5 — The altered numbers ── */}
          <Page>
            <div data-cs-body style={{ padding: "48px 48px 80px" }}>
              <div style={{ padding: "22px 24px", border: `1px solid ${BORDER}`, borderRadius: 8, background: "#fdfdfc" }}>
                <EyebrowRow label="What changed before delivery · documented examples" title="Original figures versus what investors received" />
                <AlteredRow origLabel="Original stress test" orig="−25.74%" sentLabel="Sent to investors" sent="−9.74%" note="Projected loss under the crash scenario" />
                <AlteredRow origLabel="Original stress test" orig="−42.15%" sentLabel="Sent to investors" sent="−4.15%" note="Projected loss, one digit dropped" />
                <AlteredRow origLabel="Original daily record" orig="−18.26%" sentLabel="Sent to investors" sent="−9.26%" note="Daily loss during a stress period" />
                <AlteredRow origLabel="Original daily record" orig="+8.37%" sentLabel="Sent to investors" sent="+1.27%" note="Recovery gain shortly after" />
                <AlteredRow origLabel="Original delta" orig="83.6%" sentLabel="Sent to investors" sent="52.6%" note="Option sensitivity to market moves" last />
                <SourceNote>The SEC identified more than 200 data alterations across risk reports. At least 87 altered reports and at least 124 reports with altered Greeks reached investors or prospective investors. Source: SEC Administrative Proceeding File No. 3-20855.</SourceNote>
              </div>

              <Para>
                The risk system had produced results reflecting the live portfolio. The portfolio team controlled the final document delivered outside the firm. The independent calculation lost its value once the subject of the report could replace the output.
              </Para>
              <Para>
                A controlled process would have distributed the risk report directly from the risk function. Portfolio managers could have added commentary or explained assumptions, but they should not have been able to edit the underlying results. Version histories, access logs, and approval records would have shown whether the final report matched the original system output.
              </Para>

            </div>
            <PageFooter page={7} />
          </Page>
          <Gap />

          {/* ── Page 9 — Performance history + Greeks ── */}
          <Page>
            <div data-cs-body style={{ padding: "48px 48px 80px" }}>
              <div>
                <SectionHead title="Performance History and Option Sensitivities" />
                <Para mt={0}>
                  Investors requested daily performance records to study how Structured Alpha had behaved during earlier periods of market stress. The portfolio managers altered some of those records. A daily loss of approximately 18.26 percent became 9.26 percent. A gain of approximately 8.37 percent shortly afterward became 1.27 percent.
                </Para>
                <Para>
                  Reducing both numbers made the strategy appear less volatile. The edited history showed a smaller decline and a smaller recovery. An investor reviewing the series would see a portfolio that moved with greater stability during stress.
                </Para>
                <Para>
                  Historical performance provides evidence about how a strategy behaved in the past. Investors also used option Greeks to assess how the current portfolio might behave in the future. Delta measures how much the value of an option position is expected to change as the underlying market moves. Vega measures sensitivity to changes in implied volatility. Gamma measures how rapidly delta changes. These figures were central to Structured Alpha because the funds carried exposure to both falling equity prices and rising volatility.
                </Para>
                <Para>
                  The SEC found that portfolio managers reduced reported deltas. In one example, a delta of approximately 83.6 percent became 52.6 percent. At least 124 reports containing altered Greeks reached investors or prospective investors.
                </Para>
                <Callout>
                  The changes affected two separate views of risk. Altered historical returns reduced the volatility investors saw in earlier periods. Altered Greeks reduced the sensitivity shown in the current positions. Both sets of records pointed investors toward a safer conclusion than the trading book supported.
                </Callout>
              </div>
            </div>
            <PageFooter page={8} />
          </Page>
          <Gap />

          {/* ── Page 6 — Technical presentations + capacity ── */}
          <Page>
            <div data-cs-body style={{ padding: "48px 48px 80px" }}>
              <SectionHead title="Technical Presentations Used Altered Inputs" />
              <Para mt={0}>
                Structured Alpha managers used expected value sheets during investor meetings. These spreadsheets illustrated potential gains and losses under different market conditions. The files gave investors a detailed view of how the strategy might respond as market prices and volatility changed.
              </Para>
              <Para>
                The SEC found that managers altered these calculations to reduce projected losses. In one example, an expected loss of approximately $4.79 million became about $718,000 after the figure was multiplied by 0.15. A manager also prepared password protected instructions explaining how to modify the files without attracting investor attention.
              </Para>
              <Para>
                Position data received similar treatment. In one investor presentation, the reported strike price of a protective option increased from 1,625 to 2,225. The change made the hedge appear approximately 25 percent below the market rather than about 45 percent below it. The actual option remained at the original strike. The presentation therefore showed a protective position that did not match the position recorded in the trading book.
              </Para>
              <Para>
                Technical materials can create confidence because the numbers appear specific. Strike prices, scenario results, and Greek values look less subjective than ordinary marketing language. Their reliability still depends on source records and controlled data movement.
              </Para>

              <div style={{ marginTop: 26, padding: "22px 24px", border: `1px solid ${BORDER}`, borderRadius: 8, background: "#fdfdfc" }}>
                <EyebrowRow label="Technical presentation · a documented example" title="Two inputs, altered before the investor meeting" />
                <AlteredRow origLabel="Expected value model" orig="$4.79M" sentLabel="Shown to investors" sent="$718K" note="Projected loss, before adjustment" />
                <AlteredRow origLabel="Actual protective strike" orig="1,625" sentLabel="Investor presentation" sent="2,225" note="About 45 percent below market, the real position" last />
                <SourceNote>A manager also prepared password protected instructions explaining how to modify the files without attracting investor attention. Source: SEC Administrative Proceeding File No. 3-20855.</SourceNote>
              </div>

            </div>
            <PageFooter page={9} />
          </Page>
          <Gap />

          {/* ── Page 11 — Capacity ── */}
          <Page>
            <div data-cs-body style={{ padding: "48px 48px 80px" }}>
              <div>
                <SectionHead title="Capacity Exceeded the Stated Limit" />
                <Para mt={0}>
                  Allianz told investors that certain Structured Alpha funds had a capacity limit of $9 billion. The limit was relevant because an options strategy becomes harder to manage as the book grows.
                </Para>
                <Para>
                  A larger fund must sell and hedge more contracts. During stable markets, the portfolio may execute those trades without difficulty. During stress, market depth can decline while demand for protection rises. The fund may struggle to purchase hedges or close short positions without moving prices against itself.
                </Para>
                <Para>
                  The SEC found that Structured Alpha exceeded the stated capacity limit by more than $3 billion, with capacity use passing $12 billion by December 2019. Capacity use and reported fund assets are separate measures, and the portfolio team also altered some of the inputs used to calculate capacity.
                </Para>
                <Para>
                  The additional assets increased the fee base and expanded the options book. They also increased the volume of positions that might need to be hedged, rolled, or closed during a market shock.
                </Para>
                <Callout>
                  Capacity should have been calculated through a stable method controlled by an independent risk function. A breach should have stopped new subscriptions or required the portfolio to reduce exposure. Structured Alpha allowed the portfolio team to influence both the trading book and the calculation used to decide whether the book had become too large.
                </Callout>
              </div>
            </div>
            <PageFooter page={10} />
          </Page>
          <Gap />

          {/* ── Page 7 — Incentives + March 2020 ── */}
          <Page>
            <div data-cs-body style={{ padding: "48px 48px 80px" }}>
              <SectionHead title="Incentives and Control Concentration" />
              <Para mt={0}>
                Structured Alpha generated more than $550 million in fees during the period examined by the SEC. Allianz retained approximately $403.7 million in net profit after direct costs and revenue sharing.
              </Para>
              <Para>
                The portfolio team&apos;s compensation depended in part on strategy performance. Higher alpha targets increased the amount of premium income the funds attempted to collect. Distant hedges reduced current expenses. Additional assets increased the capital base producing fees.
              </Para>
              <Para>
                These incentives required independent supervision over risk limits, hedge placement, and investor reporting. Instead, senior portfolio managers controlled much of the process.
              </Para>
              <Para>
                Gregoire Tournant served as chief investment officer of the Structured Products Group and lead portfolio manager. Trevor Taylor served as co-lead portfolio manager, and Stephen Bond-Nelson served as a portfolio manager. The team managed the positions, communicated with investors, and influenced the information used to describe portfolio risk.
              </Para>
              <Callout>
                Allianz had risk, compliance, and investor relations functions, but the reporting path left the portfolio team with the ability to edit key documents. The people responsible for producing returns also controlled much of the evidence used to explain the risks taken to produce them.
              </Callout>

            </div>
            <PageFooter page={11} />
          </Page>
          <Gap />

          {/* ── Page 13 — March 2020 ── */}
          <Page>
            <div data-cs-body style={{ padding: "48px 48px 80px" }}>
              <div>
                <SectionHead title="March 2020 Exposed the Trading Book" />
                <Para mt={0}>
                  Equity markets fell sharply in March 2020 as the pandemic disrupted global economic activity. Implied volatility rose at the same time.
                </Para>
                <Para>
                  Structured Alpha had modelled a similar combination in its stress tests. The original reports had shown that a sharp equity decline and a large volatility increase could create severe losses.
                </Para>
                <Para>
                  The funds entered this period with protective puts positioned further below the market than investors had been told. Some portfolios carried alpha targets above agreed levels. The strategy had exceeded its stated capacity.
                </Para>
                <Para>
                  The funds lost more than $7 billion in market value, including over $3.2 billion in investor principal. They faced margin calls and redemption requests before Allianz shut them down.
                </Para>
                <Para>
                  The losses followed the mechanics of the live portfolio. Sold options moved against the funds as equity prices fell. Rising volatility increased the cost of closing or hedging those positions. Protective options placed far below the market did not provide the level of early protection described in investor materials.
                </Para>
                <Callout>
                  The market decline revealed the difference between the trading records and the reporting package. The risk reports had not caused the losses. They had prevented investors from seeing the exposure that produced them.
                </Callout>

                <StatBand>
                  <div style={{ background: "#fff" }}><KeyStat value="$7B+" kicker="Market value lost" label="Total market value lost across the funds as the pandemic decline hit." /></div>
                  <div style={{ background: "#fff" }}><KeyStat value="$3.2B+" kicker="Investor principal" label="Of that loss, the portion representing investor principal rather than paper value." /></div>
                  <div style={{ background: "#fff" }}><KeyStat value="30-50%" kicker="Hedge gap" label="Actual hedge distance below market, against the 10 to 25 percent investors were told." /></div>
                  <div style={{ background: "#fff" }}><KeyStat value="Shut" kicker="Outcome" label="Allianz closed the funds following margin calls and redemption requests." /></div>
                </StatBand>
                <SourceNote>Sources: DOJ Southern District of New York press release, June 7, 2024; SEC Administrative Proceeding File No. 3-20855.</SourceNote>
              </div>
            </div>
            <PageFooter page={12} />
          </Page>
          <Gap />

          {/* ── Page 8 — What ODD would reconcile ── */}
          <Page>
            <div data-cs-body style={{ padding: "48px 48px 80px" }}>
              <SectionHead title="The Records That Could Have Shown the Difference" />
              <Para mt={0}>
                The core facts were available in independent records. Prime broker and clearing broker files would have shown each option&apos;s strike, maturity, quantity, type, and underlying index. Comparing those records with marketing materials would have identified the difference between the stated hedge ladder and actual positions.
              </Para>
              <Para>
                The original IDS risk reports could have been obtained directly from the risk function. Comparison with the versions sent to investors would have shown the changed loss estimates. File metadata and system access histories could have identified the users who made the alterations.
              </Para>
              <Para>
                The largest investor&apos;s VIX agreement could have been reconciled each month with the alpha target used in the portfolio. Daily returns could have been checked against fund administrator records. Greeks could have been recalculated from independently obtained position data.
              </Para>
              <Para>
                Capacity required a fixed formula with controlled inputs. Risk staff needed authority to stop new capital once the limit was reached. Investor reporting needed approval from functions outside the portfolio management team.
              </Para>
              <Callout>
                The strategy involved complex derivatives, but the evidence fields were specific. Strike prices, maturities, quantities, risk outputs, client limits, and administrator returns could all be matched against external or independently controlled records.
              </Callout>

            </div>
            <PageFooter page={13} />
          </Page>
          <Gap />

          {/* ── Page 15 — ODD framework ── */}
          <Page>
            <div data-cs-body style={{ padding: "48px 48px 80px" }}>
              <div style={{ padding: "24px 26px", border: `1px solid ${BORDER}`, borderRadius: 8, background: "#fdfdfc" }}>
                <EyebrowRow label="ODD framework · verifying against independent sources" title="What a structured review would reconcile directly" />
                <Numbered n={1} title="Prime broker and clearing broker files" body="Each option's strike, maturity, quantity, type, and underlying index, compared directly against the hedge structure described in marketing materials." />
                <Numbered n={2} title="Original risk reports, sourced from the risk function" body="Obtained from the risk unit rather than the portfolio team. File metadata and access histories can identify who altered a report and when." />
                <Numbered n={3} title="Client risk agreements, reconciled monthly" body="The negotiated VIX linked alpha target checked against the alpha target actually used in the live portfolio." />
                <Numbered n={4} title="Daily returns against fund administrator records" body="Greeks independently recalculated from position data obtained outside the portfolio team." />
                <Numbered n={5} title="Capacity, calculated through a fixed formula" body="Controlled inputs, with independent risk staff holding authority to halt new subscriptions once a limit is reached." />
              </div>

              <div style={{ marginTop: 26, display: "flex", gap: 10, flexWrap: "wrap" }} data-cs-chain>
                <ChainBox head="Risk system output" body="Reflects the live trading book" />
                <ChainBox head="Portfolio team" body="Held edit rights over the final document" accent />
                <ChainBox head="Investor package" body="Described a safer structure" />
                <ChainBox head="March 2020" body="The market reconciled the two" accent />
              </div>
            </div>
            <PageFooter page={14} />
          </Page>
          <Gap />

          {/* ── Page 9 — Outcome + disclaimer ── */}
          <Page minH={820}>
            <div data-cs-body style={{ padding: "48px 48px 80px" }}>
              <SectionHead title="Legal and Financial Outcome" />
              <Para mt={0}>
                Allianz Global Investors U.S. pleaded guilty to securities fraud in May 2022. A federal court sentenced the firm in July 2023.
              </Para>
              <Para>
                The financial penalties included more than $463 million in forfeiture, more than $3.23 billion in restitution, and more than $2.33 billion in fines. Allianz also compensated investors through civil settlements exceeding $5 billion.
              </Para>
              <Para>
                The SEC resolution included a $675 million civil penalty. Allianz Global Investors U.S. also became disqualified from providing advisory services to United States registered investment funds for ten years.
              </Para>
              <Para>
                Trevor Taylor and Stephen Bond-Nelson pleaded guilty in March 2022. Gregoire Tournant pleaded guilty to two counts of investment adviser fraud in June 2024 and agreed to forfeit approximately $17 million in compensation connected to the conduct.
              </Para>
              <Para>
                In November 2025, the SEC obtained final judgments against the three former portfolio managers. The judgments included permanent industry restrictions and disgorgement orders. The parallel criminal cases resulted in probation, home confinement in certain cases, fines, and forfeiture.
              </Para>

              <StatBand>
                <div style={{ background: "#fff" }}><KeyStat value="$463M+" kicker="May 2022 / Jul 2023" label="Forfeiture ordered against Allianz Global Investors U.S." /></div>
                <div style={{ background: "#fff" }}><KeyStat value="$3.23B+" kicker="Jul 2023" label="Restitution ordered, plus more than $2.33 billion in fines." /></div>
                <div style={{ background: "#fff" }}><KeyStat value="$5B+" kicker="Civil resolution" label="Civil settlements compensating investors, plus a $675 million SEC civil penalty." /></div>
                <div style={{ background: "#fff" }}><KeyStat value="10 yrs" kicker="Disqualification" label="Allianz disqualified from advising U.S. registered investment funds. Final judgments against three portfolio managers, November 2025." /></div>
              </StatBand>
              <SourceNote>Sources: DOJ Southern District of New York press releases, May 17 2022, July 12 2023, and June 7 2024; SEC Administrative Proceeding File No. 3-20855; SEC Litigation Release No. 26432, December 5, 2025.</SourceNote>

            </div>
            <PageFooter page={15} />
          </Page>
          <Gap />

          {/* ── Page 17 — Closing + disclaimer ── */}
          <Page minH={700}>
            <div data-cs-body style={{ padding: "48px 48px 80px" }}>
              <Para mt={0}>
                The proceedings documented a failure that extended across portfolio construction, risk reporting, and firm supervision. The protective positions did not match the hedge structure described to investors. Agreed client limits did not match actual portfolio settings. Original risk calculations did not match the reports investors received.
              </Para>
              <Para>
                Structured Alpha had formal risk systems and detailed investor reporting. Portfolio managers could alter the information after the systems produced it. That control gap allowed the funds&apos; reported risk profile to separate from the positions that generated returns and, in March 2020, generated the losses.
              </Para>

              <div style={{ marginTop: 34, paddingTop: 22, borderTop: `1px solid ${BORDER}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/alpine-logo-dark.svg?v=5" alt="Alpine Due Diligence" style={{ height: 26, width: "auto" }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: "0.14em", textTransform: "uppercase" }}>Learning Center</span>
                </div>
                <div style={{ borderLeft: `3px solid ${BORDER}`, paddingLeft: 16 }}>
                  <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.65, margin: 0, fontStyle: "italic" }}>
                    This case study is published for educational purposes and draws solely on the public record, including SEC Administrative Proceeding File No. 3-20855, SEC Litigation Release No. 26432, and related Department of Justice releases. Allianz Global Investors U.S. pleaded guilty to securities fraud, and the three former portfolio managers named here pleaded guilty to criminal charges and consented to final judgments; the descriptions above reflect those resolved proceedings and the findings recorded in them. Nothing here is legal, compliance, or investment advice, and Alpine takes no position on any matter that remains open. Alpine combines structured analysis with senior analyst review to support, not replace, institutional judgment.
                  </p>
                </div>
              </div>
            </div>
            <PageFooter page={16} />
          </Page>

        </div>
      </div>

      <FloatingSubscribe source="allianz-case" />
    </div>
  );
}
