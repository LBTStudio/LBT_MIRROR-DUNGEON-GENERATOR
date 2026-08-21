

const IconDefs = ({ id = "iconglow" }) => (
  <defs>
    <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="1.2" stdDeviation="1.0" floodColor="#000" floodOpacity="0.55" />
    </filter>
    <pattern id={`${id}-warntape`} width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(-14)">
      <rect width="12" height="12" fill="#f0d24b" />
      <path d="M -3 8 L 8 -3 M 4 15 L 15 4" stroke="#161318" strokeWidth="2.6" />
    </pattern>
  </defs>
);

const IconOrigin = ({ ink = "#eae3d5" }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <IconDefs id="ori" />
    <g filter="url(#ori-shadow)" strokeLinejoin="round" strokeLinecap="round" fill="none">
      
      <path d="M 8 26 H 92 L 82 78 H 18 Z" stroke={ink} strokeWidth="7" />
      <path d="M 8 26 H 92 L 82 78 H 18 Z" stroke={ink} strokeWidth="2.5" />
      
      <circle cx="50" cy="52" r="18" stroke={ink} strokeWidth="5" />
      
      <path d="M 22 40 H 78" stroke={ink} strokeWidth="5.5" />
      
      <path d="M 24 64 H 76" stroke={ink} strokeWidth="5.5" />
    </g>
  </svg>
);

const IconSkirmish = ({ ink = "#eae3d5" }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <IconDefs id="sk" />
    <g filter="url(#sk-shadow)">
      
      <g transform="translate(76 22)">
        
        <path d="M 0 -18 L 5 -5 L 18 0 L 5 5 L 0 18 L -5 5 L -18 0 L -5 -5 Z"
              fill={ink} stroke="#0b0a0d" strokeWidth="3" strokeLinejoin="miter" />
      </g>

      

      
      <path d="M 60 80 L 68 72 L 32 36 L 20 30 L 24 44 Z"
            fill={ink} stroke="#0b0a0d" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      
      <path d="M 60 76 L 30 44" fill="none" stroke="#0b0a0d" strokeWidth="1.8" strokeOpacity="0.5" strokeLinecap="round" />

      
      <g fill={ink} stroke="#0b0a0d" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
        
        <path d="
          M 46 90
          L 50 94
          L 82 63
          L 78 59
          L 82 55
          L 78 51
          L 46 82
          L 50 86
          Z" />
      </g>

      
      <path d="M 62 78 L 78 94 L 82 90 L 66 74 Z"
            fill={ink} stroke="#0b0a0d" strokeWidth="3" strokeLinejoin="round" />

      
      <circle cx="82" cy="93" r="6.5"
              fill={ink} stroke="#0b0a0d" strokeWidth="3" />
      <circle cx="82" cy="93" r="2.4"
              fill="#0b0a0d" stroke="none" />
    </g>
  </svg>
);

const IconFocused = ({ ink = "#eae3d5", accent = "#d4a24b" }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <IconDefs id="fo" />
    <g filter="url(#fo-shadow)">
      
      <path
        d="
          M 26 14 L 34 32
          L 26 44 L 30 82 L 44 86 L 50 84 L 56 86 L 70 82 L 74 44 L 66 32 L 74 14
          L 62 30 L 50 26 L 38 30 Z
        "
        fill="none" stroke={ink} strokeWidth="7" strokeLinejoin="round" strokeLinecap="round"
      />
      <path
        d="
          M 26 14 L 34 32
          L 26 44 L 30 82 L 44 86 L 50 84 L 56 86 L 70 82 L 74 44 L 66 32 L 74 14
          L 62 30 L 50 26 L 38 30 Z
        "
        fill="none" stroke={ink} strokeWidth="3" strokeLinejoin="round"
      />
      
      <circle cx="41" cy="54" r="4" fill={ink} />
      <circle cx="59" cy="54" r="4" fill={ink} />
      
      <path d="M 42 78 H 58" stroke={ink} strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

const IconElite = ({ ink = "#eae3d5", accent = "#c8443c", warn = "#f0d24b", variant = "full" }) => {
  
  
  const R = 32, CX = 50, CY = 50;
  const pts = Array.from({ length: 8 }, (_, i) => {
    const ang = (Math.PI / 4) * i - Math.PI / 8; 
    return [CX + R * Math.cos(ang), CY + R * Math.sin(ang)];
  });
  const octPath = "M " + pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(" L ") + " Z";
  
  const tapeAngles = variant === "quiet" ? [] : [-60, -25, 30, 65];
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <IconDefs id="el" />
      <g filter="url(#el-shadow)">
        
        {tapeAngles.map((deg, i) => {
          const y = 16 + i * 20;
          return (
            <g key={`t${i}`} transform={`rotate(${deg} 50 50)`}>
              <rect x="-20" y={y} width="140" height="9" fill={warn} />
              <rect x="-20" y={y - 0.5} width="140" height="1" fill="#161318" opacity="0.35" />
              <rect x="-20" y={y + 8} width="140" height="1" fill="#161318" opacity="0.35" />
              <text x="50" y={y + 7} textAnchor="middle" fontSize="8"
                    fontFamily="Impact, 'Bebas Neue', sans-serif" fontWeight="900"
                    fill="#161318" letterSpacing="0.8">!WARNING!  !WARNING!  !WARNING!</text>
            </g>
          );
        })}
        
        <path d={octPath}
              fill="#0b0a0d" stroke={ink} strokeWidth="7" strokeLinejoin="miter" />
        <path d={octPath}
              fill="none" stroke={ink} strokeWidth="2.5" strokeLinejoin="miter" />
        
        <g transform={`translate(${CX} ${CY})`}>
          <path d="M -9 -11 H 9 M -9 0 H 6 M -9 11 H 9"
                stroke={accent} strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </g>
      </g>
    </svg>
  );
};

const IconAbnormality = ({ ink = "#eae3d5", accent = "#c8443c" }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <IconDefs id="ab" />
    <g filter="url(#ab-shadow)">
      
      <path d="M 50 10 L 88 86 H 12 Z"
            fill="none" stroke={ink} strokeWidth="7" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M 50 10 L 88 86 H 12 Z"
            fill="none" stroke={ink} strokeWidth="3" strokeLinejoin="round" />
      
      <path d="M 50 20 L 56 30 L 44 30 Z" fill={ink} />
      
      <circle cx="42" cy="50" r="4" fill={ink} />
      <circle cx="58" cy="50" r="4" fill={ink} />
      
      <path d="M 30 82 L 36 68 L 42 82 Z" fill="none" stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M 58 82 L 64 68 L 70 82 Z" fill="none" stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
    </g>
  </svg>
);

const IconGuardian = ({ ink = "#eae3d5", accent = "#c8443c" }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <IconDefs id="gu" />
    <g filter="url(#gu-shadow)">
      
      <path
        d="M 50 12 C 68 22 82 34 84 50 C 82 68 68 78 60 82
           C 66 70 62 60 54 56
           C 60 50 56 40 50 34
           C 44 40 40 50 46 56
           C 38 60 34 70 40 82
           C 32 78 18 68 16 50
           C 18 34 32 22 50 12 Z"
        fill={accent} stroke={ink} strokeWidth="3" strokeLinejoin="round"
      />
      
      <g stroke={ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="#0b0a0d">
        <path d="M 50 26 L 54 30 V 66 L 50 74 L 46 66 V 30 Z" />
        <path d="M 38 38 H 62" strokeWidth="4" />
        <path d="M 50 74 V 84" />
      </g>
    </g>
  </svg>
);

const IconEvent = ({ ink = "#eae3d5", accent = "#d4a24b" }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <IconDefs id="ev" />
    <g filter="url(#ev-shadow)">
      
      <path
        d="M 32 34
           C 32 20 44 12 54 14
           C 68 18 72 34 62 44
           L 52 54 V 66"
        fill="none" stroke={ink} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
      
      <rect x="45" y="76" width="14" height="14" rx="2" fill={ink} />
    </g>
  </svg>
);

const IconSupply = ({ ink = "#eae3d5", dark = "#0b0a0d", midGray = "#3a333a" }) => {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <IconDefs id="sp" />
      <g filter="url(#sp-shadow)">
        
        <rect x="12" y="42" width="76" height="46" rx="1"
              fill={ink} stroke={dark} strokeWidth="3" />
        
        <rect x="12" y="82" width="76" height="6" fill={dark} opacity="0.85" />
        <path d="M 22 85 H 78" stroke={ink} strokeWidth="0.6" opacity="0.4" />

        
        <rect x="16" y="52" width="20" height="26" fill={dark} stroke={dark} strokeWidth="1.5" />
        
        <g stroke={ink} strokeWidth="1.2" opacity="0.55">
          <path d="M 16 65 H 36" />
          <path d="M 26 52 V 78" />
        </g>
        
        <path d="M 18 54 L 22 54 L 34 66 L 34 70 Z" fill={ink} opacity="0.12" />

        
        <rect x="64" y="52" width="20" height="26" fill={dark} stroke={dark} strokeWidth="1.5" />
        <g stroke={ink} strokeWidth="1.2" opacity="0.55">
          <path d="M 64 65 H 84" />
          <path d="M 74 52 V 78" />
        </g>
        <path d="M 66 54 L 70 54 L 82 66 L 82 70 Z" fill={ink} opacity="0.12" />

        
        <rect x="40" y="52" width="20" height="30" fill={dark} stroke={dark} strokeWidth="1.5" />
        
        <path d="M 50 52 V 82" stroke={ink} strokeWidth="1.6" />
        
        <path d="M 40 60 H 60" stroke={ink} strokeWidth="1" opacity="0.5" />
        
        <rect x="45" y="66" width="1.6" height="6" fill={ink} />
        <rect x="53.4" y="66" width="1.6" height="6" fill={ink} />

        
        
        <rect x="8" y="20" width="84" height="22" rx="1"
              fill={ink} stroke={dark} strokeWidth="3" />
        
        <rect x="10" y="22" width="80" height="6" fill={ink} />
        <rect x="10" y="28" width="80" height="6" fill={midGray} />
        <rect x="10" y="34" width="80" height="6" fill={ink} />
        
        <path d="M 10 28 H 90 M 10 34 H 90" stroke={dark} strokeWidth="0.6" opacity="0.55" />

        
        <g transform="translate(50 31)">
          
          <circle r="8.5" fill={ink} stroke={dark} strokeWidth="1.6" />
          
          <path d="M -5.5 2.5 L -3 -2 L 0 2.5 L 3 -2 L 5.5 2.5"
                fill="none" stroke={dark} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          
          <path d="M -1.5 5 L 0 6.5 L 1.5 5 Z" fill={dark} />
        </g>

        
        <path d="M 12 42 H 88" stroke={dark} strokeWidth="1.5" opacity="0.6" />
      </g>
    </svg>
  );
};

const IconBoss = ({ ink = "#eae3d5", accent = "#c8443c", warn = "#f0d24b", variant = "full" }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <IconDefs id="bs" />
    <g filter="url(#bs-shadow)">
      
      {variant !== "quiet" && (
        <g>
          <g transform="rotate(-38 50 50)">
            <rect x="-10" y="18" width="120" height="9" fill={warn} />
            <text x="50" y="25" textAnchor="middle" fontSize="9"
                  fontFamily="Impact, 'Bebas Neue', sans-serif" fontWeight="900"
                  fill="#161318" letterSpacing="0.5">!WARNING!!WARNING!</text>
          </g>
          <g transform="rotate(38 50 50)">
            <rect x="-10" y="76" width="120" height="9" fill={warn} />
            <text x="50" y="83" textAnchor="middle" fontSize="9"
                  fontFamily="Impact, 'Bebas Neue', sans-serif" fontWeight="900"
                  fill="#161318" letterSpacing="0.5">!WARNING!!WARNING!</text>
          </g>
        </g>
      )}
      
      <path d="M 50 10 Q 52 10 54 14 L 86 76 Q 88 82 82 84 H 18 Q 12 82 14 76 L 46 14 Q 48 10 50 10 Z"
            fill="#0b0a0d" stroke={ink} strokeWidth="7" strokeLinejoin="round" />
      <path d="M 50 10 Q 52 10 54 14 L 86 76 Q 88 82 82 84 H 18 Q 12 82 14 76 L 46 14 Q 48 10 50 10 Z"
            fill="none" stroke={ink} strokeWidth="3" strokeLinejoin="round" />
      
      <path d="M 50 32 V 62" stroke={ink} strokeWidth="10" strokeLinecap="round" />
      <circle cx="50" cy="74" r="5.5" fill={ink} />
    </g>
  </svg>
);

const IconMap = {
  origin: IconOrigin,
  skirmish: IconSkirmish,
  focused: IconFocused,
  elite: IconElite,
  abnormality: IconAbnormality,
  event: IconEvent,
  supply: IconSupply,
  boss: IconBoss,
};

Object.assign(window, {
  IconOrigin, IconSkirmish, IconFocused, IconElite, IconAbnormality,
  IconGuardian, IconEvent, IconSupply, IconBoss, IconMap, IconDefs,
});

const KINDS = [
  { id: "origin",      label: "開始点",     short: "始", desc: "各階層の開始地点",           tone: "ink"   },
  { id: "skirmish",    label: "一般戦闘",   short: "戦", desc: "一般的な戦闘マス",           tone: "ink"   },
  { id: "focused",     label: "集中戦闘",   short: "集", desc: "集中戦闘システムでの戦闘（大罪系）", tone: "ink"   },
  { id: "elite",       label: "精鋭戦闘",   short: "精", desc: "レベルの高い敵との戦闘（ギフト100%）", tone: "blood" },
  { id: "abnormality", label: "幻想体戦闘", short: "幻", desc: "集中戦闘・ボス幻想体が確定出現",   tone: "blood" },
  { id: "event",       label: "イベント",   short: "？", desc: "選択を伴うイベント発生",     tone: "ink"   },
  { id: "supply",      label: "ショップ",   short: "商", desc: "コスト消費で回復・ギフト購入/強化/合成", tone: "ink"   },
  { id: "boss",        label: "ボス戦闘",   short: "終", desc: "階層終端のボス。E.G.O・苦難確定", tone: "blood" },
];

const KIND_INDEX = Object.fromEntries(KINDS.map(k => [k.id, k]));
const getNodeDisplayLabel = (node) => {
  const custom = String(node?.label ?? "").trim();
  return custom || KIND_INDEX[node?.kind]?.label || KIND_INDEX.skirmish.label;
};

const ICON_IDLE_MOTIONS = Object.freeze({
  origin:      Object.freeze([{ x: 0, y: 0, rotation: 0 }, { x: 0, y: -1.1, rotation: 0 }, { x: 0, y: 0.35, rotation: 0 }]),
  skirmish:    Object.freeze([{ x: 0, y: 0, rotation: 0 }, { x: 1.35, y: -1.0, rotation: 1.6 }, { x: -0.7, y: 0.4, rotation: -0.9 }]),
  focused:     Object.freeze([{ x: 0, y: 0, rotation: 0 }, { x: -0.8, y: -0.55, rotation: -1.2 }, { x: 0.8, y: 0.35, rotation: 1.2 }]),
  elite:       Object.freeze([{ x: 0, y: 0, rotation: 0 }, { x: 0, y: -0.75, rotation: 0 }, { x: 0, y: 0.45, rotation: 0 }]),
  abnormality: Object.freeze([{ x: 0, y: 0, rotation: 0 }, { x: -0.7, y: -0.6, rotation: -0.6 }, { x: 0.7, y: 0.45, rotation: 0.6 }]),
  event:       Object.freeze([{ x: 0, y: 0, rotation: 0 }, { x: 0, y: -1.8, rotation: -0.8 }, { x: 0, y: 0.6, rotation: 0.7 }]),
  supply:      Object.freeze([{ x: 0, y: 0, rotation: 0 }, { x: 0, y: -0.85, rotation: 0 }, { x: 0, y: 0.25, rotation: 0 }]),
  boss:        Object.freeze([{ x: 0, y: 0, rotation: 0 }, { x: 0, y: -1.0, rotation: 0 }, { x: 0, y: 0.45, rotation: 0 }]),
});

