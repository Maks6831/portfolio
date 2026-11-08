import ScreenshotFrame from "@/components/ui/ScreenshotFrame";
import Sheet from "@/components/ui/Sheet";
import { supportingWork } from "@/content/site";

// Sheet 03 (#also): the assistant (featured, into the case study, with its captioned screenshot) and CoinFlow (out,
// same tab). Titles are h3 with a stretched link; the arrow line is decorative. The screenshot is not a viewer trigger.
const assistantSizes = "(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw";

const SupportingWork = () => (
  <Sheet n={3} id="also" labelledBy="h-also">
    <div>
      <p className="eyebrow">{supportingWork.eyebrow}</p>
      <h2 id="h-also">{supportingWork.heading}</h2>
      <p className="sub">{supportingWork.sub}</p>
    </div>
    <ul role="list" className="also">
      {supportingWork.items.map((t) => {
        const featured = "featured" in t && t.featured;
        const external = t.href?.startsWith("http");
        return (
          <li key={t.id} className={featured ? "it it-ft" : "it"}>
            <div className="it-txt">
              <span className="kicker">
                <i>{t.kicker[0]}</i> · {t.kicker[1]}
              </span>
              <h3>
                <a className="stretch" href={t.href}>
                  {t.title}
                </a>
              </h3>
              <p>{t.body}</p>
              <span className="link" aria-hidden="true">
                {t.linkLabel} {external ? "↗" : "→"}
              </span>
            </div>
            {"image" in t && t.image ? (
              <ScreenshotFrame
                src={t.image.src}
                width={t.image.width}
                height={t.image.height}
                alt={t.image.alt}
                caption={t.image.caption}
                sizes={assistantSizes}
              />
            ) : null}
          </li>
        );
      })}
    </ul>
  </Sheet>
);

export default SupportingWork;
