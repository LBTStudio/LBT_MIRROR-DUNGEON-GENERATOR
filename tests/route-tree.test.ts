import assert from "node:assert/strict";
import { baseTree, buildSvg, layoutFor, normalize } from "../client/src/pages/Home";

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

const layout = layoutFor(customTree);
assert.ok(layout.width >= 820 && layout.height >= 420, "画像出力に必要なキャンバス寸法を確保する");
const svg = buildSvg(customTree);
assert.ok(svg.includes("◆"), "任意アイコンをSVGへ出力する");
assert.ok(svg.includes("marker"), "SVGに進行方向の矢印を含める");
assert.ok(svg.includes("<path"), "SVGに独自の航路と地点記号を含める");

console.log("route-tree: 列ベースの回帰試験に通過");
