"use client";

// Experience as interactive tabs: pick a company, its story slides in.
// Projects inside a role open like an accordion.

import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import type { Job } from "@/data/profile";

export default function ExperienceTabs({ jobs }: { jobs: Job[] }) {
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState<string | null>(jobs[0]?.engagements?.[0]?.name ?? null);
  const uid = useId();
  const job = jobs[tab];

  return (
    <div className="xp">
      <div className="xp-tabs" role="tablist" aria-label="Companies">
        {jobs.map((j, i) => (
          <button
            key={j.company}
            role="tab"
            id={`${uid}-tab-${i}`}
            aria-selected={tab === i}
            aria-controls={`${uid}-panel`}
            className={tab === i ? "on" : ""}
            onClick={() => {
              setTab(i);
              setOpen(j.engagements?.[0]?.name ?? null);
            }}
          >
            {tab === i && <motion.span layoutId="xp-indicator" className="xp-indicator" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
            <span className="xp-company">{j.company}</span>
            <span className="xp-when">{j.period}</span>
            {i === 0 && <span className="xp-now">Now</span>}
          </button>
        ))}
      </div>

      <div className="xp-panel" role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-tab-${tab}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={job.company}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mono-label">{job.period}</p>
            <h3 className="xp-role">
              {job.role} <span className="accent">@ {job.company}</span>
            </h3>
            <p className="xp-intro">{job.intro}</p>

            {job.engagements?.length ? (
              <div className="xp-work">
                {job.engagements.map((e) => {
                  const isOpen = open === e.name;
                  return (
                    <div key={e.name} className={`xp-item ${isOpen ? "open" : ""}`}>
                      <button className="xp-item-head" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : e.name)}>
                        <span className="serif xp-item-title">{e.name}</span>
                        <span className={`badge ${e.status === "Current" ? "live" : ""}`}>{e.status}</span>
                        <motion.span className="xp-chevron" animate={{ rotate: isOpen ? 45 : 0 }} aria-hidden="true">
                          +
                        </motion.span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            className="xp-item-body"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <p>{e.summary}</p>
                            <ul className="points">
                              {e.points.map((p) => (
                                <li key={p}>{p}</li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            ) : null}

            {job.highlights.length > 0 && (
              <ul className="points xp-points">
                {job.highlights.map((h, i) => (
                  <motion.li key={h} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i + 0.1 }}>
                    {h}
                  </motion.li>
                ))}
              </ul>
            )}

            <div className="chips">
              {job.stack.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
