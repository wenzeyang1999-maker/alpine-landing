// The Analyst Portal login moved to /login. This route is kept only as a
// permanent redirect so old links, bookmarks, and the DemoAccessGate fallback
// keep working. Any ?redirect= target is preserved.
//
// Note: this only affects the main domain (alpinedd.com/demo-login). The app
// subdomain's Internal Sign In is a separate route (app/app-portal/demo-login)
// reached via a middleware host rewrite, so it is untouched.

import { permanentRedirect } from "next/navigation";

type Search = { [key: string]: string | string[] | undefined };

export default function DemoLoginRedirect({ searchParams }: { searchParams: Search }) {
  const r = typeof searchParams.redirect === "string" ? searchParams.redirect : null;
  permanentRedirect(r ? `/login?redirect=${encodeURIComponent(r)}` : "/login");
}
