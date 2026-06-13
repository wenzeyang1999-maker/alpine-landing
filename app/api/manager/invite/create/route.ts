import { NextRequest, NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { managerTeamInvites } from "@/lib/db/schema";
import { getCurrentManager } from "@/lib/manager/access";

function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const manager = await getCurrentManager();
    if (!manager) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!manager.is_verified) {
      return NextResponse.json({ error: "Account not yet verified" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const label: string | null = (body.label ?? "").trim() || null;

    const rawToken = randomBytes(32).toString("hex");
    const token_hash = hashToken(rawToken);

    try {
      await db.insert(managerTeamInvites).values({
        firmId: manager.firm_id,
        tokenHash: token_hash,
        createdBy: manager.email,
        label,
      });
    } catch (error) {
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

export async function GET() {
  try {
    const manager = await getCurrentManager();
    if (!manager) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rows = await db
      .select({
        id: managerTeamInvites.id,
        tokenHash: managerTeamInvites.tokenHash,
        label: managerTeamInvites.label,
        createdAt: managerTeamInvites.createdAt,
        revokedAt: managerTeamInvites.revokedAt,
      })
      .from(managerTeamInvites)
      .where(eq(managerTeamInvites.firmId, manager.firm_id))
      .orderBy(desc(managerTeamInvites.createdAt));

    const invites = rows.map((r) => ({
      id: r.id,
      token_hash: r.tokenHash,
      label: r.label,
      created_at: r.createdAt,
      revoked_at: r.revokedAt,
    }));

    return NextResponse.json({ invites });
  } catch (err) {
    console.error("Invite list error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
