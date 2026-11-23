"use client";

// "How I got here": a paper sheet that slides up over the pinned hero.
// The story reveals word by word as you scroll, hand-drawn marks draw in
// as their words appear, and sticky notes on the side can be dragged.

import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, useState } from "react";
import { Mark } from "./Marks";

type Seg = { text: string; mark?: { kind: "highlight" | "circle" | "underline"; color: string }; spark?: boolean };

// The story. Wrap a phrase in `mark` to give it a hand-drawn mark.
const story: Seg[] = [
  { text: "I started at a" },
  { text: "government school", mark: { kind: "highlight", color: "#93c5fd" } },
  { text: "in Andhra Pradesh, always asking" },
  { text: "how things work.", mark: { kind: "circle", color: "#e5533d" } },
  { text: "At IIIT Nuzvid I learned how systems are built. Then I got way more curious about" },
  { text: "why people use them.", mark: { kind: "underline", color: "#1b2233" } },
  { text: "So I started building, and I've been turning messy workflows into" },
  { text: "AI-powered products", mark: { kind: "highlight", color: "#fde047" }, spark: true },
  { text: "ever since." },
];

export default function HowIGotHere({ companies }: { companies: { name: string; color: string; initial: string }[] }) {
  const textRef = useRef<HTMLDivElement>(null);
  const board = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: textRef, offset: ["start 0.8", "end 0.45"] });

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
                  {s.mark ? (
                    <Mark kind={s.mark.kind} color={s.mark.color} delay={0.1}>
                      {inner}
                    </Mark>
                  ) : (
                    inner
                  )}
                  {s.spark && <Sparkle />}{" "}
                </span>
              );
            })}
          </p>
        </div>

        <aside className="story-notes">
          <p className="notes-hint hand">these notes move ;)</p>
          <Note progress={scrollYProgress} at={0.12} rotate={-3} className="n-grad" board={board}>
            <p className="hand">IIIT Nuzvid grad btw. GPA 8.5 too.</p>
            <small>Class of 2023</small>
          </Note>
          <Note progress={scrollYProgress} at={0.45} rotate={3} className="n-years" board={board}>
            <p className="hand">3+ years in the industry. Real products, real users.</p>
            <small>Full stack · AI</small>
          </Note>
          <Note progress={scrollYProgress} at={0.78} rotate={-2} className="n-worked" board={board}>
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

function Sparkle() {
  return (
    <span className="sparkle" aria-hidden="true">
      {["#e5533d", "#2563eb", "#1b2233"].map((c, i) => (
        <motion.span
          key={c}
          style={{ color: c }}
          initial={{ scale: 0, rotate: -40 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true, margin: "0px 0px -30% 0px" }}
          transition={{ delay: 0.2 + i * 0.12, type: "spring", stiffness: 300, damping: 12 }}
        >
          ✳
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
