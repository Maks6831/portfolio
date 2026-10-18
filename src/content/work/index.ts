import type { CaseStudy } from "./types";
import { simplyHappy } from "./simply-happy";

export type { CaseStudy, Screenshot, OwnedArea, Decision, ProseSection } from "./types";

/** Every case study keyed by slug: the single lookup for the route, the sitemap and the home card. */
export const caseStudies: Readonly<Record<string, CaseStudy>> = {
  [simplyHappy.slug]: simplyHappy,
};

export const caseStudySlugs = Object.keys(caseStudies);

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return Object.hasOwn(caseStudies, slug) ? caseStudies[slug] : undefined;
}
