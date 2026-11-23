"use client";

// "How I got here": a paper sheet that slides up over the pinned hero.
// The story reveals word by word as you scroll, hand-drawn marks draw in
// as their words appear, and sticky notes on the side can be dragged.

import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, useState } from "react";
import { Mark } from "./Marks";

type MarkSpec = { kind: "highlight" | "circle" | "underline"; color: string };
type Seg = { text: string; marks?: MarkSpec[]; spark?: boolean; icon?: "code" | "gear" | "rocket" };

// The story. Wrap a phrase in `mark` to give it a hand-drawn mark.
// The story. `marks` are layered hand-drawn marks (first = innermost); `icon` adds a
// little doodle above-right of the phrase; `spark` adds the asterisk burst.
const story: Seg[] = [
  { text: "I started as a" },
  { text: "frontend developer,", marks: [{ kind: "highlight", color: "#93c5fd" }], icon: "code" },
  { text: "moved into" },
  { text: "backend,", marks: [{ kind: "highlight", color: "#fdba9b" }], icon: "gear" },
  { text: "then grew" },
  { text: "full stack.", marks: [{ kind: "circle", color: "#e5533d" }] },
  { text: "Now I build" },
  { text: "AI-powered", marks: [{ kind: "highlight", color: "#fde047" }, { kind: "underline", color: "#1b2233" }], spark: true },
  { text: "applications and" },
  { text: "deploy them myself.", marks: [{ kind: "highlight", color: "#d8c8ff" }, { kind: "underline", color: "#f0643f" }], icon: "rocket" },
];

export default function HowIGotHere({ companies }: { companies: { name: string; color: string; initial: string }[] }) {
  const textRef = useRef<HTMLDivElement>(null);
  const board = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: textRef, offset: ["start 0.85", "end 0.7"] });

  // Give every word its own slice of the scroll
  const words: { w: string; seg: number }[] = [];
  story.forEach((s, si) => s.text.split(" ").forEach((w) => words.push({ w, seg: si })));
  let k = 0;

  return (
    <section id="story" ref={board} className="story-sheet torn" aria-label="How I got here">
      <div className="story-grid">
        <div ref={textRef} className="story-copy">
          <p className="kicker">How I got here</p>
          <p className="story-big">
            {story.map((s, si) => {
              const segWords = s.text.split(" ");
              const nodes = segWords.map((w) => {
                const i = k++;
                return <Word key={i} progress={scrollYProgress} i={i} n={words.length} w={w} />;
              });
              const inner = (
                <>
                  {nodes.map((node, j) => (
                    <span key={j}>
                      {node}
                      {j < nodes.length - 1 ? " " : ""}
                    </span>
                  ))}
                </>
              );
              return (
                <span key={si}>
                  {(s.marks ?? []).reduce<React.ReactNode>(
                    (acc, m, mi) => (
                      <Mark kind={m.kind} color={m.color} delay={0.1 + mi * 0.35}>
                        {acc}
                      </Mark>
                    ),
                    inner,
                  )}
                  {s.icon && <Doodle kind={s.icon} />}
                  {s.spark && <Sparkle />}{" "}
                </span>
              );
            })}
          </p>
        </div>

        <aside className="story-notes">
          <p className="notes-hint hand">these notes move ;)</p>
          <Note progress={scrollYProgress} at={0.25} rotate={3} className="n-years" board={board}>
            <p className="hand">3+ years in the industry. Real products, real users.</p>
            <small>Full stack · AI</small>
          </Note>
          <Note progress={scrollYProgress} at={0.65} rotate={-2} className="n-worked" board={board}>
            <p className="hand">I&apos;ve worked with</p>
            <div className="worked-logos">
              {companies.map((c) => (
                <span key={c.name} className="worked-logo" style={{ background: c.color }} title={c.name}>
                  {c.initial}
                </span>
              ))}
            </div>
          </Note>
        </aside>
      </div>
    </section>
  );
}

function Word({ progress, i, n, w }: { progress: MotionValue<number>; i: number; n: number; w: string }) {
  const start = i / n;
  const end = Math.min(1, start + 1.5 / n);
  const opacity = useTransform(progress, [start, end], [0.16, 1]);
  return <motion.span style={{ opacity }}>{w}</motion.span>;
}

