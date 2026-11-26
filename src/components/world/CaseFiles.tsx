"use client";

// "On the job": one company ID badge per job, hanging from its lanyard.
// The badges sway; pick one (or its numbered tab) and it swings forward.
// Below it: who the work was for, the industries, the wins, and the
// projects as colourful cards that flip over to show the details.

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { caseFiles, type FileProject } from "@/data/caseFiles";
import { profile } from "@/data/profile";

export default function CaseFiles() {
  const [active, setActive] = useState(0);
  const [kick, setKick] = useState(0); // re-triggers the swing on every pick
  const file = caseFiles[active];

  const pick = (i: number) => {
    setActive(i);
    setKick((k) => k + 1);
  };

  return (
    <div className="lb">
      {/* the badges */}
      <div className="lb-rail" aria-hidden="true" />
      <div className="lb-badges" role="tablist" aria-label="Companies">
        {caseFiles.map((f, i) => {
          const on = i === active;
          return (
            <button
              key={f.id}
              role="tab"
              id={`lb-tab-${f.id}`}
              aria-selected={on}
              aria-controls="lb-detail"
              className={`lb-hang ${on ? "on" : ""}`}
              style={{ ["--c" as string]: f.color, ["--i" as string]: i }}
              onClick={() => pick(i)}
              data-cursor={on ? "Viewing" : "Pick"}
            >
              <motion.span
                className="lb-swing"
                key={on ? `on-${kick}` : "off"}
                initial={false}
                animate={on ? { rotate: [0, -10, 7, -4, 2, 0] } : { rotate: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                <span className="lb-strap" aria-hidden="true">
                  <span>{Array(6).fill(f.company).join("  ·  ")}</span>
                </span>
                <span className="lb-clip" aria-hidden="true" />
                <span className="lb-card">
                  <span className="lb-top">
                    <span className="lb-logo">
                      {f.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={f.logo} alt="" />
                      ) : (
                        f.company[0]
                      )}
                    </span>
                    <span className="lb-co">{f.company}</span>
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="lb-photo" src={profile.headshot} alt="" />
                  <span className="lb-name">{profile.name}</span>
                  <span className="lb-role">{f.role}</span>
                  <span className="lb-when">
                    {f.period} · {f.city}
                  </span>
                  <span className={`lb-stat ${f.badge.value.length > 5 ? "long" : ""}`}>
                    <b>{f.badge.value}</b>
                    <small>{f.badge.label}</small>
                  </span>
                  <span className="lb-bars" aria-hidden="true" />
                </span>
              </motion.span>
            </button>
          );
        })}
      </div>

      {/* numbered tabs, like the project box */}
      <div className="lb-tabs">
        {caseFiles.map((f, i) => (
          <button key={f.id} className={i === active ? "on" : ""} style={{ ["--c" as string]: f.color }} onClick={() => pick(i)} data-cursor="Pick">
            <span className="num">0{i + 1}</span>
            <span className="name">{f.company}</span>
            <span className="meta">{f.industries.join(" · ")}</span>
            {i === active && <motion.span layoutId="lb-line" className="line" />}
          </button>
        ))}
      </div>

      {/* what I did there */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={file.id}
          id="lb-detail"
          role="tabpanel"
          aria-labelledby={`lb-tab-${file.id}`}
          className="lb-detail"
          style={{ ["--c" as string]: file.color }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12, transition: { duration: 0.15 } }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* the projects, pegged to a clothesline */}
          <div className="lb-line" style={{ ["--n" as string]: file.projects.length }}>
            <svg className="lb-string" viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true">
              <path d={`M0 4 Q500 ${SAG * 2 + 4} 1000 4`} />
            </svg>
            <span className="lb-hint" aria-hidden="true">
              tap a card to flip it ↷
            </span>
            <div className="lb-cards">
              {file.projects.map((p, i) => (
                <ProjectCard key={p.name} p={p} i={i} n={file.projects.length} />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// how far the string sags in the middle (px) and where each card hangs on it
const SAG = 34;
const CARD_STEP = 244; // card width + gap
const LINE_W = 1000;
function dropAt(i: number, n: number) {
  const f = 0.5 + ((i - (n - 1) / 2) * CARD_STEP) / LINE_W; // 0..1 across the line
  return SAG * (1 - Math.pow(2 * (f - 0.5), 2));
}

function ProjectCard({ p, i, n }: { p: FileProject; i: number; n: number }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <motion.div
      className={`lb-pcard ${flipped ? "flipped" : ""}`}
      style={{ ["--from" as string]: p.from, ["--to" as string]: p.to, ["--drop" as string]: `${dropAt(i, n)}px`, ["--k" as string]: i }}
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + i * 0.08, type: "spring", stiffness: 200, damping: 22 }}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a")) return;
        setFlipped((f) => !f);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setFlipped((f) => !f);
        }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={`${p.name}, for ${p.client}. ${flipped ? "Showing details" : "Show details"}`}
      data-cursor={flipped ? "Back" : "Flip"}
    >
      <span className="lb-peg" aria-hidden="true" />
      <div className="lb-inner">
        <div className="lb-face front">
          <span className={`lb-status s-${p.status.replace(/\s/g, "").toLowerCase()}`}>{p.status}</span>
          <span className="lb-num">0{i + 1}</span>
          <b className="lb-big">{p.big}</b>
          <span className="lb-pname">{p.name}</span>
          <span className="lb-client">for {p.client}</span>
          <span className="lb-sum">{p.summary}</span>
        </div>
        <div className="lb-face back">
          <span className="lb-kick">What I did</span>
          <ul>
            {p.points.slice(0, 3).map((pt) => (
              <li key={pt}>{pt}</li>
            ))}
          </ul>
          {p.link && (
            <a href={p.link.href} target="_blank" rel="noopener noreferrer" data-cursor="Visit" tabIndex={flipped ? 0 : -1}>
              {p.link.label} ↗
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
