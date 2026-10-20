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

/** One count tile in the Testing section: a label, the count as shown, and an optional line beneath it. */
export type TestingCount = {
  label: string;
  /** The count as rendered, e.g. "94" or "about 394"; the single as-of label marks every value approximate. */
  value: string;
  detail?: string;
};

/**
 * Story 2.4: "Testing and delivery". A row of count tiles under one "approx., as of" label, then three short
 * first-person paragraphs: the delivery flow, the git hooks that enforce it, and what CI runs versus what stays
 * local. The key `value:` is unique to this section in a content module: the build gate counts it inside the
 * `testing: {` block the way `state:` is counted for payments.
 */
export type TestingSection = {
  /** ISO date (YYYY-MM-DD) the counts were taken; rendered as "18 Oct 2026" by `formatDay`. */
  countsAsOf: string;
  counts: TestingCount[];
  paragraphs: string[];
};

/**
 * Story 2.5: "Admin AI assistant (safety design)". One intro paragraph, the safeguard panels (rendered as
 * CaseStudyPanel tiles, one h3 each) and one closing paragraph. The build gate counts `text:` inside the
 * `assistant: {` block alone, the way reliability panels are counted inside `payments: {`.
 */
export type AssistantSection = {
  /** What the assistant is, where it runs and that it is launched. */
  intro: string;
  /** One panel per safeguard: read-only scope, no stored chats, excluded fields, spend bounds, the off switch. */
  safeguards: { title: string; text: string }[];
  /** Why fixed lookups beat SQL; agrees with the decision card on the reason. */
  closing: string;
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
  /** Story 2.4: rendered between Decisions and Screenshots. */
  testing?: TestingSection;
  /** Story 2.5: rendered between Testing and Screenshots. */
  assistant?: AssistantSection;
};
