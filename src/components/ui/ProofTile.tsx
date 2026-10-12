import type { ReactNode } from "react";
import { cn } from "@/app/lib/utils";
import { FaLocationArrow } from "react-icons/fa6";
import Chip from "@/components/ui/Chip";

type Props = {
  title: string;
  body: string;
  chip?: string;
  /** External URL. Omit when the tile leads nowhere real. */
  href?: string;
  className?: string;
};

const tileClass =
  "block h-full rounded-card border border-border bg-surface p-7 transition-colors duration-200";

const Content = ({ title, body, chip, external }: Pick<Props, "title" | "body" | "chip"> & { external?: boolean }): ReactNode => (
  <>
    {chip ? (
      <Chip className="mb-4 text-success">{chip}</Chip>
    ) : null}
    <h3 className="text-subheading text-text-primary">{title}</h3>
    <p className="mt-3 text-caption text-text-secondary">{body}</p>
    {external ? (
      <>
        <FaLocationArrow aria-hidden="true" className="mt-4 text-accent" />
        <span className="sr-only"> (opens in a new tab)</span>
      </>
    ) : null}
  </>
);

/** Static proof tile: a verifiable fact, optional status chip, link only when real. */
const ProofTile = ({ title, body, chip, href, className }: Props) => {
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          tileClass,
          "hover:border-accent focus-visible:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus-ring",
          className
        )}
      >
        <Content title={title} body={body} chip={chip} external />
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
