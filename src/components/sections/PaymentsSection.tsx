import SectionFrame, { type TrailPosition } from "@/components/case-study/SectionFrame";
import CaseStudyPanel from "@/components/ui/CaseStudyPanel";
import StateDiagram from "@/components/ui/StateDiagram";
import type { PaymentsSection as PaymentsContent } from "@/content/work/types";

type Props = { payments?: PaymentsContent; trail?: TrailPosition };

/**
 * Story 2.2: "The booking and payments flow": four short paragraphs, the pending-to-confirmed state diagram and
 * the two reliability panels. Server-rendered, no <article> (the gate treats articles as decision cards).
 * Renders nothing when the case study has no payments content, so the heading order simply skips it.
 */
const PaymentsSection = ({ payments, trail }: Props) => {
  if (!payments) return null;
  return (
    <SectionFrame id="payments" title="The booking and payments flow" trail={trail}>
      {payments.flow.map((paragraph, i) => (
        <p key={`flow-${i}`} className="mt-6 max-w-[68ch] text-body text-text-secondary">
          {paragraph}
        </p>
      ))}
      <StateDiagram id="payments-diagram" className="mt-10" {...payments.diagram} />
      <p className="mt-12 text-eyebrow uppercase text-accent">Reliability decisions</p>
      <ul role="list" className="m-0 mt-4 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2">
        {payments.reliability.map((panel, i) => (
          <li key={`panel-${i}`}>
            <CaseStudyPanel heading={panel.title}>{panel.text}</CaseStudyPanel>
          </li>
        ))}
      </ul>
    </SectionFrame>
  );
};

export default PaymentsSection;
