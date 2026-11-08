import type { ReactNode } from "react";
import SectionFrame, { type TrailPosition } from "@/components/case-study/SectionFrame";
import type { AssistantSection as AssistantContent } from "@/content/work/types";

type Props = { assistant?: AssistantContent; trail?: TrailPosition; media?: ReactNode };

/**
 * Story 2.5: "Admin AI assistant (safety design)": one intro paragraph, one CaseStudyPanel per safeguard (an <h3>
 * each, so the gate's h3 formula grows by the panel count) and one closing paragraph on why fixed lookups beat
 * SQL. Server-rendered, no <article> (the gate treats articles as decision cards), no links and no muted text.
 * Renders nothing when the case study has no assistant content, so the heading order simply skips it.
 */
const AssistantSection = ({ assistant, trail, media }: Props) => {
  if (!assistant) return null;
  return (
    <SectionFrame id="assistant" title="Admin AI assistant (safety design)" trail={trail}>
      <p className="m-0 max-w-[68ch] text-[15px] leading-[1.55] text-text-secondary lg:text-[16px]">{assistant.intro}</p>
      <div className="mt-6 md:grid md:grid-cols-[minmax(0,1fr)_46%] md:items-start md:gap-tile-gap lg:grid-cols-[minmax(0,1fr)_354px]">
        <ul role="list" className="m-0 list-none p-0">
          {assistant.safeguards.map((panel, i) => (
            <li key={`safeguard-${i}`} className="border-t border-line py-4">
              <h3 className="m-0 text-[18px] font-semibold leading-tight tracking-[-0.01em] text-text">{panel.title}</h3>
              <p className="m-0 mt-2 max-w-[68ch] text-[14px] leading-[1.45] text-text-secondary">{panel.text}</p>
            </li>
          ))}
        </ul>
        {media ? <div className="mt-6 md:mt-4">{media}</div> : null}
      </div>
      <p className="m-0 mt-6 max-w-[68ch] border-t border-line pt-5 text-[15px] leading-[1.55] text-text-secondary lg:text-[16px]">
        {assistant.closing}
      </p>
    </SectionFrame>
  );
};

export default AssistantSection;
