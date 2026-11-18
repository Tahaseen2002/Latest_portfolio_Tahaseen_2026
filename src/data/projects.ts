// Personal projects and their case studies. Edit this file to update them.
//
// `todo` fields are notes to yourself: they show as dashed boxes while you run
// `npm run dev`, and are hidden on the live site. A section (or sub-section)
// with nothing but a todo is left out of the live site and its menu.

export type CoverKind = "pulsevo" | "hirevolts" | "password" | "jsonflow";

export type SectionKey =
  | "problem"
  | "role"
  | "discovery"
  | "solution"
  | "design"
  | "tech"
  | "arch"
  | "standards"
  | "agents"
  | "deploy"
  | "results"
  | "challenges"
  | "conclusion";

export const sectionTitles: Record<SectionKey, string> = {
  problem: "The Problem",
  role: "My Role",
  discovery: "Discovery",
  solution: "Solution",
  design: "Design Process",
  tech: "Technical Decisions",
  arch: "Architecture",
  standards: "Dev Standards",
  agents: "AI Agents",
  deploy: "Deployment",
  results: "Results & Impact",
  challenges: "Challenges",
  conclusion: "Conclusion",
};

type Content = {
  paras?: string[];
  bullets?: string[];
  todo?: string;
};

export type SubSection = Content & { key: string; title: string };

export type Section = Content & {
  cards?: { title: string; text: string }[]; // small grid of cards (e.g. AI modes)
  flow?: string[]; // numbered step-by-step diagram
  subs?: SubSection[];
};

export type Project = {
  slug: CoverKind;
  tag: string;
  title: string;
  summary: string;
  role: string;
  type: string;
  status: string;
  stack: string;
  code: string;
  live?: string;
  docs?: string;
  image?: string; // optional real screenshot, e.g. "/covers/pulsevo.png"
  sections: Partial<Record<SectionKey, Section>>;
};

const repo = "https://github.com/Tahaseen2002/";

