// Drawn cover "images" for each personal project.
// Replace with real screenshots later: put a file in /public/covers and pass `image`.

import type { CoverKind } from "@/data/projects";

const meta: Record<CoverKind, { bg: string; label: string }> = {
  pulsevo: { bg: "#1f6b4a", label: "Pulsevo · AI insights" },
  hirevolts: { bg: "#24408e", label: "HireVolts · Candidate pipeline" },
  password: { bg: "#9a4a1c", label: "Graphical password · Login" },
  jsonflow: { bg: "#4b3f8f", label: "JSON Flow · Graph view" },
};

export default function Cover({ kind, wide = false, image }: { kind: CoverKind; wide?: boolean; image?: string }) {
  const { bg, label } = meta[kind];

  if (image) {
    return (
      <div className={`cover ${wide ? "cover-wide" : ""}`} style={{ background: bg }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="cover-img" src={image} alt={`${label} screenshot`} />
      </div>
    );
  }

  return (
    <div className={`cover ${wide ? "cover-wide" : ""}`} style={{ background: bg }} aria-hidden="true">
      <div className="cover-window">
        <div className="cover-bar">
          <span />
          <span />
          <span />
          <b>{label}</b>
        </div>
        {kind === "pulsevo" && <PulsevoArt />}
        {kind === "hirevolts" && <HirevoltsArt />}
        {kind === "password" && <PasswordArt />}
        {kind === "jsonflow" && <JsonArt />}
      </div>
    </div>
  );
}

function PulsevoArt() {
  return (
    <>
      <div className="cv-stats">
        {[
          ["Completed", "78%", "#1f6b4a"],
          ["In progress", "52%", "#6f9e86"],
          ["Blocked", "24%", "#c26a3a"],
        ].map(([k, w, c]) => (
          <div key={k}>
            <small>{k}</small>
            <i style={{ width: w, background: c }} />
          </div>
        ))}
      </div>
      <div className="cv-row">
        <div className="cv-bars">
          {[40, 62, 50, 84, 70, 92].map((h, i) => (
            <i key={i} style={{ height: `${h}%`, background: i === 3 ? "#1f6b4a" : "#cfe0d6" }} />
          ))}
        </div>
        <div className="cv-chat">
          <p className="me">Who is overloaded this sprint?</p>
          <p className="ai">AI: 2 people hold most open tasks…</p>
        </div>
      </div>
    </>
  );
}

function HirevoltsArt() {
  const cols: [string, string[]][] = [
    ["New", ["70%", "55%"]],
    ["Screening", ["62%", "80%"]],
    ["Interview", ["74%"]],
    ["Offer", ["58%"]],
  ];
  return (
    <>
      <div className="cv-kanban">
        {cols.map(([name, cards]) => (
          <div key={name}>
            <small>{name}</small>
            {cards.map((w, i) => (
              <div className="card" key={i}>
                <i style={{ width: w }} />
                <span>
                  <i />
                  <i />
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <p className="cv-note">
        <b>resume.pdf</b> parsed → name, email, phone, skills, experience
      </p>
    </>
  );
}

function PasswordArt() {
  const pts = [
    [18, 30],
    [42, 58],
    [70, 20],
    [60, 66],
    [30, 12],
  ];
  return (
    <>
      <div className="cv-scene">
        <span className="sun" />
        <span className="hill a" />
        <span className="hill b" />
        {pts.map(([l, t], i) => (
          <span key={i} className="pt" style={{ left: `${l}%`, top: `${t}%` }}>
            {i + 1}
          </span>
        ))}
      </div>
      <p className="cv-note">Click the same 5 points to log in · tolerance radius applied</p>
    </>
  );
}

function JsonArt() {
  return (
    <>
      <div className="cv-tree">
        <span className="node root">root {"{}"}</span>
        <span className="v" />
        <span className="h" />
        <div className="kids">
          <div>
            <span className="v" />
            <span className="node">user {"{}"}</span>
            <span className="v" />
            <span className="node hit">address {"{}"}</span>
          </div>
          <div>
            <span className="v" />
            <span className="node">items []</span>
            <span className="v" />
            <span className="node leaf">[0] · [1]</span>
          </div>
          <div>
            <span className="v" />
            <span className="node leaf">active: true</span>
          </div>
        </div>
      </div>
      <p className="cv-note">Search: $.user.address → node highlighted</p>
    </>
  );
}
