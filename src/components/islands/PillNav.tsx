"use client";
import { useEffect, useState } from "react";

// The one Sections nav (EXPERIENCE.md Pill nav) and the only IntersectionObserver on the site. The anchors are
// server-rendered, so the nav works without JS; the observer only sets aria-current, so nothing is current before
// hydration. `groups[i]` lists the section ids that make item i current.
type Item = { name: string; href: string };

export default function PillNav({ items, groups }: { items: Item[]; groups: string[][] }) {
  const [cur, setCur] = useState(-1);

  useEffect(() => {
    const order: { id: string; g: number; el: Element }[] = [];
    groups.forEach((ids, g) =>
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) order.push({ id, g, el });
      }),
    );
    // Document order, so the lowest section in the band wins (stacked sheets overlap).
    order.sort((a, b) => (a.el.compareDocumentPosition(b.el) & 4 ? -1 : 1));
    const on = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) on.add(e.target);
          else on.delete(e.target);
        }
        setCur(order.reduce((c, o) => (on.has(o.el) ? o.g : c), -1));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    order.forEach((o) => io.observe(o.el));
    return () => io.disconnect();
  }, [groups]);

  return (
    <nav aria-label="Sections" className="hud-nav">
      {items.map((it, i) => (
        <a key={it.href} href={it.href} aria-current={cur === i ? "true" : undefined}>
          {it.name}
          {i === 0 && <span aria-hidden="true" className="max-lg:hidden"> (01)</span>}
        </a>
      ))}
    </nav>
  );
}
