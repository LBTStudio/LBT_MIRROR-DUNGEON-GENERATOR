/* 状態管理: reducer + localStorage、履歴（undo/redo） */

const STORAGE_KEY = "kagami-map-studio.v2";
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
      showLabels: true,
      iconSize: 44,
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
      showLabels: input.theme?.showLabels === undefined ? true : Boolean(input.theme.showLabels),
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
  /*
   * 自動接続：Limbus 実際MAP の観察に基づいた法則で
   * 隣接列間のエッジを再生成する。
   *  - 各列の全ノードを row 順に整列
   *  - 各ノード n(row=r) は "位置的に近い" 次列ノードに最大2本接続
   *  - 全ての次列ノードは最低1本のインを持つ（孤島禁止）
   */
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
      const norm = (arr) => arr.map((_, i) => arr.length > 1 ? i / (arr.length - 1) : 0.5);
      const curPos = norm(cur), nxtPos = norm(nxt);
      cur.forEach((n, i) => {
        const dists = nxt.map((m, j) => ({ j, d: Math.abs(curPos[i] - nxtPos[j]) }));
        dists.sort((a, b) => a.d - b.d);
        const targets = dists.slice(0, Math.min(2, nxt.length));
        targets.forEach(t => {
          const m = nxt[t.j];
          if (!map.edges.some(e => e.from === n.id && e.to === m.id)) {
            map.edges.push({ from: n.id, to: m.id, style: "normal" });
          }
        });
      });
      // 孤島チェック
      nxt.forEach((m, j) => {
        if (!map.edges.some(e => e.to === m.id && cur.some(c => c.id === e.from))) {
          const dists = cur.map((n, i) => ({ i, d: Math.abs(curPos[i] - nxtPos[j]) }));
          dists.sort((a, b) => a.d - b.d);
          const n = cur[dists[0].i];
          map.edges.push({ from: n.id, to: m.id, style: "normal" });
        }
      });
    }
  },
  /* 接続候補: 隣接列のノードで、まだ接続していないもの */
  candidates(map, fromId) {
    const from = map.nodes.find(n => n.id === fromId);
    if (!from) return [];
    const targets = map.nodes.filter(n => n.stage === from.stage + 1);
    const existing = new Set(map.edges.filter(e => e.from === fromId).map(e => e.to));
    return targets.filter(t => !existing.has(t.id));
  },
};

Object.assign(window, { useMapHistory, mapOps, baseMap, normalizeMap, uuid, MAX_COLUMNS, MAX_NODES_PER_COLUMN });
