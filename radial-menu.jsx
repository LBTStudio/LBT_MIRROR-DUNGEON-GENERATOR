/* RadialKindMenu — pie/wheel menu for changing a waypoint's kind directly on
   the map. Opens around the clicked node, closes on outside-click / ESC.
   The centre hub doubles as a "無効化" (deactivate slot) action. */

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

  // entrance is fixed at the start-slot, so it never appears in the picker
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

      {/* central hub — deactivate/close */}
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
