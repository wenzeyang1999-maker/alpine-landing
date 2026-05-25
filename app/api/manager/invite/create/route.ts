import { NextRequest, NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";
import { getCurrentManager } from "@/lib/manager/access";
import { managerDb } from "@/lib/manager/db";

function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

type InviteRow = { id: string; token_hash: string; created_at: string; revoked_at: string | null };

export async function POST(req: NextRequest) {
  try {
    const manager = await getCurrentManager();
    if (!manager) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!manager.is_verified) {
      return NextResponse.json({ error: "Account not yet verified" }, { status: 403 });
    }
    if (manager.role !== "owner") {
      return NextResponse.json({ error: "Only workspace owners can generate invite links" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const label: string = (body.label ?? "").trim() || null;

    const rawToken = randomBytes(32).toString("hex");
    const token_hash = hashToken(rawToken);

    const db = managerDb();
    const { error } = await db.from("team_invites").insert({
      firm_id: manager.firm_id,
      token_hash,
      created_by: manager.email,
      label,
    }) as { error: unknown };

    if (error) {
      console.error("Invite create error:", error);
      return NextResponse.json({ error: "Could not create invite" }, { status: 500 });
    }

    const origin = req.headers.get("origin") ?? "https://manager.alpinedd.com";
    const inviteUrl = `${origin}/manager/invite/${rawToken}`;

    return NextResponse.json({ ok: true, inviteUrl, token: rawToken }, { status: 201 });
  } catch (err) {
    console.error("Invite create error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const manager = await getCurrentManager();
    if (!manager) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = managerDb();
    const { data } = await db
      .from("team_invites")
      .select("id, token_hash, label, created_at, revoked_at")
      .eq("firm_id", manager.firm_id)
      .order("created_at", { ascending: false }) as { data: (InviteRow & { label: string | null })[] | null };

    return NextResponse.json({ invites: data ?? [] });
  } catch (err) {
    console.error("Invite list error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
