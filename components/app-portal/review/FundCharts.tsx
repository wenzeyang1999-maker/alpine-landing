"use client";

/**
 * Source-backed entity + org charts for the ODD report.
 *
 * Both render from typed data in lib/app-portal/fund-charts.ts and place a
 * RefDot on each node — so every box in the diagram is click-to-verify, the
 * same as the narrative citations. Light theme to match the report reader.
 */
import React from "react";
import { RefDot } from "@/components/app-portal/review/RefDot";
import type {
  EntityChartData,
  EntityNode,
  Flag,
  OrgChartData,
  OrgPerson,
  ChartRef,
} from "@/lib/app-portal/fund-charts";

const FLAG_COLOR: Record<Flag, string> = {
  green: "#16a34a",
  yellow: "#d97706",
  red: "#dc2626",
};

const INK = "#0f172a";
const MUTED = "#64748b";
const BORDER = "#e2e8f0";

function NodeDot({ refObj, slug }: { refObj?: ChartRef; slug?: string }) {
  if (!refObj) return null;
  return (
    <span style={{ position: "absolute", top: 4, right: 4 }}>
      <RefDot source={refObj.source} quote={refObj.quote} color="blue" variant="prose" slug={slug} />
    </span>
  );
}

function FlagPip({ flag }: { flag?: Flag }) {
  if (!flag) return null;
  return (
    <span
      aria-hidden
      style={{ display: "inline-block", width: 7, height: 7, borderRadius: 999, background: FLAG_COLOR[flag], flexShrink: 0 }}
    />
  );
}

function Connector({ height = 16 }: { height?: number }) {
  return <div aria-hidden style={{ width: 1, height, background: "#cbd5e1", margin: "0 auto" }} />;
}

function ChartFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <figure
      style={{
        margin: "0 0 18px",
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
        background: "#f8fafc",
        padding: "16px 18px 14px",
        overflowX: "auto",
      }}
    >
      <figcaption style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: MUTED, marginBottom: 14 }}>
        {title}
      </figcaption>
      {children}
    </figure>
  );
}

// ── Entity chart ──────────────────────────────────────────────────────────────

const ENTITY_ACCENT: Record<string, string> = {
  fund: "#6366f1",
  manager: "#0ea5e9",
  gp: "#0ea5e9",
  master: "#6366f1",
  feeder: "#94a3b8",
  vehicle: "#94a3b8",
  provider: "#94a3b8",
  investors: "#94a3b8",
};

function EntityBox({ node, slug, emphasis }: { node: EntityNode; slug?: string; emphasis?: boolean }) {
  const accent = ENTITY_ACCENT[node.kind] ?? "#94a3b8";
  return (
    <div
      style={{
        position: "relative",
        minWidth: emphasis ? 200 : 150,
        maxWidth: 260,
        background: "#fff",
        border: `1px solid ${node.flag ? FLAG_COLOR[node.flag] + "66" : BORDER}`,
        borderTop: `3px solid ${node.flag ? FLAG_COLOR[node.flag] : accent}`,
        borderRadius: 8,
        padding: "9px 11px",
        boxShadow: emphasis ? "0 2px 10px rgba(15,23,42,0.08)" : "0 1px 3px rgba(15,23,42,0.05)",
      }}
    >
      <NodeDot refObj={node.ref} slug={slug} />
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <FlagPip flag={node.flag} />
        <span style={{ fontSize: emphasis ? 12.5 : 11.5, fontWeight: 700, color: INK, lineHeight: 1.25, paddingRight: 12 }}>{node.label}</span>
      </div>
      {node.sublabel && <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>{node.sublabel}</div>}
      {node.status && (
        <div style={{ fontSize: 9.5, fontWeight: 600, color: node.flag ? FLAG_COLOR[node.flag] : "#16a34a", marginTop: 4 }}>
          {node.status}
        </div>
      )}
    </div>
  );
}

function Row({ children, gap = 12 }: { children: React.ReactNode; gap?: number }) {
  return <div style={{ display: "flex", gap, justifyContent: "center", flexWrap: "wrap" }}>{children}</div>;
}

