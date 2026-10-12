import { FloatingNav } from "@/components/islands/FloatingNavbar";
import Hero from "@/components/sections/Hero";
import SimplyHappyFeature from "@/components/sections/SimplyHappyFeature";
import Grid from "@/components/sections/Grid";
import RecentProjects from "@/components/sections/RecentProjects";
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
        <Grid />
        <RecentProjects />
        <Experience />
        <Footer />
      </div>
    </div>
  );
};

export default Page;
