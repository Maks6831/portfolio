import Image from "next/image";
import Chip from "@/components/ui/Chip";
import LaptopFrame from "@/components/ui/LaptopFrame";
import Sheet from "@/components/ui/Sheet";
import { heroSizes } from "@/components/sections/Hero";
import { simplyHappyFeature as f } from "@/content/site";

// Sheet 01. The case-study link is a stretched <a> on the h2 (its name is the h2); "Read the case study →" is the
// visible, aria-hidden line. The screenshot reuses the hero's download: same src and sizes, lazy.
const SimplyHappyFeature = () => (
  <Sheet n={1} id="work" labelledBy="h-work">
    <div className="pos">
      <p className="eyebrow">{f.eyebrow}</p>
      <h2 id="h-work">
        <a className="stretch" href={f.link.href}>
          {f.heading}
        </a>
      </h2>
      <div className="ba">
        <b>Before</b>
        <p>{f.before}</p>
      </div>
      <div className="ba">
        <b>After</b>
        <p>{f.after}</p>
      </div>
      <ul role="list" className="chips" aria-label="Technologies used">
        {f.chips.map((chip) => (
          <li key={chip}>
            <Chip>{chip}</Chip>
          </li>
        ))}
      </ul>
      <span className="link" aria-hidden="true">
        {f.link.label} →
      </span>
    </div>
    <figure className="frame m-0">
      <LaptopFrame>
        <Image src={f.image.src} width={f.image.width} height={f.image.height} alt={f.image.alt} sizes={heroSizes} loading="lazy" />
      </LaptopFrame>
      <figcaption className="cap">{f.image.caption}</figcaption>
    </figure>
  </Sheet>
);

export default SimplyHappyFeature;
