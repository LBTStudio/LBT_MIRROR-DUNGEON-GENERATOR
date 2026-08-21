import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../site/combined.jsx", import.meta.url), "utf8");
const markup = readFileSync(new URL("../site/index.html", import.meta.url), "utf8");

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

test("GIF・APNGの滑らかさ選択はマップ見本と同じ0.75秒サイクルを維持する", () => {
  assert.match(source, /const ICON_IDLE_CYCLE_MS = 750/);
  assert.match(source, /fps: 4, label: "低 \(4fps\)"/);
  assert.match(source, /fps: 8, label: "中 \(8fps\)"/);
  assert.match(source, /fps: 12, label: "高 \(12fps\)"/);
  assert.match(source, /アニメーションのなめらかさ/);
  assert.match(source, /すべてマップ上の見本と同じ0\.75秒で1周します/);
  assert.match(source, /createIconAnimationFrameSchedule/);
  assert.match(source, /frameDelaysMs/);
  assert.match(source, /0\.75秒\/周/);
});

test("低FPSアイコンモードは種別別モーションを画面とGIF・APNG出力で共有する", () => {
  assert.match(source, /const ICON_IDLE_MOTIONS/);
  assert.match(source, /function getIconIdleMotion/);
  assert.match(source, /function getIconIdleMotionAt/);
  assert.match(source, /icon-idle icon-idle-\$\{node\.kind\}/);
  assert.match(source, /data-kind=\{node\.kind\}/);
  assert.match(source, /getIconIdleMotionAt\(kind, iconElapsedMs\)/);
  assert.match(markup, /icon-idle-skirmish/);
  assert.match(markup, /icon-idle-boss/);
  assert.match(markup, /prefers-reduced-motion: reduce/);
});

test("背景画像のアップロード直後はマップ領域へ収める倍率と中央配置を使う", () => {
  assert.match(source, /fitBackgroundToMap\(preparedBackground, layout\.width, layout\.height, \{ padding: 36 \}\)/);
  assert.match(source, /背景画像をマップ内に収めて配置しました/);
});

test("各マスの表示名は個別編集でき、空欄時は種類名をフォールバック表示する", () => {
  assert.match(source, /const getNodeDisplayLabel/);
  assert.match(source, /custom \|\| KIND_INDEX\[node\?\.kind\]\?\.label/);
  assert.match(source, /このマスの表示名/);
  assert.match(source, /placeholder=\{`\$\{kindDef\?\.label/);
  assert.match(source, /label: ""/);
  assert.match(source, /未入力なら現在の種類名を表示します/);
  assert.match(source, /\{displayLabel\}/);
});
