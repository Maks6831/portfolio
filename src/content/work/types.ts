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

/** Rendered by Story 2.3 as a DecisionCard. Both columns are always visible. */
export type Decision = {
  title: string;
  chose: string;
  rejected: string;
  /** A plain phrase naming the part of the codebase the decision lives in, never a path or a link. */
  source?: string;
};

/** Reserved for Stories 2.4 and 2.5: a titled block of prose paragraphs. */
export type ProseSection = {
  id: string;
  heading: string;
  paragraphs: string[];
};

/** One state in the StateDiagram. `state` is the pill label, `meaning` the line beneath it. */
export type PaymentState = {
  state: string;
  meaning: string;
};

/**
 * Story 2.2: "The booking and payments flow". Plain prose, a server-rendered state diagram and the
 * reliability panels. Keys `state:` and `text:` are unique to this section in a content module: the
 * build gate counts them (`body:` is owned, `chose:` is decisions).
 */
export type PaymentsSection = {
  /** Four short first-person paragraphs: Checkout, the availability re-check, deposit or full, the balance. */
  flow: string[];
  diagram: {
    /** In lifecycle order; the first is the pending state, the last the confirmed one. */
    states: PaymentState[];
    /** One label per gap between states, so exactly `states.length - 1` entries. */
    transitions: string[];
    /** Names the figure and states the path the diagram leaves out (full payment). */
    caption: string;
  };
  /** Rendered as CaseStudyPanel tiles under the "Reliability decisions" eyebrow. */
  reliability: { title: string; text: string }[];
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
  /** One or two sentences under the Screenshots heading, e.g. where the captures come from. */
  screenshotsNote?: string;
  /** Story 2.3: one card per decision, rendered after the payments flow. */
  decisions?: Decision[];
  /** Story 2.2: rendered between What I owned and Decisions. */
  payments?: PaymentsSection;
  // Reserved for later stories; the launch version renders none of these.
  testing?: ProseSection;
  assistant?: ProseSection;
};
