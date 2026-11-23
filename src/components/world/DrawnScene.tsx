// An original illustrated scene drawn in SVG, used until a real illustration
// is added (see src/data/world.ts). Day and night are handled by CSS:
// sky colours, sun/moon and lit windows switch with the theme.

export default function DrawnScene() {
  return (
    <svg className="drawn-scene" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" className="sky-top" />
          <stop offset="60%" className="sky-mid" />
          <stop offset="100%" className="sky-low" />
        </linearGradient>
        <linearGradient id="lake" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" className="lake-top" />
          <stop offset="100%" className="lake-low" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff7d6" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fff7d6" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1600" height="900" fill="url(#sky)" />

      {/* stars (night only) */}
      <g className="stars">
        {[
          [120, 80], [260, 150], [410, 60], [560, 120], [700, 40], [860, 110], [990, 70], [1130, 140], [1270, 50], [1420, 120], [1520, 60], [330, 220], [780, 200], [1210, 230],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2.2 : 1.4} fill="#fff" />
        ))}
      </g>

      {/* sun / moon */}
      <circle className="sun-glow" cx="1180" cy="250" r="160" fill="url(#glow)" />
      <circle className="sun" cx="1180" cy="250" r="54" />

      {/* clouds */}
      <g className="clouds">
        <g className="cloud c1"><ellipse cx="300" cy="190" rx="90" ry="26" /><ellipse cx="350" cy="172" rx="60" ry="30" /><ellipse cx="250" cy="180" rx="50" ry="22" /></g>
        <g className="cloud c2"><ellipse cx="900" cy="140" rx="110" ry="28" /><ellipse cx="960" cy="120" rx="70" ry="32" /></g>
        <g className="cloud c3"><ellipse cx="1430" cy="330" rx="80" ry="22" /><ellipse cx="1470" cy="314" rx="50" ry="24" /></g>
      </g>

      {/* far mountains */}
      <path className="mtn-far" d="M0 470 L120 360 L230 420 L360 300 L480 400 L610 320 L760 430 L900 330 L1040 410 L1180 310 L1320 400 L1460 340 L1600 420 L1600 560 L0 560 Z" />
      <path className="mtn-near" d="M0 520 L160 430 L300 500 L440 420 L600 510 L760 450 L920 520 L1100 440 L1260 520 L1420 460 L1600 530 L1600 620 L0 620 Z" />

      {/* lake */}
      <path d="M0 560 Q 400 540 800 565 T 1600 555 L1600 700 L0 700 Z" fill="url(#lake)" />
      <g className="ripples">
        <path d="M380 600 h80 M520 625 h60 M900 610 h90 M1150 640 h70" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* ground layers */}
      <path className="hill-back" d="M0 640 Q 260 590 520 630 T 1040 620 T 1600 630 L1600 900 L0 900 Z" />
      <path className="hill-front" d="M0 760 Q 300 690 640 740 T 1200 720 T 1600 740 L1600 900 L0 900 Z" />

      {/* college: a clock tower (front left, below the intro text) */}
      <g className="bld" transform="translate(230 560)">
        <rect x="20" y="40" width="70" height="120" rx="4" className="wall" />
        <rect x="38" y="0" width="34" height="60" className="wall" />
        <path d="M34 0 L55 -34 L76 0 Z" className="roof" />
        <circle cx="55" cy="26" r="10" className="clock" />
        <rect x="0" y="100" width="110" height="60" className="wall" />
        <path d="M-6 100 L55 74 L116 100 Z" className="roof" />
        {[16, 46, 76].map((x) => <rect key={x} x={x} y="118" width="16" height="22" rx="8" className="win" />)}
      </g>

      {/* FMS: a cosy office (lower left) */}
      <g className="bld" transform="translate(470 520)">
        <rect x="0" y="40" width="150" height="90" rx="4" className="wall alt" />
        <path d="M-10 42 L75 -6 L160 42 Z" className="roof" />
        {[18, 64, 110].map((x) => <rect key={x} x={x} y="62" width="22" height="26" rx="3" className="win" />)}
        <rect x="62" y="96" width="26" height="34" rx="3" className="door" />
      </g>

      {/* CodingLimits: a startup loft (centre) */}
      <g className="bld" transform="translate(810 370)">
        <rect x="0" y="20" width="120" height="170" rx="6" className="wall" />
        <rect x="120" y="70" width="70" height="120" rx="4" className="wall alt" />
        {[0, 1, 2, 3].map((r) => [16, 52, 86].map((x) => <rect key={`${r}-${x}`} x={x} y={40 + r * 36} width="20" height="22" rx="3" className="win" />))}
        {[0, 1].map((r) => <rect key={r} x="140" y={90 + r * 40} width="30" height="22" rx="3" className="win" />)}
        <rect x="40" y="0" width="40" height="22" rx="4" className="roof" />
      </g>

      {/* J2W: a modern glass studio (right, by the water) */}
      <g className="bld" transform="translate(1120 470)">
        <rect x="0" y="30" width="230" height="130" rx="10" className="glass" />
        <rect x="20" y="0" width="140" height="40" rx="8" className="glass" />
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={18 + i * 42} y="58" width="30" height="80" rx="4" className="win tall" />)}
        <rect x="-20" y="156" width="270" height="12" rx="6" className="deck" />
      </g>

      {/* lab: a little observatory on the hill (top right) */}
      <g className="bld" transform="translate(1340 300)">
        <rect x="10" y="40" width="70" height="60" rx="4" className="wall alt" />
        <path d="M6 42 A 39 39 0 0 1 84 42 Z" className="dome" />
        <rect x="40" y="10" width="40" height="10" rx="3" transform="rotate(-25 60 15)" className="scope" />
        <rect x="34" y="62" width="22" height="26" rx="3" className="win" />
      </g>

      {/* trees */}
      <g className="trees">
        {[
          [90, 640, 1.1], [420, 660, 0.9], [700, 690, 1.2], [1020, 650, 1], [1460, 660, 1.1], [1540, 700, 0.9], [640, 470, 0.7], [1290, 440, 0.8],
        ].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
            <rect x="-4" y="0" width="8" height="40" className="trunk" />
            <path d="M0 -70 L26 0 L-26 0 Z" className="leaf" />
            <path d="M0 -96 L20 -40 L-20 -40 Z" className="leaf light" />
          </g>
        ))}
      </g>

      {/* winding path linking every place: the career "road" */}
      <path className="road" d="M285 725 C 360 700, 470 670, 545 650 S 760 600, 870 560 S 1050 640, 1230 635 S 1380 420, 1385 400" fill="none" strokeWidth="10" strokeLinecap="round" strokeDasharray="2 22" />

      {/* a small figure with a laptop on the front hill */}
      <g className="me" transform="translate(90 770)">
        <ellipse cx="40" cy="64" rx="60" ry="10" className="shadow" />
        <rect x="20" y="16" width="40" height="44" rx="18" className="body" />
        <circle cx="40" cy="6" r="16" className="head" />
        <path d="M24 2 C 24 -18, 56 -18, 56 2 C 56 16, 60 30, 62 44 L 18 44 C 20 30, 24 16, 24 2 Z" className="scarf" />
        <rect x="46" y="34" width="44" height="28" rx="3" className="laptop" />
        <rect x="50" y="38" width="36" height="20" rx="2" className="screen" />
      </g>
    </svg>
  );
}
