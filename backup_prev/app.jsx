/* LBT_MIRROR-DUNGEON-GENERATOR — Celestial Dungeon Cartographer.
   Left-to-right multi-column route planner with direct-on-map kind editing
   via a radial menu, and CORS-free PNG export from inline SVG. */

const { useEffect, useMemo, useRef, useState, useCallback } = React;

/* ==================== Data model ==================== */

const STORAGE_KEY = "lbt-mirror-cartographer.v1";
const MAX_COLUMNS = 12;
const MAX_NODES_PER_COLUMN = 3;
const HISTORY_LIMIT = 80;

const KIND_META = {
  origin:   { label: "開始",     short: "ORIGIN",   description: "経路の出発地点。ここから前進が始まる。", danger: false },
  skirmish: { label: "通常戦闘", short: "SKIRMISH", description: "標準的な敵勢との遭遇。線量は控えめ。", danger: false },
  focused:  { label: "集中戦闘", short: "FOCUSED",  description: "一体に絞った濃度の高い戦闘。",           danger: false },
  elite:    { label: "精鋭",     short: "ELITE",    description: "危険度の高い連続戦闘。警戒色。",       danger: true  },
  anomaly:  { label: "変則遭遇", short: "ANOMALY",  description: "通常と異なる、特殊な遭遇。",             danger: true  },
  event:    { label: "選択事象", short: "EVENT",    description: "内容が未確定または分岐を伴う地点。",   danger: false },
  supply:   { label: "補給所",   short: "SUPPLY",   description: "補給・整備・強化を行う地点。",           danger: false },
  rest:     { label: "休息",     short: "REST",     description: "休止して隊列を立て直す地点。",           danger: false },
  guardian: { label: "終端",     short: "TERMINAL", description: "区間の最後に待つ最高難度の地点。",     danger: true  },
};

const KIND_ORDER = ["origin","skirmish","focused","elite","anomaly","event","supply","rest","guardian"];

const KIND_COLORS = {
  origin:   "#e6b866",
  skirmish: "#7ae0e0",
  focused:  "#a4d8e0",
  elite:    "#e05555",
  anomaly:  "#e07aa8",
  event:    "#c9c0e6",
  supply:   "#7ae0b8",
  rest:     "#f0d78a",
  guardian: "#e04040",
};

const STD_THEME = { background: "#050810", line: "#7ae0e0" };

function uuid() { return crypto?.randomUUID?.() ?? `n_${Date.now()}_${Math.random().toString(36).slice(2,7)}`; }
function clean(v, max = 28) { return String(v ?? "").replace(/[<>]/g, "").slice(0, max); }
function clone(v) { return JSON.parse(JSON.stringify(v)); }
function isDefaultLabel(kind, label) { return label === KIND_META[kind]?.label; }

function seedNode(stage, index = 0) {
  const defaults = ["origin","skirmish","event","supply","guardian"];
  const kind = stage === 0 ? "origin" : (defaults[Math.min(stage, defaults.length - 1)] || "skirmish");
  return {
    id: uuid(),
    stage,
    kind,
    label: index ? `${KIND_META[kind].label} ${stage + 1}-${index + 1}` : KIND_META[kind].label,
  };
}

function deriveEdges(nodes) {
  const highest = Math.max(0, ...nodes.map(n => n.stage));
  const edges = [];
  for (let s = 0; s < highest; s++) {
    const from = nodes.filter(n => n.stage === s);
    const to   = nodes.filter(n => n.stage === s + 1);
    from.forEach(a => to.forEach(b => edges.push([a.id, b.id])));
  }
  return edges;
}

function ensureColumns(nodes) {
  const out = [...nodes];
  const highest = Math.max(0, ...out.map(n => n.stage));
  for (let s = 0; s <= highest; s++) if (!out.some(n => n.stage === s)) out.push(seedNode(s));
  const origin = out.find(n => n.stage === 0);
  if (origin) { origin.kind = "origin"; if (!origin.label) origin.label = "起点"; }
  return out.sort((a, b) => a.stage - b.stage || a.id.localeCompare(b.id));
}

function baseTree() {
  const nodes = [
    { id: "n_origin",   stage: 0, kind: "origin",   label: "起点" },
    { id: "n_sk_1",     stage: 1, kind: "skirmish", label: "通常戦闘" },
    { id: "n_ev_1",     stage: 1, kind: "event",    label: "選択事象" },
    { id: "n_rest_1",   stage: 1, kind: "rest",     label: "休息" },
    { id: "n_focus_1",  stage: 2, kind: "focused",  label: "集中戦闘" },
    { id: "n_elite_1",  stage: 2, kind: "elite",    label: "精鋭" },
    { id: "n_anom_1",   stage: 2, kind: "anomaly",  label: "変則遭遇" },
    { id: "n_sup_1",    stage: 3, kind: "supply",   label: "補給所" },
    { id: "n_boss",     stage: 4, kind: "guardian", label: "終端" },
  ];
  return {
    title: "MIRROR ROUTE PLATE α",
    nodes,
    edges: deriveEdges(nodes),
    theme: { background: STD_THEME.background, line: STD_THEME.line, showLabels: true, transparentPng: false },
  };
}

function normalize(input) {
  const fb = baseTree();
  if (!input || typeof input !== "object") return fb;
  const src = input;
  const rawNodes = Array.isArray(src.nodes) ? src.nodes : [];
  const parsed = rawNodes
    .filter(n => n && typeof n === "object" && n.id)
    .map((n, i) => {
      const kind = KIND_META[n.kind] ? n.kind : "skirmish";
      const label = isDefaultLabel(kind, clean(n.label)) || !clean(n.label) ? KIND_META[kind].label : clean(n.label);
      return {
        id: clean(n.id, 48) || `n_${i}`,
        stage: Math.max(0, Math.min(MAX_COLUMNS - 1, Number.parseInt(String(n.stage), 10) || 0)),
        kind,
        label,
      };
    });
  const prepared = ensureColumns(parsed.length ? parsed : fb.nodes);
  return {
    title: clean(src.title, 48) || fb.title,
    nodes: prepared,
    edges: deriveEdges(prepared),
    theme: {
      background: typeof src.theme?.background === "string" ? src.theme.background : fb.theme.background,
      line:       typeof src.theme?.line       === "string" ? src.theme.line       : fb.theme.line,
      showLabels: src.theme?.showLabels !== false,
      transparentPng: Boolean(src.theme?.transparentPng),
    },
  };
}

