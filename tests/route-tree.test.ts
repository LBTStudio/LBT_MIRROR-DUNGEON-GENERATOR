import assert from "node:assert/strict";
import { baseTree, buildSvg, changeNodeKind, createTreeHistory, layoutFor, normalize, recordTreeChange, redoTreeHistory, undoTreeHistory } from "../client/src/pages/Home";

const base = baseTree();
assert.equal(base.nodes.length, 7, "初期テンプレートは7地点");
assert.equal(base.edges.length, 9, "初期テンプレートは列間の自動接続を9本生成する");

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
assert.equal(switchedKind.label, "特異事象", "既定名称の地点は種別変更に合わせて名称も更新する");
const namedNode = changeNodeKind({ ...defaultNamedSkirmish, label: "見張り台" }, "focused");
assert.equal(namedNode.label, "見張り台", "利用者が入力した名称は種別変更で上書きしない");

const layout = layoutFor(customTree);
assert.ok(layout.width >= 820 && layout.height >= 420, "画像出力に必要なキャンバス寸法を確保する");
const svg = buildSvg(customTree);
assert.ok(svg.includes("◆"), "任意アイコンをSVGへ出力する");
assert.ok(svg.includes("marker"), "SVGに進行方向の矢印を含める");
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
