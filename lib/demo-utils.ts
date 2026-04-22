/**
 * Shared utilities for demo shells (Valstone v2 + BlackRock v2).
 */

/** Relative time formatting: "2m ago", "3h ago", "1d ago", "Mar 15" */
export function relativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = Date.now();
  const diff = now - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Format currency: $42.0M, $1.2B, $850K */
export function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

/** Score-based color: green ≥75, amber 50-74, red <50 */
export function factorColor(score: number): "green" | "amber" | "red" {
  if (score >= 75) return "green";
  if (score >= 50) return "amber";
  return "red";
}

/** CSS class for factor score coloring (Tailwind) */
export function factorColorClass(score: number): string {
  if (score >= 75) return "text-emerald-400";
  if (score >= 50) return "text-amber-400";
  return "text-red-400";
}

/** Background CSS class for factor score */
export function factorBgClass(score: number): string {
  if (score >= 75) return "bg-emerald-400/20";
  if (score >= 50) return "bg-amber-400/20";
  return "bg-red-400/20";
}
