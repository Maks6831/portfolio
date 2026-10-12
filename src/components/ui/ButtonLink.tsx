import type { ReactNode } from "react";
import { cn } from "@/app/lib/utils";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  external?: boolean;
  icon?: ReactNode;
  className?: string;
};

const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring";

/** A link styled as a button. Shimmer is primary-only and static under reduced motion. */
const ButtonLink = ({
  href,
  children,
  variant = "primary",
  external = false,
  icon,
  className,
}: Props) => {
  const ext = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : undefined;

  if (variant === "secondary") {
    return (
      <a
        href={href}
        {...ext}
        className={cn(
          "inline-flex h-12 min-h-[44px] items-center justify-center gap-2 rounded-full border border-border px-7 text-sm font-medium text-text-primary transition-colors hover:border-accent motion-reduce:transition-none",
          focus,
          className
        )}
      >
        {children}
        {icon}
        {external && <span className="sr-only">(opens in a new tab)</span>}
      </a>
    );
  }

  return (
    <a
      href={href}
      {...ext}
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
    </a>
  );
};

export default ButtonLink;
