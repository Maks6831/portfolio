import ButtonLink from "@/components/ui/ButtonLink";
import Chip from "@/components/ui/Chip";
import ScreenshotFrame from "@/components/ui/ScreenshotFrame";
import { simplyHappyFeature as f } from "@/content/site";

const SimplyHappyFeature = () => (
  <section id="work" aria-labelledby="headline-work" className="relative z-10 scroll-mt-24 py-section-gap-mobile md:py-section-gap">
    <p className="text-eyebrow uppercase text-accent">{f.eyebrow}</p>
    <h2 id="headline-work" className="mt-3 text-subheading md:text-heading text-text-primary">
      {f.heading}
    </h2>

    <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 md:items-start">
      <div className="flex flex-col gap-6">
        <div className="rounded-card border border-border bg-surface p-7">
          <p className="text-eyebrow uppercase text-text-muted">Before</p>
          <p className="mt-2 text-body text-text-secondary">{f.before}</p>
        </div>
        <div className="rounded-card border border-border bg-surface p-7">
          <p className="text-eyebrow uppercase text-accent">After</p>
          <p className="mt-2 text-body text-text-primary">{f.after}</p>
        </div>
        <ul role="list" className="m-0 flex list-none flex-wrap gap-2 p-0" aria-label="Technologies used">
          {f.chips.map((chip) => (
            <li key={chip}>
              <Chip>{chip}</Chip>
            </li>
          ))}
        </ul>
        <div>
          <ButtonLink href={f.link.href} variant="secondary">
            {f.link.label}
          </ButtonLink>
        </div>
      </div>
      <ScreenshotFrame
        src={f.image.src}
        width={f.image.width}
        height={f.image.height}
        alt={f.image.alt}
        caption={f.image.caption}
      />
    </div>
  </section>
);

export default SimplyHappyFeature;
