import HudStrip, { type Surface } from "./HudStrip";

// The banner (HUD strip) and <main> for every route. `data-surface` lets globals.css pick the per-mode
// scroll-padding for the home page vs the case study without any script.
export default function PageShell({ surface, children }: { surface: Surface; children: React.ReactNode }) {
  return (
    <>
      <header className="hud-banner">
        <HudStrip surface={surface} />
      </header>
      <main id="main" data-surface={surface} tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
    </>
  );
}
