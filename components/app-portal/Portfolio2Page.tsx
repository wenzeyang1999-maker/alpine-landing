"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import { formatCurrency, relativeTime } from "@/lib/app-portal/demo-utils";
import { alpineDemoBrand } from "@/lib/app-portal/demo-brands/alpine-demo";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ── Constants ──────────────────────────────────────────────────────────────────

const TOPIC_KEYS = ["GOV", "REG", "TERMS", "SVCP", "INV", "TRADE", "VAL", "TECH", "FIN", "ASSET", "LEGAL", "RPT"] as const;
const TOPIC_LABELS: Record<string, string> = {
  GOV: "Governance", TERMS: "Terms & Structure", REG: "Regulatory",
  SVCP: "Service Providers", INV: "Investment Process", TRADE: "Trading & Execution",
  VAL: "Valuation", TECH: "Technology & Ops", FIN: "Financial Controls",
  ASSET: "Asset Verification", LEGAL: "Legal & Insurance", RPT: "Reporting",
};
const STRATEGY_LABELS: Record<string, string> = {
  equity_hedge: "Equity Hedge",
  credit: "Credit & FI",
  macro: "Global Macro",
  private_equity: "Private Equity",
  real_assets: "Real Assets",
};

// ── Nav Items ──────────────────────────────────────────────────────────────────

interface NavItem { id: string; label: string; icon: React.ReactNode; section: string; }

const NAV_ITEMS: NavItem[] = [
  {
    id: "portfolio-overview", label: "Portfolio Overview", section: "Portfolio",
    icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="5" height="5" rx="1" /><rect x="9" y="2" width="5" height="5" rx="1" /><rect x="2" y="9" width="5" height="5" rx="1" /><rect x="9" y="9" width="5" height="5" rx="1" /></svg>,
  },
  {
    id: "active-reviews", label: "Active Reviews", section: "Portfolio",
    icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4h12M2 8h12M2 12h8" /></svg>,
  },
  {
    id: "fund-universe", label: "Fund Universe", section: "Portfolio",
    icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="5.5" /><path d="M2.5 8h11M8 2.5c-2 2-2 9 0 11M8 2.5c2 2 2 9 0 11" /></svg>,
  },
  {
    id: "peer-comparison", label: "Peer Comparison", section: "Analytics",
    icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 13V7M8 13V4M12 13V9" /></svg>,
  },
  {
    id: "risk-heatmap", label: "Risk Heatmap", section: "Analytics",
    icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2l6 10H2L8 2z" /><path d="M8 6.5v2.5M8 11h.01" /></svg>,
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function ratingLabel(r: string) {
  const u = (r || "").toUpperCase();
  if (u === "ACCEPT" || u === "GREEN") return "Accept";
  if (u === "WATCHLIST" || u === "YELLOW") return "Watchlist";
  if (u === "FLAG" || u === "RED") return "Flag";
  return r || "—";
}

function ratingStyle(r: string): React.CSSProperties {
  const u = (r || "").toUpperCase();
  if (u === "ACCEPT" || u === "GREEN")
    return { color: "#91f0c7", background: "rgba(24,185,126,0.12)", border: "1px solid rgba(24,185,126,0.2)" };
  if (u === "WATCHLIST" || u === "YELLOW")
    return { color: "#fbbf24", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)" };
  if (u === "FLAG" || u === "RED")
    return { color: "#f87171", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.2)" };
  return { color: "#98a7bb", background: "rgba(148,163,184,0.08)", border: "1px solid rgba(148,163,184,0.14)" };
}

function topicDot(r: string): string {
  const u = (r || "GREEN").toUpperCase();
  if (u === "GREEN") return "#18b97e";
  if (u === "YELLOW") return "#f59e0b";
  if (u === "RED") return "#ef4444";
  return "#18b97e";
}

function canOpenFundReview(slug?: string): boolean {
  return slug === "trellis-capital-iv" || slug === "aurora-capital-iv";
}

// ── Rating Ring SVG ─────────────────────────────────────────────────────────

function RatingRing({ green, yellow, red, size = 112 }: { green: number; yellow: number; red: number; size?: number }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 120);
    return () => clearTimeout(timer);
  }, []);

  const total = green + yellow + red || 1;
  const cx = size / 2, cy = size / 2;
  const stroke = Math.max(8, Math.round(size * 0.07));
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const gPct = green / total, yPct = yellow / total, rPct = red / total;
  const gDash = gPct * circ, yDash = yPct * circ, rDash = rPct * circ;
  const gOffset = 0, yOffset = -(gPct * circ), rOffset = -((gPct + yPct) * circ);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth={stroke} />
      {green > 0 && <circle cx={cx} cy={cy} r={r} fill="none" stroke="#18b97e" strokeWidth={stroke} strokeDasharray={animated ? `${gDash} ${circ - gDash}` : `0 ${circ}`} strokeDashoffset={gOffset} strokeLinecap="butt" style={{ transition: "stroke-dasharray 0.85s ease-out 0.05s" }} />}
      {yellow > 0 && <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f59e0b" strokeWidth={stroke} strokeDasharray={animated ? `${yDash} ${circ - yDash}` : `0 ${circ}`} strokeDashoffset={yOffset} strokeLinecap="butt" style={{ transition: "stroke-dasharray 0.85s ease-out 0.16s" }} />}
      {red > 0 && <circle cx={cx} cy={cy} r={r} fill="none" stroke="#ef4444" strokeWidth={stroke} strokeDasharray={animated ? `${rDash} ${circ - rDash}` : `0 ${circ}`} strokeDashoffset={rOffset} strokeLinecap="butt" style={{ transition: "stroke-dasharray 0.85s ease-out 0.27s" }} />}
    </svg>
  );
}

// ── Profile (local demo — persists to localStorage) ────────────────────────────

interface ProfileData {
  nickname: string;
  avatar: string | null;
  passwordHash: string | null;
}

const PROFILE_STORAGE_KEY = "alpine-profile";
const DEFAULT_PROFILE: ProfileData = { nickname: "User", avatar: null, passwordHash: null };

function loadProfile(): ProfileData {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw) return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_PROFILE;
}

function saveProfile(p: ProfileData) {
  try { localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(p)); } catch {}
}

async function hashPassword(s: string): Promise<string> {
  const buf = new TextEncoder().encode(s);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const profileInputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  background: "var(--br-bg-card, #102038)",
  border: "1px solid var(--br-border, rgba(148,163,184,0.14))",
  borderRadius: 8,
  fontSize: 13.5,
  color: "var(--br-text-primary, #eff4fb)",
  outline: "none",
  fontFamily: "inherit",
};

