type Item = { id: string; label: string };

const pad = (n: number) => String(n).padStart(2, "0");
const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring";

/**
 * The case-study header's jump list, one `nav` landmark. At lg: a row of plain anchors. Below lg: a native
 * disclosure, closed, with 44px rows. Both lists live in the one nav and CSS shows one of them, so there is no script
 * and no second landmark. Nothing is marked current: the tab trail and the heading blocks do that job.
 */
const OnThisPage = ({ items }: { items: Item[] }) => {
  if (!items.length) return null;
  return (
    <nav
      id="on-this-page"
      aria-label="On this page"
      className="mt-6 lg:mt-10"
    >
      <div className="lg:hidden">
        <details className="group border-y border-line">
          <summary
            className={`flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 font-mono text-[12px] uppercase tracking-[0.08em] text-text [&::-webkit-details-marker]:hidden ${focusRing}`}
          >
            <span>On this page · {items.length} sections</span>
            <span aria-hidden="true" className="text-[16px] text-accent">
              <span className="group-open:hidden">+</span>
              <span className="hidden group-open:inline">–</span>
            </span>
          </summary>
          <ol role="list" className="m-0 list-none p-0 pb-2">
            {items.map(({ id, label }, i) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`flex min-h-11 items-center border-t border-line font-mono text-[12px] uppercase tracking-[0.08em] text-text no-underline ${focusRing}`}
                >
                  <span className="mr-3 text-accent">{pad(i + 1)}</span>
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </details>
      </div>
      <div className="hidden border-t border-line pt-3.5 lg:flex lg:flex-wrap lg:items-center lg:gap-x-7">
        <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-muted">On this page</span>
        <ol role="list" className="m-0 flex list-none flex-wrap items-center gap-x-7 p-0">
          {items.map(({ id, label }, i) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`inline-flex min-h-6 items-center py-2 font-mono text-[12px] uppercase tracking-[0.08em] text-text no-underline hover:text-accent ${focusRing}`}
              >
                <span className="mr-1.5 text-accent">{pad(i + 1)}</span>
                {label}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default OnThisPage;
