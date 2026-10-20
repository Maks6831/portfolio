import { hero, simplyHappyFeature } from "@/content/site";
import type { CaseStudy } from "./types";

// Copy comes from site.ts (feature, proof tile, experience) and the product brief,
// rewritten in first person. No client prices, domains beyond the public site, names or data.
export const simplyHappy = {
  slug: "simply-happy",
  name: "Simply Happy",
  title: simplyHappyFeature.heading,
  eyebrow: "Case study",
  lede: hero.lede,
  updated: "2026-10-19",
  summary: {
    before: simplyHappyFeature.before,
    after: simplyHappyFeature.after,
  },
  stack: simplyHappyFeature.chips,
  // The only link to the client's site: the home page links here instead.
  liveSite: { label: "Visit simplyhappy.pt", href: "https://simplyhappy.pt" },
  // Mirrors proofTiles[0] on the home page: requirements, architecture, payments, admin, a hired designer, stakeholder contact.
  owned: [
    {
      title: "Requirements",
      body: "I worked with the client from the first consultation, gathered the requirements and turned the business needs into a technical plan I could build against.",
    },
    {
      title: "Architecture",
      body: "I designed and built the platform in SvelteKit, TypeScript and tRPC inside a pnpm monorepo, with PostgreSQL through Drizzle ORM, Supabase Auth for sign-in, AWS S3 for file storage and Resend for email notifications. I set the technical standards and development workflow.",
    },
    {
      title: "Booking and payments",
      body: "I built the booking system with real-time availability and the Stripe integration for deposit and final payments, along with service scheduling and event management.",
    },
    {
      title: "Admin",
      body: "I built the admin back office for bookings, user approvals, pricing and analytics, with role-based access control. It also carries a read-only AI help panel limited to seven fixed lookups.",
    },
    {
      title: "Team",
      body: "I hired a designer and coordinated the Figma-to-code work across the project. I keep direct contact with the client's marketing team as features such as the newsletter ship.",
    },
    {
      title: "Tests",
      body: "I set up Playwright end-to-end tests covering the booking flows, authentication and the admin, so the product is tested like a team product.",
    },
  ],
  // Story 2.2. Facts from epic-2-facts-decisions.md section B (B.7 checkout and the deposit rule, B.8 idempotency
  // and the sweep, B.9 webhook plus success page). Honesty rules: the balance is charged by "a daily job", never a
  // time; "within 30 days of arrival" is the verified threshold; stays are never called webhook-only, because the
  // success page runs the same idempotent confirm; no prices, names, domains or paths.
  payments: {
    flow: [
      "I take payment for a stay through Stripe Checkout. Once a guest has chosen dates and a room, I create a Checkout session on the server and send the guest to Stripe to pay. I keep the booking's payment pending until Stripe reports that the session was paid.",
      "Right before that session is created, I re-validate availability on the server. The availability a guest saw while browsing is only a hint; the check that counts runs at the moment of checkout, so a room taken while the guest was deciding is caught before any payment is taken.",
      "I decide how much to take now from the arrival date. I take full payment when arrival is within 30 days, when the guest chooses to pay in full up front, or when the stay is booked with an event attached. Further out, I take a deposit and create a Stripe invoice for the balance, due 30 days before arrival.",
      "A daily job I wrote collects the balance. It picks up the invoices whose charge date has passed and charges them, so I never wait on the guest coming back to the site for the final payment.",
    ],
    diagram: {
      states: [
        { state: "Pending", meaning: "The Checkout session is open and nothing is confirmed yet." },
        { state: "Deposit confirmed", meaning: "Stripe's webhook has confirmed the deposit; arrival is more than 30 days away." },
        { state: "Confirmed", meaning: "A daily job has charged the balance and the stay is fully paid." },
      ],
      transitions: ["Stripe's webhook confirms the deposit", "A daily job charges the balance"],
      caption:
        "The payment states of a stay booked more than 30 days before arrival. Within 30 days of arrival the session takes full payment and the webhook moves the payment straight from Pending to Confirmed. Failed and refunded states are left out.",
    },
    reliability: [
      {
        title: "Idempotent webhook",
        text: "Stripe can deliver the same event more than once, so the confirm step is safe to repeat: it reads the payment's status first and does nothing when it is already confirmed or deposit-confirmed. The success page a guest lands on runs that same confirm as a second path, so a stay is confirmed whichever of the two arrives first.",
      },
      {
        title: "Recovery sweep",
        text: "A webhook can also fail to arrive. For stays, the success page runs the same idempotent confirm, so the guest's return completes it. For bookings tied to an event, a daily job sweeps the payments still pending, checks with Stripe whether each session was paid, and confirms the ones that were.",
      },
    ],
  },
  // Story 2.3. Wording from epic-2-owner-inputs.md section 4 and the addendum corrections, rewritten in
  // first person. `source` names the part of the codebase in plain words: no paths, no links to the private repo.
  // Honesty rules: the webhook-only claim is about paid offerings, never stays; no per-admin daily limit; no cron time.
  decisions: [
    {
      title: "Admin AI assistant: how it reads data",
      chose:
        "Seven fixed read-only lookups. Each one checks that the caller is an admin before it reads anything, validates its input and selects an explicit list of columns, so the model only ever sees the fields I chose for it.",
      rejected:
        "Read-only SQL. A wrong join looks right in a chat answer, and a free query could reach tokens and allergy data. A fixed set of lookups is testable instead: one test walks every lookup and asserts it never touches a forbidden table or returns a forbidden field.",
      source: "the shared backend's assistant module and its lookup tests",
    },
    {
      title: "Admin AI assistant: where the lookups come from",
      chose:
        "Allow-listed columns, pages of twenty rows and guest-written text quoted rather than trusted, in lookups I wrote for the assistant alone.",
      rejected:
        "Reusing the admin screens' tRPC endpoints. They return whatever a screen needs, such as every booking with its guests' personal details, which is far more than any question requires and far more than I wanted a model to see.",
      source: "the assistant lookups module and its column allow-list",
    },
    {
      title: "Admin AI assistant: what it remembers",
      chose:
        "Conversations live in the browser tab only, in session storage. The server streams the answer and stores nothing, and a test asserts that neither the question nor the answer is logged.",
      rejected:
        "Storing chats. Saved conversations about guests become personal data the business has to search, export and erase on request, and an assistant that remembers nothing has nothing to leak.",
      source: "the admin assistant panel component and its stories, plus the request handler's tests",
    },
    {
      title: "One offerings model instead of the services engine",
      chose:
        "A single offerings model in PostgreSQL, with staff, shifts and supplies tied to offerings and the booking rules written as pure functions I can unit test.",
      rejected:
        "Keeping the services engine. Its data model had drifted: staff assignment lived in two tables that disagreed, stock was static and nothing consumed it, analytics summed list prices, and four charts never rendered. Two migrations dropped it and a replay test proves the old tables are gone.",
      source: "the two drop migrations and the services-engine-dropped test",
    },
    {
      title: "Paid offerings: confirmed by the webhook, not the redirect",
      chose:
        "For offerings paid on the site, the reservation is written only when Stripe's webhook arrives, through a locked SQL function keyed on a unique payment id, so a duplicate delivery can never book twice. The success page only reads the result. Stays take a different route: an idempotent confirm step reachable from both the webhook and the success page.",
      rejected:
        "Trusting the client redirect. The old engine wrote bookings only when the browser reached the success page, so confirmation depended on the customer's tab staying open.",
      source: "the offerings webhook handler and the reserve-places SQL function",
    },
  ],
  // Story 2.4. Counts from epic-2-owner-inputs.md section 2 (as of 18 Oct 2026); flow, hooks and CI facts from
  // epic-2-facts-testing.md sections 3 to 6. Honesty rules: every count is approximate through the single as-of
  // label; CI is only said to run lint, type checks, the stories audit, a production build and the Playwright
  // integration tests, on pull requests; the Storybook test runner is local only; visual snapshots, pull-request
  // and source-file counts are left out; no tool versions, repository names, branch patterns, paths or file names.
  testing: {
    countsAsOf: "2026-10-18",
    counts: [
      { label: "Playwright spec files", value: "94" },
      {
        label: "Playwright tests",
        value: "about 394",
        detail: "352 in the default run; the rest are the opt-in UI tests and the payment tests",
      },
      {
        label: "Unit test files",
        value: "158",
        detail: "about 2,000 cases across the web app and the shared package",
      },
      {
        label: "Storybook story files",
        value: "187",
        detail: "covering 172 components; 177 of the files have play functions",
      },
    ],
    paragraphs: [
      "Every change starts as a Linear issue. I branch from the issue, open a pull request into the epic branch, and the epic branch goes into develop as one pull request once its stories are in. Develop reaches main only through a release pull request, hotfixes branch from main, and the issue closes when its pull request merges.",
      "Git hooks, installed with the dependencies, enforce that flow. The pre-commit hook rejects a commit on main or develop, and the pre-push hook rejects a push to either and refuses a branch whose name does not carry an issue key, hotfix branches aside, so work can only land through a pull request. The hooks run no checks of their own; that is CI's job.",
      "CI runs only on pull requests into develop and main: lint, type checks, the stories-coverage audit that fails when a component has no story, a production build and the Playwright integration tests on Chromium. The Storybook test runner, the opt-in UI tests and the shared package's unit suite run locally only, so a green pull request means the integration suite passed, not that every suite did.",
    ],
  },
  // Story 2.5. Facts from epic-2-facts-decisions.md section A (A.1 the seven lookups, A.2 no SQL, A.3 browser-tab
  // chats, A.4 the excluded fields and the test, A.5 the in-code bounds, the monthly cap and the off switch) and
  // section D (purpose-built lookups over screen endpoints). Honesty rules: no vendor, model or product name, no
  // amount or currency, no "daily limit" (none exists), no paths, file names or links. The lookup count, the
  // browser-tab-only chats and the "wrong join looks right" reason match the three assistant decision cards above.
  assistant: {
    intro:
      "The admin back office carries an AI assistant: a read-only help panel where an admin asks a plain question about bookings, arrivals, unpaid items or guests and gets an answer drawn from the live data. It is launched and in use by the client's admins from the back office. I designed it so that it cannot write, cannot see the sensitive fields, cannot remember, cannot run up an unbounded bill and can be switched off. The safeguards below are how.",
    safeguards: [
      {
        title: "Read-only scope",
        text: "The model can call seven fixed read-only lookups and nothing else: it receives only those seven tool definitions, and any other name is rejected. Each lookup checks that the caller is an admin before it reads anything, validates its input and selects an explicit list of columns, so the model only ever sees the fields I chose for it. Guest-written text is quoted to the model rather than trusted.",
      },
      {
        title: "No stored chats",
        text: "Conversations live in the browser tab only, in session storage. The server streams the answer and stores nothing, and a test asserts that neither the question nor the answer is logged. Closing the tab ends the conversation, so there is no archive of questions about guests to search, export or erase.",
      },
      {
        title: "Fields that are never sent",
        text: "Health data (allergies), date of birth, gender and tax number are among the fields never selected and never returned by any lookup, together with payment ids and guests' free-text answers. One test runs every lookup and asserts it never touches a forbidden table or returns a forbidden field, and the system prompt tells the model these fields are not available to it. The meals lookup returns only a count of bookings with dietary restrictions.",
      },
      {
        title: "Spend bounds",
        text: "Spend is bounded in code: five lookups per question, capped output for each answer, a bounded history sent with each turn and a cap on the length of a message. On top of that, a monthly spend cap set in the provider's configuration stops the assistant when it is reached, and the admin sees a plain message that the monthly limit has been hit.",
      },
      {
        title: "Admin off switch",
        text: "An admin can turn the assistant off from the back office, and off is the default. The setting is read before any model call, so a fresh deployment starts with the assistant disabled until an admin turns it on, and turning it off takes effect on the next question.",
      },
    ],
    closing:
      "I chose fixed lookups over read-only SQL because a wrong join looks right in a chat answer, and a free query could reach tokens and allergy data. A query that quietly pairs one guest's details with another guest's booking produces a confident, plausible reply, and an admin reading it has little way to spot the mistake. Seven lookups with fixed field lists are less flexible, but each one is testable and admin-checked, and the whole surface the model can reach is small enough to read in one sitting.",
  },
  // Develop-preview captures against the repo's seed data (epic-2-owner-inputs.md, section 1), in the
  // manifest's order. Prices and names are seed values; every caption says "Test data".
  screenshotsNote:
    "Captured from the develop branch running against seed data, so the names and prices are test values. Select a screenshot to see it larger.",
  screenshots: [
    {
      src: "/work/simply-happy/booking-rooms.png",
      width: 2880,
      height: 1800,
      alt: "The booking flow after dates are chosen: room categories with photo, capacity, availability and a Select button",
      caption: "Test data. Room selection step of the booking flow",
    },
    {
      src: "/work/simply-happy/booking-checkout.png",
      width: 2880,
      height: 1800,
      alt: "The selected room with the summary box showing nights, discount code field and total before continuing to payment",
      caption: "Test data. Checkout summary before Stripe",
    },
    {
      src: "/work/simply-happy/admin-calendar-assistant.png",
      width: 2880,
      height: 1800,
      alt: "The admin booking calendar by room with the read-only Ask panel open and its note that nothing is saved",
      caption: "Test data. Admin booking calendar with the assistant panel open",
    },
    {
      src: "/work/simply-happy/admin-events.png",
      width: 2880,
      height: 1800,
      alt: "Admin events list with status, places and attendee actions per event",
      caption: "Test data. Admin events management, redesigned list",
    },
    {
      src: "/work/simply-happy/admin-supplies.png",
      width: 2880,
      height: 1800,
      alt: "Admin supplies list with stock on hand, low-stock flags, reorder points and record-delivery actions",
      caption: "Test data. Supplies: stock on hand, reorder points and deliveries",
    },
    {
      src: "/work/simply-happy/admin-reservations.png",
      width: 2880,
      height: 1800,
      alt: "Admin reservations page with the booking rules panel: auto-confirm toggle and guest cancellation window",
      caption: "Test data. Rules for bookings paid on the site: auto-confirm and the cancellation window",
    },
    {
      // Portrait phone capture; the page caps its column at max-w-sm (384px) from md up.
      src: "/work/simply-happy/admin-events-mobile.png",
      width: 780,
      height: 1688,
      alt: "The admin events list at phone width",
      caption: "Test data. Admin events on a phone",
      sizes: "(min-width: 768px) 384px, 100vw",
    },
  ],
} satisfies CaseStudy;
