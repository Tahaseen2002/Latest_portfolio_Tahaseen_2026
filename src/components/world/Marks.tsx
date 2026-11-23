"use client";

// Hand-drawn marks that draw themselves when they scroll into view:
// a highlighter swipe, a loose circle and a squiggly underline.

import { motion } from "motion/react";

type Kind = "highlight" | "circle" | "underline";

const paths: Record<Kind, string> = {
  highlight: "M2 30 C 40 24, 120 26, 198 22",
  circle: "M24 6 C 90 -4, 196 6, 196 30 C 196 56, 30 60, 8 36 C -4 22, 30 8, 70 6",
  underline: "M2 8 C 20 2, 30 14, 50 8 S 80 2, 100 8 S 130 14, 150 8 S 180 2, 198 8",
};

export function Mark({ kind = "highlight", color = "#fde047", children, delay = 0 }: { kind?: Kind; color?: string; children: React.ReactNode; delay?: number }) {
  const isHighlight = kind === "highlight";
  return (
    <span className={`mark mark-${kind}`}>
      <svg viewBox={kind === "underline" ? "0 0 200 16" : "0 0 200 60"} preserveAspectRatio="none" aria-hidden="true">
        <motion.path
          d={paths[kind]}
          fill="none"
          stroke={color}
          strokeWidth={isHighlight ? 40 : kind === "circle" ? 3 : 3.5}
          strokeLinecap="round"
          strokeOpacity={isHighlight ? 0.55 : 1}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: isHighlight ? 0.7 : 0.9, delay, ease: [0.65, 0, 0.35, 1] }}
        />
      </svg>
      <span className="mark-text">{children}</span>
    </span>
  );
}
