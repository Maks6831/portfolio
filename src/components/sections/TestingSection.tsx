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
      <p id="testing-asof" className="mt-6 text-caption text-muted">
        {asOf ? `approx., as of ${asOf}` : "approx."}
      </p>
      <dl aria-describedby="testing-asof" className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        {testing.counts.map((tile, i) => (
          <div key={`tile-${i}`} className="rounded-md border border-line bg-stage p-5">
            <dt className="text-caption text-text-secondary">{tile.label}</dt>
            <dd className="mt-2 text-subheading text-text">{tile.value}</dd>
            {tile.detail ? <dd className="mt-2 text-caption text-muted">{tile.detail}</dd> : null}
          </div>
        ))}
      </dl>
      <div className="mt-6 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,300px)] md:gap-8">
        <div>
      {testing.paragraphs.map((paragraph, i) => (
        <p key={`paragraph-${i}`} className="mt-6 first:mt-0 max-w-[68ch] text-body text-text-secondary">
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
