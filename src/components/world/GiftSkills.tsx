"use client";

// The toolkit as a gift: tap it, the lid flips open with a glow,
// and every tool flies out of the box as an app-icon tile.

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { alsoGoodAt, tools } from "@/data/tools";

const COLS = 8;

// Pick a readable glyph colour for each brand colour
function glyphColor(hex: string) {
  const n = parseInt(hex, 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.299 * r + 0.587 * g + 0.114 * b > 170 ? "#111318" : "#ffffff";
}

export default function GiftSkills() {
  const [open, setOpen] = useState(false);

  return (
    <div className={`gift-scene ${open ? "is-open" : ""}`}>
      {/* Tools that fly out of the box */}
      <AnimatePresence>
        {open && (
          <motion.ul className="tool-grid" aria-label="Tools I use" initial="hidden" animate="show" exit={{ opacity: 0, y: 40, scale: 0.9, transition: { duration: 0.35 } }}>
            {tools.map((tool, i) => {
              const col = i % COLS;
              const row = Math.floor(i / COLS);
              const bg = tool.hex === "000000" || tool.hex === "0A0A0A" ? "111318" : tool.hex;
              return (
                <motion.li
                  key={tool.name}
                  className="tool"
                  variants={{
                    hidden: { opacity: 0, y: 260 - row * 70, x: (COLS / 2 - 0.5 - col) * 46, scale: 0.2, rotate: (col - COLS / 2) * 8 },
                    show: { opacity: 1, y: 0, x: 0, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 180, damping: 16, delay: 0.25 + i * 0.035 } },
                  }}
                  whileHover={{ y: -6, scale: 1.08 }}
                >
                  <span className="tool-icon" style={{ background: `#${bg}`, color: glyphColor(bg) }}>
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
                      <path d={tool.path} />
                    </svg>
                  </span>
                  <span className="tool-name">{tool.name}</span>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>

      {/* The gift box */}
      <div className="gbox-wrap">
        <motion.div className="gbox-glow" animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0.6 }} transition={{ duration: 0.8 }} aria-hidden="true" />
        {open && (
          <div className="sparkles" aria-hidden="true">
            {Array.from({ length: 10 }, (_, i) => (
              <motion.span
                key={i}
                style={{ left: `${10 + ((i * 37) % 80)}%` }}
                initial={{ opacity: 0, y: 0, scale: 0.4 }}
                animate={{ opacity: [0, 1, 0], y: -140 - (i % 4) * 30, scale: [0.4, 1, 0.6] }}
                transition={{ duration: 1.8 + (i % 3) * 0.4, delay: 0.1 + i * 0.12, repeat: Infinity, repeatDelay: 0.6 }}
              >
                ✦
              </motion.span>
            ))}
          </div>
        )}

        <motion.button
          className="gbox"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? "Close the gift" : `Unwrap my toolkit: ${tools.length} tools`}
          whileHover={open ? {} : { rotate: [0, -3, 3, -2, 0], transition: { duration: 0.5 } }}
          whileTap={{ scale: 0.96 }}
        >
          <motion.span
            className="gbox-lid"
            animate={open ? { x: 70, y: -64, rotate: 24 } : { x: 0, y: 0, rotate: 0 }}
            transition={{ type: "spring", stiffness: 140, damping: 12 }}
          >
            <span className="gbox-bow" aria-hidden="true">
              <i />
              <i />
            </span>
          </motion.span>
          <span className="gbox-body">
            <span className="gbox-inside" aria-hidden="true" />
          </span>
          <span className="gbox-tag hand">for you</span>
        </motion.button>
      </div>

      <button className="w-btn gift-toggle" onClick={() => setOpen(!open)}>
        {open ? "Wrap it up again" : "Tap to unwrap ✦"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div className="also" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: 1.1 } }} exit={{ opacity: 0 }}>
            <span className="kicker">Also good at</span>
            <div className="pill-row">
              {alsoGoodAt.map((s) => (
                <span key={s} className="pill">
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
