// Content for the interactive "world" homepage.
// Pins, journey stops and corkboard notes all live here.

// ---------- Hero scene ----------
// The illustration lives in /public/world.webp (a compressed copy of
// /public/herosection.png). Pins are placed by x / y = percent of the image.
// Set `image` to "" to fall back to the drawn scene.
export const scene = {
  image: "/world.webp", // compressed copy of /public/Herosection.png
  imageNight: "/world-night.webp", // night version, revealed by the Night button
  alt: "Illustration of Tahaseen sitting on a hill with a laptop, looking over a glowing path from her government school, past IIIT Nuzvid, FMS Solutions and CodingLimits, to J2W, with a floating island of side projects.",
};

// Text over the hero. Mark one phrase with `strike: true` for the crossed-out effect.
export const hero = {
  lines: [
    [{ text: "Building AI so you don't" }],
    [{ text: "do it twice.", strike: true }],
  ] as { text: string; strike?: boolean }[][],
  sub: "Full stack & AI engineer. From a government school in Andhra Pradesh to building AI at J2W.",
};

export type Pin = {
  id: string;
  label: string;
  year: string;
  x: number; // % from left of the image
  y: number; // % from top of the image
  color: string;
  initial: string;
  title: string;
  role: string;
  headline: string;
  story: string[];
  metrics: { value: string; label: string }[];
  cta?: { label: string; href: string };
};

export const pins: Pin[] = [
  {
    id: "school",
    label: "Govt. School",
    year: "Till 2017",
    x: 14.3,
    y: 36,
    color: "#d97706",
    initial: "S",
    title: "Government School",
    role: "10th Standard · Andhra Pradesh",
    headline: "A small beginning, and a big curiosity.",
    story: ["I finished my 10th standard at a government school in Andhra Pradesh in 2017. That's where the curiosity about how things work began."],
    metrics: [
      { value: "Till 2017", label: "10th Standard" },
      { value: "AP", label: "Andhra Pradesh" },
    ],
    cta: { label: "See the journey", href: "#journey" },
  },
  {
    id: "college",
    label: "IIIT Nuzvid",
    year: "2017–2023",
    x: 40.5,
    y: 45,
    color: "#7a5aa6",
    initial: "R",
    title: "IIIT Nuzvid (RGUKT)",
    role: "11th & 12th + B.Tech, Computer Science & Engineering",
    headline: "Where I learned how systems work.",
    story: [
      "Six years at Rajiv Gandhi University of Knowledge and Technologies, Nuzvid: two years of pre-university, then a B.Tech in Computer Science & Engineering.",
      "I graduated with a GPA of 8.5, and a campus placement that became my first job.",
    ],
    metrics: [
      { value: "8.5", label: "GPA" },
      { value: "2017–23", label: "PUC + B.Tech CSE" },
    ],
    cta: { label: "See the journey", href: "#journey" },
  },
  {
    id: "fms",
    label: "FMS Solutions",
    year: "2023",
    x: 60.5,
    y: 50,
    color: "#c26a3a",
    initial: "F",
    title: "FMS Solutions",
    role: "Software Engineer (Former Intern) · Campus placement",
    headline: "FMS taught me to ship for real users.",
    story: [
      "I joined through campus placement as a web development intern on enterprise payroll and labor-intelligence platforms, and grew into a software engineer.",
      "I built React, Next.js and Angular apps, analytics dashboards and CRUD modules, and migrated legacy portals to Next.js.",
    ],
    metrics: [
      { value: "Intern → FTE", label: "full-time offer" },
      { value: "3", label: "frameworks shipped in" },
    ],
    cta: { label: "See the journey", href: "#journey" },
  },
  {
    id: "codinglimits",
    label: "CodingLimits",
    year: "2024",
    x: 75.6,
    y: 51,
    color: "#24408e",
    initial: "C",
    title: "CodingLimits",
    role: "Software Engineer · Growth & development",
    headline: "CodingLimits taught me to own a product.",
    story: [
      "I drove full-stack architecture for Talsy, a recruitment and HR SaaS, working directly with the founders.",
      "I built the core modules, the APIs, a multi-tenant role-based access system and AI resume parsing, and ran it on GCP and Vercel.",
    ],
    metrics: [
      { value: "150+", label: "REST APIs" },
      { value: "<50ms", label: "response time" },
      { value: "50+", label: "enterprise clients" },
      { value: "99.9%", label: "uptime" },
    ],
    cta: { label: "See the journey", href: "#journey" },
  },
  {
    id: "j2w",
    label: "J2W",
    year: "Now",
    x: 90.5,
    y: 45,
    color: "#1f6b4a",
    initial: "J",
    title: "J2W",
    role: "Software Engineer (Full Stack & AI) · Building AI solutions",
    headline: "J2W is where I build AI that does real work.",
    story: [
      "Now: the Assessment AI Portal, where AI grades answers, proctors tests and verifies candidates for campus hiring.",
      "Before that: on-site at GE HealthCare automating long-term artifact storage with Groovy pipelines, and Talk2Data, a chat-with-your-data analytics tool.",
    ],
    metrics: [
      { value: "3", label: "AI & automation projects" },
      { value: "85%", label: "less manual analysis" },
    ],
    cta: { label: "See the journey", href: "#journey" },
  },
  {
    id: "lab",
    label: "Side Projects",
    year: "Lab",
    x: 86,
    y: 73,
    color: "#4b3f8f",
    initial: "✦",
    title: "Side projects",
    role: "Personal projects, built solo",
    headline: "Where I build things just to see if I can.",
    story: [
      "An AI productivity dashboard, a resume-parsing ATS, an IEEE-inspired graphical password and a JSON graph tool, each built solo from frontend to deployment.",
    ],
    metrics: [
      { value: "21", label: "public repos" },
      { value: "6", label: "live demos" },
    ],
    cta: { label: "Open the project box", href: "#work" },
  },
];

