import ProofTile from "@/components/ui/ProofTile";
import { supportingWork } from "@/content/site";

const SupportingWork = () => (
  <section
    aria-labelledby="supporting-heading"
    className="relative z-10 pb-section-gap-mobile md:pb-section-gap"
  >
    <h2 id="supporting-heading" className="text-subheading md:text-heading text-text-primary">
      {supportingWork.heading}
    </h2>
    <ul role="list" className="m-0 mt-10 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3">
      {supportingWork.items.map((t) => (
        <li key={t.id} className={"featured" in t && t.featured ? "lg:col-span-2" : undefined}>
          <ProofTile title={t.title} body={t.body} href={t.href} />
        </li>
      ))}
    </ul>
  </section>
);

export default SupportingWork;
