import Chip from "@/components/ui/Chip";

type Props = {
  title: string;
  body: string;
  chip?: string;
  /** Only the "Safe by design" tile has one: a stretched <a> on the h3 plus a visible "→" line. */
  link?: { href: string; label: string };
};

/** Proof tile (DESIGN.md proof-tile). Static, except the link tile, which alone reacts to hover and focus. */
const ProofTile = ({ title, body, chip, link }: Props) => (
  <div className={link ? "tile tile-link" : "tile"}>
    <h3>{link ? <a className="stretch" href={link.href}>{title}</a> : title}</h3>
    <p>{body}</p>
    {link ? (
      <span className="link" aria-hidden="true">
        {link.label} →
      </span>
    ) : null}
    {chip ? <Chip className="tile-chip">{chip}</Chip> : null}
  </div>
);

export default ProofTile;
