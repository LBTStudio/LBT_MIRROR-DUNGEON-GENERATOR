/* ===== icons.jsx ===== */
/*
 * 鏡ダンジョン用マップアイコン 9種類（インラインSVG）
 * ---
 * モチーフはWiki原案の輪郭ラインアートを踏襲しつつ、
 * ソシャゲMAP向けにコントラスト・立体感・独自の紋様を加えたオリジナル。
 * 全て viewBox="0 0 100 100"、単色トーン（ink / warn / accent の3変数）に対応。
 *
 * kinds:
 *  - origin       起点        （既存）
 *  - skirmish     通常戦闘    （既存）
 *  - focused      集中戦闘    ★新規（大罪系仮面：兜シルエット、二目、縫合の口、大罪紋）
 *  - elite        精鋭戦闘    ★新規（八角プレート＋警告帯＋鋸歯）
 *  - abnormality  幻想体戦闘  ★新規（三角錐に封じられた眼＋等級印）
 *  - guardian     強敵        （既存）
 *  - event        イベント    （既存）
 *  - supply       ショップ    （既存）
 *  - boss         ボス        （既存）
 */

// 色トークン（テーマから注入）: ink=白骨色, warn=警告黄, blood=血赤, brass=真鍮
const IconDefs = ({ id = "iconglow" }) => (
  <defs>
    <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="1.2" floodColor="#000" floodOpacity="0.55" />
    </filter>
    <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#faf3e2" />
      <stop offset="55%" stopColor="#d9cfb8" />
      <stop offset="100%" stopColor="#8f8574" />
    </linearGradient>
    <pattern id={`${id}-warntape`} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-14)">
      <rect width="10" height="10" fill="#f0d24b" />
      <path d="M -2 6 L 6 -2 M 4 12 L 12 4" stroke="#161318" strokeWidth="2.2" />
    </pattern>
  </defs>
);

// 起点：六角ゲート＋中央に太陽/円環 (Wiki: 六角プレート＋◯)
const IconOrigin = ({ ink = "#eae3d5", accent = "#d4a24b" }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <IconDefs id="ori" />
    <g filter="url(#ori-shadow)" fill="none" stroke={ink} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
      {/* 外郭六角プレート */}
      <path d="M 18 34 L 30 20 H 70 L 82 34 V 66 L 70 80 H 30 L 18 66 Z" fill="#0b0a0d" />
      {/* 内側の門 */}
      <path d="M 30 42 H 70 V 66 H 30 Z" />
      {/* 中央円環（起点マーク） */}
      <circle cx="50" cy="50" r="11" />
      <circle cx="50" cy="50" r="4" fill={accent} stroke="none" />
      {/* 上下のレール */}
      <path d="M 30 34 H 70 M 30 74 H 70" strokeOpacity="0.55" strokeWidth="2.5" />
    </g>
  </svg>
);

// 通常戦闘：交差した剣＋スパーク
const IconSkirmish = ({ ink = "#eae3d5", accent = "#d4a24b" }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <IconDefs id="sk" />
    <g filter="url(#sk-shadow)">
      {/* 剣本体 */}
      <g fill="#0b0a0d" stroke={ink} strokeWidth="3.6" strokeLinejoin="round" strokeLinecap="round">
        <path d="M 28 80 L 74 30 L 82 22 L 74 30 L 70 26 L 62 34 L 26 74 L 20 82 Z" />
        {/* 鍔 */}
        <path d="M 60 40 L 72 52 L 66 58 L 54 46 Z" />
        {/* 柄 */}
        <path d="M 22 78 L 30 86 M 18 82 L 24 88" stroke={ink} strokeWidth="3" />
      </g>
      {/* スパーク */}
      <g fill={accent} stroke="none">
        <path d="M 80 20 L 82 12 L 84 20 L 92 22 L 84 24 L 82 32 L 80 24 L 72 22 Z" />
      </g>
      {/* 剣身のハイライト */}
      <path d="M 32 74 L 68 38" stroke={ink} strokeWidth="1.5" strokeOpacity="0.4" />
    </g>
  </svg>
);

// ★集中戦闘：大罪の仮面（兜＋二目＋縫合の口＋大罪紋）
// 元モチーフ：角付きヘルメット / 大罪系。新デザインは「封印された仮面」テーマ。
const IconFocused = ({ ink = "#eae3d5", accent = "#c8443c" }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <IconDefs id="fo" />
    <g filter="url(#fo-shadow)">
      {/* 仮面本体（下広がりの兜シルエット） */}
      <path
        d="M 24 20 L 30 42 L 26 82 L 50 88 L 74 82 L 70 42 L 76 20 L 62 30 L 50 24 L 38 30 Z"
        fill="#0b0a0d" stroke={ink} strokeWidth="3.6" strokeLinejoin="round"
      />
      {/* 目 */}
      <ellipse cx="40" cy="52" rx="4.2" ry="5.2" fill={ink} />
      <ellipse cx="60" cy="52" rx="4.2" ry="5.2" fill={ink} />
      <circle cx="40" cy="53" r="1.6" fill={accent} />
      <circle cx="60" cy="53" r="1.6" fill={accent} />
      {/* 縫合された口（大罪の封印） */}
      <path d="M 34 70 H 66" stroke={ink} strokeWidth="2.4" />
      <path d="M 38 66 L 40 74 M 44 66 L 46 74 M 50 66 L 52 74 M 56 66 L 58 74 M 62 66 L 64 74"
            stroke={ink} strokeWidth="1.8" />
      {/* 額の大罪紋（十字） */}
      <path d="M 50 34 V 44 M 45 39 H 55" stroke={accent} strokeWidth="2.2" strokeLinecap="round" />
      {/* 角の陰影 */}
      <path d="M 30 42 L 32 34 M 68 42 L 70 34" stroke={ink} strokeOpacity="0.5" strokeWidth="2" />
    </g>
  </svg>
);

// ★精鋭戦闘：八角プレート＋警告帯＋鋸歯縁
// 元モチーフ：六角＋WARNINGテープ。新デザインは八角に格上げし、鋸歯縁＋二重フレーム。
const IconElite = ({ ink = "#eae3d5", accent = "#c8443c", warn = "#f0d24b" }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <IconDefs id="el" />
    <g filter="url(#el-shadow)">
      {/* 警告帯（斜め、背後） */}
      <g opacity="0.85">
        <rect x="-12" y="18" width="124" height="10" fill="url(#el-warntape)" transform="rotate(-24 50 50)" />
        <rect x="-12" y="72" width="124" height="10" fill="url(#el-warntape)" transform="rotate(-24 50 50)" />
      </g>
      {/* 八角プレート外郭 */}
      <path
        d="M 30 14 H 70 L 86 30 V 70 L 70 86 H 30 L 14 70 V 30 Z"
        fill="#0b0a0d" stroke={ink} strokeWidth="4" strokeLinejoin="round"
      />
      {/* 内側二重フレーム */}
      <path
        d="M 34 22 H 66 L 78 34 V 66 L 66 78 H 34 L 22 66 V 34 Z"
        fill="none" stroke={ink} strokeOpacity="0.55" strokeWidth="2" strokeLinejoin="round"
      />
      {/* 中央: 星章（強敵の証） */}
      <path
        d="M 50 30 L 55 45 L 70 46 L 58 55 L 63 70 L 50 62 L 37 70 L 42 55 L 30 46 L 45 45 Z"
        fill={accent} stroke={ink} strokeWidth="1.6" strokeLinejoin="round"
      />
      {/* コーナー・リベット */}
      <g fill={ink}>
        <circle cx="30" cy="30" r="2" /><circle cx="70" cy="30" r="2" />
        <circle cx="30" cy="70" r="2" /><circle cx="70" cy="70" r="2" />
      </g>
    </g>
  </svg>
);

