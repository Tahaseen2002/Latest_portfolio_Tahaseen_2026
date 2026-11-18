// All portfolio content lives here. Edit this file to update the site.

export const profile = {
  name: "Shaik Tahaseen",
  role: "Full Stack Software Engineer",
  tagline: "I build AI-powered, cloud-native products — from idea to production.",
  location: "Ongole, India",
  email: "tahaseen292@gmail.com",
  phone: "+91 6305637129",
  linkedin: "https://www.linkedin.com/in/tahaseen-shaik/",
  github: "https://github.com/Tahaseen2002",
  resume: "/resume.pdf", // drop your PDF into /public/resume.pdf
  headshot: "/Tahaseen.webp", // compressed copy of Tahaseen.png
  ogImage: "/Tahaseen.png",
  // Hero paragraph under the headline
  intro:
    "3+ years building full-stack and AI products, at work and on my own: AI assessment platforms, release automation, conversational analytics, an ATS and developer tools.",
  // Numbers band under the hero (the last one is shown in the accent colour)
  stats: [
    { value: "3+", label: "Years building products" },
    { value: "21", label: "Public repositories" },
    { value: "6", label: "Live demos on Vercel" },
    { value: "8", label: "AI analyses in Pulsevo" },
  ],
};

export type Engagement = {
  name: string;
  status: string; // e.g. "Current", "Client site", "Completed"
  summary: string;
  points: string[];
};

export type Job = {
  role: string;
  company: string;
  period: string;
  intro: string;
  stack: string[];
  highlights: string[];
  engagements?: Engagement[]; // projects within one role, newest first
};

export const experience: Job[] = [
  {
    role: "Software Engineer (Full Stack & AI)",
    company: "J2W",
    period: "Dec 2025 – Present",
    intro:
      "Delivering AI-powered products and client projects, from internal platforms to on-site work with enterprise clients.",
    stack: ["TypeScript", "Python", "Groovy", "JFrog Artifactory", "SQL", "MongoDB", "React", "Next.js", "LLM APIs"],
    highlights: [],
    engagements: [
      {
        name: "Assessment AI Portal",
        status: "Current",
        summary:
          "An AI-first assessment platform for campus placement hiring. AI scores candidates, proctors them and verifies who they are, from test to final result.",
        points: [
          "AI evaluation engine: LLMs grade candidate answers against the question bank and produce scores with reasoning, replacing manual grading.",
          "AI proctoring: models monitor test sessions to flag cheating and suspicious behaviour in real time.",
          "AI identity verification: matches each candidate against their registered identity to prevent impersonation.",
          "Pluggable model layer: admins connect their own AI provider API keys, and evaluation, proctoring and identity checks run automatically through them.",
          "Built the platform around the AI: question bank management, grading with a human review stage, and automated candidate emails.",
        ],
      },
      {
        name: "GE HealthCare — Long-Term Storage (LTS) Automation",
        status: "Client site",
        summary:
          "Worked on-site at GE HealthCare to automate their Long-Term Storage process. This process archives every build artifact as an immutable record in JFrog Artifactory, so any microservice can be rebuilt from scratch years later.",
        points: [
          "Replaced a manual, error-prone process that took months of repeated promotions per service with an end-to-end automated pipeline that needs no engineer intervention until it reports success or failure.",
          "Developed three coordinated Groovy pipelines. An LTS orchestrator validates the input, creates LTS branches and starts a Branch Pipeline for each microservice in parallel batches. A Promotion pipeline handles artifact promotion.",
          "Automated dependency resolution: the pipeline reads missing artifacts from build errors, promotes them and rebuilds until the verification build succeeds.",
          "Replaced unstructured failure reporting with a single consolidated pass/fail report across every microservice.",
          "Owned the test strategy, the Groovy development and the final project handover to the client team.",
        ],
      },
      {
        name: "Talk2Data",
        status: "Completed",
        summary:
          "A conversational AI analytics platform: ask a question in plain English and get the SQL, a written summary and an interactive chart back in seconds.",
        points: [
          "Natural-language-to-SQL engine: LLM workflows with prompt engineering produce accurate, context-aware SQL, so non-technical users can query data without writing code.",
          "AI insights: the LLM summarizes query results in plain language and picks the right visualization for the data automatically.",
          "Cut manual analysis effort by 85% and sharply reduced query turnaround, which increased data usage across teams.",
          "Built the real-time chat, dashboard and chart-rendering interface with React and Next.js, working over both SQL and MongoDB data.",
          "Designed secure API key management and a scalable architecture for LLM workflows.",
        ],
      },
    ],
  },
  {
    role: "Software Engineer",
    company: "CodingLimits",
    period: "May 2024 – Jul 2025",
    intro:
      "Drove full-stack architecture and feature delivery for Talsy, a SaaS platform for end-to-end recruitment and HR operations, working directly with the founders.",
    stack: ["Next.js", "React", "NestJS", "GCP", "TypeScript"],
    highlights: [
      "Led end-to-end development of core recruitment and HR modules used by 50+ enterprise clients.",
      "Built and optimized 150+ REST APIs with <50ms response times under high concurrency.",
      "Architected a multi-tenant RBAC system with JWT-based authentication.",
      "Delivered AI-powered resume parsing and candidate ranking to automate screening.",
      "Ran infrastructure on GCP and Vercel with CI/CD pipelines and 99.9% uptime.",
    ],
  },
  {
    role: "Software Engineer (Former Intern)",
    company: "FMS Solutions",
    period: "Jun 2023 – Apr 2024",
    intro:
      "Grew from web development intern to software engineer on enterprise payroll and labor-intelligence platforms.",
    stack: ["React", "Next.js", "Angular", "Bootstrap", "Git"],
    highlights: [
      "Built and enhanced enterprise web apps in React, Next.js and Angular within Agile teams.",
      "Reduced load times through efficient data fetching and HTTP interceptors.",
      "Created dynamic CRUD modules for revenue, labor and sales analytics dashboards.",
      "Migrated legacy internal portals to Next.js and contributed React Native features.",
      "Earned a full-time offer for code quality and proactive UI improvements.",
    ],
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Frontend", items: ["React", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3", "Bootstrap"] },
  { group: "Backend", items: ["NestJS", "Node.js", "Python", "REST APIs"] },
  { group: "AI / LLM", items: ["LLM Integration", "Prompt Engineering", "AI Agents", "OpenAI APIs", "Open-source LLMs"] },
  { group: "Data", items: ["MongoDB", "Mongoose", "SQL", "Data Pipelines"] },
  { group: "Cloud & DevOps", items: ["GCP", "Vercel", "GitHub Actions", "Groovy Pipelines", "JFrog Artifactory", "Docker"] },
  { group: "Practices", items: ["JWT Auth", "RBAC", "System Design", "Agile / Scrum"] },
];

export const education = {
  school: "Rajiv Gandhi University of Knowledge and Technologies (IIIT), Nuzvid",
  degree: "B.Tech in Computer Science & Engineering",
  period: "2019 – 2023",
  gpa: "8.5",
};