function ProfileModal({
  profile, onClose, onSave,
}: {
  profile: ProfileData;
  onClose: () => void;
  onSave: (p: ProfileData) => void;
}) {
  const [nickname, setNickname] = useState(profile.nickname);
  const [avatar, setAvatar] = useState<string | null>(profile.avatar);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be smaller than 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatar(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  }

  async function handleSubmit() {
    setError(null);
    const next: ProfileData = { ...profile, nickname: nickname.trim() || "User", avatar };

    const touchingPassword = Boolean(newPw || confirmPw || currentPw);
    if (touchingPassword) {
      if (profile.passwordHash) {
        const currentHash = await hashPassword(currentPw);
        if (currentHash !== profile.passwordHash) {
          setError("Current password is incorrect.");
          return;
        }
      }
      if (newPw.length < 6) { setError("New password must be at least 6 characters."); return; }
      if (newPw !== confirmPw) { setError("New passwords do not match."); return; }
      next.passwordHash = await hashPassword(newPw);
    }

    setSaving(true);
    onSave(next);
    setSaving(false);
    onClose();
  }

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(7,17,29,0.72)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 440,
          background: "var(--br-bg-surface, #0d1727)",
          border: "1px solid var(--br-border, rgba(148,163,184,0.14))",
          borderRadius: 14, overflow: "hidden",
        }}
      >
        <div style={{
          padding: "16px 22px",
          borderBottom: "1px solid var(--br-border, rgba(148,163,184,0.14))",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--br-text-primary, #eff4fb)", letterSpacing: "-0.01em" }}>
            Profile settings
          </div>
          <button onClick={onClose} title="Close" style={{
            background: "transparent", border: "none", cursor: "pointer",
            color: "var(--br-text-muted, #6b7c95)", padding: 4, display: "flex",
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>
        </div>

        <div style={{ padding: "22px", display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <div style={{
              fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
              color: "var(--br-text-muted, #6b7c95)", marginBottom: 10,
            }}>Avatar</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
                backgroundColor: "#7B2CBF",
                backgroundImage: avatar
                  ? `url(${avatar})`
                  : "linear-gradient(135deg, #7B2CBF 0%, #F59E0B 100%)",
                backgroundSize: "cover", backgroundPosition: "center",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 700, fontSize: 20,
                overflow: "hidden",
                boxShadow: "0 2px 6px rgba(123,44,191,0.2)",
              }}>
                {!avatar && getInitials(nickname || "User")}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <label style={{
                  padding: "8px 14px", fontSize: 12.5, fontWeight: 600, borderRadius: 8,
                  border: "1px solid var(--br-border, rgba(148,163,184,0.2))",
                  color: "var(--br-text-primary, #eff4fb)", cursor: "pointer",
                  background: "var(--br-bg-card-hover, #162742)",
                }}>
                  Upload photo
                  <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />
                </label>
                {avatar && (
                  <button onClick={() => setAvatar(null)} style={{
                    padding: "8px 14px", fontSize: 12.5, fontWeight: 600, borderRadius: 8,
                    border: "1px solid var(--br-border, rgba(148,163,184,0.2))",
                    color: "var(--br-text-secondary, #98a7bb)", cursor: "pointer",
                    background: "transparent",
                  }}>
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <label style={{
              display: "block", fontSize: 10, fontWeight: 600, letterSpacing: "0.12em",
              textTransform: "uppercase", color: "var(--br-text-muted, #6b7c95)", marginBottom: 6,
            }}>Nickname</label>
            <input
              type="text" value={nickname} maxLength={40}
              onChange={(e) => setNickname(e.target.value)}
              style={profileInputStyle}
            />
          </div>

          <div>
            <div style={{
              fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
              color: "var(--br-text-muted, #6b7c95)", marginBottom: 10,
            }}>Change password</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {profile.passwordHash && (
                <input type="password" placeholder="Current password"
                  value={currentPw} onChange={(e) => setCurrentPw(e.target.value)}
                  style={profileInputStyle} autoComplete="current-password" />
              )}
              <input type="password" placeholder="New password"
                value={newPw} onChange={(e) => setNewPw(e.target.value)}
                style={profileInputStyle} autoComplete="new-password" />
              <input type="password" placeholder="Confirm new password"
                value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)}
                style={profileInputStyle} autoComplete="new-password" />
            </div>
            <div style={{ fontSize: 11, color: "var(--br-text-muted, #6b7c95)", marginTop: 6 }}>
              Leave blank to keep current password.
            </div>
          </div>

          {error && (
            <div style={{
              fontSize: 12.5, color: "#f87171",
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
              padding: "8px 12px", borderRadius: 8,
            }}>
              {error}
            </div>
          )}
        </div>

        <div style={{
          padding: "14px 22px",
          borderTop: "1px solid var(--br-border, rgba(148,163,184,0.14))",
          display: "flex", justifyContent: "flex-end", gap: 8,
        }}>
          <button onClick={onClose} style={{
            padding: "8px 16px", fontSize: 13, fontWeight: 600, borderRadius: 8,
            border: "1px solid var(--br-border, rgba(148,163,184,0.2))",
            color: "var(--br-text-secondary, #98a7bb)", background: "transparent", cursor: "pointer",
          }}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving} style={{
            padding: "8px 18px", fontSize: 13, fontWeight: 600, borderRadius: 8,
            border: "none", color: "#fff", background: "#7B2CBF",
            cursor: saving ? "default" : "pointer", opacity: saving ? 0.7 : 1,
          }}>
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>,
  document.body
  );
}

function ProfileMenu({ collapsed }: { collapsed: boolean }) {
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProfile(loadProfile());
    setMounted(true);
  }, []);

  function handleSave(next: ProfileData) {
    saveProfile(next);
    setProfile(next);
  }

  const initials = getInitials(profile.nickname);

  return (
    <>
      <div style={{
        padding: 8,
        borderTop: "1px solid var(--br-border, rgba(148,163,184,0.14))",
      }}>
        <button
          onClick={() => setOpen(true)}
          title={collapsed ? profile.nickname : undefined}
          style={{
            width: "100%",
            padding: collapsed ? "8px 0" : "8px 10px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            justifyContent: collapsed ? "center" : "flex-start",
            background: "transparent",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            transition: "background 0.15s",
            textAlign: "left",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,244,251,0.06)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <div style={{
            width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
            backgroundColor: "#7B2CBF",
            backgroundImage: profile.avatar
              ? `url(${profile.avatar})`
              : "linear-gradient(135deg, #7B2CBF 0%, #F59E0B 100%)",
            backgroundSize: "cover", backgroundPosition: "center",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 11.5, fontWeight: 700,
            overflow: "hidden",
          }}>
            {mounted && !profile.avatar ? initials : ""}
          </div>
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 12.5, fontWeight: 600,
                color: "var(--br-text-primary, #eff4fb)",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {mounted ? profile.nickname : " "}
              </div>
              <div style={{ fontSize: 10, color: "var(--br-text-muted, #6b7c95)" }}>
                Profile settings
              </div>
            </div>
          )}
          {!collapsed && (
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ color: "var(--br-text-muted, #6b7c95)", flexShrink: 0 }}>
              <circle cx="3" cy="8" r="1" /><circle cx="8" cy="8" r="1" /><circle cx="13" cy="8" r="1" />
            </svg>
          )}
        </button>
      </div>
      {open && <ProfileModal profile={profile} onClose={() => setOpen(false)} onSave={handleSave} />}
    </>
  );
}

// ── Sidebar ────────────────────────────────────────────────────────────────────