export function EntityChart({ data, slug }: { data: EntityChartData; slug?: string }) {
  return (
    <ChartFrame title={data.caption || "Fund structure"}>
      {data.investors && (
        <>
          <Row>
            <EntityBox node={data.investors} slug={slug} />
          </Row>
          <Connector />
        </>
      )}

      {/* Manager — Fund — GP */}
      <div style={{ display: "flex", gap: 10, justifyContent: "center", alignItems: "stretch", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <EntityBox node={data.manager} slug={slug} />
          <div style={{ fontSize: 9, color: MUTED, textAlign: "center", marginTop: 3 }}>advises ▸</div>
        </div>
        <EntityBox node={data.fund} slug={slug} emphasis />
        {data.gp && (
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <EntityBox node={data.gp} slug={slug} />
            <div style={{ fontSize: 9, color: MUTED, textAlign: "center", marginTop: 3 }}>◂ general partner</div>
          </div>
        )}
      </div>

      {data.feeders && data.feeders.length > 0 && (
        <>
          <Connector />
          <div style={{ fontSize: 9.5, color: MUTED, textAlign: "center", marginBottom: 6 }}>Feeder vehicles</div>
          <Row>
            {data.feeders.map((f, i) => (
              <EntityBox key={i} node={f} slug={slug} />
            ))}
          </Row>
        </>
      )}

      {data.master && (
        <>
          <Connector />
          <Row>
            <EntityBox node={data.master} slug={slug} emphasis />
          </Row>
        </>
      )}

      {data.vehicles && data.vehicles.length > 0 && (
        <>
          <Connector />
          <div style={{ fontSize: 9.5, color: MUTED, textAlign: "center", marginBottom: 6 }}>Related vehicles</div>
          <Row>
            {data.vehicles.map((v, i) => (
              <EntityBox key={i} node={v} slug={slug} />
            ))}
          </Row>
        </>
      )}

      {data.providers && data.providers.length > 0 && (
        <div style={{ marginTop: 16, borderTop: `1px dashed ${BORDER}`, paddingTop: 12 }}>
          <div style={{ fontSize: 9.5, fontWeight: 600, color: MUTED, marginBottom: 8, letterSpacing: "0.05em" }}>
            SERVICE PROVIDERS
          </div>
          <Row gap={8}>
            {data.providers.map((p, i) => (
              <EntityBox key={i} node={p} slug={slug} />
            ))}
          </Row>
        </div>
      )}

      {data.note && (
        <p style={{ fontSize: 10, color: MUTED, marginTop: 14, marginBottom: 0, lineHeight: 1.5 }}>{data.note}</p>
      )}
    </ChartFrame>
  );
}

// ── Org chart ─────────────────────────────────────────────────────────────────

function PersonBox({ person, slug, dotted, block }: { person: OrgPerson; slug?: string; dotted?: boolean; block?: boolean }) {
  return (
    <div
      style={{
        position: "relative",
        minWidth: block ? 0 : 150,
        maxWidth: block ? "none" : 230,
        width: block ? "100%" : undefined,
        background: "#fff",
        border: `${dotted ? "1px dashed" : "1px solid"} ${person.flag ? FLAG_COLOR[person.flag] + "66" : BORDER}`,
        borderLeft: `3px solid ${person.flag ? FLAG_COLOR[person.flag] : dotted ? "#cbd5e1" : "#0ea5e9"}`,
        borderRadius: 8,
        padding: "8px 11px",
        boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
      }}
    >
      <NodeDot refObj={person.ref} slug={slug} />
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <FlagPip flag={person.flag} />
        <span style={{ fontSize: 11.5, fontWeight: 700, color: INK, paddingRight: 12 }}>{person.name}</span>
      </div>
      <div style={{ fontSize: 10, color: MUTED, marginTop: 1 }}>{person.title}</div>
      {person.note && (
        <div style={{ fontSize: 9.5, color: person.flag ? FLAG_COLOR[person.flag] : MUTED, marginTop: 3, fontStyle: "italic" }}>
          {person.note}
        </div>
      )}
    </div>
  );
}

export function OrgChart({ data, slug }: { data: OrgChartData; slug?: string }) {
  return (
    <ChartFrame title={data.caption || "Management organization"}>
      {/* Leadership tier */}
      <Row>
        {data.leadership.map((p, i) => (
          <PersonBox key={i} person={p} slug={slug} />
        ))}
      </Row>

      {/* Functional groups, joined to leadership by a tree connector (spine + rail) */}
      {data.groups.length > 0 && (
        <div className={`org-branch${data.groups.length > 1 ? " org-branch--tree" : ""}`}>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", alignItems: "flex-start", flexWrap: "nowrap" }}>
            {data.groups.map((g, gi) => (
              <div key={gi} className="org-group" style={{ display: "flex", flexDirection: "column", gap: 8, flex: "1 1 0", minWidth: 0, maxWidth: 240 }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: MUTED, letterSpacing: "0.06em", textTransform: "uppercase", textAlign: "center" }}>
                  {g.label}
                </div>
                {g.people.map((p, pi) => (
                  <PersonBox key={pi} person={p} slug={slug} block />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {data.advisors && data.advisors.length > 0 && (
        <div style={{ marginTop: 16, borderTop: `1px dashed ${BORDER}`, paddingTop: 12 }}>
          <div style={{ fontSize: 9.5, fontWeight: 600, color: MUTED, marginBottom: 8, letterSpacing: "0.05em" }}>
            ADVISORS / OUTSOURCED <span style={{ fontWeight: 400 }}>(dotted line)</span>
          </div>
          <Row gap={8}>
            {data.advisors.map((p, i) => (
              <PersonBox key={i} person={p} slug={slug} dotted />
            ))}
          </Row>
        </div>
      )}

      {data.note && (
        <p style={{ fontSize: 10, color: MUTED, marginTop: 14, marginBottom: 0, lineHeight: 1.5 }}>{data.note}</p>
      )}
    </ChartFrame>
  );
}