// ★幻想体戦闘：逆さ三角錐＋封じられた眼＋等級印（ZAYIN/TETH風）
// 元モチーフ：三角＋角＋二つ目。新デザインは「封印された幻想体の識別プレート」テーマ。
const IconAbnormality = ({ ink = "#eae3d5", accent = "#c8443c" }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <IconDefs id="ab" />
    <g filter="url(#ab-shadow)">
      {/* 三角プレート（先端下） */}
      <path
        d="M 16 22 H 84 L 50 86 Z"
        fill="#0b0a0d" stroke={ink} strokeWidth="3.8" strokeLinejoin="round"
      />
      {/* 内側フレーム */}
      <path
        d="M 24 30 H 76 L 50 76 Z"
        fill="none" stroke={ink} strokeOpacity="0.5" strokeWidth="2"
      />
      {/* 上部の角（幻想体の触角） */}
      <path d="M 20 22 L 14 10 M 32 22 L 30 8 M 68 22 L 70 8 M 80 22 L 86 10"
            stroke={ink} strokeWidth="3" strokeLinecap="round" />
      {/* 中央の閉じられた目（縦アーモンド） */}
      <path
        d="M 50 40 Q 62 54 50 68 Q 38 54 50 40 Z"
        fill={ink} stroke={ink} strokeWidth="1.5"
      />
      {/* 眼の瞳 */}
      <circle cx="50" cy="54" r="3" fill="#0b0a0d" />
      <circle cx="50" cy="54" r="1.4" fill={accent} />
      {/* 上下の縫合印（封印） */}
      <path d="M 44 40 L 56 40 M 44 68 L 56 68" stroke="#0b0a0d" strokeWidth="1.6" />
      {/* 底の等級印（アルファベット風マーク：ZAYIN） */}
      <path d="M 44 78 H 56 L 44 84 H 56" stroke={ink} strokeWidth="2" fill="none" strokeLinejoin="round" />
    </g>
  </svg>
);

