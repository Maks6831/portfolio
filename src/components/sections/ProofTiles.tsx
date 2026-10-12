import ProofTile from "@/components/ui/ProofTile";
import { proofSection, proofTiles } from "@/content/site";

const ProofTiles = () => (
  <section
    id="about"
    aria-labelledby="proof-heading"
    className="relative z-10 scroll-mt-24 pt-0 pb-section-gap-mobile md:pb-section-gap"
  >
    <p className="text-eyebrow uppercase text-accent">{proofSection.eyebrow}</p>
    <h2 id="proof-heading" className="mt-3 text-subheading md:text-heading text-text-primary">
      {proofSection.heading}
    </h2>
    <ul role="list" className="m-0 mt-10 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3 md:[&>li:last-child]:col-span-2 lg:[&>li:last-child]:col-span-1">
      {proofTiles.map((t) => (
        <li key={t.id}>
          <ProofTile title={t.title} body={t.body} chip={t.chip} />
        </li>
      ))}
    </ul>
  </section>
);

export default ProofTiles;
