"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { GREEN, AMBER, VIOLET } from "@/lib/constants";
import FloatingSubscribe from "@/components/FloatingSubscribe";
import { CASE_STUDY_PRINT_CSS } from "@/lib/case-study-print";

// ── Design tokens (petrol-teal accent, matches the Greensill case) ───────────
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
      <span style={{ fontSize: 9, fontWeight: 700, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase" }}>Alpine Due Diligence · The Chatham Case</span>
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

export default function ChathamView() {
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
          [data-cs-topbar]{padding:14px 22px!important;} [data-cs-cover]{padding:30px 22px 34px!important;}
          [data-cs-body]{padding:30px 22px 40px!important;}
          [data-cs-h1]{font-size:32px!important;line-height:1.1!important;} [data-cs-h2]{font-size:18px!important;margin:0 0 24px!important;}
        }
      ${CASE_STUDY_PRINT_CSS}`}</style>

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
            <a data-cs-download-btn href="/chatham-asset-management.pdf" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 6, background: "#0f0f10", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none", flexShrink: 0 }}>
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
              <span style={{ fontSize: 10, fontWeight: 500, color: MUTED, letterSpacing: "0.08em" }}>2026 Jul 30 · 9 AM</span>
            </div>

            <div data-cs-cover style={{ padding: "56px 48px 48px", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 36, padding: "5px 14px", border: `1px solid ${RISK}80`, borderRadius: 3, alignSelf: "flex-start" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: RISK, display: "inline-block" }} />
                <span style={{ fontSize: 9, fontWeight: 700, color: RISK, letterSpacing: "0.18em", textTransform: "uppercase" }}>Conflicts of Interest · Price Formation · Case Study</span>
              </div>
              <h1 data-cs-h1 style={{ fontSize: 46, fontWeight: 800, color: BODY, lineHeight: 1.07, letterSpacing: "-0.03em", margin: "0 0 8px" }}>The Chatham Asset Management Case</h1>
              <h2 data-cs-h2 style={{ fontSize: 27, fontWeight: 600, color: BODY, lineHeight: 1.2, letterSpacing: "-0.02em", margin: "0 0 32px" }}>How Internal Bond Trades Raised Prices, Fund Values, and Fees</h2>
              <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.7, maxWidth: 580, marginBottom: 8 }}>
                An external market price is only as independent as the trades behind it. When one adviser controls most of the buyers, most of the sellers, and the issuer itself, the market can start reporting the adviser&apos;s own opinion back to itself.
              </p>

              <StatBand>
                <div style={{ background: "#fff" }}><KeyStat value="$8.6B" kicker="Firm AUM" label="Discretionary assets Chatham reported in its March 2022 Form ADV." /></div>
                <div style={{ background: "#fff" }}><KeyStat value="~80%" kicker="Equity control" label="Of American Media's parent equity owned by Chatham funds during the examined period, per the SEC." /></div>
                <div style={{ background: "#fff" }}><KeyStat value="83%" kicker="Bond ownership" label="Of the outstanding American Media bonds held by Chatham clients across the platform." /></div>
                <div style={{ background: "#fff" }}><KeyStat value="11%" kicker="Concentration" label="Average share of client portfolios represented by the three American Media bond issues." /></div>
              </StatBand>
              <SourceNote>Source: SEC Administrative Proceeding File No. 3-21355; Investment Advisers Act Release No. 6270, April 3, 2023.</SourceNote>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 26 }}>
                {["Conflicted Trading", "NAV Integrity", "Fee Diligence", "Price Formation"].map((t) => (
                  <span key={t} style={{ fontSize: 9, fontWeight: 700, color: BODY, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 10px", border: `1px solid ${BORDER}`, borderRadius: 3, background: "#fafafa" }}>{t}</span>
                ))}
              </div>
            </div>

            <div data-cs-coverfoot style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 48px", borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase" }}>Alpine Due Diligence · The Chatham Case</span>
              <span style={{ fontSize: 9, color: MUTED }}>01</span>
            </div>
          </Page>
          <Gap />

          {/* ── Page 2 — The position + daily liquidity ── */}
          <Page>
            <div data-cs-body style={{ padding: "48px 48px 80px" }}>
              <Para mt={0}>
                Chatham Asset Management managed hedge funds and liquid alternative funds that invested in high yield bonds, leveraged loans, and credit derivatives. Anthony Melchiorre founded the firm, owned about 70 percent during the relevant period, and served as the primary portfolio manager across its client accounts. Chatham reported approximately $8.6 billion in discretionary assets in its March 2022 regulatory filing.
              </Para>
              <Para>
                One investment occupied an unusual position across the firm. Chatham clients held debt and equity issued by American Media Inc., later known as a360 Media, the publisher behind titles such as US Weekly and The National Enquirer. According to the SEC, Chatham funds acquired 78 percent of the equity in American Media&apos;s parent company in 2014 and, through that ownership, effectively controlled the company and appointed two of the four members of its board. During the period the SEC examined, Chatham funds owned about 80 percent of the parent company&apos;s equity.
              </Para>
              <Para>
                The debt concentration was similar. The SEC found that Chatham clients held three American Media bond issues that represented about 11 percent of their portfolios on average, and that across the platform those clients owned approximately 83 percent of the outstanding bonds.
              </Para>
              <Para>
                These positions gave Chatham several roles at once. It managed the funds that owned the bonds. Its funds controlled the issuer. It decided which client accounts should hold the securities. It also became the main source of trading activity in the market for those securities.
              </Para>
              <Callout>
                American Media bonds traded over the counter and had few outside buyers. The next largest bondholder, the SEC found, attempted to sell during the relevant period and could find no purchaser other than a Chatham client. The market price looked external because trades passed through broker dealers and a pricing service published values, yet the underlying price formation remained heavily dependent on Chatham.
              </Callout>

              <div style={{ marginTop: 32 }}>
                <SectionHead title="Daily Liquidity Met an Illiquid Credit Position" />
                <Para mt={0}>
                  Some Chatham clients were liquid alternative funds: mutual funds that used hedge fund style strategies while allowing shareholders to redeem daily, and that imposed limits on exposure to a single issuer or industry.
                </Para>
                <Para>
                  The American Media positions created pressure inside those funds. A liquid alternative fund might need to sell bonds because investors redeemed shares, because the fund needed cash, or because the position exceeded an internal concentration limit. The need to sell did not mean Chatham had changed its investment view. The adviser still considered the bonds attractive and wanted another client to own them.
                </Para>
                <Para>
                  Chatham therefore arranged transactions in which one client sold American Media bonds and another client purchased the same securities. The SEC referred to these as rebalancing trades. From 2016 through 2018, Chatham used them to respond to redemptions, portfolio limits, and movements of capital across its clients.
                </Para>
              </div>
            </div>
            <PageFooter page={2} />
          </Page>
          <Gap />

          {/* ── Page 3 — The allocation conflict + the usual drill ── */}
          <Page>
            <div data-cs-body style={{ padding: "48px 48px 80px" }}>
              <SectionHead title="One Adviser on Both Sides of the Price" />
              <Para mt={0}>
                The practice solved an immediate portfolio problem for the selling fund and created a second problem for the purchasing fund. Chatham managed both accounts and decided which client would sell, which client would buy, and what price would apply. An external market normally settles that conflict, because independent buyers submit bids based on their own assessment of credit quality, liquidity, and expected return, and a competitive process produces evidence of what an unrelated buyer will pay.
              </Para>
              <Para>
                The American Media bond market offered little such evidence. Chatham clients already owned most of the securities, and few external purchasers wanted them. The transaction therefore depended on another Chatham account. The selling client gained liquidity; the purchasing client received a bond the adviser still favoured; and the price required separate protection because the same adviser represented both economic interests. A price chosen to help the seller could impose an inflated cost on the buyer, and a low price could transfer value in the opposite direction. Investment conviction did not resolve that allocation problem: believing the bond would perform well did not establish a fair transfer price between two clients.
              </Para>

              <div style={{ marginTop: 36 }}>
                <SectionHead title={"The “Usual Drill”"} />
                <Para mt={0}>
                  Chatham recognized that registered investment companies faced restrictions on transactions with affiliated parties, including other clients managed by the same adviser, and it consulted a compliance adviser about how to execute the rebalancing trades. According to the SEC order, the recommended transaction format rested on a key condition: the trades needed independently derived market prices.
                </Para>
                <Para>
                  The SEC found that the economic process did not produce independent price discovery. One Chatham client would sell American Media bonds to a broker; Chatham would then purchase the same bonds for another client, sometimes the next day and sometimes through another broker. The brokers understood the intended sequence. The SEC found that Melchiorre told brokers Chatham would probably repurchase the bonds for another account, and that over time the arrangement became routine. When he wanted one broker to hold a bond overnight before a Chatham client repurchased it, the order describes him referring to the process as the &quot;usual drill.&quot;
                </Para>
                <Para>
                  According to the SEC, the brokers often placed the bonds into inventory for a short period, and their willingness to do so depended on an expectation that Chatham would arrange the next purchase. Most did not seek buyers across the broader market; in nearly all cases, they resold the bonds to Chatham or to another broker acting for a Chatham account. Legal title passed through a broker, but the broker&apos;s economic role remained narrow: it held the security because it expected Chatham to bring the next buyer, and it generally did not solicit competing bids or accept meaningful market risk. The SEC found that Melchiorre proposed the transaction prices, that the brokers accepted them without first seeking bids from other participants, and that when Chatham repurchased the bonds it generally paid more than the selling client had received, with the increase compensating the broker or brokers involved.
                </Para>
              </div>
            </div>
            <PageFooter page={3} />
          </Page>
          <Gap />

          {/* ── Page 4 — mechanics diagram + how trades became prices ── */}
          <Page>
            <div data-cs-body style={{ padding: "48px 48px 80px" }}>
              <div style={{ margin: "0 0 8px", padding: "20px 22px", background: "#fafafa", border: `1px solid ${BORDER}`, borderRadius: 8 }}>
                <EyebrowRow label={"Mechanics · The “usual drill”"} title="A trade with the form of an external market, and none of its substance" />
                <div data-cs-chain style={{ display: "flex", gap: 8, alignItems: "stretch", marginTop: 16 }}>
                  <ChainBox head="Chatham client A" body="sells bonds, needs liquidity or is under a limit" />
                  <ChainBox head="Broker dealer" body="holds bonds briefly, the &quot;usual drill&quot;" accent />
                  <ChainBox head="Chatham client B" body="repurchases, at a higher price" />
                  <ChainBox head="Market record" body="looks like an outside trade" />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: MUTED, textTransform: "uppercase" }}>
                  <span>Price proposed by Melchiorre</span>
                  <span>No competing bids sought</span>
                </div>
                <SourceNote>Per the SEC order, legal title passed through a broker, but the broker generally did not solicit competing bids or accept meaningful market risk. Chatham had already arranged the expected buyer and proposed the price.</SourceNote>
              </div>

              <div style={{ marginTop: 36 }}>
                <SectionHead title="How Rebalancing Trades Became Market Prices" />
                <Para mt={0}>
                  Chatham completed more than 100 rebalancing trades in the American Media bonds during the relevant period. The SEC found that those trades represented approximately 81 percent of customer trading in the securities on average, a market share that gave the activity substantial influence over observed prices.
                </Para>
                <Para>
                  The SEC found that Melchiorre considered the previous published price when proposing the next trade price, then added a spread to compensate the brokers. The published price itself reflected recent market transactions, many of which Chatham had arranged. A Chatham client sold a bond through a broker; another Chatham client purchased it at a slightly higher price; the completed trade entered the market record; a pricing service considered recent transactions when estimating the bond&apos;s value; and Chatham then referred to that published value when setting the next rebalancing trade. Each transaction provided support for the next one, and the market observation looked external after publication although Chatham had arranged most of the underlying trading.
                </Para>
                <Para>
                  The repeated increases caused American Media bond prices to rise faster than comparable securities. The SEC observed that by November 2017 two of the bonds traded through the rebalancing process at implied yields below the London Interbank Offered Rate, levels that would ordinarily be associated with bonds carrying much stronger credit quality. Bond prices and yields move in opposite directions, so a low yield suggests investors view the security as safer, yet the American Media bonds reached yield levels that did not fit their underlying credit profile. The prices reflected a market dominated by transactions among funds controlled by the same adviser.
                </Para>
              </div>
            </div>
            <PageFooter page={4} />
          </Page>
          <Gap />

          {/* ── Page 5 — NAV & fee loop + platform conflicts ── */}
          <Page>
            <div data-cs-body style={{ padding: "48px 48px 80px" }}>
              <SectionHead title="The NAV and Fee Feedback Loop" />
              <Para mt={0}>
                Chatham used an independent pricing service to value securities held by its private funds, including the American Media bonds, and administrators for the liquid alternative funds used the same pricing service when calculating net asset values. The service relied in part on recent trading prices. Independence from the portfolio manager does not make the underlying data independent: the service still depends on trades, dealer observations, models, and other market information, and for these bonds the SEC found that Chatham&apos;s rebalancing trades supplied most of the customer trading data.
              </Para>
              <Para>
                The resulting values entered client NAV calculations, and higher American Media marks increased the reported value of funds holding the securities. NAV determined the value shown on investor statements, influenced reported performance, and formed the basis for management fees charged as a percentage of fund assets, with certain private funds paying performance fees as well.
              </Para>

              <StatBand>
                <div style={{ background: "#fff" }}><KeyStat value="100+" kicker="Trade count" label="Rebalancing trades completed in the American Media bonds during the relevant period." /></div>
                <div style={{ background: "#fff" }}><KeyStat value="81%" kicker="Market share" label="Average share of customer trading in the bonds represented by Chatham's rebalancing trades." /></div>
                <div style={{ background: "#fff" }}><KeyStat value="$11M" kicker="Excess fees" label="Management and performance fees the SEC estimated clients would not have paid without the trades." /></div>
                <div style={{ background: "#fff" }}><KeyStat value="55%" kicker="To Melchiorre" label="Share of those excess fees that Chatham paid to Melchiorre personally, per the SEC." /></div>
              </StatBand>
              <SourceNote>Source: SEC Administrative Proceeding File No. 3-21355, April 3, 2023.</SourceNote>

              <div style={{ marginTop: 34 }}>
                <SectionHead title="Conflicts Across the Fund Platform" />
                <Para mt={0}>
                  The rebalancing trades created conflicts between Chatham clients at several levels. The selling fund needed liquidity and wanted the best available price; the purchasing fund needed fair value and protection against acquiring a security at a price unsupported by outside demand; and Chatham owed duties to both. Because the pricing service used trade data, one rebalancing trade could affect NAVs across the wider platform, so funds that did not participate in a trade could still receive a higher mark on their American Media holdings. Chatham also had an ownership relationship with the issuer, and the fee structure added a direct economic interest, since Chatham and Melchiorre benefited when higher marks increased management and performance fees.
                </Para>
              </div>
            </div>
            <PageFooter page={5} />
          </Page>
          <Gap />

          {/* ── Page 6 — what independent evidence required + records ── */}
          <Page>
            <div data-cs-body style={{ padding: "48px 48px 80px" }}>
              <SectionHead title="Where Independent Evidence Should Have Come From" />
              <Para mt={0}>
                Each part of the chain had the appearance of a separate function. Broker execution, independent pricing, fund administration, and fee calculation all operated through familiar institutional processes, yet their outputs depended on a price formation process the SEC found was dominated by Chatham. Formal separation among providers did not eliminate the adviser&apos;s influence over the source data.
              </Para>
              <div style={{ margin: "24px 0 0", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "18px 20px", background: "#fafafa" }}>
                <EyebrowRow label="What independent price discovery required" title="Where each participant should have supplied genuine outside evidence" />
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
                  <Finding head="Competitive bids before each transfer.">Independent price discovery through competitive bids, dealer quotations for meaningful size, and comparable bond yield analysis, before rather than after the transaction.</Finding>
                  <Finding head="Review by personnel with no interest in either account.">A price decided by the same adviser that manages both the selling and purchasing client cannot substitute for independent review.</Finding>
                  <Finding head="Genuine market testing by the broker dealers.">Temporary ownership offers little pricing evidence when the broker expects the adviser to arrange the repurchase. An outside trade requires an outside economic decision.</Finding>
                  <Finding head="Source analysis by the pricing service.">A price based on recent trades carries limited weight when one adviser controls most of those trades. The concentration of trading activity should have been identified and weighed.</Finding>
                </div>
              </div>

              <div style={{ marginTop: 34 }}>
                <SectionHead title="The Records That Would Have Exposed the Process" />
                <Para mt={0}>
                  The case depended on records that could have shown how the apparent market formed. Trade tickets would identify the selling client, purchasing client, broker, quantity, sale price, repurchase price, timing, and spread, and arranging those trades in sequence would show the repeated movement of the same bonds between Chatham accounts. Broker communications would show whether the bonds were offered to unrelated buyers, and whether brokers accepted meaningful inventory risk or participated because Chatham had already indicated an expected repurchase.
                </Para>
                <Para>
                  Market data analysis could separate Chatham related trades from outside transactions and compare prices from each group with yields on similar bonds; the unusually low yields reached by the American Media securities would then require explanation through credit fundamentals or independent demand. Pricing service files would identify which observations influenced each published value and test how much of the final mark came from Chatham arranged transactions. Fund NAV records would show how changes in the American Media marks affected each client&apos;s reported value, and fee calculations could then be recomputed after removing the price effects associated with the rebalancing trades. Allocation records would show why one client sold and another purchased, and whether the transaction served each client independently rather than a platform level objective of keeping the security inside Chatham managed accounts.
                </Para>
              </div>
            </div>
            <PageFooter page={6} />
          </Page>
          <Gap />

          {/* ── Page 7 — ODD framework + calc-accurate/input-compromised ── */}
          <Page>
            <div data-cs-body style={{ padding: "48px 48px 80px" }}>
              <div style={{ margin: "0 0 8px", padding: "20px 22px", background: "#fafafa", border: `1px solid ${BORDER}`, borderRadius: 8 }}>
                <EyebrowRow label="ODD framework · The record set that traces price formation" title="What a structured review would reconstruct" />
                <Numbered n={1} title="Trade tickets, sequenced." body="Selling client, purchasing client, broker, quantity, sale price, repurchase price, timing, and spread, arranged in order to show repeated movement between Chatham accounts." />
                <Numbered n={2} title="Broker communications." body="Whether bonds were offered to unrelated buyers, and whether brokers accepted genuine inventory risk or simply expected a Chatham repurchase." />
                <Numbered n={3} title="Market data analysis." body="Separating Chatham related trades from outside transactions and comparing prices against yields on similar bonds." />
                <Numbered n={4} title="Pricing service files." body="Which observations influenced each published value, and how much of the final mark came from Chatham arranged transactions." />
                <Numbered n={5} title="Fund NAV and fee records." body="How changes in the American Media marks affected each client's reported value, recomputed after removing the price effects of the rebalancing trades." />
                <Numbered n={6} title="Allocation records." body="Evidence that each transaction served each client independently, rather than a platform level objective of keeping the security inside Chatham managed accounts." />
                <SourceNote>A trade executed through a broker can still lack independent price discovery. A value published by an external service can still depend on transactions controlled by the adviser. The calculation may be accurate; the input can still be compromised.</SourceNote>
              </div>

              <div style={{ marginTop: 34 }}>
                <SectionHead title="The Due Diligence Problem" />
                <Para mt={0}>
                  The due diligence problem concerned the quality and origin of the market evidence. A trade executed through a broker can still lack independent price discovery. A value published by an external service can still depend on transactions controlled by the adviser. An administrator can calculate NAV correctly while using a security price affected by conflicted trades. The calculation may be accurate. The input can still be compromised.
                </Para>
              </div>

              <div style={{ marginTop: 34 }}>
                <SectionHead title="Enforcement and the Record Left Behind" />
                <Para mt={0}>
                  In April 2023, Chatham and Melchiorre settled SEC administrative proceedings. They agreed to the settlement without admitting or denying the findings, other than jurisdiction. The SEC found that their conduct caused client NAVs to be higher than they would have been without the rebalancing trades and resulted in excess fees, and that certain registered funds entered prohibited affiliate transactions. The SEC ordered Chatham and Melchiorre to pay $11 million in disgorgement, approximately $3.38 million in prejudgment interest, and $5 million in civil penalties, a total of approximately $19.38 million, and created a Fair Fund to distribute money to affected investors.
                </Para>
              </div>

              <StatBand>
                <div style={{ background: "#fff" }}><KeyStat value="$11M" kicker="Apr 2023" label="Disgorgement ordered by the SEC." /></div>
                <div style={{ background: "#fff" }}><KeyStat value="$3.38M" kicker="Apr 2023" label="Prejudgment interest ordered on top of disgorgement." /></div>
                <div style={{ background: "#fff" }}><KeyStat value="$5M" kicker="Apr 2023" label="Civil penalties, bringing the total to approximately $19.38 million." /></div>
                <div style={{ background: "#fff" }}><KeyStat value="$14.06M" kicker="Jun 2026" label="Approved for distribution to eligible investors across five Chatham funds via the Fair Fund." /></div>
              </StatBand>
              <SourceNote>Source: SEC Administrative Proceeding File No. 3-21355; Harmed Investor Distribution Page, updated June 29, 2026.</SourceNote>

              <div style={{ marginTop: 30 }}>
                <Para mt={0}>
                  The Chatham matter documents a price formation problem inside a concentrated fund platform. Chatham clients owned most of an illiquid bond issue, and daily redemption needs and concentration limits required certain funds to sell. The SEC found that Chatham moved the bonds into other client accounts through brokers and proposed the transaction prices, that those trades became most of the customer market, and that a pricing service incorporated the resulting observations into bond values that entered fund NAVs and increased advisory fees. Rebalancing, broker execution, external pricing, fund administration, and fee calculation each performed a recognizable function, and Chatham&apos;s influence over the market linked them into a circular system. The resulting bond price carried the appearance of independent market evidence, while most of the activity behind that price came from Chatham moving the bonds among clients it controlled.
                </Para>
              </div>

              <div style={{ marginTop: 34 }}>
                <EyebrowRow label="References" title="Public sources cited in this analysis" />
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
                  {[
                    ["1", "U.S. Securities and Exchange Commission. In the Matter of Chatham Asset Management, LLC, and Anthony Melchiorre. Investment Advisers Act Release No. 6270; Investment Company Act Release No. 34875; Administrative Proceeding File No. 3-21355. April 3, 2023."],
                    ["2", "U.S. Securities and Exchange Commission. In the Matter of Chatham Asset Management, LLC, et al. Administrative Proceeding File No. 3-21355. Harmed Investor Distribution Page. March 4, 2024, updated June 29, 2026."],
                  ].map(([n, src]) => (
                    <div key={n} style={{ display: "flex", gap: 10, fontSize: 12, color: MUTED, lineHeight: 1.55 }}>
                      <span style={{ flexShrink: 0, fontWeight: 700, color: BODY }}>{n}</span>
                      <span>{src}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 40, paddingTop: 24, borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/alpine-icon.svg" alt="Alpine" style={{ height: 20, width: "auto" }} />
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: BODY }}>Alpine Due Diligence</div>
                    <div style={{ fontSize: 10, color: MUTED }}>alpinedd.com</div>
                  </div>
                </div>
                <div style={{ fontSize: 10, color: MUTED, textAlign: "right", lineHeight: 1.5, maxWidth: 420 }}>
                  This case study is published for educational purposes and draws solely on the public SEC administrative record cited above (File No. 3-21355) and related distribution filings. Chatham and Melchiorre settled without admitting or denying the SEC&apos;s findings. Nothing here characterizes any other party, and the analysis takes no position on any related litigation. It does not constitute legal, compliance, or investment advice. Alpine combines structured analysis with senior analyst review to support, not replace, institutional judgment.
                </div>
              </div>
            </div>
            <PageFooter page={7} />
          </Page>

        </div>
      </div>

      <FloatingSubscribe source="chatham-case" heading="ODD case study, every Thursday." />
    </div>
  );
}
