/**
 * Demo API Factory
 *
 * Creates a complete set of demo API functions for any brand,
 * parameterized by base URL. Eliminates duplication between
 * br2-api.ts and future brand API clients.
 */

export interface DemoApi {
  // Auth
  login: (email: string, password: string) => Promise<any>;
  tokenLogin: (token: string) => Promise<any>;
  logout: () => Promise<any>;
  getMe: () => Promise<any>;
  refresh: () => Promise<any>;
  register: (fullName: string, email: string, organization?: string) => Promise<any>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<any>;
  // Portfolio
  listFunds: (strategy?: string, rating?: string) => Promise<any>;
  getFund: (slug: string) => Promise<any>;
  getPortfolioStats: () => Promise<any>;
  getTopicMatrix: () => Promise<any>;
  // Reviews
  listReviews: () => Promise<any>;
  getReview: (slug: string) => Promise<any>;
  createReview: (data: { name: string; fund_slug?: string; review_id?: string }) => Promise<any>;
  // IC Memo
  getMemoSections: (reviewId: string) => Promise<any>;
  getSectionHistory: (sectionId: string) => Promise<any>;
  editMemoSection: (sectionId: string, content: string, changeSummary?: string) => Promise<any>;
  revertMemoSection: (sectionId: string, versionNum: number) => Promise<any>;
  // Pipeline
  listPipeline: () => Promise<any>;
  addPipelineTarget: (data: { name: string; strategy?: string; aum?: number }) => Promise<any>;
  movePipelineStage: (targetId: string, stage: string) => Promise<any>;
  passPipelineTarget: (targetId: string, passReason: string) => Promise<any>;
  // Verification
  getVerifications: (reviewId: string) => Promise<any>;
  overrideVerification: (reviewId: string, pointId: string, overrideStatus: string, overrideNote: string) => Promise<any>;
  getVerificationSummary: (reviewId: string) => Promise<any>;
  // Monitoring
  getMonitoringTasks: (reviewId: string) => Promise<any>;
  updateMonitoringTask: (reviewId: string, taskId: string, data: Record<string, unknown>) => Promise<any>;
  getMonitoringSummary: (reviewId: string) => Promise<any>;
  // KPI
  getPortfolioKPIs: () => Promise<any>;
  getKPIAlerts: () => Promise<any>;
  // Activity & Notifications
  getActivity: (limit?: number) => Promise<any>;
  getNotifications: (limit?: number, unreadOnly?: boolean) => Promise<any>;
  getUnreadCount: () => Promise<any>;
  markNotificationRead: (notifId: string) => Promise<any>;
  markAllRead: () => Promise<any>;
  // Chat
  chatStream: (slug: string, question: string, history: Array<{ role: string; content: string }>) => Promise<Response>;
  // Monitoring Agent
  monGetConfig: () => Promise<any>;
  monUpdateConfig: (data: Record<string, unknown>) => Promise<any>;
  monGetKPI: () => Promise<any>;
  monGetEvents: (params?: { fund_id?: string; severity?: string; entity_id?: string; event_type?: string; limit?: number; offset?: number }) => Promise<any>;
  monEventStream: () => EventSource;
  monGetTimeline: (entityId: string) => Promise<any>;
  monGetExposure: () => Promise<any>;
  monGetNotifications: (status?: string) => Promise<any>;
  monSendNotification: (notificationId: string) => Promise<any>;
  monEditNotification: (notificationId: string, draftContent: string) => Promise<any>;
  monGetConditions: () => Promise<any>;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export function createDemoApi(baseUrl: string, monBaseUrl: string): DemoApi {
  async function _fetch(path: string, opts: RequestInit = {}) {
    const res = await fetch(`${baseUrl}${path}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json", ...((opts.headers as Record<string, string>) || {}) },
      ...opts,
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.detail || `API error ${res.status}`);
    }
    return res.json();
  }

  async function _monFetch(path: string, opts: RequestInit = {}) {
    const res = await fetch(`${monBaseUrl}${path}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json", ...((opts.headers as Record<string, string>) || {}) },
      ...opts,
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.detail || `API error ${res.status}`);
    }
    return res.json();
  }

