/* 中央マップキャンバス（v2）
 * - 列追加/挿入時に fit() を呼ばず視点維持
 * - 選択ノードから接続候補（次列ノード）に光る○を表示、クリックで即結線
 * - マス下ラベル併記でアイコン意味の識別性を担保
 * - パン(Space+drag / middle drag) / ズーム(Ctrl+wheel or ボタン)
 */

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

// ノードレンダラー
function NodeMarker({ node, pos, selected, isPulse, iconSize, showLabel, onSelect, onStartLink, onRemove }) {
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
      {/* ベースの六角プレート */}
      <g>
        <path
          d="M -44 -24 L -30 -44 H 30 L 44 -24 V 24 L 30 44 H -30 L -44 24 Z"
          fill={THEME.panel}
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
      {/* アイコン */}
      <foreignObject x={-iconSize/2} y={-iconSize/2} width={iconSize} height={iconSize} style={{ pointerEvents: "none" }}>
        <div xmlns="http://www.w3.org/1999/xhtml" style={{ width: "100%", height: "100%" }}>
          <Icon ink={THEME.ink} accent={tone === "blood" ? THEME.bloodHi : THEME.brass} warn={THEME.warn} />
        </div>
      </foreignObject>
      {/* テキスト併記（アイコン識別を担保） */}
      {showLabel && (
        <g style={{ pointerEvents: "none" }}>
          <rect x={-40} y={NODE_H/2 + 6} width={80} height={20} rx={4}
                fill={THEME.bg} fillOpacity="0.85"
                stroke={ringColor} strokeOpacity="0.4" strokeWidth="1" />
          <text x={0} y={NODE_H/2 + 20} textAnchor="middle" fill={THEME.ink}
                fontSize="12" fontWeight="600"
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
            {node.label}
          </text>
        </g>
      )}
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
          <circle r="10" fill={THEME.brass} stroke={THEME.bg} strokeWidth="2" />
          <path d="M -4 0 H 4 M 0 -4 V 4" stroke={THEME.bg} strokeWidth="2.4" strokeLinecap="round" />
          <title>ここからドラッグ、または隣接列のノードをクリックで結線</title>
        </g>
      )}
      {selected && (
        <g transform={`translate(${-NODE_W/2 - 4} 0)`} onPointerDown={(e) => { e.stopPropagation(); onRemove?.(node.id); }}>
          <circle r="9" fill={THEME.blood} stroke={THEME.bg} strokeWidth="2" style={{ cursor: "pointer" }} />
          <path d="M -4 0 H 4" stroke="#fff" strokeWidth="2.4" />
          <title>ノード削除</title>
        </g>
      )}
    </g>
  );
}

