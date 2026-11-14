"use client";

// Temporary preview widget for comparing design options.
// Remove it (and designs.css) once a design is chosen.

import { useEffect, useState } from "react";

const options = [
  { id: "editorial", label: "A · Editorial" },
  { id: "midnight", label: "B · Midnight AI" },
  { id: "swiss", label: "C · Swiss Minimal" },
  { id: "bento", label: "D · Bento" },
];

export default function DesignSwitcher() {
  const [current, setCurrent] = useState("editorial");

  useEffect(() => {
    setCurrent(document.documentElement.dataset.design || "editorial");
  }, []);

  const pick = (id: string) => {
    document.documentElement.dataset.design = id;
    try {
      localStorage.setItem("design", id);
    } catch {}
    const url = new URL(window.location.href);
    url.searchParams.set("design", id);
    window.history.replaceState(null, "", url);
    setCurrent(id);
  };

  return (
    <div className="design-switcher" role="group" aria-label="Design options">
      <span className="ds-label">Design</span>
      {options.map((o) => (
        <button key={o.id} className={current === o.id ? "on" : ""} onClick={() => pick(o.id)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