function Sidebar({
  activeTab, onNavigate, collapsed, onToggle,
}: {
  activeTab: string;
  onNavigate: (id: string) => void;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const sections = ["Portfolio", "Analytics"];
  return (
    <aside
      style={{
        width: collapsed ? 56 : 220,
        background: "var(--br-bg-card, #FFFFFF)",
        border: "1px solid var(--br-border, rgba(148,163,184,0.14))",
        borderRadius: 20,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        transition: "width 0.2s",
        position: "sticky",
        top: 16,
        alignSelf: "start",
        maxHeight: "calc(100vh - 80px)",
        overflowY: "auto",
      }}
    >
      {/* Logo / header */}
      <div
        style={{
          padding: collapsed ? "16px 0" : "14px 16px",
          borderBottom: "1px solid var(--br-border, rgba(148,163,184,0.14))",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          gap: 8,
        }}
      >
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <div
              style={{
                width: 26, height: 26, borderRadius: 6, flexShrink: 0,
                background: "linear-gradient(135deg, #10B981 0%, #F59E0B 50%, #7B2CBF 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F5F0E8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 18L12 6L20 18" />
              </svg>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--br-text-primary, #1A1A2E)", lineHeight: 1.2, fontFamily: "var(--font-alpine-heading), var(--font-alpine-body), sans-serif" }}>Alpine ODD</div>
              <div style={{ fontSize: 10, color: "var(--br-text-muted, #64748B)", lineHeight: 1.3 }}>Powered by Alpine</div>
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          style={{
            width: 26, height: 26, borderRadius: 6,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "transparent", border: "none", cursor: "pointer",
            color: "var(--br-text-muted, #6b7c95)",
          }}
          title={collapsed ? "Expand" : "Collapse"}
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {collapsed ? <path d="M5 3l4 4-4 4" /> : <path d="M9 3l-4 4 4 4" />}
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>
        {sections.map((section) => {
          const items = NAV_ITEMS.filter((n) => n.section === section);
          return (
            <div key={section}>
              {!collapsed && (
                <div style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: "0.12em",
                  textTransform: "uppercase", color: "var(--br-text-muted, #94A3B8)",
                  padding: "0 8px 4px", marginBottom: 2,
                }}>
                  {section}
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      title={collapsed ? item.label : undefined}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 9,
                        padding: collapsed ? "11px 0" : "9px 10px",
                        justifyContent: collapsed ? "center" : "flex-start",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: isActive ? 600 : 400,
                        transition: "background 0.15s, color 0.15s",
                        background: isActive ? "var(--br-bg-sidebar, #F1F5F9)" : "transparent",
                        border: `1px solid ${isActive ? "var(--br-border, rgba(148,163,184,0.14))" : "transparent"}`,
                        color: isActive
                          ? "var(--br-text-primary, #1A1A2E)"
                          : "var(--br-text-muted, #64748B)",
                        width: "100%",
                        textAlign: "left",
                      }}
                    >
                      <span style={{ flexShrink: 0, opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
                      {!collapsed && <span style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
      <ProfileMenu collapsed={collapsed} />
    </aside>
  );
}

// ── Fund Universe Table ────────────────────────────────────────────────────────

function FundUniverseTable({ funds, onNavigate }: { funds: any[]; onNavigate: (slug: string) => void }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string>("name");
  const [sortDir, setSortDir] = useState<1 | -1>(1);

  const filtered = funds.filter((f) =>
    !search || f.name?.toLowerCase().includes(search.toLowerCase()) ||
    f.manager_name?.toLowerCase().includes(search.toLowerCase()) ||
    f.strategy?.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    let va = a[sortKey], vb = b[sortKey];
    if (sortKey === "aum") { va = parseFloat(String(va).replace(/[^0-9.]/g, "")) || 0; vb = parseFloat(String(vb).replace(/[^0-9.]/g, "")) || 0; }
    if (sortKey === "annual_return") { va = parseFloat(String(va)) || 0; vb = parseFloat(String(vb)) || 0; }
    if (typeof va === "string") va = va.toLowerCase();
    if (typeof vb === "string") vb = vb.toLowerCase();
    return va < vb ? -sortDir : va > vb ? sortDir : 0;
  });

  function toggle(key: string) {
    if (sortKey === key) setSortDir((d) => (d === 1 ? -1 : 1));
    else { setSortKey(key); setSortDir(1); }
  }

  const ColHead = ({ k, label }: { k: string; label: string }) => (
    <th
      onClick={() => toggle(k)}
      style={{
        padding: "9px 12px", fontSize: 11, fontWeight: 600,
        letterSpacing: "0.12em", textTransform: "uppercase",
        color: sortKey === k ? "var(--br-text-primary, #eff4fb)" : "var(--br-text-muted, #6b7c95)",
        textAlign: "left", cursor: "pointer", whiteSpace: "nowrap",
        background: "transparent", borderBottom: "1px solid var(--br-border, rgba(148,163,184,0.14))",
        userSelect: "none",
      }}
    >
      {label} {sortKey === k ? (sortDir === 1 ? " ↑" : " ↓") : ""}
    </th>
  );

  return (
    <div>
      {/* Search */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--br-text-muted, #6b7c95)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}>
            <circle cx="6.5" cy="6.5" r="4" /><path d="M14 14l-3.5-3.5" />
          </svg>
          <input
            type="text"
            placeholder="Search funds..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "7px 10px 7px 32px",
              background: "var(--br-bg-card, #102038)",
              border: "1px solid var(--br-border, rgba(148,163,184,0.14))",
              borderRadius: 8, fontSize: 13,
              color: "var(--br-text-primary, #eff4fb)",
              outline: "none",
            }}
          />
        </div>
        <div style={{ fontSize: 12, color: "var(--br-text-muted, #6b7c95)" }}>
          {filtered.length} funds
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", borderRadius: 16, border: "1px solid var(--br-border, rgba(148,163,184,0.14))" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "var(--br-bg-surface, #0d1727)" }}>
              <ColHead k="name" label="Fund Name" />
              <ColHead k="strategy" label="Strategy" />
              <ColHead k="aum" label="AUM" />
              <ColHead k="annual_return" label="1Y Return" />
              <ColHead k="rating" label="Rating" />
              <th style={{ padding: "9px 12px", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--br-text-muted, #6b7c95)", textAlign: "left", background: "transparent", borderBottom: "1px solid var(--br-border, rgba(148,163,184,0.14))" }}>12-Topic Coverage</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((fund, idx) => {
              const isLast = idx === sorted.length - 1;
              const rowBorder = isLast ? "none" : "1px solid var(--br-border, rgba(148,163,184,0.07))";
              const isClickable = canOpenFundReview(fund.slug);
              const aumStr = typeof fund.aum === "number" ? formatCurrency(fund.aum) : (fund.aum || "—");
              const retStr = typeof fund.annual_return === "number"
                ? `${fund.annual_return > 0 ? "+" : ""}${fund.annual_return.toFixed(1)}%`
                : (fund.annual_return || "—");
              const retColor = typeof fund.annual_return === "number"
                ? fund.annual_return > 0 ? "#18b97e" : "#ef4444"
                : "var(--br-text-secondary)";
              return (
                <tr
                  key={fund.slug || idx}
                  onClick={() => isClickable && fund.slug && onNavigate(fund.slug)}
                  style={{
                    background: "transparent",
                    cursor: isClickable ? "pointer" : "default",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={(e) => { if (isClickable) e.currentTarget.style.background = "var(--br-bg-card-hover, #162742)"; }}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "12px 12px", borderBottom: rowBorder }}>
                    <div style={{ fontWeight: 600, color: "var(--br-text-primary, #eff4fb)", fontSize: 13.5, letterSpacing: "-0.01em" }}>{fund.name || "—"}</div>
                    {fund.manager_name && (
                      <div style={{ fontSize: 11.5, color: "var(--br-text-muted, #6b7c95)", marginTop: 2 }}>{fund.manager_name}</div>
                    )}
                  </td>
                  <td style={{ padding: "12px 12px", borderBottom: rowBorder, color: "var(--br-text-secondary, #98a7bb)", whiteSpace: "nowrap", fontSize: 13.5 }}>
                    {STRATEGY_LABELS[fund.strategy] || fund.strategy || "—"}
                  </td>
                  <td style={{ padding: "12px 12px", borderBottom: rowBorder, color: "var(--br-text-secondary, #98a7bb)", fontFamily: "var(--font-alpine-mono), monospace", whiteSpace: "nowrap", fontSize: 13.5 }}>
                    {aumStr}
                  </td>
                  <td style={{ padding: "12px 12px", borderBottom: rowBorder, fontFamily: "var(--font-alpine-mono), monospace", fontWeight: 600, color: retColor, whiteSpace: "nowrap", fontSize: 13.5 }}>
                    {retStr}
                  </td>
                  <td style={{ padding: "12px 12px", borderBottom: rowBorder }}>
                    <span style={{ ...ratingStyle(fund.rating), fontSize: 11.5, fontWeight: 600, padding: "4px 10px", borderRadius: 20, display: "inline-block", whiteSpace: "nowrap" }}>
                      {ratingLabel(fund.rating)}
                    </span>
                  </td>
                  <td style={{ padding: "12px 12px", borderBottom: rowBorder }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      {TOPIC_KEYS.map((key) => {
                        const r = fund.topic_ratings?.[key] || "GREEN";
                        const color = topicDot(r);
                        return (
                          <div
                            key={key}
                            title={`${TOPIC_LABELS[key]}: ${r}`}
                            style={{
                              width: 14,
                              height: 14,
                              borderRadius: 3,
                              background: color + "B8",
                              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18)",
                            }}
                          />
                        );
                      })}
                    </div>
                  </td>
                </tr>
              );
            })}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: "32px 12px", textAlign: "center", color: "var(--br-text-muted, #6b7c95)", fontSize: 13 }}>
                  No funds match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Active Reviews Mock Data ───────────────────────────────────────────────────

type InProgressReview = {
  slug: string;
  name: string;
  analyst: string;
  started: string;
  rating: string;
  stageBadge: string;
  stageBadgeColor: string;
  stageBadgeBg: string;
  dotColor: string;
  subtext: string;
  subtextColor: string;
  greyed: boolean;
};

// No reviews currently in progress. Add entries here to populate the
// "In Progress" section — it stays hidden while this is empty.
const IN_PROGRESS_REVIEWS: InProgressReview[] = [];

const FINALIZED_REVIEWS = [
  {
    slug: "trellis-capital-iv",
    name: "Trellis Capital IV, L.P.",
    analyst: "Priya Sharma",
    finalizedDate: "2026-05-09",
    rating: "WATCHLIST",
    dotColor: "#18b97e",
    reportFile: "/demo-docs/trellis/sample_vc_fund_iv_alt.pdf",
    reportLabel: "Trellis_Capital_IV_ODD_Report.pdf",
  },
  {
    slug: "aurora-capital-iv",
    name: "Aurora Ventures IV, L.P.",
    analyst: "James Park",
    finalizedDate: "2026-04-18",
    rating: "ACCEPT",
    dotColor: "#18b97e",
    reportFile: "/demo-docs/aurora/sample_vc_aurora_iv.pdf",
    reportLabel: "Aurora_Ventures_IV_ODD_Report.pdf",
  },
];

const FINALIZED_NOTIFS = [
  { id: "fn-trellis", fund: "Trellis Capital IV, L.P.", rating: "WATCHLIST", analyst: "Priya Sharma", date: "2 days ago", isNew: true, reportFile: "/demo-docs/trellis/sample_vc_fund_iv_alt.pdf", reportLabel: "Trellis_Capital_IV_ODD_Report.pdf" },
  { id: "fn-aurora", fund: "Aurora Ventures IV, L.P.", rating: "ACCEPT", analyst: "James Park", date: "3 weeks ago", isNew: false, reportFile: "/demo-docs/aurora/sample_vc_aurora_iv.pdf", reportLabel: "Aurora_Ventures_IV_ODD_Report.pdf" },
  { id: "fn2", fund: "Harborview Long/Short Fund", rating: "ACCEPT", analyst: "James Park", date: "7 days ago", isNew: false, reportFile: null, reportLabel: null },
  { id: "fn3", fund: "Meridian Asset Management", rating: "ACCEPT", analyst: "Priya Sharma", date: "3 weeks ago", isNew: false, reportFile: null, reportLabel: null },
];

const PIPELINE_COLUMNS = [
  {
    id: "screening",
    label: "Screening",
    dotColor: "#98a7bb",
    count: 3,
    funds: [
      { name: "Cerberus Capital Management", strategy: "private_equity" },
      { name: "Elliott Management", strategy: "credit" },
      { name: "KKR Credit Advisors", strategy: "private_equity" },
    ],
  },
  {
    id: "under_review",
    label: "Under Review",
    dotColor: "#8c7cff",
    count: 3,
    funds: [
      { name: "Two Sigma Investments", strategy: "macro" },
      { name: "Ares Capital Corp", strategy: "credit" },
      { name: "Highfields Capital", strategy: "equity_hedge" },
    ],
  },
  {
    id: "ic_ready",
    label: "IC Ready",
    dotColor: "#eff4fb",
    count: 2,
    funds: [
      { name: "Bridgewater Associates", strategy: "macro" },
      { name: "Varde Partners", strategy: "credit" },
    ],
  },
];

const UPCOMING_REVIEWS = [
  { name: "Timberline Natural Resources", tag: "Event-Driven", date: "March 2026" },
  { name: "Gladstone Capital Partners", tag: "Credit", date: "March 2026" },
  { name: "Archegos Macro Fund", tag: "Global Macro", date: "April 2026" },
  { name: "Saba Capital Management", tag: "Credit & FI", date: "April 2026" },
];

// ── Active Reviews Content ─────────────────────────────────────────────────────

function ActiveReviewsList({ reviews, onNavigate, V }: { reviews: any[]; onNavigate: (slug: string) => void; V: Record<string, string> }) {
  // Compute stats
  const activeCount = IN_PROGRESS_REVIEWS.length;
  const flagCount = IN_PROGRESS_REVIEWS.filter((r) => r.rating === "FLAG").length;
  const pipelineCount = PIPELINE_COLUMNS.reduce((s, c) => s + c.count, 0);
  const upcomingCount = UPCOMING_REVIEWS.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* ── Pipeline Status Banner ── */}
      <div style={{
        background: V.card,
        border: `1px solid ${V.border}`,
        borderRadius: 16,
        padding: "24px 28px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}>
        {/* Title row */}
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: V.text, letterSpacing: "-0.04em", lineHeight: 1.08, marginBottom: 3, fontFamily: "var(--font-alpine-heading), var(--font-alpine-body), sans-serif" }}>Active Reviews</h2>
          <p style={{ fontSize: 12, color: V.faint }}>In-progress reviews, pipeline, and upcoming schedule</p>
        </div>

        {/* Stats row — uniform 4-column grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderTop: `1px solid ${V.border}`, paddingTop: 20 }}>
          {[
            { value: activeCount,   label: "Active",   color: "#8c7cff", sub: "reviews in progress" },
            { value: flagCount,     label: "Flagged",  color: V.red,     sub: "require attention" },
            { value: pipelineCount, label: "Pipeline", color: "#8c7cff", sub: "funds under evaluation" },
            { value: upcomingCount, label: "Upcoming", color: V.faint,   sub: "next 60 days" },
          ].map(({ value, label, color, sub }, i) => (
            <div
              key={label}
              style={{
                padding: "0 28px",
                borderLeft: i > 0 ? `1px solid ${V.border}` : "none",
              }}
            >
              <div style={{ fontSize: 36, fontWeight: 800, color, letterSpacing: "-0.04em", lineHeight: 1, fontFamily: "var(--font-alpine-mono), SFMono-Regular, Menlo, monospace" }}>
                {value}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color, marginTop: 6 }}>{label}</div>
              <div style={{ fontSize: 11, color: V.faint, marginTop: 2, lineHeight: 1.4 }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── In Progress ── */}
      {IN_PROGRESS_REVIEWS.length > 0 && (
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: V.muted, marginBottom: 10 }}>
          In Progress
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {IN_PROGRESS_REVIEWS.map((rev) => {
            const fromApi = reviews.find((r: any) => r.slug === rev.slug);
            const isClickable = !rev.greyed && canOpenFundReview(rev.slug);
            return (
              <div
                key={rev.slug}
                onClick={() => isClickable && onNavigate(rev.slug)}
                style={{
                  background: V.card,
                  border: `1px solid ${V.border}`,
                  borderRadius: 16,
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  cursor: isClickable ? "pointer" : "default",
                  transition: "background 0.12s, border-color 0.12s",
                  opacity: rev.greyed ? 0.4 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isClickable) return;
                  (e.currentTarget as HTMLDivElement).style.background = V.cardHover;
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(24,185,126,0.25)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = V.card;
                  (e.currentTarget as HTMLDivElement).style.borderColor = V.border;
                }}
              >
                {/* Status dot */}
                <div style={{
                  width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
                  background: rev.dotColor,
                  boxShadow: `0 0 0 3px ${rev.dotColor}22`,
                }} />

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: V.text }}>{rev.name}</div>
                  <div style={{ fontSize: 11, color: V.muted, marginTop: 2 }}>
                    {rev.analyst} · Started {rev.started}
                    {fromApi?.updated_at && ` · Updated ${relativeTime(fromApi.updated_at)}`}
                  </div>
                  {rev.subtext && (
                    <div style={{ fontSize: 11, color: rev.subtextColor, marginTop: 4, fontWeight: 500 }}>
                      {rev.subtext}
                    </div>
                  )}
                </div>

                {/* Badges */}
                <div style={{ display: "flex", gap: 6, flexShrink: 0, alignItems: "center" }}>
                  <span style={{
                    ...ratingStyle(rev.rating),
                    fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
                  }}>
                    {ratingLabel(rev.rating)}
                  </span>
                  <span style={{
                    background: rev.stageBadgeBg,
                    color: rev.stageBadgeColor,
                    border: `1px solid ${rev.stageBadgeColor}33`,
                    fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
                  }}>
                    {rev.stageBadge}
                  </span>
                </div>

                {isClickable && (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={V.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 12l4-4-4-4" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* ── Finalized ── */}
      {FINALIZED_REVIEWS.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: V.muted, marginBottom: 10 }}>
            Finalized
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FINALIZED_REVIEWS.map((rev) => (
              <div
                key={rev.slug}
                onClick={() => canOpenFundReview(rev.slug) && onNavigate(rev.slug)}
                style={{
                  background: V.card,
                  border: `1px solid rgba(24,185,126,0.2)`,
                  borderRadius: 16,
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  cursor: canOpenFundReview(rev.slug) ? "pointer" : "default",
                  transition: "background 0.12s, border-color 0.12s",
                }}
                onMouseEnter={(e) => {
                  if (!canOpenFundReview(rev.slug)) return;
                  (e.currentTarget as HTMLDivElement).style.background = V.cardHover;
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(24,185,126,0.4)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = V.card;
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(24,185,126,0.2)";
                }}
              >
                {/* Green check dot */}
                <div style={{ width: 10, height: 10, borderRadius: "50%", flexShrink: 0, background: "#18b97e", boxShadow: "0 0 0 3px rgba(24,185,126,0.18)" }} />

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: V.text }}>{rev.name}</div>
                  <div style={{ fontSize: 11, color: V.faint, marginTop: 2 }}>
                    {rev.analyst} · Finalized {rev.finalizedDate}
                  </div>
                </div>

                {/* Rating badge */}
                <span style={{
                  ...ratingStyle(rev.rating),
                  fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, flexShrink: 0,
                }}>
                  {ratingLabel(rev.rating)}
                </span>

                {/* Download button — stop propagation so it doesn't navigate */}
                <a
                  href={rev.reportFile}
                  download={rev.reportLabel}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "6px 12px", borderRadius: 8, flexShrink: 0,
                    border: `1px solid rgba(24,185,126,0.3)`,
                    background: "rgba(24,185,126,0.08)",
                    color: "#18b97e", fontSize: 11, fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 2v8M5 7l3 3 3-3" /><path d="M2 13h12" />
                  </svg>
                  Download Report
                </a>

                {/* Chevron */}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={V.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 12l4-4-4-4" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Pipeline Kanban ── */}
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {PIPELINE_COLUMNS.map((col) => (
            <div
              key={col.id}
              style={{
                background: V.surface,
                border: `1px solid ${V.border}`,
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              {/* Column header */}
              <div style={{
                padding: "10px 14px",
                borderBottom: `1px solid ${V.border}`,
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.dotColor }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: V.text }}>{col.label}</span>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  color: V.muted,
                  background: V.card,
                  border: `1px solid ${V.border}`,
                  borderRadius: 10, padding: "1px 7px",
                }}>
                  {col.count}
                </span>
              </div>

              {/* Fund cards */}
              <div style={{ padding: "8px 10px", display: "flex", flexDirection: "column", gap: 6 }}>
                {col.funds.map((fund) => (
                  <div
                    key={fund.name}
                    style={{
                      background: V.card,
                      border: `1px solid ${V.border}`,
                      borderRadius: 8,
                      padding: "9px 11px",
                      cursor: "default",
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 500, color: V.text, marginBottom: 4 }}>{fund.name}</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 10, color: V.muted }}>
                        {STRATEGY_LABELS[fund.strategy] || fund.strategy}
                      </span>
                      <span style={{ fontSize: 10, color: V.faint || V.muted, fontFamily: "var(--font-alpine-mono), monospace" }}>0d</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Upcoming Reviews ── */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: V.muted, marginBottom: 10 }}>
          Upcoming Reviews
        </div>
        <div style={{
          background: V.card,
          border: `1px solid ${V.border}`,
          borderRadius: 16,
          overflow: "hidden",
        }}>
          {UPCOMING_REVIEWS.map((item, idx) => (
            <div
              key={item.name}
              style={{
                padding: "12px 18px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                borderBottom: idx < UPCOMING_REVIEWS.length - 1 ? `1px solid ${V.border}` : "none",
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: V.muted, flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: 13, fontWeight: 500, color: V.text }}>{item.name}</div>
              <span style={{
                fontSize: 10, color: V.sub,
                background: "rgba(148,163,184,0.08)",
                border: `1px solid ${V.border}`,
                borderRadius: 8, padding: "2px 8px",
              }}>
                {item.tag}
              </span>
              <span style={{ fontSize: 11, color: V.muted, fontFamily: "var(--font-alpine-mono), monospace", whiteSpace: "nowrap" }}>{item.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Risk Heatmap (mini) ────────────────────────────────────────────────────────

function RiskHeatmapView({ funds }: { funds: any[] }) {
  if (funds.length === 0) return <div style={{ textAlign: "center", padding: 48, color: "var(--br-text-muted)" }}>Loading...</div>;

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ background: "var(--br-bg-surface, #0d1727)" }}>
            <th style={{ padding: "8px 12px", textAlign: "left", fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--br-text-muted)", borderBottom: "1px solid var(--br-border)", whiteSpace: "nowrap" }}>Fund</th>
            {TOPIC_KEYS.map((key) => (
              <th key={key} style={{ padding: "6px 4px", fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--br-text-muted)", borderBottom: "1px solid var(--br-border)", textAlign: "center", minWidth: 36 }} title={TOPIC_LABELS[key]}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {funds.map((fund, idx) => (
            <tr key={fund.slug || idx}>
              <td style={{ padding: "8px 12px", borderBottom: "1px solid var(--br-border, rgba(148,163,184,0.07))", color: "var(--br-text-secondary)", fontWeight: 500, whiteSpace: "nowrap", fontSize: 12 }}>{fund.name}</td>
              {TOPIC_KEYS.map((key) => {
                const r = (fund.topic_ratings?.[key] || "GREEN").toUpperCase();
                const bg = r === "GREEN" ? "rgba(24,185,126,0.18)" : r === "YELLOW" ? "rgba(245,158,11,0.18)" : "rgba(239,68,68,0.18)";
                const color = r === "GREEN" ? "#18b97e" : r === "YELLOW" ? "#f59e0b" : "#ef4444";
                return (
                  <td key={key} title={`${TOPIC_LABELS[key]}: ${r}`} style={{ padding: "6px 4px", textAlign: "center", borderBottom: "1px solid var(--br-border, rgba(148,163,184,0.07))" }}>
                    <div style={{ width: 28, height: 20, borderRadius: 4, background: bg, color, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
                      {r.charAt(0)}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Peer Comparison (mini) ─────────────────────────────────────────────────────

function PeerComparisonView({ funds }: { funds: any[] }) {
  const topicStats = TOPIC_KEYS.map((key) => {
    const total = funds.length || 1;
    const green = funds.filter((f) => (f.topic_ratings?.[key] || "GREEN") === "GREEN").length;
    const yellow = funds.filter((f) => (f.topic_ratings?.[key] || "GREEN") === "YELLOW").length;
    const red = funds.filter((f) => (f.topic_ratings?.[key] || "GREEN") === "RED").length;
    return { key, green, yellow, red, pct: Math.round((green / total) * 100) };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {topicStats.sort((a, b) => a.pct - b.pct).map((t) => (
        <div key={t.key} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 48, fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "var(--br-text-muted)", textTransform: "uppercase" }}>{t.key}</div>
          <div style={{ flex: 1, height: 8, borderRadius: 4, background: "var(--br-bg-card, #102038)", overflow: "hidden", display: "flex" }}>
            <div style={{ width: `${(t.green / (funds.length || 1)) * 100}%`, background: "#18b97e", transition: "width 0.3s" }} />
            <div style={{ width: `${(t.yellow / (funds.length || 1)) * 100}%`, background: "#f59e0b", transition: "width 0.3s" }} />
            <div style={{ width: `${(t.red / (funds.length || 1)) * 100}%`, background: "#ef4444", transition: "width 0.3s" }} />
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, fontFamily: "var(--font-alpine-mono), monospace", color: t.pct >= 75 ? "#18b97e" : t.pct >= 50 ? "#f59e0b" : "#ef4444", width: 36, textAlign: "right" }}>{t.pct}%</div>
          <div style={{ fontSize: 11, color: "var(--br-text-muted)", width: 80, whiteSpace: "nowrap" }}>{TOPIC_LABELS[t.key]}</div>
        </div>
      ))}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function Portfolio2Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => searchParams?.get("tab") ?? "portfolio-overview");
  const [contentTab, setContentTab] = useState("fund-universe");
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("light");

  const [funds, setFunds] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [readNotifs, setReadNotifs] = useState<Set<string>>(new Set());
  const notifRef = useRef<HTMLDivElement>(null);
  const unreadCount = FINALIZED_NOTIFS.filter((n) => n.isNew && !readNotifs.has(n.id)).length;

  // Force dark blackrock theme while on this page
  useEffect(() => {
    const html = document.documentElement;
    const prevTheme = html.getAttribute("data-theme");
    const prevBrand = html.getAttribute("data-brand");
    html.setAttribute("data-theme", "light");
    html.setAttribute("data-brand", "blackrock");
    setTheme("light");
    return () => {
      if (prevTheme) html.setAttribute("data-theme", prevTheme);
      else html.removeAttribute("data-theme");
      if (prevBrand) html.setAttribute("data-brand", prevBrand);
      else html.removeAttribute("data-brand");
    };
  }, []);

  // Fetch data
  useEffect(() => {
    const api = alpineDemoBrand.api;
    Promise.all([
      api.listFunds().catch(() => ({ funds: [] })),
      api.listReviews().catch(() => ({ reviews: [] })),
      api.getPortfolioKPIs().catch(() => null),
    ]).then(([fn, rv, kp]) => {
      setFunds((fn as any)?.funds || fn || []);
      setReviews((rv as any)?.reviews || rv || []);
      setKpis(kp);
      setLoading(false);
    });
  }, []);

  const toggleTheme = useCallback(() => {
    const html = document.documentElement;
    const next: "dark" | "light" = theme === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    setTheme(next);
  }, [theme]);

  useEffect(() => {
    if (!notifOpen) return;
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [notifOpen]);

  function navigateToFund(slug: string, from?: string) {
    const qs = from ? `?from=${from}` : "";
    router.push(`/review2/${slug}${qs}`);
  }

  // Computed stats
  const fundCount = funds.length || (kpis?.fund_count ?? 18);
  const totalAum = kpis?.total_aum || "$34.7B";
  const avgReturn = kpis?.avg_return || "10.8%";
  const acceptCount = funds.filter((f: any) => (f.rating || "").toUpperCase() === "ACCEPT").length ||
    (kpis?.rating_distribution?.ACCEPT ?? 11);
  const watchlistCount = funds.filter((f: any) => (f.rating || "").toUpperCase() === "WATCHLIST").length ||
    (kpis?.rating_distribution?.WATCHLIST ?? 5);
  const flagCount = funds.filter((f: any) => (f.rating || "").toUpperCase() === "FLAG").length ||
    (kpis?.rating_distribution?.FLAG ?? 2);
  const strategies = new Set(funds.map((f: any) => f.strategy).filter(Boolean));
  const strategyCount = strategies.size || 5;
  const activeReviewCount = reviews.filter((r: any) =>
    r.status === "in_progress" || r.stage === "analysis" || r.stage === "verification"
  ).length || 4;

  // ODD score
  const primaryReview = reviews.find((r: any) => r.slug === "ridgeline-capital") || reviews[0];
  const oddScore = primaryReview?.overall_score || primaryReview?.score || 68;

  const isDark = theme === "dark";

  const V = isDark ? {
    bg: "#07111d",
    surface: "#111d30",
    surface2: "#14233a",
    card: "#102038",
    cardHover: "#162742",
    sidebar: "#14233a",
    border: "rgba(148,163,184,0.14)",
    borderSubtle: "rgba(148,163,184,0.07)",
    text: "#eff4fb",
    sub: "#98a7bb",
    muted: "#98a7bb",
    faint: "#6b7c95",
    green: "#18b97e",
    amber: "#f2a93b",
    red: "#ef5b5b",
  } : {
    bg: "#F0F4F8",
    surface: "#F8FAFC",
    surface2: "#F1F5F9",
    card: "#FFFFFF",
    cardHover: "#F8FAFC",
    sidebar: "#F1F5F9",
    border: "rgba(15,23,42,0.10)",
    borderSubtle: "rgba(15,23,42,0.05)",
    text: "#0F172A",
    sub: "#475569",
    muted: "#475569",
    faint: "#94A3B8",
    green: "#18b97e",
    amber: "#f2a93b",
    red: "#ef5b5b",
  };

  // ── Render ──
  return (
    <div
      style={{
        minHeight: "100vh",
        background: V.bg,
        fontFamily: "var(--font-alpine-body), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        "--br-bg-card": V.card,
        "--br-bg-sidebar": V.surface2,
        "--br-border": V.border,
        "--br-text-primary": V.text,
        "--br-text-muted": V.faint,
      } as React.CSSProperties}
    >
      <style>{`
        @keyframes portfolioRingIn {
          0% { opacity: 0; transform: translateY(10px) scale(0.94); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes portfolioRingLabelIn {
          0% { opacity: 0; transform: scale(0.92); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div style={{ width: "min(1440px, calc(100% - 80px))", margin: "24px auto" }}>
        {/* ── Top Bar ── */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 18,
            padding: "14px 20px",
            border: `1px solid ${V.border}`,
            borderRadius: 18,
            background: isDark ? "rgba(8,17,29,0.88)" : "rgba(255,255,255,0.92)",
            backdropFilter: "blur(16px)",
          }}
        >
          {/* Left: logo + two-line title (matches Review2Page layout) */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <a href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
              <div
                style={{
                  width: 26, height: 26, borderRadius: 6, flexShrink: 0,
                  background: "linear-gradient(135deg, #10B981 0%, #F59E0B 50%, #7B2CBF 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F5F0E8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 18L12 6L20 18" />
                </svg>
              </div>
            </a>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: V.text, letterSpacing: "-0.01em" }}>Alpine ODD</div>
              <div style={{ fontSize: 12, color: V.muted }}>
                Portfolio{activeTab !== "portfolio-overview"
                  ? ` / ${NAV_ITEMS.find((n) => n.id === activeTab)?.label ?? ""}`
                  : " / Overview"}
              </div>
            </div>
          </div>

          {/* Right: notification bell + theme toggle + sign out */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

            {/* Notification bell */}
            <div ref={notifRef} style={{ position: "relative" }}>
              <button
                onClick={() => setNotifOpen((o) => !o)}
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  border: `1px solid ${V.border}`, background: notifOpen ? V.surface2 : "transparent",
                  color: V.muted, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.15s", position: "relative",
                }}
                title="Notifications"
              >
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 2a5 5 0 00-5 5v2l-1 2h12l-1-2V7a5 5 0 00-5-5z" />
                  <path d="M6.5 13a1.5 1.5 0 003 0" />
                </svg>
                {unreadCount > 0 && (
                  <span style={{
                    position: "absolute", top: 5, right: 5,
                    width: 7, height: 7, borderRadius: "50%",
                    background: "#ef5b5b",
                    border: `1.5px solid ${isDark ? "#111d30" : "#FFFFFF"}`,
                  }} />
                )}
              </button>

              {notifOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 100,
                  width: 340,
                  background: isDark ? "#111d30" : "#FFFFFF",
                  border: `1px solid ${V.border}`,
                  borderRadius: 14,
                  boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.45)" : "0 8px 32px rgba(15,23,42,0.12)",
                  overflow: "hidden",
                }}>
                  <div style={{ padding: "12px 16px", borderBottom: `1px solid ${V.border}`, fontSize: 12, fontWeight: 600, color: V.text, letterSpacing: "0.02em" }}>
                    Notifications
                  </div>
                  {FINALIZED_NOTIFS.map((n, i) => {
                    const isUnread = n.isNew && !readNotifs.has(n.id);
                    return (
                      <div
                        key={n.id}
                        style={{
                          padding: "12px 16px",
                          borderBottom: i < FINALIZED_NOTIFS.length - 1 ? `1px solid ${V.border}` : "none",
                          background: isUnread ? (isDark ? "rgba(239,91,91,0.05)" : "rgba(239,91,91,0.03)") : "transparent",
                          display: "flex", flexDirection: "column", gap: 4,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            {isUnread && (
                              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef5b5b", flexShrink: 0 }} />
                            )}
                            <span style={{ fontSize: 12, fontWeight: 600, color: V.text }}>{n.fund}</span>
                          </div>
                          <span style={{
                            fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
                            padding: "2px 7px", borderRadius: 6,
                            background: n.rating === "ACCEPT" ? "rgba(24,185,126,0.12)" : n.rating === "FLAG" ? "rgba(239,91,91,0.12)" : "rgba(242,169,59,0.12)",
                            color: n.rating === "ACCEPT" ? "#18b97e" : n.rating === "FLAG" ? "#ef5b5b" : "#f2a93b",
                          }}>
                            {n.rating}
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: V.faint }}>ODD review finalized · {n.analyst}</div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
                          <span style={{ fontSize: 10, color: V.faint }}>{n.date}</span>
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            {n.reportFile && (
                              <a
                                href={n.reportFile}
                                download={n.reportLabel ?? undefined}
                                onClick={() => setReadNotifs((s) => new Set(Array.from(s).concat(n.id)))}
                                style={{
                                  fontSize: 10, fontWeight: 600, color: "#18b97e",
                                  textDecoration: "none", display: "flex", alignItems: "center", gap: 3,
                                }}
                              >
                                <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M8 2v8M5 7l3 3 3-3" /><path d="M2 13h12" />
                                </svg>
                                Download Report
                              </a>
                            )}
                            {isUnread && (
                              <button
                                onClick={() => setReadNotifs((s) => new Set(Array.from(s).concat(n.id)))}
                                style={{ fontSize: 10, color: V.faint, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                              >
                                Dismiss
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              onClick={toggleTheme}
              style={{
                padding: "10px 16px", fontSize: 13, borderRadius: 10,
                border: `1px solid ${V.border}`, background: "transparent",
                color: V.muted, cursor: "pointer",
              }}
            >
              {isDark ? "☀ Light" : "☾ Dark"}
            </button>
            <button
              onClick={() => {
                localStorage.removeItem(alpineDemoBrand.userStorageKey);
                router.push("/");
              }}
              style={{
                padding: "10px 16px", fontSize: 13, borderRadius: 10,
                border: `1px solid ${V.border}`, background: "transparent",
                color: V.muted, cursor: "pointer",
              }}
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* ── Workspace ── */}
        <div style={{ display: "grid", gridTemplateColumns: `${collapsed ? 56 : 220}px 1fr`, gap: 16, marginTop: 14, alignItems: "start" }}>
          {/* Sidebar */}
          <Sidebar
            activeTab={activeTab}
            onNavigate={setActiveTab}
            collapsed={collapsed}
            onToggle={() => setCollapsed((c) => !c)}
          />

          {/* Main content */}
          <main
            style={{
              minWidth: 0,
              paddingBottom: 48,
            }}
          >
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ height: i === 1 ? 140 : 80, borderRadius: 16, background: V.card, opacity: 0.6 }} />
              ))}
            </div>
          ) : activeTab === "portfolio-overview" ? (
            <PortfolioOverviewContent
              fundCount={fundCount} strategyCount={strategyCount} totalAum={totalAum} avgReturn={avgReturn}
              acceptCount={acceptCount} watchlistCount={watchlistCount} flagCount={flagCount}
              oddScore={oddScore} activeReviewCount={activeReviewCount}
              funds={funds} reviews={reviews} contentTab={contentTab}
              setContentTab={setContentTab} onNavigate={navigateToFund} V={V}
            />
          ) : activeTab === "active-reviews" ? (
            <div>
              <ActiveReviewsList reviews={reviews} onNavigate={(s) => navigateToFund(s, "active-reviews")} V={V} />
            </div>
          ) : activeTab === "fund-universe" ? (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: V.text, letterSpacing: "-0.04em", lineHeight: 1.08, marginBottom: 4, fontFamily: "var(--font-alpine-heading), var(--font-alpine-body), sans-serif" }}>Fund Universe</h2>
                <p style={{ fontSize: 12, color: V.muted }}>{fundCount} monitored funds across {strategyCount} strategies</p>
              </div>
              <FundUniverseTable funds={funds} onNavigate={(s) => navigateToFund(s, "fund-universe")} />
            </div>
          ) : activeTab === "peer-comparison" ? (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: V.text, letterSpacing: "-0.04em", lineHeight: 1.08, marginBottom: 4, fontFamily: "var(--font-alpine-heading), var(--font-alpine-body), sans-serif" }}>Peer Comparison</h2>
                <p style={{ fontSize: 12, color: V.muted }}>ODD topic health across portfolio</p>
              </div>
              <PeerComparisonView funds={funds} />
            </div>
          ) : activeTab === "risk-heatmap" ? (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: V.text, letterSpacing: "-0.04em", lineHeight: 1.08, marginBottom: 4, fontFamily: "var(--font-alpine-heading), var(--font-alpine-body), sans-serif" }}>Risk Heatmap</h2>
                <p style={{ fontSize: 12, color: V.muted }}>Topic-level risk across {fundCount} funds</p>
              </div>
              <RiskHeatmapView funds={funds} />
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: 64, color: V.muted, fontSize: 14 }}>Coming soon</div>
          )}
          </main>
        </div>
      </div>
    </div>
  );
}

// ── Portfolio Overview Content ─────────────────────────────────────────────────

function PortfolioOverviewContent({
  fundCount, strategyCount, totalAum, avgReturn,
  acceptCount, watchlistCount, flagCount, oddScore, activeReviewCount,
  funds, reviews, contentTab, setContentTab, onNavigate, V,
}: {
  fundCount: number; strategyCount: number; totalAum: string | number; avgReturn: string | number;
  acceptCount: number; watchlistCount: number; flagCount: number; oddScore: number; activeReviewCount: number;
  funds: any[]; reviews: any[]; contentTab: string;
  setContentTab: (t: string) => void; onNavigate: (slug: string, from?: string) => void;
  V: Record<string, string>;
}) {
  const aumStr = typeof totalAum === "number" ? formatCurrency(totalAum) : totalAum;
  const retStr = typeof avgReturn === "number" ? `${avgReturn > 0 ? "+" : ""}${avgReturn.toFixed(1)}%` : avgReturn;

  // Topic health %
  const topicHealthPcts = TOPIC_KEYS.map((key) => {
    if (funds.length === 0) return { key, pct: 100 };
    const greenCount = funds.filter((f: any) => (f.topic_ratings?.[key] || "GREEN") === "GREEN").length;
    return { key, pct: Math.round((greenCount / funds.length) * 100) };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── Hero Card ── */}
      <div
        style={{
          background: V.card,
          border: `1px solid ${V.border}`,
          borderRadius: 16,
          padding: "18px 22px",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 184px",
          gap: 20,
          alignItems: "stretch",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
          <div>
            <div style={{
              fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
              color: V.muted, marginBottom: 8,
            }}>
              Alpine ODD Platform · Portfolio Monitor
            </div>
            <h1 style={{
              fontSize: 24, fontWeight: 800, color: V.text,
              letterSpacing: "-0.04em", lineHeight: 1.08, marginBottom: 12,
              fontFamily: "var(--font-alpine-heading), var(--font-alpine-body), sans-serif",
            }}>
              {fundCount} funds · {strategyCount} strategies · {aumStr} AUM
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: V.green }} />
                <span style={{ fontSize: 12, color: V.sub, fontWeight: 500 }}>{acceptCount} Accept</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: V.amber }} />
                <span style={{ fontSize: 12, color: V.sub, fontWeight: 500 }}>{watchlistCount} Watchlist</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: V.red }} />
                <span style={{ fontSize: 12, color: V.sub, fontWeight: 500 }}>{flagCount} Flag</span>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, auto))",
              gap: 16,
              alignItems: "end",
            }}
          >
            {[
              { label: "Avg Return", value: retStr, color: V.green },
              { label: "Active Reviews", value: String(activeReviewCount), color: V.text },
              { label: "Flagged", value: String(flagCount), color: flagCount > 0 ? V.red : V.green },
              { label: "Portfolio Score", value: String(oddScore), color: V.text },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ minWidth: 84 }}>
                <div style={{
                  fontSize: 9, fontWeight: 600, letterSpacing: "0.12em",
                  textTransform: "uppercase", color: V.muted, marginBottom: 5,
                }}>
                  {label}
                </div>
                <div style={{
                  fontSize: 20, fontWeight: 700, color,
                  letterSpacing: "-0.03em", lineHeight: 1.05, fontFamily: "var(--font-alpine-mono), SFMono-Regular, Menlo, monospace",
                }}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          <div>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: V.muted, marginBottom: 8 }}>
            Portfolio Topic Health
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {topicHealthPcts.map(({ key, pct }) => {
              const color = pct >= 80 ? V.green : pct >= 55 ? V.amber : V.red;
              return (
                <div
                  key={key}
                  title={`${TOPIC_LABELS[key]}: ${pct}% pass`}
                  style={{
                    minWidth: 56,
                    padding: "6px 8px",
                    borderRadius: 9,
                    background: color + "14",
                    border: `1px solid ${color}28`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <span style={{ fontSize: 9, fontWeight: 700, color, fontFamily: "var(--font-alpine-mono), monospace" }}>{key}</span>
                  <span style={{ fontSize: 9, color, fontFamily: "var(--font-alpine-mono), monospace" }}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100%",
            borderLeft: `1px solid ${V.border}`,
            paddingLeft: 16,
          }}
        >
          <div
            style={{
              position: "relative",
              width: 144,
              minHeight: 164,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              animation: "portfolioRingIn 0.7s cubic-bezier(0.2, 0.8, 0.2, 1)",
            }}
          >
            <div style={{ position: "relative", width: 144, height: 144, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <RatingRing green={acceptCount} yellow={watchlistCount} red={flagCount} size={144} />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  animation: "portfolioRingLabelIn 0.8s ease-out",
                }}
              >
                <span style={{ fontSize: 40, fontWeight: 800, color: V.text, letterSpacing: "-0.05em", lineHeight: 1, fontFamily: "var(--font-alpine-mono), SFMono-Regular, Menlo, monospace" }}>
                  {oddScore}
                </span>
                <span style={{ fontSize: 11, color: V.muted, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  ODD
                </span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, textAlign: "center" }}>
              <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: V.muted }}>
                Portfolio Score
              </span>
              <span style={{ fontSize: 10, color: V.sub, lineHeight: 1.35 }}>
                Weighted from manager ratings, open reviews, and flagged exceptions
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI Metric Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {[
          {
            label: "Portfolio ODD Score",
            value: String(oddScore),
            sub: "Ridgeline Capital (primary)",
            color: V.amber,
          },
          {
            label: "Flagged Funds",
            value: String(flagCount),
            sub: `${flagCount > 0 ? "Requires immediate review" : "All clear"}`,
            color: flagCount > 0 ? V.red : V.green,
          },
          {
            label: "Active Reviews",
            value: String(activeReviewCount),
            sub: "Currently in progress",
            color: V.text,
          },
          {
            label: "Total AUM",
            value: aumStr as string,
            sub: `${fundCount} funds · ${strategyCount} strategies`,
            color: V.text,
          },
        ].map(({ label, value, sub, color }) => (
          <div
            key={label}
            style={{
              background: V.card,
              border: `1px solid ${V.border}`,
              borderRadius: 16,
              padding: "16px 18px",
            }}
          >
            <div style={{
              fontSize: 10, fontWeight: 600, letterSpacing: "0.12em",
              textTransform: "uppercase", color: V.muted, marginBottom: 8,
            }}>
              {label}
            </div>
            <div style={{
              fontSize: 26, fontWeight: 700, color,
              letterSpacing: "-0.03em", lineHeight: 1.1, fontFamily: "var(--font-alpine-mono), SFMono-Regular, Menlo, monospace",
              marginBottom: 4,
            }}>
              {value}
            </div>
            <div style={{ fontSize: 11, color: V.muted, marginTop: 4 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* ── Content Tab Bar ── */}
      <div>
        <div style={{ display: "flex", gap: 4, padding: 4, background: V.surface, borderRadius: 10, border: `1px solid ${V.border}`, width: "fit-content", marginBottom: 16 }}>
          {[
            { id: "fund-universe", label: "Fund Universe" },
            { id: "active-reviews", label: "Active Reviews" },
          ].map(({ id, label }) => {
            const isActive = contentTab === id;
            return (
              <button
                key={id}
                onClick={() => setContentTab(id)}
                style={{
                  padding: "6px 16px",
                  borderRadius: 7,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: isActive ? 600 : 400,
                  background: isActive ? V.card : "transparent",
                  color: isActive ? V.text : V.muted,
                  transition: "all 0.15s",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {contentTab === "fund-universe" ? (
          <FundUniverseTable funds={funds} onNavigate={(s) => onNavigate(s, "fund-universe")} />
        ) : (
          <ActiveReviewsList reviews={reviews} onNavigate={(s) => onNavigate(s, "active-reviews")} V={V} />
        )}
      </div>
    </div>
  );
}