function getIconIdleMotion(kind, frame = 0) {
  const phases = ICON_IDLE_MOTIONS[kind] ?? ICON_IDLE_MOTIONS.skirmish;
  return phases[Math.abs(Number(frame) || 0) % phases.length];
}

const THEME = {
  bg:      "#0b0a0d",   
  panel:   "#161318",   
  panelHi: "#1e1a20",
  edge:    "#2c262e",
  ink:     "#eae3d5",   
  inkDim:  "#8a8375",
  brass:   "#d4a24b",   
  blood:   "#c8443c",   
  bloodHi: "#e35b53",
  warn:    "#f0d24b",   
  line:    "#7a5a48",   
  lineHi:  "#d4a24b",   
  goldGlow:"rgba(212,162,75,.55)",
  bloodGlow:"rgba(200,68,60,.5)",
};

const CSS_THEME = Object.freeze({
  background: "var(--map-bg)", panel: "var(--map-panel)", panelHi: "var(--map-panel-2)", edge: "var(--map-edge)",
  ink: "var(--map-ink)", inkDim: "var(--map-ink-dim)", brass: "var(--map-brass)", brassHi: "var(--map-brass-hi)",
  blood: "var(--map-blood)", bloodHi: "var(--map-blood-hi)", warn: "var(--map-warn)", line: "var(--map-line)", lineHi: "var(--map-line-hi)",
});
const BACKGROUND_MIN_SCALE = 0.05;
const BACKGROUND_MAX_SCALE = 4;
const BACKGROUND_MIN_FRAME_SIZE = 24;

const THEME_PRESETS = [
  { id: "dante", label: "既定", colors: { background: "#0b0a0d", panel: "#161318", panelHi: "#1e1a20", edge: "#2c262e", ink: "#eae3d5", inkDim: "#8a8375", brass: "#d4a24b", brassHi: "#e5b55e", blood: "#c8443c", bloodHi: "#e35b53", warn: "#f0d24b", line: "#7a5a48", lineHi: "#d4a24b" } },
  { id: "paper", label: "羊皮紙", colors: { background: "#e8dfcd", panel: "#f4eddf", panelHi: "#fff8ea", edge: "#b8a78b", ink: "#302a24", inkDim: "#746957", brass: "#976b2c", brassHi: "#bd8a3b", blood: "#9a3f35", bloodHi: "#bf5d4d", warn: "#b47c18", line: "#9f8b69", lineHi: "#976b2c" } },
  { id: "seaglass", label: "海硝子", colors: { background: "#081518", panel: "#10262a", panelHi: "#17343a", edge: "#2b5154", ink: "#d6eee7", inkDim: "#8ab3aa", brass: "#78c8b1", brassHi: "#a8e4d2", blood: "#d66359", bloodHi: "#ee8b75", warn: "#e1bf5a", line: "#477a74", lineHi: "#78c8b1" } },
];

function themeToCssVars(theme) {
  return {
    "--map-bg": theme.background, "--map-panel": theme.panel, "--map-panel-2": theme.panelHi,
    "--map-edge": theme.edge, "--map-ink": theme.ink, "--map-ink-dim": theme.inkDim,
    "--map-brass": theme.brass, "--map-brass-hi": theme.brassHi,
    "--map-blood": theme.blood, "--map-blood-hi": theme.bloodHi,
    "--map-warn": theme.warn, "--map-line": theme.line, "--map-line-hi": theme.lineHi,
  };
}

const EDGE_STYLES = {
  normal:  { label: "通常",   dash: "none",     width: 2.8, opacity: 0.85 },
  branch:  { label: "分岐",   dash: "6 5",      width: 2.4, opacity: 0.9  },
  forced:  { label: "強制",   dash: "none",     width: 4.2, opacity: 1.0  }, 
  hidden:  { label: "隠し",   dash: "1 4",      width: 2.2, opacity: 0.65 },
};

Object.assign(window, { KINDS, KIND_INDEX, THEME, EDGE_STYLES });

const STORAGE_KEY = "kagami-map-studio.v3";
const HISTORY_LIMIT = 60;
const MAX_COLUMNS = 12;
const MAX_NODES_PER_COLUMN = 4;
const {
  createBackground,
  normalizeBackground,
  fitBackgroundToMap,
  resetBackgroundTransform,
  prepareBackgroundImage,
} = window.KagamiBackgroundUtils;
const { encodeGif, encodeApng } = window.KagamiAnimatedImageUtils;

function uuid() {
  return (globalThis.crypto?.randomUUID?.() ?? `n_${Date.now()}_${Math.random().toString(36).slice(2,7)}`);
}

function clone(v) { return JSON.parse(JSON.stringify(v)); }

function baseMap() {
  const origin      = { id: uuid(), stage: 0, row: 0, kind: "origin",     label: "開始点" };
  
  const s2a         = { id: uuid(), stage: 1, row: 0, kind: "skirmish",   label: "一般戦闘" };
  const s2b         = { id: uuid(), stage: 1, row: 1, kind: "skirmish",   label: "一般戦闘" };
  const s2c         = { id: uuid(), stage: 1, row: 2, kind: "event",      label: "イベント" };
  
  const s3a         = { id: uuid(), stage: 2, row: 0, kind: "focused",    label: "集中戦闘" };
  const s3b         = { id: uuid(), stage: 2, row: 1, kind: "skirmish",   label: "一般戦闘" };
  
  const s4a         = { id: uuid(), stage: 3, row: 0, kind: "skirmish",   label: "一般戦闘" };
  const s4b         = { id: uuid(), stage: 3, row: 1, kind: "elite",      label: "精鋭戦闘" };
  const s4c         = { id: uuid(), stage: 3, row: 2, kind: "abnormality",label: "幻想体戦闘" };
  
  const s5b         = { id: uuid(), stage: 4, row: 0, kind: "supply",     label: "ショップ" };
  
  const bossA       = { id: uuid(), stage: 5, row: 0, kind: "boss",       label: "ボス戦闘" };

  const nodes = [origin, s2a, s2b, s2c, s3a, s3b, s4a, s4b, s4c, s5b, bossA];
  
  const B = "normal";
  const edges = [
    
    { from: origin.id, to: s2a.id, style: B },
    { from: origin.id, to: s2b.id, style: B },
    { from: origin.id, to: s2c.id, style: B },
    
    { from: s2a.id,   to: s3a.id, style: B },
    { from: s2b.id,   to: s3a.id, style: B },
    { from: s2b.id,   to: s3b.id, style: B },
    { from: s2c.id,   to: s3b.id, style: B },
    
    { from: s3a.id,   to: s4a.id, style: B },
    { from: s3a.id,   to: s4b.id, style: B },
    { from: s3b.id,   to: s4b.id, style: B },
    { from: s3b.id,   to: s4c.id, style: B },
    
    { from: s4a.id,   to: s5b.id, style: B },
    { from: s4b.id,   to: s5b.id, style: B },
    { from: s4c.id,   to: s5b.id, style: B },
    
    { from: s5b.id,   to: bossA.id, style: "forced" },
  ];
  return {
    title: "移動ツリー",
    nodes,
    edges,
    background: createBackground(),
    theme: {
      background: THEME.bg,
      panel: THEME.panel,
      panelHi: THEME.panelHi,
      edge: THEME.edge,
      ink: THEME.ink,
      inkDim: THEME.inkDim,
      brass: THEME.brass,
      brassHi: THEME.brass,
      blood: THEME.blood,
      bloodHi: THEME.bloodHi,
      warn: THEME.warn,
      line: THEME.line,
      lineHi: THEME.lineHi,
      showLabels: true,
      iconSize: 44,
      iconAnimation: false,
    },
  };
}

function normalizeMap(input) {
  if (!input || typeof input !== "object") return baseMap();
  const base = baseMap();
  
  const LABEL_MIGRATE = { "起点": "開始点", "通常戦闘": "一般戦闘", "強敵": "一般戦闘" };
  const nodes = Array.isArray(input.nodes) ? input.nodes.map((n, i) => {
    
    const kind = KIND_INDEX[n.kind] ? n.kind : "skirmish";
    const rawLabel = String(n.label ?? KIND_INDEX[kind]?.label ?? "").slice(0, 24);
    const label = LABEL_MIGRATE[rawLabel] ?? rawLabel;
    return {
      id: String(n.id ?? `n_${i}`),
      stage: Math.max(0, Math.min(MAX_COLUMNS - 1, Number(n.stage) || 0)),
      row: Math.max(0, Math.min(MAX_NODES_PER_COLUMN - 1, Number(n.row) || 0)),
      kind,
      label,
    };
  }) : base.nodes;
  const validIds = new Set(nodes.map(n => n.id));
  const edges = Array.isArray(input.edges) ? input.edges
    .map(e => ({ from: String(e.from), to: String(e.to), style: EDGE_STYLES[e.style] ? e.style : "normal" }))
    .filter(e => validIds.has(e.from) && validIds.has(e.to) && e.from !== e.to) : base.edges;
  return {
    title: String(input.title ?? "移動ツリー").slice(0, 40) || "移動ツリー",
    nodes,
    edges,
    background: normalizeBackground(input.background),
    theme: {
      background: String(input.theme?.background ?? THEME.bg),
      panel: String(input.theme?.panel ?? THEME.panel),
      panelHi: String(input.theme?.panelHi ?? THEME.panelHi),
      edge: String(input.theme?.edge ?? THEME.edge),
      ink: String(input.theme?.ink ?? THEME.ink),
      inkDim: String(input.theme?.inkDim ?? THEME.inkDim),
      brass: String(input.theme?.brass ?? THEME.brass),
      brassHi: String(input.theme?.brassHi ?? THEME.brass),
      blood: String(input.theme?.blood ?? THEME.blood),
      bloodHi: String(input.theme?.bloodHi ?? THEME.bloodHi),
      warn: String(input.theme?.warn ?? THEME.warn),
      line: String(input.theme?.line ?? THEME.line),
      lineHi: String(input.theme?.lineHi ?? THEME.lineHi),
      showLabels: input.theme?.showLabels === undefined ? true : Boolean(input.theme.showLabels),
      iconSize: Math.max(28, Math.min(64, Number(input.theme?.iconSize) || 44)),
      iconAnimation: Boolean(input.theme?.iconAnimation),
    },
  };
}

function loadMap() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return baseMap();
    return normalizeMap(JSON.parse(raw));
  } catch { return baseMap(); }
}

function saveMap(map) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(map)); } catch {}
}

function useMapHistory() {
  const [state, setState] = React.useState(() => ({
    past: [],
    present: loadMap(),
    future: [],
  }));
  React.useEffect(() => { saveMap(state.present); }, [state.present]);

  const mutate = React.useCallback((mutator) => {
    setState(prev => {
      const next = clone(prev.present);
      mutator(next);
      const normalized = normalizeMap(next);
      if (JSON.stringify(normalized) === JSON.stringify(prev.present)) return prev;
      return {
        past: [...prev.past, prev.present].slice(-HISTORY_LIMIT),
        present: normalized,
        future: [],
      };
    });
  }, []);

  const replace = React.useCallback((next) => {
    setState(prev => {
      const normalized = normalizeMap(next);
      if (JSON.stringify(normalized) === JSON.stringify(prev.present)) return prev;
      return {
        past: [...prev.past, prev.present].slice(-HISTORY_LIMIT),
        present: normalized,
        future: [],
      };
    });
  }, []);

  
  const replaceTheme = React.useCallback((theme) => {
    setState(prev => {
      const nextTheme = { ...prev.present.theme, ...theme };
      if (Object.keys(nextTheme).every(key => nextTheme[key] === prev.present.theme[key])) return prev;
      return {
        past: [...prev.past, prev.present].slice(-HISTORY_LIMIT),
        present: { ...prev.present, theme: nextTheme },
        future: [],
      };
    });
  }, []);

  const undo = React.useCallback(() => {
    setState(prev => {
      if (!prev.past.length) return prev;
      const prior = prev.past[prev.past.length - 1];
      return {
        past: prev.past.slice(0, -1),
        present: prior,
        future: [prev.present, ...prev.future].slice(0, HISTORY_LIMIT),
      };
    });
  }, []);

  const redo = React.useCallback(() => {
    setState(prev => {
      if (!prev.future.length) return prev;
      const next = prev.future[0];
      return {
        past: [...prev.past, prev.present].slice(-HISTORY_LIMIT),
        present: next,
        future: prev.future.slice(1),
      };
    });
  }, []);

  return {
    map: state.present,
    mutate, replace, replaceTheme, undo, redo,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  };
}

