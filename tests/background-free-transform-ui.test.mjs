import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../site/combined.jsx", import.meta.url), "utf8");

test("背景調整モードは枠内移動と角・辺の自由変形ハンドルを持つ", () => {
  assert.match(source, /data-role="background-transform-frame"/);
  assert.match(source, /backgroundFrameHandleSpecs/);
  assert.match(source, /beginBackgroundFrameTransform/);
  assert.match(source, /commitBackgroundFrameTransform/);
});

test("背景の均等倍率操作は自由変形の横軸・縦軸を同じ比率で更新する", () => {
  assert.match(source, /updateUniformBackgroundScale/);
  assert.match(source, /scaleX: scale, scaleY: scale/);
});

test("モバイル自由変形は枠を画面内へ収める補正と十分なタップ領域を持つ", () => {
  assert.match(source, /backgroundHandleHitSize = compactBackgroundTransform \? 84 : 20/);
  assert.match(source, /svgRect = svgRef\.current\?\.getBoundingClientRect/);
  assert.match(source, /x: viewRef\.current\.x \+ dx/);
});

test("低FPSアイコンモードとGIF・APNG保存入口を持つ", () => {
  assert.match(source, /iconAnimation: false/);
  assert.match(source, /アイコンを低FPSアニメ調にする/);
  assert.match(source, /onExportGif/);
  assert.match(source, /onExportApng/);
  assert.match(source, /encodeGif\(/);
  assert.match(source, /encodeApng\(/);
});