/* ==================== History ==================== */

function createHistory(tree) { return { past: [], present: normalize(tree), future: [] }; }
function recordChange(h, next) {
  const prep = normalize(next);
  if (JSON.stringify(prep) === JSON.stringify(h.present)) return h;
  return { past: [...h.past, clone(h.present)].slice(-HISTORY_LIMIT), present: prep, future: [] };
}
function undoHistory(h) { if (!h.past.length) return h; const p = h.past[h.past.length - 1]; return { past: h.past.slice(0, -1), present: clone(p), future: [clone(h.present), ...h.future].slice(0, HISTORY_LIMIT) }; }
function redoHistory(h) { if (!h.future.length) return h; const n = h.future[0]; return { past: [...h.past, clone(h.present)].slice(-HISTORY_LIMIT), present: clone(n), future: h.future.slice(1) }; }

function loadTree() {
  try { const s = localStorage.getItem(STORAGE_KEY); return normalize(s ? JSON.parse(s) : null); }
  catch { return baseTree(); }
}

function useHistory() {
  const [h, setH] = useState(() => createHistory(loadTree()));
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(h.present)); } catch {} }, [h.present]);
  return {
    tree: h.present,
    mutate: (fn) => setH(prev => { const next = clone(prev.present); fn(next); return recordChange(prev, next); }),
    replace: (next) => setH(prev => recordChange(prev, next)),
    undo: () => setH(prev => undoHistory(prev)),
    redo: () => setH(prev => redoHistory(prev)),
    canUndo: h.past.length > 0,
    canRedo: h.future.length > 0,
  };
}

/* ==================== Layout ==================== */

function layoutFor(tree) {
  const highest = Math.max(0, ...tree.nodes.map(n => n.stage));
  const columns = Array.from({ length: highest + 1 }, (_, s) => tree.nodes.filter(n => n.stage === s));
  const widest = Math.max(1, ...columns.map(c => c.length));
  const COL = 200, ROW = 130;
  const padL = 100, padR = 100, padT = 110, padB = 110;
  const width  = padL + padR + highest * COL;
  const height = padT + padB + (widest - 1) * ROW;
  const positions = {};
  columns.forEach((col, s) => {
    const span = (col.length - 1) * ROW;
    const top = padT + Math.round((height - padT - padB - span) / 2);
    col.forEach((n, i) => { positions[n.id] = { x: padL + s * COL, y: top + i * ROW }; });
  });
  return { width: Math.max(880, width), height: Math.max(560, height), positions, columns };
}

/* ==================== SVG string builder (used by PNG export) ==================== */

