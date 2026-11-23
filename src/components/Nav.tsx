"use client";

// Slim top bar + the "thread": a rail on the left that links every section
// of the page and fills in as you scroll, so the page reads as one journey.

import { motion, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

export const sections = [
  { id: "top", label: "Intro" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "toolkit", label: "Toolkit" },
  { id: "contact", label: "Contact" },
];

export default function Nav({ name, resume }: { name: string; resume: string }) {
  const [active, setActive] = useState("top");
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <>
      <header className={`topbar ${scrolled ? "scrolled" : ""}`}>
        <div className="container topbar-inner">
          <a href="#top" className="brand">
            <span className="brand-dot" aria-hidden="true" />
            <span className="serif">{name}</span>
          </a>
          <nav aria-label="Sections" className="topnav">
            {sections.slice(1).map((s) => (
              <a key={s.id} href={`#${s.id}`} className={active === s.id ? "on" : ""}>
                {s.label}
                {active === s.id && <motion.span layoutId="topnav-pill" className="topnav-pill" />}
              </a>
            ))}
          </nav>
          <div className="topbar-right">
            <a className="btn btn-solid pill sm" href={resume} target="_blank" rel="noopener noreferrer">
              Résumé
            </a>
            <ThemeToggle className="theme-toggle inline" />
          </div>
        </div>
        <motion.div className="topbar-progress" style={{ scaleX: progress }} aria-hidden="true" />
      </header>

      <nav className="thread" aria-label="Page progress">
        <div className="thread-line" aria-hidden="true">
          <motion.div className="thread-fill" style={{ scaleY: progress }} />
        </div>
        <ol>
          {sections.map((s, i) => {
            const idx = sections.findIndex((x) => x.id === active);
            const state = i < idx ? "done" : i === idx ? "on" : "";
            return (
              <li key={s.id} className={state}>
                <a href={`#${s.id}`} aria-current={state === "on" ? "true" : undefined}>
                  <span className="node" aria-hidden="true" />
                  <span className="thread-label">
                    <small>{String(i).padStart(2, "0")}</small> {s.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
