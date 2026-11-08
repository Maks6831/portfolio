import type { CSSProperties } from "react";

type Props = { id: string; n: number; total: number; name: string; detail?: string };

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The section's tab: a link to the section that parks as a record of what has been read. A sibling of the sections
 * inside one container, in tab order. Geometry per layout mode is in globals.css (`.trail-tab`).
 */
const TrailTab = ({ id, n, total, name, detail }: Props) => (
  <a href={`#${id}`} className="trail-tab" style={{ "--n": n } as CSSProperties}>
    <b>
      {pad(n)} / {pad(total)}
    </b>
    <span>{name}</span>
    {detail ? <span className="trail-tab-hint">{detail}</span> : null}
  </a>
);

export default TrailTab;