function escapeXml(s) { return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;"); }

function iconInnerSvg(kind, color) {
  // returns raw SVG markup for the glyph inside a waypoint (no <svg> wrapper).
  // We simulate what KindGlyph draws with plain strings to guarantee that PNG export
  // stays independent of DOM state.
  switch (kind) {
    case "origin": return `
      <g stroke="${color}" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M0 -20 V 20 M -20 0 H 20" stroke-width="1.4" opacity="0.55"/>
        <path d="M 0 -16 L 3.2 -3.2 L 16 0 L 3.2 3.2 L 0 16 L -3.2 3.2 L -16 0 L -3.2 -3.2 Z" fill="${color}" fill-opacity="0.18" stroke-width="1.5"/>
        <circle r="2.4" fill="${color}" stroke="none"/>
        <path d="M -12 -12 L 12 12 M 12 -12 L -12 12" stroke-width="0.7" opacity="0.35"/>
      </g>`;
    case "skirmish": return `
      <g stroke="${color}" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6">
        <path d="M -14 -14 Q -4 -6, 0 0 Q 4 6, 14 14"/>
        <path d="M 14 -14 Q 4 -6, 0 0 Q -4 6, -14 14"/>
        <path d="M -14 -14 L -10 -8 M -14 -14 L -8 -12" stroke-width="1.2"/>
        <path d="M 14 14 L 10 8 M 14 14 L 8 12" stroke-width="1.2"/>
        <path d="M 14 -14 L 10 -8 M 14 -14 L 8 -12" stroke-width="1.2"/>
        <path d="M -14 14 L -10 8 M -14 14 L -8 12" stroke-width="1.2"/>
        <circle r="2" fill="${color}" stroke="none"/>
      </g>`;
    case "focused": return `
      <g stroke="${color}" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <circle r="17" stroke-width="1" opacity="0.55"/>
        <circle r="12" stroke-width="1" opacity="0.75" stroke-dasharray="2 2"/>
        <path d="M 0 -12 L 10.4 6 L -10.4 6 Z" stroke-width="1.5" fill="${color}" fill-opacity="0.14"/>
        <path d="M 0 12 L 10.4 -6 L -10.4 -6 Z" stroke-width="1.5"/>
        <circle r="1.8" fill="${color}" stroke="none"/>
      </g>`;
    case "elite": return `
      <g stroke="${color}" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M 10 -10 A 14 14 0 1 0 10 10" stroke-width="1.8" fill="${color}" fill-opacity="0.14"/>
        <path d="M 6 -6 A 9 9 0 1 1 6 6" stroke-width="1.4" fill="var(--node-fill)"/>
        <path d="M -14 4 L -6 -2 L -10 -8" stroke-width="1.2" opacity="0.75"/>
        <path d="M -18 -10 L -14 -6 M -18 10 L -14 6 M -20 0 L -15 0" stroke-width="1.2"/>
      </g>`;
    case "anomaly": {
      const pts = [[-13,-8],[-4,-14],[6,-10],[12,-2],[8,10],[-2,12],[-11,6],[0,0]];
      const lines = pts.slice(0, -1).map((p, i) => {
        const q = pts[i + 1];
        return `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}"/>`;
      }).join("") + `<line x1="${pts[0][0]}" y1="${pts[0][1]}" x2="${pts[6][0]}" y2="${pts[6][1]}"/>`;
      const stars = pts.map(([x,y], i) => {
        const r = i === 7 ? 2.4 : i % 2 === 0 ? 1.7 : 1.2;
        return `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" fill-opacity="${i === 7 ? 1 : 0.85}"/>`;
      }).join("");
      return `<g>
        <g fill="none" stroke="${color}" stroke-opacity="0.5" stroke-width="0.9" stroke-dasharray="1 2">${lines}</g>
        ${stars}
      </g>`;
    }
    case "event": return `
      <g stroke="${color}" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M 12 -10 A 14 14 0 1 0 12 10 A 10 10 0 1 1 12 -10 Z" stroke-width="1.4" fill="${color}" fill-opacity="0.10"/>
        <path d="M 0 0 m 0 -1.5 a 1.5 1.5 0 1 1 1.5 1.5 a 3.5 3.5 0 1 1 -3.5 -3.5 a 5.8 5.8 0 1 1 5.8 5.8 a 8 8 0 1 1 -8 -8" stroke-width="1.4"/>
        <circle r="1.3" fill="${color}" stroke="none"/>
      </g>`;
    case "supply": {
      const T = 8;
      const teeth = Array.from({length: T}).map((_, i) => {
        const a = (i / T) * Math.PI * 2;
        const x1 = Math.cos(a) * 11.5, y1 = Math.sin(a) * 11.5;
        const x2 = Math.cos(a) * 15, y2 = Math.sin(a) * 15;
        return `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke-width="2.4"/>`;
      }).join("");
      return `<g stroke="${color}" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <circle r="17" stroke-width="1" opacity="0.4" stroke-dasharray="1 3"/>
        ${teeth}
        <circle r="11" stroke-width="1.4" fill="var(--node-fill)"/>
        <path d="M -6 0 Q 0 -7, 6 0 Q 0 7, -6 0 Z" stroke-width="1.3" fill="${color}" fill-opacity="0.18"/>
        <line x1="-3.5" y1="0" x2="3.5" y2="0" stroke-width="0.9" opacity="0.6"/>
      </g>`;
    }
    case "rest": {
      const rays = Array.from({length: 8}).map((_, i) => {
        const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
        const x1 = Math.cos(a) * 20, y1 = Math.sin(a) * 20;
        const x2 = Math.cos(a) * 22.5, y2 = Math.sin(a) * 22.5;
        return `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke-width="1.2" opacity="0.7"/>`;
      }).join("");
      return `<g stroke="${color}" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <circle r="18" stroke-width="0.8" opacity="0.35" stroke-dasharray="1 3"/>
        <circle r="14" stroke-width="0.8" opacity="0.55"/>
        <circle r="9" stroke-width="1.4" fill="${color}" fill-opacity="0.16"/>
        <circle cx="-3" cy="-2" r="1.1" fill="${color}" stroke="none" opacity="0.7"/>
        <circle cx="2.5" cy="1.8" r="0.9" fill="${color}" stroke="none" opacity="0.6"/>
        <circle cx="-1" cy="4" r="0.7" fill="${color}" stroke="none" opacity="0.5"/>
        ${rays}
      </g>`;
    }
    case "guardian": {
      const rays = Array.from({length: 12}).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const x1 = Math.cos(a) * 15, y1 = Math.sin(a) * 15;
        const r2 = i % 2 === 0 ? 22 : 19;
        const x2 = Math.cos(a) * r2, y2 = Math.sin(a) * r2;
        const w = i % 2 === 0 ? 1.6 : 1;
        const o = i % 2 === 0 ? 0.9 : 0.55;
        return `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke-width="${w}" stroke-opacity="${o}"/>`;
      }).join("");
      return `<g stroke="${color}" fill="none" stroke-linecap="round" stroke-linejoin="round">
        ${rays}
        <circle r="11.5" fill="var(--node-fill)" stroke-width="1.8"/>
        <circle r="11.5" fill="none" stroke="${color}" stroke-opacity="0.4" stroke-width="0.6"/>
        <path d="M 0 -5 L 4 0 L 0 5 L -4 0 Z" stroke-width="1.2" fill="${color}" fill-opacity="0.55"/>
        <circle r="1" fill="var(--node-fill)" stroke="none"/>
      </g>`;
    }
    default: return "";
  }
}

function frameSvg(color, selected, danger) {
  const ticks = [];
  const N = 24;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const inner = i % 6 === 0 ? 30 : 32;
    const outer = i % 6 === 0 ? 35 : 34;
    ticks.push(`<line x1="${(Math.cos(a)*inner).toFixed(2)}" y1="${(Math.sin(a)*inner).toFixed(2)}" x2="${(Math.cos(a)*outer).toFixed(2)}" y2="${(Math.sin(a)*outer).toFixed(2)}" stroke="${color}" stroke-opacity="${i%6===0?0.85:0.35}" stroke-width="${i%6===0?1.4:0.8}" stroke-linecap="round"/>`);
  }
  return `
    <circle r="38" fill="none" stroke="${color}" stroke-opacity="${selected?0.28:0.15}" stroke-width="${selected?6:3.5}"/>
    <circle r="30" fill="var(--node-fill)" stroke="${color}" stroke-width="${selected?2.4:1.6}"/>
    ${danger ? `<circle r="26" fill="none" stroke="${color}" stroke-opacity="0.4" stroke-width="0.7" stroke-dasharray="2 3"/>` : ""}
    ${ticks.join("")}
  `;
}

