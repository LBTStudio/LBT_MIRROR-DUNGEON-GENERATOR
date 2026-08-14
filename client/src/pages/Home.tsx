/* Orbital Route Atlas: independent celestial cartography. The route schema is a simple left-to-right instrument, with original compass marks rather than source-game assets. */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronRight, Crosshair, Download, ExternalLink, FileDown, FileUp, Maximize2,
  Minus, Move, Plus, Redo2, RotateCcw, Save, Trash2, Undo2, WandSparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

type NodeKind = "origin" | "skirmish" | "focused" | "elite" | "anomaly" | "event" | "supply" | "rest" | "guardian" | "custom";
type Accent = "brass" | "teal" | "slate";
type RouteNode = { id: string; stage: number; kind: NodeKind; icon: string; label: string; accent: Accent };
type RouteTree = {
  title: string;
  nodes: RouteNode[];
  edges: [string, string][];
  theme: { background: string; line: string; showLabels: boolean; iconSize: number };
};

const STORAGE_KEY = "orbital-route-atlas.v2";
const MAX_COLUMNS = 10;
const MAX_NODES_PER_COLUMN = 3;
const HISTORY_LIMIT = 80;
const asset = {
  logo: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663619237894/jQBlTeNNhwPADzZB.png",
  hero: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663619237894/LqcizDXlrLgPbSFx.jpg",
  texture: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663619237894/LEtUsohKDWEAJNky.jpg",
  reference: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663619237894/LEyqoVYchbPRYqTj.jpg",
};

const kinds: Record<NodeKind, { label: string; short: string; description: string }> = {
  origin: { label: "起点", short: "起", description: "経路の出発地点" },
  skirmish: { label: "小規模交戦", short: "交", description: "標準的な遭遇" },
  focused: { label: "正面衝突", short: "正", description: "集中して突破する遭遇" },
  elite: { label: "危険交戦", short: "危", description: "高難度の遭遇" },
  anomaly: { label: "特異事象", short: "異", description: "特殊な遭遇・難所" },
  event: { label: "分岐事象", short: "分", description: "選択を伴う事象" },
  supply: { label: "補給所", short: "補", description: "準備・補給を行う地点" },
  rest: { label: "休息", short: "休", description: "小休止する地点" },
  guardian: { label: "終端警戒", short: "終", description: "区間の終端・強敵" },
  custom: { label: "任意", short: "任", description: "自由に設定する地点" },
};
const colors: Record<Accent, string> = { brass: "#e7b95e", teal: "#74d5d1", slate: "#8fa4ae" };
const legacyKinds: Record<string, NodeKind> = { start: "origin", battle: "skirmish", elite: "elite", event: "event", shop: "supply", rest: "rest", boss: "guardian", custom: "custom" };

const markerPaths: Record<Exclude<NodeKind, "custom">, string[]> = {
  origin: ["M -16 0 H 16", "M 0 -16 V 16", "M -9 -9 L 0 -15 L 9 -9"],
  skirmish: ["M -15 -10 L -4 1", "M -7 10 L 4 -1", "M 2 10 L 14 -2"],
  focused: ["M 0 -14 A 14 14 0 1 1 0 14 A 14 14 0 1 1 0 -14", "M -20 0 H -13", "M 13 0 H 20", "M 0 -20 V -13", "M 0 13 V 20"],
  elite: ["M 0 -15 L 15 0 L 0 15 L -15 0 Z", "M -20 -7 V -15 H -12", "M 12 15 H 20 V 7", "M -20 7 V 15 H -12", "M 12 -15 H 20 V -7"],
  anomaly: ["M 0 -17 C 13 -13 15 10 0 17 C -15 10 -13 -13 0 -17 Z", "M -12 0 C -5 -7 5 -7 12 0", "M -9 7 C -3 2 3 2 9 7"],
  event: ["M 0 -17 V -3", "M 0 -3 L -14 13", "M 0 -3 L 14 13", "M -17 11 L -10 16", "M 17 11 L 10 16"],
  supply: ["M -16 -10 H 16 V 12 H -16 Z", "M -7 -10 V 12", "M 7 -10 V 12", "M -16 0 H 16"],
  rest: ["M -16 12 H 16", "M -11 12 V -3 H 11 V 12", "M -11 -3 L 0 -15 L 11 -3"],
  guardian: ["M 0 -18 L 5 -6 L 18 0 L 5 6 L 0 18 L -5 6 L -18 0 L -5 -6 Z", "M -7 0 H 7", "M 0 -7 V 7"],
};

