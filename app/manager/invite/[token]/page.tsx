import { createHash } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { managerTeamInvites, firmsInManager } from "@/lib/db/schema";
import InviteAcceptForm from "./InviteAcceptForm";
import Link from "next/link";
import { BG, INK, MUTED, BORDER } from "@/lib/constants";

export default async function InviteAcceptPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const tokenHash = createHash("sha256").update(token).digest("hex");

  let firmName: string | null = null;
  let invalid = false;
  let revoked = false;

  try {
    const [invite] = await db
      .select({ id: managerTeamInvites.id, firmId: managerTeamInvites.firmId, revokedAt: managerTeamInvites.revokedAt })
      .from(managerTeamInvites)
      .where(eq(managerTeamInvites.tokenHash, tokenHash))
      .limit(1);

    if (!invite) {
      invalid = true;
    } else if (invite.revokedAt) {
      revoked = true;
    } else {
      const [firm] = await db
        .select({ name: firmsInManager.name })
        .from(firmsInManager)
        .where(eq(firmsInManager.id, invite.firmId))
        .limit(1);
      firmName = firm?.name ?? null;
    }
  } catch {
    invalid = true;
  }

  if (invalid || revoked) {
    return (
      <main style={{ background: BG, color: INK }} className="min-h-screen">
        <nav className="max-w-3xl mx-auto px-6 py-5">
          <Link href="/manager/landing" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/alpine-logo-dark.svg?v=5" alt="Alpine" style={{ height: 32, width: "auto" }} />
            <span className="font-mono text-[10px] uppercase pl-3"
              style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.1em", borderLeft: `1px solid ${BORDER}` }}>
              For Managers
            </span>
          </Link>
        </nav>
        <section className="max-w-md mx-auto px-6 pt-16 pb-24 text-center">
          <p className="font-mono text-[11px] uppercase mb-4" style={{ color: "#dc2626", fontWeight: 700, letterSpacing: "0.1em" }}>
            {revoked ? "Invite revoked" : "Invalid link"}
          </p>
          <h1 className="font-heading mb-4" style={{ fontSize: "1.875rem", fontWeight: 700, color: INK }}>
            {revoked ? "This invite has been revoked." : "This invite link isn't valid."}
          </h1>
          <p className="font-body" style={{ color: MUTED, lineHeight: 1.6 }}>
            Ask the workspace owner for a new invite link.
          </p>
        </section>
      </main>
    );
  }

  return <InviteAcceptForm token={token} firmName={firmName} />;
}