function buildSvg(tree, { transparent = false } = {}) {
  const { width, height, positions, columns } = layoutFor(tree);
  const bg = transparent ? "" :
    `<rect width="100%" height="100%" fill="${escapeXml(tree.theme.background)}"/>
     <rect x="16" y="16" width="${width - 32}" height="${height - 32}" fill="none" stroke="${escapeXml(tree.theme.line)}" stroke-opacity="0.10" stroke-width="1" rx="14"/>`;

  // background grid (fine astronomy grid)
  const gridLines = [];
  if (!transparent) {
    for (let x = 60; x < width - 40; x += 60) {
      gridLines.push(`<line x1="${x}" y1="30" x2="${x}" y2="${height - 30}" stroke="${escapeXml(tree.theme.line)}" stroke-opacity="0.05" stroke-width="1"/>`);
    }
    for (let y = 60; y < height - 40; y += 60) {
      gridLines.push(`<line x1="30" y1="${y}" x2="${width - 30}" y2="${y}" stroke="${escapeXml(tree.theme.line)}" stroke-opacity="0.05" stroke-width="1"/>`);
    }
  }

  // stage guides
  const guides = columns.map((_, i) => {
    const x = 100 + i * 200;
    return `<line x1="${x}" y1="60" x2="${x}" y2="${height - 60}" stroke="${escapeXml(tree.theme.line)}" stroke-opacity="0.10" stroke-width="1" stroke-dasharray="2 6"/>`;
  }).join("");

  // edges (halo + main)
  const edges = tree.edges.map(([a, b]) => {
    const p = positions[a], q = positions[b];
    if (!p || !q) return "";
    const dx = q.x - p.x;
    const bend = Math.max(50, dx * 0.5);
    const d = `M ${p.x + 40} ${p.y} C ${p.x + bend} ${p.y}, ${q.x - bend} ${q.y}, ${q.x - 40} ${q.y}`;
    return `
      <path d="${d}" fill="none" stroke="${escapeXml(tree.theme.line)}" stroke-opacity="0.18" stroke-width="10" stroke-linecap="round"/>
      <path d="${d}" fill="none" stroke="${escapeXml(tree.theme.line)}" stroke-opacity="0.9" stroke-width="2.5" stroke-linecap="round"/>
    `;
  }).join("");

  // nodes
  const nodes = tree.nodes.map(n => {
    const p = positions[n.id];
    if (!p) return "";
    const meta = KIND_META[n.kind];
    const color = KIND_COLORS[n.kind];
    const label = tree.theme.showLabels && n.label
      ? `<text x="${p.x}" y="${p.y + 55}" text-anchor="middle" fill="#e8eef2" font-family="'Noto Sans JP', sans-serif" font-size="13" font-weight="500" style="paint-order: stroke; stroke: #050810; stroke-width: 3; stroke-linejoin: round;">${escapeXml(n.label)}</text>`
      : "";
    return `<g transform="translate(${p.x} ${p.y})">
      ${frameSvg(color, false, meta.danger)}
      ${iconInnerSvg(n.kind, color)}
    </g>${label}`;
  }).join("");

  // title plate (top left) — only when not transparent
  const plate = transparent ? "" : `
    <g font-family="'JetBrains Mono', monospace" fill="#e6b866">
      <rect x="30" y="30" width="360" height="52" fill="none" stroke="#e6b866" stroke-opacity="0.35" stroke-width="0.8"/>
      <text x="46" y="52" font-size="10" letter-spacing="3" fill="#e6b866" fill-opacity="0.7">MIRROR ROUTE PLATE</text>
      <text x="46" y="72" font-size="15" letter-spacing="1" fill="#e8eef2">${escapeXml(tree.title)}</text>
    </g>
    <g font-family="'JetBrains Mono', monospace">
      <text x="${width - 30}" y="52" text-anchor="end" font-size="9" letter-spacing="2" fill="#7ae0e0" fill-opacity="0.7">FORWARD ONLY / ${columns.length} COL · ${tree.nodes.length} WP · ${tree.edges.length} EDGE</text>
      <text x="${width - 30}" y="72" text-anchor="end" font-size="9" letter-spacing="2" fill="#e6b866" fill-opacity="0.7">LBT_MIRROR-DUNGEON-GENERATOR</text>
    </g>
    <g font-family="'JetBrains Mono', monospace" opacity="0.5">
      <line x1="30" y1="${height - 32}" x2="${width - 30}" y2="${height - 32}" stroke="#7ae0e0" stroke-opacity="0.25" stroke-width="1" stroke-dasharray="2 6"/>
      <text x="46" y="${height - 12}" font-size="9" letter-spacing="2" fill="#7ae0e0" fill-opacity="0.7">ROUTE FIELD / ${String(tree.nodes.length).padStart(2,"0")} WAYPOINTS</text>
      <text x="${width - 30}" y="${height - 12}" text-anchor="end" font-size="9" letter-spacing="2" fill="#e6b866" fill-opacity="0.7">SIDEREAL BEARING · ORBIT-01</text>
    </g>
  `;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <style>
        :root { --node-fill: #050810; }
      </style>
    </defs>
    ${bg}
    ${gridLines.join("")}
    ${guides}
    ${plate}
    ${edges}
    ${nodes}
  </svg>`;
}

/* ==================== Downloads (SVG + PNG) ==================== */

function downloadText(filename, body, type) {
  const url = URL.createObjectURL(new Blob([body], { type }));
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 800);
}

function exportPng(tree, { onDone, onError }) {
  const transparent = tree.theme.transparentPng;
  const raw = buildSvg(tree, { transparent });
  // Substitute the CSS var --node-fill with a literal (Canvas can't resolve CSS vars).
  const substituted = raw.replaceAll("var(--node-fill)", transparent ? "#050810" : tree.theme.background);
  const svgBlob = new Blob([substituted], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();
  img.onload = () => {
    const { width, height } = layoutFor(tree);
    const scale = 2;
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext("2d");
    if (!transparent) {
      ctx.fillStyle = tree.theme.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    canvas.toBlob((blob) => {
      if (!blob) { onError?.("PNG生成に失敗しました"); return; }
      const pngUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = `mirror-route-plate${transparent ? "-transparent" : ""}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(pngUrl), 1200);
      onDone?.();
    }, "image/png");
  };
  img.onerror = (e) => { URL.revokeObjectURL(url); onError?.("PNG生成中にエラー"); console.error(e); };
  img.src = url;
}