// The "Explore my journey" signpost in the illustration: a clickable link.
export const signpost = { x: 8.1, y: 63, href: "#journey", label: "Explore my journey" };

// ---------- Journey map ----------
// Positions are in the map's own 1000 × 560 coordinate space.
export const journey = [
  { id: "school", label: "Govt. School", when: "Till 2017", x: 110, y: 430, color: "#d97706", text: "10th standard at a government school in Andhra Pradesh. A small beginning, and a big curiosity." },
  { id: "college", label: "IIIT Nuzvid", when: "2017 – 2023", x: 300, y: 330, color: "#7a5aa6", text: "Pre-university + B.Tech in Computer Science & Engineering at RGUKT Nuzvid · GPA 8.5." },
  { id: "fms", label: "FMS Solutions", when: "Jun 2023 – Apr 2024", x: 500, y: 400, color: "#c26a3a", text: "Joined through campus placement. Intern to software engineer on enterprise payroll and labor-analytics platforms." },
  { id: "codinglimits", label: "CodingLimits", when: "May 2024 – Jul 2025", x: 700, y: 300, color: "#24408e", text: "Owned full-stack delivery of Talsy: 150+ APIs, multi-tenant RBAC, AI resume parsing." },
  { id: "j2w", label: "J2W", when: "Dec 2025 – Present", x: 890, y: 170, color: "#1f6b4a", text: "Building AI solutions: Assessment AI Portal, GE HealthCare LTS automation and Talk2Data." },
];

// ---------- Corkboard ----------
export const notes = [
  { id: "hello", kind: "paper", title: "Hi, I'm Tahaseen.", lines: ["Full stack & AI engineer", "Based in Ongole, India", "Building at J2W right now"] },
  { id: "motto", kind: "sticky", color: "#fde68a", text: "Code → Deploy → Repeat" },
  { id: "lang", kind: "sticky", color: "#bfdbfe", text: "I speak English, Telugu & Hindi" },
  { id: "likes", kind: "sticky", color: "#fecdd3", text: "I like projects that mix AI, logic and real business workflows." },
  { id: "interests", kind: "sticky", color: "#bbf7d0", text: "Into data-driven projects, web dev and learning something new every week." },
  { id: "smile", kind: "sticky", color: "#ddd6fe", text: "Good code makes the next developer smile." },
] as const;
