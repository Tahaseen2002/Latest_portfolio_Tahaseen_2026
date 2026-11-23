"use client";

// About: a corkboard with a pinned photo and notes you can drag around.

import { motion } from "motion/react";
import { useRef, useState } from "react";
import { notes } from "@/data/world";

const tilt = [-4, 3, -2, 5, -3, 2, -5];
const pinColors = ["#ef4444", "#3b82f6", "#22c55e", "#eab308", "#a855f7", "#f97316"];

export default function Corkboard({ photo, name }: { photo: string; name: string }) {
  const board = useRef<HTMLDivElement>(null);
  // Whatever you touch last comes to the front, like papers on a real desk.
  // The photo starts on top so it is never hidden on first load.
  const [order, setOrder] = useState<string[]>([...notes.map((n) => n.id), "photo"]);
  const bringToFront = (id: string) => setOrder((o) => (o[o.length - 1] === id ? o : [...o.filter((x) => x !== id), id]));
  const z = (id: string) => order.indexOf(id) + 1;

  return (
    <div className="cork" ref={board}>
      <p className="cork-hint hand">psst, these move ;)</p>

      <motion.figure className="polaroid" style={{ zIndex: z("photo") }} onPointerDown={() => bringToFront("photo")} drag dragConstraints={board} dragElastic={0.15} whileDrag={{ scale: 1.05, rotate: 0 }} initial={{ rotate: -4 }} whileHover={{ rotate: -1 }}>
        <span className="pushpin" style={{ background: pinColors[0] }} aria-hidden="true" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo} alt={`Photo of ${name}`} draggable={false} />
        <figcaption className="hand">me, mid-deploy</figcaption>
      </motion.figure>

      {notes.map((n, i) =>
        n.kind === "paper" ? (
          <motion.div key={n.id} className="paper" style={{ zIndex: z(n.id) }} onPointerDown={() => bringToFront(n.id)} drag dragConstraints={board} dragElastic={0.15} whileDrag={{ scale: 1.04 }} initial={{ rotate: tilt[i] }}>
            <span className="pushpin" style={{ background: pinColors[1] }} aria-hidden="true" />
            <p className="kicker">Off the clock</p>
            <p className="paper-title">{n.title}</p>
            <ul>
              {n.lines.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </motion.div>
        ) : (
          <motion.div
            key={n.id}
            className={`sticky n-${n.id}`}
            style={{ background: n.color, zIndex: z(n.id) }}
            onPointerDown={() => bringToFront(n.id)}
            drag
            dragConstraints={board}
            dragElastic={0.15}
            whileDrag={{ scale: 1.06, rotate: 0 }}
            initial={{ rotate: tilt[i % tilt.length] }}
            whileHover={{ y: -4 }}
          >
            <span className="tape" aria-hidden="true" />
            <p className="hand">{n.text}</p>
          </motion.div>
        ),
      )}
    </div>
  );
}
