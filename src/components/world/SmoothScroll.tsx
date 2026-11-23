"use client";

// Smooth, eased "momentum" scrolling (Lenis), like the reference site.
// Off for visitors who prefer reduced motion. Elements with data-lenis-prevent
// (the full-page story) keep their own native scrolling.

import Lenis from "lenis";
import { useEffect } from "react";

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), anchors: { offset: 0 }, autoRaf: true });
    return () => lenis.destroy();
  }, []);
  return null;
}
