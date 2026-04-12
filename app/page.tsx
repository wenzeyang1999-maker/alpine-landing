import Navbar       from "@/components/Navbar";
import Hero         from "@/components/Hero";
import QuestionTree from "@/components/QuestionTree";
import HowItWorks   from "@/components/HowItWorks";
import Pricing      from "@/components/Pricing";
import Methodology  from "@/components/Methodology";
import Team         from "@/components/Team";
import Blog         from "@/components/Blog";
import CTAFooter    from "@/components/CTAFooter";
import { BG } from "@/lib/constants";

// ─────────────────────────────────────────────────────────────────────────────
// Page layout — add, remove, or reorder sections here.
// Each section is fully self-contained in its own file under /components.
// ─────────────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div style={{ background: BG }}>
      <Navbar />
      <Hero />
      <QuestionTree />
      <HowItWorks />
      <Pricing />
      <Methodology />
      <Blog />
      <Team />
      <CTAFooter />
    </div>
  );
}