const mapOps = {
  addNode(map, stage, row, kind = "skirmish") {
    const id = uuid();
    map.nodes.push({ id, stage, row, kind, label: KIND_INDEX[kind].label });
    return id;
  },
  removeNode(map, id) {
    map.nodes = map.nodes.filter(n => n.id !== id);
    map.edges = map.edges.filter(e => e.from !== id && e.to !== id);
  },
  addColumn(map, atStage, kind = "skirmish") {
    
    map.nodes.forEach(n => { if (n.stage >= atStage) n.stage += 1; });
    
    const id = uuid();
    map.nodes.push({ id, stage: atStage, row: 0, kind, label: KIND_INDEX[kind].label });
    return id;
  },
  removeColumn(map, atStage) {
    map.nodes = map.nodes.filter(n => n.stage !== atStage);
    map.nodes.forEach(n => { if (n.stage > atStage) n.stage -= 1; });
    const nodeIds = new Set(map.nodes.map(n => n.id));
    map.edges = map.edges.filter(e => nodeIds.has(e.from) && nodeIds.has(e.to));
  },
  changeKind(map, id, kind) {
    const node = map.nodes.find(n => n.id === id);
    if (!node) return;
    const wasDefaultLabel = node.label === KIND_INDEX[node.kind]?.label || !node.label;
    node.kind = kind;
    if (wasDefaultLabel) node.label = KIND_INDEX[kind].label;
  },
  updateNode(map, id, patch) {
    const node = map.nodes.find(n => n.id === id);
    if (node) Object.assign(node, patch);
  },
  addEdge(map, from, to, style = "normal") {
    if (from === to) return;
    if (map.edges.some(e => e.from === from && e.to === to)) return;
    map.edges.push({ from, to, style });
  },
  removeEdge(map, from, to) {
    map.edges = map.edges.filter(e => !(e.from === from && e.to === to));
  },
  toggleEdgeStyle(map, from, to) {
    const styles = ["normal", "branch", "forced", "hidden"];
    const e = map.edges.find(x => x.from === from && x.to === to);
    if (!e) return;
    e.style = styles[(styles.indexOf(e.style) + 1) % styles.length];
  },
  clear(map) {
    const b = baseMap();
    map.nodes = b.nodes;
    map.edges = b.edges;
    map.title = b.title;
    map.theme = b.theme;
  },
  

  autoConnect(map) {
    map.edges = [];
    const cols = [];
    const highest = Math.max(0, ...map.nodes.map(n => n.stage));
    for (let s = 0; s <= highest; s++) {
      cols.push(map.nodes.filter(n => n.stage === s).sort((a, b) => a.row - b.row));
    }
    for (let s = 0; s < cols.length - 1; s++) {
      const cur = cols[s], nxt = cols[s + 1];
      if (!cur.length || !nxt.length) continue;
      const pos = (index, size) => size === 1 ? 0.5 : index / (size - 1);
      const nearest = (position, nodes) => {
        const distances = nodes.map((_, index) => Math.abs(position - pos(index, nodes.length)));
        const minimum = Math.min(...distances);
        return distances.flatMap((distance, index) => Math.abs(distance - minimum) < 1e-9 ? [index] : []);
      };
      const add = (fromIndex, toIndex) => {
        const from = cur[fromIndex], to = nxt[toIndex];
        if (!map.edges.some(edge => edge.from === from.id && edge.to === to.id)) {
          map.edges.push({ from: from.id, to: to.id, style: "normal" });
        }
      };

      
      if (cur.length === 1) {
        nxt.forEach((_, toIndex) => add(0, toIndex));
        continue;
      }
      
      if (nxt.length === 1) {
        cur.forEach((_, fromIndex) => add(fromIndex, 0));
        continue;
      }

      
      
      cur.forEach((_, fromIndex) => {
        nearest(pos(fromIndex, cur.length), nxt).forEach(toIndex => add(fromIndex, toIndex));
      });
      nxt.forEach((_, toIndex) => {
        nearest(pos(toIndex, nxt.length), cur).forEach(fromIndex => add(fromIndex, toIndex));
      });

      
      
      const previousCount = s > 0 ? cols[s - 1].length : cur.length;
      const followingCount = s + 2 < cols.length ? cols[s + 2].length : nxt.length;
      const hasBranchContext = previousCount !== cur.length || followingCount !== nxt.length;
      if (cur.length === nxt.length && cur.length >= 2 && hasBranchContext) {
        const down = s % 2 === 0;
        const fromIndex = down
          ? s % (cur.length - 1)
          : 1 + (s % (cur.length - 1));
        add(fromIndex, fromIndex + (down ? 1 : -1));
      }
    }
  },
  
  candidates(map, fromId) {
    const from = map.nodes.find(n => n.id === fromId);
    if (!from) return [];
    const targets = map.nodes.filter(n => n.stage === from.stage + 1);
    const existing = new Set(map.edges.filter(e => e.from === fromId).map(e => e.to));
    return targets.filter(t => !existing.has(t.id));
  },
};

Object.assign(window, { useMapHistory, mapOps, baseMap, normalizeMap, uuid, MAX_COLUMNS, MAX_NODES_PER_COLUMN });

