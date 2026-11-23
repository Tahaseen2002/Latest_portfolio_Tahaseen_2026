"use client";

// The explorable world, in the style of the reference video:
// - the painting is a real 3D scene (three.js, see WorldGL) with the intro text over it,
// - flying birds, glowing place labels, a custom "Open" cursor,
// - click a place: the camera flies smoothly in to that building and a story card slides in,
// - "View full story" grows the card into a full explanation page,
// - "scroll to fly in": text and labels drift away, then the paper tears up over it.

import { AnimatePresence, LayoutGroup, motion, useScroll, useTransform } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import PlacePage from "./PlacePage";
import MeCard from "./MeCard";
import WorldGL, { type Anchor } from "./WorldGL";
import { hero, pins, scene, signpost, type Pin } from "@/data/world";

const EASE = [0.22, 1, 0.36, 1] as const;
const IMAGE_ASPECT = 2400 / 1340;

// Birds: height (% of image), size (px), seconds to cross, start offset, direction
const birdList = [
  { top: 9, size: 34, dur: 26, delay: -4, dir: 1 },
  { top: 13, size: 24, dur: 30, delay: -14, dir: 1 },
  { top: 6, size: 20, dur: 34, delay: -22, dir: 1 },
  { top: 18, size: 28, dur: 28, delay: -9, dir: -1 },
  { top: 22, size: 18, dur: 38, delay: -27, dir: -1 },
];

export default function WorldHero({ name, avatar }: { name: string; avatar: string }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [phone, setPhone] = useState(false);
  const open = pins.find((p) => p.id === openId) ?? null;
  const openIndex = open ? pins.indexOf(open) : -1;
  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(max-width: 760px)");
    const on = () => setPhone(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // Overlays that the 3D scene keeps glued to the painting
  const anchors = useRef(new Map<string, Anchor>());
  const birdEls = useRef<{ el: HTMLElement; top: number; dur: number; delay: number; dir: number; size: number }[]>([]);
  const anchorRef = useCallback(
    (key: string, x: number, y: number, scale = false) => (el: HTMLElement | null) => {
      if (el) anchors.current.set(key, { el, x, y, scale });
      else anchors.current.delete(key);
    },
    [],
  );

  // Scroll: text & labels leave first, then the camera "flies in"
  const [vh, setVh] = useState(900);
  useEffect(() => setVh(window.innerHeight), []);
  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, vh * 0.45], [0, -90]);
  const textOpacity = useTransform(scrollY, [0, vh * 0.35], [1, 0]);
  const labelsOpacity = useTransform(scrollY, [0, vh * 0.3], [1, 0]);
  const flyIn = useTransform(scrollY, [0, vh * 1.4], [0, 1], { clamp: true });
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => scrollY.on("change", (v) => setScrolled(v > vh * 0.3)), [scrollY, vh]);
  useEffect(() => {
    if (scrolled && !expanded) setOpenId(null);
  }, [scrolled, expanded]);

  const openPin = (id: string | null) => setOpenId(id);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (expanded) setExpanded(false);
      else setOpenId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  const first = name.split(" ").pop();
  const next = open ? pins[(openIndex + 1) % pins.length] : null;

  return (
    <LayoutGroup>
      <section id="top" className={`world world--art ${open ? "is-focused" : ""}`} aria-label="Introduction">
        <h2 className="sr-only">{scene.alt}</h2>
        <WorldGL day={scene.image} night={scene.imageNight} aspect={IMAGE_ASPECT} focus={open ? { x: open.x, y: open.y + 6, side: open.x < 35 ? "right" : "left" } : null} anchors={anchors} birds={birdEls} scrollZoom={flyIn} phone={phone} />

        {/* overlays glued to the painting */}
        <div className="world-overlay">
          <div className="birds" aria-hidden="true">
            {birdList.map((b, i) => (
              <span
                key={i}
                className="gbird-anchor"
                ref={(el) => {
                  if (el) birdEls.current[i] = { el, ...b };
                }}
              >
                <span className={`gbird ${b.dir < 0 ? "rtl" : ""}`} style={{ width: b.size }}>
                  <span className="bird-bob" style={{ animationDelay: `${b.delay / 3}s` }}>
                    <svg viewBox="0 0 40 20">
                      <path className="wing" style={{ animationDelay: `${(i * 0.13) % 0.5}s` }} d="M20 11 Q 13 2 2 6" />
                      <path className="wing" style={{ animationDelay: `${(i * 0.13) % 0.5}s` }} d="M20 11 Q 27 2 38 6" />
                    </svg>
                  </span>
                </span>
              </span>
            ))}
          </div>

          {/* Handwritten signpost on the blank wooden sign */}
          <div className="anchor" ref={anchorRef("signpost", signpost.x, signpost.y, true)}>
            <motion.a className="signpost-text hand" href={signpost.href} data-cursor="Go" style={{ opacity: labelsOpacity }} initial={{ rotate: -4 }} whileHover={{ scale: 1.06, rotate: -2 }}>
              {signpost.label.split(" ").slice(0, 1)}
              <br />
              {signpost.label.split(" ").slice(1).join(" ")} →
            </motion.a>
          </div>

          {/* Place labels */}
          <motion.div className="pins-layer" style={{ opacity: labelsOpacity }}>
            {pins.map((p, i) => (
              <div key={p.id} className="anchor" ref={anchorRef(`pin-${p.id}`, p.x, p.y)}>
                <PinButton pin={p} index={i} active={openId === p.id} dimmed={!!openId && openId !== p.id} disabled={scrolled} onOpen={() => openPin(openId === p.id ? null : p.id)} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Intro text */}
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
                      <motion.span key={pi} className={part.strike ? "strike" : undefined} initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + (li * 2 + pi) * 0.09, duration: 0.7, ease: EASE }}>
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
          {open && !expanded && (
            <motion.aside
              key={open.id}
              layoutId={`place-${open.id}`}
              className={`story ${open.x < 35 ? "on-right" : ""} ${open.milestones ? "is-me" : ""}`}
              data-lenis-prevent
              role="dialog"
              aria-label={open.title}
              style={{ borderRadius: 28 }}
              initial={{ opacity: 0, x: -40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -30, scale: 0.97 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.08 }}
            >
              <button className="story-close" onClick={() => setOpenId(null)} aria-label="Close" data-cursor="Close">
                ×
              </button>
              {open.id === "me" ? (
                <MeCard />
              ) : (
                <>
              {open.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="story-photo" src={open.photo} alt={`Photo of ${name}`} />
              ) : (
                <p className="story-badge" style={{ background: open.color }}>
                  {open.initial}
                </p>
              )}
              <h2>{open.title}</h2>
              <p className="story-role">{open.role}</p>
              <p className="story-headline">{open.headline}</p>
              {!open.milestones && open.story.map((s) => (
                <p key={s} className="story-text">
                  {s}
                </p>
              ))}
              <div className="story-metrics">
                {open.metrics.map((m, i) => (
                  <motion.div key={m.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.07 }}>
                    <b>{m.value}</b>
                    <span>{m.label}</span>
                  </motion.div>
                ))}
              </div>
              {open.milestones && (
                <ol className="story-miles">
                  {open.milestones.map((m, i) => (
                    <motion.li key={m.text} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.07 }}>
                      <b>{m.year}</b>
                      <span>{m.text}</span>
                    </motion.li>
                  ))}
                </ol>
              )}
                </>
              )}
              {open.id !== "me" && (
                <button className="story-cta" onClick={() => setExpanded(true)} data-cursor="View">
                  View full story →
                </button>
              )}
              <nav className="story-nav" aria-label="Other places">
                {pins.map((p) => (
                  <button key={p.id} className={p.id === open.id ? "on" : ""} style={{ background: p.id === open.id ? p.color : undefined }} onClick={() => openPin(p.id)} aria-label={p.title} />
                ))}
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>
      </section>

      {/* Full explanation page, grown out of the card */}
      {mounted &&
        createPortal(
          <div className="w place-root">
          <AnimatePresence>
            {open && expanded && next && (
              <PlacePage
                key={`page-${open.id}`}
                pin={open}
                index={openIndex}
                total={pins.length}
                nextTitle={next.title}
                onClose={() => setExpanded(false)}
                onNext={() => openPin(next.id)}
              />
            )}
          </AnimatePresence>
          </div>,
          document.body,
        )}
    </LayoutGroup>
  );
}

