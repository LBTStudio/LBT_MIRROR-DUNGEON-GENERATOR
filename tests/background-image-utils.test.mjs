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
    opacity: 0.55,
  });
  assert.equal(background.enabled, true);
  assert.equal(background.name, "route.webp");
  assert.equal(background.width, 1600);
  assert.equal(background.height, 900);
  assert.equal(background.x, 240);
  assert.equal(background.y, -120);
  assert.equal(background.scale, 1.75);
  assert.equal(background.opacity, 0.55);
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
  assert.equal(reset.opacity, 0.38);
});

test("非対応形式の画像は変換前に拒否される", async () => {
  await assert.rejects(
    () => utils.prepareBackgroundImage({ type: "image/gif", size: 100 }),
    /PNG・JPEG・WebP形式/
  );
});

test("上限を超える画像は変換前に拒否される", async () => {
  await assert.rejects(
    () => utils.prepareBackgroundImage({ type: "image/png", size: utils.MAX_SOURCE_BYTES + 1 }),
    /12MB以下/
  );
});