export const projects: Project[] = [
  {
    slug: "pulsevo",
    tag: "AI · Hackathon",
    title: "Pulsevo",
    summary:
      "An AI-powered team productivity dashboard. Upload your team's task sheet and get summaries, sprint forecasts, bottleneck alerts and a chatbot that answers questions about your team.",
    role: "Solo: frontend, backend, AI & deployment",
    type: "Hackathon build",
    status: "Working MVP",
    stack: "React 19 · Express · MongoDB · Gemini / OpenAI",
    code: repo + "hackathon_terralogic",
    sections: {
      problem: {
        paras: [
          "Team productivity data lives in spreadsheets and task trackers. Turning it into answers (who is overloaded, will the sprint finish, how is the team feeling) takes a lead hours of manual analysis every week.",
        ],
        subs: [
          {
            key: "before",
            title: "Before",
            bullets: [
              "Task data exported to CSV or Excel, with different column names in every team.",
              "Leads read raw rows and charts by hand to spot blocked or overdue work.",
              "Status reports and sprint estimates written from scratch each time.",
            ],
          },
          {
            key: "why",
            title: "Why dashboards fall short",
            paras: [
              "Charts show what happened, but someone still has to read them, spot the problems and explain them. The goal was a dashboard that also tells you what the numbers mean.",
            ],
          },
        ],
      },
      role: {
        paras: [
          "I built Pulsevo on my own, end to end: the data ingestion pipeline, the Express API and MongoDB models, the AI service with its prompts, the React dashboard and chat, and the setup to run it all with one command.",
        ],
      },
      discovery: {
        paras: ["I started from the questions a team lead actually asks, and made each one an AI mode:"],
        bullets: [
          "“How did the team do?” → productivity summary and daily report.",
          "“Will we finish the sprint?” → sprint forecast from recent history.",
          "“Who is stuck or overloaded?” → bottleneck and workload analysis.",
          "“How is morale?” → sentiment from commit messages and comments.",
          "Anything else → a chatbot that answers in plain English using the team’s data.",
        ],
      },
      solution: {
        bullets: [
          "Upload CSV or Excel task data; it is cleaned, validated and stored in MongoDB.",
          "A dashboard with six live stat cards and Recharts charts.",
          "An AI insights panel with eight analysis prompts.",
          "A chatbot for natural-language questions about the team.",
          "A filterable task list to drill into the details behind any insight.",
        ],
      },
      design: {
        paras: [
          "Everything a lead needs sits on one screen, in the order they use it: upload data, scan the stat cards, read the AI insights, ask follow-up questions in chat, then check the task list.",
          "The AI panel shows one mode at a time with clear buttons, so insights feel like answers to specific questions rather than a wall of generated text.",
        ],
      },
      tech: {
        bullets: [
          "Forgiving data import: column names are normalised (case, spaces, dashes and underscores removed) and matched against several aliases, so “Due Date”, “due_date” and “dueDate” all work.",
          "Status and priority values are mapped to fixed sets (open, in-progress, completed, blocked; low to critical), and invalid dates are dropped instead of crashing the import.",
          "Provider switch: Gemini 2.0 Flash by default, with OpenAI as an alternative, chosen by one environment variable.",
          "AI and dashboard responses are cached in memory for five minutes (node-cache), with a force-refresh option, to keep the page fast and avoid repeat API calls.",
          "Every endpoint is documented with Swagger at /api-docs.",
        ],
      },
      arch: {
        paras: ["From a spreadsheet to answers."],
        flow: ["CSV / Excel upload", "Ingestion service", "MongoDB + 5-min cache", "AI service", "Dashboard & chat"],
      },
      standards: {
        bullets: [
          "Layered backend: routes, services and Mongoose models kept separate, so the AI provider or data source can change without touching the API.",
          "One AI service class wraps both providers behind a single generateResponse method.",
          "Schema validation with enums for status and priority.",
          "API keys and settings kept in environment variables, never in code.",
          "A sample dataset (25 tasks) in the repo for repeatable testing.",
        ],
      },
      agents: {
        paras: ["Each AI mode is a focused prompt that sends the relevant slice of the team’s data, as JSON, to Gemini or OpenAI and asks for a specific kind of answer."],
        cards: [
          { title: "Productivity summary", text: "Analyses team performance from the task data." },
          { title: "Sprint forecast", text: "Predicts next-sprint completion from the past four weeks." },
          { title: "Sentiment", text: "Reads the tone of commit messages and comments." },
          { title: "Bottlenecks", text: "Spots uneven task distribution and workload." },
          { title: "Daily summary", text: "Writes an automated daily performance report." },
          { title: "Hourly metrics", text: "Analyses performance hour by hour." },
          { title: "Collaboration", text: "Assesses how siloed or collaborative the team is." },
          { title: "Team chat", text: "Answers natural-language questions using the data." },
        ],
      },
      deploy: {
        bullets: [
          "One command (npm run dev:all) starts the API and the React app together, which kept the hackathon demo simple.",
          "Configuration lives entirely in environment variables (database URL, AI provider and keys), so it can move to any Node host and MongoDB Atlas without code changes.",
          "Swagger docs ship with the API for anyone testing the endpoints.",
        ],
      },
      results: {
        bullets: [
          "A working MVP that goes from a raw spreadsheet to AI insights in one upload.",
          "Eight AI analyses and a chatbot behind one consistent service.",
          "Swappable AI providers: switching between Gemini and OpenAI is a config change.",
        ],
      },
      challenges: {
        bullets: [
          "Messy input: every team names its columns differently. Normalising keys and accepting aliases made imports work without asking users to reformat files.",
          "Consistent AI output: open-ended prompts gave rambling answers. Narrow prompts with a fixed structure for each mode made results readable and comparable.",
          "Cost and speed: calling the AI on every refresh was slow. A five-minute cache made the dashboard instant while keeping insights fresh.",
        ],
      },
      conclusion: {
        paras: [
          "Pulsevo shows how a small, focused AI layer on top of solid data handling can turn raw task data into answers a team lead can act on.",
        ],
      },
    },
  },
  {
    slug: "hirevolts",
    tag: "Full stack · Recruitment",
    title: "HireVolts ATS",
    summary:
      "An applicant tracking system that reads resumes for you: upload a PDF or DOCX and the candidate profile fills itself in.",
    role: "Solo: frontend, backend & deployment",
    type: "Personal project",
    status: "Live demo",
    stack: "React · TypeScript · Express · MongoDB · JWT",
    code: repo + "ATS-portal_Hirevolts",
    live: "https://ats-hirevolts-frontend.vercel.app/signin",
    docs: "https://ats-portal-hirevolts.onrender.com/api-docs/",
    sections: {
      problem: {
        paras: [
          "Recruiters retype the same details from every resume into their tracking tool. It is slow and error-prone, and keeps them from actually reviewing candidates.",
        ],
        subs: [
          {
            key: "before",
            title: "Before",
            bullets: [
              "Name, email, phone, skills and experience copied by hand from each resume.",
              "Resumes and candidate status tracked across folders and spreadsheets.",
              "No single view of which candidates were attached to which job.",
            ],
          },
          {
            key: "why",
            title: "Why simple tools fall short",
            paras: [
              "Spreadsheets don’t read resumes, and larger ATS products are heavy for a small team. The aim was a focused tool that removes data entry and keeps the hiring pipeline in one place.",
            ],
          },
        ],
      },
      role: {
        paras: [
          "I built HireVolts on my own: the React and TypeScript frontend, the Express and MongoDB backend, the resume parser, authentication, email and file storage, and the deployments on Vercel and Render.",
        ],
      },
      discovery: {
        paras: ["I mapped the recruiter’s day-one workflow and built for it in order:"],
        bullets: [
          "Get candidates in fast → single and bulk resume upload with automatic parsing.",
          "Trust the data → a review step to check and fix parsed fields before saving.",
          "Track progress → a pipeline from New to Hired.",
          "Connect people to roles → jobs that candidates can be attached to.",
          "Keep it private → accounts with sign-in and password reset.",
        ],
      },
      solution: {
        bullets: [
          "Resume parsing: name, email, phone, skills, work experience, education, location and summary pulled from PDF and DOCX files.",
          "Bulk upload: select many resumes, review and edit each parsed candidate (including work history), then add them one by one or all at once.",
          "A candidate pipeline: New, Screening, Interview, Offer, Rejected and Hired.",
          "Jobs: create postings and attach candidates.",
          "Sign up, sign in, welcome email and password reset by emailed code.",
          "A dashboard summarising candidates and jobs.",
        ],
      },
      design: {
        paras: [
          "The app opens on a dashboard, with candidates and jobs one click away. Lists lead to detail views, and adding records happens in modals so recruiters never lose their place.",
          "Bulk upload is designed around review: parsed candidates appear as editable cards with clear “added” states and toast messages, so nothing is saved without the recruiter seeing it.",
        ],
      },
      tech: {
        bullets: [
          "Section-aware parsing: the parser looks for a dedicated Skills section first and only scans the whole resume if there isn’t one, which cuts false matches. Skills are matched on word boundaries against a dictionary of 130+ terms with spelling variants.",
          "Work experience is extracted by finding where the experience section starts and ends, using the next major heading (Education, Projects…) as the boundary.",
          "pdf-parse and mammoth turn PDF and DOCX files into text; files are stored on Cloudinary and fetched for parsing.",
          "A parse-only endpoint powers the preview step, separate from the endpoint that saves the candidate.",
          "Email and phone are required: if the parser can’t find them, the API returns a clear message instead of saving an incomplete record. Candidate emails are unique, which catches duplicates.",
          "JWT authentication with bcrypt-hashed passwords; password reset uses a random 6-digit code that expires after one hour.",
        ],
      },
      arch: {
        paras: ["How a resume becomes a candidate."],
        flow: ["Upload resume", "Cloudinary storage", "Parser (PDF / DOCX)", "Review & edit", "MongoDB Atlas", "Pipeline"],
      },
      standards: {
        bullets: [
          "Backend split into config, routes, controllers, models, middleware and utils.",
          "Auth middleware protects private routes; secrets come from environment variables.",
          "Typed API client and shared TypeScript types on the frontend.",
          "Parser test scripts with sample resumes to check extraction while iterating.",
          "Swagger documentation for every endpoint.",
        ],
      },
      deploy: {
        bullets: [
          "Frontend (React + Vite) deployed on Vercel.",
          "API deployed on Render, with public Swagger docs.",
          "MongoDB Atlas for data, Cloudinary for resume files, Nodemailer for transactional email.",
        ],
      },
      results: {
        bullets: [
          "Adding a candidate goes from retyping a resume to a single upload and a quick review.",
          "Many resumes can be imported in one go, with duplicates caught automatically.",
          "A live, documented product that anyone can try: frontend, API and docs all public.",
        ],
      },
      challenges: {
        bullets: [
          "Resumes have no standard layout. Using section headings as anchors, and falling back to whole-text search only when needed, made extraction far more reliable.",
          "False skill matches (for example, short words inside other words) were fixed with word-boundary matching and a normalisation map for variants.",
          "Parsing is never perfect, so the review-before-save step keeps the recruiter in control instead of trusting the parser blindly.",
        ],
      },
      conclusion: {
        paras: [
          "HireVolts turns resume data entry into a single upload, so recruiters spend their time on candidates instead.",
        ],
      },
    },
  },
  {
    slug: "password",
    tag: "Security · Research",
    title: "Graphical Password Authentication",
    summary:
      "Log in by clicking points on an image or choosing pictures in order, based on IEEE research into Cued Click Points.",
    role: "Solo: research, design & development",
    type: "Personal project · IEEE-inspired",
    status: "Live demo",
    stack: "React · TypeScript · TailwindCSS · Vercel",
    code: repo + "Cued-Click-Points-for-Graphical-Password-Authentication",
    live: "https://graphical-password-authentication-tau.vercel.app/",
    sections: {
      problem: {
        paras: [
          "Text passwords force a trade-off: strong ones are hard to remember, easy ones are easy to guess, and both can be watched over someone’s shoulder.",
        ],
        subs: [
          {
            key: "before",
            title: "The usual trade-off",
            bullets: ["Strong passwords are hard to remember.", "Simple passwords are easy to guess.", "Typed passwords can be observed."],
          },
          {
            key: "why",
            title: "The research idea",
            paras: [
              "The IEEE paper on Cued Click Points uses spatial memory: people remember where they clicked on a picture far better than strings of characters.",
            ],
          },
        ],
      },
      role: {
        paras: ["I studied the paper, turned its ideas into product flows, and designed, built and deployed the app on my own."],
      },
      discovery: {
        paras: ["From the research I took three requirements:"],
        bullets: [
          "Memorable: the password should rely on images and positions, not characters.",
          "Forgiving: nobody clicks the exact same pixel twice, so matching needs a tolerance.",
          "Hard to observe: what an onlooker sees during login should not reveal the password.",
        ],
      },
      solution: {
        bullets: [
          "Cued Click Points: choose 5 points on an image; log in by clicking near the same points, in the same order.",
          "Image Sequence: pick 4 of 12 images in order; at login the grid is shuffled, so the positions change every time.",
          "Visual feedback for every click and selection, plus tips for choosing memorable points.",
          "Landing, register, login and success pages with clear guidance at each step.",
        ],
      },
      design: {
        paras: [
          "Registration teaches as it goes: on-screen instructions and tips (“choose distinctive features or landmarks”) help users pick points they will remember.",
          "A responsive Tailwind UI keeps the image large and the controls simple, so it works for user testing on desktop and mobile.",
        ],
      },
      tech: {
        bullets: [
          "Clicks are stored as percentages of the image’s width and height, not pixels, so a password set on a laptop still works on a phone.",
          "Validation checks each click in order and measures its distance from the saved point; it must land within a tolerance radius of 5% of the image.",
          "The image grid is shuffled with a Fisher–Yates shuffle at every login to resist shoulder surfing.",
          "Typed models and constants (points required, images required, grid size, tolerance) in one place, so the rules are easy to tune.",
        ],
      },
      arch: {
        paras: ["Registration and login."],
        flow: ["Register a pattern", "Store as % positions", "Login: click or select", "Order + tolerance check", "Access granted"],
      },
      standards: {
        bullets: [
          "Clear structure: pages, components, context for auth state, and utilities for validation, storage and images.",
          "TypeScript throughout, with shared types for click points and users.",
          "ESLint for consistent code; small pure functions for validation that are easy to test.",
        ],
      },
      deploy: {
        bullets: ["Built with Vite and deployed on Vercel with a public live demo."],
      },
      results: {
        bullets: [
          "Two working graphical login methods in one app.",
          "Logins that work across screen sizes thanks to percentage-based coordinates.",
          "Shoulder-surfing resistance through shuffled image grids.",
        ],
      },
      challenges: {
        bullets: [
          "Choosing the tolerance: too strict and real users fail, too loose and it becomes guessable. A small radius relative to the image balanced the two.",
          "Different screen sizes broke pixel coordinates; switching to percentages fixed it.",
          "Storage: the prototype keeps accounts in the browser for easy testing. The next step for production is a backend that stores hashed click patterns.",
        ],
      },
      conclusion: {
        paras: [
          "A research paper turned into a working product: passwords people can remember because they are visual.",
        ],
      },
    },
  },
  {
    slug: "jsonflow",
    tag: "Developer tool",
    title: "JSON Flow Visualizer",
    summary: "Paste any JSON and see it as an interactive node graph you can search, theme and export.",
    role: "Solo: design, development & deployment",
    type: "Personal project",
    status: "Live demo",
    stack: "React · TypeScript · React Flow · Vite",
    code: repo + "reactflow_json_nodes",
    live: "https://reactflow-json-nodes.vercel.app/",
    sections: {
      problem: {
        paras: ["Large, deeply nested JSON is hard to read as text. Finding one value means scrolling and counting brackets."],
        subs: [
          {
            key: "before",
            title: "Before",
            bullets: [
              "API responses and config files read as long blocks of text.",
              "Finding a value meant scrolling, folding and counting brackets.",
              "Explaining a data shape to someone else meant screenshots of raw text.",
            ],
          },
        ],
      },
      role: { paras: ["I designed, built and deployed the tool on my own."] },
      discovery: {
        paras: ["I listed what I needed when working with API data, and built exactly that:"],
        bullets: [
          "See the structure at a glance, not just the text.",
          "Jump straight to a value by its path.",
          "Copy the path of any value for use in code.",
          "Share the structure as an image.",
        ],
      },
      solution: {
        bullets: [
          "Paste JSON and get a tree of nodes: objects, arrays and values each styled differently.",
          "Search by JSON path (for example $.user.address.city or items[0].name): the view zooms to the node and highlights it.",
          "Click a node to copy its JSON path to the clipboard.",
          "Light and dark themes, zoom controls and a reset view.",
          "Export the graph as a PNG image.",
          "Clear error messages for invalid JSON.",
        ],
      },
      design: {
        paras: [
          "Three parts: a JSON input panel, a search bar and the graph canvas. Colour separates objects, arrays and values, so the shape of the data reads before any labels.",
        ],
      },
      tech: {
        bullets: [
          "A recursive parser turns JSON into a tree, recording each node’s path and type (object, array or value).",
          "Overlap-free layout: leaves are placed left to right, 200 px apart, and each parent is centred above its children, with levels 120 px apart.",
          "React Flow handles panning, zooming and smooth-step edges; search uses setCenter with an animated zoom to bring the match into view.",
          "html-to-image exports the canvas as json-tree.png, with a background colour matched to the current theme.",
        ],
      },
      arch: {
        paras: ["From text to graph."],
        flow: ["JSON text", "Parse & validate", "Build tree (paths + types)", "Leaf-first layout", "React Flow canvas"],
      },
      standards: {
        bullets: [
          "Separated concerns: components (canvas, input, header, search), utilities (JSON-to-flow, theme) and shared types.",
          "TypeScript for node kinds and layout data.",
          "Theme colours defined once and reused across nodes, edges and panels.",
        ],
      },
      deploy: { bullets: ["Built with Vite and deployed on Vercel with a public live demo."] },
      results: {
        bullets: [
          "Any JSON becomes a readable graph in one paste.",
          "Values can be found by path and their paths copied straight into code.",
          "Data shapes can be shared as images in reviews and docs.",
        ],
      },
      challenges: {
        bullets: [
          "Overlapping nodes in wide trees: placing leaves first and centring parents above them keeps every level tidy.",
          "Finding a node in a large graph: path search with an animated zoom and highlight makes it immediate.",
          "Exports that look right in both themes: the PNG uses a background matched to light or dark mode.",
        ],
      },
      conclusion: { paras: ["A small tool that makes nested data visible at a glance."] },
    },
  },
];