function resolveKind(value: unknown): NodeKind {
  if (typeof value === "string" && value in kinds) return value as NodeKind;
  return legacyKinds[String(value)] ?? "custom";
}
function clean(value: unknown, max = 28) { return String(value ?? "").replace(/[<>]/g, "").slice(0, max); }
function clone<T>(value: T): T { return JSON.parse(JSON.stringify(value)); }
function uuid() { return globalThis.crypto?.randomUUID?.() ?? `node_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`; }
function escapeXml(value: unknown) { return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;"); }
function nodeSeed(stage: number, index = 0): RouteNode {
  const defaults: NodeKind[] = ["origin", "skirmish", "event", "supply", "guardian"];
  const kind = stage === 0 ? "origin" : defaults[Math.min(stage, defaults.length - 1)] ?? "custom";
  return { id: uuid(), stage, kind, icon: "", label: index ? `地点 ${stage + 1}-${index + 1}` : kinds[kind].label, accent: stage === 0 ? "teal" : "slate" };
}
function deriveEdges(nodes: RouteNode[]): [string, string][] {
  const highest = Math.max(0, ...nodes.map((node) => node.stage));
  const edges: [string, string][] = [];
  for (let stage = 0; stage < highest; stage += 1) {
    const from = nodes.filter((node) => node.stage === stage);
    const to = nodes.filter((node) => node.stage === stage + 1);
    from.forEach((a) => to.forEach((b) => edges.push([a.id, b.id])));
  }
  return edges;
}
function ensureColumns(nodes: RouteNode[]) {
  const result = [...nodes];
  const highest = Math.max(0, ...result.map((node) => node.stage));
  for (let stage = 0; stage <= highest; stage += 1) if (!result.some((node) => node.stage === stage)) result.push(nodeSeed(stage));
  const origin = result.find((node) => node.stage === 0);
  if (origin) { origin.kind = "origin"; origin.label ||= "起点"; }
  return result.sort((a, b) => a.stage - b.stage || a.id.localeCompare(b.id));
}

export const baseTree = (): RouteTree => {
  const origin = { id: "origin", stage: 0, kind: "origin" as NodeKind, icon: "", label: "起点", accent: "teal" as Accent };
  const nodes: RouteNode[] = [
    origin,
    { id: "skirmish", stage: 1, kind: "skirmish", icon: "", label: "小規模交戦", accent: "slate" },
    { id: "event", stage: 1, kind: "event", icon: "", label: "分岐事象", accent: "slate" },
    { id: "focused", stage: 2, kind: "focused", icon: "", label: "正面衝突", accent: "teal" },
    { id: "elite", stage: 2, kind: "elite", icon: "", label: "危険交戦", accent: "slate" },
    { id: "supply", stage: 3, kind: "supply", icon: "", label: "補給所", accent: "slate" },
    { id: "guardian", stage: 4, kind: "guardian", icon: "", label: "終端警戒", accent: "teal" },
  ];
  return { title: "移動ツリー", nodes, edges: deriveEdges(nodes), theme: { background: "#101720", line: "#6e8594", showLabels: false, iconSize: 27 } };
};

export function normalize(input: unknown): RouteTree {
  const fallback = baseTree();
  if (!input || typeof input !== "object") return fallback;
  const source = input as Partial<RouteTree>;
  const sourceNodes = Array.isArray(source.nodes) ? source.nodes : [];
  const parsed = sourceNodes.filter((node): node is RouteNode => Boolean(node && typeof node === "object" && (node as RouteNode).id)).map((node, index) => ({
    id: clean(node.id, 48) || `node_${index}`,
    stage: Math.max(0, Math.min(MAX_COLUMNS - 1, Number.parseInt(String(node.stage), 10) || 0)),
    kind: resolveKind(node.kind),
    icon: clean(node.icon, 6),
    label: clean(node.label, 28) || "地点",
    accent: node.accent in colors ? node.accent : "slate" as Accent,
  }));
  const prepared = ensureColumns(parsed.length ? parsed : fallback.nodes);
  return {
    title: clean(source.title, 40) || "移動ツリー",
    nodes: prepared,
    edges: deriveEdges(prepared),
    theme: {
      background: typeof source.theme?.background === "string" ? source.theme.background : fallback.theme.background,
      line: typeof source.theme?.line === "string" ? source.theme.line : fallback.theme.line,
      showLabels: Boolean(source.theme?.showLabels),
      iconSize: Math.max(18, Math.min(42, Number(source.theme?.iconSize) || fallback.theme.iconSize)),
    },
  };
}

export type TreeHistory = { past: RouteTree[]; present: RouteTree; future: RouteTree[] };
export function createTreeHistory(tree: RouteTree): TreeHistory { return { past: [], present: normalize(tree), future: [] }; }
export function recordTreeChange(history: TreeHistory, next: RouteTree): TreeHistory {
  const prepared = normalize(next);
  if (JSON.stringify(prepared) === JSON.stringify(history.present)) return history;
  return { past: [...history.past, clone(history.present)].slice(-HISTORY_LIMIT), present: prepared, future: [] };
}
export function undoTreeHistory(history: TreeHistory): TreeHistory {
  if (!history.past.length) return history;
  const prior = history.past[history.past.length - 1];
  return { past: history.past.slice(0, -1), present: clone(prior), future: [clone(history.present), ...history.future].slice(0, HISTORY_LIMIT) };
}
export function redoTreeHistory(history: TreeHistory): TreeHistory {
  if (!history.future.length) return history;
  const next = history.future[0];
  return { past: [...history.past, clone(history.present)].slice(-HISTORY_LIMIT), present: clone(next), future: history.future.slice(1) };
}
function loadTree(): RouteTree {
  try { return normalize(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem("orbital-route-atlas.v1") ?? "")); } catch { return baseTree(); }
}
function useTreeHistory() {
  const [history, setHistory] = useState<TreeHistory>(() => createTreeHistory(loadTree()));
  const tree = history.present;
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(tree)); }, [tree]);
  const mutate = (action: (draft: RouteTree) => void) => setHistory((previous) => { const next = clone(previous.present); action(next); return recordTreeChange(previous, next); });
  const replace = (next: RouteTree) => setHistory((previous) => recordTreeChange(previous, next));
  const undo = () => setHistory((previous) => undoTreeHistory(previous));
  const redo = () => setHistory((previous) => redoTreeHistory(previous));
  return { tree, mutate, replace, undo, redo, canUndo: history.past.length > 0, canRedo: history.future.length > 0 };
}

