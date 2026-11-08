import type { ReactNode } from "react";
import SectionFrame, { type TrailPosition } from "@/components/case-study/SectionFrame";
import type { TestingSection as TestingContent } from "@/content/work/types";
import { formatDay } from "@/lib/dates";

type Props = { testing?: TestingContent; trail?: TrailPosition; media?: ReactNode };

/**
 * Story 2.4: "Testing and delivery": four count tiles under one "approx., as of" label, then three short
 * paragraphs on the delivery flow, the git hooks and what CI runs versus what stays local. Server-rendered,
 * real text in a <dl>; no <article> and no <h3> (the gate counts articles as decision cards and h3s as panels).
 * Renders nothing when the case study has no testing content, so the heading order simply skips it.
 */
const TestingSection = ({ testing, trail, media }: Props) => {
  if (!testing) return null;
  // A malformed date renders no date at all (the gate then fails on the missing label) rather than a wrong one.
  const asOf = formatDay(testing.countsAsOf);
  return (
    <SectionFrame id="testing" title="Testing and delivery" trail={trail}>
      <p id="testing-asof" className="m-0 font-mono text-[12px] leading-normal text-muted">
        {asOf ? `approx., as of ${asOf}` : "approx."}
      </p>
      <dl aria-describedby="testing-asof" className="m-0 mt-3 grid grid-cols-2 gap-tile-gap md:grid-cols-4">
        {testing.counts.map((tile, i) => (
          <div key={`tile-${i}`} className="border-t border-line pt-3">
            <dt className="font-mono text-[12px] uppercase leading-snug tracking-[0.12em] text-text-secondary">{tile.label}</dt>
            <dd className="m-0 mt-1 text-[32px] font-bold leading-none tracking-[-0.03em] text-accent md:text-[40px]">{tile.value}</dd>
            {tile.detail ? <dd className="m-0 mt-2 text-[12.5px] leading-[1.45] text-text-secondary">{tile.detail}</dd> : null}
          </div>
        ))}
      </dl>
      <div className="mt-7 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,300px)] md:gap-8">
        <div className="flex flex-col gap-4">
          {testing.paragraphs.map((paragraph, i) => (
            <p key={`paragraph-${i}`} className="m-0 max-w-[68ch] text-[15px] leading-[1.55] text-text-secondary lg:text-[16px]">
              {paragraph}
            </p>
          ))}
        </div>
        {media ? <div className="mt-8 md:mt-0">{media}</div> : null}
      </div>
    </SectionFrame>
  );
};

export default TestingSection;
