export const email = "ma.khan6971@gmail.com";

export const hero = {
  eyebrow: "Muhammad Ali Khan · Full-stack engineer · London",
  headline: "I turn a client's operational mess into a product that ships safely.",
  lede: "I took Simply Happy from email bookings and a WordPress site to a live booking and payments platform, and I own what runs behind it.",
  // Interim target until the case study route ships (Story 2.9).
  primaryCta: { label: "See Simply Happy live", href: "https://simplyhappy.pt" },
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
    src: "/simplyhappy-screenshot.png",
    width: 2880,
    height: 1556,
    alt: "The Simply Happy public website home page, showing the retreat listings.",
    caption: "The public site, simplyhappy.pt",
  },
  // Interim target until the case study route ships (Story 2.9).
  link: { label: "Visit simplyhappy.pt", href: "https://simplyhappy.pt" },
};

export const navItems = [
    { name: "About", link: "#about" },
    { name: "Work", link: "#work" },
    { name: "Contact", link: "#contact" },
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
    chip: "Live",
  },
];

export const supportingWork = {
  heading: "Also shipped",
  items: [
    {
      id: "assistant",
      featured: true,
      title: "Admin AI assistant",
      body: "A read-only help panel for the back office. Seven fixed lookups beat free-form SQL because wrong joins look right. No chats are stored.",
      // Not a link until the write-up exists (Epic 2).
      href: undefined as string | undefined,
    },
    {
      id: "coinflow",
      title: "CoinFlow",
      body: "Real-time crypto tracking in Next.js.",
      href: "https://coinflow.netlify.app" as string | undefined,
    },
  ],
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
      thumbnail: "/exp1.svg",
    },
    {
      id: 2,
      title: "Frontend Engineer",
      company: "Royal College of Nursing",
      type: "Full-time",
      start: "2024-11",
      end: "2025-09",
      location: "London Area, United Kingdom · Remote",
      responsibilities: [
        "Developed and maintained the Clinical Topics feature using Next.js and TypeScript, integrating with Sitecore CMS for content delivery",
        "Debugged and resolved defects across the frontend codebase, focusing on stability and reliability of existing functionality",
        "Built Vue.js components connected to .NET/C# backend services as part of a content-driven platform",
        "Implemented design tokens from Figma specifications and documented component library using Storybook"
      ],
      skills: ["Next.js", "TypeScript", "Vue.js", "Sitecore CMS"],
      thumbnail: "/exp2.svg",
    },
    {
      id: 3,
      title: "Frontend Engineer",
      company: "Faro",
      type: "Full-time",
      start: "2023",
      end: "2024",
      location: "Remote",
      responsibilities: [
        "Assisted in the development of a Chrome Bookmark Manager, built using Svelte"
      ],
      skills: ["Svelte"],
      thumbnail: "/exp3.svg",
    },
    {
      id: 4,
      title: "Frontend Engineer",
      company: "Developer Pro",
      type: "Full-time",
      start: "2022",
      end: "2023",
      location: "Remote",
      responsibilities: [
        "Contributed to a purpose-built tool for modern product development using MERN stack"
      ],
      skills: ["MongoDB", "Express", "React", "Node.js"],
      thumbnail: "/exp4.svg",
    },
 
  ];




export const contact = {
  heading: "Hiring for a full-stack role?",
  line: "I'm available now.",
  email,
  linkedin: "https://www.linkedin.com/in/muhammad-khan-464b80203/",
  github: "https://github.com/Maks6831",
  cv: { href: "/Muhammad-Ali-Khan-CV.pdf", label: "Download CV (PDF)" },
  name: "Muhammad Ali Khan",
};
