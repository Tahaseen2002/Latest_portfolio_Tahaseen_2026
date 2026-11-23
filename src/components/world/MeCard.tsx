"use client";

// The "Me" card: greeting, tabs (School / Work / Off the clock), a polaroid
// gallery, two stats and contact buttons. Modelled on the reference site.

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { meCard } from "@/data/world";
import { profile } from "@/data/profile";

const Icon = {
  linkedin: <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11H3zM9.5 9.75h3.8v1.5h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1v5.45h-4v-4.83c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.85 1.25-1.85 2.55v4.91h-4z" /></svg>,
  github: <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z" /></svg>,
  mail: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>,
};

const tilts = [-4, 3, -2];

export default function MeCard() {
  const [tab, setTab] = useState(meCard.tabs[0].id);
  const active = meCard.tabs.find((t) => t.id === tab)!;

  return (
    <div className="me-card">
      <h2 className="me-hello">{meCard.greeting}</h2>
      <p className="me-id">{meCard.identity.join(" · ")}</p>
      <p className="me-head">{meCard.headline}</p>

      <div className="me-tabs" role="tablist" aria-label="About me">
        {meCard.tabs.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? "on" : ""} onClick={() => setTab(t.id)} data-cursor="Open">
            {tab === t.id && <motion.span layoutId="me-tab" className="me-tab-pill" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.ul key={active.id} className="me-list" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
          {active.items.map((it, i) => (
            <motion.li key={it.title} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
              <b>{it.title}</b>
              <span>{it.text}</span>
            </motion.li>
          ))}
        </motion.ul>
      </AnimatePresence>

      <p className="me-label">Gallery</p>
      <div className="me-gallery">
        {meCard.gallery.map((g, i) => (
          <motion.figure key={g.src} style={{ rotate: tilts[i % tilts.length] }} whileHover={{ rotate: 0, scale: 1.06, y: -4, zIndex: 2 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g.src} alt={g.caption} loading="lazy" />
            <figcaption className="hand">{g.caption}</figcaption>
          </motion.figure>
        ))}
      </div>

      <div className="me-stats">
        {meCard.stats.map((s) => (
          <div key={s.label}>
            <b>{s.value}</b>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="me-links">
        <a href={profile.linkedin} target="_blank" rel="noreferrer" data-cursor="Open">
          <i className="li">{Icon.linkedin}</i>LinkedIn
        </a>
        <a href={profile.github} target="_blank" rel="noreferrer" data-cursor="Open">
          <i className="gh">{Icon.github}</i>GitHub
        </a>
        <a href={`mailto:${profile.email}`} data-cursor="Open">
          <i className="gm">{Icon.mail}</i>Email
        </a>
      </div>
    </div>
  );
}
