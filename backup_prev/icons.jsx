/* CELESTIAL DUNGEON CARTOGRAPHER — bespoke waypoint icons.
   All shapes are hand-drawn SVG primitives. No external assets, no motif copies
   from any specific game — the vocabulary is astronomical/alchemical/organic.
   Each icon draws inside a -32..32 box so it composes cleanly inside the
   64px astrolabe waypoint frame. */

// Sub-set of unicode glyphs banned; we render everything as vectors.

/* ==================== Waypoint Frame (astrolabe ring) ==================== */

function WaypointFrame({ color, selected, danger }) {
  const stroke = selected ? "var(--brass)" : color;
  const halo   = selected ? "var(--brass-soft)" : "transparent";
  // Outer ring + tick marks (compass bearings). Slight rotation for elite/danger.
  const ticks = [];
  const N = 24;
  for (let i = 0; i < N; i++) {
    const angle = (i / N) * Math.PI * 2;
    const inner = i % 6 === 0 ? 30 : 32;
    const outer = i % 6 === 0 ? 35 : 34;
    ticks.push(
      <line
        key={i}
        x1={Math.cos(angle) * inner}
        y1={Math.sin(angle) * inner}
        x2={Math.cos(angle) * outer}
        y2={Math.sin(angle) * outer}
        stroke={stroke}
        strokeOpacity={i % 6 === 0 ? 0.85 : 0.35}
        strokeWidth={i % 6 === 0 ? 1.4 : 0.8}
        strokeLinecap="round"
      />,
    );
  }
  return (
    <g>
      {selected && (
        <circle r={44} fill="none" stroke={halo} strokeOpacity="0.35" strokeWidth="1" />
      )}
      {/* halo glow */}
      <circle r={38} fill="none" stroke={stroke} strokeOpacity={selected ? 0.28 : 0.15} strokeWidth={selected ? 6 : 3.5} />
      {/* body */}
      <circle r={30} fill="var(--node-fill)" stroke={stroke} strokeWidth={selected ? 2.4 : 1.6} />
      {/* danger inner accent */}
      {danger && (
        <circle r={26} fill="none" stroke={stroke} strokeOpacity="0.4" strokeWidth="0.7" strokeDasharray="2 3" />
      )}
      {ticks}
    </g>
  );
}

/* ==================== 9 waypoint kind icons ==================== */

// origin — Polar star + cardinal cross (astrolabe center)
function IconOrigin({ c = "#e6b866" }) {
  return (
    <g stroke={c} fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Cardinal cross */}
      <path d="M0 -20 V 20 M -20 0 H 20" strokeWidth="1.4" opacity="0.55" />
      {/* 8-point star */}
      <path
        d="M 0 -16 L 3.2 -3.2 L 16 0 L 3.2 3.2 L 0 16 L -3.2 3.2 L -16 0 L -3.2 -3.2 Z"
        fill={c} fillOpacity="0.18" strokeWidth="1.5"
      />
      <circle r="2.4" fill={c} stroke="none" />
      {/* diagonal minor rays */}
      <path d="M -12 -12 L 12 12 M 12 -12 L -12 12" strokeWidth="0.7" opacity="0.35" />
    </g>
  );
}

// skirmish — twin sabres / opposed thorns (subtle X of curved barbs)
function IconSkirmish({ c = "#7ae0e0" }) {
  return (
    <g stroke={c} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6">
      {/* two curved opposing barbs */}
      <path d="M -14 -14 Q -4 -6, 0 0 Q 4 6, 14 14" />
      <path d="M 14 -14 Q 4 -6, 0 0 Q -4 6, -14 14" />
      {/* barb heads */}
      <path d="M -14 -14 L -10 -8 M -14 -14 L -8 -12" strokeWidth="1.2" />
      <path d="M 14  14 L 10  8  M 14  14 L 8   12" strokeWidth="1.2" />
      <path d="M  14 -14 L 10 -8  M  14 -14 L 8  -12" strokeWidth="1.2" />
      <path d="M -14  14 L -10 8  M -14  14 L -8 12" strokeWidth="1.2" />
      <circle r="2" fill={c} stroke="none" />
    </g>
  );
}

