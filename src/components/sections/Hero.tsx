import Image from "next/image";
import ButtonLink from "@/components/ui/ButtonLink";
import LaptopFrame from "@/components/ui/LaptopFrame";
import Counter from "@/components/ui/Counter";
import { hero, simplyHappyFeature } from "@/content/site";

// The hero image is the LCP element: the only preloaded image on the site (EXPERIENCE.md hero image rule). One
// <Image> whose box moves by CSS between the laptop screen (lg) and the full-bleed phone slot. `sizes` is shared with
// sheet 01 so both ask for the same optimised candidate.
export const heroSizes = "(min-width: 1024px) 58vw, 100vw";

const Hero = () => {
  const img = simplyHappyFeature.image;
  return (
    <section className="hero" aria-label="Introduction">
      <div className="hero-copy">
        <p className="eyebrow">{hero.eyebrow}</p>
        <h1>{hero.headline}</h1>
        <p className="lede">{hero.lede}</p>
        <div className="hero-ctas">
          <ButtonLink href={hero.primaryCta.href}>{hero.primaryCta.label}</ButtonLink>
          <ButtonLink href={hero.secondaryCta.href} variant="secondary">
            {hero.secondaryCta.label}
          </ButtonLink>
        </div>
      </div>
      <div className="hero-word" aria-hidden="true">
        {hero.word.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>
      <LaptopFrame className="hero-laptop">
        <Image
          src={img.src}
          width={img.width}
          height={img.height}
          alt=""
          sizes={heroSizes}
          preload
          loading="eager"
          fetchPriority="high"
        />
      </LaptopFrame>
      <Counter n={1} />
    </section>
  );
};

export default Hero;
