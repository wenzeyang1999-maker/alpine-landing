"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { GREEN, AMBER, VIOLET } from "@/lib/constants";
import FloatingSubscribe from "@/components/FloatingSubscribe";

// ── Design tokens (PDF palette — petrol-teal accent on deep teal-navy) ───────
const BODY    = "#17323b";   // deep teal-navy — PDF headings & wordmark
const MUTED   = "#4a5568";
const GOLD    = "#1f6e78";   // accent (kept name): section rules, eyebrow labels, timeline dots
const BORDER  = "#ddd8cf";
const RISK    = "#1f6e78";   // petrol-teal accent: stat numbers, eyebrows, callouts, findings
const RISK_BG = "#edf4f5";   // faint teal tint
const DANGER  = "#b5361c";   // reserved for the "illiquid" segment in the portfolio diagram

// ── Shared building blocks ───────────────────────────────────────────────────
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

function PageFooter({ page }: { page: number }) {
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
        Alpine Due Diligence · The Woodford Case
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
    <div style={{ margin: "24px 0", padding: "16px 20px", background: RISK_BG, borderLeft: `3px solid ${RISK}`, borderRadius: "0 6px 6px 0" }}>
      <p style={{ fontSize: 13.5, color: RISK, lineHeight: 1.65, margin: 0, fontStyle: "italic" }}>
        {children}
      </p>
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
      <div style={{ fontSize: 9, fontWeight: 700, color: GOLD, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8 }}>
        {label}
      </div>
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

function Finding({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 12, padding: "14px 16px", background: "#fafafa", border: `1px solid ${BORDER}`, borderRadius: 6 }}>
      <span style={{ color: RISK, fontSize: 13, flexShrink: 0, lineHeight: 1.5 }}>▲</span>
      <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>{children}</div>
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
  return (
    <p style={{ fontSize: 10.5, color: MUTED, fontStyle: "italic", lineHeight: 1.5, marginTop: 18, marginBottom: 0 }}>
      {children}
    </p>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function WoodfordView() {
  const router = useRouter();
  const [zoom, setZoom] = useState(1);
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
            <a data-cs-download-btn href="/woodford-fund.pdf" target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 6, background: "#0f0f10", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none", flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
              </svg>
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
              <span style={{ fontSize: 10, fontWeight: 500, color: MUTED, letterSpacing: "0.08em" }}>2026 Jun 18 · 9 AM</span>
            </div>

            <div style={{ padding: "56px 48px 48px", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 36, padding: "5px 14px", border: `1px solid ${RISK}80`, borderRadius: 3, alignSelf: "flex-start" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: RISK, display: "inline-block" }} />
                <span style={{ fontSize: 9, fontWeight: 700, color: RISK, letterSpacing: "0.18em", textTransform: "uppercase" }}>ODD Case Study</span>
              </div>

              <h1 style={{ fontSize: 48, fontWeight: 800, color: BODY, lineHeight: 1.06, letterSpacing: "-0.03em", margin: "0 0 8px" }}>
                The Woodford Equity Income Fund Case
              </h1>
              <h2 style={{ fontSize: 28, fontWeight: 600, color: BODY, lineHeight: 1.2, letterSpacing: "-0.02em", margin: "0 0 32px" }}>
                When Liquidity Became the Risk
              </h2>

              <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.7, maxWidth: 560, marginBottom: 40 }}>
                The fund had a label, a governance structure, a published NAV, and a famous manager. None of those things created liquidity when investors needed cash. This is a study in what structured fund review is designed to catch before the gate comes down.
              </p>

              {/* Key stats — the scale of the failure before suspension */}
              <div data-cs-statband style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: BORDER, border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", marginBottom: 40 }}>
                <div style={{ background: "#fff" }}><KeyStat value="£10.1B" kicker="Peak AUM" label="Fund value at peak, May 2017, before two years of outflows and deterioration." /></div>
                <div style={{ background: "#fff" }}><KeyStat value="£4.3B" kicker="Outflows" label="Total redemptions between May 2017 and suspension, per FCA letter to the Treasury Committee." /></div>
                <div style={{ background: "#fff" }}><KeyStat value="8%" kicker="Liquidity at gate" label="Share of investments sellable within seven days at suspension, against a four-day access expectation." /></div>
                <div style={{ background: "#fff" }}><KeyStat value="£296M" kicker="Final trigger" label="Redemption requests 31 May–3 Jun 2019, equal to 8.2% of NAV. No cash held; overdraft already drawn." /></div>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["Liquidity Risk", "Fund Governance", "Valuation", "Product Design"].map((t) => (
                  <span key={t} style={{ fontSize: 9, fontWeight: 700, color: BODY, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 10px", border: `1px solid ${BORDER}`, borderRadius: 3, background: "#fafafa" }}>{t}</span>
                ))}
              </div>
            </div>

            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 48px", borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase" }}>Alpine Due Diligence · The Woodford Case</span>
              <span style={{ fontSize: 9, color: MUTED }}>01</span>
            </div>
          </Page>
          <Gap />

          {/* ── Page 2 — Intro + Liquidity Promise ── */}
          <Page>
            <div style={{ padding: "48px 48px 80px" }}>
              <Para mt={0}>
                Neil Woodford entered the Woodford Equity Income Fund story with the advantage of trust that most managers spend a career trying to build. He was a familiar name in UK fund management, followed by retail platforms, advisers and ordinary savers who had learned to associate him with patient stock selection and income investing. The fund itself looked straightforward: a UK equity income strategy, managed by a recognised stock picker, inside a structure that let investors ask for their money back under normal dealing terms.
              </Para>
              <Para>
                That combination carried a quiet assumption. Investors treated the fund as a liquid product. The label did a lot of work — &quot;equity income&quot; suggested listed shares, dividends, portfolio discipline and enough market depth to support withdrawals. It did not suggest a structure where a growing share of the portfolio would become difficult to sell under pressure.
              </Para>
              <Para>
                The problem developed inside that gap. The fund still carried the outer form of a redeemable retail fund, while the assets inside moved toward smaller, less liquid and harder-to-value holdings. For a period, that tension could sit in the background. It became visible when investors wanted cash at the same time.
              </Para>

              <div style={{ marginTop: 36 }}>
                <SectionHead title="The Liquidity Promise" />
                <Para mt={0}>
                  The fund was expected to manage liquidity so investors could redeem and be repaid. The FCA later said the fund&apos;s value had fallen from more than £10.1 billion in May 2017 to £3.6 billion before its suspension in June 2019. During the same period, withdrawals continued and the fund&apos;s liquidity profile deteriorated. By the time of suspension, only 8 percent of the fund&apos;s investments could be sold within seven days, while rules then in place expected investors to access their money within four days.
                </Para>
                <Para>
                  That detail explains the case better than any phrase about scandal. The fund offered a redemption promise that depended on assets being convertible into cash. The portfolio no longer supported that promise with enough margin for stress. Once redemptions accelerated, the fund could either sell assets at poor prices, leave remaining investors with a worse portfolio, or suspend dealing.
                </Para>
                <Para>
                  The suspension came on 3 June 2019. Link Fund Solutions, the authorised corporate director, suspended dealings after increased redemptions. The FCA later said the suspension was designed to protect investors from forced sales, because selling assets quickly to meet withdrawals could have harmed values and reduced the amount recovered.
                </Para>
                <Callout>
                  The logic of the suspension was clear. The implications were harsher. Investors who thought they owned a liquid fund suddenly owned a position they could not exit.
                </Callout>
              </div>
            </div>
            <PageFooter page={2} />
          </Page>
          <Gap />

          {/* ── Page 3 — The Run Before the Gate + Chronology ── */}
          <Page>
            <div style={{ padding: "48px 48px 80px" }}>
              <SectionHead title="The Run Before the Gate" />
              <Para mt={0}>
                The final pressure was not a surprise that arrived in a single afternoon. The fund had been shrinking for two years. In a June 2019 letter to the Treasury Committee, the FCA said the fund had experienced redemptions of about £4.3 billion since May 2017, while negative performance further reduced assets under management. During May 2019, net outflows averaged one percent of net asset value per week. Then redemption requests on 31 May and 3 June reached £296 million, equal to 8.2 percent of net asset value. The fund held no cash at the time and had previously drawn on an overdraft facility.
              </Para>

              <div style={{ marginTop: 32, marginBottom: 28 }}>
                <EyebrowRow label="Chronology · Deterioration before suspension" title="The gate did not arrive suddenly" />
                <div style={{ marginTop: 20 }}>
                  <TimelineRow date="May 2017" head="Peak AUM: £10.1 billion" body="Fund at its largest. Redemption terms offered daily dealing to a large retail investor base." />
                  <TimelineRow date="2017–2018" head="Sustained outflows begin" body="Approximately £4.3 billion in net redemptions over two years. FCA later finds portfolio liquidity deteriorated throughout this period." />
                  <TimelineRow date="Jul 2018" head="FCA accountability window opens" body="The period from which the FCA later holds Link and Woodford accountable for liquidity-management failures begins." />
                  <TimelineRow date="May 2019" head="Outflows reach 1% of NAV per week" body="Fund holds no cash. Overdraft already drawn. Portfolio liquid only to 8% within seven days." />
                  <TimelineRow date="31 May–3 Jun 2019" head="£296 million in two-day redemptions" body="Equal to 8.2% of NAV. Suspension announced 3 June. Investors in a daily-dealing fund can no longer exit." />
                  <TimelineRow date="Apr 2024" head="FCA findings against Link published" body="FCA concludes Link failed to act with due skill, care and diligence. A £230 million redress scheme approved by the High Court." />
                  <TimelineRow date="Aug 2025" head="FCA decision against Woodford" body="FCA decides to fine Woodford £5,888,800 and Woodford Investment Management £40,000,000. Both referred to the Upper Tribunal; findings remain provisional pending that process." last />
                </div>
                <SourceNote>Sources: FCA Decision Notices (Link, April 2024; Woodford, August 2025); FCA letter to the Treasury Committee, June 2019.</SourceNote>
              </div>

              <Para>
                This is how liquidity failures often work. The first wave of investors leaves through the front door. The fund sells what it can sell. The remaining portfolio becomes harder to liquidate. The next wave faces a narrower exit. At some point, the same redemption right exists on paper, while the practical ability to meet it has weakened.
              </Para>
              <Para>
                The FCA later concluded that Woodford Investment Management and Woodford did not respond appropriately as the fund declined, liquidity worsened and more investors withdrew. It said this disadvantaged investors who stayed compared with those who exited before suspension. That finding turns the story away from personality and toward structure: a fund can treat investors unequally even without intending to select favourites. The portfolio mechanics do the allocation.
              </Para>
            </div>
            <PageFooter page={3} />
          </Page>
          <Gap />

          {/* ── Page 4 — Portfolio drift + Valuation ── */}
          <Page>
            <div style={{ padding: "48px 48px 80px" }}>
              <SectionHead title="Portfolio Drift Became Structural Risk" />
              <Para mt={0}>
                Equity income products carry expectations: income generation, exposure to listed equities and a portfolio that can support dealing terms. A manager can still hold smaller companies and selective long-term positions, but the total portfolio has to remain consistent with the product&apos;s promise. Woodford&apos;s fund moved away from that — it held a mix of large listed companies, smaller public companies and unquoted or less easily sold assets.
              </Para>
              <Para>
                A hard-to-sell company can belong in the right vehicle. Patient capital, closed structures and long lockups exist for that reason. The same asset can create risk inside a fund that promises quicker access to cash. Liquidity is not only an attribute of the asset. It is a relationship between the asset, the fund terms, the investor base and market conditions.
              </Para>

              <div style={{ margin: "26px 0", padding: "20px 22px", background: "#fafafa", border: `1px solid ${BORDER}`, borderRadius: 8 }}>
                <EyebrowRow label="Portfolio structure · The mismatch that built over time" title="What daily-dealing terms require vs. what the portfolio held" />
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: BODY, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>What daily dealing requires</div>
                  <div style={{ height: 22, borderRadius: 4, overflow: "hidden", display: "flex", border: `1px solid ${BORDER}` }}>
                    <div style={{ flex: 80, background: GREEN }} />
                    <div style={{ flex: 16, background: AMBER }} />
                    <div style={{ flex: 4, background: DANGER }} />
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: BODY, letterSpacing: "0.1em", textTransform: "uppercase", margin: "16px 0 6px" }}>What the portfolio held</div>
                  <div style={{ height: 22, borderRadius: 4, overflow: "hidden", display: "flex", border: `1px solid ${BORDER}` }}>
                    <div style={{ flex: 40, background: GREEN }} />
                    <div style={{ flex: 30, background: AMBER }} />
                    <div style={{ flex: 30, background: DANGER }} />
                  </div>
                  <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
                    {[["Highly liquid listed", GREEN], ["Smaller public", AMBER], ["Unquoted & illiquid", DANGER]].map(([t, c]) => (
                      <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: MUTED }}>
                        <span style={{ width: 10, height: 10, borderRadius: 2, background: c as string }} />{t}
                      </span>
                    ))}
                  </div>
                </div>
                <SourceNote>Illustrative representation of portfolio-composition drift based on FCA findings. Exact weights are not publicly itemised; the diagram reflects the qualitative shift described in regulatory materials.</SourceNote>
              </div>

              <Para>
                In Woodford, that relationship broke down. The fund was large enough that selling smaller holdings without affecting price became difficult. Redemptions made it worse: selling liquid names to meet withdrawals increased the relative weight of harder-to-sell positions. The fund&apos;s identity drifted while the dealing terms remained in place.
              </Para>

              <div style={{ marginTop: 36 }}>
                <SectionHead title="Valuation and the Illiquid Tail" />
                <Para mt={0}>
                  Valuation sits next to liquidity because hard-to-sell assets are also harder to price with confidence. A quoted price can still be thin. A model can still rely on assumptions. A recent financing round can become stale. The FCA&apos;s June 2019 letter made a technical point that deserves a wider audience: securities listed on an eligible market are not automatically liquid. The letter referred to concerns around stocks listed on The International Stock Exchange and sought information from Link about risk management, stress testing and plans to reduce exposure to unquoted securities.
                </Para>
                <Para>
                  A security may have a listing, a price and a regulatory classification. Those facts do not prove there will be a real buyer at a reliable price when a large fund needs cash. The test that matters is behavioural: how much can be sold, how quickly, at what discount, and with what effect on the remaining portfolio? If an asset is valued at a level the fund cannot realise during stress, investors may mistake accounting value for exit value — a mistake that becomes expensive when withdrawals start.
                </Para>
              </div>
            </div>
            <PageFooter page={4} />
          </Page>
          <Gap />

          {/* ── Page 5 — Oversight + Aftermath ── */}
          <Page>
            <div style={{ padding: "48px 48px 80px" }}>
              <SectionHead title="Oversight Missed the Mismatch" />
              <Para mt={0}>
                The fund did not operate without external roles. Link Fund Solutions acted as authorised corporate director. Northern Trust Global Services acted as depositary. The framework existed. The failure came from how that framework responded to deterioration.
              </Para>

              <div style={{ margin: "26px 0" }}>
                <EyebrowRow label="Governance failure · FCA findings" title="What oversight was expected to do, but did not" />
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
                  <Finding>Link failed to manage liquidity so investors could access money at short notice, between July 2018 and suspension, per FCA April 2024 findings.</Finding>
                  <Finding>Link did not sufficiently oversee Woodford Investment Management or ensure liquidity concerns were acted on, despite deterioration spanning multiple reporting periods.</Finding>
                  <Finding>Woodford held a defective understanding of his responsibilities, including oversight of fund liquidity and the relationship with the authorised corporate director, per FCA August 2025 decision.</Finding>
                  <Finding>The FCA found unreasonable investment decisions: between July 2018 and June 2019, liquid investments were disproportionately sold while less liquid ones were purchased.</Finding>
                </div>
                <SourceNote>FCA Decision Notice against Link Fund Solutions, April 2024. FCA Decision Notice against Woodford and Woodford Investment Management, August 2025. The August 2025 findings remain provisional pending Upper Tribunal proceedings.</SourceNote>
              </div>

              <Para>
                The oversight lesson is direct. A governance structure has limited value if it records concern without forcing action. Liquidity management needs authority, data and escalation. It must have the power to change portfolio behaviour before the mismatch reaches the point of suspension. The authorised corporate director structure should have provided challenge. The FCA&apos;s findings suggest the challenge did not work in time.
              </Para>

              <div style={{ marginTop: 36 }}>
                <SectionHead title="The Regulatory Aftermath" />
                <Para mt={0}>
                  In August 2025, the FCA decided to fine Woodford £5,888,800 and ban him from holding senior manager roles and managing funds for retail investors. It also decided to fine Woodford Investment Management £40,000,000. Woodford and the firm referred the Decision Notices to the Upper Tribunal, so the findings remain provisional and reflect the FCA&apos;s case pending that process.
                </Para>
                <Para>
                  The regulatory language avoids the wrong lesson. This case did not require a secret offshore structure or a missing cash account to damage investors. It involved decisions about asset sales, portfolio construction, liquidity monitoring and governance response. The failure sat in ordinary fund mechanics. That makes it more relevant, not less.
                </Para>
              </div>
            </div>
            <PageFooter page={5} />
          </Page>
          <Gap />

          {/* ── Page 6 — Redress + Product Design ── */}
          <Page>
            <div style={{ padding: "48px 48px 80px" }}>
              <SectionHead title="The Redress Process" />
              <Para mt={0}>
                The redress process shows the scale of harm. The FCA said its findings against Link included securing a £230 million redress scheme for investors stuck in the fund at suspension. In 2024, investors began receiving a share of the scheme after High Court approval. The scheme materials stated the settlement fund would be up to £230 million and that every shareholder would receive a payment in proportion to the number and class of shares held. Link disputed liability while agreeing to the settlement, because it believed the scheme would produce the best outcome for investors.
              </Para>
              <Para>
                That qualification matters. Redress does not make investors whole in a clean way. It is a settlement process after years of uncertainty, asset sales and regulatory action. Investors who expected routine access to cash instead received staged distributions from a wound-up fund and separate compensation mechanics. The difference between those two experiences is the cost of liquidity risk.
              </Para>

              <div style={{ marginTop: 36 }}>
                <SectionHead title="The Product Design Failure" />
                <Para mt={0}>
                  The Woodford case is often told as a story about a famous manager falling from grace. That version is easy to write and too small. The deeper issue was product design. A fund&apos;s redemption terms should match its portfolio. A fund with daily dealing can hold some less liquid assets, but the total structure must still support investor withdrawals during plausible stress. Liquidity has to be measured at the portfolio level, not only at the single-asset level, and stress testing should consider investor behaviour, market depth and sequencing effects.
                </Para>
                <Callout>
                  Sequencing is critical. A fund may pass a liquidity test at the start of a redemption cycle and fail after selling its easiest assets first. The portfolio left behind becomes less liquid even as the fund continues to report a formal NAV.
                </Callout>
                <Para>
                  This is why redemption design belongs at the center of fund review. The relevant question is not whether a fund has a liquidity policy. The question is whether the policy can force a change in behaviour before investors are trapped.
                </Para>
              </div>
            </div>
            <PageFooter page={6} />
          </Page>
          <Gap />

          {/* ── Page 7 — ODD questions + Conclusion ── */}
          <Page>
            <div style={{ padding: "48px 48px 80px" }}>
              <SectionHead title="The Questions Beneath the Redemption Promise" />
              <Para mt={0}>
                The Woodford case points to a practical set of questions for any fund offering frequent redemptions.
              </Para>

              <div style={{ margin: "24px 0 8px" }}>
                <EyebrowRow label="ODD framework · Liquidity review questions" title="What structured review should ask before capital is committed" />
                <Question n={1} title="Realistic sellability, not label classification." body="How much of the portfolio can be sold within one day, four days, seven days and one month without moving prices? Grounded in trading volume and broker feedback, not regulatory category." />
                <Question n={2} title="Sequencing under stress." body="If redemptions continue, which holdings are sold first and what does the remaining portfolio look like? Selling liquid assets first can keep the gate open temporarily while the tail becomes more illiquid." />
                <Question n={3} title="Governance authority." body="Who has the power to stop the manager from adding less liquid positions while withdrawals are already rising? Is there a documented escalation path that can change portfolio behaviour, not just record concern?" />
                <Question n={4} title="Valuation versus exit value." body="Are assets carried at values the fund could realise during stress? Accounting NAV and cash-realisable NAV can diverge sharply in illiquid positions, and investors may not distinguish them until withdrawals are frozen." />
                <Question n={5} title="Product-portfolio alignment." body="Does the redemption frequency match the actual liquidity of holdings at the portfolio level? A label of equity income, balanced or growth does not determine this. The underlying assets do." />
              </div>
              <Para>
                These questions are not a checklist to be ticked. They are a framework for a structured conversation with the fund manager, the authorised corporate director, and the depositary before capital is committed.
              </Para>

              <div style={{ marginTop: 36 }}>
                <SectionHead title="What the Woodford Case Shows" />
                <Para mt={0}>
                  Woodford shows that operational risk can come from structure rather than deception. The fund held assets. It published values. It operated in a regulated market. It had formal oversight. Yet investors were still trapped because the liquidity promise stopped matching the portfolio.
                </Para>
                <Para>
                  That is the point allocators should keep. Reputation does not create liquidity. A product label does not create market depth. A governance role does not create intervention unless the role has authority and uses it. A valuation does not create cash.
                </Para>
                <Callout>
                  Liquidity should be tested before stress, while the fund still looks ordinary. Once withdrawals are frozen, the analysis changes from prevention to recovery — and everyone learns the same thing at the same time. Liquidity is not the number printed on a factsheet; it is what the portfolio can produce when investors ask for their money back.
                </Callout>
              </div>

              {/* Closing rule */}
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
                  Published for educational purposes; draws on publicly reported information including FCA Decision Notices and the FCA&apos;s June 2019 letter to the Treasury Committee. August 2025 findings remain provisional pending Upper Tribunal proceedings. Not legal, compliance, or investment advice.
                </div>
              </div>
            </div>
            <PageFooter page={7} />
          </Page>

        </div>
      </div>

      <FloatingSubscribe source="woodford-case" heading="ODD case study, every Thursday." />
    </div>
  );
}
