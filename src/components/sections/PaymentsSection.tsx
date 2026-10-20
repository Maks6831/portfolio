import CaseStudyPanel from "@/components/ui/CaseStudyPanel";
import StateDiagram from "@/components/ui/StateDiagram";
import type { PaymentsSection as PaymentsContent } from "@/content/work/types";

type Props = { payments?: PaymentsContent };

/**
 * Story 2.2: "The booking and payments flow": four short paragraphs, the pending-to-confirmed state diagram and
 * the two reliability panels. Server-rendered, no <article> (the gate treats articles as decision cards).
 * Renders nothing when the case study has no payments content, so the heading order simply skips it.
 */
const PaymentsSection = ({ payments }: Props) => {
  if (!payments) return null;
  return (
    <section
      id="payments"
      aria-labelledby="payments-heading"
      tabIndex={-1}
      className="relative z-10 scroll-mt-28 pb-section-gap-mobile focus:outline-none md:pb-section-gap"
    >
      <h2 id="payments-heading" className="text-subheading md:text-heading text-text-primary">
        The booking and payments flow
      </h2>
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
    </section>
  );
};

export default PaymentsSection;
