/* Kagami Map Studio: メインアプリ (v2)
 * - ExportDialog統合、背景選択、fitボタン、autoConnect、ラベル併記
 */

function App() {
  const { map, mutate, replace, undo, redo, canUndo, canRedo } = useMapHistory();
  const [selectedId, setSelectedId] = React.useState(null);
  const [selectedKind, setSelectedKind] = React.useState("skirmish");
  const [notice, setNotice] = React.useState("");
  const [showThumb, setShowThumb] = React.useState(true);
  const [showLabels, setShowLabels] = React.useState(true);
  // エクスポート・ダイアログ: format∈{svg,png,null}
  const [exportModal, setExportModal] = React.useState(null);

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

  // SVGビルド（エクスポート用）
  const buildExportSvg = (opts = {}) => {
    const { bg = "theme" } = opts;
    const source = document.querySelector(".route-svg");
    if (!source) return null;
    const svg = source.cloneNode(true);
    // UI装飾除去
    svg.querySelectorAll(".col-inserter, .add-node, .linkhandle").forEach(el => el.remove());
    svg.querySelectorAll(".nd.sel circle[stroke-dasharray]").forEach(el => el.remove());
    // 選択削除ボタン(円)を除去
    svg.querySelectorAll("g.sel > g > circle[fill='" + THEME.blood + "']").forEach(el => el.remove());
    // 接続候補ハイライトを除去
    svg.querySelectorAll("g[class*='cand']").forEach(el => {});
    // 上記CSSクラスを持つグループは実際は key付き。安全のため animate要素を除去
    svg.querySelectorAll("animate, animateTransform").forEach(el => el.remove());
    // 背景処理
    const bgRect = svg.querySelector("rect[data-role='canvas-bg']");
    if (bgRect) {
      if (bg === "transparent") bgRect.setAttribute("fill", "transparent");
      else if (bg === "white")  bgRect.setAttribute("fill", "#f8f6ef");
    }
    // MINIMAPは含めず、STAGEラベル等は含む（このsvgは.route-svgのみ）
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    return new XMLSerializer().serializeToString(svg);
  };

  const downloadBlob = (filename, blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = filename; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 800);
  };

  const performExportSvg = ({ bg }) => {
    const svgText = buildExportSvg({ bg });
    if (!svgText) { notify("SVGの生成に失敗しました"); return; }
    downloadBlob("kagami-map.svg", new Blob([svgText], { type: "image/svg+xml" }));
    notify(`SVGを保存しました (背景: ${bgLabel(bg)})`);
  };

  const performExportPng = async ({ bg, scale }) => {
    const svgText = buildExportSvg({ bg });
    if (!svgText) { notify("SVGの生成に失敗しました"); return; }
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
      // 白背景はキャンバスにも塗る（PNGは透過境界で滲まないように）
      if (bg === "white") { ctx.fillStyle = "#f8f6ef"; ctx.fillRect(0, 0, canvas.width, canvas.height); }
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      await new Promise(res => canvas.toBlob(b => {
        if (b) downloadBlob(`kagami-map@${scale}x.png`, b);
        res();
      }, "image/png"));
      notify(`PNGを保存しました (${scale}× / 背景: ${bgLabel(bg)})`);
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  const bgLabel = (bg) => bg === "theme" ? "テーマ" : bg === "transparent" ? "透過" : "白";

  const onExportJson = () => {
    downloadBlob("kagami-map.json", new Blob([JSON.stringify(map, null, 2)], { type: "application/json" }));
    notify("JSONを保存しました");
  };

  const onAutoConnect = () => {
    mutate(d => mapOps.autoConnect(d));
    notify("接続を自動生成しました");
  };

  const onFit = () => {
    window.__kagamiFit?.();
  };

  return (
    <div className="app-root">
      <Toolbar
        map={map} mutate={mutate} replace={replace}
        undo={undo} redo={redo} canUndo={canUndo} canRedo={canRedo}
        onExportSvg={() => setExportModal("svg")}
        onExportPng={() => setExportModal("png")}
        onExportJson={onExportJson}
        onReset={() => { if (confirm("マップを初期状態に戻します。よろしいですか？")) mutate(d => mapOps.clear(d)); }}
        onFit={onFit}
        onAutoConnect={onAutoConnect}
        notify={notify}
        showLabels={showLabels} setShowLabels={setShowLabels}
        showThumb={showThumb} setShowThumb={setShowThumb}
      />
      <MapCanvas
        map={map} selectedId={selectedId} setSelectedId={setSelectedId}
        mutate={mutate}
        showLabels={showLabels}
      />
      <Palette selectedKind={selectedKind} setSelectedKind={setSelectedKind} mutate={mutate} />
      <Inspector map={map} selectedId={selectedId} mutate={mutate} />
      {!showThumb && <style>{`.mini-map { display: none; }`}</style>}
      {notice && <div className="notice">{notice}</div>}
      <ExportDialog
        open={exportModal !== null}
        format={exportModal}
        onClose={() => setExportModal(null)}
        onConfirm={(opts) => {
          const fmt = exportModal;
          setExportModal(null);
          if (fmt === "svg") performExportSvg(opts);
          else if (fmt === "png") performExportPng(opts);
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
          <div><kbd>⌘/Ctrl</kbd>+<kbd>ホイール</kbd>: 拡縮</div>
          <div><kbd>⌘Z</kbd> / <kbd>⌘⇧Z</kbd>: 元に戻す/やり直し</div>
          <div><kbd>Del</kbd>: 選択マスを削除</div>
          <div><kbd>1</kbd>〜<kbd>9</kbd>: 選択マスの種別変更</div>
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

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
