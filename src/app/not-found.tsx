import type { Metadata } from "next";

// ButtonLinkBase, not ButtonLink: its links stay plain <a>, as before Story 2.9. Importing next/link here puts Link
// in this page's client graph, and Turbopack then splits the chunk home shares with the case study (+0.6 kB on
// home, over the 152.7 kB Story 2.9 holds it to). A 404 is usually a first load, so prefetch from it buys little.
import PageShell from "@/components/layout/PageShell";
import ButtonLink from "@/components/ui/ButtonLinkBase";
import { siteMeta } from "@/content/site";
import { getCaseStudy } from "@/content/work";

const title = `Page not found · ${siteMeta.name}`;
const description = "The page you followed a link to does not exist.";

// The root layout's canonical, description and social titles are the home page's; override them here.
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: null },
  openGraph: { type: "website", siteName: siteMeta.name, title, description, locale: "en_GB" },
  twitter: { card: "summary", title, description },
};

// Static: no request APIs, so it renders at build time for unmatched URLs and for notFound() from /work/[slug].
export default function NotFound() {
  const study = getCaseStudy("simply-happy");

  return (
    <PageShell surface="not-found">
      {/* The stage fills the viewport under the HUD strip. Left inset is the HUD's, so the h1 lines up with the
          name label. No counter, no sheets, no display word: the message and two links. */}
      <div className="bg-stage min-h-[70vh] w-full px-5 md:px-hud-inset-x">
        <section className="max-w-7xl pt-20 lg:pt-32 pb-section-gap-mobile md:pb-section-gap">
          <p className="font-mono text-sm tracking-[0.12em] text-text-secondary">404</p>
          <h1 className="mt-4 max-w-[68ch] text-display-mobile md:text-display text-text">
            Page not found
          </h1>
          <p className="mt-6 max-w-[68ch] text-body text-text-secondary">
            I could not find that page. The link may be old or mistyped. The home page
            {study ? ` and the ${study.name} case study are` : " is"} linked below.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row flex-wrap gap-4">
            <ButtonLink href="/">Back to home</ButtonLink>
            {study && (
              <ButtonLink href={`/work/${study.slug}`} variant="secondary">
                Read the {study.name} case study
              </ButtonLink>
            )}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