/* ==================== Canvas (interactive) ==================== */

function RouteCanvas({ tree, selectedId, onNodeClick, onNodeDouble, radialFor, setRadialFor, onKindPick, zoom, setZoom, pan, setPan }) {
  const { width, height, positions, columns } = layoutFor(tree);
  const viewportRef = useRef(null);
  const dragRef = useRef(null);
  const movedRef = useRef(false);
  const suppressClickRef = useRef(false);

  const isNarrow = () => window.matchMedia("(max-width: 720px)").matches;

  const fit = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const z = Math.min(1, Math.min((vp.clientWidth - 40) / width, (vp.clientHeight - 40) / height));
    setZoom(Number(z.toFixed(2)));
    setPan({ x: 0, y: 0 });
  }, [width, height, setZoom, setPan]);

  useEffect(() => {
    fit();
    const ob = new ResizeObserver(fit);
    if (viewportRef.current) ob.observe(viewportRef.current);
    return () => ob.disconnect();
  }, [fit]);

  const changeZoom = (step) => setZoom(v => Math.max(0.3, Math.min(2.4, Number((v + step).toFixed(2)))));

  const onPointerDown = (e) => {
    if (radialFor) return; // don't pan when radial is open
    if (e.button !== 0 && e.pointerType === "mouse") return;
    if (e.target.closest("[data-node]") || e.target.closest(".radial-root")) return;
    dragRef.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
    movedRef.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) movedRef.current = true;
    if (movedRef.current) setPan(v => ({ x: v.x + dx, y: v.y + dy }));
    dragRef.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e) => {
    if (dragRef.current?.id !== e.pointerId) return;
    if (movedRef.current) { suppressClickRef.current = true; setTimeout(() => (suppressClickRef.current = false), 0); }
    dragRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // radial position (in viewport pixel coords)
  const radialScreenPos = useMemo(() => {
    if (!radialFor) return null;
    const vp = viewportRef.current;
    if (!vp) return null;
    const p = positions[radialFor];
    if (!p) return null;
    const rect = vp.getBoundingClientRect();
    const cx = rect.width / 2 + pan.x + (p.x - width / 2) * zoom;
    const cy = rect.height / 2 + pan.y + (p.y - height / 2) * zoom;
    return { cx, cy };
  }, [radialFor, positions, pan, zoom, width, height]);

  return (
    <div className="canvas-viewport"
      ref={viewportRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={(e) => { if (!e.ctrlKey && !e.metaKey) return; e.preventDefault(); changeZoom(e.deltaY > 0 ? -0.08 : 0.08); }}
    >
      {/* astronomy grid backdrop */}
      <div className="canvas-backdrop" aria-hidden="true" />

      <div className="canvas-stage" style={{
        width, height,
        left: `calc(50% - ${width / 2}px)`, top: `calc(50% - ${height / 2}px)`,
        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
      }}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="route-svg">
          {/* grid */}
          <g aria-hidden="true" opacity="0.5">
            {Array.from({ length: Math.floor((width - 100) / 60) }).map((_, i) => (
              <line key={"gx" + i} x1={60 + i * 60} y1="30" x2={60 + i * 60} y2={height - 30} stroke={tree.theme.line} strokeOpacity="0.06" strokeWidth="1" />
            ))}
            {Array.from({ length: Math.floor((height - 100) / 60) }).map((_, i) => (
              <line key={"gy" + i} x1="30" y1={60 + i * 60} x2={width - 30} y2={60 + i * 60} stroke={tree.theme.line} strokeOpacity="0.06" strokeWidth="1" />
            ))}
          </g>

          {/* stage guides */}
          {columns.map((_, i) => (
            <line key={i} x1={100 + i * 200} x2={100 + i * 200} y1="60" y2={height - 60} stroke={tree.theme.line} strokeOpacity="0.12" strokeWidth="1" strokeDasharray="2 6" />
          ))}

          {/* corner plates */}
          <g fontFamily="'JetBrains Mono', monospace" pointerEvents="none">
            <rect x="30" y="30" width="360" height="52" fill="none" stroke="#e6b866" strokeOpacity="0.35" strokeWidth="0.8" />
            <text x="46" y="52" fontSize="10" letterSpacing="3" fill="#e6b866" fillOpacity="0.7">MIRROR ROUTE PLATE</text>
            <text x="46" y="72" fontSize="15" letterSpacing="1" fill="#e8eef2">{tree.title}</text>
            <text x={width - 30} y="52" textAnchor="end" fontSize="9" letterSpacing="2" fill="#7ae0e0" fillOpacity="0.7">FORWARD ONLY / {columns.length} COL · {tree.nodes.length} WP · {tree.edges.length} EDGE</text>
            <text x={width - 30} y="72" textAnchor="end" fontSize="9" letterSpacing="2" fill="#e6b866" fillOpacity="0.7">LBT_MIRROR-DUNGEON-GENERATOR</text>
            <line x1="30" y1={height - 32} x2={width - 30} y2={height - 32} stroke="#7ae0e0" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="2 6" />
            <text x="46" y={height - 12} fontSize="9" letterSpacing="2" fill="#7ae0e0" fillOpacity="0.7">ROUTE FIELD / {String(tree.nodes.length).padStart(2,"0")} WAYPOINTS</text>
            <text x={width - 30} y={height - 12} textAnchor="end" fontSize="9" letterSpacing="2" fill="#e6b866" fillOpacity="0.7">SIDEREAL BEARING · ORBIT-01</text>
          </g>

          {/* edges */}
          {tree.edges.map(([a, b]) => {
            const p = positions[a], q = positions[b];
            if (!p || !q) return null;
            const bend = Math.max(50, (q.x - p.x) * 0.5);
            const d = `M ${p.x + 40} ${p.y} C ${p.x + bend} ${p.y}, ${q.x - bend} ${q.y}, ${q.x - 40} ${q.y}`;
            return (
              <g key={a + "_" + b}>
                <path d={d} fill="none" stroke={tree.theme.line} strokeOpacity="0.18" strokeWidth="10" strokeLinecap="round" />
                <path d={d} fill="none" stroke={tree.theme.line} strokeOpacity="0.9" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            );
          })}

          {/* waypoints */}
          {tree.nodes.map(n => {
            const p = positions[n.id];
            const selected = selectedId === n.id;
            const color = KIND_COLORS[n.kind];
            const meta = KIND_META[n.kind];
            return (
              <g key={n.id} transform={`translate(${p.x} ${p.y})`} data-node style={{ cursor: "pointer" }}>
                <g
                  role="button"
                  tabIndex={0}
                  aria-label={`${n.label}を編集`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (suppressClickRef.current) return;
                    onNodeClick(n.id);
                  }}
                  onDoubleClick={(e) => { e.stopPropagation(); onNodeDouble?.(n.id); }}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onNodeClick(n.id); } }}
                >
                  <WaypointFrame color={color} selected={selected} danger={meta.danger} />
                  <KindGlyph kind={n.kind} color={color} />
                  {tree.theme.showLabels && (
                    <text
                      y="55" textAnchor="middle" fill="#e8eef2"
                      fontFamily="'Noto Sans JP', sans-serif" fontSize="13" fontWeight="500"
                      style={{ paintOrder: "stroke", stroke: "#050810", strokeWidth: 3, strokeLinejoin: "round" }}
                    >
                      {n.label}
                    </text>
                  )}
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* radial menu (in viewport coords, outside the scaled stage) */}
      {radialFor && radialScreenPos && (
        <RadialKindMenu
          open
          cx={radialScreenPos.cx}
          cy={radialScreenPos.cy}
          currentKind={tree.nodes.find(n => n.id === radialFor)?.kind || "skirmish"}
          kinds={KIND_META}
          kindColors={KIND_COLORS}
          onPick={(k) => { onKindPick(radialFor, k); setRadialFor(null); }}
          onClose={() => setRadialFor(null)}
        />
      )}

      <div className="canvas-nav" aria-label="表示倍率">
        <span className="canvas-nav-label">ZOOM</span>
        <div className="canvas-nav-group">
          <button type="button" onClick={(e) => { e.stopPropagation(); changeZoom(-0.1); }} aria-label="縮小">−</button>
          <button type="button" onClick={(e) => { e.stopPropagation(); fit(); }} aria-label="全体表示">▣</button>
          <button type="button" onClick={(e) => { e.stopPropagation(); changeZoom(0.1); }} aria-label="拡大">＋</button>
        </div>
        <span className="zoom-readout">{Math.round(zoom * 100)}%</span>
      </div>
    </div>
  );
}

