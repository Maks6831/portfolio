import type { TestingSection as TestingContent } from "@/content/work/types";
import { formatDay } from "@/lib/dates";

type Props = { testing?: TestingContent };

/**
 * Story 2.4: "Testing and delivery": four count tiles under one "approx., as of" label, then three short
 * paragraphs on the delivery flow, the git hooks and what CI runs versus what stays local. Server-rendered,
 * real text in a <dl>; no <article> and no <h3> (the gate counts articles as decision cards and h3s as panels).
 * Renders nothing when the case study has no testing content, so the heading order simply skips it.
 */
const TestingSection = ({ testing }: Props) => {
  if (!testing) return null;
  // A malformed date renders no date at all (the gate then fails on the missing label) rather than a wrong one.
  const asOf = formatDay(testing.countsAsOf);
  return (
    <section
      id="testing"
      aria-labelledby="testing-heading"
      className="relative z-10 scroll-mt-24 pb-section-gap-mobile md:pb-section-gap"
    >
      <h2 id="testing-heading" className="text-subheading md:text-heading text-text-primary">
        Testing and delivery
      </h2>
      <p id="testing-asof" className="mt-6 text-caption text-text-muted">
        {asOf ? `approx., as of ${asOf}` : "approx."}
      </p>
      <dl aria-describedby="testing-asof" className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        {testing.counts.map((tile, i) => (
          <div key={`tile-${i}`} className="rounded-card border border-border bg-surface p-5">
            <dt className="text-caption text-text-secondary">{tile.label}</dt>
            <dd className="mt-2 text-subheading text-text-primary">{tile.value}</dd>
            {tile.detail ? <dd className="mt-2 text-caption text-text-muted">{tile.detail}</dd> : null}
          </div>
        ))}
      </dl>
      {testing.paragraphs.map((paragraph, i) => (
        <p key={`paragraph-${i}`} className="mt-6 max-w-[68ch] text-body text-text-secondary">
          {paragraph}
        </p>
      ))}
    </section>
  );
};

export default TestingSection;