function PinButton({ pin, index, active, dimmed, disabled, onOpen }: { pin: Pin; index: number; active: boolean; dimmed: boolean; disabled: boolean; onOpen: () => void }) {
  return (
    <motion.button
      className={`pin dark ${pin.x > 85 ? "edge-right" : ""} ${pin.photo ? "is-me" : ""} ${active ? "active" : ""}`}
      style={{ pointerEvents: disabled || dimmed ? "none" : undefined }}
      initial={{ opacity: 0, y: 14, scale: 0.8 }}
      animate={{ opacity: dimmed ? 0 : 1, y: 0, scale: 1 }}
      transition={{ delay: dimmed || active ? 0 : 1.2 + index * 0.1, type: "spring", stiffness: 260, damping: 20 }}
      onClick={onOpen}
      aria-expanded={active}
      aria-label={`${pin.title}, ${pin.year}`}
      tabIndex={disabled || dimmed ? -1 : 0}
      data-cursor={active ? "Close" : "Open"}
    >
      <span className="pin-label">
        {pin.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="pin-avatar" src={pin.photo} alt="" aria-hidden="true" />
        ) : (
          <span className="pin-initial" style={{ background: pin.color }}>
            {pin.initial}
          </span>
        )}
        {pin.label}
        {pin.year && <span className="pin-year">{pin.year}</span>}
      </span>
      <span className="pin-dot" aria-hidden="true">
        <span className="pin-ring" />
      </span>
    </motion.button>
  );
}
