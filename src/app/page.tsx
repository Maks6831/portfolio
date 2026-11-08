import "./home.css";
import PageShell from "@/components/layout/PageShell";
import Hero from "@/components/sections/Hero";
import SimplyHappyFeature from "@/components/sections/SimplyHappyFeature";
import ProofTiles from "@/components/sections/ProofTiles";
import SupportingWork from "@/components/sections/SupportingWork";
import Experience from "@/components/sections/Experience";
import ContactSection from "@/components/sections/ContactSection";
import SiteFooter from "@/components/sections/SiteFooter";

// Hero, sheets 01-03, then Experience and Contact (flow sections that slide over the stack) in one container, so the
// sticky hero and sheets stay stuck until the end. The wrapper's overflow-x: clip is the only clipping.
const Page = () => (
  <PageShell surface="home" footer={<SiteFooter />}>
    <div className="home">
      <Hero />
      <SimplyHappyFeature />
      <ProofTiles />
      <SupportingWork />
      <Experience />
      <ContactSection />
    </div>
  </PageShell>
);

export default Page;
