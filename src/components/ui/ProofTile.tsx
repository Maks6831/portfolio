import type { ReactNode } from "react";
import Link from "next/link";
import { cn, isRoute } from "@/app/lib/utils";
import { FaLocationArrow } from "react-icons/fa6";
import Chip from "@/components/ui/Chip";

type Props = {
  title: string;
  body: string;
  chip?: string;
  /** An internal route (opens in place, via `next/link`), an http(s) or "//" URL (new tab), or any other href (opens in
   * place). Omit when the tile leads nowhere real. */
  href?: string;
  className?: string;
};

const tileClass =
  "block h-full rounded-card border border-border bg-surface p-7 transition-colors duration-200";
const linkClass =
  "hover:border-accent focus-visible:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus-ring";

const Content = ({ title, body, chip, linked, external }: Pick<Props, "title" | "body" | "chip"> & { linked?: boolean; external?: boolean }): ReactNode => (
  <>
    {chip ? (
      <Chip className="mb-4 text-success">{chip}</Chip>
    ) : null}
    <h3 className="text-subheading text-text-primary">{title}</h3>
    <p className="mt-3 text-caption text-text-secondary">{body}</p>
    {linked ? <FaLocationArrow aria-hidden="true" className="mt-4 text-accent" /> : null}
    {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
  </>
);

/** Static proof tile: a verifiable fact, optional status chip, link only when real. */
const ProofTile = ({ title, body, chip, href, className }: Props) => {
  // Internal: opens in place, so no target and no new-tab hint.
  if (href && isRoute(href)) {
    return (
      <Link href={href} className={cn(tileClass, linkClass, className)}>
        <Content title={title} body={body} chip={chip} linked />
      </Link>
    );
  }
  // External (http(s) or protocol-relative): a new tab, with rel and the hint.
  if (href && /^(?:https?:)?\/\//i.test(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(tileClass, linkClass, className)}
      >
        <Content title={title} body={body} chip={chip} linked external />
      </a>
    );
  }
  // Anything else (`#` anchors, `mailto:`, static files): a plain link that opens in place.
  if (href) {
    return (
      <a href={href} className={cn(tileClass, linkClass, className)}>
        <Content title={title} body={body} chip={chip} linked />
      </a>
    );
  }
  return (
    <div className={cn(tileClass, className)}>
      <Content title={title} body={body} chip={chip} />
    </div>
  );
};

export default ProofTile;
