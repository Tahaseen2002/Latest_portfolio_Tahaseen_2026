"use client";

// Contact as chunky keyboard keys. They work from the real keyboard too:
// E = email, L = LinkedIn, G = GitHub, R = résumé.

import { motion } from "motion/react";
import { useEffect, useState } from "react";

type Key = { k: string; label: string; note: string; href: string; color: string; icon: React.ReactNode; download?: boolean; external?: boolean };

const Icon = {
  mail: <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>,
  linkedin: <svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11H3zM9.5 9.75h3.8v1.5h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1v5.45h-4v-4.83c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.85 1.25-1.85 2.55v4.91h-4z" /></svg>,
  github: <svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z" /></svg>,
  doc: <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>,
};

export default function KeyboardContact({ email, linkedin, github, resume }: { email: string; linkedin: string; github: string; resume: string }) {
  const [pressed, setPressed] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const keys: Key[] = [
    { k: "E", label: "Email", note: "Roles, projects, or just hi.", href: `mailto:${email}`, color: "#e5533d", icon: Icon.mail },
    { k: "L", label: "LinkedIn", note: "Where I share what I'm building.", href: linkedin, color: "#2563c9", icon: Icon.linkedin, external: true },
    { k: "G", label: "GitHub", note: "21 repos, 6 live demos.", href: github, color: "#2d2d33", icon: Icon.github, external: true },
    { k: "R", label: "Résumé", note: "Opens in a new tab.", href: resume, color: "#f2c230", icon: Icon.doc, external: true },
  ];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.metaKey || e.ctrlKey || e.altKey || t.closest("input, textarea, [contenteditable]")) return;
      const key = keys.find((k) => k.k.toLowerCase() === e.key.toLowerCase());
      if (!key) return;
      // Only react when the contact section is on screen
      const sec = document.getElementById("contact")?.getBoundingClientRect();
      if (!sec || sec.top > window.innerHeight * 0.8 || sec.bottom < 0) return;
      setPressed(key.k);
      setTimeout(() => setPressed(null), 180);
      setTimeout(() => {
        if (key.download) {
          const a = document.createElement("a");
          a.href = key.href;
          a.download = "";
          a.click();
        } else if (key.external) window.open(key.href, "_blank", "noopener");
        else window.location.href = key.href;
      }, 200);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, linkedin, github, resume]);

  return (
    <div className="keyboard">
      <p className="kbd-hint">
        psst, these work on your keyboard too:{" "}
        {keys.map((k) => (
          <kbd key={k.k}>{k.k}</kbd>
        ))}
      </p>
      <div className="keys">
        {keys.map((k, i) => (
          <div key={k.k} className="key-col">
            <p className={`key-note hand ${i % 2 ? "below" : ""}`}>{k.note}</p>
            <motion.a
              href={k.href}
              {...(k.external ? { target: "_blank", rel: "noreferrer" } : {})}
              {...(k.download ? { download: true } : {})}
              className={`key ${pressed === k.k ? "down" : ""}`}
              style={{ ["--key" as string]: k.color }}
              whileHover={{ y: -3 }}
              whileTap={{ y: 6 }}
              aria-label={`${k.label} (press ${k.k})`}
            >
              <span className="key-letter">{k.k}</span>
              <span className="key-icon">{k.icon}</span>
            </motion.a>
            {k.k === "E" && (
              <button
                className="copy-mail"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(email);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1600);
                  } catch {}
                }}
              >
                {copied ? "Copied ✓" : email}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