// 強敵：剣＋炎の輪（既存で満足の項目、輪郭のみ最適化）
const IconGuardian = ({ ink = "#eae3d5", accent = "#c8443c" }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <IconDefs id="gu" />
    <g filter="url(#gu-shadow)">
      {/* 炎の輪 */}
      <path
        d="M 50 12 C 65 20 78 30 82 44 C 84 58 74 72 60 78 C 68 68 66 58 60 52 C 66 46 62 34 50 28 C 38 34 34 46 40 52 C 34 58 32 68 40 78 C 26 72 16 58 18 44 C 22 30 35 20 50 12 Z"
        fill={accent} stroke={ink} strokeWidth="2.6" strokeLinejoin="round"
      />
      {/* 中央: 剣 */}
      <g stroke={ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="#0b0a0d">
        <path d="M 50 30 L 54 34 V 66 L 50 74 L 46 66 V 34 Z" />
        <path d="M 40 40 H 60" strokeWidth="3.5" />
        <path d="M 50 74 V 82" />
      </g>
    </g>
  </svg>
);

// イベント：縫合された?マーク＋光輪
const IconEvent = ({ ink = "#eae3d5", accent = "#d4a24b" }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <IconDefs id="ev" />
    <g filter="url(#ev-shadow)">
      {/* 光輪 */}
      <circle cx="50" cy="48" r="30" fill="none" stroke={accent} strokeWidth="1.4" strokeDasharray="3 4" opacity="0.7" />
      {/* ?本体 */}
      <path
        d="M 34 34 C 34 22 46 16 54 20 C 64 24 66 36 58 42 L 52 48 V 60"
        fill="none" stroke={ink} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
      />
      <rect x="47" y="68" width="10" height="10" rx="1.2" fill={ink} stroke={ink} strokeWidth="1" />
      {/* 縫合ステッチ */}
      <path d="M 40 28 L 42 30 M 50 22 L 52 24 M 58 26 L 60 28 M 54 44 L 56 46" stroke={accent} strokeWidth="1.6" />
    </g>
  </svg>
);

// ショップ：3スロット硬貨マシン＋レバー
const IconSupply = ({ ink = "#eae3d5", accent = "#d4a24b" }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <IconDefs id="sp" />
    <g filter="url(#sp-shadow)">
      {/* 本体（台形筐体） */}
      <path
        d="M 18 30 L 26 20 H 74 L 82 30 V 78 L 78 82 H 22 L 18 78 Z"
        fill="#0b0a0d" stroke={ink} strokeWidth="3.6" strokeLinejoin="round"
      />
      {/* 上部ディスプレイ */}
      <rect x="26" y="30" width="48" height="18" fill="none" stroke={ink} strokeWidth="2.4" />
      {/* 3スロット */}
      <g fill={accent} stroke={ink} strokeWidth="1.4">
        <circle cx="36" cy="39" r="4" />
        <circle cx="50" cy="39" r="4" />
        <circle cx="64" cy="39" r="4" />
      </g>
      {/* 下段のコイントレイ */}
      <rect x="26" y="56" width="48" height="14" fill="none" stroke={ink} strokeWidth="2" />
      <g fill={ink}>
        <rect x="30" y="60" width="10" height="6" rx="1" />
        <rect x="45" y="60" width="10" height="6" rx="1" />
        <rect x="60" y="60" width="10" height="6" rx="1" />
      </g>
      {/* レバー */}
      <path d="M 82 44 L 92 40 L 90 50 L 84 52 Z" fill={accent} stroke={ink} strokeWidth="1.6" />
    </g>
  </svg>
);

// ボス：骸骨＋割れた三角＋警告テープ
const IconBoss = ({ ink = "#eae3d5", accent = "#c8443c", warn = "#f0d24b" }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <IconDefs id="bs" />
    <g filter="url(#bs-shadow)">
      {/* 背景の警告帯 */}
      <g opacity="0.85">
        <rect x="-12" y="70" width="124" height="10" fill="url(#bs-warntape)" transform="rotate(-18 50 50)" />
        <rect x="-12" y="14" width="124" height="8" fill="url(#bs-warntape)" transform="rotate(-18 50 50)" />
      </g>
      {/* 割れた三角枠 */}
      <path
        d="M 50 12 L 88 84 H 12 Z"
        fill="#0b0a0d" stroke={ink} strokeWidth="4" strokeLinejoin="round"
      />
      {/* 亀裂 */}
      <path d="M 50 12 L 46 40 L 52 46 L 44 62 L 50 68"
            stroke={accent} strokeWidth="2.2" fill="none" strokeLinejoin="round" strokeLinecap="round" />
      {/* 骸骨 */}
      <g fill={ink} stroke="#0b0a0d" strokeWidth="1.6">
        <path d="M 38 46 C 38 38 46 32 50 32 C 54 32 62 38 62 46 V 56 L 58 60 H 42 L 38 56 Z" />
        {/* 目 */}
        <circle cx="44" cy="48" r="3" fill="#0b0a0d" />
        <circle cx="56" cy="48" r="3" fill="#0b0a0d" />
        {/* 歯 */}
        <path d="M 42 62 L 44 68 M 46 62 L 48 68 M 50 62 L 50 68 M 52 62 L 52 68 M 54 62 L 56 68 M 58 62 L 58 68"
              stroke={ink} strokeWidth="1.8" fill="none" />
      </g>
    </g>
  </svg>
);

// マップ表示用: kind → コンポーネント
const IconMap = {
  origin: IconOrigin,
  skirmish: IconSkirmish,
  focused: IconFocused,
  elite: IconElite,
  abnormality: IconAbnormality,
  guardian: IconGuardian,
  event: IconEvent,
  supply: IconSupply,
  boss: IconBoss,
};

// SVG文字列版（エクスポート用）: いずれも簡易実装。ここではDOMシリアライズで代用する方針。
// 実際にはCanvas上のReactツリーを `new XMLSerializer().serializeToString()` で出す。

// グローバルに公開
Object.assign(window, {
  IconOrigin, IconSkirmish, IconFocused, IconElite, IconAbnormality,
  IconGuardian, IconEvent, IconSupply, IconBoss, IconMap, IconDefs,
});


/* ===== kinds.jsx ===== */
/* マス種別の定義（Wiki準拠、危険戦闘・任意は削除） */
const KINDS = [
  { id: "origin",      label: "起点",       short: "起", desc: "各階層の開始地点",           tone: "brass" },
  { id: "skirmish",    label: "通常戦闘",   short: "戦", desc: "通常戦闘システムでの戦闘",   tone: "ink"   },
  { id: "focused",     label: "集中戦闘",   short: "集", desc: "集中戦闘システムでの戦闘（大罪系）", tone: "ink"   },
  { id: "elite",       label: "精鋭戦闘",   short: "精", desc: "レベルの高い敵との通常戦闘（ギフト100%）", tone: "blood" },
  { id: "abnormality", label: "幻想体戦闘", short: "幻", desc: "集中戦闘・ボス幻想体が確定出現",   tone: "blood" },
  { id: "guardian",    label: "強敵",       short: "強", desc: "強力な敵との遭遇",           tone: "blood" },
  { id: "event",       label: "イベント",   short: "？", desc: "選択を伴うイベント発生",     tone: "brass" },
  { id: "supply",      label: "ショップ",   short: "商", desc: "コスト消費で回復・ギフト購入/強化/合成", tone: "brass" },
  { id: "boss",        label: "ボス戦闘",   short: "終", desc: "階層終端のボス。E.G.O・苦難確定", tone: "blood" },
];

const KIND_INDEX = Object.fromEntries(KINDS.map(k => [k.id, k]));

// テーマトークン (Danteダーク基調)
const THEME = {
  bg:      "#0b0a0d",   // 深黒 (キャンバス背景)
  panel:   "#161318",   // パネル・時計盤
  panelHi: "#1e1a20",
  edge:    "#2c262e",
  ink:     "#eae3d5",   // 骨白
  inkDim:  "#8a8375",
  brass:   "#d4a24b",   // 真鍮
  blood:   "#c8443c",   // 血赤
  bloodHi: "#e35b53",
  warn:    "#f0d24b",   // 警告黄
  line:    "#7a5a48",   // 経路線ベース
  lineHi:  "#d4a24b",   // 経路線ハイライト
  goldGlow:"rgba(212,162,75,.55)",
  bloodGlow:"rgba(200,68,60,.5)",
};

// 接続線スタイル
const EDGE_STYLES = {
  normal:  { label: "通常",   dash: "none",     width: 2.8, opacity: 0.85 },
  branch:  { label: "分岐",   dash: "6 5",      width: 2.4, opacity: 0.9  },
  forced:  { label: "強制",   dash: "none",     width: 4.2, opacity: 1.0  }, // 二重線
  hidden:  { label: "隠し",   dash: "1 4",      width: 2.2, opacity: 0.65 },
};

Object.assign(window, { KINDS, KIND_INDEX, THEME, EDGE_STYLES });


/* ===== store.jsx ===== */
/* 状態管理: reducer + localStorage、履歴（undo/redo） */

const STORAGE_KEY = "kagami-map-studio.v1";
const HISTORY_LIMIT = 60;
const MAX_COLUMNS = 12;
const MAX_NODES_PER_COLUMN = 4;

function uuid() {
  return (globalThis.crypto?.randomUUID?.() ?? `n_${Date.now()}_${Math.random().toString(36).slice(2,7)}`);
}

function clone(v) { return JSON.parse(JSON.stringify(v)); }

// 初期マップ（起点→通常→分岐→ボス）
function baseMap() {
  const origin      = { id: uuid(), stage: 0, row: 0, kind: "origin",     label: "起点" };
  const skirmishA   = { id: uuid(), stage: 1, row: 0, kind: "skirmish",   label: "通常戦闘" };
  const eventA      = { id: uuid(), stage: 1, row: 1, kind: "event",      label: "イベント" };
  const focusedA    = { id: uuid(), stage: 2, row: 0, kind: "focused",    label: "集中戦闘" };
  const supplyA     = { id: uuid(), stage: 2, row: 1, kind: "supply",     label: "ショップ" };
  const eliteA      = { id: uuid(), stage: 3, row: 0, kind: "elite",      label: "精鋭戦闘" };
  const abnoA       = { id: uuid(), stage: 3, row: 1, kind: "abnormality",label: "幻想体戦闘" };
  const bossA       = { id: uuid(), stage: 4, row: 0, kind: "boss",       label: "ボス戦闘" };

  const nodes = [origin, skirmishA, eventA, focusedA, supplyA, eliteA, abnoA, bossA];
  const edges = [
    { from: origin.id,    to: skirmishA.id, style: "normal" },
    { from: origin.id,    to: eventA.id,    style: "branch" },
    { from: skirmishA.id, to: focusedA.id,  style: "normal" },
    { from: skirmishA.id, to: supplyA.id,   style: "branch" },
    { from: eventA.id,    to: supplyA.id,   style: "normal" },
    { from: focusedA.id,  to: eliteA.id,    style: "normal" },
    { from: focusedA.id,  to: abnoA.id,     style: "branch" },
    { from: supplyA.id,   to: abnoA.id,     style: "normal" },
    { from: eliteA.id,    to: bossA.id,     style: "forced" },
    { from: abnoA.id,     to: bossA.id,     style: "normal" },
  ];
  return {
    title: "移動ツリー",
    nodes,
    edges,
    theme: {
      background: THEME.bg,
      line: THEME.line,
      lineHi: THEME.lineHi,
      showLabels: false,
      iconSize: 52,
    },
  };
}

function normalizeMap(input) {
  if (!input || typeof input !== "object") return baseMap();
  const base = baseMap();
  const nodes = Array.isArray(input.nodes) ? input.nodes.map((n, i) => ({
    id: String(n.id ?? `n_${i}`),
    stage: Math.max(0, Math.min(MAX_COLUMNS - 1, Number(n.stage) || 0)),
    row: Math.max(0, Math.min(MAX_NODES_PER_COLUMN - 1, Number(n.row) || 0)),
    kind: (KIND_INDEX[n.kind] ? n.kind : "skirmish"),
    label: String(n.label ?? KIND_INDEX[n.kind]?.label ?? "").slice(0, 24),
  })) : base.nodes;
  const validIds = new Set(nodes.map(n => n.id));
  const edges = Array.isArray(input.edges) ? input.edges
    .map(e => ({ from: String(e.from), to: String(e.to), style: EDGE_STYLES[e.style] ? e.style : "normal" }))
    .filter(e => validIds.has(e.from) && validIds.has(e.to) && e.from !== e.to) : base.edges;
  return {
    title: String(input.title ?? "移動ツリー").slice(0, 40) || "移動ツリー",
    nodes,
    edges,
    theme: {
      background: String(input.theme?.background ?? THEME.bg),
      line: String(input.theme?.line ?? THEME.line),
      lineHi: String(input.theme?.lineHi ?? THEME.lineHi),
      showLabels: Boolean(input.theme?.showLabels),
      iconSize: Math.max(28, Math.min(64, Number(input.theme?.iconSize) || 44)),
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

// 高階数：履歴付きState
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
    mutate, replace, undo, redo,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  };
}

// マップ操作ユーティリティ
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
  addColumn(map, atStage) {
    // atStageの列を挿入。既存stage >= atStage はシフト。
    map.nodes.forEach(n => { if (n.stage >= atStage) n.stage += 1; });
    // 新規の列に1つノードを配置
    const id = uuid();
    map.nodes.push({ id, stage: atStage, row: 0, kind: "skirmish", label: KIND_INDEX.skirmish.label });
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
  },
};

Object.assign(window, { useMapHistory, mapOps, baseMap, normalizeMap, uuid, MAX_COLUMNS, MAX_NODES_PER_COLUMN });


/* ===== canvas.jsx ===== */
/* 中央マップキャンバス
 * - 常に画面中央 (letterbox)
 * - パン(Space+ドラッグ or 中ドラッグ)/ズーム(Ctrl+Wheel or ボタン)
 * - パレットからのDnDドロップで新規ノード配置
 * - ノード間ドラッグで結線 (Alt+ドラッグ、または結線モード)
 * - 列間ホバーで「列挿入」ボタン、末尾に「列追加」ゴースト
 * - 縮小時も中央固定＋パルスハイライトで視認性維持
 */

const NODE_W = 92;
const NODE_H = 92;
const COL_GAP = 168;
const ROW_GAP = 132;
const CANVAS_PAD_X = 120;
const CANVAS_PAD_Y = 96;

function computeLayout(map) {
  const highestStage = Math.max(0, ...map.nodes.map(n => n.stage));
  const columns = Array.from({ length: highestStage + 1 }, (_, s) =>
    map.nodes.filter(n => n.stage === s).sort((a, b) => a.row - b.row)
  );
  const widest = Math.max(1, ...columns.map(c => c.length));
  const width  = CANVAS_PAD_X * 2 + Math.max(0, highestStage) * COL_GAP + NODE_W;
  const height = CANVAS_PAD_Y * 2 + Math.max(0, widest - 1) * ROW_GAP + NODE_H;
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

// ノードレンダラー
function NodeMarker({ node, pos, selected, isPulse, iconSize, onSelect, onStartLink, onRemove }) {
  const kindDef = KIND_INDEX[node.kind] ?? KIND_INDEX.skirmish;
  const Icon = IconMap[node.kind] ?? IconMap.skirmish;
  const tone = kindDef.tone;
  const ringColor = tone === "blood" ? THEME.blood : tone === "brass" ? THEME.brass : THEME.ink;
  const ringGlow = tone === "blood" ? THEME.bloodGlow : THEME.goldGlow;

  return (
    <g transform={`translate(${pos.x} ${pos.y})`} className={`nd ${selected ? "sel" : ""} ${isPulse ? "pulse" : ""}`}>
      {/* 選択リング */}
      {selected && (
        <circle r={NODE_W/2 + 6} fill="none" stroke={THEME.brass} strokeWidth="2" strokeDasharray="3 4">
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="24s" repeatCount="indefinite" />
        </circle>
      )}
      {/* ベースの六角プレート（フレーム） */}
      <g>
        <path
          d="M -44 -24 L -30 -44 H 30 L 44 -24 V 24 L 30 44 H -30 L -44 24 Z"
          fill={THEME.panel}
          stroke={ringColor}
          strokeWidth={selected ? 3.4 : 2.4}
          strokeLinejoin="round"
          filter={selected ? `drop-shadow(0 0 10px ${ringGlow})` : undefined}
        />
        {/* リベット */}
        <g fill={ringColor} opacity="0.9">
          <circle cx="-30" cy="-32" r="1.6" /><circle cx="30" cy="-32" r="1.6" />
          <circle cx="-30" cy="32" r="1.6" /><circle cx="30" cy="32" r="1.6" />
        </g>
      </g>
      {/* アイコン */}
      <foreignObject x={-iconSize/2} y={-iconSize/2} width={iconSize} height={iconSize} style={{ pointerEvents: "none" }}>
        <div xmlns="http://www.w3.org/1999/xhtml" style={{ width: "100%", height: "100%" }}>
          <Icon ink={THEME.ink} accent={tone === "blood" ? THEME.bloodHi : THEME.brass} warn={THEME.warn} />
        </div>
      </foreignObject>
      {/* クリック領域 */}
      <rect x="-46" y="-46" width="92" height="92" fill="transparent"
            style={{ cursor: "pointer" }}
            onPointerDown={(e) => { e.stopPropagation(); onSelect(node.id); }}
            onDoubleClick={(e) => { e.stopPropagation(); onStartLink?.(node.id); }} />
      {/* 結線ハンドル（選択中のみ） */}
      {selected && (
        <g transform={`translate(${NODE_W/2 + 4} 0)`}
           className="linkhandle"
           onPointerDown={(e) => { e.stopPropagation(); onStartLink?.(node.id, e); }}>
          <circle r="9" fill={THEME.brass} stroke={THEME.bg} strokeWidth="2" />
          <path d="M -3 0 H 3 M 0 -3 V 3" stroke={THEME.bg} strokeWidth="2" strokeLinecap="round" />
          <title>ここからドラッグで別ノードに結線</title>
        </g>
      )}
      {selected && (
        <g transform={`translate(${-NODE_W/2 - 4} 0)`} onPointerDown={(e) => { e.stopPropagation(); onRemove?.(node.id); }}>
          <circle r="8" fill={THEME.blood} stroke={THEME.bg} strokeWidth="2" style={{ cursor: "pointer" }} />
          <path d="M -3 0 H 3" stroke="#fff" strokeWidth="2" />
          <title>ノード削除</title>
        </g>
      )}
    </g>
  );
}

function MapCanvas({
  map, selectedId, setSelectedId,
  mutate, edgeMode, setEdgeMode,
  onDropKind,
}) {
  const wrapRef  = React.useRef(null);
  const svgRef   = React.useRef(null);
  const [viewport, setViewport] = React.useState({ w: 800, h: 600 });
  const [zoom, setZoom] = React.useState(1);
  const [pan, setPan]   = React.useState({ x: 0, y: 0 });
  const [linkFrom, setLinkFrom] = React.useState(null); // 結線中の始点id
  const [ghostPos, setGhostPos] = React.useState(null); // 結線中の終点位置(svg座標)
  const [hoverCol, setHoverCol] = React.useState(null); // 列間挿入ホバー
  const [dropHint, setDropHint] = React.useState(null); // {stage, row}
  const layout = React.useMemo(() => computeLayout(map), [map]);

  // ビューポート観測
  React.useEffect(() => {
    if (!wrapRef.current) return;
    const el = wrapRef.current;
    const upd = () => setViewport({ w: el.clientWidth, h: el.clientHeight });
    upd();
    const ro = new ResizeObserver(upd);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 初期フィット（マップサイズ変化時）
  const fit = React.useCallback(() => {
    const pad = 60;
    const zx = (viewport.w - pad*2) / layout.width;
    const zy = (viewport.h - pad*2) / layout.height;
    const z  = Math.max(0.3, Math.min(1.6, Math.min(zx, zy)));
    setZoom(z);
    setPan({ x: 0, y: 0 });
  }, [viewport, layout]);

  React.useEffect(() => { fit(); }, [layout.width, layout.height, viewport.w, viewport.h]);

  // SVG座標変換
  const clientToSvg = (clientX, clientY) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = clientX; pt.y = clientY;
    const m = svg.getScreenCTM().inverse();
    const p = pt.matrixTransform(m);
    return { x: p.x, y: p.y };
  };

  // パン: middle drag or space+drag
  const panRef = React.useRef(null);
  const spaceHeldRef = React.useRef(false);
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
    if (e.button === 1 || (e.button === 0 && spaceHeldRef.current)) {
      panRef.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
      e.currentTarget.setPointerCapture(e.pointerId);
      document.body.style.cursor = "grabbing";
    } else if (linkFrom) {
      // 結線モード中の空白クリック→キャンセル
      setLinkFrom(null); setGhostPos(null);
    } else if (e.target === e.currentTarget || e.target.dataset?.role === "canvas-bg") {
      setSelectedId(null);
    }
  };
  const onWrapPointerMove = (e) => {
    if (panRef.current?.id === e.pointerId) {
      const dx = e.clientX - panRef.current.x;
      const dy = e.clientY - panRef.current.y;
      setPan(p => ({ x: p.x + dx, y: p.y + dy }));
      panRef.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
    }
    // 結線ゴースト追従
    if (linkFrom) {
      setGhostPos(clientToSvg(e.clientX, e.clientY));
    }
  };
  const onWrapPointerUp = (e) => {
    if (panRef.current?.id === e.pointerId) {
      panRef.current = null;
      document.body.style.cursor = spaceHeldRef.current ? "grab" : "";
    }
  };
  const onWheel = (e) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    setZoom(z => Math.max(0.3, Math.min(2.6, Number((z + (e.deltaY < 0 ? 0.08 : -0.08)).toFixed(2)))));
  };

  const changeZoom = (delta) => setZoom(z => Math.max(0.3, Math.min(2.6, Number((z + delta).toFixed(2)))));

  // 結線開始
  const startLink = (nodeId, e) => {
    setLinkFrom(nodeId);
    if (e) setGhostPos(clientToSvg(e.clientX, e.clientY));
  };
  const completeLink = (toId) => {
    if (!linkFrom || linkFrom === toId) { setLinkFrom(null); setGhostPos(null); return; }
    mutate((draft) => mapOps.addEdge(draft, linkFrom, toId, "normal"));
    setLinkFrom(null); setGhostPos(null);
  };

  // ドロップ処理（HTML5 DnD） - パレットからのアイコン
  const onDragOver = (e) => {
    if (!e.dataTransfer.types.includes("application/x-kind")) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    // hint calc: 変換後のsvg座標→列/行を推定
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
    mutate(draft => {
      const id = mapOps.addNode(draft, stage, row, kind);
      // 直前列の任意ノードから結線
      const prev = draft.nodes.filter(n => n.stage === stage - 1);
      if (prev.length) mapOps.addEdge(draft, prev[0].id, id, "normal");
    });
  };
  const onDragLeave = () => setDropHint(null);

  const insertColumn = (atStage) => {
    mutate(draft => mapOps.addColumn(draft, atStage));
  };

  return (
    <div ref={wrapRef} className="canvas-wrap"
      onPointerDown={onWrapPointerDown}
      onPointerMove={onWrapPointerMove}
      onPointerUp={onWrapPointerUp}
      onPointerCancel={onWrapPointerUp}
      onWheel={onWheel}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragLeave={onDragLeave}
    >
      {/* 常にビューポート中央にキャンバスを配置 */}
      <div className="canvas-stage" style={{
        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
      }}>
        <svg ref={svgRef} width={layout.width} height={layout.height} viewBox={`0 0 ${layout.width} ${layout.height}`}
             xmlns="http://www.w3.org/2000/svg" className="route-svg">
          {/* 背景 */}
          <rect data-role="canvas-bg" width={layout.width} height={layout.height} fill={map.theme.background} rx="14" />
          {/* 罫線（列ガイド、上下フェード） */}
          <defs>
            <linearGradient id="colgrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={THEME.brass} stopOpacity="0" />
              <stop offset="50%" stopColor={THEME.brass} stopOpacity="0.25" />
              <stop offset="100%" stopColor={THEME.brass} stopOpacity="0" />
            </linearGradient>
            <filter id="softglow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="2.2" />
            </filter>
          </defs>
          {layout.columns.map((_, s) => {
            const x = CANVAS_PAD_X + NODE_W/2 + s * COL_GAP;
            return <line key={`cg${s}`} x1={x} x2={x} y1="24" y2={layout.height - 24}
                         stroke="url(#colgrad)" strokeWidth="1" strokeDasharray="2 6" />;
          })}
          {/* 列間の挿入ホットスポット + 挿入ボタン */}
          {Array.from({ length: layout.columns.length + 1 }).map((_, i) => {
            const x = CANVAS_PAD_X + i * COL_GAP;
            const isHover = hoverCol === i;
            return (
              <g key={`ins${i}`} className="col-inserter" transform={`translate(${x} 0)`}
                 onPointerEnter={() => setHoverCol(i)} onPointerLeave={() => setHoverCol(cur => cur === i ? null : cur)}>
                <rect x={-14} y={30} width="28" height={layout.height - 60} fill="transparent" style={{ cursor: "pointer" }}
                      onClick={() => insertColumn(i)} />
                {isHover && (
                  <g>
                    <line x1="0" x2="0" y1="30" y2={layout.height - 30} stroke={THEME.brass} strokeWidth="1.5" strokeDasharray="4 4" opacity="0.8" />
                    <g transform={`translate(0 ${layout.height/2})`}>
                      <circle r="14" fill={THEME.panel} stroke={THEME.brass} strokeWidth="2" style={{ cursor: "pointer" }}
                              onClick={() => insertColumn(i)} />
                      <path d="M -6 0 H 6 M 0 -6 V 6" stroke={THEME.brass} strokeWidth="2" strokeLinecap="round" style={{ pointerEvents: "none" }} />
                      <title>この位置に列を挿入</title>
                    </g>
                  </g>
                )}
              </g>
            );
          })}
          {/* エッジ */}
          {map.edges.map((e, i) => {
            const a = layout.positions[e.from]; const b = layout.positions[e.to];
            if (!a || !b) return null;
            const style = EDGE_STYLES[e.style] ?? EDGE_STYLES.normal;
            const d = edgePath(a, b);
            const active = selectedId && (e.from === selectedId || e.to === selectedId);
            const stroke = active ? THEME.brass : (e.style === "branch" ? "#a68767" : (e.style === "hidden" ? "#5c4a3f" : THEME.lineHi));
            return (
              <g key={`e${i}`} className="edge"
                 onClick={(ev) => { ev.stopPropagation(); mutate(d => mapOps.toggleEdgeStyle(d, e.from, e.to)); }}
                 onContextMenu={(ev) => { ev.preventDefault(); ev.stopPropagation(); mutate(d => mapOps.removeEdge(d, e.from, e.to)); }}>
                {/* halo */}
                <path d={d} fill="none" stroke={stroke} strokeOpacity="0.18" strokeWidth={style.width + 8} strokeLinecap="round" />
                {/* main */}
                <path d={d} fill="none" stroke={stroke} strokeOpacity={style.opacity} strokeWidth={style.width} strokeLinecap="round" strokeDasharray={style.dash} />
                {/* forced = 二重線 */}
                {e.style === "forced" && (
                  <path d={d} fill="none" stroke={THEME.bg} strokeWidth={style.width - 2.2} strokeLinecap="round" />
                )}
                <title>{style.label}経路（左クリック: 種類切替 / 右クリック: 削除）</title>
              </g>
            );
          })}
          {/* 結線ゴースト */}
          {linkFrom && ghostPos && layout.positions[linkFrom] && (
            <path d={edgePath(layout.positions[linkFrom], ghostPos)}
                  fill="none" stroke={THEME.brass} strokeDasharray="4 4" strokeWidth="2" />
          )}
          {/* ドロップヒント */}
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
                      fill={THEME.brass} fillOpacity="0.12" stroke={THEME.brass} strokeDasharray="4 4" strokeWidth="2" />
              </g>
            );
          })()}
          {/* ノード */}
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
                  onSelect={(id) => setSelectedId(id)}
                  onStartLink={(id, e) => startLink(id, e)}
                  onRemove={(id) => mutate(d => mapOps.removeNode(d, id))}
                />
                {/* ラベル */}
                {map.theme.showLabels && (
                  <text x={p.x} y={p.y + 62} textAnchor="middle" fill={THEME.ink} fontSize="13"
                        style={{ fontFamily: "Noto Sans JP, sans-serif", pointerEvents: "none" }}>
                    {node.label}
                  </text>
                )}
                {/* +ボタン: 列末尾の下 */}
              </g>
            );
          })}
          {/* 各列末尾に「＋ノード追加」 */}
          {layout.columns.map((col, s) => {
            if (col.length >= MAX_NODES_PER_COLUMN) return null;
            const x = CANVAS_PAD_X + NODE_W/2 + s * COL_GAP;
            const span = (col.length) * ROW_GAP;
            const top = (layout.height - span) / 2;
            const y = top + col.length * ROW_GAP;
            return (
              <g key={`add-${s}`} className="add-node" transform={`translate(${x} ${y})`}
                 onClick={() => mutate(d => mapOps.addNode(d, s, col.length, "skirmish"))}
                 style={{ cursor: "pointer" }}>
                <path d="M -44 -24 L -30 -44 H 30 L 44 -24 V 24 L 30 44 H -30 L -44 24 Z"
                      fill="transparent" stroke={THEME.inkDim} strokeDasharray="4 4" strokeWidth="1.6" />
                <path d="M -8 0 H 8 M 0 -8 V 8" stroke={THEME.inkDim} strokeWidth="2.4" strokeLinecap="round" />
                <title>この列にマスを追加</title>
              </g>
            );
          })}
        </svg>
      </div>
      {/* キャンバスコントロール (右下) */}
      <div className="canvas-controls" onPointerDown={e => e.stopPropagation()}>
        <button onClick={() => changeZoom(-0.12)} title="縮小">−</button>
        <button onClick={fit} title="全体表示">◫</button>
        <button onClick={() => changeZoom(0.12)} title="拡大">＋</button>
        <span className="zoom-readout">{Math.round(zoom * 100)}%</span>
      </div>
      {/* 中央ガイド（縮小時にマップを見つけやすく） */}
      <div className="center-crosshair" aria-hidden="true">
        <span/><span/>
      </div>
      {/* ミニマップ */}
      <MiniMap map={map} layout={layout} viewport={viewport} zoom={zoom} pan={pan} setPan={setPan} />
    </div>
  );
}

