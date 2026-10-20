"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";

type Item = { id: string; label: string };

type Props = {
  /** One entry per section on the page, in page order. `id` is the section's id, `label` the link text. */
  items: Item[];
};

// The same visible focus ring as ScreenshotViewer. Class strings are joined by hand rather than through `cn`:
// a second client importer would split that helper out of the chunk the home page loads and grow its first-load JS.
const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring";
const linkClass = `flex min-h-11 items-center border-l pl-3.5 text-caption hover:text-text-primary ${focusRing}`;

// A section is current once its top reaches a third of the viewport height. The line never sits above where a
// contents jump lands a section (scroll-mt-28, 112px): on a short viewport the section just jumped to would otherwise
// sit below the line and leave the previous one marked.
const READING_LINE = 1 / 3;
const MIN_READING_LINE = 120;

/**
 * The current section, from each rendered section's top relative to the viewport, in page order: the last one whose
 * top is at or above the reading line, the first one while every top is below it, or the last one once the page cannot
 * scroll any further (a short last section never reaches the line). Null when there are no sections.
 */
export function pickCurrent(
  sections: { id: string; top: number }[],
  viewportHeight: number,
  atBottom: boolean
): string | null {
  if (!sections.length) return null;
  if (atBottom) return sections[sections.length - 1].id;
  const line = Math.max(viewportHeight * READING_LINE, MIN_READING_LINE);
  let current = sections[0].id;
  for (const { id, top } of sections) {
    if (top <= line) current = id;
  }
  return current;
}

export function ContentsList({
  items,
  current,
  onNavigate,
}: {
  items: Item[];
  current: string | null;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, id: string) => void;
}) {
  return (
    <ol role="list" className="m-0 list-none p-0">
      {items.map(({ id, label }) => {
        const isCurrent = id === current;
        return (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={isCurrent ? "location" : undefined}
              onClick={(event) => onNavigate(event, id)}
              className={`${linkClass} ${isCurrent ? "border-accent text-text-primary" : "border-border text-text-secondary"}`}
            >
              {label}
            </a>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * The case study's contents list. At lg and above it is a sticky column beside the sections; below lg it is a
 * closed disclosure above the first section. Links are plain in-page anchors, so both work without JavaScript;
 * with it, the link for the section at the top of the reading area carries aria-current="location". The server
 * HTML marks nothing current, so a page without JavaScript never claims a position it cannot track.
 */
export default function TocHighlight({ items }: Props) {
  const [current, setCurrent] = useState<string | null>(null);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    let frame = 0;
    const sync = () => {
      frame = 0;
      const sections = items.flatMap(({ id }) => {
        const el = document.getElementById(id);
        return el ? [{ id, top: el.getBoundingClientRect().top }] : [];
      });
      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      setCurrent(pickCurrent(sections, window.innerHeight, atBottom));
    };
    // At most one measurement per frame, however often scroll fires.
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(sync);
    };
    // Sync after mount, after load and on pageshow, because browsers restore a mid-page scroll position after
    // the first frame (as FloatingNavbar does).
    schedule();
    window.addEventListener("load", schedule);
    window.addEventListener("pageshow", schedule);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("load", schedule);
      window.removeEventListener("pageshow", schedule);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [items]);

  // Arriving with a hash by client-side navigation (the home page's link to #assistant) leaves focus on <body>, because
  // the router moves scroll but not focus. Move focus to the named element without scrolling, as a contents jump does.
  useEffect(() => {
    let id = "";
    try {
      id = decodeURIComponent(window.location.hash.slice(1));
    } catch {
      return;
    }
    const target = id ? document.getElementById(id) : null;
    if (target && document.activeElement !== target) target.focus({ preventScroll: true });
  }, []);

  // The browser follows the link itself. Closing the disclosure first means the jump lands where the section
  // ends up once the list has collapsed; focus then moves to the section if the browser did not move it there.
  const onNavigate = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    if (detailsRef.current) detailsRef.current.open = false;
    window.setTimeout(() => {
      const target = document.getElementById(id);
      if (target && document.activeElement !== target) target.focus({ preventScroll: true });
    }, 0);
  };

  if (!items.length) return null;

  return (
    <div>
      <nav aria-label="Contents" className="lg:hidden">
        <details ref={detailsRef} className="group mb-10 rounded-card border border-border bg-surface">
          <summary
            className={`flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-card px-5 text-caption text-text-primary [&::-webkit-details-marker]:hidden ${focusRing}`}
          >
            Contents
            {/* Inline rather than from react-icons, whose icons are bundled into a chunk the home page loads too. */}
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 shrink-0 group-open:rotate-180"
            >
              <path d="m5 7.5 5 5 5-5" />
            </svg>
          </summary>
          <div className="px-5 pb-4">
            <ContentsList items={items} current={current} onNavigate={onNavigate} />
          </div>
        </details>
      </nav>
      {/* On a short window the pinned column scrolls on its own; the 4px padding keeps the focus ring inside it. */}
      <nav
        aria-label="Contents"
        className="hidden lg:block lg:sticky lg:top-28 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:p-1"
      >
        <p className="text-eyebrow uppercase text-accent">On this page</p>
        <div className="mt-4">
          <ContentsList items={items} current={current} onNavigate={onNavigate} />
        </div>
      </nav>
    </div>
  );
}
