"use client";

// Fades content up as it scrolls into view (once).
// `onLoad` animates immediately instead: use it for content above the fold.
import { motion } from "motion/react";

export default function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
  onLoad = false,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li";
  onLoad?: boolean;
}) {
  const Tag = motion[as];
  const shown = { opacity: 1, y: 0 };
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 24 }}
      {...(onLoad ? { animate: shown } : { whileInView: shown, viewport: { once: true, margin: "0px 0px -80px 0px" } })}
      transition={{ duration: 0.7, delay: delay / 1000, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}