// focused — triple ring + sharp hexagram at core (concentration)
function IconFocused({ c = "#7ae0e0" }) {
  return (
    <g stroke={c} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle r="17" strokeWidth="1" opacity="0.55" />
      <circle r="12" strokeWidth="1" opacity="0.75" strokeDasharray="2 2" />
      {/* Hexagram (two triangles) */}
      <path d="M 0 -12 L 10.4 6 L -10.4 6 Z" strokeWidth="1.5" fill={c} fillOpacity="0.14" />
      <path d="M 0 12 L 10.4 -6 L -10.4 -6 Z" strokeWidth="1.5" />
      <circle r="1.8" fill={c} stroke="none" />
    </g>
  );
}

// elite — fractured moon + thorned crown (broken crescent)
function IconElite({ c = "#e05555" }) {
  return (
    <g stroke={c} fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* broken crescent */}
      <path d="M 10 -10 A 14 14 0 1 0 10 10" strokeWidth="1.8" fill={c} fillOpacity="0.14" />
      <path d="M 6 -6 A 9 9 0 1 1 6 6" strokeWidth="1.4" fill="var(--node-fill)" />
      {/* fracture line */}
      <path d="M -14 4 L -6 -2 L -10 -8" strokeWidth="1.2" opacity="0.75" />
      {/* thorn spikes on the outside */}
      <path d="M -18 -10 L -14 -6 M -18 10 L -14 6 M -20 0 L -15 0" strokeWidth="1.2" />
    </g>
  );
}

// anomaly — asymmetric star cluster (mutated constellation)
function IconAnomaly({ c = "#e05555" }) {
  const pts = [
    [-13, -8], [-4, -14], [6, -10], [12, -2],
    [8, 10], [-2, 12], [-11, 6], [0, 0],
  ];
  return (
    <g stroke={c} fill={c} strokeLinecap="round" strokeLinejoin="round">
      {/* connecting lines */}
      <g fill="none" strokeOpacity="0.5" strokeWidth="0.9" strokeDasharray="1 2">
        {pts.slice(0, -1).map((p, i) => {
          const q = pts[i + 1];
          return <line key={i} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} />;
        })}
        <line x1={pts[0][0]} y1={pts[0][1]} x2={pts[6][0]} y2={pts[6][1]} />
      </g>
      {/* stars */}
      {pts.map(([x, y], i) => {
        const r = i === 7 ? 2.4 : i % 2 === 0 ? 1.7 : 1.2;
        return <circle key={i} cx={x} cy={y} r={r} fillOpacity={i === 7 ? 1 : 0.85} />;
      })}
    </g>
  );
}

// event — crescent + interlocked spiral (undetermined outcome)
function IconEvent({ c = "#7ae0e0" }) {
  return (
    <g stroke={c} fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* thin crescent overlay */}
      <path
        d="M 12 -10 A 14 14 0 1 0 12 10 A 10 10 0 1 1 12 -10 Z"
        strokeWidth="1.4" fill={c} fillOpacity="0.10"
      />
      {/* spiral in center — the "unknown" */}
      <path
        d="M 0 0
           m 0 -1.5
           a 1.5 1.5 0 1 1 1.5 1.5
           a 3.5 3.5 0 1 1 -3.5 -3.5
           a 5.8 5.8 0 1 1 5.8 5.8
           a 8 8 0 1 1 -8 -8"
        strokeWidth="1.4"
      />
      <circle r="1.3" fill={c} stroke="none" />
    </g>
  );
}

// supply — encircled gear + seed (provisions / augment)
function IconSupply({ c = "#7ae0e0" }) {
  const teeth = [];
  const T = 8;
  for (let i = 0; i < T; i++) {
    const a = (i / T) * Math.PI * 2;
    const cs = Math.cos(a), sn = Math.sin(a);
    teeth.push(
      <rect
        key={i}
        x={-1.6} y={-16}
        width={3.2} height={3.6}
        fill={c} fillOpacity="0.85"
        transform={`rotate(${(a * 180) / Math.PI + 90}) translate(0,0)`}
      />,
    );
  }
  return (
    <g stroke={c} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle r="17" strokeWidth="1" opacity="0.4" strokeDasharray="1 3" />
      {/* gear teeth (as radial ticks) */}
      {Array.from({ length: T }).map((_, i) => {
        const a = (i / T) * Math.PI * 2;
        const x1 = Math.cos(a) * 11.5, y1 = Math.sin(a) * 11.5;
        const x2 = Math.cos(a) * 15, y2 = Math.sin(a) * 15;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="2.4" strokeLinecap="butt" />;
      })}
      {/* gear body */}
      <circle r="11" strokeWidth="1.4" fill="var(--node-fill)" />
      {/* seed inside — a lens */}
      <path d="M -6 0 Q 0 -7, 6 0 Q 0 7, -6 0 Z" strokeWidth="1.3" fill={c} fillOpacity="0.18" />
      <line x1="-3.5" y1="0" x2="3.5" y2="0" strokeWidth="0.9" opacity="0.6" />
    </g>
  );
}