function MapCanvas({
  map, selectedId, setSelectedId,
  mutate, edgeMode, setEdgeMode,
  showLabels,
}) {
  const wrapRef  = React.useRef(null);
  const svgRef   = React.useRef(null);
  const [viewport, setViewport] = React.useState({ w: 800, h: 600 });
  const [zoom, setZoom] = React.useState(1);
  const [pan, setPan]   = React.useState({ x: 0, y: 0 });
  const [linkFrom, setLinkFrom] = React.useState(null);
  const [ghostPos, setGhostPos] = React.useState(null);
  const [hoverCol, setHoverCol] = React.useState(null);
  const [dropHint, setDropHint] = React.useState(null);
  const [hoverEdge, setHoverEdge] = React.useState(null); // "from-to" 形式のキー
  const [edgeMenu, setEdgeMenu] = React.useState(null);    // {from, to, x, y} クリック時のポップオーバー
  const layout = React.useMemo(() => computeLayout(map), [map]);
  const didInitFit = React.useRef(false);

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

  // fit: 初回のみ or ユーザーが「全体表示」を押したとき
  const fit = React.useCallback(() => {
    const pad = 60;
    const zx = (viewport.w - pad*2) / layout.width;
    const zy = (viewport.h - pad*2) / layout.height;
    const z  = Math.max(0.3, Math.min(1.6, Math.min(zx, zy)));
    setZoom(z);
    setPan({ x: 0, y: 0 });
  }, [viewport, layout]);

  // 初回だけ自動フィット
  React.useEffect(() => {
    if (didInitFit.current) return;
    if (viewport.w > 100 && layout.width > 0) {
      fit();
      didInitFit.current = true;
    }
  }, [viewport.w, layout.width, fit]);

  // 外部から fit を呼べるように公開
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

  const startLink = (nodeId, e) => {
    setLinkFrom(nodeId);
    if (e) setGhostPos(clientToSvg(e.clientX, e.clientY));
  };
  const completeLink = (toId) => {
    if (!linkFrom || linkFrom === toId) { setLinkFrom(null); setGhostPos(null); return; }
    mutate((draft) => mapOps.addEdge(draft, linkFrom, toId, "normal"));  // デフォルト: 通常線
    setLinkFrom(null); setGhostPos(null);
  };

  // DnD: パレットからアイコン
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
    mutate(draft => {
      const id = mapOps.addNode(draft, stage, row, kind);
      // 直前列の位置的に近いノードから結線
      const prev = draft.nodes.filter(n => n.stage === stage - 1)
                              .sort((a, b) => Math.abs(a.row - row) - Math.abs(b.row - row));
      if (prev.length) mapOps.addEdge(draft, prev[0].id, id, "normal");  // デフォルト: 通常線
    });
  };
  const onDragLeave = () => setDropHint(null);

  const insertColumn = (atStage) => {
    mutate(draft => mapOps.addColumn(draft, atStage));
    // 視点は動かさない
  };

  // 接続候補ハイライト: 選択中ノードに対して、隣接列の未接続ノードを表示
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
      onWheel={onWheel}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragLeave={onDragLeave}
    >
      <div className="canvas-stage" style={{
        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
      }}>
        <svg ref={svgRef} width={layout.width} height={layout.height} viewBox={`0 0 ${layout.width} ${layout.height}`}
             xmlns="http://www.w3.org/2000/svg" className="route-svg">
          <rect data-role="canvas-bg" width={layout.width} height={layout.height} fill={map.theme.background} rx="14" />
          <defs>
            <linearGradient id="colgrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={THEME.brass} stopOpacity="0" />
              <stop offset="50%" stopColor={THEME.brass} stopOpacity="0.25" />
              <stop offset="100%" stopColor={THEME.brass} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* 列ガイド */}
          {layout.columns.map((_, s) => {
            const x = CANVAS_PAD_X + NODE_W/2 + s * COL_GAP;
            return <line key={`cg${s}`} x1={x} x2={x} y1="24" y2={layout.height - 24}
                         stroke="url(#colgrad)" strokeWidth="1" strokeDasharray="2 6" />;
          })}
          {/* 列ヘッダー (階層番号 / 総数) */}
          {layout.columns.map((_, s) => {
            const x = CANVAS_PAD_X + NODE_W/2 + s * COL_GAP;
            const total = layout.columns.length;
            const isLast = s === total - 1;
            return (
              <g key={`ch${s}`}>
                <text x={x} y={26} textAnchor="middle"
                      fill={isLast ? THEME.blood : THEME.brass}
                      fontSize="11" letterSpacing="0.18em" fontWeight="700"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  STAGE {String(s + 1).padStart(2, "0")}
                </text>
                <text x={x} y={40} textAnchor="middle"
                      fill={THEME.inkDim} fontSize="9" letterSpacing="0.1em"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {s + 1} / {total}
                </text>
              </g>
            );
          })}

          {/* 列間挿入ホットスポット */}
          {Array.from({ length: layout.columns.length + 1 }).map((_, i) => {
            const x = CANVAS_PAD_X + i * COL_GAP;
            const isHover = hoverCol === i;
            return (
              <g key={`ins${i}`} className="col-inserter" transform={`translate(${x} 0)`}
                 onPointerEnter={() => setHoverCol(i)} onPointerLeave={() => setHoverCol(cur => cur === i ? null : cur)}>
                <rect x={-14} y={40} width="28" height={layout.height - 80} fill="transparent" style={{ cursor: "pointer" }}
                      onClick={() => insertColumn(i)} />
                {isHover && (
                  <g>
                    <line x1="0" x2="0" y1="40" y2={layout.height - 40} stroke={THEME.brass} strokeWidth="1.5" strokeDasharray="4 4" opacity="0.8" />
                    <g transform={`translate(0 ${layout.height/2})`}>
                      <circle r="15" fill={THEME.panel} stroke={THEME.brass} strokeWidth="2" style={{ cursor: "pointer" }}
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
            const key = `${e.from}__${e.to}`;
            const isHover = hoverEdge === key;
            // 線の中間点(概算): 端点の平均 (ベジェの中間ではないが×ボタンの目印としては十分)
            const midX = (a.x + b.x) / 2;
            const midY = (a.y + b.y) / 2;
            return (
              <g key={`e${i}`} className={`edge ${isHover ? "edge-hover" : ""}`}
                 onPointerEnter={() => setHoverEdge(key)}
                 onPointerLeave={() => setHoverEdge(cur => cur === key ? null : cur)}
                 onClick={(ev) => {
                   ev.stopPropagation();
                   // クリックで種類切替（従来動作を保持しつつ、明示的な削除は×アイコンで）
                   mutate(dd => mapOps.toggleEdgeStyle(dd, e.from, e.to));
                 }}
                 onContextMenu={(ev) => { ev.preventDefault(); ev.stopPropagation(); mutate(dd => mapOps.removeEdge(dd, e.from, e.to)); }}>
                <path d={d} fill="none" stroke={stroke} strokeOpacity="0.18" strokeWidth={style.width + 8} strokeLinecap="round" />
                <path d={d} fill="none" stroke={stroke}
                      strokeOpacity={isHover ? Math.min(1, style.opacity + 0.15) : style.opacity}
                      strokeWidth={isHover ? style.width + 1 : style.width}
                      strokeLinecap="round" strokeDasharray={style.dash} />
                {e.style === "forced" && (
                  <path d={d} fill="none" stroke={THEME.bg} strokeWidth={style.width - 2.2} strokeLinecap="round" />
                )}
                <title>{style.label}経路（クリック: 種類切替 / 右クリック: 削除 / 中央の×で削除）</title>

                {/* ホバー時: 削除×ボタン + 種類ピル (中間点に表示) */}
                {isHover && (
                  <g transform={`translate(${midX} ${midY})`} style={{ pointerEvents: "auto" }}>
                    {/* 種類ラベルピル */}
                    <g transform="translate(-32 -22)"
                       onClick={(ev) => { ev.stopPropagation(); mutate(dd => mapOps.toggleEdgeStyle(dd, e.from, e.to)); }}
                       style={{ cursor: "pointer" }}>
                      <rect x={-22} y={-9} width={44} height={18} rx={9}
                            fill={THEME.bg} stroke={stroke} strokeWidth="1.5" fillOpacity="0.95" />
                      <text x={0} y={4} textAnchor="middle" fill={stroke} fontSize="10.5" fontWeight="600"
                            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
                        {style.label}
                      </text>
                      <title>クリックで種類切替</title>
                    </g>
                    {/* 削除×ボタン */}
                    <g transform="translate(20 -22)"
                       onClick={(ev) => { ev.stopPropagation(); mutate(dd => mapOps.removeEdge(dd, e.from, e.to)); }}
                       style={{ cursor: "pointer" }}>
                      <circle r="11" fill={THEME.blood} stroke={THEME.bg} strokeWidth="2" />
                      <path d="M -4 -4 L 4 4 M 4 -4 L -4 4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
                      <title>この接続線を削除</title>
                    </g>
                  </g>
                )}
              </g>
            );
          })}

          {/* 結線ゴースト */}
          {linkFrom && ghostPos && layout.positions[linkFrom] && (
            <path d={edgePath(layout.positions[linkFrom], ghostPos)}
                  fill="none" stroke={THEME.brass} strokeDasharray="4 4" strokeWidth="2" />
          )}

          {/* 接続候補ハイライト（選択ノードから隣接列へ） */}
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
                {/* 候補ラインのプレビュー */}
                <path d={edgePath(from, to)}
                      fill="none" stroke={THEME.brass} strokeOpacity="0.35"
                      strokeWidth="2.5" strokeDasharray="4 6" />
                {/* 接続候補マーカー（相手ノードの右） */}
                <g transform={`translate(${to.x - NODE_W/2 - 12} ${to.y})`}>
                  <circle r="10" fill={THEME.brass} fillOpacity="0.15" stroke={THEME.brass} strokeWidth="2" strokeDasharray="2 2">
                    <animate attributeName="r" from="8" to="12" dur="1.4s" repeatCount="indefinite" />
                    <animate attributeName="fill-opacity" from="0.35" to="0.05" dur="1.4s" repeatCount="indefinite" />
                  </circle>
                  <path d="M -4 0 H 4 M 0 -4 V 4" stroke={THEME.brass} strokeWidth="2" strokeLinecap="round" />
                  <title>クリックでこのノードに接続</title>
                </g>
              </g>
            );
          })}

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
                  showLabel={showLabels || map.theme.showLabels}
                  onSelect={(id) => setSelectedId(id)}
                  onStartLink={(id, e) => startLink(id, e)}
                  onRemove={(id) => mutate(d => mapOps.removeNode(d, id))}
                />
              </g>
            );
          })}

          {/* 列末尾に「＋」 */}
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
                <path d="M -10 0 H 10 M 0 -10 V 10" stroke={THEME.inkDim} strokeWidth="2.6" strokeLinecap="round" />
                <title>この列にマスを追加</title>
              </g>
            );
          })}
        </svg>
      </div>

      {/* キャンバスコントロール (右下エリア → 右上に移動して重ならないように) */}
      <div className="canvas-controls" onPointerDown={e => e.stopPropagation()}>
        <button onClick={() => changeZoom(-0.12)} title="縮小">−</button>
        <button onClick={fit} title="全体表示 (Fit)">◫</button>
        <button onClick={() => changeZoom(0.12)} title="拡大">＋</button>
        <span className="zoom-readout">{Math.round(zoom * 100)}%</span>
      </div>
      <div className="center-crosshair" aria-hidden="true">
        <span/><span/>
      </div>
      <MiniMap map={map} layout={layout} />
    </div>
  );
}

function MiniMap({ map, layout }) {
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
      )}
    </div>
  );
}

Object.assign(window, { MapCanvas, computeLayout });