/* ==================== Header logo (celestial mark) ==================== */

function BrandMark({ size = 40 }) {
  return (
    <svg viewBox="-32 -32 64 64" width={size} height={size} aria-hidden="true">
      <circle r="28" fill="none" stroke="#e6b866" strokeOpacity="0.6" strokeWidth="1" />
      <circle r="22" fill="none" stroke="#7ae0e0" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="1 3" />
      {/* two convergent orbits */}
      <path d="M -26 4 Q -6 -22, 22 -10" fill="none" stroke="#7ae0e0" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M -22 -12 Q 0 12, 24 6" fill="none" stroke="#e6b866" strokeWidth="1.6" strokeLinecap="round" />
      {/* focus star */}
      <path d="M 6 -4 L 8 -1 L 11 0 L 8 1 L 6 4 L 4 1 L 1 0 L 4 -1 Z" fill="#e6b866" />
      <circle r="1.3" cx="6" cy="0" fill="#050810" />
    </svg>
  );
}

/* ==================== Main App ==================== */

function App() {
  const { tree, mutate, replace, undo, redo, canUndo, canRedo } = useHistory();
  const [selectedId, setSelectedId] = useState(() => tree.nodes[0]?.id ?? "");
  const [notice, setNotice] = useState("");
  const [radialFor, setRadialFor] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const fileRef = useRef(null);
  const layout = useMemo(() => layoutFor(tree), [tree]);
  const selected = tree.nodes.find(n => n.id === selectedId) ?? tree.nodes[0];
  const columnCount = layout.columns.length;

  const message = (t) => { setNotice(t); setTimeout(() => setNotice(""), 2400); };

  useEffect(() => {
    if (!tree.nodes.some(n => n.id === selectedId)) setSelectedId(tree.nodes[0]?.id ?? "");
  }, [tree.nodes, selectedId]);

  const performUndo = () => { if (!canUndo) { message("これ以上戻せる編集はありません"); return; } undo(); message("編集を1つ戻しました"); };
  const performRedo = () => { if (!canRedo) { message("やり直せる編集はありません"); return; } redo(); message("編集を1つやり直しました"); };

  useEffect(() => {
    const onKey = (e) => {
      if ((!e.ctrlKey && !e.metaKey) || e.altKey) return;
      const t = e.target;
      if (t?.closest?.("input, textarea, select, [contenteditable='true']")) return;
      const k = e.key.toLowerCase();
      if (k === "z" && e.shiftKey) { e.preventDefault(); performRedo(); }
      else if (k === "z") { e.preventDefault(); performUndo(); }
      else if (k === "y") { e.preventDefault(); performRedo(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canUndo, canRedo]);

  const updateNode = (id, patch) => mutate(draft => {
    const n = draft.nodes.find(x => x.id === id);
    if (n) Object.assign(n, patch);
  });

  const setNodeKind = (id, kind) => {
    const node = tree.nodes.find(n => n.id === id);
    if (!node) return;
    if (node.kind === kind) return;
    const label = isDefaultLabel(node.kind, node.label) || !node.label.trim() ? KIND_META[kind].label : node.label;
    updateNode(id, { kind, label });
    setSelectedId(id);
    message(`${KIND_META[kind].label} へ変更しました`);
  };

  const setColumnCount = (count) => {
    mutate(draft => {
      const cur = Math.max(...draft.nodes.map(n => n.stage)) + 1;
      if (count < cur) draft.nodes = draft.nodes.filter(n => n.stage < count);
      for (let s = cur; s < count; s++) draft.nodes.push(seedNode(s));
    });
    message(count < columnCount ? "列を削減しました" : "列を追加しました");
  };

  const addNodeInColumn = (stage) => {
    const count = tree.nodes.filter(n => n.stage === stage).length;
    if (count >= MAX_NODES_PER_COLUMN) { message("1列に置ける地点は3つまでです"); return; }
    const n = seedNode(stage, count);
    mutate(d => d.nodes.push(n));
    setSelectedId(n.id);
    message(`列 ${stage + 1} に地点を追加しました`);
  };

  const removeSelected = () => {
    if (!selected || selected.stage === 0) { message("起点は削除できません"); return; }
    const count = tree.nodes.filter(n => n.stage === selected.stage).length;
    if (count <= 1) { message("各列には少なくとも1つの地点を残します"); return; }
    mutate(d => { d.nodes = d.nodes.filter(n => n.id !== selected.id); });
    setSelectedId(tree.nodes.find(n => n.id !== selected.id)?.id ?? tree.nodes[0]?.id ?? "");
    message("地点を削除しました");
  };

  const resetAll = () => {
    if (!confirm("経路を初期テンプレートへ戻しますか？（元に戻すは可能）")) return;
    replace(baseTree());
    setSelectedId("n_origin");
    message("初期テンプレートへ戻しました");
  };

  const importTree = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try { const next = normalize(JSON.parse(String(r.result))); replace(next); setSelectedId(next.nodes[0]?.id ?? ""); message("設定を読み込みました"); }
      catch { message("設定を読み込めませんでした"); }
    };
    r.readAsText(f);
    e.target.value = "";
  };

  const onNodeClick = (id) => {
    setSelectedId(id);
    // toggle radial on the same node
    setRadialFor(prev => prev === id ? null : id);
  };

  return (
    <div className="app">
      {/* Astro grid backdrop for entire page */}
      <div className="page-backdrop" aria-hidden="true" />

      <header className="topline">
        <div className="brand">
          <BrandMark size={44} />
          <div className="brand-text">
            <div className="brand-title">LBT_MIRROR-DUNGEON-GENERATOR</div>
            <div className="brand-sub">CELESTIAL DUNGEON CARTOGRAPHER · SIDEREAL ROUTE FORGE</div>
          </div>
        </div>
        <div className="topline-meta">
          <div className="meta-cell"><span>PLATE</span><b>OR-01</b></div>
          <div className="meta-cell"><span>SESSION</span><b>{new Date().toISOString().slice(0, 10)}</b></div>
        </div>
      </header>

      <section className="command-strip" aria-label="ツリー操作">
        <div className="command-copy">
          <p>ROUTE REGISTER / CURRENT PLATE</p>
          <input
            className="route-title-input"
            value={tree.title}
            maxLength={48}
            onChange={(e) => mutate(d => { d.theme; d.title = e.target.value; })}
            aria-label="ルート名"
          />
          <span>{columnCount} 列 / {tree.nodes.length} 地点 / {tree.edges.length} 接続</span>
        </div>
        <div className="command-actions">
          <button className="btn primary" onClick={() => addNodeInColumn(Math.min(columnCount - 1, 1))}>
            ＋ 地点を追加
          </button>
          <button className="btn ghost" onClick={() => fileRef.current?.click()} aria-label="設定を読む">
            ▲ 読込
          </button>
          <button className="btn ghost" onClick={() => { downloadText("mirror-route-plate.json", JSON.stringify(tree, null, 2), "application/json"); message("設定を保存しました"); }}>
            ▼ 保存
          </button>
          <div className="history-group" role="group" aria-label="編集履歴">
            <button className="btn ghost small" onClick={performUndo} disabled={!canUndo} title="編集を戻す (Ctrl/Cmd + Z)">↺ 戻す</button>
            <button className="btn ghost small" onClick={performRedo} disabled={!canRedo} title="やり直す (Ctrl/Cmd + Shift + Z)">↻ やり直す</button>
          </div>
        </div>
      </section>

      <section className="workspace">
        <aside className="editor-rail" aria-label="編集レール">
          <div className="rail-title">
            <div>
              <p className="eyebrow">ROUTE SCHEMA</p>
              <h2>列と地点の設定</h2>
            </div>
            <span className="tag">自動接続</span>
          </div>

          <section className="schema-box">
            <div className="box-heading"><span className="dot" /> <b>経路の長さ</b></div>
            <label className="field">
              <span>始点から何列まで進めるか</span>
              <select value={String(columnCount)} onChange={(e) => setColumnCount(Number(e.target.value))}>
                {Array.from({ length: MAX_COLUMNS - 1 }, (_, i) => i + 2).map(c => (
                  <option key={c} value={String(c)}>{c} 列</option>
                ))}
              </select>
            </label>
            <p className="hint">隣り合う列の地点はすべて自動で接続されます。</p>
          </section>

          <section className="column-planner">
            <div className="box-heading"><span className="dot" /> <b>各列の地点</b></div>
            {layout.columns.map((column, stage) => (
              <div className="route-column" key={stage}>
                <div className="column-heading">
                  <span>列 {stage + 1}</span>
                  <small>{stage === 0 ? "起点" : `${column.length} 地点`}</small>
                </div>
                {column.map(n => {
                  const isSel = selected?.id === n.id;
                  const color = KIND_COLORS[n.kind];
                  return (
                    <div className={`column-node ${isSel ? "is-current" : ""}`} key={n.id}>
                      <button type="button" className="node-chip" onClick={() => setSelectedId(n.id)} aria-label={`${n.label}を編集`}>
                        <svg viewBox="-40 -40 80 80" width="42" height="42" aria-hidden="true">
                          <WaypointFrame color={color} selected={isSel} danger={KIND_META[n.kind].danger} />
                          <KindGlyph kind={n.kind} color={color} />
                        </svg>
                        <span className="chip-text">
                          <b>{n.label}</b>
                          <small>{KIND_META[n.kind].short}</small>
                        </span>
                      </button>
                      {stage === 0 ? (
                        <span className="locked-kind">開始地点固定</span>
                      ) : (
                        <div className="node-kind-control">
                          <select
                            aria-label={`${n.label}の地点種別`}
                            value={n.kind}
                            onPointerDown={() => setSelectedId(n.id)}
                            onFocus={() => setSelectedId(n.id)}
                            onChange={(e) => setNodeKind(n.id, e.target.value)}
                          >
                            {KIND_ORDER.filter(k => k !== "origin").map(k => (
                              <option key={k} value={k}>{KIND_META[k].label}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  );
                })}
                {stage > 0 && (
                  <button
                    type="button"
                    className="add-column-node"
                    onClick={() => addNodeInColumn(stage)}
                    disabled={column.length >= MAX_NODES_PER_COLUMN}
                  >
                    ＋ この列に追加
                  </button>
                )}
              </div>
            ))}
          </section>

          <section className="selected-box">
            <div className="box-heading"><span className="dot" /> <b>選択中の地点</b></div>
            {selected && (
              <>
                <div className="selected-readout">
                  <svg viewBox="-40 -40 80 80" width="66" height="66" aria-hidden="true">
                    <WaypointFrame color={KIND_COLORS[selected.kind]} selected danger={KIND_META[selected.kind].danger} />
                    <KindGlyph kind={selected.kind} color={KIND_COLORS[selected.kind]} />
                  </svg>
                  <div>
                    <small>{KIND_META[selected.kind].short}</small>
                    <strong>{KIND_META[selected.kind].label}</strong>
                    <p>{KIND_META[selected.kind].description}</p>
                  </div>
                </div>
                <label className="field">
                  <span>表示名</span>
                  <input value={selected.label} maxLength={28} onChange={(e) => updateNode(selected.id, { label: e.target.value })} />
                </label>
                <p className="hint">マップ上の地点をクリックすると、種別変更用の円形メニューが開きます。</p>
                <button className="btn danger" onClick={removeSelected}>この地点を削除</button>
              </>
            )}
          </section>

          <section className="appearance-box">
            <div className="box-heading"><span className="dot" /> <b>マップの見た目</b></div>
            <div className="two-fields">
              <label className="field"><span>背景</span><input type="color" value={tree.theme.background} onChange={(e) => mutate(d => { d.theme.background = e.target.value; })} /></label>
              <label className="field"><span>接続線</span><input type="color" value={tree.theme.line} onChange={(e) => mutate(d => { d.theme.line = e.target.value; })} /></label>
            </div>
            <button className="btn ghost small" onClick={() => { mutate(d => { d.theme.background = STD_THEME.background; d.theme.line = STD_THEME.line; }); message("標準配色を適用しました"); }}>
              ↺ 標準配色
            </button>
            <label className="check">
              <input type="checkbox" checked={tree.theme.showLabels} onChange={(e) => mutate(d => { d.theme.showLabels = e.target.checked; })} />
              <span>地点名を表示する</span>
            </label>
            <label className="check">
              <input type="checkbox" checked={tree.theme.transparentPng} onChange={(e) => mutate(d => { d.theme.transparentPng = e.target.checked; })} />
              <span>PNGを透過背景で書き出す</span>
            </label>
          </section>

          <button className="btn ghost small full" onClick={resetAll}>↺ 初期テンプレートへ戻す</button>
        </aside>

        <article className="canvas-panel">
          <header className="canvas-head">
            <div>
              <p className="eyebrow">ORBITAL CANVAS</p>
              <h2>移動ツリー</h2>
              <span className="head-hint">地点をクリック → 円形メニューで種別を即変更 / ドラッグで移動 · Ctrl+ホイールでズーム</span>
            </div>
            <div className="export-actions">
              <button className="btn ghost" onClick={() => { downloadText("mirror-route-plate.svg", buildSvg(tree, { transparent: tree.theme.transparentPng }), "image/svg+xml;charset=utf-8"); message("SVGを保存しました"); }}>
                ⬇ SVG
              </button>
              <button className="btn primary" onClick={() => exportPng(tree, { onDone: () => message("PNGを保存しました"), onError: (m) => message(m) })}>
                ⬇ PNG {tree.theme.transparentPng ? "(透過)" : ""}
              </button>
            </div>
          </header>

          <RouteCanvas
            tree={tree}
            selectedId={selected?.id}
            onNodeClick={onNodeClick}
            radialFor={radialFor}
            setRadialFor={setRadialFor}
            onKindPick={setNodeKind}
            zoom={zoom} setZoom={setZoom}
            pan={pan} setPan={setPan}
          />

          <footer className="canvas-footer">
            <span>左から右への一方向ルート。列を増やすと次の経路が生まれます。</span>
            <div className="legend">
              {KIND_ORDER.map(k => (
                <div key={k} className="legend-item">
                  <svg viewBox="-40 -40 80 80" width="22" height="22"><WaypointFrame color={KIND_COLORS[k]} danger={KIND_META[k].danger} /><KindGlyph kind={k} color={KIND_COLORS[k]} /></svg>
                  <span>{KIND_META[k].label}</span>
                </div>
              ))}
            </div>
          </footer>
        </article>
      </section>

      <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={importTree} />
      {notice && <div className="toast" role="status">{notice}</div>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