export function layoutFor(tree: RouteTree) {
  const highestStage = Math.max(0, ...tree.nodes.map((node) => node.stage));
  const columns = Array.from({ length: highestStage + 1 }, (_, stage) => tree.nodes.filter((node) => node.stage === stage));
  const widest = Math.max(1, ...columns.map((column) => column.length));
  const width = Math.max(820, 190 + highestStage * 220);
  const height = Math.max(420, 168 + (widest - 1) * 124);
  const positions: Record<string, { x: number; y: number }> = {};
  columns.forEach((column, stage) => {
    const span = Math.max(0, (column.length - 1) * 124);
    column.forEach((node, index) => { positions[node.id] = { x: 94 + stage * 220, y: (height - span) / 2 + index * 124 }; });
  });
  return { width, height, positions, columns };
}

function waypointTicks(x: number, y: number) { return `M ${x} ${y - 47} v 10 M ${x + 47} ${y} h -10 M ${x} ${y + 47} v -10 M ${x - 47} ${y} h 10`; }
function markerSvg(kind: NodeKind, color: string, icon: string) {
  if (kind === "custom" && icon) return `<text x="0" y="9" text-anchor="middle" fill="${color}" font-family="sans-serif" font-size="25">${escapeXml(icon)}</text>`;
  const paths = markerPaths[kind === "custom" ? "origin" : kind];
  return paths.map((d) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`).join("");
}
function NodeMark({ node, color }: { node: RouteNode; color: string }) {
  if (node.kind === "custom" && node.icon) return <text x="0" y="9" textAnchor="middle" fill={color} fontSize="25">{node.icon}</text>;
  return <>{markerPaths[node.kind === "custom" ? "origin" : node.kind].map((d, index) => <path key={`${node.kind}_${index}`} d={d} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />)}</>;
}

export function buildSvg(tree: RouteTree) {
  const { width, height, positions } = layoutFor(tree);
  const paths = tree.edges.map(([from, to]) => {
    const a = positions[from]; const b = positions[to]; if (!a || !b) return "";
    const bend = Math.max(46, (b.x - a.x) * .47);
    return `<path d="M ${a.x + 47} ${a.y} C ${a.x + bend} ${a.y}, ${b.x - bend} ${b.y}, ${b.x - 47} ${b.y}" fill="none" stroke="${escapeXml(tree.theme.line)}" stroke-width="3" stroke-linecap="round" stroke-dasharray="8 7" marker-end="url(#arrow)"/>`;
  }).join("");
  const nodes = tree.nodes.map((node) => {
    const p = positions[node.id]; if (!p) return "";
    const color = colors[node.accent];
    const label = tree.theme.showLabels ? `<text x="${p.x}" y="${p.y + 61}" text-anchor="middle" fill="#eef5f7" font-family="Noto Sans JP, sans-serif" font-size="14">${escapeXml(node.label)}</text>` : "";
    return `<g><circle cx="${p.x}" cy="${p.y}" r="39" fill="#202d36" stroke="${color}" stroke-width="3"/><circle cx="${p.x}" cy="${p.y}" r="29" fill="none" stroke="${color}" stroke-opacity=".32"/><path d="${waypointTicks(p.x, p.y)}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"/><g transform="translate(${p.x} ${p.y})">${markerSvg(node.kind, color, node.icon)}</g>${label}</g>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="${escapeXml(tree.theme.line)}"/></marker></defs><rect width="100%" height="100%" rx="18" fill="${escapeXml(tree.theme.background)}"/>${paths}${nodes}</svg>`;
}

function downloadText(filename: string, body: string, type: string) {
  const url = URL.createObjectURL(new Blob([body], { type }));
  const link = document.createElement("a"); link.href = url; link.download = filename; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function RouteCanvas({ tree, selectedId, onNodeClick }: { tree: RouteTree; selectedId: string; onNodeClick: (id: string) => void }) {
  const { width, height, positions, columns } = layoutFor(tree);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ id: number; x: number; y: number } | null>(null);
  const movedRef = useRef(false);
  const suppressClickRef = useRef(false);
  const isNarrow = () => window.matchMedia("(max-width: 640px)").matches;
  const fit = () => {
    const viewport = viewportRef.current; if (!viewport) return;
    const next = isNarrow() ? Math.max(.33, Math.min(1, Math.min((viewport.clientWidth - 18) / width, (viewport.clientHeight - 18) / height))) : 1;
    setZoom(next); setPan({ x: 0, y: 0 });
  };
  const focusNode = (id: string) => {
    const viewport = viewportRef.current; const point = positions[id];
    if (!viewport || !point || !isNarrow()) return;
    const nextZoom = Math.max(.72, Math.min(.92, Number(((viewport.clientWidth - 28) / 390).toFixed(2))));
    setZoom(nextZoom);
    setPan({ x: Number(((width / 2 - point.x) * nextZoom).toFixed(1)), y: Number(((height / 2 - point.y) * nextZoom - viewport.clientHeight * .08).toFixed(1)) });
  };
  useEffect(() => {
    const adjust = () => { if (isNarrow()) focusNode(selectedId); else fit(); };
    adjust(); const observer = new ResizeObserver(adjust);
    if (viewportRef.current) observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, [selectedId, width, height]);
  const changeZoom = (step: number) => setZoom((value) => Math.max(.33, Math.min(2.4, Number((value + step).toFixed(2)))));
  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    dragRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY }; movedRef.current = false; event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current; if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x; const dy = event.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) movedRef.current = true;
    if (movedRef.current) setPan((value) => ({ x: value.x + dx, y: value.y + dy }));
    dragRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
  };
  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.id !== event.pointerId) return;
    if (movedRef.current) { suppressClickRef.current = true; window.setTimeout(() => { suppressClickRef.current = false; }, 0); }
    dragRef.current = null; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  return <div className="canvas-scroll" ref={viewportRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onWheel={(event) => { if (!event.ctrlKey && !event.metaKey) return; event.preventDefault(); changeZoom(event.deltaY > 0 ? -.08 : .08); }}>
    <div className="canvas-transform" style={{ width, height, left: `calc(50% - ${width / 2}px)`, top: `calc(50% - ${height / 2}px)`, transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}><svg className="route-svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="左から右へ進む移動ツリーのプレビュー">
      <defs><marker id="route-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill={tree.theme.line} /></marker></defs>
      <rect width="100%" height="100%" rx="18" fill={tree.theme.background} />
      {columns.map((_, index) => <line key={index} x1={94 + index * 220} x2={94 + index * 220} y1="38" y2={height - 38} className="stage-guide" />)}
      {tree.edges.map(([from, to]) => { const a = positions[from]; const b = positions[to]; if (!a || !b) return null; const bend = Math.max(46, (b.x - a.x) * .47); return <path key={`${from}_${to}`} d={`M ${a.x + 47} ${a.y} C ${a.x + bend} ${a.y}, ${b.x - bend} ${b.y}, ${b.x - 47} ${b.y}`} fill="none" stroke={tree.theme.line} strokeWidth="3" strokeLinecap="round" strokeDasharray="8 7" markerEnd="url(#route-arrow)" />; })}
      {tree.nodes.map((node) => { const p = positions[node.id]; const selected = selectedId === node.id; const mark = selected ? colors.brass : colors[node.accent]; return <g key={node.id} transform={`translate(${p.x} ${p.y})`} className={`route-node ${selected ? "is-selected" : ""}`} role="button" tabIndex={0} aria-label={`${node.label}を選択`} onClick={() => { if (!suppressClickRef.current) onNodeClick(node.id); }} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onNodeClick(node.id); } }}>
        <circle r="39" fill="#202d36" stroke={mark} strokeWidth={selected ? 5 : 3} />
        <circle r="29" fill="none" stroke={mark} strokeOpacity=".32" />
        <path d="M 0 -47 v 10 M 47 0 h -10 M 0 47 v -10 M -47 0 h 10" fill="none" stroke={mark} strokeWidth="2" strokeLinecap="round" />
        <NodeMark node={node} color={mark} />
        {tree.theme.showLabels && <text y="61" textAnchor="middle" fill="#eef5f7" fontSize="14">{node.label}</text>}
      </g>; })}
    </svg></div>
    <div className="canvas-nav" aria-label="地図の表示倍率"><span><Move size={14} /> 表示倍率</span><button className="canvas-focus" type="button" onClick={(event) => { event.stopPropagation(); focusNode(selectedId); }} aria-label="選択地点を表示" title="選択地点を表示"><Crosshair size={14} /></button><div><button type="button" onClick={(event) => { event.stopPropagation(); changeZoom(-.1); }} aria-label="縮小"><Minus size={15} /></button><button type="button" onClick={(event) => { event.stopPropagation(); fit(); }} aria-label="全体表示"><Maximize2 size={14} /></button><button type="button" onClick={(event) => { event.stopPropagation(); changeZoom(.1); }} aria-label="拡大"><Plus size={15} /></button></div></div>
  </div>;
}

export default function Home() {
  const { tree, mutate, replace, undo, redo, canUndo, canRedo } = useTreeHistory();
  const [selectedId, setSelectedId] = useState("origin");
  const [notice, setNotice] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const layout = useMemo(() => layoutFor(tree), [tree]);
  const selected = tree.nodes.find((node) => node.id === selectedId) ?? tree.nodes[0];
  const columnCount = layout.columns.length;
  const message = (text: string) => { setNotice(text); window.setTimeout(() => setNotice(""), 2600); };
  useEffect(() => { if (!tree.nodes.some((node) => node.id === selectedId)) setSelectedId(tree.nodes[0]?.id ?? ""); }, [tree.nodes, selectedId]);
  const performUndo = () => { if (!canUndo) { message("これ以上戻せる編集はありません"); return; } undo(); message("編集を1つ戻しました"); };
  const performRedo = () => { if (!canRedo) { message("やり直せる編集はありません"); return; } redo(); message("編集を1つやり直しました"); };
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((!event.ctrlKey && !event.metaKey) || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      const key = event.key.toLowerCase();
      if (key === "z" && event.shiftKey) { event.preventDefault(); performRedo(); }
      else if (key === "z") { event.preventDefault(); performUndo(); }
      else if (key === "y") { event.preventDefault(); performRedo(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [canUndo, canRedo]);
  const updateNode = (id: string, patch: Partial<RouteNode>) => mutate((draft) => { const node = draft.nodes.find((item) => item.id === id); if (node) Object.assign(node, patch); });
  const setColumnCount = (count: number) => {
    mutate((draft) => {
      const current = Math.max(...draft.nodes.map((node) => node.stage)) + 1;
      if (count < current) draft.nodes = draft.nodes.filter((node) => node.stage < count);
      for (let stage = current; stage < count; stage += 1) draft.nodes.push(nodeSeed(stage));
    });
    message(count < columnCount ? "終端側の列を整理しました" : "新しい列を追加しました");
  };
  const addNode = (stage: number) => {
    const count = tree.nodes.filter((node) => node.stage === stage).length;
    if (count >= MAX_NODES_PER_COLUMN) { message("1列に置ける地点は3つまでです"); return; }
    const node = nodeSeed(stage, count);
    mutate((draft) => draft.nodes.push(node)); setSelectedId(node.id); message(`列 ${stage + 1} に地点を追加しました`);
  };
  const removeNode = () => {
    if (!selected || selected.stage === 0) { message("起点は削除できません"); return; }
    const count = tree.nodes.filter((node) => node.stage === selected.stage).length;
    if (count <= 1) { message("各列には少なくとも1つの地点を残します"); return; }
    mutate((draft) => { draft.nodes = draft.nodes.filter((node) => node.id !== selected.id); });
    setSelectedId(tree.nodes.find((node) => node.id !== selected.id)?.id ?? "origin"); message("地点を削除しました");
  };
  const reset = () => { if (!confirm("移動ツリーを初期テンプレートへ戻しますか？")) return; replace(baseTree()); setSelectedId("origin"); message("初期テンプレートへ戻しました"); };
  const exportPng = () => {
    const svg = buildSvg(tree); const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" })); const image = new Image();
    image.onload = () => { const { width, height } = layoutFor(tree); const canvas = document.createElement("canvas"); canvas.width = width * 2; canvas.height = height * 2; const context = canvas.getContext("2d"); context?.drawImage(image, 0, 0, canvas.width, canvas.height); URL.revokeObjectURL(url); canvas.toBlob((blob) => { if (!blob) return; const png = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = png; link.download = "orbital-route-atlas.png"; link.click(); setTimeout(() => URL.revokeObjectURL(png), 1000); message("PNGを保存しました"); }, "image/png"); };
    image.src = url;
  };
  const importTree = (event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { try { const next = normalize(JSON.parse(String(reader.result))); replace(next); setSelectedId(next.nodes[0]?.id ?? ""); message("ツリー設定を読み込みました"); } catch { message("ツリー設定を読み込めませんでした"); } }; reader.readAsText(file); event.target.value = ""; };

  return <main className="min-h-screen app-shell">
    <header className="topline"><div className="brand"><img src={asset.logo} alt="" /><div><span>ORBITAL ROUTE ATLAS</span><small>TRPG MOVE MAP GENERATOR</small></div></div><a className="topline-open" href={import.meta.env.BASE_URL} target="_blank" rel="noopener noreferrer"><ExternalLink size={15} /> 別タブで開く</a></header>
    <section className="hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(8,15,21,.98) 0%, rgba(8,15,21,.9) 55%, rgba(8,15,21,.64)), url(${asset.hero})` }}><div><p className="eyebrow">ROUTE / BRANCH / MERGE</p><h1>起点を選び、列ごとに経路を組む。</h1><p className="hero-copy">列数と地点種別を整えると、経路は左から右へ自動でつながります。接続を個別に操作する必要はありません。</p></div><span className="hero-coordinate">ATLAS PLATE / A-02</span><img className="hero-reference" src={asset.reference} alt="" /></section>

    <section className="command-strip" aria-label="ツリー操作"><div className="command-copy"><p>ROUTE REGISTER / CURRENT FILE</p><b>{tree.title}</b><span>{columnCount} 列 / {tree.nodes.length} 地点 / {tree.edges.length} 接続</span></div><div className="command-actions"><Button onClick={() => addNode(Math.min(columnCount - 1, 1))} className="brass-button"><Plus size={16} /> 地点を追加</Button><Button variant="outline" onClick={() => fileRef.current?.click()}><FileUp size={16} /> 設定を読む</Button><Button variant="outline" onClick={() => { downloadText("orbital-route-atlas.json", JSON.stringify(tree, null, 2), "application/json"); message("ツリー設定を保存しました"); }}><Save size={16} /> 設定を保存</Button><div className="history-actions" role="group" aria-label="編集履歴"><Button variant="outline" onClick={performUndo} disabled={!canUndo} title="編集を戻す（Ctrl/Cmd + Z）"><Undo2 size={16} /> 戻す</Button><Button variant="outline" onClick={performRedo} disabled={!canRedo} title="やり直す（Ctrl/Cmd + Shift + Z / Ctrl/Cmd + Y）"><Redo2 size={16} /> やり直す</Button></div></div></section>

    <section className="workspace">
      <aside className="editor-rail">
        <div className="rail-title"><div><p className="eyebrow">ROUTE SCHEMA</p><h2>列と地点の設定</h2></div><span>自動接続</span></div>
        <section className="schema-box"><div className="box-heading"><ChevronRight size={15} /><b>経路の長さ</b></div><label className="field"><span>始点から何列まで進めるか</span><select value={columnCount} onChange={(event) => setColumnCount(Number(event.target.value))}>{Array.from({ length: MAX_COLUMNS - 1 }, (_, index) => index + 2).map((count) => <option key={count} value={count}>{count} 列</option>)}</select></label><p>隣り合う列の地点はすべて接続されます。</p></section>
        <section className="column-planner" aria-label="列ごとの地点種別"><div className="box-heading"><Move size={15} /><b>地点種別</b></div>{layout.columns.map((column, stage) => <div className="route-column" key={stage}><div className="column-heading"><span>列 {stage + 1}</span><small>{stage === 0 ? "起点" : `${column.length} 地点`}</small></div>{column.map((node) => <div className={`column-node ${selected.id === node.id ? "is-current" : ""}`} key={node.id}><button type="button" onClick={() => setSelectedId(node.id)} aria-label={`${node.label}を編集`}><svg viewBox="-24 -24 48 48" aria-hidden="true"><NodeMark node={node} color={selected.id === node.id ? colors.brass : colors[node.accent]} /></svg><span>{node.label}</span></button>{stage === 0 ? <span className="locked-kind">起点</span> : <select aria-label={`${node.label}の地点種別`} value={node.kind} onChange={(event) => updateNode(node.id, { kind: event.target.value as NodeKind, label: kinds[event.target.value as NodeKind].label })}>{Object.entries(kinds).filter(([key]) => key !== "origin").map(([key, item]) => <option key={key} value={key}>{item.short} {item.label}</option>)}</select>}</div>)}{stage > 0 && <button type="button" className="add-column-node" onClick={() => addNode(stage)} disabled={column.length >= MAX_NODES_PER_COLUMN}><Plus size={13} /> この列に地点を追加</button>}</div>)}</section>
        <section className="selected-node-box"><div className="box-heading"><WandSparkles size={15} /><b>選択中の地点</b></div><p>{kinds[selected.kind].description}</p><label className="field"><span>表示名</span><input value={selected.label} maxLength={28} onChange={(event) => updateNode(selected.id, { label: event.target.value })} /></label>{selected.kind === "custom" && <label className="field"><span>任意の記号</span><input value={selected.icon} maxLength={6} placeholder="例：◇ / 鍵 / ◆" onChange={(event) => updateNode(selected.id, { icon: event.target.value })} /></label>}<label className="field"><span>縁取り</span><select value={selected.accent} onChange={(event) => updateNode(selected.id, { accent: event.target.value as Accent })}>{Object.entries(colors).map(([key]) => <option key={key} value={key}>{key}</option>)}</select></label></section>
        <div className="appearance-box"><div className="box-heading"><WandSparkles size={15} /><b>画像の見た目</b></div><div className="two-fields"><label className="field"><span>背景</span><input type="color" value={tree.theme.background} onChange={(event) => mutate((draft) => { draft.theme.background = event.target.value; })} /></label><label className="field"><span>接続線</span><input type="color" value={tree.theme.line} onChange={(event) => mutate((draft) => { draft.theme.line = event.target.value; })} /></label></div><label className="field"><span>アイコンの大きさ</span><input type="range" min="18" max="42" value={tree.theme.iconSize} onChange={(event) => mutate((draft) => { draft.theme.iconSize = Number(event.target.value); })} /></label><label className="check"><input type="checkbox" checked={tree.theme.showLabels} onChange={(event) => mutate((draft) => { draft.theme.showLabels = event.target.checked; })} /> アイコン名を表示する</label></div>
        <Button variant="ghost" className="danger-button" onClick={removeNode}><Trash2 size={16} /> この地点を削除</Button>
      </aside>
      <article className="canvas-panel" style={{ backgroundImage: `linear-gradient(rgba(13,20,27,.88), rgba(13,20,27,.94)), url(${asset.texture})` }}><header className="canvas-head"><div><p className="eyebrow">ORBITAL CANVAS</p><h2>移動ツリー</h2><span>列をまたぐ地点は自動で接続されます。地点を選んで種別を変えます。</span><p className="canvas-plate">FORWARD ROUTE / {columnCount} COLUMNS · {tree.nodes.length} WAYPOINTS</p></div><div className="export-actions"><Button variant="outline" onClick={() => { downloadText("orbital-route-atlas.svg", buildSvg(tree), "image/svg+xml;charset=utf-8"); message("SVGを保存しました"); }}><Download size={16} /> SVG</Button><Button variant="outline" onClick={exportPng}><FileDown size={16} /> PNG</Button></div></header>
        <RouteCanvas tree={tree} selectedId={selected.id} onNodeClick={setSelectedId} />
        <div className="mobile-flow-actions" aria-label="地図の操作"><p><span /> ROUTE OPERATIONS / EDIT LOG</p><div className="mobile-flow-primary"><Button onClick={() => addNode(Math.min(columnCount - 1, 1))} className="brass-button"><Plus size={16} /> 地点を追加</Button><Button variant="outline" onClick={() => fileRef.current?.click()}><FileUp size={16} /> 設定を読む</Button></div><div className="mobile-flow-secondary"><Button variant="outline" onClick={() => { downloadText("orbital-route-atlas.json", JSON.stringify(tree, null, 2), "application/json"); message("ツリー設定を保存しました"); }}><Save size={16} /> 設定を保存</Button></div><div className="history-actions mobile-history" role="group" aria-label="編集履歴"><Button variant="outline" onClick={performUndo} disabled={!canUndo} title="編集を戻す"><Undo2 size={16} /> 戻す</Button><Button variant="outline" onClick={performRedo} disabled={!canRedo} title="やり直す"><Redo2 size={16} /> やり直す</Button></div></div>
        <footer className="canvas-footer"><span>左から右への一方向ルートです。列を増やすと次の経路が生まれます。</span><Button variant="ghost" size="sm" onClick={reset}><RotateCcw size={15} /> 初期形に戻す</Button></footer>
      </article>
    </section>
    <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={importTree} />
    {notice && <div className="toast" role="status">{notice}</div>}
  </main>;
}
