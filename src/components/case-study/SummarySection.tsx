import SectionFrame, { type TrailPosition } from "./SectionFrame";

type Props = { before: string; after: string; trail?: TrailPosition };

/** 01 Summary: the before/after pair as two rows under a hairline (DESIGN.md summary row). */
const SummarySection = ({ before, after, trail }: Props) => (
  <SectionFrame id="summary" title="Summary" trail={trail}>
    <dl className="m-0">
      {[
        ["Before", before],
        ["After", after],
      ].map(([label, text]) => (
        <div
          key={label}
          className="grid grid-cols-1 gap-1.5 border-t border-line pb-[22px] pt-[18px] md:grid-cols-[120px_minmax(0,1fr)] md:gap-x-4"
        >
          <dt className="pt-1.5 font-mono text-[12px] uppercase tracking-[0.12em] text-muted">{label}</dt>
          <dd className="m-0 text-[19px] leading-[1.35] tracking-[-0.01em] text-text md:text-[22px]">{text}</dd>
        </div>
      ))}
    </dl>
  </SectionFrame>
);

export default SummarySection;
