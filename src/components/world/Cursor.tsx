"use client";

// A custom cursor for the world: a small dot that follows the mouse and grows
// into a labelled bubble ("Open", "View"…) over anything with data-cursor="…".
// Navy by day, warm yellow at night. Mouse/trackpad only; touch is untouched.

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 600, damping: 42, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 600, damping: 42, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as Element | null;
      const tagged = t?.closest?.("[data-cursor]");
      setLabel(tagged?.getAttribute("data-cursor") || null);
      // The dot lives in the world (hero) and over tagged things; elsewhere the normal cursor is used
      setVisible(!!t?.closest?.(".world, [data-cursor]"));
    };
    const onLeave = () => setVisible(false);
    // After a click the page under the cursor often changes (a card opens, a page grows): re-check
    const onClick = (e: MouseEvent) => {
      setLabel(null);
      requestAnimationFrame(() => {
        const t = document.elementFromPoint(e.clientX, e.clientY);
        setLabel(t?.closest?.("[data-cursor]")?.getAttribute("data-cursor") || null);
        setVisible(!!t?.closest?.(".world, [data-cursor]"));
      });
    };
    window.addEventListener("click", onClick, true);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("click", onClick, true);
      document.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div className="cursor" style={{ x: sx, y: sy }} aria-hidden="true" animate={{ opacity: visible ? 1 : 0 }} transition={{ duration: 0.15 }}>
      <motion.div className="cursor-blob" animate={label ? { width: 68, height: 68 } : { width: 12, height: 12 }} transition={{ type: "spring", stiffness: 420, damping: 30 }}>
        <AnimatePresence>
          {label && (
            <motion.span key={label} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ duration: 0.15 }}>
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
