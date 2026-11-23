"use client";

// The journey map. As you scroll:
//   1. an overview of the whole map,
//   2. the camera zooms in and follows an arrow travelling along the route,
//      stop by stop, while the story card on the left follows along,
//   3. it zooms back out to show the whole path at the end.

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { journey } from "@/data/world";

const W = 1000;
const H = 560;
const ZOOM = 2;

function routePath() {
  let d = `M ${journey[0].x} ${journey[0].y}`;
  for (let i = 1; i < journey.length; i++) {
    const a = journey[i - 1];
    const b = journey[i];
    const mx = (a.x + b.x) / 2;
    d += ` C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
  }
  return d;
}
const ROUTE = routePath();

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export default function Journey() {
  const ref = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [len, setLen] = useState(0);
  const [stopAt, setStopAt] = useState<number[]>([]); // where each stop sits along the route (0..1)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [cam, setCam] = useState({ p: 0, q: 0, x: W / 2, y: H / 2, s: 1, ax: journey[0].x, ay: journey[0].y, angle: 0 });

  // Measure the route once, and find each stop's position along it
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const L = path.getTotalLength();
    setLen(L);
    const fracs = journey.map((s) => {
      let best = 0;
      let bestD = Infinity;
      for (let t = 0; t <= 400; t++) {
        const pt = path.getPointAtLength((t / 400) * L);
        const d = (pt.x - s.x) ** 2 + (pt.y - s.y) ** 2;
        if (d < bestD) {
          bestD = d;
          best = t / 400;
        }
      }
      return best;
    });
    setStopAt(fracs);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const path = pathRef.current;
    if (!path || !len) return;
    // Travel at a steady pace along the route; arrives at J2W early so it gets a proper pause
    const q = Math.min(1, Math.max(0, (p - 0.07) / 0.7));
    const zoomIn = smooth(0.02, 0.12, p) * (1 - smooth(0.88, 0.97, p)); // overview → zoomed → overview
    const pt = path.getPointAtLength(q * len);
    const ahead = path.getPointAtLength(Math.min(len, q * len + 2));
    const angle = (Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180) / Math.PI;
    setCam({
      p,
      q,
      x: W / 2 + (pt.x - W / 2) * zoomIn,
      y: H / 2 + (pt.y - H / 2) * zoomIn,
      s: 1 + (ZOOM - 1) * zoomIn,
      ax: pt.x,
      ay: pt.y,
      angle,
    });
  });

  // Which stop are we at?
  // (a stop's card appears once the arrow is halfway there from the previous stop)
  let step = 0;
  stopAt.forEach((f, i) => {
    const from = i === 0 ? 0 : (stopAt[i - 1] + f) / 2;
    if (cam.q >= from) step = i;
  });
  const overview = cam.p < 0.06 || cam.p > 0.93;
  const ended = cam.p > 0.93;
  const stop = journey[step];

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el || !stopAt.length) return;
    const target = 0.07 + stopAt[i] * 0.7 + 0.01; // invert the travel mapping
    window.scrollTo({ top: el.offsetTop + target * (el.offsetHeight - window.innerHeight), behavior: "smooth" });
  };

  return (
    <section id="journey" ref={ref} className="journey torn" aria-label="Career journey">
      <div className="journey-sticky">
        <motion.div className="journey-head" animate={{ opacity: overview && !ended ? 1 : 0.0, y: overview && !ended ? 0 : -20 }} transition={{ duration: 0.4 }}>
          <p className="kicker">The journey</p>
          <h2>From a government school in Andhra Pradesh to building AI at J2W.</h2>
          <p className="w-sub">Five stops between 2017 and now. Scroll to walk the path.</p>
        </motion.div>

        <div className="journey-map">
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <g transform={`translate(${W / 2} ${H / 2}) scale(${cam.s}) translate(${-cam.x} ${-cam.y})`}>
              <rect x={-400} y={-300} width={W + 800} height={H + 600} className="map-ground" />
              <g className="streets">
                {Array.from({ length: 19 }, (_, i) => <line key={`v${i}`} x1={i * 100 - 400} y1={-300} x2={i * 100 - 400} y2={H + 300} />)}
                {Array.from({ length: 14 }, (_, i) => <line key={`h${i}`} x1={-400} y1={i * 90 - 260} x2={W + 400} y2={i * 90 - 260} />)}
              </g>
              <g className="blocks">
                {[
                  [210, 110, 60, 40], [320, 120, 40, 50], [460, 180, 70, 40], [560, 440, 60, 40], [700, 110, 50, 60], [760, 450, 80, 40], [90, 200, 50, 40], [880, 360, 60, 50], [330, 450, 50, 40], [610, 220, 40, 40],
                  [140, 500, 70, 30], [420, 260, 40, 30], [820, 250, 50, 40], [960, 420, 60, 40], [40, 330, 40, 50], [640, 340, 30, 40],
                ].map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} rx="4" />)}
              </g>
              <path className="river" d="M -400 120 C 200 160, 300 60, 520 120 S 820 60, 1400 110" />
              <path className="highway" d="M -400 520 C 200 470, 600 560, 1400 470" />
              <circle className="park" cx="470" cy="480" r="46" />
              <circle className="park" cx="790" cy="330" r="34" />
              <circle className="park" cx="200" cy="300" r="28" />

              <path className="route-bg" d={ROUTE} />
              <path ref={pathRef} className="route" d={ROUTE} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - cam.q} />

              {journey.map((s, i) => {
                const reached = stopAt.length ? cam.q >= stopAt[i] - 0.02 : i === 0;
                return (
                  <g key={s.id} transform={`translate(${s.x} ${s.y}) scale(${1 / Math.sqrt(cam.s)})`} className={`stop ${reached ? "reached" : ""} ${i === step && !overview ? "current" : ""}`}>
                    {i === step && !overview && <circle r="28" className="stop-pulse" fill={s.color} />}
                    <path d="M0 0 C -14 -16, -16 -26, -16 -32 A 16 16 0 1 1 16 -32 C 16 -26, 14 -16, 0 0 Z" fill={reached ? s.color : "#cbd5e1"} />
                    <circle cy="-32" r="6" fill="#fff" />
                    <text x="22" y="-26">{s.label}</text>
                  </g>
                );
              })}

              {/* the traveller */}
              {!overview && (
                <g transform={`translate(${cam.ax} ${cam.ay}) rotate(${cam.angle}) scale(${1 / Math.sqrt(cam.s)})`} className="traveller">
                  <circle r="22" className="traveller-halo" />
                  <path d="M -10 -9 L 13 0 L -10 9 L -5 0 Z" />
                </g>
              )}
            </g>
          </svg>

          <motion.div className="compass" animate={{ rotate: cam.angle - 90 }} transition={{ type: "spring", stiffness: 80, damping: 15 }} aria-hidden="true">
            <span>N</span>
          </motion.div>
          <div className="zoom-ctrls" aria-hidden="true">
            <span>⌖</span>
            <span>+</span>
            <span>−</span>
          </div>

          <AnimatePresence mode="wait">
            {!overview && (
              <motion.article key={stop.id} className="journey-card" initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.35 }}>
                <p className="kicker" style={{ color: stop.color }}>
                  Stop {step + 1} of {journey.length} · {stop.when}
                </p>
                <h3>{stop.label}</h3>
                <p>{stop.text}</p>
              </motion.article>
            )}
            {ended && (
              <motion.article key="end" className="journey-card end" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                <p className="kicker">That&apos;s the path so far</p>
                <h3>Five stops. One curiosity.</h3>
                <a href="#work" className="w-btn dark">
                  Next: what I built →
                </a>
              </motion.article>
            )}
          </AnimatePresence>
        </div>

        <div className="timeline" role="tablist" aria-label="Journey stops">
          {journey.map((s, i) => (
            <button key={s.id} role="tab" aria-selected={i === step && !overview} onClick={() => goTo(i)} style={{ background: stopAt.length && cam.q >= stopAt[i] - 0.02 ? s.color : undefined }} aria-label={`${s.label}, ${s.when}`} className={i === step && !overview ? "on" : ""} />
          ))}
          <span>{overview ? "2017 → now" : stop.when}</span>
        </div>
      </div>
    </section>
  );
}
