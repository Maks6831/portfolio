import type { ComponentType, ReactNode } from "react";
import { cn, isRoute } from "@/app/lib/utils";

// No `next/link` import here, on purpose: see ButtonLink.tsx, which supplies it as `routeLink`.

export type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  external?: boolean;
  download?: boolean;
  className?: string;
};

type RouteLink = ComponentType<{ href: string; className?: string; children?: ReactNode }>;
type Props = ButtonLinkProps & {
  /** Renders internal routes (`next/link` from ButtonLink). Without it every href is a plain `<a>`. */
  routeLink?: RouteLink;
};

const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-focus-ring";

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

/** A link styled as a button: solid accent (primary) or accent outline (secondary). */
const ButtonLinkBase = ({
  href,
  children,
  variant = "primary",
  external = false,
  download = false,
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
          "inline-flex min-h-[44px] items-center justify-center gap-2 rounded border border-accent px-5 py-3.5 text-sm leading-none font-semibold text-accent hover:border-accent-pressed hover:text-accent-pressed",
          focus,
          className
        )}
      >
        {children}
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
        "inline-flex min-h-[44px] items-center justify-center gap-2 rounded border border-accent bg-accent px-5 py-3.5 text-sm leading-none font-semibold text-stage hover:border-accent-pressed hover:bg-accent-pressed",
        focus,
        className
      )}
    >
      {children}
      {external && <span className="sr-only">(opens in a new tab)</span>}
    </Anchor>
  );
};

export default ButtonLinkBase;