// A little scattered burst of thin-line asterisks above-right of a word (like the reference)
// positions and sizes are in em, so the burst scales with the text
const burst = [
  { x: 0.02, y: -1.02, size: 0.2, color: "#1b2233", delay: 0.15 }, // tiny navy, top-left
  { x: 0.4, y: -0.95, size: 0.26, color: "#3b82f6", delay: 0.28 }, // small blue, top-right
  { x: 0.1, y: -0.72, size: 0.4, color: "#f0643f", delay: 0.4 }, // bigger orange, lower
];

function Star({ size, color }: { size: string; color: string }) {
  const r = 10;
  const spokes = [0, 45, 90, 135];
  return (
    <svg width={size} height={size} viewBox="-12 -12 24 24" aria-hidden="true">
      {spokes.map((a) => {
        const t = (a * Math.PI) / 180;
        return <line key={a} x1={-r * Math.cos(t)} y1={-r * Math.sin(t)} x2={r * Math.cos(t)} y2={r * Math.sin(t)} stroke={color} strokeWidth="2.6" strokeLinecap="round" />;
      })}
    </svg>
  );
}

function Sparkle() {
  return (
    <span className="sparkle" aria-hidden="true">
      {burst.map((b, i) => (
        <motion.span
          key={i}
          className="spark"
          style={{ left: `${b.x}em`, top: `${b.y}em` }}
          initial={{ scale: 0, rotate: -60, opacity: 0 }}
          whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
          viewport={{ once: true, margin: "0px 0px -25% 0px" }}
          transition={{ delay: b.delay, type: "spring", stiffness: 320, damping: 14 }}
        >
          <span className="spark-twinkle" style={{ animationDelay: `${i * 0.7}s` }}>
            <Star size={`${b.size}em`} color={b.color} />
          </span>
        </motion.span>
      ))}
    </span>
  );
}

// A sticky note that slaps onto the board once the story reaches it
function Note({ progress, at, rotate, className, board, children }: { progress: MotionValue<number>; at: number; rotate: number; className: string; board: React.RefObject<HTMLElement | null>; children: React.ReactNode }) {
  const [shown, setShown] = useState(false);
  useMotionValueEvent(progress, "change", (v) => {
    if (v >= at && !shown) setShown(true);
  });
  return (
    <motion.div
      className={`sticky ${className}`}
      drag
      dragConstraints={board}
      dragElastic={0.2}
      whileDrag={{ scale: 1.06, rotate: 0, zIndex: 5 }}
      initial={{ opacity: 0, scale: 1.25, rotate: rotate * 3, y: -20 }}
      animate={shown ? { opacity: 1, scale: 1, rotate, y: 0 } : { opacity: 0, scale: 1.25, rotate: rotate * 3, y: -20 }}
      transition={{ type: "spring", stiffness: 320, damping: 18 }}
    >
      <span className="tape" aria-hidden="true" />
      {children}
    </motion.div>
  );
}

// Little hand-drawn doodles that draw themselves in (like the gear in the reference)
const doodles = {
  code: { color: "#2563eb", d: "M8 6 L2 12 L8 18 M16 6 L22 12 L16 18 M14 3 L10 21" },
  gear: { color: "#1b2233", d: "M12 8.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 1 0 0-7Z M12 2v3 M12 19v3 M2 12h3 M19 12h3 M4.9 4.9l2.1 2.1 M17 17l2.1 2.1 M4.9 19.1L7 17 M17 7l2.1-2.1" },
  rocket: { color: "#7c3aed", d: "M5 19c1-3 2-4 4-5 M14 4c3 0 6 3 6 6l-6 6-6-6 6-6Z M9 13l-3-1 3-3 M11 15l1 3 3-3 M15 9.5a1 1 0 1 0 0.01 0" },
} as const;

function Doodle({ kind }: { kind: keyof typeof doodles }) {
  const d = doodles[kind];
  return (
    <span className="doodle" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <motion.path
          d={d.d}
          stroke={d.color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "0px 0px -25% 0px" }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.65, 0, 0.35, 1] }}
        />
      </svg>
    </span>
  );
}
