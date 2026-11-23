"use client";

// The full explanation for one place on the map. It grows out of the story card
// (shared layout animation) and fills the screen, like a case-study page.

import Link from "next/link";
import { motion } from "motion/react";
import { useEffect } from "react";
import type { Pin } from "@/data/world";
import { education, experience } from "@/data/profile";
import { projects } from "@/data/projects";

const company: Record<string, string> = { j2w: "J2W", codinglimits: "CodingLimits", fms: "FMS Solutions" };

export default function PlacePage({ pin, index, total, onClose, onNext, nextTitle }: { pin: Pin; index: number; total: number; onClose: () => void; onNext: () => void; nextTitle: string }) {
  const job = experience.find((j) => j.company === company[pin.id]);

  // Lock page scroll while the explanation is open; start it at the top
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, []);

  return (
    <motion.div className="place-page" layoutId={`place-${pin.id}`} style={{ borderRadius: 0 }} transition={{ type: "spring", stiffness: 210, damping: 30 }} role="dialog" aria-modal="true" aria-label={pin.title}>
      <motion.div key={pin.id} className="place-scroll" data-lenis-prevent initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.25, duration: 0.35 } }} exit={{ opacity: 0, transition: { duration: 0.12 } }}>
        <header className="place-bar">
          <button className="place-back" onClick={onClose} aria-label="Back to the map" data-cursor="Back">
            ←
          </button>
          <span className="place-chip">
            <span className="place-chip-dot" style={{ background: pin.color }} />
            {pin.title}
          </span>
        </header>

        <section className="place-hero">
          <p className="kicker" style={{ color: pin.color }}>
            Stop {index + 1} of {total} · {job?.period ?? pin.year}
          </p>
          <h1>{pin.title}</h1>
          <p className="place-role">{job?.role ?? pin.role}</p>
          <p className="place-headline">{pin.headline}</p>
          <div className="place-metrics">
            {pin.metrics.map((m) => (
              <div key={m.label}>
                <b>{m.value}</b>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="place-body">
          {(job ? [job.intro] : pin.story).map((p) => (
            <p key={p} className="place-lead">
              {p}
            </p>
          ))}

          {/* J2W: each project as its own block */}
          {job?.engagements?.map((e, i) => (
            <motion.article key={e.name} className="place-block" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <div className="place-block-head">
                <h2>{e.name}</h2>
                <span className={`badge ${e.status === "Current" ? "live" : ""}`}>{e.status}</span>
              </div>
              <p>{e.summary}</p>
              <ul className="place-points">
                {e.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            </motion.article>
          ))}

          {/* Other jobs: what I built there */}
          {job && job.highlights.length > 0 && (
            <article className="place-block">
              <h2>What I built there</h2>
              <ul className="place-points">
                {job.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </article>
          )}

          {job && (
            <div className="place-stack">
              <p className="kicker">Tools I used</p>
              <div className="pill-row">
                {job.stack.map((s) => (
                  <span key={s} className="pill">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Me: photo + milestones */}
          {pin.milestones && (
            <article className="place-block">
              <div className="place-me">
                {pin.photo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={pin.photo} alt="Photo of Tahaseen" />
                )}
                <h2>Milestones</h2>
              </div>
              <ol className="place-miles">
                {pin.milestones.map((m) => (
                  <li key={m.text}>
                    <b>{m.year}</b>
                    <span>{m.text}</span>
                  </li>
                ))}
              </ol>
            </article>
          )}

          {/* College */}
          {pin.id === "college" && (
            <article className="place-block">
              <h2>{education.degree}</h2>
              <p>
                {education.school} · {education.period} · GPA {education.gpa}
              </p>
              <ul className="place-points">
                <li>Two years of pre-university (11th &amp; 12th), then a four-year B.Tech in Computer Science &amp; Engineering.</li>
                <li>Graduated with a GPA of 8.5.</li>
                <li>Joined FMS Solutions through campus placement.</li>
              </ul>
            </article>
          )}

          {/* Side projects */}
          {pin.id === "lab" && (
            <div className="place-projects">
              {projects.map((p) => (
                <Link key={p.slug} href={`/projects/${p.slug}`} className="place-project" data-cursor="View">
                  <span className="kicker">{p.tag}</span>
                  <b>{p.title}</b>
                  <span>{p.summary}</span>
                  <em>Read the case study →</em>
                </Link>
              ))}
            </div>
          )}

          <div className="place-end">
            <button className="w-btn" onClick={onClose} data-cursor="Back">
              ← Back to the map
            </button>
            <button className="w-btn dark" onClick={onNext} data-cursor="Next">
              Next stop: {nextTitle} →
            </button>
          </div>
        </section>
      </motion.div>
    </motion.div>
  );
}
