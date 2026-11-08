import "./home.css";
import PageShell from "@/components/layout/PageShell";
import Hero from "@/components/sections/Hero";
import SimplyHappyFeature from "@/components/sections/SimplyHappyFeature";
import ProofTiles from "@/components/sections/ProofTiles";
import SupportingWork from "@/components/sections/SupportingWork";
import Experience from "@/components/sections/Experience";
import Footer from "@/components/sections/Footer";

const Page = () => {
  return (
    <PageShell surface="home">
    <div className="home">
        <Hero />
        <div className="mx-auto max-w-7xl px-5 sm:px-10">
          <SimplyHappyFeature />
          <ProofTiles />
          <SupportingWork />
          <Experience />
          <Footer />
        </div>
    </div>
    </PageShell>
  );
};

export default Page;
