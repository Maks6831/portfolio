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
