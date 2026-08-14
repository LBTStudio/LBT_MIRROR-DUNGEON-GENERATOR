import assert from "node:assert/strict";
import { baseTree, buildSvg, layoutFor, normalize } from "../client/src/pages/Home";

const base = baseTree();
assert.equal(base.nodes.length, 6, "初期テンプレートは6地点");
assert.equal(base.edges.length, 8, "初期テンプレートは分岐・合流を含む8接続");

const byId = new Map(base.nodes.map((node) => [node.id, node]));
for (const [from, to] of base.edges) {
  assert.ok(byId.get(from)!.stage < byId.get(to)!.stage, "接続は必ず右方向へ進む");
}

const customTree = normalize({
  ...base,
  nodes: [...base.nodes, { id: "custom", stage: 2, kind: "custom", icon: "◆", label: "鍵の間", accent: "teal" }],
  edges: [...base.edges, ["battle", "custom"], ["custom", "boss"], ["boss", "start"]],
});
assert.equal(customTree.edges.some(([from, to]) => from === "boss" && to === "start"), false, "後戻り接続は読み込み時に除外する");
assert.equal(customTree.edges.some(([from, to]) => from === "battle" && to === "custom"), true, "任意ノードへの分岐は保持する");

const layout = layoutFor(customTree);
assert.ok(layout.width >= 820 && layout.height >= 420, "画像出力に必要なキャンバス寸法を確保する");
const svg = buildSvg(customTree);
assert.ok(svg.includes("◆"), "任意アイコンをSVGへ出力する");
assert.ok(svg.includes("marker"), "SVGに進行方向の矢印を含める");
assert.ok(svg.includes("<path"), "SVGに接続線を含める");

console.log("route-tree: すべての回帰試験に通過");
