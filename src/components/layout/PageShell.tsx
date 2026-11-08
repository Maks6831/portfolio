import HudStrip, { type Surface } from "./HudStrip";
import PillNav from "@/components/islands/PillNav";
import { navItems } from "@/content/site";

// Sections that make each nav item current (EXPERIENCE.md Pill nav). Hero and unlisted ids: no item is current.
const groups: Record<Surface, string[][]> = {
  home: [["work", "proof", "also"], ["profile"], ["contact"]],
  "case-study": [["summary", "owned", "payments", "decisions", "testing", "assistant"], [], ["contact"]],
  "not-found": [[], [], []],
};

// Off the home page, Work and Profile are full-page links to home; Connect stays on the page when it has #contact.
function itemsFor(surface: Surface) {
  return navItems.map((n, i) => ({
    name: n.name,
    href: surface === "home" || (surface === "case-study" && i === 2) ? n.link : `/${n.link}`,
  }));
}

// The banner (HUD strip + the one Sections nav) and <main> for every route. `data-surface` lets globals.css pick the
// per-mode scroll-padding for the home page vs the case study without any script.
export default function PageShell({ surface, children, footer }: { surface: Surface; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <>
      <header className="hud-banner">
        <HudStrip surface={surface} />
        <PillNav items={itemsFor(surface)} groups={groups[surface]} />
      </header>
      <main id="main" data-surface={surface} tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
      {footer}
    </>
  );
}
