import { FaLocationArrow } from "react-icons/fa6";
import ButtonLink from "@/components/ui/ButtonLink";
import { hero } from "@/content/site";

const Hero = () => {
  return (
    <section className="flex min-h-svh flex-col justify-center pb-20 pt-36">
      {/* Static grid background */}
      <div
        aria-hidden="true"
        className="h-screen w-full dark:bg-black-100 bg-white dark:bg-grid-white/[0.03] bg-grid-black-100/[0.2]
       absolute top-0 left-0 flex items-center justify-center"
      >
        <div
          className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100
         bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
        />
      </div>
      {/* Static glow, no animation */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-24 h-72 w-[min(90vw,48rem)] -translate-x-1/2 rounded-full bg-accent-strong/30 blur-3xl"
      />

      <div className="flex justify-center relative my-20 z-10">
        <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
          <p className="text-eyebrow uppercase text-center text-accent">
            {hero.eyebrow}
          </p>
          <h1 className="mt-4 text-center text-display-mobile md:text-display text-text-primary">
            {hero.headline}
          </h1>
          <p className="mt-6 text-center text-body text-text-secondary max-w-xl">
            {hero.lede}
          </p>
          <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
            <ButtonLink
              href={hero.primaryCta.href}
              external
              icon={<FaLocationArrow aria-hidden="true" />}
              className="w-full sm:w-auto"
            >
              {hero.primaryCta.label}
            </ButtonLink>
            <ButtonLink
              href={hero.secondaryCta.href}
              variant="secondary"
              className="w-full sm:w-auto"
            >
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
