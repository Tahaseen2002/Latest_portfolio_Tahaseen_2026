"use client";

// Selected work, modelled on the reference (public/select.webm).
// A long kraft box seen from its front corner. When it scrolls into view the
// lid swings up and the project cards, standing like dividers inside, rise
// one after another. Hover a card (or its tab) to lift it and flip it to
// "the numbers"; click to open the case study.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";

type Look = {
  from: string;
  to: string;
  mark: string;
  big: string;
  line: string;
  sub: string;
  stats: { v: string; l: string }[];
};

// Every number here comes from the project's case study.
const looks: Record<string, Look> = {
  pulsevo: {
    from: "#3ccf91", to: "#0f6a45", mark: "P", big: "8 AI", line: "analyses, one dashboard", sub: "Hackathon · Gemini / OpenAI",
    stats: [{ v: "8", l: "AI analyses from one task sheet" }, { v: "2", l: "model providers, switchable" }],
  },
  hirevolts: {
    from: "#4a8df5", to: "#1c3a9a", mark: "H", big: "1 upload", line: "resume to candidate", sub: "Full stack · Recruitment",
    stats: [{ v: "130+", l: "skill terms matched in resumes" }, { v: "1", l: "upload to a full candidate profile" }],
  },
  password: {
    from: "#ff6b4a", to: "#c0261b", mark: "G", big: "5 clicks", line: "a password you can see", sub: "Security · IEEE research",
    stats: [{ v: "5", l: "click points on one image" }, { v: "5%", l: "tolerance radius at login" }],
  },
  jsonflow: {
    from: "#b36cf2", to: "#4f46e5", mark: "J", big: "1 paste", line: "JSON in, graph out", sub: "Developer tool · React Flow",
    stats: [{ v: "1", l: "paste to an interactive graph" }, { v: "0", l: "overlapping nodes in the layout" }],
  },
};

// box geometry (px, before the 3D tilt)
const L = 640; // length
const D = 170; // depth (front to back)
const H = 66; // wall height
const SCENE_W = 900;
const SCENE_H = 560;

export default function CardBox({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const fitRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -30% 0px" });
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setOpen(true), 200);
    return () => clearTimeout(t);
  }, [inView]);

  // scale the whole scene down on narrow screens
  useEffect(() => {
    const el = fitRef.current;
    if (!el) return;
    const fit = () => setScale(Math.min(1, el.clientWidth / (SCENE_W - 120)));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const n = projects.length;
  const go = (slug: string) => router.push(`/projects/${slug}`);

  return (
    <div className="cbx" ref={ref}>
      <div className="cbx-fit" ref={fitRef} style={{ height: SCENE_H * scale }}>
        <div className="cbx-scene" style={{ width: SCENE_W, height: SCENE_H, transform: `translateX(-50%) scale(${scale})` }}>
          <div className={`cbx-box ${open ? "open" : ""} ${hover !== null ? "has-hover" : ""}`} style={{ width: L, height: D, marginLeft: -L / 2, ["--h" as string]: `${H}px` }}>
            <div className="cbx-shadow" />
            <div className="cbx-floor" />
            <div className="cbx-wall back" style={{ width: L }} />
            <div className="cbx-wall left" style={{ height: D }} />
            <div className="cbx-wall right" style={{ height: D }} />

            {projects.map((p, i) => {
              const look = looks[p.slug];
              const x = 80 + (i * (L - 170)) / Math.max(1, n - 1);
              return (
                <div key={p.slug} className="cbx-slot" style={{ left: x, top: D / 2, ["--d" as string]: `${0.75 + i * 0.13}s` }}>
                  <button
                    className={`cbx-card ${hover === i ? "lifted" : ""}`}
                    style={{ ["--from" as string]: look.from, ["--to" as string]: look.to }}
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(i)}
                    onBlur={() => setHover(null)}
                    onClick={() => go(p.slug)}
                    data-cursor="View"
                    aria-label={`${p.title}: ${look.big}, ${look.line}. Open case study`}
                  >
                    <span className="face front">
                      <span className="mark">{look.mark}</span>
                      <span className="num">0{i + 1}</span>
                      <span className="name">{p.title}</span>
                      <b className="big">{look.big}</b>
                      <small>{look.line}</small>
                    </span>
                    <span className="face back" aria-hidden>
                      <span className="num">0{i + 1}</span>
                      <span className="kick">The numbers</span>
                      {look.stats.map((s) => (
                        <span key={s.l} className="stat">
                          <b>{s.v}</b>
                          <small>{s.l}</small>
                        </span>
                      ))}
                    </span>
                  </button>
                </div>
              );
            })}

            <div className="cbx-wall front" style={{ width: L, top: D }}>
              <span>Things I built</span>
            </div>
            <div className="cbx-lid" style={{ width: L, height: D }} />
          </div>
        </div>
      </div>

      <div className="cbx-tabs" role="list">
        {projects.map((p, i) => {
          const look = looks[p.slug];
          return (
            <Link
              key={p.slug}
              role="listitem"
              href={`/projects/${p.slug}`}
              className={`${hover === i ? "on" : ""} ${hover !== null && hover !== i ? "dim" : ""}`}
              style={{ ["--c" as string]: look.to }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              data-cursor="View"
            >
              <span className="num">0{i + 1}</span>
              <span className="name">{p.title}</span>
              <span className="meta">{look.sub}</span>
              {hover === i && <motion.span layoutId="cbx-line" className="line" />}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
