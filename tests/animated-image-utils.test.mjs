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

const gifFrameDelays = async blob => {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const delays = [];
  for (let index = 0; index + 5 < bytes.length; index += 1) {
    if (bytes[index] === 0x21 && bytes[index + 1] === 0xf9 && bytes[index + 2] === 0x04) delays.push((bytes[index + 4] | (bytes[index + 5] << 8)) * 10);
  }
  return delays;
};

const apngFrameDelays = async blob => {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const delays = [];
  for (let offset = 8; offset + 12 <= bytes.length;) {
    const length = (bytes[offset] << 24) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3];
    const type = new TextDecoder().decode(bytes.slice(offset + 4, offset + 8));
    if (type === "fcTL") {
      const data = offset + 8;
      const numerator = (bytes[data + 20] << 8) | bytes[data + 21];
      const denominator = (bytes[data + 22] << 8) | bytes[data + 23];
      delays.push(Math.round(numerator * 1000 / denominator));
    }
    offset += 12 + length;
  }
  return delays;
};

const extractFirstGifLzw = bytes => {
  const hasGlobalPalette = (bytes[10] & 0x80) !== 0;
  let offset = 13 + (hasGlobalPalette ? 3 * (1 << ((bytes[10] & 7) + 1)) : 0);
  while (bytes[offset] !== 0x2c) {
    if (bytes[offset] !== 0x21) throw new Error("GIF image descriptor not found");
    offset += 2;
    while (bytes[offset]) offset += 1 + bytes[offset];
    offset += 1;
  }
  const width = bytes[offset + 5] | (bytes[offset + 6] << 8);
  const height = bytes[offset + 7] | (bytes[offset + 8] << 8);
  const minCodeSize = bytes[offset + 10];
  offset += 11;
  const packed = [];
  while (bytes[offset]) {
    const size = bytes[offset++];
    packed.push(...bytes.slice(offset, offset + size));
    offset += size;
  }
  return { width, height, minCodeSize, packed: new Uint8Array(packed) };
};

const decodeGifIndexes = ({ minCodeSize, packed }) => {
  const clear = 1 << minCodeSize;
  const end = clear + 1;
  let bitOffset = 0;
  let codeSize = minCodeSize + 1;
  let nextCode = end + 1;
  const prefix = new Int16Array(4096).fill(-1);
  const suffix = new Uint8Array(4096);
  const readCode = () => {
    let value = 0;
    for (let bit = 0; bit < codeSize; bit += 1) {
      const byteIndex = (bitOffset + bit) >> 3;
      if (byteIndex >= packed.length) return -1;
      value |= ((packed[byteIndex] >> ((bitOffset + bit) & 7)) & 1) << bit;
    }
    bitOffset += codeSize;
    return value;
  };
  const expand = code => {
    const values = [];
    let current = code;
    while (current > end) { values.push(suffix[current]); current = prefix[current]; }
    values.push(current);
    return values.reverse();
  };
  const output = [];
  let previous = -1;
  while (true) {
    const code = readCode();
    if (code < 0 || code === end) break;
    if (code === clear) { codeSize = minCodeSize + 1; nextCode = end + 1; previous = -1; continue; }
    const values = code < nextCode ? expand(code) : (code === nextCode && previous >= 0 ? [...expand(previous), expand(previous)[0]] : null);
    if (!values) throw new Error("GIF LZW stream is invalid");
    output.push(...values);
    if (previous >= 0 && nextCode < 4096) {
      prefix[nextCode] = previous;
      suffix[nextCode] = values[0];
      nextCode += 1;
      if (nextCode === (1 << codeSize) && codeSize < 12) codeSize += 1;
    }
    previous = code;
  }
  return output;
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

test("GIF LZWはコードサイズ拡張をまたぐ大画像でも全ピクセルを復元できる", async () => {
  const width = 33000;
  const frame = new Uint8Array(width * 4);
  for (let index = 0; index < width; index += 1) {
    frame[index * 4] = 48;
    frame[index * 4 + 1] = 96;
    frame[index * 4 + 2] = 192;
    frame[index * 4 + 3] = 255;
  }
  const bytes = new Uint8Array(await api.encodeGif([frame], { width, height: 1, delayMs: 250 }).arrayBuffer());
  const stream = extractFirstGifLzw(bytes);
  assert.equal(stream.width * stream.height, width);
  assert.equal(decodeGifIndexes(stream).length, width);
});

test("GIFのフレーム遅延はGIF89aの1/100秒単位でFPS段階を保存する", async () => {
  const frame = new Uint8Array([255, 0, 0, 255]);
  for (const [delayMs, expectedCentiseconds] of [[250, 25], [125, 13], [83, 8]]) {
    const bytes = new Uint8Array(await api.encodeGif([frame, frame], { width: 1, height: 1, delayMs }).arrayBuffer());
    const gce = bytes.findIndex((value, index) => value === 0x21 && bytes[index + 1] === 0xf9);
    assert.equal(bytes[gce + 4] | (bytes[gce + 5] << 8), expectedCentiseconds);
  }
});

test("GIFはフレームごとの遅延を保持して0.75秒のサイクルを正確に保存する", async () => {
  const frame = new Uint8Array([255, 0, 0, 255]);
  const blob = api.encodeGif(Array.from({ length: 9 }, () => frame), {
    width: 1, height: 1, frameDelaysMs: [80, 90, 80, 80, 90, 80, 80, 90, 80],
  });
  const delays = await gifFrameDelays(blob);
  assert.deepEqual(delays, [80, 90, 80, 80, 90, 80, 80, 90, 80]);
  assert.equal(delays.reduce((sum, delay) => sum + delay, 0), 750);
});

test("APNGはacTL・fcTL・fdATチャンクを持つ複数フレームPNGとして出力する", async () => {
  const blob = await api.encodeApng([onePixelPng([255, 0, 0, 255]), onePixelPng([0, 0, 255, 255])], { delayMs: 250 });
  const types = await chunkTypes(blob);
  assert.equal(blob.type, "image/png");
  assert.deepEqual(types.slice(0, 3), ["IHDR", "acTL", "fcTL"]);
  assert.ok(types.includes("fdAT"));
  assert.equal(types.at(-1), "IEND");
});

test("APNGはフレームごとの遅延を保持して0.75秒のサイクルを正確に保存する", async () => {
  const frames = Array.from({ length: 6 }, () => onePixelPng([255, 0, 0, 255]));
  const blob = await api.encodeApng(frames, { frameDelaysMs: [130, 120, 130, 120, 130, 120] });
  const delays = await apngFrameDelays(blob);
  assert.deepEqual(delays, [130, 120, 130, 120, 130, 120]);
  assert.equal(delays.reduce((sum, delay) => sum + delay, 0), 750);
});
