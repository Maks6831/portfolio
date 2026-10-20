import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

import { FloatingNav } from "@/components/islands/FloatingNavbar";
import ScreenshotViewer from "@/components/islands/ScreenshotViewer";
import TocHighlight from "@/components/islands/TocHighlight";
import AssistantSection from "@/components/sections/AssistantSection";
import DecisionsSection from "@/components/sections/DecisionsSection";
import Footer from "@/components/sections/Footer";
import PaymentsSection from "@/components/sections/PaymentsSection";
import TestingSection from "@/components/sections/TestingSection";
import ButtonLink from "@/components/ui/ButtonLink";
import CaseStudyPanel from "@/components/ui/CaseStudyPanel";
import Chip from "@/components/ui/Chip";
import { caseStudySlugs, getCaseStudy } from "@/content/work";
import { siteMeta } from "@/content/site";

type Props = { params: Promise<{ slug: string }> };

// Fully static: every slug is prerendered and anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }));
}

// Home-absolute links so the nav works from a nested route; #contact is on this page.
const navItems = [
  { name: "About", link: "/#about" },
  { name: "Work", link: "/#work" },
  { name: "Contact", link: "#contact" },
];

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  // `openGraph` is replaced, not merged, so carry the root's social image over. `twitter.images`
  // is left unset so it falls back to that same image.
  const inherited = await parent;
  const title = `${study.name} case study · ${siteMeta.name}`;
  const path = `/work/${study.slug}`;
  return {
    title,
    description: study.lede,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName: siteMeta.name,
      title,
      description: study.lede,
      locale: "en_GB",
      images: inherited.openGraph?.images ?? [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: study.lede,
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  // One link per rendered section, in page order, under the same conditions each section renders with.
  // Contact is left out: the floating nav already links it.
  const contents = [
    { id: "summary", label: "Summary" },
    { id: "owned", label: "What I owned" },
    ...(study.payments ? [{ id: "payments", label: "Booking and payments" }] : []),
    ...(study.decisions?.length ? [{ id: "decisions", label: "Decisions" }] : []),
    ...(study.testing ? [{ id: "testing", label: "Testing and delivery" }] : []),
    ...(study.assistant ? [{ id: "assistant", label: "Admin AI assistant" }] : []),
    ...(study.screenshots.length > 0 ? [{ id: "screenshots", label: "Screenshots" }] : []),
  ];

  return (
    <div className="relative bg-black-100 w-full flex justify-center items-center flex-col mx-auto sm:px-10 px-5 overflow-clip">
      <div className="max-w-7xl w-full">
        <FloatingNav navItems={navItems} />

        <header className="pt-36 pb-section-gap-mobile md:pb-section-gap">
          <p className="text-eyebrow uppercase text-accent">{study.eyebrow}</p>
          <h1 className="mt-4 max-w-[68ch] text-display-mobile md:text-display text-text-primary">
            {study.title}
          </h1>
          <p className="mt-6 max-w-[68ch] text-body text-text-secondary">{study.lede}</p>
        </header>

        <div className="lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
          <TocHighlight items={contents} />
          <div className="min-w-0">
            <section
              id="summary"
              aria-labelledby="summary-heading"
              tabIndex={-1}
              className="relative z-10 scroll-mt-28 pb-section-gap-mobile focus:outline-none md:pb-section-gap"
            >
              <h2 id="summary-heading" className="text-subheading md:text-heading text-text-primary">
                Summary
              </h2>
              <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 md:items-stretch">
                <CaseStudyPanel heading="Before">{study.summary.before}</CaseStudyPanel>
                <CaseStudyPanel heading="After" tone="primary">
                  {study.summary.after}
                </CaseStudyPanel>
              </div>
              <ul role="list" className="m-0 mt-8 flex list-none flex-wrap gap-2 p-0" aria-label="Technologies used">
                {study.stack.map((item) => (
                  <li key={item}>
                    <Chip>{item}</Chip>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <ButtonLink href={study.liveSite.href} variant="secondary" external>
                  {study.liveSite.label}
                </ButtonLink>
              </div>
            </section>

            <section
              id="owned"
              aria-labelledby="owned-heading"
              tabIndex={-1}
              className="relative z-10 scroll-mt-28 pb-section-gap-mobile focus:outline-none md:pb-section-gap"
            >
              <h2 id="owned-heading" className="text-subheading md:text-heading text-text-primary">
                What I owned
              </h2>
              <ul role="list" className="m-0 mt-10 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 xl:grid-cols-3">
                {study.owned.map((area) => (
                  <li key={area.title}>
                    <CaseStudyPanel heading={area.title}>{area.body}</CaseStudyPanel>
                  </li>
                ))}
              </ul>
            </section>

            <PaymentsSection payments={study.payments} />

            <DecisionsSection decisions={study.decisions} />

            <TestingSection testing={study.testing} />

            <AssistantSection assistant={study.assistant} />

            {study.screenshots.length > 0 && (
              <section
                id="screenshots"
                aria-labelledby="screenshots-heading"
                tabIndex={-1}
                className="relative z-10 scroll-mt-28 pb-section-gap-mobile focus:outline-none md:pb-section-gap"
              >
                <h2 id="screenshots-heading" className="text-subheading md:text-heading text-text-primary">
                  Screenshots (test data)
                </h2>
                {study.screenshotsNote ? (
                  <p className="mt-4 max-w-[68ch] text-body text-text-secondary">{study.screenshotsNote}</p>
                ) : null}
                <ul role="list" className="m-0 mt-10 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2">
                  {study.screenshots.map((shot) => (
                    // The portrait phone capture keeps one column but is capped so it does not tower over its neighbours.
                    <li key={shot.src} className={shot.height > shot.width ? "md:max-w-sm" : undefined}>
                      <ScreenshotViewer {...shot} />
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
