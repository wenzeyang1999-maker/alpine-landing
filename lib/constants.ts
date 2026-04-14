// Alpine Landing Page — Design Tokens
// All components import from here. Never hardcode colors.

// ── Backgrounds (warm white) ──────────────────────────────────────────────
export const BG         = "#F7F8F8";   // page background — warm white
export const BG_ALT     = "#F3F4F5";   // subtle section alt
export const BG_CARD    = "#FFFFFF";   // card surface — pure white on warm bg
// Tinted section backgrounds — very subtle color washes, not aggressive
export const BG_VIOLET  = "#F5F1FC";   // faint violet tint — engine / question tree sections
export const BG_GREEN   = "#F0FAF6";   // faint green tint  — pricing / value sections
export const BG_AMBER   = "#FDF8EE";   // faint amber tint  — methodology / trust sections

// ── Text ──────────────────────────────────────────────────────────────────
export const INK     = "#0F0F10";   // primary text — near-black
export const SECONDARY = "#3A3A4A"; // secondary text — body, descriptions
export const MUTED   = "#6B7280";   // tertiary — placeholders, metadata
export const SUBTLE  = "#9CA3AF";   // quaternary — timestamps, disabled

// ── Brand (Alpine violet — kept, replaces Linear indigo) ──────────────────
export const VIOLET  = "#7B2CBF";   // primary CTA — Alpine brand
export const VIOLET_HOVER = "#9333EA"; // hover state
export const GREEN   = "#10B981";   // ACCEPT / positive status
export const AMBER   = "#F59E0B";   // WATCHLIST / warning

// ── Borders ───────────────────────────────────────────────────────────────
export const BORDER  = "#E5E7EB";   // standard card border
export const BORDER_SUBTLE = "#F3F4F6"; // very subtle divider

// ── Letter spacing (negative at display sizes) ───────────────────────────
// Use these as inline style letterSpacing values
export const LS_DISPLAY  = "-1.056px"; // 48px headlines
export const LS_H1       = "-0.704px"; // 32px section titles
export const LS_H2       = "-0.288px"; // 24px sub-headings
export const LS_H3       = "-0.24px";  // 20px card headers
export const LS_BODY     = "-0.165px"; // 15–18px body
