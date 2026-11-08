import type { CSSProperties, ReactNode } from "react";

export type TrailPosition = { n: number; total: number };

type Props = {
  id: string;
  /** The section's h2, exactly as the content gates expect it. */
  title: string;
  /** Position in the reading trail. Omitted when a section is rendered on its own (the component gates do that). */
  trail?: TrailPosition;
  children: ReactNode;
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * One case-study section: a sticky heading block (counter, h2, the way back to "On this page") in the left column at
 * lg, then the body in the right column. The matching tab is a sibling of the section (see TrailTab), never inside
 * it, or it would scroll away with the section and break the trail. Sticky offsets live in globals.css, keyed off
 * `--n`, so the page needs no script. The counter and the up link are decoration for sighted readers: the h2 and the
 * tab already say where you are.
 */
const SectionFrame = ({ id, title, trail, children }: Props) => (
  <section
    id={id}
    aria-labelledby={`${id}-heading`}
    tabIndex={-1}
    className="trail-section focus:outline-none"
    style={trail ? ({ "--n": trail.n } as CSSProperties) : undefined}
  >
    <div className="trail-head">
      <div className="trail-hb">
        {trail ? (
          <div className="trail-hb-top">
            <span aria-hidden="true" data-trail-counter="" className="text-accent">
              {pad(trail.n)} / {pad(trail.total)}
            </span>
            <a href="#on-this-page" data-trail-up="" className="trail-up">
              <span aria-hidden="true">↑ </span>On this page
            </a>
          </div>
        ) : null}
        <h2
          id={`${id}-heading`}
          className="text-[28px] font-bold leading-[1.04] tracking-[-0.03em] text-text lg:text-[34px]"
        >
          {title}
        </h2>
      </div>
    </div>
    <div className="trail-body">{children}</div>
  </section>
);

export default SectionFrame;
