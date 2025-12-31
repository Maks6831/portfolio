export const navItems = [
    { name: "About", link: "#about" },
    { name: "Projects", link: "#projects" },
    { name: "Contact", link: "#contact" },
  ];

  export const gridItems = [
    {
      id: 1,
      title: "I prioritize client collaboration, fostering open communication ",
      description: "",
      className: "lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[60vh]",
      imgClassName: "w-full h-full",
      titleClassName: "justify-end",
      img: "/b1.svg",
      spareImg: "",
    },
    {
      id: 2,
      title: "I'm very flexible with time zone communications",
      description: "",
      className: "lg:col-span-2 md:col-span-3 md:row-span-2",
      imgClassName: "",
      titleClassName: "justify-start",
      img: "",
      spareImg: "",
    },
    {
      id: 3,
      title: "My tech stack",
      description: "I constantly try to improve",
      className: "lg:col-span-2 md:col-span-3 md:row-span-2",
      imgClassName: "",
      titleClassName: "justify-center",
      img: "",
      spareImg: "",
    },
    {
      id: 4,
      title: "Tech enthusiast with a passion for development.",
      description: "",
      className: "lg:col-span-2 md:col-span-3 md:row-span-1",
      imgClassName: "",
      titleClassName: "justify-start",
      img: "/grid.svg",
      spareImg: "/b4.svg",
    },
  
    {
      id: 5,
      title: "Currently building a Django Nextjs application",
      description: "The Inside Scoop",
      className: "md:col-span-3 md:row-span-2",
      imgClassName: "absolute right-0 bottom-0 md:w-96 w-60",
      titleClassName: "justify-center md:justify-start lg:justify-center",
      img: "/b5.svg",
      spareImg: "/grid.svg",
    },
    {
      id: 6,
      title: "Do you want to start a project together?",
      description: "",
      className: "lg:col-span-2 md:col-span-3 md:row-span-1",
      imgClassName: "",
      titleClassName: "justify-center md:max-w-full max-w-60 text-center",
      img: "",
      spareImg: "",
    },
  ];

  export const projects = [
    {
      id: 1,
      title: "Panther Print - Custom Cases",
      des: "Create custom high-quality phone cases in seconds",
      img: "/PantherPrint-screenshot.png",
      iconLists: ["/re.svg", "/tail.svg", "/ts.svg", "/next.svg", '/pri.png'],
      link: "https://pantherprint.netlify.app/",
    },
    {
      id: 2,
      title: "CoinFlow - Crypto Asset App",
      des: " real-time price tracking and portfolio management for all your favorite cryptocurrencies",
      img: "/coinflow-screenshot.png",
      iconLists: ["/re.svg", "/tail.svg", "/ts.svg", "/next.svg", '/red.png'],
      link: "https://muhammadalikhan.co.uk/",
    }
  ];

  export const workExperience = [
    {
      id: 1,
      title: "Full-stack Developer",
      company: "Simply Happy",
      type: "Contract",
      date: "Aug 2025 - Present · 5 mos",
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
      date: "Nov 2024 - Sep 2025 · 11 mos",
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
      company: "Previous Company",
      type: "Full-time",
      date: "2023 - 2024",
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
      company: "Previous Company",
      type: "Full-time",
      date: "2022 - 2023",
      location: "Remote",
      responsibilities: [
        "Contributed to a purpose-built tool for modern product development using MERN stack"
      ],
      skills: ["MongoDB", "Express", "React", "Node.js"],
      thumbnail: "/exp4.svg",
    },
 
  ];

  {/*   {
      id: 3,
      title: "Freelance App Dev Project",
      desc: "Led the dev of a mobile app for a client, from initial concept to deployment on app stores.",
      className: "md:col-span-2", // change to md:col-span-2
      thumbnail: "/exp3.svg",
    },
    {
      id: 4,
      title: "Lead Frontend Developer",
      desc: "Developed and maintained user-facing features using modern frontend technologies.",
      className: "md:col-span-2",
      thumbnail: "/exp4.svg",
    },*/}


    export const socialMedia = [
      {
        id: 1,
        img: "/git.svg",
        url:"https://github.com/Maks6831"
      },
      {
        id: 3,
        img: "/link.svg",
        url: 'https://www.linkedin.com/in/muhammad-khan-464b80203/'
      },
    ];