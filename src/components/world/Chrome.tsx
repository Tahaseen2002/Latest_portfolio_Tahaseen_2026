"use client";

// Floating site controls: the bottom dock menu, the Day/Night switch,
// and a guided "Take a tour" that walks visitors through each section.

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

const sections = [
  { id: "top", label: "Home" },
  { id: "journey", label: "Journey" },
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

const tourSteps = [
  { id: "top", title: "Welcome to my world", text: "Each glowing pin is a chapter of my career. Click one to open its story." },
  { id: "journey", title: "The journey", text: "Scroll to travel the route from college to my current role, one stop at a time." },
  { id: "work", title: "The project box", text: "Pick a card to see a personal project, then open its full case study." },
  { id: "about", title: "About me", text: "Drag the notes around. They're a little messy, like any good desk." },
  { id: "contact", title: "Say hello", text: "Press E, L, G or R on your keyboard, or click a key." },
];

export default function Chrome({ name, resume }: { name: string; resume: string }) {
  const [active, setActive] = useState("top");
  const [night, setNight] = useState(false);
  const [tour, setTour] = useState<number | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    setNight(root.dataset.theme ? root.dataset.theme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches);
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (tour === null) return;
    document.getElementById(tourSteps[tour].id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [tour]);

  // Day ↔ Night with a circle that grows out of the button (View Transitions API).
  // Browsers without it, or visitors who prefer reduced motion, just switch instantly.
  const toggleNight = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next = night ? "light" : "dark";
    const apply = () => {
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch {}
      flushSync(() => setNight(!night));
    };
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!doc.startViewTransition || reduce) return apply();

    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.documentElement.classList.add("theme-switching");
    const t = doc.startViewTransition(apply);
    t.ready
      .then(() => {
        const anim = document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 1100, easing: "cubic-bezier(0.65, 0, 0.35, 1)", pseudoElement: "::view-transition-new(root)" },
        );
        anim.finished.finally(() => document.documentElement.classList.remove("theme-switching"));
      })
      .catch(() => document.documentElement.classList.remove("theme-switching"));
  };

  return (
    <>
      <div className="chrome-top">
        <a href="#top" className="chip-brand">
          <span className="chip-dot" aria-hidden="true" />
          {name}
        </a>
        <div className="chrome-right">
          <button className="chip-btn" onClick={() => setTour(0)}>
            <span className="orb" aria-hidden="true" />
            Take a tour
          </button>
          <button className="chip-btn theme-chip" onClick={toggleNight} aria-pressed={night} aria-label={night ? "Switch to day" : "Switch to night"}>
            <motion.span key={night ? "sun" : "moon"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} aria-hidden="true">
              {night ? "☀" : "☾"}
            </motion.span>
            {night ? "Day" : "Night"}
          </button>
        </div>
      </div>

      <nav className="dock" aria-label="Sections">
        {sections.map((s) => (
          <a key={s.id} href={`#${s.id}`} className={active === s.id ? "on" : ""} aria-current={active === s.id ? "true" : undefined}>
            {active === s.id && <motion.span layoutId="dock-pill" className="dock-pill" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
            <span>{s.label}</span>
          </a>
        ))}
        <a href={resume} download className="dock-cta">
          Résumé ↗
        </a>
      </nav>

      <AnimatePresence>
        {tour !== null && (
          <motion.div className="tour" role="dialog" aria-label="Site tour" initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }} key="tour">
            <p className="tour-step">
              {tour + 1} / {tourSteps.length}
            </p>
            <AnimatePresence mode="wait">
              <motion.div key={tour} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
                <p className="tour-title">{tourSteps[tour].title}</p>
                <p className="tour-text">{tourSteps[tour].text}</p>
              </motion.div>
            </AnimatePresence>
            <div className="tour-actions">
              <button onClick={() => setTour(null)}>Skip</button>
              <div>
                {tour > 0 && <button onClick={() => setTour(tour - 1)}>Back</button>}
                <button className="primary" onClick={() => setTour(tour < tourSteps.length - 1 ? tour + 1 : null)}>
                  {tour < tourSteps.length - 1 ? "Next" : "Done"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
