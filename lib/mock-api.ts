/**
 * Mock API — implements the same DemoApi interface as demo-api-factory.ts
 * but returns static data from mock-data.ts instead of making HTTP calls.
 *
 * To switch to a real backend:
 *   1. Uncomment the rewrite in next.config.ts to proxy /api/* to the backend
 *   2. In alpine-demo.ts, replace `mockApi` with `createDemoApi("/api/demo/v2", "/api/demo/v2/mon-agent")`
 *   3. Delete this file (or keep for offline dev)
 */

import type { DemoApi } from "./demo-api-factory";
import { FUNDS, PORTFOLIO_STATS, PIPELINE_TARGETS, TOPIC_MATRIX, KPI_DATA, ACTIVITY_FEED } from "./mock-data";

// Simulate async delay (feel free to set to 0 for instant responses)
function delay(ms = 120): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// Simple in-memory user session (resets on page refresh — no real auth)
let _user: { id: string; email: string; full_name: string; role: string } | null = null;

export const mockApi: DemoApi = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  async login(email, _password) {
    await delay();
    _user = { id: "demo-user-001", email, full_name: email.split("@")[0], role: "demo" };
    return { user: _user, access_token: "mock-token" };
  },
  async tokenLogin(_token) {
    await delay();
    _user = { id: "demo-user-001", email: "demo@alpinedd.com", full_name: "Demo User", role: "demo" };
    return { user: _user, access_token: "mock-token" };
  },
  async logout() {
    await delay(50);
    _user = null;
    return { ok: true };
  },
  async getMe() {
    await delay(50);
    if (!_user) throw new Error("Not authenticated");
    return _user;
  },
  async refresh() {
    await delay(50);
    return { access_token: "mock-token" };
  },
  async register(fullName, email, organization) {
    await delay();
    _user = { id: "demo-user-001", email, full_name: fullName, role: "demo" };
    return { user: _user, is_new: true, organization };
  },
  async changePassword(_currentPassword, _newPassword) {
    await delay();
    return { ok: true };
  },

  // ── Portfolio ──────────────────────────────────────────────────────────────
  async listFunds(strategy, rating) {
    await delay();
    let funds = [...FUNDS];
    if (strategy) funds = funds.filter((f) => f.strategy === strategy);
    if (rating) funds = funds.filter((f) => f.odd_rating.toLowerCase() === rating.toLowerCase());
    return funds;
  },
  async getFund(slug) {
    await delay();
    const fund = FUNDS.find((f) => f.slug === slug);
    if (!fund) throw new Error("Fund not found");
    return fund;
  },
  async getPortfolioStats() {
    await delay();
    return PORTFOLIO_STATS;
  },
  async getTopicMatrix() {
    await delay();
    return TOPIC_MATRIX;
  },

  // ── Reviews ───────────────────────────────────────────────────────────────
  async listReviews() {
    await delay();
    return FUNDS.filter((f) => f.has_review).map((f) => ({
      id: f.id,
      slug: f.review_slug,
      fund_name: f.name,
      fund_slug: f.slug,
      status: "completed",
      rating: f.odd_rating,
      score: f.odd_score,
      created_at: f.last_review_date,
    }));
  },
  async getReview(slug) {
    await delay();
    const fund = FUNDS.find((f) => f.review_slug === slug || f.slug === slug);
    if (!fund) throw new Error("Review not found");
    return {
      id: fund.id,
      slug: fund.review_slug || fund.slug,
      fund_name: fund.name,
      fund_slug: fund.slug,
      status: "completed",
      rating: fund.odd_rating,
      score: fund.odd_score,
      topic_ratings: fund.topic_ratings,
      manager_name: fund.manager_name,
      aum: fund.aum,
      strategy: fund.strategy,
      hq: fund.hq,
      administrator: fund.administrator,
      auditor: fund.auditor,
      prime_broker: fund.prime_broker,
      notes: fund.notes,
      created_at: fund.last_review_date,
      review_type: fund.review_type,
      // WorkflowStepper fields — Ridgeline has full analysis pre-seeded
      document_count: fund.slug === "ridgeline-capital" ? 14 : 0,
      odd_summary: fund.slug === "ridgeline-capital" ? { rating: fund.odd_rating } : null,
      verification_status: fund.slug === "ridgeline-capital" ? "completed" : null,
      report_status: null, // Report always pending in demo
      // Alpine engine review_id — null until real engine is integrated
      alpine_review_id: null,
    };
  },
  async createReview(data) {
    await delay();
    return { id: "new-review-001", slug: data.fund_slug || "new-review", status: "pending", ...data };
  },

  // ── IC Memo ───────────────────────────────────────────────────────────────
  async getMemoSections(_reviewId) {
    await delay();
    return [
      { id: "memo-001", section_id: "executive_summary", title: "Executive Summary", current_version: 1, versions: [{ id: "v1", version_num: 1, content: "Ridgeline Capital Partners has been assigned a **WATCHLIST** rating following a comprehensive ODD review conducted in January 2026. The firm demonstrates strong investment infrastructure and experienced portfolio management but presents material operational deficiencies requiring remediation prior to ACCEPT designation.\n\n**Key Findings:**\n- No dedicated CCO (compliance responsibilities shared by PM)\n- Pre-trade compliance system absent\n- Key person risk concentrated in founder/PM David Chen\n- Service provider quality is strong (Citco, EY)\n\n**Conditions for Upgrade:** Four conditions have been set with a target upgrade date of Q4 2026, subject to satisfactory remediation.", change_summary: "Initial draft", created_at: new Date().toISOString() }] },
      { id: "memo-002", section_id: "investment_thesis", title: "Investment Thesis", current_version: 1, versions: [{ id: "v1", version_num: 1, content: "Ridgeline Capital Partners executes a global long/short equity strategy with 100-150 long positions and 60-100 short positions across 10-15 countries. The fund targets concentrated alpha generation through deep fundamental research.\n\n**Strategy Fit:** Aligns with the portfolio's allocation to fundamental equity hedge strategies. The fund's 14.2% YTD return and 15.8% inception return demonstrate consistent alpha generation relative to peers.\n\n**Conviction Level:** MEDIUM — pending operational remediation.", change_summary: "Initial draft", created_at: new Date().toISOString() }] },
      { id: "memo-003", section_id: "risk_assessment", title: "Risk Assessment", current_version: 1, versions: [{ id: "v1", version_num: 1, content: "**Operational Risk: HIGH**\n- CCO vacancy creates compliance oversight gap\n- Pre-trade compliance absent — manual controls only\n- Key person risk: fund performance highly dependent on founder Chen\n\n**Regulatory Risk: MEDIUM**\n- Form ADV current and accurate\n- No regulatory actions or inquiries\n- Clean CRD record\n\n**Counterparty Risk: LOW**\n- Prime brokerage at Goldman Sachs and Morgan Stanley (tier 1)\n- Administrator: Citco (tier 1)\n- Auditor: Ernst & Young (Big 4)", change_summary: "Initial draft", created_at: new Date().toISOString() }] },
      { id: "memo-004", section_id: "recommendation", title: "IC Recommendation", current_version: 1, versions: [{ id: "v1", version_num: 1, content: "**Recommendation: MAINTAIN WITH CONDITIONS**\n\nThe IC recommends maintaining the current position in Ridgeline Capital Partners at WATCHLIST status with the following conditions:\n\n1. **CCO Hire** — Dedicated CCO must be hired and onboarded by April 30, 2026\n2. **Pre-Trade Compliance** — Bloomberg AIM or equivalent system deployed by June 30, 2026\n3. **Succession Plan** — Board-approved succession plan for PM/founder by March 31, 2026\n4. **BCP Testing** — Full BCP test with documented results by May 31, 2026\n\nUpon satisfactory completion of all four conditions, the fund will be upgraded to ACCEPT at the next semi-annual review.", change_summary: "Initial draft", created_at: new Date().toISOString() }] },
    ];
  },
  async getSectionHistory(sectionId) {
    await delay();
    return [{ id: sectionId + "-v1", version_num: 1, content: "Section content", change_summary: "Initial draft", created_at: new Date().toISOString() }];
  },
  async editMemoSection(sectionId, content, changeSummary) {
    await delay();
    return { id: sectionId, content, change_summary: changeSummary, version_num: 2 };
  },
  async revertMemoSection(sectionId, versionNum) {
    await delay();
    return { id: sectionId, version_num: versionNum };
  },

  // ── Pipeline ───────────────────────────────────────────────────────────────
  async listPipeline() {
    await delay();
    return PIPELINE_TARGETS;
  },
  async addPipelineTarget(data) {
    await delay();
    return { id: "pipe-new", stage: "screening", passed: false, ...data };
  },
  async movePipelineStage(targetId, stage) {
    await delay();
    return { id: targetId, stage };
  },
  async passPipelineTarget(targetId, passReason) {
    await delay();
    return { id: targetId, passed: true, pass_reason: passReason };
  },

  // ── Verification ──────────────────────────────────────────────────────────
  async getVerifications(_reviewId) {
    await delay();
    return [
      { id: "v001", point_id: "sec_registration", category: "Regulatory", title: "SEC Registration", description: "Verify current SEC registration status via IAPD", status: "verified", override_status: null, override_note: null },
      { id: "v002", point_id: "form_adv", category: "Regulatory", title: "Form ADV Part 2A", description: "Cross-reference Form ADV with DDQ responses", status: "verified", override_status: null, override_note: null },
      { id: "v003", point_id: "crd_check", category: "Regulatory", title: "CRD Background Check", description: "FINRA BrokerCheck / IAPD for key personnel", status: "verified", override_status: null, override_note: null },
      { id: "v004", point_id: "aum_verification", category: "Financial", title: "AUM Verification", description: "Verify reported AUM against audited financials", status: "partial", override_status: null, override_note: null },
      { id: "v005", point_id: "auditor_confirm", category: "Financial", title: "Auditor Confirmation", description: "Confirm auditor identity and independence", status: "verified", override_status: null, override_note: null },
      { id: "v006", point_id: "cco_verification", category: "Personnel", title: "CCO Identity", description: "Verify dedicated CCO exists and is registered", status: "failed", override_status: null, override_note: "No dedicated CCO found. Compliance managed by PM." },
    ];
  },
  async overrideVerification(_reviewId, pointId, overrideStatus, overrideNote) {
    await delay();
    return { point_id: pointId, override_status: overrideStatus, override_note: overrideNote };
  },
  async getVerificationSummary(_reviewId) {
    await delay();
    return { total: 6, verified: 4, flagged: 1, partial: 1, failed: 1, pending: 0 };
  },

  // ── Monitoring ────────────────────────────────────────────────────────────
  async getMonitoringTasks(_reviewId) {
    await delay();
    return [
      { id: "m001", task_id: "cco_hire", category: "Personnel", title: "CCO Hire Confirmation", description: "Confirm dedicated CCO hired and registered", frequency: "One-time", status: "pending", override_status: null, override_note: null, due_date: "2026-04-30" },
      { id: "m002", task_id: "pretrade_deploy", category: "Technology", title: "Pre-Trade System Deployment", description: "Confirm Bloomberg AIM or equivalent deployed and tested", frequency: "One-time", status: "pending", override_status: null, override_note: null, due_date: "2026-06-30" },
      { id: "m003", task_id: "succession_plan", category: "Governance", title: "Succession Plan Approval", description: "Board-approved succession plan for founder/PM", frequency: "One-time", status: "pending", override_status: null, override_note: null, due_date: "2026-03-31" },
      { id: "m004", task_id: "bcp_test", category: "Operations", title: "BCP Full Test", description: "Full business continuity plan test with documented results", frequency: "One-time", status: "pending", override_status: null, override_note: null, due_date: "2026-05-31" },
      { id: "m005", task_id: "quarterly_call", category: "Ongoing", title: "Quarterly Operational Call", description: "Quarterly call with COO to review operational developments", frequency: "Quarterly", status: "completed", override_status: null, override_note: null, due_date: "2026-03-31" },
      { id: "m006", task_id: "sec_filing_check", category: "Regulatory", title: "SEC Filing Review", description: "Annual Form ADV amendment review", frequency: "Annual", status: "pending", override_status: null, override_note: null, due_date: "2026-03-31" },
    ];
  },
  async updateMonitoringTask(_reviewId, taskId, data) {
    await delay();
    return { task_id: taskId, ...data };
  },
  async getMonitoringSummary(_reviewId) {
    await delay();
    return { total: 6, completed: 1, pending: 5, overdue: 0 };
  },

  // ── KPI ───────────────────────────────────────────────────────────────────
  async getPortfolioKPIs() {
    await delay();
    return KPI_DATA.portfolio_kpis;
  },
  async getKPIAlerts() {
    await delay();
    return KPI_DATA.kpi_alerts;
  },

  // ── Activity & Notifications ──────────────────────────────────────────────
  async getActivity(limit = 20) {
    await delay();
    return ACTIVITY_FEED.slice(0, limit);
  },
  async getNotifications(limit = 20) {
    await delay();
    return KPI_DATA.kpi_alerts.slice(0, limit).map((a) => ({ ...a, read: false }));
  },
  async getUnreadCount() {
    await delay(30);
    return { count: KPI_DATA.kpi_alerts.length };
  },
  async markNotificationRead(notifId) {
    await delay(30);
    return { id: notifId, read: true };
  },
  async markAllRead() {
    await delay(30);
    return { ok: true };
  },

  // ── Chat (stub — requires engine) ─────────────────────────────────────────
  async chatStream(_slug, _question, _history) {
    // Returns a mock SSE-compatible response
    const body = new ReadableStream({
      start(controller) {
        const msg = "data: Chat requires the Alpine engine to be connected.\n\n";
        controller.enqueue(new TextEncoder().encode(msg));
        controller.close();
      },
    });
    return new Response(body, { headers: { "Content-Type": "text/event-stream" } });
  },

  // ── Monitoring Agent (stub) ───────────────────────────────────────────────
  async monGetConfig() { await delay(); return { enabled: false, note: "Engine not connected" }; },
  async monUpdateConfig(_data) { await delay(); return { ok: true }; },
  async monGetKPI() { await delay(); return {}; },
  async monGetEvents(_params) { await delay(); return []; },
  monEventStream() { return new EventSource("about:blank"); },
  async monGetTimeline(_entityId) { await delay(); return []; },
  async monGetExposure() { await delay(); return {}; },
  async monGetNotifications(_status) { await delay(); return []; },
  async monSendNotification(_id) { await delay(); return { ok: true }; },
  async monEditNotification(_id, _content) { await delay(); return { ok: true }; },
  async monGetConditions() { await delay(); return []; },
};
