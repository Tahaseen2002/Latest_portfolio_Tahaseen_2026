// "On the job": one case file per company. What I did there, for whom,
// in which industry, and what it achieved. Every fact here comes from
// profile.ts (experience); edit both together.

export type FileProject = {
  name: string;
  client: string; // who it was for
  status: "Current" | "In use" | "Client site" | "Completed" | "Shipped";
  link?: { label: string; href: string };
  big: string; // short headline on the card front
  from: string; // card gradient
  to: string;
  summary: string;
  points: string[];
};

export type CaseFile = {
  id: string;
  company: string;
  role: string;
  period: string;
  city: string;
  color: string; // lanyard and badge colour (matches the journey pin)
  logo?: string;
  badge: { value: string; label: string }; // the one number on the ID badge
  photo: { src: string; caption: string; pos?: string };
  industries: string[];
  clients: string[];
  brief: string;
  wins: { value: string; label: string }[];
  projects: FileProject[];
  stack: string[];
};

export const caseFiles: CaseFile[] = [
  {
    id: "j2w",
    company: "J2W",
    role: "Software Engineer (Full Stack & AI)",
    period: "Dec 2025 – Present",
    city: "Bengaluru",
    color: "#1f6b4a",
    badge: { value: "2", label: "AI hiring products live" },
    photo: { src: "/photos/ge-id.webp", caption: "On-site at GE HealthCare", pos: "50% 40%" },
    industries: ["HR tech", "Healthcare", "Data & analytics"],
    clients: ["J2W recruiters (in-house)", "VIT campus hiring", "GE HealthCare (on-site)"],
    brief: "J2W is a large recruiting firm. I build the AI products its hiring runs on, from in-house recruiter tools to campus assessments, plus on-site work with an enterprise healthcare client.",
    wins: [
      { value: "2", label: "AI hiring products in production: Talos and AssessAI" },
      { value: "3", label: "AI checks per candidate: scoring, proctoring, identity" },
      { value: "85%", label: "less manual analysis with Talk2Data" },
      { value: "0", label: "engineer steps in the LTS pipeline until the final report" },
    ],
    projects: [
      {
        name: "Talos (formerly TalentSphere)",
        big: "AI hiring",
        from: "#34c08a",
        to: "#0f5e3e",
        client: "J2W recruiters",
        status: "In use",
        summary: "J2W's in-house AI recruitment platform: it matches resumes to jobs, screens candidates, writes interview questions and scores the answers.",
        points: [
          "Resume and job matching: AI reads each resume and ranks it against open roles.",
          "AI screening shortlists candidates before a recruiter steps in.",
          "AI generates interview questions tailored to the role and the candidate.",
          "AI evaluates the answers and scores every candidate, so recruiters compare like for like.",
          "Now the application J2W's recruiters use day to day.",
        ],
      },
      {
        name: "Assessment AI Portal (AssessAI)",
        big: "VIT hiring",
        from: "#3fb6a8",
        to: "#11605a",
        client: "VIT campus hiring",
        status: "Shipped",
        link: { label: "assessai.joulestowatts.com", href: "https://assessai.joulestowatts.com/" },
        summary: "An AI-first assessment platform, used to run campus hiring for VIT: AI scores candidates, proctors them and verifies who they are, from test to final result.",
        points: [
          "LLMs grade answers against the question bank and explain each score.",
          "AI proctoring flags cheating and suspicious behaviour in real time.",
          "Identity matching stops impersonation.",
          "Admins plug in their own AI provider keys; question bank, human review and candidate emails are built around it.",
        ],
      },
      {
        name: "Long-Term Storage automation",
        big: "Hands-free",
        from: "#4f8df0",
        to: "#1c3f9a",
        client: "GE HealthCare",
        status: "Client site",
        summary: "Automated how every build artifact is archived in JFrog Artifactory, so any microservice can be rebuilt years later.",
        points: [
          "Replaced months of manual promotions per service with one automated pipeline.",
          "Three coordinated Groovy pipelines: orchestrator, per-service branch builds in parallel batches, and promotion.",
          "Missing dependencies are read from build errors, promoted and rebuilt automatically.",
          "Owned the test strategy, the Groovy development and the handover to the client team.",
        ],
      },
      {
        name: "Talk2Data",
        big: "−85% effort",
        from: "#a26cf5",
        to: "#4a2aa0",
        client: "J2W product",
        status: "Completed",
        summary: "Ask a question in plain English and get the SQL, a written summary and a chart back in seconds.",
        points: [
          "Natural-language-to-SQL with prompt-engineered LLM workflows, over SQL and MongoDB.",
          "The LLM summarises results and picks the right chart.",
          "Cut manual analysis effort by 85%.",
          "Real-time chat and dashboard in React and Next.js, with secure API key management.",
        ],
      },
    ],
    stack: ["TypeScript", "Python", "Groovy", "JFrog Artifactory", "SQL", "MongoDB", "Next.js", "LLM APIs"],
  },
  {
    id: "codinglimits",
    company: "CodingLimits",
    role: "Software Engineer",
    period: "May 2024 – Jul 2025",
    city: "Nellore",
    color: "#24408e",
    badge: { value: "50+", label: "enterprise clients" },
    logo: "/photos/cl-logo.webp",
    photo: { src: "/photos/cl-techteam.webp", caption: "The tech team", pos: "50% 45%" },
    industries: ["HR tech", "SaaS"],
    clients: ["50+ enterprise clients", "Worked directly with the founders"],
    brief: "Full-stack architecture and feature delivery for Talsy, a SaaS platform for end-to-end recruitment and HR operations.",
    wins: [
      { value: "50+", label: "enterprise clients using the modules I led" },
      { value: "150+", label: "REST APIs built and optimised" },
      { value: "<50ms", label: "response times under high concurrency" },
      { value: "99.9%", label: "uptime on GCP and Vercel" },
    ],
    projects: [
      {
        name: "Talsy recruitment & HR modules",
        big: "150+ APIs",
        from: "#4f7cf0",
        to: "#1d3489",
        client: "50+ enterprise clients",
        status: "Shipped",
        summary: "Led end-to-end development of the core recruitment and HR modules.",
        points: [
          "Built and optimised 150+ REST APIs with <50ms responses under load.",
          "Next.js and React frontend over a NestJS backend.",
        ],
      },
      {
        name: "Multi-tenant access control",
        big: "RBAC + JWT",
        from: "#6a6ff2",
        to: "#2e2b8f",
        client: "Talsy platform",
        status: "Shipped",
        summary: "A multi-tenant RBAC system with JWT-based authentication.",
        points: ["Role-based access across tenants, secured with JWT."],
      },
      {
        name: "AI resume parsing & ranking",
        big: "AI ranking",
        from: "#2fb3d6",
        to: "#145f86",
        client: "Talsy recruiters",
        status: "Shipped",
        summary: "AI reads resumes and ranks candidates to automate screening.",
        points: ["Automated candidate screening for recruiters."],
      },
      {
        name: "Cloud & CI/CD",
        big: "99.9%",
        from: "#3c8fd8",
        to: "#173f73",
        client: "Talsy platform",
        status: "Shipped",
        summary: "Infrastructure on GCP and Vercel with CI/CD pipelines.",
        points: ["Kept the platform at 99.9% uptime."],
      },
    ],
    stack: ["Next.js", "React", "NestJS", "TypeScript", "GCP", "Vercel"],
  },
  {
    id: "fms",
    company: "FMS Solutions",
    role: "Software Engineer (Former Intern)",
    period: "Jun 2023 – Apr 2024",
    city: "Hyderabad",
    color: "#c26a3a",
    badge: { value: "Intern → FTE", label: "full-time offer" },
    photo: { src: "/photos/fms-team.webp", caption: "The FMS team" },
    industries: ["Payroll", "Workforce analytics"],
    clients: ["Enterprise payroll & labour-intelligence platforms"],
    brief: "Grew from web development intern to software engineer on enterprise payroll and labour-intelligence platforms.",
    wins: [
      { value: "Intern → FTE", label: "full-time offer for code quality and UI work" },
      { value: "3", label: "frameworks shipped in: React, Next.js, Angular" },
    ],
    projects: [
      {
        name: "Analytics dashboards",
        big: "Analytics",
        from: "#ff8a4c",
        to: "#b3441b",
        client: "Payroll & labour platforms",
        status: "Shipped",
        summary: "Dynamic CRUD modules for revenue, labour and sales analytics.",
        points: ["Reduced load times with efficient data fetching and HTTP interceptors."],
      },
      {
        name: "Legacy portal migration",
        big: "→ Next.js",
        from: "#f4b23e",
        to: "#b0661a",
        client: "Internal portals",
        status: "Shipped",
        summary: "Migrated legacy internal portals to Next.js.",
        points: ["Also contributed React Native features."],
      },
    ],
    stack: ["React", "Next.js", "Angular", "Bootstrap", "Git"],
  },
];