function MiniMap({ map, layout, viewport, zoom, pan, setPan }) {
  const SIZE = 168;
  const scale = Math.min(SIZE / layout.width, SIZE / layout.height * 0.7);
  const mw = layout.width * scale;
  const mh = layout.height * scale;
  return (
    <div className="mini-map" onPointerDown={e => e.stopPropagation()}>
      <svg width={SIZE} height={SIZE * 0.7} viewBox={`0 0 ${SIZE} ${SIZE * 0.7}`}>
        <rect width="100%" height="100%" fill="#0a0a0d" rx="6" />
        <g transform={`translate(${(SIZE - mw)/2} ${(SIZE * 0.7 - mh)/2})`}>
          <rect width={mw} height={mh} fill={THEME.panel} rx="4" />
          {map.edges.map((e, i) => {
            const a = layout.positions[e.from]; const b = layout.positions[e.to];
            if (!a || !b) return null;
            return <line key={i} x1={a.x*scale} y1={a.y*scale} x2={b.x*scale} y2={b.y*scale} stroke={THEME.lineHi} strokeOpacity="0.5" strokeWidth="1" />;
          })}
          {map.nodes.map(n => {
            const p = layout.positions[n.id];
            if (!p) return null;
            const c = KIND_INDEX[n.kind]?.tone === "blood" ? THEME.blood : KIND_INDEX[n.kind]?.tone === "brass" ? THEME.brass : THEME.ink;
            return <circle key={n.id} cx={p.x*scale} cy={p.y*scale} r="3" fill={c} />;
          })}
        </g>
      </svg>
      <div className="mini-map-label">MINIMAP</div>
    </div>
  );
}

