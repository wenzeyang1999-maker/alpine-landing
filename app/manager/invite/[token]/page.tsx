import { createHash } from "crypto";
import { managerDb } from "@/lib/manager/db";
import InviteAcceptForm from "./InviteAcceptForm";
import Link from "next/link";
import { BG, INK, MUTED, BORDER } from "@/lib/constants";

type InviteRow = { id: string; firm_id: string; revoked_at: string | null };
type FirmRow = { name: string };

export default async function InviteAcceptPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const tokenHash = createHash("sha256").update(token).digest("hex");

  let firmName: string | null = null;
  let invalid = false;
  let revoked = false;

  try {
    const db = managerDb();
    const { data: invite } = await db
      .from("team_invites")
      .select("id, firm_id, revoked_at")
      .eq("token_hash", tokenHash)
      .maybeSingle() as { data: InviteRow | null };

    if (!invite) {
      invalid = true;
    } else if (invite.revoked_at) {
      revoked = true;
    } else {
      const { data: firm } = await db
        .from("firms")
        .select("name")
        .eq("id", invite.firm_id)
        .maybeSingle() as { data: FirmRow | null };
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
