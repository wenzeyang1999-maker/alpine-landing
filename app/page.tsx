import Navbar       from "@/components/Navbar";
import Hero         from "@/components/Hero";
import Problem      from "@/components/Problem";
import SampleOutput from "@/components/SampleOutput";
import Framework    from "@/components/Framework";
import QuestionTree from "@/components/QuestionTree";
import Products     from "@/components/Products";
import Team         from "@/components/Team";
import Blog         from "@/components/Blog";
import Subscribe    from "@/components/Subscribe";
import CTAFooter    from "@/components/CTAFooter";
import { BG } from "@/lib/constants";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" style={{ background: BG }}>
        <Hero />
        <Problem />
        <Framework />
        <Products />
        <SampleOutput />
        <QuestionTree />
        <Blog />
        <Team />
        <Subscribe variant="band" source="landing" />
      </main>
      <CTAFooter />
    </>
  );
}
