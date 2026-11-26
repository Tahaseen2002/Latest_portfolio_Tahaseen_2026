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
  photo?: string; // shown on the card (used by the "Me" pointer)
  milestones?: { year: string; text: string }[];
};

export const pins: Pin[] = [
  {
    id: "me",
    label: "Me",
    year: "",
    x: 23.6,
    y: 45,
    color: "#e5533d",
    initial: "✦",
    title: "Hi, I'm Tahaseen",
    role: "Full Stack & AI Engineer · Ongole, India",
    headline: "3+ years turning ideas into shipped products.",
    story: [
      "From a government school in Andhra Pradesh to IIIT Nuzvid, then three companies in three years: FMS Solutions, CodingLimits and now J2W, where I build AI products.",
    ],
    photo: "/Tahaseen.webp",
    metrics: [
      { value: "3+", label: "years building" },
      { value: "150+", label: "APIs shipped" },
      { value: "3", label: "companies" },
      { value: "21", label: "public repos" },
    ],
    milestones: [
      { year: "2017", text: "Finished 10th at a government school, Andhra Pradesh" },
      { year: "2023", text: "B.Tech CSE, IIIT Nuzvid · GPA 8.5 · campus placement" },
      { year: "2023", text: "Joined FMS Solutions as an intern, earned a full-time offer" },
      { year: "2024", text: "CodingLimits: owned Talsy, 150+ APIs for 50+ enterprise clients" },
      { year: "2025", text: "J2W: shipped AssessAI for VIT hiring; built Talos, the recruiters' AI platform" },
    ],
  },
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
      "Talos (formerly TalentSphere): J2W's in-house AI recruitment platform for resume matching, screening, interview questions and scoring. Recruiters use it every day.",
      "AssessAI: AI grades answers, proctors tests and verifies candidates. Shipped and used for VIT campus hiring.",
      "Also: on-site at GE HealthCare automating long-term artifact storage with Groovy pipelines, and Talk2Data, a chat-with-your-data analytics tool.",
    ],
    metrics: [
      { value: "4", label: "AI & automation projects" },
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
// Stops on the illustrated city map. x / y are in the map's own 2000 × 1400 space.
// In `text`, wrap a phrase in **double stars** to make it bold + underlined.
export type JourneyStop = {
  id: string;
  label: string;
  when: string;
  place: string;
  x: number;
  y: number;
  color: string;
  initial: string;
  title: string;
  text: string;
  metrics?: { value: string; label: string }[];
  link?: { label: string; href: string };
  // Real photos shown in the card. Put files in /public/photos. `wide` = a landscape screenshot.
  gallery?: { src: string; caption: string; pos?: string; wide?: boolean }[];
  logo?: string; // optional logo image for the card badge and the map pin
};

// Positions follow real geography (longitude → x, latitude → y), so the route loops.
export const journey: JourneyStop[] = [
  {
    id: "school", label: "Markapur", when: "Till 2017", place: "Markapur, Andhra Pradesh", x: 1056, y: 568, color: "#d97706", initial: "M",
    title: "Where it all started.",
    text: "I grew up and studied in **Markapur**, Andhra Pradesh, always curious about **how things work**.",
  },
  {
    id: "college", label: "IIIT Nuzvid", when: "2017 – 2023", place: "Nuzvid", x: 1719, y: 274, color: "#7a5aa6", initial: "R",
    title: "Where I learned how systems are built.",
    text: "Six years at **RGUKT Nuzvid**: pre-university, then a B.Tech in **Computer Science & Engineering**. I graduated with a campus placement in hand.",
    metrics: [{ value: "8.5", label: "GPA" }, { value: "2023", label: "graduated" }],
  },
  {
    id: "fms", label: "FMS Solutions", when: "Jun 2023 – Apr 2024", place: "Hyderabad", x: 724, y: 106, color: "#c26a3a", initial: "F",
    title: "FMS taught me to ship for real users.",
    text: "I joined through **campus placement** as an intern on enterprise payroll platforms, and grew into a **software engineer** with a full-time offer.",
    metrics: [{ value: "Intern → FTE", label: "full-time offer" }, { value: "3", label: "frameworks shipped in" }],
    gallery: [{ src: "/photos/fms-id.webp", caption: "My first ID card", pos: "50% 45%" }, { src: "/photos/fms-team.webp", caption: "The FMS team" }],
  },
  {
    id: "codinglimits", label: "CodingLimits", when: "May 2024 – Jul 2025", place: "Nellore", x: 1354, y: 976, color: "#24408e", initial: "C",
    title: "CodingLimits taught me to own a product.",
    text: "I drove full-stack architecture for **Talsy**, a recruitment SaaS, working directly with the founders: APIs, **multi-tenant RBAC** and AI resume parsing.",
    metrics: [{ value: "150+", label: "REST APIs" }, { value: "50+", label: "enterprise clients" }],
    gallery: [{ src: "/photos/cl-techteam.webp", caption: "The tech team", wide: true }, { src: "/photos/cl-team.webp", caption: "The whole CodingLimits family" }],
    logo: "/photos/cl-logo.webp",
  },
  {
    id: "j2w", label: "J2W", when: "Dec 2025 – Now", place: "Bengaluru", x: 350, y: 1340, color: "#1f6b4a", initial: "J",
    title: "J2W is where I build AI that does real work.",
    text: "Built **Talos**, the AI recruitment platform J2W's recruiters use daily, and shipped **AssessAI** for **VIT** campus hiring. Also on-site at **GE HealthCare**, and **Talk2Data** analytics.",
    metrics: [{ value: "4", label: "AI & automation projects" }, { value: "85%", label: "less manual analysis" }],
    link: { label: "See what I built here", href: "#experience" },
    gallery: [{ src: "/photos/assessai.webp", caption: "AssessAI, used for VIT hiring", wide: true, pos: "0% 0%" }, { src: "/photos/j2w.webp", caption: "Diwali at J2W", pos: "50% 35%" }, { src: "/photos/ge-id.webp", caption: "On-site at GE HealthCare" }],
  },
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

// ---------- The "Me" card (click the Me label on the map) ----------
// Swap gallery photos for real ones any time: put the file in /public and change `src`.
export const meCard = {
  greeting: "Hey, I'm Tahaseen",
  identity: ["Full Stack & AI Engineer", "Builder", "Ongole, India"],
  headline: "I build AI so people don't do it twice.",
  tabs: [
    {
      id: "school",
      label: "School",
      items: [
        { title: "Government school, Andhra Pradesh", text: "10th standard, 2017. Where the curiosity started." },
        { title: "IIIT Nuzvid (RGUKT)", text: "PUC + B.Tech CSE, 2017–2023. GPA 8.5." },
        { title: "Campus placement", text: "Walked out of college into my first job at FMS." },
      ],
    },
    {
      id: "work",
      label: "Work",
      items: [
        { title: "J2W · Now", text: "Built Talos and shipped AssessAI (VIT hiring), plus GE HealthCare and Talk2Data." },
        { title: "CodingLimits · 2024–25", text: "Owned Talsy: 150+ APIs for 50+ enterprise clients." },
        { title: "FMS Solutions · 2023–24", text: "Intern to engineer. Earned a full-time offer." },
      ],
    },
    {
      id: "off",
      label: "Off the clock",
      items: [
        { title: "Side projects", text: "21 public repos, 6 live demos. Built solo, end to end." },
        { title: "Languages", text: "English, Telugu and Hindi." },
        { title: "Motto", text: "Code → Deploy → Repeat." },
      ],
    },
  ],
  gallery: [
    { src: "/Tahaseen.webp", caption: "Me, mid-deploy" },
    { src: "/world.webp", caption: "My world, by day" },
    { src: "/world-night.webp", caption: "…and by night" },
  ],
  stats: [
    { value: "3+ yrs", label: "industry experience" },
    { value: "150+", label: "APIs shipped to production" },
  ],
};
