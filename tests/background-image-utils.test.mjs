import test from "node:test";
import assert from "node:assert/strict";
import utils from "../site/background-image-utils.js";

const dataUrl = `data:image/webp;base64,${"A".repeat(64)}`;

test("背景未設定は安全な初期状態に正規化される", () => {
  assert.deepEqual(utils.normalizeBackground(null), utils.createBackground());
});

test("背景設定は保存可能な画像と調整値だけを維持する", () => {
  const background = utils.normalizeBackground({
    enabled: true,
    dataUrl,
    name: "route.webp",
    width: 1600,
    height: 900,
    x: 240,
    y: -120,
    scale: 1.75,
    scaleX: 1.4,
    scaleY: 2.1,
    opacity: 0.55,
  });
  assert.equal(background.enabled, true);
  assert.equal(background.name, "route.webp");
  assert.equal(background.width, 1600);
  assert.equal(background.height, 900);
  assert.equal(background.x, 240);
  assert.equal(background.y, -120);
  assert.equal(background.scale, 1.75);
  assert.equal(background.scaleX, 1.4);
  assert.equal(background.scaleY, 2.1);
  assert.equal(background.opacity, 0.55);
});

test("旧保存の倍率は自由変形の横軸・縦軸へ同じ値で補完される", () => {
  const background = utils.normalizeBackground({ enabled: true, dataUrl, width: 300, height: 200, scale: 1.6 });
  assert.equal(background.scale, 1.6);
  assert.equal(background.scaleX, 1.6);
  assert.equal(background.scaleY, 1.6);
});

test("巨大または不正な背景データは読込時に無効化される", () => {
  const tooLarge = `data:image/png;base64,${"A".repeat(utils.MAX_DATA_URL_LENGTH)}`;
  const background = utils.normalizeBackground({ enabled: true, dataUrl: tooLarge, width: 300, height: 200 });
  assert.equal(background.enabled, false);
  assert.equal(background.dataUrl, "");
  assert.equal(background.width, 0);
});

test("背景変形の初期化は画像を残して位置・倍率・不透明度を既定値に戻す", () => {
  const reset = utils.resetBackgroundTransform({
    enabled: true, dataUrl, width: 300, height: 200, x: 220, y: -120, scale: 3.2, opacity: 0.8,
  });
  assert.equal(reset.enabled, true);
  assert.equal(reset.x, 0);
  assert.equal(reset.y, 0);
  assert.equal(reset.scale, 1);
  assert.equal(reset.scaleX, 1);
  assert.equal(reset.scaleY, 1);
  assert.equal(reset.opacity, 0.38);
});

test("背景初期フィットはマップの余白内へ画像全体を中央配置する", () => {
  const fitted = utils.fitBackgroundToMap({ enabled: true, dataUrl, width: 1600, height: 900, x: 400, y: -180, scale: 1.8 }, 1000, 600, { padding: 30 });
  assert.equal(fitted.x, 0);
  assert.equal(fitted.y, 0);
  assert.equal(fitted.scale, fitted.scaleX);
  assert.equal(fitted.scale, fitted.scaleY);
  assert.ok(fitted.width * fitted.scaleX <= 940);
  assert.ok(fitted.height * fitted.scaleY <= 540);
});

test("非対応形式の画像は変換前に拒否される", async () => {
  await assert.rejects(
    () => utils.prepareBackgroundImage({ type: "image/bmp", size: 100 }),
    /PNG・JPEG・WebP・GIF・APNG形式/
  );
});

test("GIF・APNGは背景画像の対応形式として許可される", () => {
  assert.equal(utils.SUPPORTED_IMAGE_TYPES.has("image/gif"), true);
  assert.equal(utils.SUPPORTED_IMAGE_TYPES.has("image/apng"), true);
});

test("上限を超える画像は変換前に拒否される", async () => {
  await assert.rejects(
    () => utils.prepareBackgroundImage({ type: "image/png", size: utils.MAX_SOURCE_BYTES + 1 }),
    /12MB以下/
  );
});
