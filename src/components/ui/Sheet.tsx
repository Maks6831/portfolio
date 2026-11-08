import type { ReactNode } from "react";
import Counter from "@/components/ui/Counter";
import { sheetTabs } from "@/content/site";

/** Home sheet (EXPERIENCE.md Sheet, Sheet tab): a section with its tab, body and counter chip. The tab is a label, not a
 * link. Sticky stacking and the flat modes are CSS only (src/app/home.css). */
export default function Sheet({ n, id, labelledBy, children }: { n: 1 | 2 | 3; id: string; labelledBy: string; children: ReactNode }) {
  const tab = sheetTabs[n - 1];
  return (
    <section id={id} aria-labelledby={labelledBy} className={`sheet sheet-${n}`}>
      <div className="tab">
        <b>{`0${n} / 03`}</b>
        <span>{tab.name}</span>
        <span className="tab-d">{tab.detail}</span>
        <span className="tab-hint" aria-hidden="true">{tab.hint}</span>
      </div>
      <div className="sbody">{children}</div>
      <Counter n={n} />
    </section>
  );
}
