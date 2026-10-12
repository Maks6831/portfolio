import { FloatingNav } from "@/components/islands/FloatingNavbar";
import Hero from "@/components/sections/Hero";
import SimplyHappyFeature from "@/components/sections/SimplyHappyFeature";
import ProofTiles from "@/components/sections/ProofTiles";
import SupportingWork from "@/components/sections/SupportingWork";
import Experience from "@/components/sections/Experience";
import Footer from "@/components/sections/Footer";
import { navItems } from "@/content/site";

const Page = () => {
  return (
    <div className="relative bg-black-100 w-screen flex justify-center items-center flex-col mx-auto sm:px-10 px-5 overflow-clip">
      <div className="max-w-7xl w-full">
        <FloatingNav navItems={navItems} />
        <Hero />
        <SimplyHappyFeature />
        <ProofTiles />
        <SupportingWork />
        <Experience />
        <Footer />
      </div>
    </div>
  );
};

export default Page;
