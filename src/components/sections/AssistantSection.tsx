import SectionFrame, { type TrailPosition } from "@/components/case-study/SectionFrame";
import CaseStudyPanel from "@/components/ui/CaseStudyPanel";
import type { AssistantSection as AssistantContent } from "@/content/work/types";

type Props = { assistant?: AssistantContent; trail?: TrailPosition };

/**
 * Story 2.5: "Admin AI assistant (safety design)": one intro paragraph, one CaseStudyPanel per safeguard (an <h3>
 * each, so the gate's h3 formula grows by the panel count) and one closing paragraph on why fixed lookups beat
 * SQL. Server-rendered, no <article> (the gate treats articles as decision cards), no links and no muted text.
 * Renders nothing when the case study has no assistant content, so the heading order simply skips it.
 */
const AssistantSection = ({ assistant, trail }: Props) => {
  if (!assistant) return null;
  return (
    <SectionFrame id="assistant" title="Admin AI assistant (safety design)" trail={trail}>
      <p className="mt-6 max-w-[68ch] text-body text-text-secondary">{assistant.intro}</p>
      <ul role="list" className="m-0 mt-8 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2">
        {assistant.safeguards.map((panel, i) => (
          <li key={`safeguard-${i}`}>
            <CaseStudyPanel heading={panel.title}>{panel.text}</CaseStudyPanel>
          </li>
        ))}
      </ul>
      <p className="mt-8 max-w-[68ch] text-body text-text-secondary">{assistant.closing}</p>
    </SectionFrame>
  );
};

export default AssistantSection;
