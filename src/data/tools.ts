// Tools shown as app-icon tiles when the gift is unwrapped.
// Logos come from Simple Icons (CC0): https://simpleicons.org
// To add one, import its `si…` export and add it to the list.

import {
  siAngular, siApachegroovy, siBootstrap, siCss, siClaude, siDocker, siFirebase, siGit, siGithubactions,
  siGooglecloud, siGooglegemini, siHtml5, siJavascript, siJfrog, siMongodb, siNestjs, siNextdotjs, siNodedotjs,
  siPython, siReact, siSwagger, siTailwindcss, siTypescript, siVercel,
  type SimpleIcon,
} from "simple-icons";

export type Tool = { name: string; path: string; hex: string };

const t = (icon: SimpleIcon, name = icon.title): Tool => ({ name, path: icon.path, hex: icon.hex });

export const tools: Tool[] = [
  t(siReact), t(siNextdotjs, "Next.js"), t(siTypescript), t(siJavascript), t(siHtml5, "HTML5"), t(siCss, "CSS"),
  t(siTailwindcss, "Tailwind"), t(siBootstrap), t(siAngular),
  t(siNodedotjs, "Node.js"), t(siNestjs, "NestJS"), t(siPython), t(siMongodb, "MongoDB"), t(siFirebase),
  t(siGooglegemini, "Gemini"), t(siClaude),
  t(siGooglecloud, "Google Cloud"), t(siVercel), t(siDocker), t(siGithubactions, "GitHub Actions"), t(siJfrog, "JFrog"),
  t(siApachegroovy, "Groovy"), t(siSwagger), t(siGit),
];

// Skills that aren't products (no logo): shown as a small row under the icons
export const alsoGoodAt = [
  "LLM integration", "Prompt engineering", "AI agents", "OpenAI APIs", "REST APIs", "JWT auth", "RBAC", "System design", "Data pipelines", "Agile / Scrum",
];
