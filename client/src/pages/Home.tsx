/* Orbital Route Atlas: independent celestial cartography with circular compass waypoints and dotted forward routes. */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight, Download, ExternalLink, FileDown, FileUp, Link2, Link2Off, MapPin,
  Maximize2, Minus, Move, Plus, RotateCcw, Save, Trash2, Upload, WandSparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

type NodeKind = "start" | "battle" | "elite" | "event" | "shop" | "rest" | "boss" | "custom";
type Accent = "brass" | "teal" | "slate";
type RouteNode = { id: string; stage: number; kind: NodeKind; icon: string; label: string; accent: Accent };
type RouteTree = {
  title: string;
  nodes: RouteNode[];
  edges: [string, string][];
  theme: { background: string; line: string; showLabels: boolean; iconSize: number };
};

const STORAGE_KEY = "orbital-route-atlas.v1";
const asset = {
  logo: "/manus-storage/mrt-logo-mark_848914a2.png",
  hero: "/manus-storage/mrt-hero-route-lattice_b6fd2749.jpg",
  texture: "/manus-storage/mrt-canvas-constellation-texture_f6acef3f.jpg",
  reference: "/manus-storage/mrt-route-reference-card_dc71c788.jpg",
};
const kinds: Record<NodeKind, { label: string; glyph: string }> = {
  start: { label: "開始", glyph: "◇" },
  battle: { label: "戦闘", glyph: "⚔" },
  elite: { label: "精鋭", glyph: "✦" },
  event: { label: "イベント", glyph: "?" },
  shop: { label: "ショップ", glyph: "⌂" },
  rest: { label: "休憩", glyph: "☾" },
  boss: { label: "ボス", glyph: "♛" },
  custom: { label: "任意", glyph: "●" },
};
const colors: Record<Accent, string> = {
  brass: "#e7b95e", teal: "#74d5d1", slate: "#8fa4ae",
};

export const baseTree = (): RouteTree => ({
  title: "移動ツリー",
  theme: { background: "#101720", line: "#6e8594", showLabels: false, iconSize: 27 },
  nodes: [
    { id: "start", stage: 0, kind: "start", icon: "", label: "開始", accent: "teal" },
    { id: "battle", stage: 1, kind: "battle", icon: "", label: "戦闘", accent: "slate" },
    { id: "event", stage: 1, kind: "event", icon: "", label: "イベント", accent: "slate" },
    { id: "elite", stage: 2, kind: "elite", icon: "", label: "精鋭", accent: "slate" },
    { id: "shop", stage: 2, kind: "shop", icon: "", label: "ショップ", accent: "slate" },
    { id: "boss", stage: 3, kind: "boss", icon: "", label: "ボス", accent: "teal" },
  ],
  edges: [["start", "battle"], ["start", "event"], ["battle", "elite"], ["battle", "shop"], ["event", "elite"], ["event", "shop"], ["elite", "boss"], ["shop", "boss"]],
});

