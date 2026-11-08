// HUD top labels (EXPERIENCE.md HUD label table). Server-rendered, no JS. At lg the strip is fixed and 32px tall;
// below lg it is an in-flow row. The clock digits arrive with story 4: here the box is only reserved.
// The case study's name is the home link: a plain <a>, not next/link, so no router code joins the page's chunks.
export type Surface = "home" | "case-study" | "not-found";

export default function HudStrip({ surface }: { surface: Surface }) {
  const label = (
    <>
      <span className="max-lg:sr-only">Muhammad Ali Khan · Full-stack engineer</span>
      <span aria-hidden="true" className="lg:hidden">M. A. Khan · Full-stack</span>
    </>
  );
  return (
    <div className="hud-strip">
      {surface === "case-study" ? (
        // eslint-disable-next-line @next/next/no-html-link-for-pages -- plain <a> on purpose: see the header comment
        <a href="/" className="hud-link" aria-label="Home: Muhammad Ali Khan, full-stack engineer">
          <span aria-hidden="true">← </span>
          <span aria-hidden="true" className="max-lg:hidden">Muhammad Ali Khan · Full-stack engineer</span>
          <span aria-hidden="true" className="lg:hidden">M. A. Khan · Full-stack</span>
        </a>
      ) : (
        <span>{label}</span>
      )}
      <span>
        <span className="max-lg:sr-only">London, UK</span>
        <span aria-hidden="true" className="lg:hidden">LDN</span>
        <span className="hud-clock" aria-hidden="true" />
      </span>
    </div>
  );
}
