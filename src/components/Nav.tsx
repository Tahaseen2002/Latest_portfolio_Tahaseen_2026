"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "./Icons";

const links = [
  { id: "work", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "toolkit", label: "Toolkit" },
  { id: "contact", label: "Contact" },
];

export default function Nav({ name }: { name: string }) {
  const [compact, setCompact] = useState(false);
  const [active, setActive] = useState("");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    setDark(
      root.dataset.theme
        ? root.dataset.theme === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches,
    );

    const onScroll = () => setCompact(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    links.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  const toggleTheme = () => {
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setDark(!dark);
  };

  return (
    <header className={`masthead ${compact ? "compact" : ""}`}>
      <div className="container">
        <div className="masthead-inner">
          <p className="kicker">The Portfolio of</p>
          <a href="#top" className="title serif">
            {name}
          </a>
          <nav aria-label="Sections">
            {links.map((l) => (
              <a key={l.id} href={`#${l.id}`} className={active === l.id ? "active" : ""}>
                {l.label}
              </a>
            ))}
          </nav>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle color theme">
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>
    </header>
  );
}
