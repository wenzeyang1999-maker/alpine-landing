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

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" style={{ background: BG }}>
        <Hero />
        <QuestionTree />
        <HowItWorks />
        <Pricing />
        <Methodology />
        <Blog />
        <Team />
      </main>
      <CTAFooter />
    </>
  );
}
