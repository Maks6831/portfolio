import SectionFrame, { type TrailPosition } from "@/components/case-study/SectionFrame";
import DecisionCard from "@/components/ui/DecisionCard";
import StateDiagram from "@/components/ui/StateDiagram";
import type { Decision, PaymentsSection } from "@/content/work/types";

type Props = { decisions?: Decision[]; diagram?: PaymentsSection["diagram"]; trail?: TrailPosition };

/**
 * "Decisions and rejected alternatives": one DecisionCard per entry, single column, then the payment-state diagram
 * (with its shortcut row) that ends the section. Renders nothing when the case study has no decisions, so the heading
 * order simply skips it.
 */
const DecisionsSection = ({ decisions, diagram, trail }: Props) => {
  if (!decisions?.length) return null;
  return (
    <SectionFrame id="decisions" title="Decisions and rejected alternatives" trail={trail}>
      <ul role="list" className="m-0 grid list-none grid-cols-1 gap-tile-gap p-0">
        {decisions.map((decision) => (
          <li key={decision.title}>
            <DecisionCard {...decision} />
          </li>
        ))}
      </ul>
      {diagram ? <StateDiagram id="payments-diagram" className="mt-8" {...diagram} /> : null}
    </SectionFrame>
  );
};

export default DecisionsSection;
