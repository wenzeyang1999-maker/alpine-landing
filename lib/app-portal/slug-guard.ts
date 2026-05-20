import { NextResponse } from "next/server";

const BLOCKED_SLUGS = new Set(["ridgeline-capital"]);

export function isBlockedSlug(slug: string | null): boolean {
  return !!slug && BLOCKED_SLUGS.has(slug);
}

export function blockedResponse() {
  return NextResponse.json({ error: "not found" }, { status: 404 });
}
