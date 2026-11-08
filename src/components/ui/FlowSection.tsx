import type { ReactNode } from "react";
import Counter from "@/components/ui/Counter";

/** Flow section (Experience, Contact): no tab; in stack mode it slides over sheet 03 and holds the counter at 03 / 03. */
export default function FlowSection({ id, labelledBy, children }: { id: string; labelledBy: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className="flow">
      {children}
      <Counter n={3} />
    </section>
  );
}
