import { cn } from "@/app/lib/utils";
import type { Decision } from "@/content/work/types";

type Props = Decision & { className?: string };

/**
 * DESIGN.md decision card: a hairline-bordered block holding the decision title and two always-visible columns,
 * "Chose" over text and "Rejected, because" over text-secondary, then a "Where" line under a hairline.
 * Server-rendered; nothing is hidden behind hover or disclosure. The "Where this lives" line names the part of the
 * codebase in plain words, never a path or a link.
 */
const DecisionCard = ({ title, chose, rejected, source, className }: Props) => (
  <article className={cn("h-full rounded-md border border-line px-5 pb-4 pt-5", className)}>
    <h3 className="text-[18px] font-semibold leading-tight tracking-[-0.01em] text-text">{title}</h3>
    <dl className="m-0 mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
      <div>
        <dt className="font-mono text-[12px] uppercase leading-snug tracking-[0.12em] text-accent">Chose</dt>
        <dd className="m-0 mt-2 max-w-[68ch] text-[14px] leading-[1.45] text-text">{chose}</dd>
      </div>
      <div>
        <dt className="font-mono text-[12px] uppercase leading-snug tracking-[0.12em] text-muted">Rejected, because</dt>
        <dd className="m-0 mt-2 max-w-[68ch] text-[14px] leading-[1.45] text-text-secondary">{rejected}</dd>
      </div>
    </dl>
    {source ? (
      <p className="mt-4 border-t border-line pt-3 font-mono text-[12px] leading-normal text-muted">
        Where this lives: {source}
      </p>
    ) : null}
  </article>
);

export default DecisionCard;
