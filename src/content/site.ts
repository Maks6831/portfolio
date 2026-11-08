const siteName = "Muhammad Ali Khan";
const siteRole = "Full-stack engineer";

export const email = "ma.khan6971@gmail.com";

// The home page links to the work, not the client's site; the live-site link lives only in the case study.
const caseStudyHref = "/work/simply-happy";

export const hero = {
  eyebrow: "Muhammad Ali Khan · Full-stack engineer · London",
  headline: "I turn a client's operational mess into a product that ships safely.",
  lede: "I took Simply Happy from email bookings and a WordPress site to a live booking and payments platform, and I own what runs behind it.",
  // The display word: the project's name in two lines (aria-hidden decoration).
  word: ["Simply", "Happy"],
  primaryCta: { label: "Read the Simply Happy case study", href: caseStudyHref },
  secondaryCta: { label: "Get in touch", href: "#contact" },
};

export const simplyHappyFeature = {
  eyebrow: "Headline work",
  heading: "Simply Happy: retreat booking and payments",
  before: "Bookings by email. A WordPress brochure site.",
  after:
    "A live booking platform with deposit and final payments, and an admin back office used daily by three admins.",
  chips: ["SvelteKit", "TypeScript", "tRPC", "PostgreSQL", "Stripe", "Playwright"],
  image: {
    src: "/work/simply-happy/booking-rooms.png",
    width: 2880,
    height: 1800,
    alt: "The booking flow after dates are chosen: room categories with photo, capacity, availability and a Select button",
    caption: "Test data. Room selection step of the booking flow, develop preview",
  },
  link: { label: "Read the case study", href: caseStudyHref },
};

export const navItems = [
  { name: "Work", link: "#work" },
  { name: "Profile", link: "#profile" },
  { name: "Connect", link: "#contact" },
];

// Sheet tabs (EXPERIENCE.md HUD label table): "0n / 03", name, one detail, and a stack-mode hint.
export const sheetTabs = [
  { name: "Headline work", detail: "Simply Happy · Aug 2025 –", hint: "Scroll ↓ the sheets stack" },
  { name: "Proof", detail: "Four things I can show", hint: "Hover or Tab onto a tile" },
  { name: "Also shipped", detail: "Admin AI assistant · CoinFlow", hint: "Last sheet · Profile and Connect follow" },
];

export const proofSection = {
  eyebrow: "Proof",
  heading: "What I can show, not just say",
};

export const proofTiles = [
  {
    id: "owned",
    title: "Owned it end to end",
    body: "Requirements, architecture, payments, admin, a hired designer, and ongoing stakeholder contact.",
    chip: "Led",
  },
  {
    id: "tested",
    title: "Tested like a team product",
    body: "Playwright end-to-end tests over booking, auth and admin, plus Storybook stories for the components.",
    chip: "Tested",
  },
  {
    id: "safe",
    title: "Safe by design",
    body: "An admin AI assistant limited to seven fixed, read-only lookups. Health data is never sent, enforced by a test.",
    chip: "Enforced",
    link: { href: `${caseStudyHref}#assistant`, label: "Read the safety design" },
  },
  {
    id: "ai",
    title: "Built with Claude Code, checked with tests",
    body: "I build with Claude Code daily. Its output goes through the same Playwright and Vitest runs as mine, and I can explain any line it writes.",
    chip: "Daily",
  },
];

export const supportingWork = {
  eyebrow: "Supporting work",
  heading: "Also shipped",
  sub: "The assistant is part of Simply Happy and links into the case study. CoinFlow is a small secondary project and links out.",
  items: [
    {
      id: "assistant",
      featured: true,
      kicker: ["Simply Happy", "back office"],
      linkLabel: "Read the safety design",
      image: {
        src: "/work/simply-happy/admin-calendar-assistant.png",
        width: 2880,
        height: 1800,
        alt: "The admin booking calendar by room with the read-only Ask panel open and its note that nothing is saved",
        caption: "Test data. Admin booking calendar with the assistant panel open",
      },
      title: "Admin AI assistant",
      body: "A read-only help panel for the back office. Seven fixed lookups beat free-form SQL because wrong joins look right. No chats are stored.",
      href: `${caseStudyHref}#assistant` as string | undefined,
    },
    {
      id: "coinflow",
      kicker: ["Side project", "external"],
      linkLabel: "coinflow.netlify.app",
      title: "CoinFlow",
      body: "Real-time crypto tracking in Next.js.",
      href: "https://coinflow.netlify.app" as string | undefined,
    },
  ],
};

