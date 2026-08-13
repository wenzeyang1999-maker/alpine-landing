import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { customers, firmsInManager, portalLinks } from "@/lib/db/schema";
import { DEMO_SLUG_TO_TOKEN } from "@/lib/portal-demo";

// Portal ownership is an explicit, revocable record — never inferred.
//
//   approved portal_links row ──► customer must still be active ──► token
//   demo firm slug ────────────► demo token (fixture data only)
//   manager email == customers.email ──► 'pending' suggestion, NO access
//
// The email match used to grant access directly and write the token onto the
// firm permanently. An onboarding address can be an alias, a typo, a
// consultant, or someone who has since left, so it now only proposes a link
// that an Alpine admin approves. Revocation and customer offboarding both
// take effect immediately because the token is resolved through the customer
// row on every call rather than cached on the firm.

/** True for the seeded demo firms, whose portals are fixture data. */
function demoTokenForSlug(slug: string | undefined): string | null {
  if (!slug) return null;
  return DEMO_SLUG_TO_TOKEN[slug] ?? null;
}

/**
 * The secure-portal token this firm may read, or null.
 * Side effect: when a manager's email matches an active customer and no link
 * exists yet, records a 'pending' suggestion for an admin to approve.
 */
export async function portalTokenForManager(firmId: string, email: string): Promise<string | null> {
  try {
    const [approved] = await db
      .select({ portalToken: customers.portalToken, status: customers.status })
      .from(portalLinks)
      .innerJoin(customers, eq(customers.id, portalLinks.customerId))
      .where(and(eq(portalLinks.firmId, firmId), eq(portalLinks.status, "approved")))
      .limit(1);

    // An offboarded customer loses visibility even while the link stands.
    if (approved?.portalToken && approved.status === "active") return approved.portalToken;
    if (approved) return null;

    const [firm] = await db
      .select({ slug: firmsInManager.slug })
      .from(firmsInManager)
      .where(eq(firmsInManager.id, firmId))
      .limit(1);

    const demoToken = demoTokenForSlug(firm?.slug);
    if (demoToken) return demoToken;

    // No approved link: an email match is a suggestion, not authorization.
    const [customer] = await db
      .select({ id: customers.id })
      .from(customers)
      .where(and(eq(customers.email, email), eq(customers.status, "active")))
      .limit(1);
    if (customer) await suggestPortalLink(firmId, customer.id, email);

    return null;
  } catch {
    return null;
  }
}

/**
 * Record a pending link for an admin to review. Never throws and never grants
 * access; the unique index keeps repeat calls from stacking duplicates.
 */
export async function suggestPortalLink(firmId: string, customerId: string, suggestedBy: string): Promise<void> {
  try {
    const [existing] = await db
      .select({ id: portalLinks.id })
      .from(portalLinks)
      .where(and(eq(portalLinks.firmId, firmId), eq(portalLinks.customerId, customerId)))
      .limit(1);
    if (existing) return;

    await db.insert(portalLinks).values({
      firmId,
      customerId,
      status: "pending",
      suggestedBy,
    });
  } catch {
    // Suggestion is best-effort; a failure must not affect the caller.
  }
}

/**
 * Validate a token offered at signup: it must belong to an active onboarded
 * customer whose portal is not already approved to another firm.
 * Returns the customer id so the caller can record the link.
 */
export async function claimableCustomerForToken(token: string): Promise<string | null> {
  if (!token || token.length > 200) return null;
  try {
    const [customer] = await db
      .select({ id: customers.id })
      .from(customers)
      .where(and(eq(customers.portalToken, token), eq(customers.status, "active")))
      .limit(1);
    if (!customer) return null;

    const [claimed] = await db
      .select({ id: portalLinks.id })
      .from(portalLinks)
      .where(and(eq(portalLinks.customerId, customer.id), eq(portalLinks.status, "approved")))
      .limit(1);
    return claimed ? null : customer.id;
  } catch {
    return null;
  }
}
