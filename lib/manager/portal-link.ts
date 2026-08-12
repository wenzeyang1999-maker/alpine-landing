import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { customers, firmsInManager } from "@/lib/db/schema";
import { DEMO_SLUG_TO_TOKEN } from "@/lib/portal-demo";

// Resolve which secure-portal token belongs to a manager's firm:
// demo firms map by slug; real customers map by the email that was onboarded
// (customers.portal_token). Returns null when the firm has no portal.
// Shared by /api/manager/documents (panel listing) and
// /api/manager/documents/match (passage search).
export async function portalTokenForManager(firmId: string, email: string): Promise<string | null> {
  try {
    const [firm] = await db
      .select({ slug: firmsInManager.slug })
      .from(firmsInManager)
      .where(eq(firmsInManager.id, firmId))
      .limit(1);
    if (firm && DEMO_SLUG_TO_TOKEN[firm.slug]) return DEMO_SLUG_TO_TOKEN[firm.slug];

    const [customer] = await db
      .select({ portalToken: customers.portalToken })
      .from(customers)
      .where(eq(customers.email, email))
      .limit(1);
    return customer?.portalToken ?? null;
  } catch {
    return null;
  }
}