Object.assign(window, { MapCanvas, computeLayout });


/* ===== panels.jsx ===== */
/* フローティングパネル群
 * - Palette (左)
 * - Inspector (右下)
 * - Toolbar (上部中央)
 */

// パレット
function Palette({ selectedKind, setSelectedKind, mutate, mapCanvasRef }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [pos, setPos] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem("kagami-palette-pos") ?? "null") ?? { x: 24, y: 96 }; } catch { return { x: 24, y: 96 }; }
  });
  React.useEffect(() => { localStorage.setItem("kagami-palette-pos", JSON.stringify(pos)); }, [pos]);
  const dragRef = React.useRef(null);
  const onHeadDown = (e) => {
    dragRef.current = { id: e.pointerId, x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onHeadMove = (e) => {
    if (!dragRef.current || dragRef.current.id !== e.pointerId) return;
    setPos({ x: e.clientX - dragRef.current.x, y: e.clientY - dragRef.current.y });
  };
  const onHeadUp = (e) => { if (dragRef.current?.id === e.pointerId) dragRef.current = null; };

  return (
    <div className="fp palette" style={{ left: pos.x, top: pos.y, width: collapsed ? 48 : 236 }}>
      <div className="fp-head" onPointerDown={onHeadDown} onPointerMove={onHeadMove} onPointerUp={onHeadUp}>
        <span className="fp-title">{collapsed ? "" : "マス種別"}</span>
        <button className="fp-btn" title={collapsed ? "展開" : "畳む"} onClick={() => setCollapsed(v => !v)}>
          {collapsed ? "▶" : "◀"}
        </button>
      </div>
      {!collapsed && (
        <div className="palette-body">
          <p className="palette-hint">ドラッグしてマップに配置、またはクリックで既定種別に。</p>
          <div className="palette-grid">
            {KINDS.map(k => {
              const Icon = IconMap[k.id];
              const isSel = selectedKind === k.id;
              const tone = k.tone === "blood" ? THEME.blood : k.tone === "brass" ? THEME.brass : THEME.ink;
              return (
                <button key={k.id}
                        className={`palette-item ${isSel ? "on" : ""}`}
                        draggable
                        onDragStart={(e) => { e.dataTransfer.setData("application/x-kind", k.id); e.dataTransfer.effectAllowed = "copy"; }}
                        onClick={() => setSelectedKind(k.id)}
                        title={`${k.label}\n${k.desc}`}
                        style={{ borderColor: isSel ? tone : "transparent" }}>
                  <div className="palette-icon">
                    <Icon ink={THEME.ink} accent={tone} warn={THEME.warn} />
                  </div>
                  <div className="palette-caption">
                    <span className="palette-name">{k.label}</span>
                    <span className="palette-short" style={{ color: tone }}>{k.short}</span>
                  </div>
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

// インスペクタ（右下フローティング）
function Inspector({ map, selectedId, mutate }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [pos, setPos] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem("kagami-inspector-pos") ?? "null") ?? { right: 24, bottom: 24 }; } catch { return { right: 24, bottom: 24 }; }
  });
  React.useEffect(() => { localStorage.setItem("kagami-inspector-pos", JSON.stringify(pos)); }, [pos]);

  const node = map.nodes.find(n => n.id === selectedId);
  if (!node) return (
    <div className="fp inspector empty" style={{ right: pos.right, bottom: pos.bottom }}>
      <div className="fp-head" style={{ cursor: "default" }}>
        <span className="fp-title">プロパティ</span>
      </div>
      <div className="inspector-body empty">
        <p>マップ上のマスを選択してください</p>
        <p className="dim">・空白クリックで選択解除<br/>・Space + ドラッグでパン<br/>・Ctrl / ⌘ + Wheelで拡縮</p>
      </div>
    </div>
  );

  const kindDef = KIND_INDEX[node.kind];
  const inbound  = map.edges.filter(e => e.to === node.id);
  const outbound = map.edges.filter(e => e.from === node.id);

  return (
    <div className="fp inspector" style={{ right: pos.right, bottom: pos.bottom, width: collapsed ? 44 : 300 }}>
      <div className="fp-head">
        <span className="fp-title">{collapsed ? "" : `#${node.stage + 1}-${node.row + 1} ${kindDef?.label ?? ""}`}</span>
        <button className="fp-btn" onClick={() => setCollapsed(v => !v)} title={collapsed ? "展開" : "畳む"}>{collapsed ? "◀" : "▶"}</button>
      </div>
      {!collapsed && (
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
                  <Icon ink={THEME.ink} accent={tone} warn={THEME.warn} />
                </button>
              );
            })}
          </div>

          <label className="i-label" htmlFor="node-label">ラベル</label>
          <input id="node-label" className="i-input" value={node.label}
                 maxLength={24}
                 onChange={(e) => mutate(d => mapOps.updateNode(d, node.id, { label: e.target.value }))} />

          <div className="i-row">
            <div>
              <label className="i-label">列</label>
              <div className="i-stepper">
                <button onClick={() => mutate(d => {
                  const target = Math.max(0, node.stage - 1);
                  mapOps.updateNode(d, node.id, { stage: target });
                })}>−</button>
                <span>{node.stage + 1}</span>
                <button onClick={() => mutate(d => {
                  const target = Math.min(MAX_COLUMNS - 1, node.stage + 1);
                  mapOps.updateNode(d, node.id, { stage: target });
                })}>＋</button>
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

          <label className="i-label">接続</label>
          <div className="i-edges">
            <div><b>入</b> {inbound.length}本</div>
            <div><b>出</b> {outbound.length}本</div>
          </div>
          {outbound.length > 0 && (
            <div className="i-edgelist">
              {outbound.map((e) => {
                const target = map.nodes.find(n => n.id === e.to);
                const style = EDGE_STYLES[e.style];
                return (
                  <div key={`${e.from}-${e.to}`} className="i-edgerow">
                    <span className={`edge-swatch ${e.style}`} />
                    <span>→ #{target?.stage + 1}-{target?.row + 1} {KIND_INDEX[target?.kind]?.label}</span>
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

// 上部ツールバー
function Toolbar({ map, mutate, replace, undo, redo, canUndo, canRedo, onExportSvg, onExportPng, onExportJson, onImport, onReset, notify, showThumb, setShowThumb }) {
  const fileRef = React.useRef(null);
  const [showTheme, setShowTheme] = React.useState(false);

  const handleImport = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(String(reader.result));
        replace(json);
        notify("マップを読み込みました");
      } catch { notify("読み込みに失敗しました"); }
      if (fileRef.current) fileRef.current.value = "";
    };
    reader.readAsText(file);
  };

  return (
    <div className="toolbar">
      <div className="tb-group">
        <span className="tb-brand">
          <span className="brand-dot" />
          <span className="brand-title">鏡ダンジョン</span>
          <span className="brand-sub">MAP STUDIO</span>
        </span>
      </div>
      <div className="tb-group">
        <button className="tb-btn" onClick={undo} disabled={!canUndo} title="元に戻す (⌘Z)">↶</button>
        <button className="tb-btn" onClick={redo} disabled={!canRedo} title="やり直し (⌘⇧Z)">↷</button>
      </div>
      <div className="tb-group">
        <button className="tb-btn" onClick={() => mutate(d => mapOps.addColumn(d, (Math.max(0, ...d.nodes.map(n => n.stage))) + 1))} title="末尾に列を追加">列 ＋</button>
        <button className="tb-btn" onClick={() => mutate(d => mapOps.clear(d))} title="初期化">初期化</button>
      </div>
      <div className="tb-group">
        <button className="tb-btn" onClick={() => setShowTheme(v => !v)} title="テーマ">テーマ</button>
        {showTheme && (
          <div className="tb-popover">
            <label className="i-label">アイコンサイズ</label>
            <input type="range" min="32" max="60" value={map.theme.iconSize}
                   onChange={e => replace({ ...map, theme: { ...map.theme, iconSize: Number(e.target.value) } })} />
            <label className="i-check">
              <input type="checkbox" checked={map.theme.showLabels}
                     onChange={e => replace({ ...map, theme: { ...map.theme, showLabels: e.target.checked } })} />
              マス下にラベル表示（画面のみ）
            </label>
            <label className="i-check">
              <input type="checkbox" checked={showThumb}
                     onChange={e => setShowThumb(e.target.checked)} />
              ミニマップを表示
            </label>
            <label className="i-label" style={{ marginTop: 8 }}>接続線カラー</label>
            <div className="tb-swatches">
              {["#d4a24b","#c8443c","#7ec9ff","#eae3d5"].map(c => (
                <button key={c} style={{ background: c }} className={`sw ${map.theme.lineHi === c ? "on" : ""}`}
                        onClick={() => replace({ ...map, theme: { ...map.theme, lineHi: c } })} />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="tb-group">
        <button className="tb-btn" onClick={onExportSvg} title="SVGを保存">SVG</button>
        <button className="tb-btn" onClick={onExportPng} title="PNGを保存">PNG</button>
        <button className="tb-btn" onClick={onExportJson} title="JSONを保存">JSON</button>
        <button className="tb-btn" onClick={() => fileRef.current?.click()} title="JSONを読み込む">読込</button>
        <input ref={fileRef} type="file" accept="application/json" onChange={handleImport} style={{ display: "none" }} />
      </div>
    </div>
  );
}

Object.assign(window, { Palette, Inspector, Toolbar });


/* ===== app.jsx ===== */
/* メインアプリ: 全体組み立て + キーボードショートカット + エクスポート */

function App() {
  const { map, mutate, replace, undo, redo, canUndo, canRedo } = useMapHistory();
  const [selectedId, setSelectedId] = React.useState(null);
  const [selectedKind, setSelectedKind] = React.useState("skirmish");
  const [edgeMode, setEdgeMode] = React.useState(false);
  const [notice, setNotice] = React.useState("");
  const [showThumb, setShowThumb] = React.useState(true);
  const notify = React.useCallback((text) => {
    setNotice(text);
    window.clearTimeout(notify.__t);
    notify.__t = window.setTimeout(() => setNotice(""), 2500);
  }, []);

  // キーボードショートカット
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
      // 数字キー1-9でkind切替
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

  // エクスポート系
  const buildExportSvg = () => {
    // SVG DOMをシリアライズ（描画済のSVGを直接クローンして、UI用のadd-node/インジケータ等を除去）
    const source = document.querySelector(".route-svg");
    if (!source) return null;
    const svg = source.cloneNode(true);
    // 除去: UI装飾（追加ボタン、列挿入ボタンなど）
    svg.querySelectorAll(".col-inserter, .add-node, .linkhandle").forEach(el => el.remove());
    // 選択状態のリング除去
    svg.querySelectorAll(".nd.sel circle[stroke-dasharray]").forEach(el => el.remove());
    // 削除/リンクハンドル（selectedはあり得るので念のため）
    svg.querySelectorAll("g.sel > g > circle[fill='" + THEME.blood + "']").forEach(el => el.remove());
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    return new XMLSerializer().serializeToString(svg);
  };

  const downloadBlob = (filename, blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = filename; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 800);
  };

  const onExportSvg = () => {
    const svgText = buildExportSvg();
    if (!svgText) { notify("SVGの生成に失敗しました"); return; }
    downloadBlob("mirror-dungeon-map.svg", new Blob([svgText], { type: "image/svg+xml" }));
    notify("SVGを保存しました");
  };

  const onExportPng = async () => {
    const svgText = buildExportSvg();
    if (!svgText) { notify("SVGの生成に失敗しました"); return; }
    const layout = computeLayout(map);
    const img = new Image();
    img.crossOrigin = "anonymous";
    const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url; });
    const scale = 2;
    const canvas = document.createElement("canvas");
    canvas.width = layout.width * scale; canvas.height = layout.height * scale;
    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0);
    canvas.toBlob(b => {
      if (b) downloadBlob("mirror-dungeon-map.png", b);
      URL.revokeObjectURL(url);
      notify("PNGを保存しました");
    }, "image/png");
  };

  const onExportJson = () => {
    downloadBlob("mirror-dungeon-map.json", new Blob([JSON.stringify(map, null, 2)], { type: "application/json" }));
    notify("JSONを保存しました");
  };

  return (
    <div className="app-root">
      <Toolbar
        map={map} mutate={mutate} replace={replace}
        undo={undo} redo={redo} canUndo={canUndo} canRedo={canRedo}
        onExportSvg={onExportSvg} onExportPng={onExportPng} onExportJson={onExportJson}
        onReset={() => mutate(d => mapOps.clear(d))}
        notify={notify}
        showThumb={showThumb} setShowThumb={setShowThumb}
      />
      <MapCanvas
        map={map} selectedId={selectedId} setSelectedId={setSelectedId}
        mutate={mutate}
        edgeMode={edgeMode} setEdgeMode={setEdgeMode}
        onDropKind={(kind, stage, row) => {}}
      />
      <Palette selectedKind={selectedKind} setSelectedKind={setSelectedKind} mutate={mutate} />
      <Inspector map={map} selectedId={selectedId} mutate={mutate} />
      {!showThumb && <style>{`.mini-map { display: none; }`}</style>}
      {notice && <div className="notice">{notice}</div>}
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
          <div><kbd>⌘/Ctrl</kbd>+<kbd>ホイール</kbd>: 拡縮</div>
          <div><kbd>⌘Z</kbd> / <kbd>⌘⇧Z</kbd>: 元に戻す/やり直し</div>
          <div><kbd>Del</kbd>: 選択マスを削除</div>
          <div><kbd>1</kbd>〜<kbd>9</kbd>: 選択マスの種別変更</div>
          <div>ノード選択後の◯: ドラッグで結線</div>
          <div>列間ホバー: 列を挿入</div>
          <div>接続線を左クリック: 種類切替 / 右クリック: 削除</div>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);


