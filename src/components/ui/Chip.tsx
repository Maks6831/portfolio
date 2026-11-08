import type { ReactNode } from "react";
import { cn } from "@/app/lib/utils";

type Props = { children: ReactNode; className?: string };

/** Static text chip (DESIGN.md chip): never a link or filter. */
const Chip = ({ children, className }: Props) => (
  <span
    className={cn(
      "inline-flex items-center rounded-sm border border-line px-[9px] py-[5px] font-mono text-[11px] leading-none tracking-[0.04em] text-accent",
      className
    )}
  >
    {children}
  </span>
);

export default Chip;
