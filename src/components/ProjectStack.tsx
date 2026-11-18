"use client";

// Personal projects as stacking cards: each card pins near the top and the
// next one slides over it, while the one underneath gently shrinks.

import Link from "next/link";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import Cover from "./Cover";
import type { Project } from "@/data/projects";

export default function ProjectStack({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <div ref={ref} className="stack">
      {projects.map((p, i) => (
        <StackCard key={p.slug} p={p} i={i} total={projects.length} progress={scrollYProgress} />
      ))}
    </div>
  );
}

function StackCard({ p, i, total, progress }: { p: Project; i: number; total: number; progress: MotionValue<number> }) {
  // Cards further back shrink a little more as you scroll past them
  const start = i / total;
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - i - 1) * 0.04]);

  return (
    <div className="stack-slot" style={{ top: `calc(96px + ${i * 18}px)` }}>
      <motion.article className="stack-card" style={{ scale }}>
        <div className="stack-text">
          <p className="mono-label">
            {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} · {p.tag}
          </p>
          <h3 className="serif">{p.title}</h3>
          <p className="stack-summary">{p.summary}</p>
          <div className="chips">
            {p.stack.split(" · ").map((s) => (
              <span key={s} className="chip">
                {s}
              </span>
            ))}
          </div>
          <div className="actions">
            <Link href={`/projects/${p.slug}`} className="btn btn-solid pill">
              Read case study →
            </Link>
            {p.live && (
              <a className="btn btn-ghost pill" href={p.live} target="_blank" rel="noreferrer">
                Live demo ↗
              </a>
            )}
          </div>
        </div>
        <Link href={`/projects/${p.slug}`} className="stack-cover" aria-label={`Open ${p.title} case study`}>
          <Cover kind={p.slug} image={p.image} />
        </Link>
      </motion.article>
    </div>
  );
}
