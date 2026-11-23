"use client";

// The journey, modelled on the reference:
//  1. overview: a round map that fades into the page, with the five cities,
//  2. the camera dives in and becomes a navigation view: it follows a glowing arrow
//     along the route, the map turns so you head "up", the compass turns with it,
//  3. it pauses at every city while a card tells that chapter,
//  4. at the end it pulls back out to show the whole loop.
//
// Smoothness: scrolling only sets a *target*; a requestAnimationFrame loop eases the
// camera toward it every frame (like the reference), so wheel steps never jump.
// The map is one static SVG moved with a CSS transform (no per-frame redraw);
// pins, labels and the arrow are light HTML overlays positioned each frame.

import { motion, useScroll } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { journey, type JourneyStop } from "@/data/world";

const X0 = -500;
const Y0 = -450;
const X1 = 2500;
const Y1 = 1850;
const DWELL = 1; // scroll "units" spent paused at a stop
const MOVE = 1.6; // units spent travelling between stops
const T0 = 0.14; // travel starts (fraction of the section)
const T1 = 0.86; // travel ends

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function routePath(stops: JourneyStop[]) {
  let d = `M ${stops[0].x} ${stops[0].y}`;
  for (let i = 1; i < stops.length; i++) {
    const a = stops[i - 1];
    const b = stops[i];
    // a soft S-curve between cities
    d += ` C ${a.x + (b.x - a.x) * 0.45} ${a.y + (b.y - a.y) * 0.05}, ${a.x + (b.x - a.x) * 0.55} ${a.y + (b.y - a.y) * 0.95}, ${b.x} ${b.y}`;
  }
  return d;
}
const ROUTE = routePath(journey);

