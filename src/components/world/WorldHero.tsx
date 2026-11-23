"use client";

// The explorable world, in the style of the reference video:
// - a full-bleed illustration with the intro text overlaid top-left,
// - small dark place labels on each landmark (click one to open its story),
// - "scroll to fly in": on scroll the text and labels drift up and fade,
//   the camera eases in a little, then the paper sheet tears up over it.

import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import DrawnScene from "./DrawnScene";
import { hero, pins, scene, signpost, type Pin } from "@/data/world";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function WorldHero({ name, avatar }: { name: string; avatar: string }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = pins.find((p) => p.id === openId) ?? null;
  const viewport = useRef<HTMLDivElement>(null);

  // Gentle parallax: the world drifts a little against the cursor
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(useTransform(mx, [-0.5, 0.5], [8, -8]), { stiffness: 60, damping: 20 });
  const py = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 60, damping: 20 });

  // Scroll: text & labels leave first, then the camera "flies in"
  const [vh, setVh] = useState(900);
  useEffect(() => setVh(window.innerHeight), []);
  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, vh * 0.45], [0, -90]);
  const textOpacity = useTransform(scrollY, [0, vh * 0.35], [1, 0]);
  const labelsOpacity = useTransform(scrollY, [0, vh * 0.3], [1, 0]);
  const flyIn = useTransform(scrollY, [0, vh * 1.4], [1, 1.1]);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => scrollY.on("change", (v) => setScrolled(v > vh * 0.3)), [scrollY, vh]);
  useEffect(() => {
    if (scrolled) setOpenId(null);
  }, [scrolled]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenId(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // On phones the world is wider than the screen: start centred
  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    // Only the swipeable layouts (≤1100px) scroll sideways; desktop crop is handled in CSS
    if (window.matchMedia("(max-width: 1100px)").matches && el.scrollWidth > el.clientWidth) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
    else el.scrollLeft = 0;
  }, []);

  const first = name.split(" ").pop();

  return (
    <section id="top" className={`world ${scene.image ? "world--art" : ""}`} aria-label="Introduction" style={scene.image ? ({ ["--world-img" as string]: `url(${scene.image})` } as React.CSSProperties) : undefined}>
      <motion.div
        ref={viewport}
        className="world-viewport"
        style={{ scale: flyIn }}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width - 0.5);
          my.set((e.clientY - r.top) / r.height - 0.5);
        }}
      >
        <motion.div
          className="world-stage"
          style={{ x: px, y: py, transformOrigin: open ? `${open.x}% ${open.y}%` : "50% 50%" }}
          animate={{ scale: open ? 1.12 : 1 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          {scene.image ? (
            <div className={`world-art ${scene.imageNight ? "has-night" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="art-day" src={scene.image} alt={scene.alt} />
              {scene.imageNight && (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="art-night" src={scene.imageNight} alt="" aria-hidden="true" />
              )}
            </div>
          ) : (
            <DrawnScene />
          )}

          {/* Handwritten signpost on the blank wooden sign */}
          {scene.image && (
            <motion.a className="signpost-text hand" href={signpost.href} style={{ left: `${signpost.x}%`, top: `${signpost.y}%`, opacity: labelsOpacity }} initial={{ rotate: -4 }} whileHover={{ scale: 1.06, rotate: -2 }}>
              {signpost.label.split(" ").slice(0, 1)}
              <br />
              {signpost.label.split(" ").slice(1).join(" ")} →
            </motion.a>
          )}

          {/* Place labels */}
          <motion.div className="pins-layer" style={{ opacity: labelsOpacity }}>
            {pins.map((p, i) => (
              <PinButton key={p.id} pin={p} index={i} active={openId === p.id} dimmed={!!openId && openId !== p.id} disabled={scrolled} onOpen={() => setOpenId(openId === p.id ? null : p.id)} />
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Intro text, top-left */}
      <AnimatePresence>
        {!open && (
          <motion.div className="hero-copy" style={{ y: textY, opacity: textOpacity }} exit={{ opacity: 0, y: -16, transition: { duration: 0.3 } }}>
            <motion.p className="hero-hey" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, ease: EASE }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={avatar} alt="" aria-hidden="true" />
              hey, I&apos;m {first}
            </motion.p>
            <h1 className="hero-title">
              {hero.lines.map((line, li) => (
                <span key={li} className="hero-line">
                  {line.map((part, pi) => (
                    <motion.span
                      key={pi}
                      className={part.strike ? "strike" : undefined}
                      initial={{ opacity: 0, y: 34 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 + (li * 2 + pi) * 0.09, duration: 0.7, ease: EASE }}
                    >
                      {part.text}
                      {part.strike && <motion.i className="strike-line" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.1, duration: 0.55, ease: [0.65, 0, 0.35, 1] }} aria-hidden="true" />}
                    </motion.span>
                  ))}
                </span>
              ))}
            </h1>
            <motion.p className="hero-sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
              {hero.sub}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hints */}
      <motion.div className="hero-hints" style={{ opacity: textOpacity }}>
        <motion.p className="hint-click hand" initial={{ opacity: 0 }} animate={{ opacity: open ? 0 : 1 }} transition={{ delay: open ? 0 : 1.9 }}>
          click a place ↗
        </motion.p>
        <motion.a href="#story" className="fly-chip" initial={{ opacity: 0, y: 10 }} animate={{ opacity: open ? 0 : 1, y: 0 }} transition={{ delay: open ? 0 : 1.6 }}>
          <span className="mouse" aria-hidden="true">
            <motion.i animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.4 }} />
          </span>
          scroll to fly in
        </motion.a>
      </motion.div>

      {/* Story card */}
      <AnimatePresence>
        {open && (
          <motion.aside
            key={open.id}
            className="story"
            role="dialog"
            aria-label={open.title}
            initial={{ opacity: 0, x: -40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.97 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <button className="story-close" onClick={() => setOpenId(null)} aria-label="Close">
              ×
            </button>
            <p className="story-badge" style={{ background: open.color }}>
              {open.initial}
            </p>
            <h2>{open.title}</h2>
            <p className="story-role">{open.role}</p>
            <p className="story-headline">{open.headline}</p>
            {open.story.map((s) => (
              <p key={s} className="story-text">
                {s}
              </p>
            ))}
            <div className="story-metrics">
              {open.metrics.map((m, i) => (
                <motion.div key={m.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.07 }}>
                  <b>{m.value}</b>
                  <span>{m.label}</span>
                </motion.div>
              ))}
            </div>
            {open.cta && (
              <a className="story-cta" href={open.cta.href} onClick={() => setOpenId(null)}>
                {open.cta.label} →
              </a>
            )}
            <nav className="story-nav" aria-label="Other places">
              {pins.map((p) => (
                <button key={p.id} className={p.id === open.id ? "on" : ""} style={{ background: p.id === open.id ? p.color : undefined }} onClick={() => setOpenId(p.id)} aria-label={p.title} />
              ))}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
    </section>
  );
}

function PinButton({ pin, index, active, dimmed, disabled, onOpen }: { pin: Pin; index: number; active: boolean; dimmed: boolean; disabled: boolean; onOpen: () => void }) {
  return (
    <motion.button
      className={`pin dark ${pin.x > 85 ? "edge-right" : ""} ${active ? "active" : ""}`}
      style={{ left: `${pin.x}%`, top: `${pin.y}%`, pointerEvents: disabled ? "none" : undefined }}
      initial={{ opacity: 0, y: 14, scale: 0.8 }}
      animate={{ opacity: dimmed ? 0.4 : 1, y: 0, scale: 1 }}
      transition={{ delay: 1.2 + index * 0.1, type: "spring", stiffness: 260, damping: 20 }}
      onClick={onOpen}
      aria-expanded={active}
      aria-label={`${pin.title}, ${pin.year}`}
      tabIndex={disabled ? -1 : 0}
    >
      <span className="pin-label">
        <span className="pin-initial" style={{ background: pin.color }}>
          {pin.initial}
        </span>
        {pin.label}
        <span className="pin-year">{pin.year}</span>
      </span>
      <span className="pin-dot" aria-hidden="true">
        <span className="pin-ring" />
      </span>
    </motion.button>
  );
}
