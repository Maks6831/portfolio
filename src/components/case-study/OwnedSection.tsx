import CaseStudyPanel from "@/components/ui/CaseStudyPanel";
import type { OwnedArea } from "@/content/work/types";
import SectionFrame, { type TrailPosition } from "./SectionFrame";

type Props = { owned: OwnedArea[]; trail?: TrailPosition };

/** 02 What I owned: the owned cards, two across from md. */
const OwnedSection = ({ owned, trail }: Props) => (
  <SectionFrame id="owned" title="What I owned" trail={trail}>
    <ul role="list" className="m-0 grid list-none grid-cols-1 gap-tile-gap p-0 md:grid-cols-2">
      {owned.map((area) => (
        <li key={area.title}>
          <CaseStudyPanel heading={area.title}>{area.body}</CaseStudyPanel>
        </li>
      ))}
    </ul>
  </SectionFrame>
);

export default OwnedSection;
