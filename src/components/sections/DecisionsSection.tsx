import DecisionCard from "@/components/ui/DecisionCard";
import type { Decision } from "@/content/work/types";

type Props = { decisions?: Decision[] };

/**
 * Story 2.3: "Decisions and rejected alternatives", one DecisionCard per entry, single column.
 * Renders nothing when the case study has no decisions, so the heading order simply skips it.
 */
const DecisionsSection = ({ decisions }: Props) => {
  if (!decisions?.length) return null;
  return (
    <section
      id="decisions"
      aria-labelledby="decisions-heading"
      tabIndex={-1}
      className="relative z-10 scroll-mt-28 pb-section-gap-mobile focus:outline-none md:pb-section-gap"
    >
      <h2 id="decisions-heading" className="text-subheading md:text-heading text-text-primary">
        Decisions and rejected alternatives
      </h2>
      <ul role="list" className="m-0 mt-10 grid list-none grid-cols-1 gap-6 p-0">
        {decisions.map((decision) => (
          <li key={decision.title}>
            <DecisionCard {...decision} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default DecisionsSection;
