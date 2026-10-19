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
  liveSite: simplyHappyFeature.link,
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
