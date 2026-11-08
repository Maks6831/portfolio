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
    <div className="relative bg-stage w-full flex justify-center items-center flex-col mx-auto sm:px-10 px-5 overflow-clip">
      <div className="max-w-7xl w-full">
        <Hero />
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
