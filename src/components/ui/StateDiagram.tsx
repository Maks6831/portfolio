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
 * A server-rendered state diagram made of real text on a bezel panel. The states and the transitions between them are
 * one ordered list, so a screen reader hears the lifecycle in order; the only decoration is the aria-hidden arrow,
 * which points down while the boxes are stacked (below md) and right once they sit in a row. The caption underneath is
 * the shortcut row: it carries the "within 30 days" path the three boxes leave out, drawn muted under a dashed rule at
 * every width. No image, no SVG, no fixed widths.
 */
const StateDiagram = ({ id, states, transitions, caption, className }: Props) => {
  const captionId = `${id}-caption`;
  return (
    <figure aria-labelledby={captionId} className={cn("m-0 rounded-md border border-line bg-bezel p-5", className)}>
      <ol role="list" className="m-0 flex list-none flex-col gap-3 p-0 md:flex-row md:items-stretch">
        {states.flatMap((entry, i) => {
          const items = [
            <li key={`state-${i}`} className="rounded-md border border-accent p-4 md:flex-1">
              <span className="block text-[16px] font-semibold text-text">{entry.state}</span>
              <span className="mt-1 block text-[12.5px] leading-snug text-text-secondary">{entry.meaning}</span>
            </li>,
          ];
          if (i < states.length - 1) {
            items.push(
              <li
                key={`transition-${i}`}
                className="flex items-center gap-2 pl-4 font-mono text-[12px] text-muted md:max-w-[14ch] md:flex-col md:justify-center md:self-center md:px-0 md:text-center"
              >
                <span aria-hidden="true" className="rotate-90 text-[18px] leading-none text-accent md:rotate-0">
                  &rarr;
                </span>
                <span>{transitions[i]}</span>
              </li>
            );
          }
          return items;
        })}
      </ol>
      <figcaption
        id={captionId}
        className="mt-4 max-w-[68ch] border-t border-dashed border-line pt-3 font-mono text-[12px] leading-normal text-muted"
      >
        {caption}
      </figcaption>
    </figure>
  );
};

export default StateDiagram;
