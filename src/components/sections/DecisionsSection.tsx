import SectionFrame, { type TrailPosition } from "@/components/case-study/SectionFrame";
import DecisionCard from "@/components/ui/DecisionCard";
import type { Decision } from "@/content/work/types";

type Props = { decisions?: Decision[]; trail?: TrailPosition };

/**
 * Story 2.3: "Decisions and rejected alternatives", one DecisionCard per entry, single column.
 * Renders nothing when the case study has no decisions, so the heading order simply skips it.
 */
const DecisionsSection = ({ decisions, trail }: Props) => {
  if (!decisions?.length) return null;
  return (
    <SectionFrame id="decisions" title="Decisions and rejected alternatives" trail={trail}>
      <ul role="list" className="m-0 mt-10 grid list-none grid-cols-1 gap-6 p-0">
        {decisions.map((decision) => (
          <li key={decision.title}>
            <DecisionCard {...decision} />
          </li>
        ))}
      </ul>
    </SectionFrame>
  );
};

export default DecisionsSection;