function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
        part.startsWith("**") ? (
          <b key={i} className="jr-key">
            {part.slice(2, -2)}
          </b>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

// ---------- the procedural region map: dense cities, fields in between ----------
function RegionMap() {
  return useMemo(() => {
    const r = rng(11);
    const cell = 64;
    const blocks: React.ReactNode[] = [];
    const fields: React.ReactNode[] = [];
    for (let x = X0; x < X1; x += cell) {
      for (let y = Y0; y < Y1; y += cell) {
        const d = Math.min(...journey.map((s) => Math.hypot(x + cell / 2 - s.x, y + cell / 2 - s.y)));
        const density = Math.exp(-(d * d) / (2 * 260 * 260));
        if (r() < density * 1.1) {
          const n = 1 + Math.floor(r() * 3);
          for (let k = 0; k < n; k++) {
            const w = 12 + r() * 30;
            const h = 10 + r() * 26;
            blocks.push(<rect key={`${x}-${y}-${k}`} x={x + 8 + r() * (cell - 16 - w)} y={y + 8 + r() * (cell - 16 - h)} width={w} height={h} rx="2.5" className={r() < 0.22 ? "jm-block alt" : "jm-block"} />);
          }
        } else if (r() < 0.12) {
          fields.push(<rect key={`f${x}-${y}`} x={x + 6} y={y + 6} width={cell * (1 + Math.floor(r() * 2)) - 12} height={cell - 12} rx="6" className="jm-field" />);
        }
      }
    }
    // city street grids
    const grids = journey.map((s) => (
      <g key={s.id} className="jm-streets">
        {Array.from({ length: 11 }, (_, i) => {
          const o = (i - 5) * cell;
          return (
            <g key={i}>
              <line x1={s.x + o} y1={s.y - 340} x2={s.x + o} y2={s.y + 340} />
              <line x1={s.x - 340} y1={s.y + o} x2={s.x + 340} y2={s.y + o} />
            </g>
          );
        })}
      </g>
    ));
    const city = (id: string) => journey.find((s) => s.id === id)!;
    const [ap, nz, hy, ne, bl] = ["school", "college", "fms", "codinglimits", "j2w"].map(city);
    return (
      <svg className="jr-world-svg" viewBox={`${X0} ${Y0} ${X1 - X0} ${Y1 - Y0}`} width={X1 - X0} height={Y1 - Y0} aria-hidden="true">
        <rect x={X0} y={Y0} width={X1 - X0} height={Y1 - Y0} className="jm-ground" />
        <g>{fields}</g>
        {/* rivers (stylised) */}
        <path className="jm-river" d={`M ${X0} 520 C 300 560, 700 420, 1100 470 S 1600 560, ${X1} 380`} />
        <path className="jm-river thin" d={`M 900 ${Y0} C 1100 0, 1500 120, 1900 60 S 2300 160, ${X1} 120`} />
        <g className="jm-park">
          <ellipse cx="1000" cy="820" rx="160" ry="90" />
          <ellipse cx="560" cy="700" rx="120" ry="160" />
          <ellipse cx="1700" cy="700" rx="130" ry="80" />
          <ellipse cx="900" cy="1300" rx="170" ry="90" />
        </g>
        <g className="jm-lake">
          <ellipse cx="760" cy="230" rx="70" ry="40" />
          <ellipse cx="1520" cy="1180" rx="80" ry="44" />
        </g>
        <g>{blocks}</g>
        <g>{grids}</g>
        {/* highways between cities */}
        <g className="jm-highway">
          <path d={`M ${hy.x} ${hy.y} C ${hy.x + 300} ${hy.y + 40}, ${nz.x - 300} ${nz.y - 120}, ${nz.x} ${nz.y}`} />
          <path d={`M ${nz.x} ${nz.y} C ${nz.x - 100} ${nz.y + 200}, ${ap.x + 120} ${ap.y - 200}, ${ap.x} ${ap.y}`} />
          <path d={`M ${ap.x} ${ap.y} C ${ap.x - 40} ${ap.y + 120}, ${ne.x + 40} ${ne.y - 120}, ${ne.x} ${ne.y}`} />
          <path d={`M ${ne.x} ${ne.y} C ${ne.x - 300} ${ne.y + 120}, ${bl.x + 300} ${bl.y - 160}, ${bl.x} ${bl.y}`} />
          <path d={`M ${bl.x} ${bl.y} C ${bl.x + 60} ${bl.y - 500}, ${hy.x - 120} ${hy.y + 500}, ${hy.x} ${hy.y}`} />
        </g>
        {/* place names */}
        <text x={ap.x} y={ap.y + 230} className="jm-district">ANDHRA PRADESH</text>
        <text x={nz.x} y={nz.y + 210} className="jm-district">NUZVID</text>
        <text x={hy.x} y={hy.y + 230} className="jm-district">HYDERABAD</text>
        <text x={ne.x} y={ne.y + 230} className="jm-district">NELLORE</text>
        <text x={bl.x} y={bl.y - 200} className="jm-district">BENGALURU</text>
      </svg>
    );
  }, []);
}

export default function Journey() {
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const routeRef = useRef<SVGPathElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const pinRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const compassRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const [step, setStep] = useState(0);
  const [stage, setStage] = useState<"overview" | "travel" | "end">("overview");

  const units = journey.length * DWELL + (journey.length - 1) * MOVE;

  useEffect(() => {
    const path = routeRef.current;
    const stageEl = stageRef.current;
    if (!path || !stageEl) return;
    const L = path.getTotalLength();
    const fr = journey.map((s) => {
      let best = 0;
      let bd = Infinity;
      for (let i = 0; i <= 800; i++) {
        const pt = path.getPointAtLength((i / 800) * L);
        const d = (pt.x - s.x) ** 2 + (pt.y - s.y) ** 2;
        if (d < bd) {
          bd = d;
          best = i / 800;
        }
      }
      return best;
    });
    const routeAt = (t: number) => {
      let u = clamp(t) * units;
      for (let i = 0; i < journey.length; i++) {
        if (u <= DWELL) return { q: fr[i], st: i };
        u -= DWELL;
        if (i < journey.length - 1) {
          if (u <= MOVE) {
            const k = easeInOut(u / MOVE);
            return { q: fr[i] + (fr[i + 1] - fr[i]) * k, st: k < 0.5 ? i : i + 1 };
          }
          u -= MOVE;
        }
      }
      return { q: fr[fr.length - 1], st: journey.length - 1 };
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const xs = journey.map((s) => s.x);
    const ys = journey.map((s) => s.y);
    const bx0 = Math.min(...xs) - 160;
    const bx1 = Math.max(...xs) + 160;
    const by0 = Math.min(...ys) - 140;
    const by1 = Math.max(...ys) + 140;
    const ov = { x: (bx0 + bx1) / 2, y: (by0 + by1) / 2 };

    let p = scrollYProgress.get(); // eased progress (follows the scroll target)
    let bearing = 0;
    let last = performance.now();
    let raf = 0;
    let lastStage = "";
    let lastStep = -1;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const target = scrollYProgress.get();
      p += (target - p) * (reduce ? 1 : 1 - Math.exp(-dt / 0.16));
      if (Math.abs(target - p) < 1e-5) p = target;

      const W = stageEl.clientWidth;
      const H = stageEl.clientHeight;
      const phone = W < 760;
      const z = smooth(0.04, 0.14, p) * (1 - smooth(0.87, 0.96, p));
      const { q, st } = routeAt((p - T0) / (T1 - T0));
      const pt = path.getPointAtLength(q * L);
      const a = path.getPointAtLength(Math.min(L, q * L + 8));
      const b = path.getPointAtLength(Math.max(0, q * L - 8));
      const heading = (Math.atan2(a.y - b.y, a.x - b.x) * 180) / Math.PI;

      const s0 = Math.min((W * (phone ? 0.92 : 0.56)) / (bx1 - bx0), (H * 0.52) / (by1 - by0));
      const s1 = phone ? 0.95 : 1.15;
      const s = s0 * Math.pow(s1 / s0, z); // zoom in log space feels even
      const ovS = { x: W / 2, y: H * 0.63 };
      const fS = phone ? { x: W * 0.5, y: H * 0.34 } : { x: W * 0.63, y: H * 0.52 };
      const cx = ov.x + (pt.x - ov.x) * z;
      const cy = ov.y + (pt.y - ov.y) * z;
      const sx = ovS.x + (fS.x - ovS.x) * z;
      const sy = ovS.y + (fS.y - ovS.y) * z;

      // heading-up (partial, smoothed), only while zoomed in
      let want = heading + 90;
      while (want > 180) want -= 360;
      while (want < -180) want += 360;
      want = clamp(want * 0.4, -24, 24) * z;
      bearing += (want - bearing) * (1 - Math.exp(-dt / 0.35));

      worldRef.current!.style.transform = `translate(${sx}px, ${sy}px) rotate(${-bearing}deg) scale(${s}) translate(${-(cx - X0)}px, ${-(cy - Y0)}px)`;
      path.style.strokeDashoffset = String(1 - (p >= T1 ? 1 : q));

      // project world → screen for the overlays
      const rad = (-bearing * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const proj = (x: number, y: number) => {
        const dx = (x - cx) * s;
        const dy = (y - cy) * s;
        return [sx + dx * cos - dy * sin, sy + dx * sin + dy * cos];
      };
      const pinScale = 0.72 + 0.28 * z;
      pinRefs.current.forEach((el, i) => {
        if (!el) return;
        const [x, y] = proj(journey[i].x, journey[i].y);
        el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${pinScale})`;
      });
      if (arrowRef.current) {
        const [x, y] = proj(pt.x, pt.y);
        arrowRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${heading - bearing}deg)`;
        arrowRef.current.style.opacity = String(smooth(0.35, 0.75, z));
      }
      if (compassRef.current) compassRef.current.style.transform = `rotate(${-bearing}deg)`;
      // round overview map that opens up to full screen
      const m = 30 + 140 * z;
      stageEl.style.setProperty("--mr", `${m}vmax`);
      stageEl.style.setProperty("--my", `${63 - 11 * z}%`);
      if (headRef.current) {
        const o = 1 - smooth(0.02, 0.08, p);
        headRef.current.style.opacity = String(o);
        headRef.current.style.transform = `translateY(${-30 * (1 - o)}px)`;
      }
      const stg = p < 0.1 ? "overview" : p > 0.9 ? "end" : "travel";
      if (stg !== lastStage) setStage((lastStage = stg) as "overview" | "travel" | "end");
      if (st !== lastStep) setStep((lastStep = st));
    };
    raf = requestAnimationFrame(frame);

    // dot clicks need to know the scroll positions
    (ref.current as HTMLElement & { goTo?: (i: number) => void }).goTo = (i: number) => {
      const el = ref.current!;
      const u = i * (DWELL + MOVE) + DWELL / 2;
      const pp = T0 + (u / units) * (T1 - T0);
      window.scrollTo({ top: el.offsetTop + pp * (el.offsetHeight - window.innerHeight), behavior: "smooth" });
    };
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goTo = (i: number) => (ref.current as (HTMLElement & { goTo?: (i: number) => void }) | null)?.goTo?.(i);
  const stop = journey[step];
  const traveling = stage === "travel";

  return (
    <section id="journey" ref={ref} className="jr torn" aria-label="Career journey">
      <div className="jr-sticky" ref={stageRef}>
        <div className="jr-map">
          <div className="jr-world" ref={worldRef}>
            <RegionMap />
            <svg className="jr-route-svg" viewBox={`${X0} ${Y0} ${X1 - X0} ${Y1 - Y0}`} width={X1 - X0} height={Y1 - Y0} aria-hidden="true">
              <path className="jr-route-bg" d={ROUTE} />
              <path ref={routeRef} className="jr-route" d={ROUTE} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1} />
            </svg>
          </div>
        </div>

        {/* pins + arrow, positioned in screen space every frame */}
        <div className="jr-overlay">
          {journey.map((s, i) => {
            const state = traveling && i === step ? "current" : traveling && i < step ? "passed" : "";
            return (
              <button
                key={s.id}
                ref={(el) => {
                  pinRefs.current[i] = el;
                }}
                className={`jr-pin ${state}`}
                style={{ ["--c" as string]: s.color }}
                onClick={() => goTo(i)}
                aria-label={`${s.label}, ${s.place}, ${s.when}`}
              >
                <span className="jr-pin-head">
                  <b>{s.initial}</b>
                </span>
                <span className="jr-pill">{s.label}</span>
              </button>
            );
          })}
          <div ref={arrowRef} className="jr-arrow" aria-hidden="true">
            <span className="jr-halo" />
            <svg viewBox="-12 -12 24 24" width="22" height="22">
              <path d="M -7 -7 L 9 0 L -7 7 L -3 0 Z" />
            </svg>
          </div>
        </div>

        <div className="jr-head" ref={headRef}>
          <p className="kicker">The journey</p>
          <h2>From Andhra Pradesh to building AI in Bengaluru.</h2>
          <p className="w-sub">Five stops, four cities, one curiosity. Scroll to walk the path.</p>
        </div>

        <div className="jr-compass" aria-hidden="true">
          <div ref={compassRef} className="jr-needle">
            <span className="n">N</span>
            <i />
          </div>
        </div>

        {traveling && (
          <motion.article key={stop.id} className="jr-card" style={{ ["--c" as string]: stop.color }} initial={{ opacity: 0, y: 14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
            <header>
              <span className="jr-logo">{stop.initial}</span>
              <span className="jr-who">
                <b>{stop.label}</b>
                <small>
                  {stop.when} · {stop.place}
                </small>
              </span>
              <span className="jr-count">
                {String(step + 1).padStart(2, "0")} / {String(journey.length).padStart(2, "0")}
              </span>
            </header>
            <h3>{stop.title}</h3>
            <p>
              <Rich text={stop.text} />
            </p>
            {stop.metrics && (
              <div className="jr-metrics">
                {stop.metrics.map((m) => (
                  <div key={m.label}>
                    <b>{m.value}</b>
                    <span>{m.label}</span>
                  </div>
                ))}
              </div>
            )}
            {stop.link && (
              <a className="jr-link" href={stop.link.href}>
                {stop.link.label} →
              </a>
            )}
          </motion.article>
        )}
        {stage === "end" && (
          <motion.article key="end" className="jr-card jr-end" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <p className="kicker">That&apos;s the path so far</p>
            <h3>Four cities. One curiosity.</h3>
            <a href="#work" className="w-btn dark">
              Next: what I built →
            </a>
          </motion.article>
        )}

        <div className="jr-dots" role="tablist" aria-label="Journey stops">
          {journey.map((s, i) => {
            const on = traveling && i === step;
            const done = (traveling && i < step) || stage === "end";
            return <button key={s.id} role="tab" aria-selected={on} aria-label={`${s.place}, ${s.when}`} onClick={() => goTo(i)} className={on ? "on" : done ? "done" : ""} style={{ ["--c" as string]: s.color }} />;
          })}
          <span>{traveling ? `${stop.when} · ${stop.place}` : "2017 → now"}</span>
        </div>
      </div>
    </section>
  );
}
