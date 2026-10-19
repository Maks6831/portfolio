import { cn } from "@/app/lib/utils";
import type { PaymentState } from "@/content/work/types";

type Props = {
  /** Prefix for the figcaption id that names the figure. */
  id: string;
  /** In lifecycle order. */
  states: PaymentState[];
  /** One label per gap between states. Extra labels are ignored; missing ones leave the gap unlabelled. */
  transitions: string[];
  caption: string;
  className?: string;
};

/**
 * Story 2.2: a server-rendered state diagram made of real text. The states and the transitions between them
 * are one ordered list, so a screen reader hears the lifecycle in order; the only decoration is the
 * aria-hidden arrow, which points down while the pills are stacked and right once they sit in a row.
 * No image, no SVG, no fixed widths.
 */
const StateDiagram = ({ id, states, transitions, caption, className }: Props) => {
  const captionId = `${id}-caption`;
  return (
    <figure aria-labelledby={captionId} className={cn("m-0", className)}>
      <ol role="list" className="m-0 flex list-none flex-col gap-3 p-0 md:flex-row md:items-stretch">
        {states.flatMap((entry, i) => {
          const items = [
            <li
              key={`state-${i}`}
              className="rounded-card border border-border bg-surface-raised p-5 md:flex-1"
            >
              <span className="block text-body font-semibold text-text-primary">{entry.state}</span>
              <span className="mt-1 block text-caption text-text-secondary">{entry.meaning}</span>
            </li>,
          ];
          if (i < states.length - 1) {
            items.push(
              <li
                key={`transition-${i}`}
                className="flex items-center gap-2 pl-5 text-caption text-text-muted md:max-w-[14ch] md:flex-col md:justify-center md:self-center md:px-0 md:text-center"
              >
                <span aria-hidden="true" className="rotate-90 text-body leading-none md:rotate-0">
                  &rarr;
                </span>
                <span>{transitions[i]}</span>
              </li>
            );
          }
          return items;
        })}
      </ol>
      <figcaption id={captionId} className="mt-4 max-w-[68ch] text-caption text-text-muted">
        {caption}
      </figcaption>
    </figure>
  );
};

export default StateDiagram;
