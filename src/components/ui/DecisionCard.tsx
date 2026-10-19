import { cn } from "@/app/lib/utils";
import type { Decision } from "@/content/work/types";

type Props = Decision & { className?: string };

/**
 * DESIGN.md decision card: a surface tile with a hairline border holding the decision title and two
 * always-visible columns, "Chose" and "Rejected, because". Server-rendered; nothing is hidden behind
 * hover or disclosure. The optional "Where this lives" line names the part of the codebase in plain
 * words, never a path or a link.
 */
const DecisionCard = ({ title, chose, rejected, source, className }: Props) => (
  <article className={cn("h-full rounded-card border border-border bg-surface p-7", className)}>
    <h3 className="text-body font-semibold text-text-primary">{title}</h3>
    <dl className="m-0 mt-5 grid grid-cols-1 gap-6 md:grid-cols-2">
      <div>
        <dt className="text-eyebrow uppercase text-accent">Chose</dt>
        <dd className="m-0 mt-2 max-w-[68ch] text-body text-text-secondary">{chose}</dd>
      </div>
      <div>
        <dt className="text-eyebrow uppercase text-accent">Rejected, because</dt>
        <dd className="m-0 mt-2 max-w-[68ch] text-body text-text-secondary">{rejected}</dd>
      </div>
    </dl>
    {source ? <p className="mt-6 text-caption text-text-muted">Where this lives: {source}</p> : null}
  </article>
);

export default DecisionCard;
