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
  updated: "2026-10-18",
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
  // Story 2.6 adds develop-preview screenshots here; each needs alt text and a "Test data" caption.
  screenshots: [],
} satisfies CaseStudy;
