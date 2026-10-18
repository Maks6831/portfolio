/**
 * Typed contract for a case study. Content modules satisfy this type; the
 * `/work/[slug]` route, the sitemap and the home card read from it.
 * Content stays plain data: no JSX, nothing imported from components.
 */

/** Matches the props of `ScreenshotFrame`. Every screenshot shows test data and says so. */
export type Screenshot = {
  src: string;
  width: number;
  height: number;
  /** Describes what the screenshot demonstrates. */
  alt: string;
  /** Must start with "Test data" so nobody mistakes it for real customers. */
  caption: `Test data${string}`;
  sizes?: string;
};

export type OwnedArea = {
  title: string;
  /** 2 to 4 lines of first-person prose. */
  body: string;
};

/** Reserved for Story 2.3. Both columns are always visible. */
export type Decision = {
  title: string;
  chose: string;
  rejected: string;
  /** Where in the Simply Happy repo the decision can be traced. */
  source?: string;
};

/** Reserved for Stories 2.2, 2.4 and 2.5: a titled block of prose paragraphs. */
export type ProseSection = {
  id: string;
  heading: string;
  paragraphs: string[];
};

export type CaseStudy = {
  /** URL segment under /work. */
  slug: string;
  /** Short name used in metadata, e.g. "Simply Happy". */
  name: string;
  /** Page h1. */
  title: string;
  eyebrow: string;
  lede: string;
  /** ISO date (YYYY-MM-DD) of the last content change; feeds the sitemap. */
  updated: string;
  summary: {
    before: string;
    after: string;
  };
  stack: string[];
  liveSite: {
    label: string;
    href: string;
  };
  owned: OwnedArea[];
  screenshots: Screenshot[];
  // Reserved for later stories; the launch version renders none of these.
  payments?: ProseSection;
  decisions?: Decision[];
  testing?: ProseSection;
  assistant?: ProseSection;
};
