/* フローティングパネル群 + Toolbar
 * v2: Kagami Map Studio ブランド、保存の背景選択、自動接続ボタン
 */

// ─────────────────────────────────────
// パレット
// ─────────────────────────────────────
function Palette({ selectedKind, setSelectedKind, mutate }) {
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
    <div className="fp palette" style={{ left: pos.x, top: pos.y, width: collapsed ? 48 : 268 }}>
      <div className="fp-head" onPointerDown={onHeadDown} onPointerMove={onHeadMove} onPointerUp={onHeadUp}>
        <span className="fp-title">{collapsed ? "" : "マス種類"}</span>
        <button className="fp-btn" title={collapsed ? "展開" : "畳む"} onClick={() => setCollapsed(v => !v)}>
          {collapsed ? "▶" : "◀"}
        </button>
      </div>
      {!collapsed && (
        <div className="palette-body">
          <p className="palette-hint">ドラッグで配置。<kbd>1</kbd>〜<kbd>9</kbd> でも切替。</p>
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
                        onClick={() => setSelectedKind(k.id)}
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

// ─────────────────────────────────────
// インスペクタ
// ─────────────────────────────────────
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
        <p className="dim">・空白クリックで選択解除<br/>・<kbd>Space</kbd>+ドラッグでパン<br/>・<kbd>⌘/Ctrl</kbd>+Wheelで拡縮<br/>・選択ノードから点滅する◯を<b>クリック</b>で結線</p>
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
                  <Icon ink={THEME.ink} accent={tone} warn={THEME.warn} variant="quiet" />
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
                    <span>← #{src?.stage + 1}-{src?.row + 1} {KIND_INDEX[src?.kind]?.label}</span>
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

// ─────────────────────────────────────
// エクスポート・ダイアログ
// ─────────────────────────────────────
function ExportDialog({ open, format, onClose, onConfirm }) {
  const [bg, setBg] = React.useState("theme");
  const [scale, setScale] = React.useState(2);
  const dialogRef = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (dialogRef.current && !dialogRef.current.contains(e.target)) onClose(); };
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    setTimeout(() => document.addEventListener("mousedown", onDown), 0);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open, onClose]);
  if (!open) return null;

  const formatLabel = format === "svg" ? "SVG" : format === "png" ? "PNG" : "PDF";
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
              <div className="bg-preview" style={{ background: THEME.bg }} />
              <span>テーマ背景</span>
              <small>ダーク配色をそのまま</small>
            </button>
            <button className={`bg-choice ${bg === "transparent" ? "on" : ""}`} onClick={() => setBg("transparent")}>
              <div className="bg-preview bg-check" />
              <span>透過</span>
              <small>{format === "png" ? "PNG透過 / SVG無地" : "SVGの背景を除去"}</small>
            </button>
            <button className={`bg-choice ${bg === "white" ? "on" : ""}`} onClick={() => setBg("white")}>
              <div className="bg-preview" style={{ background: "#f8f6ef" }} />
              <span>白背景</span>
              <small>紙・印刷向け</small>
            </button>
          </div>
          {format === "png" && (
            <>
              <label className="i-label">解像度倍率</label>
              <div className="scale-choices">
                {[1, 2, 3, 4].map(v => (
                  <button key={v} className={`scale-choice ${scale === v ? "on" : ""}`} onClick={() => setScale(v)}>
                    {v}×
                  </button>
                ))}
              </div>
              <p className="modal-hint">
                {scale}× → 実寸 ×{scale}倍のPNG（{scale === 4 ? "高精細印刷向け" : scale === 1 ? "軽量" : "標準"}）
              </p>
            </>
          )}
        </div>
        <div className="modal-foot">
          <button className="btn" onClick={onClose}>キャンセル</button>
          <button className="btn primary" onClick={() => onConfirm({ bg, scale })}>保存</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────
// ツールバー
// ─────────────────────────────────────
function Toolbar({
  map, mutate, replace, undo, redo, canUndo, canRedo,
  onExportSvg, onExportPng, onExportJson,
  onReset, onFit, onAutoConnect,
  notify, showLabels, setShowLabels,
  showThumb, setShowThumb
}) {
  const fileRef = React.useRef(null);
  const [showTheme, setShowTheme] = React.useState(false);
  const [showExport, setShowExport] = React.useState(false);
  const themeRef = React.useRef(null);
  const exportRef = React.useRef(null);

  React.useEffect(() => {
    const onDown = (e) => {
      if (themeRef.current && !themeRef.current.contains(e.target)) setShowTheme(false);
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
        notify("マップを読み込みました");
      } catch { notify("読み込みに失敗しました"); }
      if (fileRef.current) fileRef.current.value = "";
    };
    reader.readAsText(file);
  };

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
              {/* 鏡枠 */}
              <path d="M 8 6 H 32 L 34 14 V 26 L 32 34 H 8 L 6 26 V 14 Z"
                    fill="#12101a" stroke="url(#brandg)" strokeWidth="2" strokeLinejoin="round" />
              {/* 内側の鏡面 */}
              <path d="M 12 10 H 28 L 30 16 V 24 L 28 30 H 12 L 10 24 V 16 Z"
                    fill="none" stroke="#d4a24b" strokeOpacity="0.6" strokeWidth="1" />
              {/* 中央グラフ（3ノード） */}
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
                onClick={() => mutate(d => mapOps.addColumn(d, (Math.max(0, ...d.nodes.map(n => n.stage))) + 1))}
                title="末尾に列を追加（視点は動かしません）">列 ＋</button>
        <button className="tb-btn" onClick={onAutoConnect}
                title="現在のノード配置から接続を自動生成（Limbus MAP法則ベース）">自動接続</button>
        <button className="tb-btn" onClick={onFit} title="全体表示">全体</button>
      </div>

      <div className="tb-group">
        <label className="tb-check" title="マス下に名称テキストを併記">
          <input type="checkbox" checked={showLabels} onChange={e => setShowLabels(e.target.checked)} />
          ラベル
        </label>
        <div ref={themeRef} style={{ position: "relative" }}>
          <button className="tb-btn" onClick={() => setShowTheme(v => !v)} title="表示テーマ">テーマ</button>
          {showTheme && (
            <div className="tb-popover">
              <label className="i-label">アイコンサイズ</label>
              <input type="range" min="32" max="60" value={map.theme.iconSize}
                     onChange={e => replace({ ...map, theme: { ...map.theme, iconSize: Number(e.target.value) } })} />
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
      </div>

      <div className="tb-group">
        <div ref={exportRef} style={{ position: "relative" }}>
          <button className="tb-btn tb-btn-primary" onClick={() => setShowExport(v => !v)} title="画像/データとして保存">保存 ▾</button>
          {showExport && (
            <div className="tb-popover tb-popover-export">
              <button className="popover-row" onClick={() => { setShowExport(false); onExportPng(); }}>
                <span className="pr-name">PNG 画像</span>
                <span className="pr-desc">背景・解像度を選べる</span>
              </button>
              <button className="popover-row" onClick={() => { setShowExport(false); onExportSvg(); }}>
                <span className="pr-name">SVG ベクター</span>
                <span className="pr-desc">背景の透過選択可</span>
              </button>
              <button className="popover-row" onClick={() => { setShowExport(false); onExportJson(); }}>
                <span className="pr-name">JSON</span>
                <span className="pr-desc">編集データを保存</span>
              </button>
              <div className="popover-sep" />
              <button className="popover-row" onClick={() => { setShowExport(false); fileRef.current?.click(); }}>
                <span className="pr-name">JSON を読込</span>
                <span className="pr-desc">保存済みマップを開く</span>
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
