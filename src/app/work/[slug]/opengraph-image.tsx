import { notFound } from "next/navigation";
import { siteMeta } from "@/content/site";
import { caseStudySlugs, getCaseStudy } from "@/content/work";
import { ogCard, ogSize } from "@/lib/og-card";

// The case study's own share card (src/lib/og-card.tsx), with the study's name and title where the site card has the
// person's name and role.
export const alt = `Case study by ${siteMeta.name}, ${siteMeta.role.toLowerCase()}.`;
export const size = ogSize;
export const contentType = "image/png";

// Prerender one card per case study, like the page itself.
export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }));
}

export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();
  return ogCard({ kicker: `CASE STUDY · ${siteMeta.name.toUpperCase()}`, title: study.name, line: study.title });
}