function RadialKindMenu({ open, cx, cy, currentKind, kinds, onPick, onClose, kindColors, onDeactivate }) {
  const menuRef = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose?.();
    };
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("mousedown", onDown, true);
    window.addEventListener("touchstart", onDown, true);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown, true);
      window.removeEventListener("touchstart", onDown, true);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  
  const entries = Object.entries(kinds).filter(([k]) => k !== "entrance");
  const N = entries.length;
  const R = 108;
  const iconR = 26;
  const startAngle = -Math.PI / 2;

  return (
    <div
      className="radial-root"
      ref={menuRef}
      style={{ left: cx, top: cy }}
      onClick={(e) => e.stopPropagation()}
    >
      <svg
        className="radial-svg"
        width={(R + iconR + 20) * 2}
        height={(R + iconR + 20) * 2}
        viewBox={`${-(R + iconR + 20)} ${-(R + iconR + 20)} ${(R + iconR + 20) * 2} ${(R + iconR + 20) * 2}`}
      >
        <circle r={R} fill="none" stroke="var(--brass)" strokeOpacity="0.28" strokeWidth="1" strokeDasharray="2 4" />
        <circle r={R - 6} fill="none" stroke="var(--line)" strokeOpacity="0.16" strokeWidth="1" />
        <circle r={R + 6} fill="none" stroke="var(--line)" strokeOpacity="0.12" strokeWidth="1" />
        {entries.map((_, i) => {
          const a = startAngle + (i / N) * Math.PI * 2 + Math.PI / N;
          return (
            <line
              key={i}
              x1={Math.cos(a) * (R - 30)}
              y1={Math.sin(a) * (R - 30)}
              x2={Math.cos(a) * (R + 30)}
              y2={Math.sin(a) * (R + 30)}
              stroke="var(--line)" strokeOpacity="0.12" strokeWidth="0.8"
            />
          );
        })}
      </svg>

      {entries.map(([key, meta], i) => {
        const a = startAngle + (i / N) * Math.PI * 2;
        const x = Math.cos(a) * R;
        const y = Math.sin(a) * R;
        const isCurrent = key === currentKind;
        const color = kindColors[key] || "var(--line)";
        return (
          <button
            key={key}
            className={`radial-seg ${isCurrent ? "is-current" : ""}`}
            style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
            onClick={() => onPick?.(key)}
            title={`${meta.label} — ${meta.description}`}
            aria-label={`${meta.label}へ変更`}
          >
            <svg viewBox="-40 -40 80 80" width="60" height="60" aria-hidden="true">
              <WaypointFrame color={color} selected={isCurrent} danger={meta.danger} />
              <KindGlyph kind={key} color={color} />
            </svg>
            <span className="radial-label">
              <b>{meta.label}</b>
              <small>{meta.short}</small>
            </span>
          </button>
        );
      })}

      
      <div className="radial-hub-group">
        <button className="radial-hub" onClick={onClose} aria-label="閉じる">
          <svg viewBox="-24 -24 48 48" width="52" height="52" aria-hidden="true">
            <circle r="20" fill="var(--node-fill)" stroke="var(--brass)" strokeWidth="1.5" />
            <path d="M -8 -8 L 8 8 M 8 -8 L -8 8" stroke="var(--brass)" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span>閉じる</span>
        </button>
        {onDeactivate && (
          <button className="radial-hub-secondary" onClick={onDeactivate} aria-label="この地点を無効化">
            この地点を無効化
          </button>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { RadialKindMenu });

const NODE_W = 92;
const NODE_H = 92;
const COL_GAP = 168;
const ROW_GAP = 132;
const CANVAS_PAD_X = 120;
const CANVAS_PAD_Y = 110;

function computeLayout(map) {
  const highestStage = Math.max(0, ...map.nodes.map(n => n.stage));
  const columns = Array.from({ length: highestStage + 1 }, (_, s) =>
    map.nodes.filter(n => n.stage === s).sort((a, b) => a.row - b.row)
  );
  const widest = Math.max(1, ...columns.map(c => c.length));
  const width  = CANVAS_PAD_X * 2 + Math.max(0, highestStage) * COL_GAP + NODE_W;
  const height = CANVAS_PAD_Y * 2 + Math.max(0, widest - 1) * ROW_GAP + NODE_H + 40;
  const positions = {};
  columns.forEach((col, stage) => {
    const span = (col.length - 1) * ROW_GAP;
    const top  = Math.round((height - span) / 2);
    col.forEach((node, idx) => {
      positions[node.id] = {
        x: CANVAS_PAD_X + NODE_W / 2 + stage * COL_GAP,
        y: top + idx * ROW_GAP,
      };
    });
  });
  return { width, height, positions, columns, highestStage, widest };
}

function edgePath(a, b) {
  const dx = b.x - a.x;
  const bend = Math.max(48, dx * 0.45);
  return `M ${a.x + NODE_W/2 - 4} ${a.y} C ${a.x + bend} ${a.y}, ${b.x - bend} ${b.y}, ${b.x - NODE_W/2 + 4} ${b.y}`;
}

function NodeMarker({ node, pos, selected, isPulse, iconSize, showLabel, iconAnimation, theme, onSelect, onStartLink, onRemove }) {
  const kindDef = KIND_INDEX[node.kind] ?? KIND_INDEX.skirmish;
  const Icon = IconMap[node.kind] ?? IconMap.skirmish;
  const tone = kindDef.tone;
  const displayLabel = getNodeDisplayLabel(node);
  const ringColor = tone === "blood" ? theme.blood : tone === "brass" ? theme.brass : theme.ink;
  const ringGlow = tone === "blood" ? theme.bloodHi : theme.brass;

  return (
    <g transform={`translate(${pos.x} ${pos.y})`} className={`nd ${selected ? "sel" : ""} ${isPulse ? "pulse" : ""}`} data-kind={node.kind}>
      
      {selected && (
        <circle r={NODE_W/2 + 6} fill="none" stroke={theme.brass} strokeWidth="2" strokeDasharray="3 4">
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="24s" repeatCount="indefinite" />
        </circle>
      )}
      
      <g>
        <path
          d="M -44 -24 L -30 -44 H 30 L 44 -24 V 24 L 30 44 H -30 L -44 24 Z"
          fill={theme.panel}
          stroke={ringColor}
          strokeWidth={selected ? 3.4 : 2.4}
          strokeLinejoin="round"
          filter={selected ? `drop-shadow(0 0 10px ${ringGlow})` : undefined}
        />
        <g fill={ringColor} opacity="0.9">
          <circle cx="-30" cy="-32" r="1.6" /><circle cx="30" cy="-32" r="1.6" />
          <circle cx="-30" cy="32" r="1.6" /><circle cx="30" cy="32" r="1.6" />
        </g>
      </g>
      
      <foreignObject x={-iconSize/2} y={-iconSize/2} width={iconSize} height={iconSize} style={{ pointerEvents: "none" }}>
        <div xmlns="http://www.w3.org/1999/xhtml" data-role="map-icon" className={iconAnimation ? `icon-idle icon-idle-${node.kind}` : ""} style={{ width: "100%", height: "100%" }}>
          <Icon ink={theme.ink} dark={theme.background} midGray={theme.panelHi}
                accent={tone === "blood" ? theme.bloodHi : theme.brass} warn={theme.warn} />
        </div>
      </foreignObject>
      
      {showLabel && (
        <g style={{ pointerEvents: "none" }}>
          <rect x={-40} y={NODE_H/2 + 6} width={80} height={20} rx={4}
                fill={theme.background} fillOpacity="0.85"
                stroke={ringColor} strokeOpacity="0.4" strokeWidth="1" />
          <text x={0} y={NODE_H/2 + 20} textAnchor="middle" fill={theme.ink}
                fontSize="12" fontWeight="600"
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
            {displayLabel}
          </text>
        </g>
      )}
      
      <rect x="-46" y="-46" width="92" height="92" fill="transparent"
            style={{ cursor: "pointer" }}
            onPointerDown={(e) => { e.stopPropagation(); onSelect(node.id); }}
            onDoubleClick={(e) => { e.stopPropagation(); onStartLink?.(node.id); }} />
      
      {selected && (
        <g transform={`translate(${NODE_W/2 + 16} 0)`}
           className="linkhandle"
           onPointerDown={(e) => { e.stopPropagation(); onStartLink?.(node.id, e); }}>
          
          
          <circle r="36" fill="transparent" style={{ pointerEvents: "all" }} />
          <circle r="15" fill="#061b1d" stroke="#62fff3" strokeWidth="2.4" opacity="0.98" />
          <circle r="10.5" fill="#138f8a" stroke="#bffef5" strokeWidth="1.2" />
          <path d="M -5.5 0 H 5.5 M 0 -5.5 V 5.5" stroke="#f4fffc" strokeWidth="2.8" strokeLinecap="round" />
          <circle r="18.5" fill="none" stroke="#49d7ce" strokeWidth="1.2" strokeDasharray="2 4" opacity="0.7" style={{ pointerEvents: "none" }} />
          <title>ここからドラッグ、または隣接列のノードをクリックで結線</title>
        </g>
      )}
      
      {selected && (
        <g transform={`translate(${NODE_W/2 - 12} ${-NODE_H/2 - 2})`}
           onPointerDown={(e) => { e.stopPropagation(); onRemove?.(node.id); }}>
          <circle r="11" fill={theme.blood} stroke={theme.background} strokeWidth="2" style={{ cursor: "pointer" }} />
          <path d="M -4.5 -4.5 L 4.5 4.5 M 4.5 -4.5 L -4.5 4.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
          <title>このマスを削除</title>
        </g>
      )}
    </g>
  );
}

const MapCanvas = React.memo(function MapCanvas({
  map, selectedId, setSelectedId,
  mutate, edgeMode, setEdgeMode,
  showLabels, selectedKind, backgroundAdjusting,
}) {
  const wrapRef  = React.useRef(null);
  const svgRef   = React.useRef(null);
  const stageRef = React.useRef(null);
  const zoomReadoutRef = React.useRef(null);
  const [viewport, setViewport] = React.useState({ w: 0, h: 0 });
  const viewRef = React.useRef({ x: 0, y: 0, zoom: 1 });
  const [linkFrom, setLinkFrom] = React.useState(null);
  const [ghostPos, setGhostPos] = React.useState(null);
  const [hoverCol, setHoverCol] = React.useState(null);
  const [dropHint, setDropHint] = React.useState(null);
  const [hoverEdge, setHoverEdge] = React.useState(null); 
  const [edgeMenu, setEdgeMenu] = React.useState(null);    
  const layout = React.useMemo(() => computeLayout(map), [map.nodes, map.edges]);
  const theme = CSS_THEME;
  const didInitFit = React.useRef(false);
  const backgroundDragRef = React.useRef(null);
  const [backgroundDragOffset, setBackgroundDragOffset] = React.useState(null);
  const backgroundTransformRef = React.useRef(null);
  const [backgroundTransformPreview, setBackgroundTransformPreview] = React.useState(null);
  const background = map.background;
  const renderedBackground = backgroundTransformPreview
    ? backgroundTransformPreview
    : backgroundDragOffset
    ? { ...background, x: background.x + backgroundDragOffset.x, y: background.y + backgroundDragOffset.y }
    : background;
  const getBackgroundFrame = React.useCallback((value) => {
    if (!value?.enabled || !value.width || !value.height) return null;
    const scaleX = Number(value.scaleX ?? value.scale ?? 1);
    const scaleY = Number(value.scaleY ?? value.scale ?? 1);
    const width = value.width * scaleX;
    const height = value.height * scaleY;
    return {
      x: layout.width / 2 + value.x - width / 2,
      y: layout.height / 2 + value.y - height / 2,
      width,
      height,
      scaleX,
      scaleY,
    };
  }, [layout.width, layout.height]);
  const renderedBackgroundFrame = getBackgroundFrame(renderedBackground);
  const compactBackgroundTransform = viewport.w <= 768;
  const backgroundHandleHitSize = compactBackgroundTransform ? 84 : 20;
  const backgroundHandleVisualSize = compactBackgroundTransform ? 48 : 14;
  const backgroundFrameHandleSpecs = React.useMemo(() => ([
    { id: "nw", x: 0, y: 0, cursor: "nwse-resize" },
    { id: "n", x: 0.5, y: 0, cursor: "ns-resize" },
    { id: "ne", x: 1, y: 0, cursor: "nesw-resize" },
    { id: "e", x: 1, y: 0.5, cursor: "ew-resize" },
    { id: "se", x: 1, y: 1, cursor: "nwse-resize" },
    { id: "s", x: 0.5, y: 1, cursor: "ns-resize" },
    { id: "sw", x: 0, y: 1, cursor: "nesw-resize" },
    { id: "w", x: 0, y: 0.5, cursor: "ew-resize" },
  ]), []);

  const applyView = React.useCallback(() => {
    const view = viewRef.current;
    if (stageRef.current) stageRef.current.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`;
    if (zoomReadoutRef.current) zoomReadoutRef.current.textContent = `${Math.round(view.zoom * 100)}%`;
  }, []);

  
  React.useEffect(() => {
    if (!wrapRef.current) return;
    const el = wrapRef.current;
    const upd = () => setViewport({ w: el.clientWidth, h: el.clientHeight });
    upd();
    const ro = new ResizeObserver(upd);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  
  const fit = React.useCallback(() => {
    const compact = window.innerWidth <= 768;
    const pad = compact ? 16 : 60;
    const inspectorInset = selectedId && !compact ? 420 : 0;
    const zx = (viewport.w - pad*2 - inspectorInset) / layout.width;
    const zy = (viewport.h - pad*2) / layout.height;
    const z  = Math.max(compact ? 0.48 : 0.3, Math.min(1.6, Math.min(zx, zy)));
    const centeredX = compact ? -(layout.width * z) / 2 : 0;
    const centeredY = compact ? -(layout.height * z) / 2 : 0;
    const desktopShiftX = inspectorInset ? -inspectorInset / 2 : 0;
    viewRef.current = { x: centeredX + (compact ? 0 : desktopShiftX), y: centeredY, zoom: z };
    applyView();
  }, [viewport, layout, applyView, selectedId]);

  
  React.useEffect(() => {
    if (didInitFit.current) return;
    if (viewport.w > 100 && layout.width > 0) {
      fit();
      didInitFit.current = true;
    }
  }, [viewport.w, layout.width, fit]);

  React.useEffect(() => {
    if (didInitFit.current && selectedId && window.innerWidth > 768) fit();
  }, [selectedId, fit]);

  React.useEffect(() => {
    if (!backgroundAdjusting || viewport.w > 768 || !renderedBackgroundFrame || viewport.w < 100 || viewport.h < 100) return;
    const pad = 18;
    const width = Math.max(layout.width, renderedBackgroundFrame.width);
    const height = Math.max(layout.height, renderedBackgroundFrame.height);
    const zoom = Math.max(0.2, Math.min((viewport.w - pad * 2) / width, (viewport.h - pad * 2) / height));
    viewRef.current = { x: -(layout.width * zoom) / 2, y: -(layout.height * zoom) / 2, zoom };
    applyView();
    const frame = window.requestAnimationFrame(() => {
      const wrapRect = wrapRef.current?.getBoundingClientRect();
      const svgRect = svgRef.current?.getBoundingClientRect();
      if (!wrapRect || !svgRect) return;
      const dx = wrapRect.left + (wrapRect.width - svgRect.width) / 2 - svgRect.left;
      const dy = wrapRect.top + (wrapRect.height - svgRect.height) / 2 - svgRect.top;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;
      viewRef.current = { ...viewRef.current, x: viewRef.current.x + dx, y: viewRef.current.y + dy };
      applyView();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [backgroundAdjusting, renderedBackgroundFrame, viewport, layout.width, layout.height, applyView]);

  
  React.useEffect(() => {
    window.__kagamiFit = fit;
    return () => { if (window.__kagamiFit === fit) delete window.__kagamiFit; };
  }, [fit]);

  const clientToSvg = (clientX, clientY) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = clientX; pt.y = clientY;
    const m = svg.getScreenCTM().inverse();
    const p = pt.matrixTransform(m);
    return { x: p.x, y: p.y };
  };

  const panGestureRef = React.useRef(null);
  const activePointersRef = React.useRef(new Map());
  const pinchRef = React.useRef(null);
  const spaceHeldRef = React.useRef(false);
  const canAdjustBackground = (target) => {
    if (!backgroundAdjusting || !background?.enabled) return false;
    return !target.closest?.(".nd, .edge, .add-node, .col-inserter, .linkhandle, .canvas-controls, .mini-map");
  };
  const beginBackgroundDrag = (e) => {
    backgroundDragRef.current = { id: e.pointerId, clientX: e.clientX, clientY: e.clientY, zoom: viewRef.current.zoom };
    setBackgroundDragOffset({ x: 0, y: 0 });
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const moveBackgroundDrag = (e) => {
    const drag = backgroundDragRef.current;
    if (!drag || drag.id !== e.pointerId) return false;
    setBackgroundDragOffset({
      x: (e.clientX - drag.clientX) / Math.max(0.01, drag.zoom),
      y: (e.clientY - drag.clientY) / Math.max(0.01, drag.zoom),
    });
    return true;
  };
  const commitBackgroundDrag = (e) => {
    const drag = backgroundDragRef.current;
    if (!drag || drag.id !== e.pointerId) return false;
    const x = (e.clientX - drag.clientX) / Math.max(0.01, drag.zoom);
    const y = (e.clientY - drag.clientY) / Math.max(0.01, drag.zoom);
    if (Math.hypot(x, y) > 0.5) {
      mutate(draft => {
        draft.background = normalizeBackground({ ...draft.background, x: draft.background.x + x, y: draft.background.y + y });
      });
    }
    backgroundDragRef.current = null;
    setBackgroundDragOffset(null);
    return true;
  };
  const clampBackgroundScale = (value, fallback = 1) => Math.min(BACKGROUND_MAX_SCALE, Math.max(BACKGROUND_MIN_SCALE, Number.isFinite(value) ? value : fallback));
  const beginBackgroundFrameTransform = (e, handle) => {
    if (!backgroundAdjusting || !background?.enabled) return;
    e.preventDefault();
    e.stopPropagation();
    const frame = getBackgroundFrame(background);
    if (!frame) return;
    backgroundTransformRef.current = {
      id: e.pointerId,
      handle,
      start: clientToSvg(e.clientX, e.clientY),
      frame,
      background: { ...background },
    };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const calculateBackgroundFrameTransform = (e) => {
    const transform = backgroundTransformRef.current;
    if (!transform || transform.id !== e.pointerId) return null;
    const point = clientToSvg(e.clientX, e.clientY);
    const dx = point.x - transform.start.x;
    const dy = point.y - transform.start.y;
    const { handle, frame, background: start } = transform;
    if (handle === "move") return { ...start, x: start.x + dx, y: start.y + dy };
    let left = frame.x;
    let right = frame.x + frame.width;
    let top = frame.y;
    let bottom = frame.y + frame.height;
    if (handle.includes("w")) left = Math.min(right - BACKGROUND_MIN_FRAME_SIZE, left + dx);
    if (handle.includes("e")) right = Math.max(left + BACKGROUND_MIN_FRAME_SIZE, right + dx);
    if (handle.includes("n")) top = Math.min(bottom - BACKGROUND_MIN_FRAME_SIZE, top + dy);
    if (handle.includes("s")) bottom = Math.max(top + BACKGROUND_MIN_FRAME_SIZE, bottom + dy);
    const width = right - left;
    const height = bottom - top;
    const scaleX = clampBackgroundScale(width / Math.max(1, start.width), frame.scaleX);
    const scaleY = clampBackgroundScale(height / Math.max(1, start.height), frame.scaleY);
    return {
      ...start,
      x: (left + right) / 2 - layout.width / 2,
      y: (top + bottom) / 2 - layout.height / 2,
      scaleX,
      scaleY,
      scale: Number(Math.sqrt(scaleX * scaleY).toFixed(4)),
    };
  };
  const moveBackgroundFrameTransform = (e) => {
    const preview = calculateBackgroundFrameTransform(e);
    if (!preview) return false;
    setBackgroundTransformPreview(preview);
    return true;
  };
  const commitBackgroundFrameTransform = (e) => {
    const preview = calculateBackgroundFrameTransform(e);
    if (!preview) return false;
    const start = backgroundTransformRef.current?.background;
    if (start && (Math.abs(preview.x - start.x) > 0.5 || Math.abs(preview.y - start.y) > 0.5 || Math.abs(preview.scaleX - (start.scaleX ?? start.scale)) > 0.002 || Math.abs(preview.scaleY - (start.scaleY ?? start.scale)) > 0.002)) {
      mutate(draft => { draft.background = normalizeBackground(preview); });
    }
    backgroundTransformRef.current = null;
    setBackgroundTransformPreview(null);
    return true;
  };
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.code === "Space" && !e.repeat && document.activeElement?.tagName !== "INPUT") {
        spaceHeldRef.current = true;
        document.body.style.cursor = "grab";
      }
    };
    const onKeyUp = (e) => {
      if (e.code === "Space") { spaceHeldRef.current = false; document.body.style.cursor = ""; }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("keyup", onKeyUp); };
  }, []);

  const onWrapPointerDown = (e) => {
    if (canAdjustBackground(e.target) && (e.pointerType !== "mouse" || e.button === 0)) {
      beginBackgroundDrag(e);
      return;
    }
    if (e.pointerType === "touch") {
      activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      e.currentTarget.setPointerCapture?.(e.pointerId);
      if (activePointersRef.current.size === 2) {
        const [a, b] = [...activePointersRef.current.values()];
        pinchRef.current = {
          distance: Math.hypot(b.x - a.x, b.y - a.y),
          center: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
          view: { ...viewRef.current },
        };
        panGestureRef.current = null;
        return;
      }
      if (e.target === e.currentTarget || e.target.dataset?.role === "canvas-bg") {
        panGestureRef.current = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: false, touch: true };
      } else if (linkFrom) {
        setLinkFrom(null); setGhostPos(null);
      }
      return;
    }
    if (e.button === 1 || (e.button === 0 && spaceHeldRef.current)) {
      panGestureRef.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
      e.currentTarget.setPointerCapture(e.pointerId);
      document.body.style.cursor = "grabbing";
    } else if (linkFrom) {
      setLinkFrom(null); setGhostPos(null);
    } else if (e.target === e.currentTarget || e.target.dataset?.role === "canvas-bg") {
      setSelectedId(null);
    }
  };
  const onWrapPointerMove = (e) => {
    if (moveBackgroundFrameTransform(e)) return;
    if (moveBackgroundDrag(e)) return;
    if (e.pointerType === "touch") {
      if (activePointersRef.current.has(e.pointerId)) activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pinchRef.current && activePointersRef.current.size >= 2) {
        const [a, b] = [...activePointersRef.current.values()];
        const distance = Math.hypot(b.x - a.x, b.y - a.y);
        const center = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        const base = pinchRef.current;
        const ratio = distance / Math.max(1, base.distance);
        viewRef.current.zoom = Math.max(0.25, Math.min(3, Number((base.view.zoom * ratio).toFixed(3))));
        viewRef.current.x = base.view.x + center.x - base.center.x;
        viewRef.current.y = base.view.y + center.y - base.center.y;
        applyView();
        return;
      }
      if (panGestureRef.current?.id === e.pointerId) {
        const dx = e.clientX - panGestureRef.current.x;
        const dy = e.clientY - panGestureRef.current.y;
        if (Math.hypot(dx, dy) > 3) panGestureRef.current.moved = true;
        viewRef.current.x += dx;
        viewRef.current.y += dy;
        applyView();
        panGestureRef.current = { ...panGestureRef.current, x: e.clientX, y: e.clientY };
      }
      return;
    }
    if (panGestureRef.current?.id === e.pointerId) {
      const dx = e.clientX - panGestureRef.current.x;
      const dy = e.clientY - panGestureRef.current.y;
      viewRef.current.x += dx;
      viewRef.current.y += dy;
      applyView();
      panGestureRef.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
    }
    if (linkFrom) {
      setGhostPos(clientToSvg(e.clientX, e.clientY));
    }
  };
  const onWrapPointerUp = (e) => {
    if (commitBackgroundFrameTransform(e)) return;
    if (commitBackgroundDrag(e)) return;
    if (e.pointerType === "touch") {
      const gesture = panGestureRef.current?.id === e.pointerId ? panGestureRef.current : null;
      activePointersRef.current.delete(e.pointerId);
      if (activePointersRef.current.size < 2) pinchRef.current = null;
      if (gesture) {
        panGestureRef.current = null;
        if (!gesture.moved && (e.target === e.currentTarget || e.target.dataset?.role === "canvas-bg")) setSelectedId(null);
      }
      return;
    }
    if (panGestureRef.current?.id === e.pointerId) {
      panGestureRef.current = null;
      document.body.style.cursor = spaceHeldRef.current ? "grab" : "";
    }
  };
  
  
  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheelNative = (e) => {
      
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      
      
      const cx = e.clientX - rect.left - rect.width / 2;
      const cy = e.clientY - rect.top - rect.height / 2;
      
      const factor = Math.pow(1.0015, -e.deltaY);
      const view = viewRef.current;
      const nextZ = Math.max(0.25, Math.min(3.0, Number((view.zoom * factor).toFixed(3))));
      const ratio = nextZ / view.zoom;
      if (ratio !== 1) {
        view.x = cx - (cx - view.x) * ratio;
        view.y = cy - (cy - view.y) * ratio;
        view.zoom = nextZ;
        applyView();
      }
    };
    el.addEventListener("wheel", onWheelNative, { passive: false });
    return () => el.removeEventListener("wheel", onWheelNative);
  }, [applyView]);

  const changeZoom = (delta) => {
    
    const view = viewRef.current;
    const nextZ = Math.max(0.25, Math.min(3.0, Number((view.zoom + delta).toFixed(3))));
    const ratio = nextZ / view.zoom;
    if (ratio !== 1) {
      view.x *= ratio;
      view.y *= ratio;
      view.zoom = nextZ;
      applyView();
    }
  };

  const startLink = (nodeId, e) => {
    setLinkFrom(nodeId);
    if (e) setGhostPos(clientToSvg(e.clientX, e.clientY));
  };
  const completeLink = (toId) => {
    if (!linkFrom || linkFrom === toId) { setLinkFrom(null); setGhostPos(null); return; }
    mutate((draft) => mapOps.addEdge(draft, linkFrom, toId, "normal"));
    setLinkFrom(null); setGhostPos(null);
  };

  const addNodeAt = (stage, row, kind = selectedKind) => {
    let id = null;
    mutate(draft => {
      id = mapOps.addNode(draft, stage, row, kind);
      const prev = draft.nodes.filter(n => n.stage === stage - 1)
                              .sort((a, b) => Math.abs(a.row - row) - Math.abs(b.row - row));
      if (prev.length) mapOps.addEdge(draft, prev[0].id, id, "normal");
    });
    if (id) setSelectedId(id);
  };

  
  const onDragOver = (e) => {
    if (!e.dataTransfer.types.includes("application/x-kind")) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    const svgP = clientToSvg(e.clientX, e.clientY);
    const stage = Math.round((svgP.x - CANVAS_PAD_X - NODE_W/2) / COL_GAP);
    if (stage < 0 || stage > MAX_COLUMNS) { setDropHint(null); return; }
    const colNodes = map.nodes.filter(n => n.stage === stage);
    const usedRows = new Set(colNodes.map(n => n.row));
    let row = 0; while (usedRows.has(row) && row < MAX_NODES_PER_COLUMN) row += 1;
    if (row >= MAX_NODES_PER_COLUMN) { setDropHint(null); return; }
    setDropHint({ stage, row });
  };
  const onDrop = (e) => {
    e.preventDefault();
    const kind = e.dataTransfer.getData("application/x-kind");
    setDropHint(null);
    if (!kind || !KIND_INDEX[kind]) return;
    const svgP = clientToSvg(e.clientX, e.clientY);
    const stage = Math.max(0, Math.min(MAX_COLUMNS - 1,
      Math.round((svgP.x - CANVAS_PAD_X - NODE_W/2) / COL_GAP)));
    const colNodes = map.nodes.filter(n => n.stage === stage);
    const usedRows = new Set(colNodes.map(n => n.row));
    let row = 0; while (usedRows.has(row) && row < MAX_NODES_PER_COLUMN) row += 1;
    if (row >= MAX_NODES_PER_COLUMN) return;
    addNodeAt(stage, row, kind);
  };
  const onDragLeave = () => setDropHint(null);

  const insertColumn = (atStage) => {
    let id = null;
    mutate(draft => { id = mapOps.addColumn(draft, atStage, selectedKind); });
    if (id) setSelectedId(id);
  };

  
  const candidateIds = React.useMemo(() => {
    if (!selectedId) return [];
    return mapOps.candidates(map, selectedId).map(n => n.id);
  }, [selectedId, map]);

  return (
    <div ref={wrapRef} className="canvas-wrap"
      onPointerDown={onWrapPointerDown}
      onPointerMove={onWrapPointerMove}
      onPointerUp={onWrapPointerUp}
      onPointerCancel={onWrapPointerUp}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragLeave={onDragLeave}
    >
      <div ref={stageRef} className="canvas-stage" style={{ transform: "translate(0px, 0px) scale(1)" }}>
        <svg ref={svgRef} width={layout.width} height={layout.height} viewBox={`0 0 ${layout.width} ${layout.height}`}
             xmlns="http://www.w3.org/2000/svg" className="route-svg">
          <rect data-role="canvas-bg" width={layout.width} height={layout.height} fill={theme.background} rx="14" />
          {renderedBackground?.enabled && renderedBackground.dataUrl && (
            <image
              data-role="background-image"
              href={renderedBackground.dataUrl}
              x={renderedBackgroundFrame?.x}
              y={renderedBackgroundFrame?.y}
              width={renderedBackgroundFrame?.width}
              height={renderedBackgroundFrame?.height}
              opacity={renderedBackground.opacity}
              preserveAspectRatio="none"
              pointerEvents="none"
            />
          )}
          {backgroundAdjusting && renderedBackgroundFrame && (
            <g data-role="background-transform-frame" style={{ pointerEvents: "all" }}>
              <rect
                x={renderedBackgroundFrame.x}
                y={renderedBackgroundFrame.y}
                width={renderedBackgroundFrame.width}
                height={renderedBackgroundFrame.height}
                fill="transparent"
                stroke={theme.brassHi}
                strokeWidth="1.5"
                strokeDasharray="7 5"
                onPointerDown={(e) => beginBackgroundFrameTransform(e, "move")}
                style={{ cursor: "move" }}
              />
              {backgroundFrameHandleSpecs.map((handle) => {
                const hitSize = backgroundHandleHitSize;
                const visualSize = backgroundHandleVisualSize;
                const x = renderedBackgroundFrame.x + renderedBackgroundFrame.width * handle.x;
                const y = renderedBackgroundFrame.y + renderedBackgroundFrame.height * handle.y;
                return <g key={handle.id}>
                  <rect data-role={`background-transform-handle-${handle.id}`} x={x - hitSize / 2} y={y - hitSize / 2} width={hitSize} height={hitSize}
                        rx={hitSize / 2} fill="transparent"
                        onPointerDown={(e) => beginBackgroundFrameTransform(e, handle.id)}
                        style={{ cursor: handle.cursor }} />
                  <rect x={x - visualSize / 2} y={y - visualSize / 2} width={visualSize} height={visualSize}
                        rx="2" fill={theme.background} stroke={theme.brassHi} strokeWidth="2" pointerEvents="none" />
                </g>;
              })}
            </g>
          )}
          <defs>
            <linearGradient id="colgrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.brass} stopOpacity="0" />
              <stop offset="50%" stopColor={theme.brass} stopOpacity="0.25" />
              <stop offset="100%" stopColor={theme.brass} stopOpacity="0" />
            </linearGradient>
          </defs>

          
          {layout.columns.map((_, s) => {
            const x = CANVAS_PAD_X + NODE_W/2 + s * COL_GAP;
            return <line key={`cg${s}`} x1={x} x2={x} y1="24" y2={layout.height - 24}
                         stroke="url(#colgrad)" strokeWidth="1" strokeDasharray="2 6" />;
          })}
          
          {layout.columns.map((_, s) => {
            const x = CANVAS_PAD_X + NODE_W/2 + s * COL_GAP;
            const total = layout.columns.length;
            const isLast = s === total - 1;
            return (
              <g key={`ch${s}`}>
                <text x={x} y={26} textAnchor="middle"
                      fill={isLast ? theme.blood : theme.brass}
                      fontSize="11" letterSpacing="0.18em" fontWeight="700"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  STAGE {String(s + 1).padStart(2, "0")}
                </text>
                <text x={x} y={40} textAnchor="middle"
                      fill={theme.inkDim} fontSize="9" letterSpacing="0.1em"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {s + 1} / {total}
                </text>
              </g>
            );
          })}

          
          {Array.from({ length: layout.columns.length + 1 }).map((_, i) => {
            const x = CANVAS_PAD_X + i * COL_GAP;
            const isHover = hoverCol === i;
            const btnY = layout.height - 22;   
            const bandTopY = 46;               
            const bandTopH = 24;
            const bandBotY = layout.height - 44;
            const bandBotH = 32;
            return (
              <g key={`ins${i}`} className="col-inserter" transform={`translate(${x} 0)`}
                 onPointerEnter={() => setHoverCol(i)} onPointerLeave={() => setHoverCol(cur => cur === i ? null : cur)}>
                
                <rect x={-18} y={bandTopY} width="36" height={bandTopH} fill="transparent" style={{ cursor: "pointer" }}
                      onClick={() => insertColumn(i)} />
                
                <rect x={-18} y={bandBotY} width="36" height={bandBotH} fill="transparent" style={{ cursor: "pointer" }}
                      onClick={() => insertColumn(i)} />
                {isHover && (
                  <g style={{ pointerEvents: "none" }}>
                    
                    <line x1="0" x2="0" y1={bandTopY + bandTopH} y2={bandBotY} stroke={theme.brass} strokeWidth="1.2" strokeDasharray="3 6" opacity="0.4" />
                    
                    <g transform={`translate(0 ${bandTopY + bandTopH/2})`}>
                      <circle r="10" fill={theme.panel} stroke={theme.brass} strokeWidth="1.5" opacity="0.9" />
                      <path d="M -4 0 H 4 M 0 -4 V 4" stroke={theme.brass} strokeWidth="1.6" strokeLinecap="round" />
                    </g>
                    
                    <g transform={`translate(0 ${btnY})`} style={{ pointerEvents: "auto", cursor: "pointer" }}
                       onClick={() => insertColumn(i)}>
                      <circle r="16" fill={theme.panel} stroke={theme.brass} strokeWidth="2" />
                      <path d="M -6 0 H 6 M 0 -6 V 6" stroke={theme.brass} strokeWidth="2" strokeLinecap="round" style={{ pointerEvents: "none" }} />
                      <title>この位置に列を挿入</title>
                    </g>
                  </g>
                )}
              </g>
            );
          })}

          
          {map.edges.map((e, i) => {
            const a = layout.positions[e.from]; const b = layout.positions[e.to];
            if (!a || !b) return null;
            const style = EDGE_STYLES[e.style] ?? EDGE_STYLES.normal;
            const d = edgePath(a, b);
            const active = selectedId && (e.from === selectedId || e.to === selectedId);
            const stroke = active
              ? theme.brass
              : (e.style === "forced" ? theme.lineHi : (e.style === "hidden" ? theme.edge : theme.line));
            const key = `${e.from}__${e.to}`;
            const isHover = hoverEdge === key;
            
            const midX = (a.x + b.x) / 2;
            const midY = (a.y + b.y) / 2;
            return (
              <g key={`e${i}`} className={`edge ${isHover ? "edge-hover" : ""}`}
                 onPointerEnter={() => setHoverEdge(key)}
                 onPointerLeave={() => setHoverEdge(cur => cur === key ? null : cur)}
                 onClick={(ev) => {
                   ev.stopPropagation();
                   
                   mutate(dd => mapOps.toggleEdgeStyle(dd, e.from, e.to));
                 }}>
                
                <path d={d} fill="none" stroke="transparent" strokeWidth={Math.max(20, style.width + 18)} strokeLinecap="round" style={{ pointerEvents: "stroke" }} />
                <path d={d} fill="none" stroke={stroke} strokeOpacity={e.style === "forced" ? "0.18" : "0.11"} strokeWidth={style.width + 8} strokeLinecap="round" style={{ pointerEvents: "none" }} />
                <path d={d} fill="none" stroke={stroke}
                      strokeOpacity={isHover ? Math.min(1, style.opacity + 0.15) : style.opacity}
                      strokeWidth={isHover ? style.width + 1 : style.width}
                      strokeLinecap="round" strokeDasharray={style.dash}
                      style={{ pointerEvents: "none" }} />
                {e.style === "forced" && (
                  <path d={d} fill="none" stroke={theme.background} strokeWidth={style.width - 2.2} strokeLinecap="round" style={{ pointerEvents: "none" }} />
                )}
                <title>{style.label}経路（クリック: 種類切替 / 中央の×で削除）</title>

                
                {isHover && (
                  <g transform={`translate(${midX} ${midY})`} style={{ pointerEvents: "auto" }}>
                    
                    <rect x={-64} y={-30} width={128} height={60} fill="transparent" />
                    
                    <g transform="translate(0 -18)">
                      
                      <g transform="translate(-22 0)"
                         onClick={(ev) => { ev.stopPropagation(); mutate(dd => mapOps.toggleEdgeStyle(dd, e.from, e.to)); }}
                         style={{ cursor: "pointer" }}>
                        <rect x={-24} y={-10} width={48} height={20} rx={10}
                              fill={theme.background} stroke={stroke} strokeWidth="1.5" fillOpacity="0.96" />
                        <text x={0} y={4} textAnchor="middle" fill={stroke} fontSize="10.5" fontWeight="600"
                              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
                          {style.label}
                        </text>
                        <title>クリックで種類切替 (通常→分岐→強制→隠し)</title>
                      </g>
                      
                      <g transform="translate(20 0)"
                         onClick={(ev) => { ev.stopPropagation(); mutate(dd => mapOps.removeEdge(dd, e.from, e.to)); }}
                         style={{ cursor: "pointer" }}>
                        <circle r="12" fill={theme.blood} stroke={theme.background} strokeWidth="2" />
                        <path d="M -4.5 -4.5 L 4.5 4.5 M 4.5 -4.5 L -4.5 4.5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
                        <title>この接続線を削除</title>
                      </g>
                    </g>
                  </g>
                )}
              </g>
            );
          })}

          
          {linkFrom && ghostPos && layout.positions[linkFrom] && (
            <path d={edgePath(layout.positions[linkFrom], ghostPos)}
                  fill="none" stroke={theme.brass} strokeDasharray="4 4" strokeWidth="2" />
          )}

          
          {selectedId && candidateIds.map(cid => {
            const from = layout.positions[selectedId];
            const to = layout.positions[cid];
            if (!from || !to) return null;
            return (
              <g key={`cand-${cid}`} style={{ cursor: "pointer" }}
                 onClick={(ev) => {
                   ev.stopPropagation();
                   mutate(d => mapOps.addEdge(d, selectedId, cid, "normal"));
                 }}>
                
                <path d={edgePath(from, to)}
                      fill="none" stroke={theme.brass} strokeOpacity="0.35"
                      strokeWidth="2.5" strokeDasharray="4 6" />
                
                <g transform={`translate(${to.x - NODE_W/2 - 12} ${to.y})`}>
                  <circle r="10" fill={theme.brass} fillOpacity="0.15" stroke={theme.brass} strokeWidth="2" strokeDasharray="2 2">
                    <animate attributeName="r" from="8" to="12" dur="1.4s" repeatCount="indefinite" />
                    <animate attributeName="fill-opacity" from="0.35" to="0.05" dur="1.4s" repeatCount="indefinite" />
                  </circle>
                  <path d="M -4 0 H 4 M 0 -4 V 4" stroke={theme.brass} strokeWidth="2" strokeLinecap="round" />
                  <title>クリックでこのノードに接続</title>
                </g>
              </g>
            );
          })}

          
          {dropHint && (() => {
            const x = CANVAS_PAD_X + NODE_W/2 + dropHint.stage * COL_GAP;
            const col = map.nodes.filter(n => n.stage === dropHint.stage);
            const span = (col.length) * ROW_GAP;
            const top = (layout.height - span) / 2;
            const y = top + dropHint.row * ROW_GAP;
            return (
              <g>
                <path d="M -44 -24 L -30 -44 H 30 L 44 -24 V 24 L 30 44 H -30 L -44 24 Z"
                      transform={`translate(${x} ${y})`}
                      fill={theme.brass} fillOpacity="0.12" stroke={theme.brass} strokeDasharray="4 4" strokeWidth="2" />
              </g>
            );
          })()}

          
          {map.nodes.map(node => {
            const p = layout.positions[node.id];
            if (!p) return null;
            return (
              <g key={node.id}
                 onPointerUp={() => { if (linkFrom) completeLink(node.id); }}>
                <NodeMarker
                  node={node}
                  pos={p}
                  selected={selectedId === node.id}
                  isPulse={!selectedId && node.kind === "origin"}
                  iconSize={map.theme.iconSize + 12}
                  showLabel={showLabels}
                  iconAnimation={Boolean(map.theme.iconAnimation)}
                  theme={theme}
                  onSelect={(id) => setSelectedId(id)}
                  onStartLink={(id, e) => startLink(id, e)}
                  onRemove={(id) => mutate(d => mapOps.removeNode(d, id))}
                />
              </g>
            );
          })}

          
          {layout.columns.map((col, s) => {
            if (col.length >= MAX_NODES_PER_COLUMN) return null;
            const x = CANVAS_PAD_X + NODE_W/2 + s * COL_GAP;
            const span = (col.length) * ROW_GAP;
            const top = (layout.height - span) / 2;
            const y = top + col.length * ROW_GAP;
            return (
              <g key={`add-${s}`} className="add-node" transform={`translate(${x} ${y})`}
                 onClick={() => addNodeAt(s, col.length)}
                 style={{ cursor: "pointer" }}>
                <path d="M -44 -24 L -30 -44 H 30 L 44 -24 V 24 L 30 44 H -30 L -44 24 Z"
                      fill="transparent" stroke={theme.inkDim} strokeDasharray="4 4" strokeWidth="1.6" />
                <path d="M -10 0 H 10 M 0 -10 V 10" stroke={theme.inkDim} strokeWidth="2.6" strokeLinecap="round" />
                <title>この列にマスを追加</title>
              </g>
            );
          })}
        </svg>
      </div>

      
      <div className="canvas-controls" onPointerDown={e => e.stopPropagation()}>
        <button onClick={() => changeZoom(-0.12)} title="縮小">−</button>
        <button onClick={fit} title="全体表示 (Fit)">◫</button>
        <button onClick={() => changeZoom(0.12)} title="拡大">＋</button>
        <span ref={zoomReadoutRef} className="zoom-readout">100%</span>
      </div>
      {backgroundAdjusting && background?.enabled && (
        <div className="background-adjust-indicator" aria-live="polite">
          背景調整中：枠内で移動 ／ 角・辺で幅・高さを調整
        </div>
      )}
      <div className="center-crosshair" aria-hidden="true">
        <span/><span/>
      </div>
      <MiniMap map={map} layout={layout} theme={theme} />
    </div>
  );
}, (prev, next) => (
  prev.map.nodes === next.map.nodes && prev.map.edges === next.map.edges &&
  prev.map.background === next.map.background &&
  prev.map.theme.iconSize === next.map.theme.iconSize && prev.map.theme.showLabels === next.map.theme.showLabels &&
  prev.selectedId === next.selectedId && prev.showLabels === next.showLabels &&
  prev.selectedKind === next.selectedKind && prev.backgroundAdjusting === next.backgroundAdjusting &&
  prev.mutate === next.mutate && prev.setSelectedId === next.setSelectedId
));

function MiniMap({ map, layout, theme }) {
  const [collapsed, setCollapsed] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem("kagami-minimap-collapsed") ?? "false"); } catch { return false; }
  });
  React.useEffect(() => { localStorage.setItem("kagami-minimap-collapsed", JSON.stringify(collapsed)); }, [collapsed]);
  const SIZE = 168;
  const scale = Math.min(SIZE / layout.width, SIZE / layout.height * 0.7);
  const mw = layout.width * scale;
  const mh = layout.height * scale;
  return (
    <div className={`mini-map ${collapsed ? "collapsed" : ""}`} onPointerDown={e => e.stopPropagation()}>
      <div className="mini-map-head">
        <span className="mini-map-label">{collapsed ? "MAP ↗" : "MINIMAP"}</span>
        <button className="mini-map-collapse-btn" onClick={() => setCollapsed(v => !v)}
                title={collapsed ? "ミニマップを表示" : "ミニマップを畳む"}>
          {collapsed ? "▲" : "▼"}
        </button>
      </div>
      {!collapsed && (
        <svg width={SIZE} height={SIZE * 0.7} viewBox={`0 0 ${SIZE} ${SIZE * 0.7}`}>
          <rect width="100%" height="100%" fill={theme.background} rx="6" />
          <g transform={`translate(${(SIZE - mw)/2} ${(SIZE * 0.7 - mh)/2})`}>
            <rect width={mw} height={mh} fill={theme.panel} rx="4" />
            {map.edges.map((e, i) => {
              const a = layout.positions[e.from]; const b = layout.positions[e.to];
              if (!a || !b) return null;
              return <line key={i} x1={a.x*scale} y1={a.y*scale} x2={b.x*scale} y2={b.y*scale} stroke={theme.lineHi} strokeOpacity="0.5" strokeWidth="1" />;
            })}
            {map.nodes.map(n => {
              const p = layout.positions[n.id];
              if (!p) return null;
              const c = KIND_INDEX[n.kind]?.tone === "blood" ? theme.blood : KIND_INDEX[n.kind]?.tone === "brass" ? theme.brass : theme.ink;
              return <circle key={n.id} cx={p.x*scale} cy={p.y*scale} r="3" fill={c} />;
            })}
          </g>
        </svg>
      )}
    </div>
  );
}

Object.assign(window, { MapCanvas, computeLayout });

function useCompactViewport() {
  const [compact, setCompact] = React.useState(() => window.matchMedia?.("(max-width: 768px)")?.matches ?? false);
  React.useEffect(() => {
    const media = window.matchMedia?.("(max-width: 768px)");
    if (!media) return undefined;
    const sync = () => setCompact(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return compact;
}

function Palette({ selectedKind, setSelectedKind, mutate, mobileSheet, setMobileSheet, selectedId }) {
  const compact = useCompactViewport();
  const [collapsed, setCollapsed] = React.useState(() => window.matchMedia?.("(max-width: 768px)")?.matches ?? false);
  const [pos, setPos] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem("kagami-palette-pos") ?? "null") ?? { x: 24, y: 96 }; } catch { return { x: 24, y: 96 }; }
  });
  React.useEffect(() => { localStorage.setItem("kagami-palette-pos", JSON.stringify(pos)); }, [pos]);
  React.useEffect(() => { if (compact) setCollapsed(true); }, [compact]);
  React.useEffect(() => { if (!compact && selectedId) setCollapsed(true); }, [compact, selectedId]);
  const isCollapsed = compact ? mobileSheet !== "palette" : collapsed;
  const toggle = () => compact ? setMobileSheet(isCollapsed ? "palette" : null) : setCollapsed(v => !v);
  const dragRef = React.useRef(null);
  const onHeadDown = (e) => {
    if (e.target.closest("button")) return;
    dragRef.current = { id: e.pointerId, x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onHeadMove = (e) => {
    if (!dragRef.current || dragRef.current.id !== e.pointerId) return;
    setPos({ x: e.clientX - dragRef.current.x, y: e.clientY - dragRef.current.y });
  };
  const onHeadUp = (e) => { if (dragRef.current?.id === e.pointerId) dragRef.current = null; };

  return (
    <div className={`fp palette ${isCollapsed ? "is-collapsed" : ""} ${compact ? "is-mobile" : ""}`} style={{ left: pos.x, top: pos.y, width: isCollapsed ? 48 : 268 }}>
      <div className="fp-head" onPointerDown={onHeadDown} onPointerMove={onHeadMove} onPointerUp={onHeadUp}
           onClick={() => { if (compact && isCollapsed) setMobileSheet("palette"); }}>
        <span className="fp-title">{isCollapsed ? "マス" : "マス種類"}</span>
        <button className="fp-btn" type="button" title={isCollapsed ? "展開" : "畳む"} onPointerDown={e => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); toggle(); }}>
          {isCollapsed ? "▲" : "▼"}
        </button>
      </div>
      {!isCollapsed && (
        <div className="palette-body">
          <p className="palette-hint">{compact ? "種別を選択して、列内の＋から追加できます。" : <>ドラッグで配置。<kbd>1</kbd>〜<kbd>8</kbd> でも切替。</>}</p>
          <div className="palette-grid">
            {KINDS.map((k, idx) => {
              const Icon = IconMap[k.id];
              const isSel = selectedKind === k.id;
              const tone = k.tone === "blood" ? THEME.blood : k.tone === "brass" ? THEME.brass : THEME.ink;
              return (
                <button key={k.id}
                        className={`palette-item ${isSel ? "on" : ""}`}
                        draggable
                        onDragStart={(e) => { e.dataTransfer.setData("application/x-kind", k.id); e.dataTransfer.effectAllowed = "copy"; }}
                        onClick={() => { setSelectedKind(k.id); if (compact) setMobileSheet(null); }}
                        title={`${k.label} — ${k.desc} (キー ${idx + 1})`}
                        style={{ borderColor: isSel ? tone : "transparent" }}>
                  <div className="palette-icon palette-icon-quiet" style={{ background: THEME.bg }}>
                    <Icon ink={THEME.ink} accent={tone} warn={THEME.warn} variant="quiet" />
                  </div>
                  <div className="palette-caption">
                    <span className="palette-name">{k.label}</span>
                    <span className="palette-short" style={{ color: tone }}>{k.short}</span>
                  </div>
                  <span className="palette-hotkey" aria-hidden="true">{idx + 1}</span>
                </button>
              );
            })}
          </div>
          <div className="palette-legend">
            <div><span className="edge-swatch normal"/>通常</div>
            <div><span className="edge-swatch branch"/>分岐</div>
            <div><span className="edge-swatch forced"/>強制</div>
            <div><span className="edge-swatch hidden"/>隠し</div>
          </div>
        </div>
      )}
    </div>
  );
}

function Inspector({ map, selectedId, mutate, mobileSheet, setMobileSheet }) {
  const compact = useCompactViewport();
  const [collapsed, setCollapsed] = React.useState(() => !selectedId || (window.matchMedia?.("(max-width: 768px)")?.matches ?? false));
  const [pos, setPos] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem("kagami-inspector-pos") ?? "null") ?? { right: 24, bottom: 24 }; } catch { return { right: 24, bottom: 24 }; }
  });
  React.useEffect(() => { localStorage.setItem("kagami-inspector-pos", JSON.stringify(pos)); }, [pos]);

  const node = map.nodes.find(n => n.id === selectedId);
  React.useEffect(() => {
    if (node) {
      if (compact) setMobileSheet("inspector");
      else setCollapsed(false);
    } else if (!compact) {
      setCollapsed(true);
    }
  }, [compact, node?.id, setMobileSheet]);
  const isCollapsed = compact ? mobileSheet !== "inspector" : collapsed;
  const toggle = () => compact ? setMobileSheet(isCollapsed ? "inspector" : null) : setCollapsed(v => !v);
  if (!node) return (
    <div className={`fp inspector empty ${isCollapsed ? "is-collapsed" : ""} ${compact ? "is-mobile" : ""}`} style={{ right: pos.right, bottom: pos.bottom, width: isCollapsed ? 44 : 300 }}>
      <div className="fp-head" style={{ cursor: compact ? "pointer" : "default" }} onClick={() => { if (compact && isCollapsed) setMobileSheet("inspector"); }}>
        <span className="fp-title">{isCollapsed ? "編集" : "プロパティ"}</span>
        <button className="fp-btn" type="button" onClick={(e) => { e.stopPropagation(); toggle(); }} title={isCollapsed ? "展開" : "畳む"}>{isCollapsed ? "▲" : "▼"}</button>
      </div>
      {!isCollapsed && <div className="inspector-body empty">
          <p>マップ上のマスを選択してください</p>
          <p className="dim">{compact ? <>・空白を指でドラッグしてマップを移動<br/>・2本指の開閉で拡大・縮小<br/>・マスをタップして編集シートを開く<br/>・選択したマスから青緑の＋をタップして結線</> : <>・空白クリックで選択解除<br/>・<kbd>Space</kbd>+ドラッグでパン<br/>・<kbd>マウスホイール</kbd>で拡縮<br/>・選択ノードから点滅する◯を<b>クリック</b>で結線</>}</p>
        </div>}
    </div>
  );

  const kindDef = KIND_INDEX[node.kind];
  const inbound  = map.edges.filter(e => e.to === node.id);
  const outbound = map.edges.filter(e => e.from === node.id);

  return (
    <div className={`fp inspector ${isCollapsed ? "is-collapsed" : ""} ${compact ? "is-mobile" : ""}`} style={{ right: pos.right, bottom: pos.bottom, width: isCollapsed ? 44 : 300 }}>
      <div className="fp-head" onClick={() => { if (compact && isCollapsed) setMobileSheet("inspector"); }}>
        <span className="fp-title">{isCollapsed ? "編集" : `#${node.stage + 1}-${node.row + 1} ${getNodeDisplayLabel(node)}`}</span>
        <button className="fp-btn" type="button" onClick={(e) => { e.stopPropagation(); toggle(); }} title={isCollapsed ? "展開" : "畳む"}>{isCollapsed ? "▲" : "▼"}</button>
      </div>
      {!isCollapsed && (
        <div className="inspector-body">
          <label className="i-label">種別</label>
          <div className="i-kinds">
            {KINDS.map(k => {
              const Icon = IconMap[k.id];
              const tone = k.tone === "blood" ? THEME.blood : k.tone === "brass" ? THEME.brass : THEME.ink;
              return (
                <button key={k.id} className={`i-kind ${node.kind === k.id ? "on" : ""}`}
                        style={{ borderColor: node.kind === k.id ? tone : "transparent" }}
                        onClick={() => mutate(d => mapOps.changeKind(d, node.id, k.id))}
                        title={k.label}>
                  <Icon ink={THEME.ink} accent={tone} warn={THEME.warn} variant="quiet" />
                </button>
              );
            })}
          </div>

          <label className="i-label" htmlFor="node-label">このマスの表示名</label>
          <div className="i-label-edit">
            <input id="node-label" className="i-input" value={node.label ?? ""}
                   placeholder={`${kindDef?.label ?? "一般戦闘"}（未入力時）`}
                   maxLength={24}
                   onChange={(e) => mutate(d => mapOps.updateNode(d, node.id, { label: e.target.value }))} />
            <button className="tinybtn" type="button"
                    onClick={() => mutate(d => mapOps.updateNode(d, node.id, { label: "" }))}
                    title="未入力にして現在の種類名へ戻す">種類名</button>
          </div>
          <p className="i-desc i-label-hint">マスごとに自由に変更できます。未入力なら現在の種類名を表示します。</p>

          <div className="i-row">
            <div>
              <label className="i-label">列</label>
              <div className="i-stepper">
                <button onClick={() => mutate(d => mapOps.updateNode(d, node.id, { stage: Math.max(0, node.stage - 1) }))}>−</button>
                <span>{node.stage + 1}</span>
                <button onClick={() => mutate(d => mapOps.updateNode(d, node.id, { stage: Math.min(MAX_COLUMNS - 1, node.stage + 1) }))}>＋</button>
              </div>
            </div>
            <div>
              <label className="i-label">行</label>
              <div className="i-stepper">
                <button onClick={() => mutate(d => mapOps.updateNode(d, node.id, { row: Math.max(0, node.row - 1) }))}>−</button>
                <span>{node.row + 1}</span>
                <button onClick={() => mutate(d => mapOps.updateNode(d, node.id, { row: Math.min(MAX_NODES_PER_COLUMN - 1, node.row + 1) }))}>＋</button>
              </div>
            </div>
          </div>

          <label className="i-label">接続 (入 {inbound.length} / 出 {outbound.length})</label>
          {inbound.length > 0 && (
            <div className="i-edgelist">
              {inbound.map((e) => {
                const src = map.nodes.find(n => n.id === e.from);
                return (
                  <div key={`in-${e.from}-${e.to}`} className="i-edgerow i-edgerow-in">
                    <span className={`edge-swatch ${e.style}`} />
                    <span>← #{src?.stage + 1}-{src?.row + 1} {getNodeDisplayLabel(src)}</span>
                    <button className="tinybtn"
                            onClick={() => mutate(d => mapOps.toggleEdgeStyle(d, e.from, e.to))} title="種類切替">↻</button>
                    <button className="tinybtn danger"
                            onClick={() => mutate(d => mapOps.removeEdge(d, e.from, e.to))} title="削除">×</button>
                  </div>
                );
              })}
            </div>
          )}
          {outbound.length > 0 && (
            <div className="i-edgelist" style={{ marginTop: 4 }}>
              {outbound.map((e) => {
                const target = map.nodes.find(n => n.id === e.to);
                return (
                  <div key={`out-${e.from}-${e.to}`} className="i-edgerow">
                    <span className={`edge-swatch ${e.style}`} />
                    <span>→ #{target?.stage + 1}-{target?.row + 1} {getNodeDisplayLabel(target)}</span>
                    <button className="tinybtn"
                            onClick={() => mutate(d => mapOps.toggleEdgeStyle(d, e.from, e.to))} title="種類切替">↻</button>
                    <button className="tinybtn danger"
                            onClick={() => mutate(d => mapOps.removeEdge(d, e.from, e.to))} title="削除">×</button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="i-actions">
            <button className="btn danger" onClick={() => mutate(d => mapOps.removeNode(d, node.id))}>マスを削除</button>
          </div>

          <p className="i-desc">{kindDef?.desc}</p>
        </div>
      )}
    </div>
  );
}

function ExportDialog({ open, format, theme, iconAnimation, onClose, onConfirm }) {
  const [bg, setBg] = React.useState("theme");
  const [scale, setScale] = React.useState(2);
  const [quality, setQuality] = React.useState(0.92);
  const FPS_OPTIONS = [
    { fps: 4, delayMs: 250, label: "低 (4fps)", hint: "どっとアニメ調" },
    { fps: 8, delayMs: 125, label: "中 (8fps)", hint: "なめらか" },
    { fps: 12, delayMs: 83, label: "高 (12fps)", hint: "最もなめらか" },
  ];
  const [fpsIdx, setFpsIdx] = React.useState(0);
  const dialogRef = React.useRef(null);
  React.useEffect(() => {
    if (open && (format === "jpeg" || format === "gif") && bg === "transparent") setBg("theme");
  }, [open, format, bg]);
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (dialogRef.current && !dialogRef.current.contains(e.target)) onClose(); };
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    setTimeout(() => document.addEventListener("mousedown", onDown), 0);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open, onClose]);
  if (!open) return null;

  const formatLabel = format === "jpeg" ? "JPEG" : format === "gif" ? "GIF" : format === "apng" ? "APNG" : "PNG";
  return (
    <div className="modal-mask">
      <div className="modal" ref={dialogRef}>
        <div className="modal-head">
          <span className="modal-title">{formatLabel} として保存</span>
          <button className="fp-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <label className="i-label">背景</label>
          <div className="bg-choices">
            <button className={`bg-choice ${bg === "theme" ? "on" : ""}`} onClick={() => setBg("theme")}>
              <div className="bg-preview" style={{ background: theme.background }} />
              <span>テーマ背景</span>
              <small>ダーク配色をそのまま</small>
            </button>
            {(format === "png" || format === "apng") && (
              <button className={`bg-choice ${bg === "transparent" ? "on" : ""}`} onClick={() => setBg("transparent")}>
                <div className="bg-preview bg-check" />
                <span>透過</span>
                <small>PNG透過</small>
              </button>
            )}
            <button className={`bg-choice ${bg === "white" ? "on" : ""}`} onClick={() => setBg("white")}>
              <div className="bg-preview" style={{ background: "#f8f6ef" }} />
              <span>白背景</span>
              <small>紙・印刷向け</small>
            </button>
          </div>
          {(format === "png" || format === "jpeg" || format === "gif" || format === "apng") && (
            <>
              <label className="i-label">解像度倍率</label>
              <div className="scale-choices">
                {(format === "gif" || format === "apng" ? [1, 2] : [1, 2, 3, 4]).map(v => (
                  <button key={v} className={`scale-choice ${scale === v ? "on" : ""}`} onClick={() => setScale(v)}>
                    {v}×
                  </button>
                ))}
              </div>
              <p className="modal-hint">
                {scale}× → 実寸 ×{scale}倍の{formatLabel}（{format === "jpeg" ? "高品質JPEG" : format === "gif" || format === "apng" ? (iconAnimation ? "アイコンの低FPSアニメを含む" : "静止1フレーム") : scale === 4 ? "高精細印刷向け" : scale === 1 ? "軽量" : "標準"}）
              </p>
              {(format === "gif" || format === "apng") && iconAnimation && (
                <>
                  <label className="i-label">アニメーション速度</label>
                  <div className="scale-choices">
                    {FPS_OPTIONS.map((opt, index) => (
                      <button key={opt.fps} className={`scale-choice ${fpsIdx === index ? "on" : ""}`} onClick={() => setFpsIdx(index)}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <p className="modal-hint">{FPS_OPTIONS[fpsIdx].hint} — GIF89a標準の1/100秒単位で設定</p>
                </>
              )}
            </>
          )}
          {format === "jpeg" && (
            <>
              <label className="i-label">JPEG画質</label>
              <div className="scale-choices">
                {[[0.82, "標準"], [0.92, "高画質"], [0.98, "最高"]].map(([value, label]) => (
                  <button key={value} className={`scale-choice ${quality === value ? "on" : ""}`} onClick={() => setQuality(value)}>
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="modal-foot">
          <button className="btn" onClick={onClose}>キャンセル</button>
          <button className="btn primary" onClick={() => onConfirm({ bg, scale, quality, delayMs: FPS_OPTIONS[fpsIdx].delayMs })}>保存</button>
        </div>
      </div>
    </div>
  );
}

function Toolbar({
  map, mutate, replace, undo, redo, canUndo, canRedo,
  onExportPng, onExportJpeg, onExportGif, onExportApng, onExportJson,
  onReset, onFit, onAutoConnect,
  notify, showLabels, setShowLabels,
  showThumb, setShowThumb,
  activeTheme, onThemeCommit, selectedKind, setSelectedId,
  backgroundAdjusting, setBackgroundAdjusting,
}) {
  const fileRef = React.useRef(null);
  const backgroundFileRef = React.useRef(null);
  const [showTheme, setShowTheme] = React.useState(false);
  const [showBackground, setShowBackground] = React.useState(false);
  const [showExport, setShowExport] = React.useState(false);
  const themeRef = React.useRef(null);
  const backgroundRef = React.useRef(null);
  const exportRef = React.useRef(null);
  const previewThemeRef = React.useRef(activeTheme);
  const themeCommitTimer = React.useRef(null);
  const themePreviewFrame = React.useRef(0);

  React.useEffect(() => {
    previewThemeRef.current = activeTheme;
  }, [activeTheme]);
  React.useEffect(() => () => {
    window.clearTimeout(themeCommitTimer.current);
    window.cancelAnimationFrame(themePreviewFrame.current);
  }, []);

  const applyPreviewVars = (theme) => {
    const root = document.querySelector(".app-root");
    if (!root) return;
    root.dataset.themePreviewing = "true";
    Object.entries(themeToCssVars(theme)).forEach(([name, value]) => root.style.setProperty(name, value));
  };

  const commitPreviewTheme = () => {
    window.clearTimeout(themeCommitTimer.current);
    window.cancelAnimationFrame(themePreviewFrame.current);
    themePreviewFrame.current = 0;
    document.querySelector(".app-root")?.removeAttribute("data-theme-previewing");
    onThemeCommit(previewThemeRef.current);
  };

  const previewTheme = (changes, immediate = false) => {
    const next = { ...previewThemeRef.current, ...changes };
    previewThemeRef.current = next;
    window.clearTimeout(themeCommitTimer.current);
    if (immediate) {
      commitPreviewTheme();
      return;
    }
    
    if (!themePreviewFrame.current) {
      themePreviewFrame.current = window.requestAnimationFrame(() => {
        themePreviewFrame.current = 0;
        applyPreviewVars(previewThemeRef.current);
      });
    }
    themeCommitTimer.current = window.setTimeout(commitPreviewTheme, 180);
  };

  React.useEffect(() => {
    const onDown = (e) => {
      if (themeRef.current && !themeRef.current.contains(e.target)) setShowTheme(false);
      if (backgroundRef.current && !backgroundRef.current.contains(e.target)) setShowBackground(false);
      if (exportRef.current && !exportRef.current.contains(e.target)) setShowExport(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const handleImport = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(String(reader.result));
        replace(json);
        notify("JSONセーブを読み込みました");
      } catch { notify("読み込みに失敗しました"); }
      if (fileRef.current) fileRef.current.value = "";
    };
    reader.readAsText(file);
  };

  const updateBackground = (patch) => {
    mutate(draft => { draft.background = normalizeBackground({ ...draft.background, ...patch }); });
  };
  const updateUniformBackgroundScale = (value) => {
    const scale = Number(value);
    updateBackground({ scale, scaleX: scale, scaleY: scale });
  };

  const handleBackgroundImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const preparedBackground = await prepareBackgroundImage(file);
      const layout = computeLayout(map);
      const background = fitBackgroundToMap(preparedBackground, layout.width, layout.height, { padding: 36 });
      mutate(draft => { draft.background = background; });
      setBackgroundAdjusting(true);
      notify(`背景画像をマップ内に収めて配置しました：${background.name}`);
    } catch (error) {
      notify(error instanceof Error ? error.message : "背景画像を読み込めませんでした");
    } finally {
      if (backgroundFileRef.current) backgroundFileRef.current.value = "";
    }
  };

  const background = map.background;
  const hasBackground = Boolean(background?.dataUrl);

  return (
    <div className="toolbar">
      <div className="tb-group tb-brand-group">
        <span className="tb-brand">
          <span className="brand-mark">
            <svg viewBox="0 0 40 40" width="30" height="30" aria-hidden="true">
              <defs>
                <linearGradient id="brandg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f4c876" />
                  <stop offset="100%" stopColor="#c8443c" />
                </linearGradient>
              </defs>
              
              <path d="M 8 6 H 32 L 34 14 V 26 L 32 34 H 8 L 6 26 V 14 Z"
                    fill="#12101a" stroke="url(#brandg)" strokeWidth="2" strokeLinejoin="round" />
              
              <path d="M 12 10 H 28 L 30 16 V 24 L 28 30 H 12 L 10 24 V 16 Z"
                    fill="none" stroke="#d4a24b" strokeOpacity="0.6" strokeWidth="1" />
              
              <g fill="#d4a24b">
                <circle cx="14" cy="20" r="2.2" />
                <circle cx="20" cy="14" r="2.2" />
                <circle cx="26" cy="20" r="2.2" />
                <circle cx="20" cy="26" r="2.2" />
              </g>
              <g stroke="#d4a24b" strokeWidth="1.2" fill="none">
                <path d="M 14 20 L 20 14 L 26 20 L 20 26 Z" />
              </g>
            </svg>
          </span>
          <span className="brand-titles">
            <span className="brand-title">Kagami Map Studio</span>
            <span className="brand-sub">鏡ダンジョン MAP エディタ</span>
          </span>
        </span>
      </div>

      <div className="tb-group">
        <button className="tb-btn icon-btn" onClick={undo} disabled={!canUndo} title="元に戻す (⌘Z)">↶</button>
        <button className="tb-btn icon-btn" onClick={redo} disabled={!canRedo} title="やり直し (⌘⇧Z)">↷</button>
      </div>

      <div className="tb-group">
        <button className="tb-btn"
                onClick={() => {
                  let id = null;
                  mutate(d => { id = mapOps.addColumn(d, (Math.max(0, ...d.nodes.map(n => n.stage))) + 1, selectedKind); });
                  if (id) setSelectedId(id);
                }}
                title="末尾に列を追加（視点は動かしません）">列 ＋</button>
        <button className="tb-btn" onClick={onAutoConnect}
                title="扇状分岐・持続レーン・菱形再合流で自動接続">自動接続</button>
        <button className="tb-btn" onClick={onFit} title="全体表示">全体</button>
      </div>

      <div className="tb-group">
        <label className="tb-check" title="マス下に名称テキストを併記">
          <input type="checkbox" checked={showLabels} onChange={e => setShowLabels(e.target.checked)} />
          ラベル
        </label>
        <div ref={themeRef} style={{ position: "relative" }}>
          <button className="tb-btn" onClick={() => {
            if (showTheme) commitPreviewTheme();
            setShowTheme(v => !v);
          }} title="表示テーマ">テーマ</button>
          {showTheme && (
            <div className="tb-popover">
              <label className="i-label">アイコンサイズ</label>
              <input type="range" min="32" max="60" value={activeTheme.iconSize}
                     onChange={e => replace({ ...map, theme: { ...map.theme, iconSize: Number(e.target.value) } })} />
              <label className="i-check">
                <input type="checkbox" checked={showThumb}
                       onChange={e => setShowThumb(e.target.checked)} />
                ミニマップを表示
              </label>
              <label className="i-check">
                <input type="checkbox" checked={Boolean(map.theme.iconAnimation)}
                       onChange={e => replace({ ...map, theme: { ...map.theme, iconAnimation: e.target.checked } })} />
                アイコンを低FPSアニメ調にする
              </label>
              <label className="i-label" style={{ marginTop: 8 }}>配色プリセット</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4, marginTop: 4 }}>
                {THEME_PRESETS.map(preset => (
                  <button key={preset.id} className="tb-btn" style={{ padding: "6px 4px", fontSize: 10 }}
                          onClick={() => previewTheme(preset.colors, true)}>{preset.label}</button>
                ))}
              </div>
              <label className="i-label" style={{ marginTop: 8 }}>全体配色</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 4 }}>
                {[
                  ["背景", "background"], ["パネル", "panel"], ["パネル明", "panelHi"], ["枠線", "edge"],
                  ["文字", "ink"], ["文字補助", "inkDim"], ["主要線", "lineHi"], ["補助線", "line"],
                  ["強調", "brass"], ["強調明", "brassHi"], ["警戒", "blood"], ["警戒明", "bloodHi"], ["警告", "warn"],
                ].map(([label, key]) => (
                  <label key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, color: "var(--ink-dim)", fontSize: 11 }}>
                    {label}
                    <input type="color" value={activeTheme[key]}
                           onChange={e => previewTheme({ [key]: e.target.value })}
                           title={`${label}の色`} style={{ width: 28, height: 22, padding: 0, border: 0, background: "transparent", cursor: "pointer" }} />
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="tb-group">
        <div ref={backgroundRef} style={{ position: "relative" }}>
          <button className={`tb-btn ${backgroundAdjusting ? "is-active" : ""}`} onClick={() => setShowBackground(v => !v)}
                  title="背景画像の読込と調整">背景{hasBackground ? " ●" : ""}</button>
          {showBackground && (
            <div className="tb-popover background-popover">
              <label className="i-label">マップ背景</label>
              <p className="background-status">{hasBackground ? `${background.name}（元画像 ${background.width}×${background.height}px ／ 枠 ${Math.round(background.width * (background.scaleX ?? background.scale))}×${Math.round(background.height * (background.scaleY ?? background.scale))}px）` : "PNG・JPEG・WebP・GIF・APNGをこの端末内だけで読み込みます"}</p>
              <button className="btn primary background-upload-btn" onClick={() => backgroundFileRef.current?.click()}>
                {hasBackground ? "画像を差し替え" : "画像を選択"}
              </button>
              <input ref={backgroundFileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/apng,.apng" onChange={handleBackgroundImage} style={{ display: "none" }} />
              {hasBackground && (
                <>
                  <label className="i-check">
                    <input type="checkbox" checked={background.enabled}
                           onChange={e => { updateBackground({ enabled: e.target.checked }); if (!e.target.checked) setBackgroundAdjusting(false); }} />
                    背景画像を表示
                  </label>
                  <button className={`btn background-adjust-btn ${backgroundAdjusting ? "is-active" : ""}`}
                          onClick={() => { setBackgroundAdjusting(value => !value); setShowBackground(false); }}>
                    {backgroundAdjusting ? "枠の調整を完了" : "枠をドラッグで自由変形"}
                  </button>
                  <label className="i-label">均等倍率 {Math.round(background.scale * 100)}%</label>
                  <input className="background-range" type="range" min={BACKGROUND_MIN_SCALE} max="4" step="0.01" value={background.scale}
                         onChange={e => updateUniformBackgroundScale(e.target.value)} />
                  <label className="i-label">不透明度 {Math.round(background.opacity * 100)}%</label>
                  <input className="background-range" type="range" min="0.08" max="1" step="0.01" value={background.opacity}
                         onChange={e => updateBackground({ opacity: Number(e.target.value) })} />
                  <div className="background-actions">
                    <button className="btn" onClick={() => mutate(draft => { draft.background = resetBackgroundTransform(draft.background); })}>調整を初期化</button>
                    <button className="btn danger" onClick={() => { mutate(draft => { draft.background = createBackground(); }); setBackgroundAdjusting(false); }}>画像を削除</button>
                  </div>
                  <p className="background-hint">調整中は画像枠の内側で移動、角・辺で幅と高さを調整します。マスや結線の操作は維持されます。</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="tb-group">
        <div ref={exportRef} style={{ position: "relative" }}>
          <button className="tb-btn tb-btn-primary" onClick={() => {
            commitPreviewTheme();
            setShowExport(v => !v);
          }} title="画像/データとして保存">保存 ▾</button>
          {showExport && (
            <div className="tb-popover tb-popover-export">
              <button className="popover-row" onClick={() => { setShowExport(false); onExportPng(); }}>
                <span className="pr-name">PNG 画像</span>
                <span className="pr-desc">透過・背景・解像度を選べる</span>
              </button>
              <button className="popover-row" onClick={() => { setShowExport(false); onExportJpeg(); }}>
                <span className="pr-name">JPEG 画像</span>
                <span className="pr-desc">背景色・画質・解像度を選べる</span>
              </button>
              <button className="popover-row" onClick={() => { setShowExport(false); onExportGif(); }}>
                <span className="pr-name">GIF 画像</span>
                <span className="pr-desc">低FPSアイコンアニメを出力できる</span>
              </button>
              <button className="popover-row" onClick={() => { setShowExport(false); onExportApng(); }}>
                <span className="pr-name">APNG 画像</span>
                <span className="pr-desc">PNG品質で低FPSアニメを出力できる</span>
              </button>
              <button className="popover-row" onClick={() => { setShowExport(false); onExportJson(); }}>
                <span className="pr-name">JSON セーブファイル</span>
                <span className="pr-desc">ノード・接続・配色設定を保存</span>
              </button>
              <div className="popover-sep" />
              <button className="popover-row" onClick={() => { setShowExport(false); fileRef.current?.click(); }}>
                <span className="pr-name">JSON セーブを読込</span>
                <span className="pr-desc">保存済みマップを復元</span>
              </button>
              <input ref={fileRef} type="file" accept="application/json" onChange={handleImport} style={{ display: "none" }} />
            </div>
          )}
        </div>
        <button className="tb-btn tb-btn-danger" onClick={onReset} title="初期状態に戻す">初期化</button>
      </div>
    </div>
  );
}

Object.assign(window, { Palette, Inspector, Toolbar, ExportDialog });

function App() {
  const { map, mutate, replace, replaceTheme, undo, redo, canUndo, canRedo } = useMapHistory();
  const [selectedId, setSelectedId] = React.useState(null);
  const [selectedKind, setSelectedKind] = React.useState("skirmish");
  const [mobileSheet, setMobileSheet] = React.useState(null);
  const [notice, setNotice] = React.useState("");
  const [showThumb, setShowThumb] = React.useState(true);
  const [showLabels, setShowLabels] = React.useState(true);
  const [backgroundAdjusting, setBackgroundAdjusting] = React.useState(false);
  const [themeResetKey, setThemeResetKey] = React.useState(0);
  
  const [exportModal, setExportModal] = React.useState(null);
  const activeTheme = map.theme;
  const activeMap = map;
  const commitTheme = React.useCallback((theme) => {
    replaceTheme(theme);
  }, [replaceTheme]);

  React.useEffect(() => {
    if (!map.background?.enabled) setBackgroundAdjusting(false);
  }, [map.background?.enabled]);

  const notify = React.useCallback((text) => {
    setNotice(text);
    window.clearTimeout(notify.__t);
    notify.__t = window.setTimeout(() => setNotice(""), 2500);
  }, []);

  
  React.useEffect(() => {
    const isEditable = (el) => {
      if (!el) return false;
      const tag = el.tagName;
      return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
    };
    const onKey = (e) => {
      if (isEditable(e.target)) return;
      const mod = e.ctrlKey || e.metaKey;
      if (mod && !e.shiftKey && e.key.toLowerCase() === "z") { e.preventDefault(); undo(); return; }
      if (mod && e.shiftKey && e.key.toLowerCase() === "z") { e.preventDefault(); redo(); return; }
      if (mod && e.key.toLowerCase() === "y") { e.preventDefault(); redo(); return; }
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        e.preventDefault();
        mutate(d => mapOps.removeNode(d, selectedId));
        setSelectedId(null);
        return;
      }
      const nkey = parseInt(e.key, 10);
      if (!Number.isNaN(nkey) && nkey >= 1 && nkey <= KINDS.length) {
        const kind = KINDS[nkey - 1].id;
        if (selectedId) mutate(d => mapOps.changeKind(d, selectedId, kind));
        else setSelectedKind(kind);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo, selectedId, mutate]);

  
  const buildExportSvg = (opts = {}) => {
    const { bg = "theme", raster = false, iconFrame = null } = opts;
    const source = document.querySelector(".route-svg");
    if (!source) return null;
    const svg = source.cloneNode(true);
    Object.entries(themeToCssVars(activeTheme)).forEach(([name, value]) => svg.style.setProperty(name, value));
    
    svg.querySelectorAll(".col-inserter, .add-node, .linkhandle").forEach(el => el.remove());
    svg.querySelectorAll(".nd.sel circle[stroke-dasharray]").forEach(el => el.remove());
    
    svg.querySelectorAll("g.sel > g > circle[fill='" + THEME.blood + "']").forEach(el => el.remove());
    
    svg.querySelectorAll("g[class*='cand']").forEach(el => {});
    
    svg.querySelectorAll("animate, animateTransform").forEach(el => el.remove());
    
    if (raster) {
      svg.querySelectorAll("foreignObject").forEach(fo => {
        const sourceIcon = fo.querySelector("svg");
        if (!sourceIcon) { fo.remove(); return; }
        const icon = sourceIcon.cloneNode(true);
        ["x", "y", "width", "height"].forEach(name => icon.setAttribute(name, fo.getAttribute(name) ?? "0"));
        if (iconFrame !== null && activeMap.theme.iconAnimation) {
          const kind = fo.closest(".nd")?.getAttribute("data-kind") ?? "skirmish";
          const motion = getIconIdleMotion(kind, iconFrame);
          icon.setAttribute("transform", `translate(${motion.x} ${motion.y}) rotate(${motion.rotation} 50 50)`);
        }
        icon.setAttribute("overflow", "visible");
        fo.replaceWith(icon);
      });
    }
    
    const bgRect = svg.querySelector("rect[data-role='canvas-bg']");
    if (bgRect) {
      if (bg === "transparent") bgRect.setAttribute("fill", "transparent");
      else if (bg === "white")  bgRect.setAttribute("fill", "#f8f6ef");
    }
    
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    return new XMLSerializer().serializeToString(svg);
  };

  const downloadBlob = (filename, blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = filename; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 800);
  };

  const rasterizeExportFrame = async ({ bg, scale, iconFrame = null }) => {
    const svgText = buildExportSvg({ bg, raster: true, iconFrame });
    if (!svgText) throw new Error("SVGの生成に失敗しました");
    const layout = computeLayout(map);
    const img = new Image();
    img.crossOrigin = "anonymous";
    const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    try {
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url; });
      const canvas = document.createElement("canvas");
      canvas.width = layout.width * scale; canvas.height = layout.height * scale;
      const ctx = canvas.getContext("2d");
      if (bg === "white") { ctx.fillStyle = "#f8f6ef"; ctx.fillRect(0, 0, canvas.width, canvas.height); }
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      return canvas;
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  const performExportImage = async ({ bg, scale, format, quality, delayMs = 250 }) => {
    try {
      const frameCount = (format === "gif" || format === "apng") && activeMap.theme.iconAnimation ? 3 : 1;
      const canvases = [];
      for (let frame = 0; frame < frameCount; frame += 1) {
        canvases.push(await rasterizeExportFrame({ bg, scale, iconFrame: frameCount > 1 ? frame : null }));
      }
      const canvas = canvases[0];
      let imageBlob;
      let extension;
      let label;
      if (format === "gif") {
        imageBlob = encodeGif(canvases.map(item => item.getContext("2d").getImageData(0, 0, item.width, item.height).data), { width: canvas.width, height: canvas.height, delayMs });
        extension = "gif"; label = "GIF";
      } else if (format === "apng") {
        const pngFrames = await Promise.all(canvases.map(item => new Promise(res => item.toBlob(res, "image/png"))));
        if (pngFrames.some(frame => !frame)) throw new Error("APNGフレームを生成できませんでした");
        imageBlob = await encodeApng(pngFrames, { delayMs });
        extension = "png"; label = "APNG";
      } else {
        const mime = format === "jpeg" ? "image/jpeg" : "image/png";
        imageBlob = await new Promise(res => canvas.toBlob(res, mime, format === "jpeg" ? quality : undefined));
        extension = format === "jpeg" ? "jpg" : "png";
        label = format === "jpeg" ? "JPEG" : "PNG";
      }
      if (!imageBlob) throw new Error("画像Blobを生成できませんでした");
      downloadBlob(`kagami-map@${scale}x.${extension}`, imageBlob);
      notify(`${label}を保存しました (${scale}× / 背景: ${bgLabel(bg)}${format === "jpeg" ? ` / 画質: ${Math.round(quality * 100)}%` : frameCount > 1 ? ` / ${Math.round(1000 / delayMs)}FPS` : ""})`);
    } catch {
      notify("画像の生成に失敗しました");
    }
  };

  const bgLabel = (bg) => bg === "theme" ? "テーマ" : bg === "transparent" ? "透過" : "白";

  const onExportJson = () => {
    downloadBlob("kagami-map.json", new Blob([JSON.stringify(activeMap, null, 2)], { type: "application/json" }));
    notify("JSONセーブファイルを保存しました");
  };

  const onAutoConnect = () => {
    mutate(d => mapOps.autoConnect(d));
    notify("鏡式の分岐・持続・再合流で接続を自動生成しました");
  };

  const onReset = () => {
    if (!confirm("マップとマップ配色を初期状態に戻します。よろしいですか？")) return;
    const fresh = baseMap();
    const root = document.querySelector(".app-root");
    if (root) {
      root.removeAttribute("data-theme-previewing");
      Object.entries(themeToCssVars(fresh.theme)).forEach(([name, value]) => root.style.setProperty(name, value));
    }
    replace(fresh);
    setSelectedId(null);
    setBackgroundAdjusting(false);
    setThemeResetKey(key => key + 1);
    notify("マップとマップ配色を初期状態へ戻しました");
  };

  const onFit = () => {
    window.__kagamiFit?.();
  };

  const themeStyle = themeToCssVars(activeTheme);

  return (
    <div className="app-root" style={themeStyle}>
      <Toolbar key={themeResetKey}
        map={map} mutate={mutate} replace={replace}
        undo={undo} redo={redo} canUndo={canUndo} canRedo={canRedo}
        onExportPng={() => setExportModal("png")}
        onExportJpeg={() => setExportModal("jpeg")}
        onExportGif={() => setExportModal("gif")}
        onExportApng={() => setExportModal("apng")}
        onExportJson={onExportJson}
        onReset={onReset}
        onFit={onFit}
        onAutoConnect={onAutoConnect}
        notify={notify}
        showLabels={showLabels} setShowLabels={setShowLabels}
        showThumb={showThumb} setShowThumb={setShowThumb}
        activeTheme={activeTheme} onThemeCommit={commitTheme}
        selectedKind={selectedKind} setSelectedId={setSelectedId}
        backgroundAdjusting={backgroundAdjusting} setBackgroundAdjusting={setBackgroundAdjusting}
      />
      <MapCanvas
        map={map} selectedId={selectedId} setSelectedId={setSelectedId}
        mutate={mutate}
        showLabels={showLabels}
        selectedKind={selectedKind}
        backgroundAdjusting={backgroundAdjusting}
      />
      <Palette selectedKind={selectedKind} setSelectedKind={setSelectedKind} mutate={mutate}
               mobileSheet={mobileSheet} setMobileSheet={setMobileSheet} selectedId={selectedId} />
      <Inspector map={map} selectedId={selectedId} mutate={mutate}
                 mobileSheet={mobileSheet} setMobileSheet={setMobileSheet} />
      {!showThumb && <style>{`.mini-map { display: none; }`}</style>}
      {notice && <div className="notice">{notice}</div>}
      <ExportDialog
        open={exportModal !== null}
        format={exportModal}
        theme={activeTheme}
        iconAnimation={Boolean(activeMap.theme.iconAnimation)}
        onClose={() => setExportModal(null)}
        onConfirm={(opts) => {
          const fmt = exportModal;
          setExportModal(null);
          if (["png", "jpeg", "gif", "apng"].includes(fmt)) performExportImage({ ...opts, format: fmt });
        }}
      />
      <HelpBar />
    </div>
  );
}

function HelpBar() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="helpbar">
      <button className="hb-btn" onClick={() => setOpen(v => !v)}>{open ? "×" : "?"} 操作</button>
      {open && (
        <div className="hb-body">
          <div><kbd>Space</kbd>+ドラッグ: パン</div>
          <div><kbd>マウスホイール</kbd>: 拡縮（カーソル位置基準）</div>
          <div><kbd>⌘Z</kbd> / <kbd>⌘⇧Z</kbd>: 元に戻す/やり直し</div>
          <div><kbd>Del</kbd>: 選択マスを削除</div>
          <div><kbd>1</kbd>〜<kbd>8</kbd>: 選択マスの種別変更</div>
          <div style={{ marginTop: 6, color: "var(--brass)" }}>結線</div>
          <div>1) ノードを選択</div>
          <div>2) 隣接列の点滅する◯をクリック → 結線</div>
          <div>又は 右側の＋ハンドルをドラッグ</div>
          <div style={{ marginTop: 6, color: "var(--brass)" }}>接続線</div>
          <div>左クリック: 種類切替（通常/分岐/強制/隠し）</div>
          <div>右クリック: 削除</div>
        </div>
      )}
    </div>
  );
}

const rootElement = document.getElementById("root");
const runtimeParams = new URLSearchParams(window.location.search);

if (runtimeParams.get("mobile-test") === "1") {
  document.documentElement.classList.add("mobile-test-host");
  document.title = "Kagami Map Studio — モバイル UI 確認";
  rootElement.innerHTML = `
    <main class="mobile-test-shell">
      <header class="mobile-test-head">
        <div>
          <p class="mobile-test-eyebrow">KAGAMI MAP STUDIO</p>
          <h1 class="mobile-test-title">MOBILE UI CHECK</h1>
        </div>
        <a class="mobile-test-open" href="./">通常版を開く</a>
      </header>
      <div class="mobile-test-device">
        <iframe class="mobile-test-frame" title="Kagami Map Studio モバイルUI" src="?mobile-preview=1"></iframe>
      </div>
      <p class="mobile-test-note">390 × 844 px の実モバイルレイアウトです。枠内で下部シートを開き、空白ドラッグでパン、マウスホイールで拡縮を確認できます。スマートフォンでは同じ箇所を2本指で拡縮します。</p>
    </main>
  `;
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
