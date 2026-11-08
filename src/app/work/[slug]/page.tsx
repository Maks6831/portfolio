import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

import { FloatingNav } from "@/components/islands/FloatingNavbar";
import PageShell from "@/components/layout/PageShell";
import CaseFooter from "@/components/case-study/CaseFooter";
import ContactSection from "@/components/case-study/ContactSection";
import OnThisPage from "@/components/case-study/OnThisPage";
import OwnedSection from "@/components/case-study/OwnedSection";
import ShotGroup from "@/components/case-study/ShotGroup";
import SummarySection from "@/components/case-study/SummarySection";
import TrailTab from "@/components/case-study/TrailTab";
import AssistantSection from "@/components/sections/AssistantSection";
import DecisionsSection from "@/components/sections/DecisionsSection";
import PaymentsSection from "@/components/sections/PaymentsSection";
import TestingSection from "@/components/sections/TestingSection";
import Chip from "@/components/ui/Chip";
import { caseStudySlugs, getCaseStudy } from "@/content/work";
import { siteMeta } from "@/content/site";
import { formatDay } from "@/lib/dates";

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

// Chips in the header's meta row: DESIGN.md chip (square corners, hairline, mono accent text).
const chipClass =
  "rounded-sm border-line bg-transparent px-[9px] py-[5px] font-mono text-[11px] leading-none tracking-[0.04em] text-accent";

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  // The seven sections of the reading trail, in page order, under the same conditions each one renders with.
  // `tab` is the short name on the parked tab; `label` the full name in On this page.
  const sections = [
    { id: "summary", tab: "Summary", label: "Summary" },
    { id: "owned", tab: "What I owned", label: "What I owned" },
    ...(study.payments ? [{ id: "payments", tab: "Booking and payments", label: "Booking and payments flow" }] : []),
    ...(study.decisions?.length ? [{ id: "decisions", tab: "Decisions", label: "Decisions and rejected alternatives" }] : []),
    ...(study.testing ? [{ id: "testing", tab: "Testing and delivery", label: "Testing and delivery" }] : []),
    ...(study.assistant ? [{ id: "assistant", tab: "Admin AI assistant", label: "Admin AI assistant" }] : []),
    { id: "contact", tab: "Contact", label: "Contact" },
  ];
  const total = sections.length;
  const trailOf = (id: string) => ({ n: sections.findIndex((x) => x.id === id) + 1, total });
  const updated = formatDay(study.updated);
  const shotsIn = (section: string) => study.screenshots.filter((shot) => shot.section === section);
  const shotCount = (section: string) => {
    const n = shotsIn(section).length;
    return n ? `${n} ${n === 1 ? "shot" : "shots"}` : undefined;
  };
  const media = (section: string) => <ShotGroup shots={shotsIn(section)} />;

  return (
    <PageShell surface="case-study">
      <div className="relative w-full overflow-x-clip bg-stage">
        <FloatingNav navItems={navItems} />

        <header className="flex flex-col px-5 pb-11 pt-8 md:px-10 lg:min-h-[max(100svh,720px)] lg:px-16 lg:pb-11 lg:pt-24">
          <div className="lg:max-w-[760px]">
            <p className="m-0 mb-3.5 font-mono text-[12px] tracking-[0.06em] text-accent lg:mb-5">{study.eyebrow}</p>
            <h1 className="m-0 mb-3.5 text-[33px] font-bold leading-[1.02] tracking-[-0.03em] text-text lg:mb-5 lg:text-[56px]">
              {study.title}
            </h1>
            <p className="m-0 mb-6 max-w-[620px] text-[15px] leading-[1.48] text-text-secondary lg:text-[18px]">{study.lede}</p>
            <div className="flex flex-wrap items-center gap-x-[18px] gap-y-3 font-mono text-[11px] tracking-[0.06em] text-muted">
              <ul role="list" className="m-0 flex list-none flex-wrap gap-1.5 p-0" aria-label="Technologies used">
                {study.stack.map((item) => (
                  <li key={item}>
                    <Chip className={chipClass}>{item}</Chip>
                  </li>
                ))}
              </ul>
              <a
                href={study.liveSite.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-6 items-center border-b border-accent pb-0.5 font-sans text-[14px] font-semibold tracking-normal text-accent hover:border-accent-pressed hover:text-accent-pressed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              >
                {study.liveSite.label}
                <span aria-hidden="true">&nbsp;↗</span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              {updated ? <span>Updated {updated}</span> : null}
            </div>
          </div>
          <OnThisPage items={sections.map(({ id, label }) => ({ id, label }))} />
          <div aria-hidden="true" className="display-word mt-7 lg:mt-auto lg:pt-7">
            <small className="hidden lg:block">Case study · 01</small>
            {study.name}
          </div>
        </header>

        <div className="trail">
          <TrailTab {...trailOf("summary")} id="summary" name="Summary" />
          <SummarySection before={study.summary.before} after={study.summary.after} trail={trailOf("summary")} />

          <TrailTab {...trailOf("owned")} id="owned" name="What I owned" detail={shotCount("owned")} />
          <OwnedSection owned={study.owned} trail={trailOf("owned")} media={media("owned")} />

          {study.payments ? (
            <>
              <TrailTab {...trailOf("payments")} id="payments" name="Booking and payments" detail={shotCount("payments")} />
              <PaymentsSection payments={study.payments} trail={trailOf("payments")} media={media("payments")} />
            </>
          ) : null}

          {study.decisions?.length ? (
            <>
              <TrailTab {...trailOf("decisions")} id="decisions" name="Decisions" />
              <DecisionsSection decisions={study.decisions} diagram={study.payments?.diagram} trail={trailOf("decisions")} />
            </>
          ) : null}

          {study.testing ? (
            <>
              <TrailTab {...trailOf("testing")} id="testing" name="Testing and delivery" detail={shotCount("testing")} />
              <TestingSection testing={study.testing} trail={trailOf("testing")} media={media("testing")} />
            </>
          ) : null}

          {study.assistant ? (
            <>
              <TrailTab {...trailOf("assistant")} id="assistant" name="Admin AI assistant" detail={shotCount("assistant")} />
              <AssistantSection assistant={study.assistant} trail={trailOf("assistant")} media={media("assistant")} />
            </>
          ) : null}

          <TrailTab {...trailOf("contact")} id="contact" name="Contact" />
          <ContactSection trail={trailOf("contact")} />
        </div>

        <CaseFooter />
      </div>
    </PageShell>
  );
}