const clean = (value: unknown, max = 28) => String(value ?? "").replace(/[<>]/g, "").slice(0, max);
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));
const uuid = () => globalThis.crypto?.randomUUID?.() ?? `node_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
const glyph = (node: RouteNode) => node.kind === "custom" && node.icon ? node.icon : node.icon || kinds[node.kind].glyph;
const escapeXml = (value: unknown) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export function normalize(input: unknown): RouteTree {
  const fallback = baseTree();
  if (!input || typeof input !== "object") return fallback;
  const source = input as Partial<RouteTree>;
  const nodes = Array.isArray(source.nodes) ? source.nodes
    .filter((node): node is RouteNode => Boolean(node && typeof node === "object" && (node as RouteNode).id))
    .map((node, index) => ({
      id: clean(node.id, 48) || `node_${index}`,
      stage: Math.max(0, Math.min(20, Number.parseInt(String(node.stage), 10) || 0)),
      kind: node.kind in kinds ? node.kind : "custom",
      icon: clean(node.icon, 6),
      label: clean(node.label, 28) || "地点",
      accent: node.accent in colors ? node.accent : "brass",
    })) : fallback.nodes;
  const validNodes = nodes.length ? nodes : fallback.nodes;
  const byId = new Map(validNodes.map((node) => [node.id, node]));
  const seen = new Set<string>();
  const edges = Array.isArray(source.edges) ? source.edges.filter((edge): edge is [string, string] => {
    if (!Array.isArray(edge) || edge.length !== 2) return false;
    const [from, to] = edge;
    const key = `${from}>${to}`;
    if (!byId.has(from) || !byId.has(to) || byId.get(from)!.stage >= byId.get(to)!.stage || seen.has(key)) return false;
    seen.add(key); return true;
  }) : fallback.edges;
  return {
    title: clean(source.title, 40) || "移動ツリー",
    nodes: validNodes,
    edges,
    theme: {
      background: typeof source.theme?.background === "string" ? source.theme.background : fallback.theme.background,
      line: typeof source.theme?.line === "string" ? source.theme.line : fallback.theme.line,
      showLabels: Boolean(source.theme?.showLabels),
      iconSize: Math.max(18, Math.min(42, Number(source.theme?.iconSize) || fallback.theme.iconSize)),
    },
  };
}

function useTree() {
  const [tree, setTree] = useState<RouteTree>(() => {
    try { return normalize(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "")); } catch { return baseTree(); }
  });
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(tree)); }, [tree]);
  return [tree, setTree] as const;
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

function waypointTicks(x: number, y: number) {
  return `M ${x} ${y - 47} v 10 M ${x + 47} ${y} h -10 M ${x} ${y + 47} v -10 M ${x - 47} ${y} h 10`;
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
    const label = tree.theme.showLabels ? `<text x="${p.x}" y="${p.y + 61}" text-anchor="middle" fill="#eef5f7" font-family="Noto Sans JP, sans-serif" font-size="14">${escapeXml(node.label)}</text>` : "";
    return `<g><circle cx="${p.x}" cy="${p.y}" r="39" fill="#202d36" stroke="${colors[node.accent]}" stroke-width="3"/><circle cx="${p.x}" cy="${p.y}" r="29" fill="none" stroke="${colors[node.accent]}" stroke-opacity=".32"/><path d="${waypointTicks(p.x, p.y)}" fill="none" stroke="${colors[node.accent]}" stroke-width="2" stroke-linecap="round"/><text x="${p.x}" y="${p.y + tree.theme.iconSize * .34}" text-anchor="middle" fill="${colors[node.accent]}" font-family="sans-serif" font-size="${tree.theme.iconSize}">${escapeXml(glyph(node))}</text>${label}</g>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="${escapeXml(tree.theme.line)}"/></marker></defs><rect width="100%" height="100%" rx="18" fill="${escapeXml(tree.theme.background)}"/>${paths}${nodes}</svg>`;
}

function downloadText(filename: string, body: string, type: string) {
  const url = URL.createObjectURL(new Blob([body], { type }));
  const link = document.createElement("a"); link.href = url; link.download = filename; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function RouteCanvas({ tree, selectedId, connectingFrom, onNodeClick }: { tree: RouteTree; selectedId: string; connectingFrom: string; onNodeClick: (id: string) => void }) {
  const { width, height, positions, columns } = layoutFor(tree);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ id: number; x: number; y: number } | null>(null);
  const movedRef = useRef(false);
  const suppressClickRef = useRef(false);
  const fit = () => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const narrow = window.matchMedia("(max-width: 640px)").matches;
    const next = narrow ? Math.max(.33, Math.min(1, Math.min((viewport.clientWidth - 18) / width, (viewport.clientHeight - 18) / height))) : 1;
    setZoom(next); setPan({ x: 0, y: 0 });
  };
  useEffect(() => { fit(); const observer = new ResizeObserver(fit); if (viewportRef.current) observer.observe(viewportRef.current); return () => observer.disconnect(); }, [width, height]);
  const changeZoom = (step: number) => setZoom((value) => Math.max(.33, Math.min(1.45, Number((value + step).toFixed(2)))));
  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    dragRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY }; movedRef.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
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
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const chooseNode = (id: string) => { if (!suppressClickRef.current) onNodeClick(id); };
  return <div className="canvas-scroll" ref={viewportRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onWheel={(event) => { if (!event.ctrlKey && !event.metaKey) return; event.preventDefault(); changeZoom(event.deltaY > 0 ? -.08 : .08); }}>
    <div className="canvas-transform" style={{ width, height, left: `calc(50% - ${width / 2}px)`, top: `calc(50% - ${height / 2}px)`, transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}><svg className="route-svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="移動ツリーのプレビュー">
    <defs><marker id="route-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill={tree.theme.line} /></marker></defs>
    <rect width="100%" height="100%" rx="18" fill={tree.theme.background} />
    {columns.map((_, index) => <line key={index} x1={94 + index * 220} x2={94 + index * 220} y1="38" y2={height - 38} className="stage-guide" />)}
    {tree.edges.map(([from, to]) => { const a = positions[from]; const b = positions[to]; if (!a || !b) return null; const bend = Math.max(46, (b.x - a.x) * .47); const active = connectingFrom === from || connectingFrom === to; return <path key={`${from}_${to}`} d={`M ${a.x + 47} ${a.y} C ${a.x + bend} ${a.y}, ${b.x - bend} ${b.y}, ${b.x - 47} ${b.y}`} fill="none" stroke={active ? "#e7b95e" : tree.theme.line} strokeWidth={active ? 4 : 3} strokeLinecap="round" strokeDasharray="8 7" markerEnd="url(#route-arrow)" />; })}
    {tree.nodes.map((node) => { const p = positions[node.id]; const selected = selectedId === node.id; const origin = connectingFrom === node.id; const mark = selected || origin ? colors.brass : colors[node.accent]; return <g key={node.id} className={`route-node ${selected ? "is-selected" : ""} ${origin ? "is-origin" : ""}`} role="button" tabIndex={0} aria-label={`${node.label}を選択`} onClick={() => chooseNode(node.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); chooseNode(node.id); } }}>
      <circle cx={p.x} cy={p.y} r="39" fill="#202d36" stroke={mark} strokeWidth={selected || origin ? 5 : 3} />
      <circle cx={p.x} cy={p.y} r="29" fill="none" stroke={mark} strokeOpacity=".32" />
      <path d={waypointTicks(p.x, p.y)} fill="none" stroke={mark} strokeWidth="2" strokeLinecap="round" />
      <text x={p.x} y={p.y + tree.theme.iconSize * .34} textAnchor="middle" fill={mark} fontSize={tree.theme.iconSize}>{glyph(node)}</text>
      {tree.theme.showLabels && <text x={p.x} y={p.y + 61} textAnchor="middle" fill="#eef5f7" fontSize="14">{node.label}</text>}
    </g>; })}
    </svg></div>
    <div className="canvas-nav" aria-label="地図の表示倍率"><span><Move size={14} /> 全体を確認</span><div><button type="button" onClick={(event) => { event.stopPropagation(); changeZoom(-.1); }} aria-label="縮小"><Minus size={15} /></button><button type="button" onClick={(event) => { event.stopPropagation(); fit(); }} aria-label="全体表示"><Maximize2 size={14} /></button><button type="button" onClick={(event) => { event.stopPropagation(); changeZoom(.1); }} aria-label="拡大"><Plus size={15} /></button></div></div>
  </div>;
}

export default function Home() {
  const [tree, setTree] = useTree();
  const [selectedId, setSelectedId] = useState("start");
  const [connectingFrom, setConnectingFrom] = useState("");
  const [notice, setNotice] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const selected = tree.nodes.find((node) => node.id === selectedId) ?? tree.nodes[0];
  const layout = useMemo(() => layoutFor(tree), [tree]);
  const stageOptions = Array.from({ length: Math.max(1, layout.columns.length + 1) }, (_, index) => index);
  const message = (text: string) => { setNotice(text); window.setTimeout(() => setNotice(""), 2600); };
  const mutate = (action: (draft: RouteTree) => void) => setTree((previous) => { const next = clone(previous); action(next); return normalize(next); });
  const updateNode = (patch: Partial<RouteNode>) => { if (!selected) return; mutate((draft) => { const node = draft.nodes.find((item) => item.id === selected.id); if (node) Object.assign(node, patch); }); };
  const addNode = () => { const node: RouteNode = { id: uuid(), stage: Math.min((selected?.stage ?? layout.columns.length - 1) + 1, 20), kind: "custom", icon: "●", label: "新しい地点", accent: "slate" }; mutate((draft) => draft.nodes.push(node)); setSelectedId(node.id); setConnectingFrom(""); message("地点を追加しました"); };
  const removeNode = () => { if (!selected || tree.nodes.length <= 1) return; mutate((draft) => { draft.nodes = draft.nodes.filter((node) => node.id !== selected.id); draft.edges = draft.edges.filter(([from, to]) => from !== selected.id && to !== selected.id); }); setSelectedId(tree.nodes.find((node) => node.id !== selected.id)?.id ?? ""); setConnectingFrom(""); message("地点を削除しました"); };
  const reset = () => { if (!confirm("移動ツリーを初期テンプレートへ戻しますか？")) return; setTree(baseTree()); setSelectedId("start"); setConnectingFrom(""); message("初期テンプレートへ戻しました"); };
  const onNodeClick = (targetId: string) => {
    if (!connectingFrom) { setSelectedId(targetId); return; }
    if (connectingFrom === targetId) { setConnectingFrom(""); return; }
    const from = tree.nodes.find((node) => node.id === connectingFrom); const to = tree.nodes.find((node) => node.id === targetId);
    if (!from || !to || to.stage <= from.stage) { message("接続先は右側の進行列から選びます"); return; }
    mutate((draft) => { const exists = draft.edges.some(([a, b]) => a === from.id && b === to.id); draft.edges = exists ? draft.edges.filter(([a, b]) => !(a === from.id && b === to.id)) : [...draft.edges, [from.id, to.id]]; });
    setSelectedId(targetId); setConnectingFrom(""); message("接続を更新しました");
  };
  const exportPng = () => {
    const svg = buildSvg(tree); const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" })); const image = new Image();
    image.onload = () => { const { width, height } = layoutFor(tree); const canvas = document.createElement("canvas"); canvas.width = width * 2; canvas.height = height * 2; const context = canvas.getContext("2d"); context?.drawImage(image, 0, 0, canvas.width, canvas.height); URL.revokeObjectURL(url); canvas.toBlob((blob) => { if (!blob) return; const png = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = png; link.download = "orbital-route-atlas.png"; link.click(); setTimeout(() => URL.revokeObjectURL(png), 1000); message("PNGを保存しました"); }, "image/png"); };
    image.src = url;
  };
  const importTree = (event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { try { const next = normalize(JSON.parse(String(reader.result))); setTree(next); setSelectedId(next.nodes[0]?.id ?? ""); setConnectingFrom(""); message("ツリー設定を読み込みました"); } catch { message("ツリー設定を読み込めませんでした"); } }; reader.readAsText(file); event.target.value = ""; };
  const outgoing = selected ? tree.edges.filter(([from]) => from === selected.id).map(([, to]) => tree.nodes.find((node) => node.id === to)).filter((node): node is RouteNode => Boolean(node)) : [];

  return <main className="min-h-screen app-shell">
    <header className="topline"><div className="brand"><img src={asset.logo} alt="" /><div><span>ORBITAL ROUTE ATLAS</span><small>TRPG MOVE MAP GENERATOR</small></div></div><a className="topline-open" href="/" target="_blank" rel="noopener noreferrer"><ExternalLink size={15} /> 別タブで開く</a></header>
    <section className="hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(8,15,21,.96) 0%, rgba(8,15,21,.72) 54%, rgba(8,15,21,.28)), url(${asset.hero})` }}><div><p className="eyebrow">ROUTE / BRANCH / MERGE</p><h1>アイコンから、次のアイコンへ。</h1><p className="hero-copy">遭遇や報酬は書かない。セッションで必要な移動の選択肢だけを、分岐と合流のツリーにします。</p></div><img className="hero-reference" src={asset.reference} alt="" /></section>

    <section className="command-strip" aria-label="ツリー操作"><div className="command-copy"><b>{tree.title}</b><span>{tree.nodes.length} 地点 / {tree.edges.length} 接続</span></div><div className="command-actions"><Button onClick={addNode} className="brass-button"><Plus size={16} /> 地点を追加</Button><Button variant="outline" onClick={() => fileRef.current?.click()}><FileUp size={16} /> 設定を読む</Button><Button variant="outline" onClick={() => { downloadText("orbital-route-atlas.json", JSON.stringify(tree, null, 2), "application/json"); message("ツリー設定を保存しました"); }}><Save size={16} /> 設定を保存</Button><input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={importTree} /></div></section>

    <section className="workspace">
      <aside className="editor-rail"><div className="rail-title"><div><p className="eyebrow">NODE EDITOR</p><h2>地点の編集</h2></div><span>列 {selected.stage + 1}</span></div>
        <label className="field"><span>表示名</span><input value={selected.label} maxLength={28} onChange={(event) => updateNode({ label: event.target.value })} /></label>
        <label className="field"><span>アイコン種別</span><select value={selected.kind} onChange={(event) => updateNode({ kind: event.target.value as NodeKind })}>{Object.entries(kinds).map(([key, item]) => <option key={key} value={key}>{item.glyph} {item.label}</option>)}</select></label>
        {selected.kind === "custom" && <label className="field"><span>任意アイコン</span><input value={selected.icon} maxLength={6} placeholder="例：☠ / ◆ / 鍵" onChange={(event) => updateNode({ icon: event.target.value })} /></label>}
        <div className="two-fields"><label className="field"><span>進行列</span><select value={selected.stage} onChange={(event) => updateNode({ stage: Number(event.target.value) })}>{stageOptions.map((stage) => <option key={stage} value={stage}>列 {stage + 1}</option>)}</select></label><label className="field"><span>縁取り</span><select value={selected.accent} onChange={(event) => updateNode({ accent: event.target.value as Accent })}>{Object.entries(colors).map(([key]) => <option key={key} value={key}>{key}</option>)}</select></label></div>

        <div className="connection-box"><div className="box-heading"><Link2 size={15} /><b>接続</b></div><p>{connectingFrom ? "右側の地点をプレビューで選ぶ。既存の線を選ぶと外せます。" : "選択中の地点から、右側の地点へ線を引きます。"}</p><Button variant={connectingFrom ? "default" : "outline"} className={connectingFrom ? "connect-active" : ""} onClick={() => setConnectingFrom(connectingFrom ? "" : selected.id)}>{connectingFrom ? <Link2Off size={16} /> : <Link2 size={16} />}{connectingFrom ? "接続をやめる" : "この地点から接続"}</Button>
          {outgoing.length > 0 && <div className="outgoing-list">{outgoing.map((node) => <button key={node.id} onClick={() => { mutate((draft) => { draft.edges = draft.edges.filter(([from, to]) => !(from === selected.id && to === node.id)); }); message("接続を外しました"); }}>→ {node.label}<span>外す</span></button>)}</div>}</div>

        <div className="appearance-box"><div className="box-heading"><WandSparkles size={15} /><b>画像の見た目</b></div><div className="two-fields"><label className="field"><span>背景</span><input type="color" value={tree.theme.background} onChange={(event) => mutate((draft) => { draft.theme.background = event.target.value; })} /></label><label className="field"><span>接続線</span><input type="color" value={tree.theme.line} onChange={(event) => mutate((draft) => { draft.theme.line = event.target.value; })} /></label></div><label className="field"><span>アイコンの大きさ</span><input type="range" min="18" max="42" value={tree.theme.iconSize} onChange={(event) => mutate((draft) => { draft.theme.iconSize = Number(event.target.value); })} /></label><label className="check"><input type="checkbox" checked={tree.theme.showLabels} onChange={(event) => mutate((draft) => { draft.theme.showLabels = event.target.checked; })} /> アイコン名を表示する</label></div>
        <Button variant="ghost" className="danger-button" onClick={removeNode}><Trash2 size={16} /> この地点を削除</Button>
      </aside>

      <article className="canvas-panel" style={{ backgroundImage: `linear-gradient(rgba(13,20,27,.88), rgba(13,20,27,.94)), url(${asset.texture})` }}><header className="canvas-head"><div><p className="eyebrow">ORBITAL CANVAS</p><h2>移動ツリー</h2><span>アイコンを選んで編集。接続中は右側の地点を押す。</span></div><div className="export-actions"><Button variant="outline" onClick={() => { downloadText("orbital-route-atlas.svg", buildSvg(tree), "image/svg+xml;charset=utf-8"); message("SVGを保存しました"); }}><Download size={16} /> SVG</Button><Button className="brass-button" onClick={exportPng}><FileDown size={16} /> PNG</Button></div></header>
        {connectingFrom && <div className="connect-notice"><ArrowRight size={16} /> 接続中：{tree.nodes.find((node) => node.id === connectingFrom)?.label} から、右側の地点を選択</div>}
        <RouteCanvas tree={tree} selectedId={selected.id} connectingFrom={connectingFrom} onNodeClick={onNodeClick} />
        <footer className="canvas-footer"><span>分岐と合流はどちらも作成できます。</span><Button variant="ghost" size="sm" onClick={reset}><RotateCcw size={15} /> 初期形に戻す</Button></footer>
      </article>
    </section>
    {notice && <div className="toast" role="status">{notice}</div>}
  </main>;
}