// rest — full moon + radiant heat rings (warm respite)
function IconRest({ c = "#7ae0e0" }) {
  return (
    <g stroke={c} fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* radiant rings */}
      <circle r="18" strokeWidth="0.8" opacity="0.35" strokeDasharray="1 3" />
      <circle r="14" strokeWidth="0.8" opacity="0.55" />
      {/* moon disc */}
      <circle r="9" strokeWidth="1.4" fill={c} fillOpacity="0.16" />
      {/* moon "craters" — tiny dots */}
      <circle cx="-3" cy="-2" r="1.1" fill={c} stroke="none" opacity="0.7" />
      <circle cx="2.5" cy="1.8" r="0.9" fill={c} stroke="none" opacity="0.6" />
      <circle cx="-1" cy="4"   r="0.7" fill={c} stroke="none" opacity="0.5" />
      {/* eight-direction ember rays */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
        const x1 = Math.cos(a) * 20, y1 = Math.sin(a) * 20;
        const x2 = Math.cos(a) * 22.5, y2 = Math.sin(a) * 22.5;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="1.2" opacity="0.7" />;
      })}
    </g>
  );
}

// guardian — solar eclipse + radiant crown (terminal boss)
function IconGuardian({ c = "#e05555" }) {
  return (
    <g stroke={c} fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* corona rays */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const x1 = Math.cos(a) * 15, y1 = Math.sin(a) * 15;
        const x2 = Math.cos(a) * (i % 2 === 0 ? 22 : 19), y2 = Math.sin(a) * (i % 2 === 0 ? 22 : 19);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={i % 2 === 0 ? 1.6 : 1} strokeOpacity={i % 2 === 0 ? 0.9 : 0.55} />;
      })}
      {/* black eclipsed disc */}
      <circle r="11.5" fill="var(--node-fill)" strokeWidth="1.8" />
      {/* narrow bright corona edge */}
      <circle r="11.5" fill="none" stroke={c} strokeOpacity="0.4" strokeWidth="0.6" />
      {/* central diamond eye */}
      <path d="M 0 -5 L 4 0 L 0 5 L -4 0 Z" strokeWidth="1.2" fill={c} fillOpacity="0.55" />
      <circle r="1" fill="var(--node-fill)" stroke="none" />
    </g>
  );
}

/* ==================== Registry ==================== */

const ICONS = {
  origin:   IconOrigin,
  skirmish: IconSkirmish,
  focused:  IconFocused,
  elite:    IconElite,
  anomaly:  IconAnomaly,
  event:    IconEvent,
  supply:   IconSupply,
  rest:     IconRest,
  guardian: IconGuardian,
};

/* Renders the icon glyph only (no frame). Use inside a translated <g>. */
function KindGlyph({ kind, color }) {
  const Cmp = ICONS[kind] || ICONS.origin;
  return <Cmp c={color} />;
}

/* Renders full waypoint (frame + glyph). Position via parent <g transform>. */
function Waypoint({ kind, color, selected, danger, onClick, label, showLabel, ariaLabel, onDoubleClick }) {
  return (
    <g
      className={`waypoint ${selected ? "is-selected" : ""}`}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick?.(e); }
      }}
    >
      <WaypointFrame color={color} selected={selected} danger={danger} />
      <KindGlyph kind={kind} color={color} />
      {showLabel && label && (
        <text
          y="54" textAnchor="middle"
          fill="var(--ink)" fontFamily="'Noto Sans JP', sans-serif"
          fontSize="13" fontWeight="500"
          style={{ paintOrder: "stroke", stroke: "#050810", strokeWidth: 3, strokeLinejoin: "round" }}
        >
          {label}
        </text>
      )}
    </g>
  );
}

/* export to window so other scripts can consume */
Object.assign(window, {
  KindGlyph, Waypoint, WaypointFrame, ICONS,
});
