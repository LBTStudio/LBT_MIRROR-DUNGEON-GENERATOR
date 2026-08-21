import assert from "node:assert/strict";
import test from "node:test";
import { deflateSync } from "node:zlib";

const utils = await import("../site/animated-image-utils.js");
const api = utils.default ?? globalThis.KagamiAnimatedImageUtils ?? utils;

const signature = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
const text = new TextEncoder();
const u32 = value => new Uint8Array([(value >>> 24) & 255, (value >>> 16) & 255, (value >>> 8) & 255, value & 255]);
const concat = parts => {
  const output = new Uint8Array(parts.reduce((size, part) => size + part.length, 0));
  let offset = 0;
  parts.forEach(part => { output.set(part, offset); offset += part.length; });
  return output;
};
const chunk = (type, data) => concat([u32(data.length), text.encode(type), data, new Uint8Array(4)]);
const onePixelPng = rgba => {
  const ihdr = new Uint8Array([0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0]);
  const idat = new Uint8Array(deflateSync(new Uint8Array([0, ...rgba])));
  return new Blob([concat([signature, chunk("IHDR", ihdr), chunk("IDAT", idat), chunk("IEND", new Uint8Array())])], { type: "image/png" });
};
const chunkTypes = async blob => {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const types = [];
  for (let offset = 8; offset + 12 <= bytes.length;) {
    const length = (bytes[offset] << 24) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3];
    types.push(new TextDecoder().decode(bytes.slice(offset + 4, offset + 8)));
    offset += 12 + length;
  }
  return types;
};

test("GIFはGIF89aヘッダーと複数フレームの制御ブロックを出力する", async () => {
  const frameA = new Uint8Array([255, 0, 0, 255, 0, 255, 0, 255]);
  const frameB = new Uint8Array([0, 0, 255, 255, 255, 255, 0, 255]);
  const blob = api.encodeGif([frameA, frameB], { width: 2, height: 1, delayMs: 250 });
  const bytes = new Uint8Array(await blob.arrayBuffer());
  assert.equal(new TextDecoder().decode(bytes.slice(0, 6)), "GIF89a");
  assert.equal(blob.type, "image/gif");
  assert.equal([...bytes].filter((value, index) => value === 0x2c && index > 12).length, 2);
});

test("APNGはacTL・fcTL・fdATチャンクを持つ複数フレームPNGとして出力する", async () => {
  const blob = await api.encodeApng([onePixelPng([255, 0, 0, 255]), onePixelPng([0, 0, 255, 255])], { delayMs: 250 });
  const types = await chunkTypes(blob);
  assert.equal(blob.type, "image/png");
  assert.deepEqual(types.slice(0, 3), ["IHDR", "acTL", "fcTL"]);
  assert.ok(types.includes("fdAT"));
  assert.equal(types.at(-1), "IEND");
});
