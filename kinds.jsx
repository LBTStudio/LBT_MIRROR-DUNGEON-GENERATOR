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
