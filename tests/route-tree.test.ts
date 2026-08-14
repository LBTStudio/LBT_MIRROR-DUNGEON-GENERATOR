import assert from "node:assert/strict";
import { baseTree, buildSvg, changeNodeKind, createTreeHistory, defaultAccent, layoutFor, markerPaths, normalize, recordTreeChange, redoTreeHistory, undoTreeHistory } from "../client/src/pages/Home";

const base = baseTree();
assert.equal(base.nodes.length, 9, "初期ツリーは全主要種別を例示する9地点");
assert.equal(base.theme.background, "#07171b", "初期背景は青緑の暗部を基調にする");
assert.equal(base.theme.line, "#70d9df", "初期経路は青緑の実線を基調にする");
assert.equal(defaultAccent("guardian"), "ember", "終端警戒は朱赤の警戒色にする");
assert.equal(defaultAccent("elite"), "ember", "危険交戦は深紅の役割色にする");
for (const [kind, paths] of Object.entries(markerPaths)) assert.ok(paths.length >= 3, `${kind}は独自の測量記号を持つ`);
assert.ok(markerPaths.skirmish.some((path) => path.endsWith("Z")), "通常遭遇は対向する閉鎖測量枠を持つ");
assert.ok(markerPaths.anomaly.some((path) => path.includes("H -6")), "固有遭遇は分断された測量枠を持つ");
assert.ok(markerPaths.guardian.some((path) => path.includes("L 14 14")), "終端遭遇は交差する終端標を持つ");
const migratedTheme = normalize({ nodes: base.nodes, theme: { background: "#101720", line: "#6e8594", showLabels: false, iconSize: 27 } });
assert.equal(migratedTheme.theme.background, "#07171b", "旧標準背景は新しい青緑の地図テーマへ移行する");
assert.equal(migratedTheme.theme.line, "#70d9df", "旧標準経路色は新しい青緑の地図テーマへ移行する");
const danteMigratedTheme = normalize({ nodes: base.nodes, theme: { background: "#16090c", line: "#9c3142", showLabels: false, iconSize: 27 } });
assert.equal(danteMigratedTheme.theme.background, "#07171b", "直前の標準背景は地図テーマへ移行する");
assert.equal(danteMigratedTheme.theme.line, "#70d9df", "直前の標準経路色は地図テーマへ移行する");
assert.equal(base.edges.length, 16, "初期テンプレートは全主要種別を自動接続する16本の航路を生成する");

const byId = new Map(base.nodes.map((node) => [node.id, node]));
for (const [from, to] of base.edges) {
  assert.ok(byId.get(from)!.stage < byId.get(to)!.stage, "接続は必ず右方向へ進む");
  assert.equal(byId.get(to)!.stage, byId.get(from)!.stage + 1, "接続は隣り合う列だけを結ぶ");
}

const customTree = normalize({
  ...base,
  nodes: [...base.nodes, { id: "custom", stage: 2, kind: "custom", icon: "◆", label: "鍵の間", accent: "teal" }],
  edges: [["guardian", "origin"]],
});
assert.equal(customTree.edges.some(([from, to]) => from === "guardian" && to === "origin"), false, "保存済みの後戻り接続は採用しない");
assert.equal(customTree.edges.some(([from, to]) => from === "skirmish" && to === "custom"), true, "追加地点は前列の全地点から自動接続される");
assert.equal(customTree.edges.some(([from, to]) => from === "custom" && to === "supply"), true, "追加地点は次列の全地点へ自動接続される");

const legacyTree = normalize({
  nodes: [{ id: "start", stage: 0, kind: "start", label: "開始", accent: "teal" }, { id: "battle", stage: 1, kind: "battle", label: "戦闘", accent: "slate" }],
});
assert.equal(legacyTree.nodes.find((node) => node.id === "start")?.kind, "origin", "旧形式の開始地点を起点へ移行する");
assert.equal(legacyTree.nodes.find((node) => node.id === "battle")?.kind, "skirmish", "旧形式の戦闘地点を小規模交戦へ移行する");

const defaultNamedSkirmish = base.nodes.find((node) => node.id === "skirmish")!;
const switchedKind = changeNodeKind(defaultNamedSkirmish, "anomaly");
assert.equal(switchedKind.kind, "anomaly", "地点種別は一度の変更で更新する");
assert.equal(switchedKind.label, "変則点", "既定名称の地点は種別変更に合わせて名称も更新する");
const namedNode = changeNodeKind({ ...defaultNamedSkirmish, label: "見張り台" }, "focused");
assert.equal(namedNode.label, "見張り台", "利用者が入力した名称は種別変更で上書きしない");

const layout = layoutFor(customTree);
assert.ok(layout.width >= 820 && layout.height >= 420, "画像出力に必要なキャンバス寸法を確保する");
const svg = buildSvg(customTree);
assert.ok(svg.includes("◆"), "任意アイコンをSVGへ出力する");
assert.equal(svg.includes("marker"), false, "SVGは模倣的な矢印を使わない");
assert.ok(svg.includes("stroke-opacity=\".18\""), "SVGは青緑の二重航路線を含める");
assert.ok(svg.includes("<path"), "SVGに独自の航路と地点記号を含める");

const historyStart = createTreeHistory(base);
const historyOne = recordTreeChange(historyStart, { ...base, title: "一手目" });
const historyTwo = recordTreeChange(historyOne, { ...historyOne.present, title: "二手目" });
assert.equal(historyTwo.past.length, 2, "連続編集は履歴に記録する");
const undone = undoTreeHistory(historyTwo);
assert.equal(undone.present.title, "一手目", "Undoは直前の編集状態へ戻す");
const redone = redoTreeHistory(undone);
assert.equal(redone.present.title, "二手目", "Redoは取り消した編集を復元する");
const replacedAfterUndo = recordTreeChange(undone, { ...undone.present, title: "分岐後" });
assert.equal(replacedAfterUndo.future.length, 0, "Undo後の新規編集はRedo履歴を破棄する");

console.log("route-tree: 列ベースと編集履歴の回帰試験に通過");