export const experienceSection = {
  eyebrow: "Profile",
  heading: "Experience",
  sub: "Three roles. Simply Happy is expanded in the case study; the other two are the facts, in the order the CV gives them.",
};

export const workExperience = [
    {
      id: 1,
      title: "Full-stack Developer",
      company: "Simply Happy",
      type: "Contract",
      start: "2025-08",
      end: "present",
      location: "Portugal · Remote",
      responsibilities: [
        "Led end-to-end product development from stakeholder consultation through to implementation, gathering requirements and translating business needs into technical solutions",
        "Architected and built a full-stack retreat booking platform using SvelteKit, TypeScript, and tRPC in a pnpm monorepo, establishing technical standards and development workflows",
        "Assembled and managed development team, hiring a designer and coordinating Figma-to-code implementation across the project",
        "Developed core platform features including booking system with real-time availability, Stripe payment integration (deposit/final payment flows), service scheduling, and event management",
        "Built admin dashboard for managing bookings, user approvals, pricing, and analytics, with role-based access control",
        "Implemented authentication with Supabase Auth, PostgreSQL database with Drizzle ORM, AWS S3 integration, and email notifications via Resend",
        "Established testing infrastructure with Playwright for end-to-end integration tests, covering booking flows, authentication, and admin functionality",
        "Ongoing feature ownership including newsletter functionality, maintaining direct stakeholder marketing team communication throughout development lifecycle"
      ],
      skills: ["SvelteKit", "TypeScript", "tRPC", "PostgreSQL"],
    },
    {
      id: 2,
      title: "Staff Front End Engineer",
      company: "Royal College of Nursing",
      type: "Full-time",
      start: "2024-11",
      end: "2025-09",
      location: "London, UK",
      responsibilities: [
        "Developed and maintained the Clinical Topics feature using Next.js and TypeScript, integrating with Sitecore CMS for content delivery",
        "Debugged and resolved defects across the frontend codebase, focusing on stability and reliability of existing functionality",
        "Built Vue.js components connected to .NET/C# backend services as part of a content-driven platform",
        "Implemented design tokens from Figma specifications and documented component library using Storybook"
      ],
      skills: ["Next.js", "TypeScript", "Vue.js", "Sitecore CMS"],
    },
    {
      id: 3,
      title: "Front End Developer",
      company: "Developer Pro",
      type: "Mentorship",
      start: "2023-12",
      end: "2024-05",
      location: "Remote",
      responsibilities: [
        "Learned JavaScript fundamentals, TypeScript, React, Redux and Next.js through the mentorship",
        "Built charts, graphs and tables for a cryptocurrency data aggregator using TypeScript, Chart.js and Tailwind CSS",
        "Turned design docs and mock-ups into maintainable React and Redux web applications with a consistent UI"
      ],
      skills: ["React", "Redux", "Next.js", "TypeScript"],
    },
 
  ];




export const contact = {
  eyebrow: "Connect",
  heading: "Hiring for a full-stack role?",
  line: "Available from December 2026.",
  email,
  linkedin: "https://www.linkedin.com/in/muhammad-khan-464b80203/",
  github: "https://github.com/Maks6831",
  cv: { href: "/Muhammad-Ali-Khan-CV.pdf", label: "Download CV (PDF)" },
  name: siteName,
};

export const siteMeta = {
  origin: "https://muhammadalikhan.co.uk",
  // ISO date of the last home-page content change; feeds the sitemap.
  updated: "2026-11-07",
  name: siteName,
  role: siteRole,
  title: `${siteName} · ${siteRole}`,
  description:
    "Full-stack engineer in London. I took Simply Happy from email bookings and a WordPress site to a live booking and payments platform.",
  imageLine: "From email bookings to a live booking and payments platform.",
  imageAlt: `${siteName}, ${siteRole.toLowerCase()}. From email bookings to a live booking and payments platform.`,
};

// Person JSON-LD source (rendered once in the root layout). URLs come from `contact` and `siteMeta`.
export const person = {
  name: siteName,
  jobTitle: siteRole,
  url: siteMeta.origin,
  sameAs: [contact.linkedin, contact.github],
  address: { locality: "London", country: "GB" },
};
