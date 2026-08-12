import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { customers, firmsInManager } from "@/lib/db/schema";
import { DEMO_SLUG_TO_TOKEN } from "@/lib/portal-demo";

// Resolve which secure-portal token belongs to a manager's firm, in order:
//   1. firms.portal_token — claimed at signup or backfilled below; firm-wide.
//   2. Demo firms by slug (trellis/ridgeline/aurora).
//   3. customers.portal_token matched by this user's email (the address the
//      analyst onboarded). When this hits and the firm has no claimed token
//      yet, backfill firms.portal_token so every team member gets the link,
//      not just the matching email.
// Returns null when the firm has no portal.
// Shared by /api/manager/documents (panel listing) and
// /api/manager/documents/match (passage search).
export async function portalTokenForManager(firmId: string, email: string): Promise<string | null> {
  try {
    const [firm] = await db
      .select({ slug: firmsInManager.slug, portalToken: firmsInManager.portalToken })
      .from(firmsInManager)
      .where(eq(firmsInManager.id, firmId))
      .limit(1);

    if (firm?.portalToken) return firm.portalToken;
    if (firm && DEMO_SLUG_TO_TOKEN[firm.slug]) return DEMO_SLUG_TO_TOKEN[firm.slug];

    const [customer] = await db
      .select({ portalToken: customers.portalToken })
      .from(customers)
      .where(eq(customers.email, email))
      .limit(1);
    const token = customer?.portalToken ?? null;

    if (token && firm) {
      try {
        // Unique constraint means this quietly fails if another firm already
        // claimed the token; the email-matched user still gets access above.
        await db
          .update(firmsInManager)
          .set({ portalToken: token })
          .where(eq(firmsInManager.id, firmId));
      } catch {
        // Non-fatal: resolution still succeeded for this request.
      }
    }
    return token;
  } catch {
    return null;
  }
}

// Validate a token offered at signup ("claim"): it must be a real onboarded
// portal token (customers.portal_token) and not already claimed by a firm.
// Demo tokens are not claimable.
export async function validateClaimableToken(token: string): Promise<boolean> {
  if (!token || token.length > 200) return false;
  try {
    const [customer] = await db
      .select({ id: customers.id })
      .from(customers)
      .where(eq(customers.portalToken, token))
      .limit(1);
    if (!customer) return false;

    const [claimed] = await db
      .select({ id: firmsInManager.id })
      .from(firmsInManager)
      .where(eq(firmsInManager.portalToken, token))
      .limit(1);
    return !claimed;
  } catch {
    return false;
  }
}
