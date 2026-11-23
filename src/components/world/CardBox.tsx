"use client";

// Personal projects as cards standing in an open box.
// Hover lifts a card; picking one pulls it out and shows its details.

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Project } from "@/data/projects";

const looks: Record<string, { bg: string; big: string; small: string }> = {
  pulsevo: { bg: "linear-gradient(160deg, #2f8a61, #164d36)", big: "8 AI", small: "analyses on one dashboard" },
  hirevolts: { bg: "linear-gradient(160deg, #3557c2, #1b2f72)", big: "1 upload", small: "resume → candidate profile" },
  password: { bg: "linear-gradient(160deg, #c2622f, #7d3512)", big: "5 clicks", small: "a password you can see" },
  jsonflow: { bg: "linear-gradient(160deg, #6a5bc0, #382d7a)", big: "JSON → graph", small: "in a single paste" },
};

export default function CardBox({ projects }: { projects: Project[] }) {
  const [picked, setPicked] = useState(0);
  const p = projects[picked];

  return (
    <div className="cardbox">
      <div className="box-scene">
        <div className="box">
          <div className="box-back" aria-hidden="true" />
          <div className="box-cards">
            {projects.map((proj, i) => {
              const look = looks[proj.slug];
              const isPicked = i === picked;
              return (
                <motion.button
                  key={proj.slug}
                  className={`pcard ${isPicked ? "picked" : ""}`}
                  style={{ background: look.bg, zIndex: isPicked ? 5 : 4 - Math.abs(i - picked) }}
                  animate={{ y: isPicked ? -70 : 0, rotate: isPicked ? 0 : (i - (projects.length - 1) / 2) * 4 }}
                  whileHover={{ y: isPicked ? -78 : -26 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  onClick={() => setPicked(i)}
                  aria-pressed={isPicked}
                  aria-label={`${proj.title}: ${look.big} ${look.small}`}
                >
                  <span className="pcard-num">0{i + 1}</span>
                  <span className="pcard-title">{proj.title}</span>
                  <span className="pcard-big">{look.big}</span>
                  <span className="pcard-small">{look.small}</span>
                </motion.button>
              );
            })}
          </div>
          <div className="box-front" aria-hidden="true">
            <span>Things I built</span>
          </div>
        </div>
      </div>

      <div className="pick-tabs" role="tablist" aria-label="Projects">
        {projects.map((proj, i) => (
          <button key={proj.slug} role="tab" aria-selected={i === picked} className={i === picked ? "on" : ""} onClick={() => setPicked(i)}>
            <span className="num">0{i + 1}</span>
            <span className="name">{proj.title}</span>
            <span className="meta">{proj.tag}</span>
            {i === picked && <motion.span layoutId="pick-line" className="pick-line" />}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={p.slug} className="pick-detail" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
          <div>
            <p className="kicker">{p.tag} · {p.status}</p>
            <h3>{p.title}</h3>
            <p className="pick-summary">{p.summary}</p>
            <div className="pill-row">
              {p.stack.split(" · ").map((s) => (
                <span key={s} className="pill">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="pick-actions">
            <Link href={`/projects/${p.slug}`} className="w-btn dark">
              Read the case study →
            </Link>
            {p.live && (
              <a href={p.live} target="_blank" rel="noreferrer" className="w-btn">
                Live demo ↗
              </a>
            )}
            <a href={p.code} target="_blank" rel="noreferrer" className="w-btn">
              Code ↗
            </a>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
