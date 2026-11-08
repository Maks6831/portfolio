import type { ReactNode } from "react";
import SectionFrame, { type TrailPosition } from "@/components/case-study/SectionFrame";
import CaseStudyPanel from "@/components/ui/CaseStudyPanel";
import type { PaymentsSection as PaymentsContent } from "@/content/work/types";

type Props = { payments?: PaymentsContent; trail?: TrailPosition; media?: ReactNode };

/**
 * "The booking and payments flow": four flow steps (paragraphs with a mono 01-04 numeral to the left), the section's
 * captures, then the two reliability cards. The payment-state diagram now ends the Decisions section. Server-rendered,
 * no <article> (the gate treats articles as decision cards). Renders nothing when the case study has no payments
 * content, so the heading order simply skips it.
 */
const PaymentsSection = ({ payments, trail, media }: Props) => {
  if (!payments) return null;
  return (
    <SectionFrame id="payments" title="The booking and payments flow" trail={trail}>
      <ol role="list" className="m-0 flex list-none flex-col gap-5 p-0">
        {payments.flow.map((paragraph, i) => (
          <li key={`flow-${i}`} className="grid grid-cols-[44px_minmax(0,1fr)] items-baseline">
            <span aria-hidden="true" className="font-mono text-[12px] tracking-[0.08em] text-accent">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="m-0 max-w-[68ch] text-[15px] leading-[1.55] text-text-secondary lg:text-[16px]">{paragraph}</p>
          </li>
        ))}
      </ol>
      {media ? <div className="mt-8">{media}</div> : null}
      <p className="mb-0 mt-10 font-mono text-[12px] uppercase tracking-[0.12em] text-accent">Reliability decisions</p>
      <ul role="list" className="m-0 mt-4 grid list-none grid-cols-1 gap-tile-gap p-0 md:grid-cols-2">
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
