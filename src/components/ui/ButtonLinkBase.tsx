import type { ComponentType, ReactNode } from "react";
import { cn, isRoute } from "@/app/lib/utils";

// No `next/link` import here, on purpose: see ButtonLink.tsx, which supplies it as `routeLink`.

export type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  external?: boolean;
  download?: boolean;
  icon?: ReactNode;
  className?: string;
};

type RouteLink = ComponentType<{ href: string; className?: string; children?: ReactNode }>;
type Props = ButtonLinkProps & {
  /** Renders internal routes (`next/link` from ButtonLink). Without it every href is a plain `<a>`. */
  routeLink?: RouteLink;
};

const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring";

type AnchorProps = Pick<Props, "href" | "external" | "download" | "className" | "children" | "routeLink">;

/** Internal routes go through `routeLink` when given; `#` anchors, `mailto:`, downloads and external URLs stay
 * plain `<a>`. Only external links open a new tab. */
const Anchor = ({ href, external, download, className, children, routeLink: Route }: AnchorProps) => {
  if (Route && isRoute(href) && !external && !download) {
    return (
      <Route href={href} className={className}>
        {children}
      </Route>
    );
  }
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : undefined)}
      download={download || undefined}
      className={className}
    >
      {children}
    </a>
  );
};

/** A link styled as a button. Shimmer is primary-only and static under reduced motion. */
const ButtonLinkBase = ({
  href,
  children,
  variant = "primary",
  external = false,
  download = false,
  icon,
  className,
  routeLink,
}: Props) => {
  if (variant === "secondary") {
    return (
      <Anchor
        href={href}
        external={external}
        download={download}
        routeLink={routeLink}
        className={cn(
          "inline-flex h-12 min-h-[44px] items-center justify-center gap-2 rounded-full border border-border px-7 text-sm font-medium text-text-primary transition-colors hover:border-accent motion-reduce:transition-none",
          focus,
          className
        )}
      >
        {children}
        {icon}
        {external && <span className="sr-only">(opens in a new tab)</span>}
      </Anchor>
    );
  }

  return (
    <Anchor
      href={href}
      external={external}
      download={download}
      routeLink={routeLink}
      className={cn(
        "relative inline-flex h-12 min-h-[44px] overflow-hidden rounded-full p-[1px]",
        focus,
        className
      )}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(110deg,theme(colors.accent-strong)_40%,theme(colors.accent-glow)_50%,theme(colors.accent-strong)_60%)] bg-[length:200%_100%] animate-shimmer-slow motion-reduce:animate-none"
      />
      <span className="relative inline-flex h-full w-full items-center justify-center gap-2 rounded-full bg-accent-strong px-7 text-sm font-medium text-text-primary">
        {children}
        {icon}
        {external && <span className="sr-only">(opens in a new tab)</span>}
      </span>
    </Anchor>
  );
};

export default ButtonLinkBase;