// Smaller repos shown as plain link cards under the case studies
export const moreProjects = [
  {
    title: "Event Management Calendar",
    meta: "Next.js · Firebase · Live ↗",
    text: "Calendar app with Firebase sign-up and login and event management.",
    href: "https://event-management-calendar-firebase.vercel.app",
  },
  {
    title: "Dialogflow Chatbot",
    meta: "React · Node · Dialogflow · Code ↗",
    text: "Chatbot with a React front end and a Node backend connected to Dialogflow.",
    href: repo + "dialogflow-full-code",
  },
  {
    title: "All repositories",
    meta: "GitHub ↗",
    text: "Course projects, experiments and work in progress.",
    href: "https://github.com/Tahaseen2002?tab=repositories",
  },
];

// ---------- helpers used by the case study page ----------

const hasContent = (c: Content) => !!(c.paras?.length || c.bullets?.length);

export type BuiltSub = SubSection & { id: string; visible: boolean };
export type BuiltSection = Omit<Section, "subs"> & { key: SectionKey; id: string; title: string; num: string; subs: BuiltSub[] };

/** Ordered sections for a project. When `drafts` is false, todo-only parts are dropped. */
export function buildSections(p: Project, drafts: boolean): BuiltSection[] {
  const out: BuiltSection[] = [];
  (Object.keys(sectionTitles) as SectionKey[]).forEach((key) => {
    const s = p.sections[key];
    if (!s) return;
    const subs = (s.subs ?? [])
      .map((u) => ({ ...u, id: `${key}-${u.key}`, visible: hasContent(u) || (drafts && !!u.todo) }))
      .filter((u) => u.visible);
    const visible = hasContent(s) || !!s.cards?.length || !!s.flow?.length || subs.length > 0 || (drafts && !!s.todo);
    if (!visible) return;
    out.push({ ...s, key, id: key, title: sectionTitles[key], num: String(out.length + 1).padStart(2, "0"), subs });
  });
  return out;
}

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
