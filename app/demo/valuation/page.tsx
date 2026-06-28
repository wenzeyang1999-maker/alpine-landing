/**
 * /demo/valuation — the gated Chapter-4 call-guide demo (PR1).
 * Server component: verifies the demo cookie; unauthenticated → the password gate,
 * authenticated → the workspace. noindex + dynamic (never cached/indexed).
 */
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { DEMO_COOKIE, verifyDemoToken } from "@/lib/engine/demo/gate";
import DemoGate from "./DemoGate";
import ValuationDemo from "./ValuationDemo";

export const metadata: Metadata = {
  title: "Alpine ODD — Chapter 4 Demo",
  robots: { index: false, follow: false, nocache: true },
};
export const dynamic = "force-dynamic";

export default async function Page() {
  const token = cookies().get(DEMO_COOKIE)?.value;
  const ok = await verifyDemoToken(token);
  return ok ? <ValuationDemo /> : <DemoGate />;
}
