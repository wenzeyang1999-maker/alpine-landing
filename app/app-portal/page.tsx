import Link from "next/link";
import { BG, BG_CARD, INK, MUTED, BORDER, VIOLET } from "@/lib/app-portal/constants";
import LogoutButton from "@/components/app-portal/LogoutButton";

export const metadata = {
  title: "Alpine App",
  description: "Alpine Due Diligence — application workspace.",
  robots: { index: false, follow: false },
};

const TILES = [
  {
    href: "/demo-login",
    label: "Sign in",
    blurb: "Access your portal or admin workspace.",
  },
  {
    href: "/portfolio2",
    label: "Portfolio",
    blurb: "Allocator view across funds under diligence.",
  },
  {
    href: "/review2/aurora",
    label: "Review",
    blurb: "Open the latest fund review.",
  },
];

export default function AppHome() {
  return (
    <main
      id="main-content"
      style={{ background: BG, color: INK, minHeight: "100vh" }}
      className="flex flex-col"
    >
      <header
        style={{ borderBottom: `1px solid ${BORDER}` }}
        className="px-6 py-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span
            className="font-heading font-bold tracking-tight"
            style={{ fontSize: 18 }}
          >
            Alpine
          </span>
          <span
            className="font-mono text-xs px-2 py-0.5 rounded"
            style={{ background: "#EDE3F8", color: VIOLET }}
          >
            app
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="font-body text-sm"
            style={{ color: MUTED }}
          >
            Admin →
          </Link>
          <LogoutButton />
        </div>
      </header>

      <section className="flex-1 px-6 py-16 max-w-5xl mx-auto w-full">
        <h1
          className="font-heading font-bold tracking-tight"
          style={{ fontSize: 40, lineHeight: 1.1 }}
        >
          Welcome to Alpine
        </h1>
        <p
          className="font-body mt-3"
          style={{ color: MUTED, fontSize: 16, maxWidth: 560 }}
        >
          The application workspace for allocators and managers running due
          diligence with Alpine.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
          {TILES.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="block rounded-lg p-5 transition-colors"
              style={{
                background: BG_CARD,
                border: `1px solid ${BORDER}`,
              }}
            >
              <div
                className="font-heading font-semibold"
                style={{ fontSize: 17 }}
              >
                {t.label}
              </div>
              <div
                className="font-body mt-1"
                style={{ color: MUTED, fontSize: 14 }}
              >
                {t.blurb}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer
        className="px-6 py-6 font-body text-xs"
        style={{ color: MUTED, borderTop: `1px solid ${BORDER}` }}
      >
        <Link href="https://alpinedd.com" style={{ color: MUTED }}>
          ← alpinedd.com
        </Link>
      </footer>
    </main>
  );
}
