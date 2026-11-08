import ButtonLink from "@/components/ui/ButtonLink";
import { hero } from "@/content/site";

const Hero = () => {
  return (
    <section className="flex min-h-svh flex-col justify-center pb-20 pt-36">
      <div className="flex justify-center relative my-20 z-10">
        <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
          <p className="text-eyebrow uppercase text-center text-accent">
            {hero.eyebrow}
          </p>
          <h1 className="mt-4 text-center text-display-mobile md:text-display text-text">
            {hero.headline}
          </h1>
          <p className="mt-6 text-center text-body text-text-secondary max-w-xl">
            {hero.lede}
          </p>
          <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
            <ButtonLink
              href={hero.primaryCta.href}
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