  return {
    // Auth
    login: (email, password) => _fetch("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
    tokenLogin: (token) => _fetch(`/auth/token-login/${token}`, { method: "POST" }),
    logout: () => _fetch("/auth/logout", { method: "POST" }),
    getMe: () => _fetch("/auth/me"),
    refresh: () => _fetch("/auth/refresh", { method: "POST" }),
    register: (fullName: string, email: string, organization?: string) =>
      _fetch("/auth/register", { method: "POST", body: JSON.stringify({ full_name: fullName, email, organization }) }),
    changePassword: (currentPassword: string, newPassword: string) =>
      _fetch("/auth/change-password", { method: "POST", body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }) }),
    // Portfolio
    listFunds: (strategy, rating) => {
      const params = new URLSearchParams();
      if (strategy) params.set("strategy", strategy);
      if (rating) params.set("rating", rating);
      const qs = params.toString() ? `?${params.toString()}` : "";
      return _fetch(`/portfolio/${qs}`);
    },
    getFund: (slug) => _fetch(`/portfolio/fund/${slug}`),
    getPortfolioStats: () => _fetch("/portfolio/stats"),
    getTopicMatrix: () => _fetch("/portfolio/topic-matrix"),
    // Reviews
    listReviews: () => _fetch("/reviews/"),
    getReview: (slug) => _fetch(`/reviews/${slug}`),
    createReview: (data) => _fetch("/reviews/", { method: "POST", body: JSON.stringify(data) }),
    // IC Memo
    getMemoSections: (reviewId) => _fetch(`/memo/sections/${reviewId}`),
    getSectionHistory: (sectionId) => _fetch(`/memo/section/${sectionId}/history`),
    editMemoSection: (sectionId, content, changeSummary) => _fetch(`/memo/section/${sectionId}`, { method: "POST", body: JSON.stringify({ content, change_summary: changeSummary }) }),
    revertMemoSection: (sectionId, versionNum) => _fetch(`/memo/section/${sectionId}/revert/${versionNum}`, { method: "POST" }),
    // Pipeline
    listPipeline: () => _fetch("/pipeline/"),
    addPipelineTarget: (data) => _fetch("/pipeline/", { method: "POST", body: JSON.stringify(data) }),
    movePipelineStage: (targetId, stage) => _fetch(`/pipeline/${targetId}/stage`, { method: "PUT", body: JSON.stringify({ stage }) }),
    passPipelineTarget: (targetId, passReason) => _fetch(`/pipeline/${targetId}/pass`, { method: "PUT", body: JSON.stringify({ pass_reason: passReason }) }),
    // Verification
    getVerifications: (reviewId) => _fetch(`/verification/${reviewId}`),
    overrideVerification: (reviewId, pointId, overrideStatus, overrideNote) => _fetch(`/verification/${reviewId}/${pointId}/override`, { method: "POST", body: JSON.stringify({ override_status: overrideStatus, override_note: overrideNote }) }),
    getVerificationSummary: (reviewId) => _fetch(`/verification/${reviewId}/summary`),
    // Monitoring
    getMonitoringTasks: (reviewId) => _fetch(`/monitoring/${reviewId}`),
    updateMonitoringTask: (reviewId, taskId, data) => _fetch(`/monitoring/${reviewId}/${taskId}/update`, { method: "POST", body: JSON.stringify(data) }),
    getMonitoringSummary: (reviewId) => _fetch(`/monitoring/${reviewId}/summary`),
    // KPI
    getPortfolioKPIs: () => _fetch("/kpi/portfolio-kpis"),
    getKPIAlerts: () => _fetch("/kpi/kpi-alerts"),
    // Activity & Notifications
    getActivity: (limit = 20) => _fetch(`/activity?limit=${limit}`),
    getNotifications: (limit = 20, unreadOnly = false) => {
      const params = new URLSearchParams({ limit: String(limit) });
      if (unreadOnly) params.set("unread_only", "true");
      return _fetch(`/notifications?${params.toString()}`);
    },
    getUnreadCount: () => _fetch("/notifications/count"),
    markNotificationRead: (notifId) => _fetch(`/notifications/${notifId}/read`, { method: "POST" }),
    markAllRead: () => _fetch("/notifications/read-all", { method: "POST" }),
    // Chat
    chatStream: (slug, question, history) => fetch(`${baseUrl}/chat`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, question, history }),
    }),
    // Monitoring Agent
    monGetConfig: () => _monFetch("/config"),
    monUpdateConfig: (data) => _monFetch("/config", { method: "POST", body: JSON.stringify(data) }),
    monGetKPI: () => _monFetch("/kpi"),
    monGetEvents: (params) => {
      const sp = new URLSearchParams();
      if (params?.fund_id) sp.set("fund_id", params.fund_id);
      if (params?.severity) sp.set("severity", params.severity);
      if (params?.entity_id) sp.set("entity_id", params.entity_id);
      if (params?.event_type) sp.set("event_type", params.event_type);
      if (params?.limit) sp.set("limit", String(params.limit));
      if (params?.offset) sp.set("offset", String(params.offset));
      return _monFetch(`/events?${sp.toString()}`);
    },
    monEventStream: () => new EventSource(`${monBaseUrl}/events/stream`, { withCredentials: true }),
    monGetTimeline: (entityId) => _monFetch(`/timeline/${entityId}`),
    monGetExposure: () => _monFetch("/exposure"),
    monGetNotifications: (status) => {
      const params = status ? `?status=${status}` : "";
      return _monFetch(`/notifications${params}`);
    },
    monSendNotification: (notificationId) => _monFetch(`/notifications/${notificationId}/send`, { method: "POST" }),
    monEditNotification: (notificationId, draftContent) => _monFetch(`/notifications/${notificationId}/edit`, { method: "PUT", body: JSON.stringify({ draft_content: draftContent }) }),
    monGetConditions: () => _monFetch("/conditions"),
  };
}

// Pre-built instances for each brand
export const blackrockApi = createDemoApi("/api/blackrock/v2", "/api/blackrock/v2/mon-agent");
export const ewingmorrisApi = createDemoApi("/api/ewingmorris/v2", "/api/ewingmorris/v2/mon-agent");
export const alpineDemoApi = createDemoApi("/api/demo/v2", "/api/demo/v2/mon-agent");
