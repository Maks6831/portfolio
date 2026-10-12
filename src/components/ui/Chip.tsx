import type { ReactNode } from "react";
import { cn } from "@/app/lib/utils";

type Props = { children: ReactNode; className?: string };

/** Pill chip for stack and status labels (DESIGN.md chip). */
const Chip = ({ children, className }: Props) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full border border-border bg-surface-raised px-3.5 py-1.5 text-caption text-text-secondary",
      className
    )}
  >
    {children}
  </span>
);

export default Chip;
