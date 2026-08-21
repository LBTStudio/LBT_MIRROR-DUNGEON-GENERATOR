(function registerKagamiAnimatedImageUtils(root, factory) {
  const api = factory();
  root.KagamiAnimatedImageUtils = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createKagamiAnimatedImageUtils() {
  const PNG_SIGNATURE = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
  const encoder = new TextEncoder();

  const concat = (parts) => {
    const length = parts.reduce((sum, part) => sum + part.length, 0);
    const output = new Uint8Array(length);
    let offset = 0;
    parts.forEach(part => { output.set(part, offset); offset += part.length; });
    return output;
  };
  const u16 = (value) => new Uint8Array([value & 255, (value >>> 8) & 255]);
  const u32 = (value) => new Uint8Array([(value >>> 24) & 255, (value >>> 16) & 255, (value >>> 8) & 255, value & 255]);
  const readU32 = (bytes, offset) => ((bytes[offset] << 24) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3]) >>> 0;

  const crcTable = (() => {
    const table = new Uint32Array(256);
    for (let index = 0; index < 256; index += 1) {
      let value = index;
      for (let bit = 0; bit < 8; bit += 1) value = value & 1 ? (value >>> 1) ^ 0xedb88320 : value >>> 1;
      table[index] = value >>> 0;
    }
    return table;
  })();
  const crc32 = (bytes) => {
    let value = 0xffffffff;
    for (let index = 0; index < bytes.length; index += 1) value = crcTable[(value ^ bytes[index]) & 255] ^ (value >>> 8);
    return (value ^ 0xffffffff) >>> 0;
  };
  const pngChunk = (type, data) => {
    const typeBytes = encoder.encode(type);
    return concat([u32(data.length), typeBytes, data, u32(crc32(concat([typeBytes, data]))) ]);
  };

  function quantize332(rgba) {
    const indexes = new Uint8Array(rgba.length / 4);
    for (let pixel = 0, offset = 0; offset < rgba.length; pixel += 1, offset += 4) {
      indexes[pixel] = ((rgba[offset] >> 5) << 5) | ((rgba[offset + 1] >> 5) << 2) | (rgba[offset + 2] >> 6);
    }
    return indexes;
  }
  function gifPalette332() {
    const palette = new Uint8Array(768);
    for (let index = 0; index < 256; index += 1) {
      palette[index * 3] = Math.round(((index >> 5) & 7) * 255 / 7);
      palette[index * 3 + 1] = Math.round(((index >> 2) & 7) * 255 / 7);
      palette[index * 3 + 2] = Math.round((index & 3) * 255 / 3);
    }
    return palette;
  }
  function lzwEncodeGif(indexes, minCodeSize = 8) {
    const clear = 1 << minCodeSize;
    const end = clear + 1;
    const bytes = [];
    let bitBuffer = 0;
    let bitCount = 0;
    let codeSize = minCodeSize + 1;
    let maxCode = (1 << codeSize) - 1;
    let nextCode = end + 1;
    let clearPending = false;
    let dictionary = new Map();
    const emit = (code) => {
      bitBuffer |= code << bitCount;
      bitCount += codeSize;
      while (bitCount >= 8) { bytes.push(bitBuffer & 255); bitBuffer >>>= 8; bitCount -= 8; }
      // GIF89a LZWは「辞書に次のコードを追加した後」ではなく、
      // 現在のコードを出力した直後の空き辞書番号で次のコード幅を決める。
      // この順序でブラウザ・Pillowなどの標準デコーダと一致する。
      if (nextCode > maxCode || clearPending) {
        if (clearPending) {
          codeSize = minCodeSize + 1;
          maxCode = (1 << codeSize) - 1;
          clearPending = false;
        } else if (codeSize < 12) {
          codeSize += 1;
          maxCode = codeSize === 12 ? (1 << codeSize) : (1 << codeSize) - 1;
        }
      }
    };
    const reset = () => { dictionary = new Map(); nextCode = end + 1; clearPending = true; };
    if (!indexes.length) {
      emit(clear);
      emit(end);
      if (bitCount > 0) bytes.push(bitBuffer & 255);
      return new Uint8Array(bytes);
    }
    emit(clear);
    let prefix = indexes[0];
    for (let index = 1; index < indexes.length; index += 1) {
      const value = indexes[index];
      const key = prefix * 256 + value;
      const hit = dictionary.get(key);
      if (hit !== undefined) { prefix = hit; continue; }
      emit(prefix);
      prefix = value;
      if (nextCode < 4096) {
        dictionary.set(key, nextCode);
        nextCode += 1;
      } else {
        reset();
        emit(clear);
      }
    }
    emit(prefix);
    emit(end);
    if (bitCount > 0) bytes.push(bitBuffer & 255);
    return new Uint8Array(bytes);
  }
  function gifSubBlocks(bytes) {
    const parts = [];
    for (let offset = 0; offset < bytes.length; offset += 255) {
      const block = bytes.slice(offset, offset + 255);
      parts.push(new Uint8Array([block.length]), block);
    }
    parts.push(new Uint8Array([0]));
    return parts;
  }
  function normalizedFrameDelays(frameCount, delayMs, frameDelaysMs) {
    if (Array.isArray(frameDelaysMs) && frameDelaysMs.length === frameCount) {
      return frameDelaysMs.map(delay => Math.max(1, Number(delay) || 1));
    }
    return Array.from({ length: frameCount }, () => Math.max(1, Number(delayMs) || 1));
  }
  function encodeGif(frames, { width, height, delayMs = 250, frameDelaysMs = null, loop = 0 } = {}) {
    if (!Array.isArray(frames) || !frames.length || !width || !height) throw new Error("GIFフレームを生成できませんでした");
    const expected = width * height * 4;
    if (frames.some(frame => !frame || frame.length !== expected)) throw new Error("GIFフレームの寸法が一致しません");
    const parts = [encoder.encode("GIF89a"), u16(width), u16(height), new Uint8Array([0xf7, 0, 0]), gifPalette332()];
    if (frames.length > 1) parts.push(new Uint8Array([0x21, 0xff, 0x0b]), encoder.encode("NETSCAPE2.0"), new Uint8Array([0x03, 0x01, loop & 255, (loop >>> 8) & 255, 0]));
    const frameDelays = normalizedFrameDelays(frames.length, delayMs, frameDelaysMs);
    frames.forEach((frame, index) => {
      const indexes = quantize332(frame);
      const compressed = lzwEncodeGif(indexes);
      const delay = Math.max(1, Math.round(frameDelays[index] / 10));
      parts.push(new Uint8Array([0x21, 0xf9, 0x04, 0x04, delay & 255, (delay >>> 8) & 255, 0, 0]));
      parts.push(new Uint8Array([0x2c]), u16(0), u16(0), u16(width), u16(height), new Uint8Array([0, 8]));
      parts.push(...gifSubBlocks(compressed));
    });
    parts.push(new Uint8Array([0x3b]));
    return new Blob([concat(parts)], { type: "image/gif" });
  }

  function parsePng(bytes) {
    if (bytes.length < PNG_SIGNATURE.length || PNG_SIGNATURE.some((value, index) => bytes[index] !== value)) throw new Error("PNGデータを読み取れませんでした");
    const chunks = [];
    let offset = PNG_SIGNATURE.length;
    while (offset + 12 <= bytes.length) {
      const length = readU32(bytes, offset);
      const type = new TextDecoder().decode(bytes.slice(offset + 4, offset + 8));
      const dataStart = offset + 8;
      const dataEnd = dataStart + length;
      if (dataEnd + 4 > bytes.length) throw new Error("PNGチャンクが壊れています");
      chunks.push({ type, data: bytes.slice(dataStart, dataEnd) });
      offset = dataEnd + 4;
      if (type === "IEND") break;
    }
    const ihdr = chunks.find(chunk => chunk.type === "IHDR");
    const idat = chunks.filter(chunk => chunk.type === "IDAT").map(chunk => chunk.data);
    if (!ihdr || !idat.length) throw new Error("PNG画像データがありません");
    return { ihdr: ihdr.data, idat, width: readU32(ihdr.data, 0), height: readU32(ihdr.data, 4) };
  }
  function frameControl(sequence, width, height, delayMs) {
    const delay = Math.max(1, Math.round(delayMs));
    return concat([u32(sequence), u32(width), u32(height), u32(0), u32(0), new Uint8Array([(delay >>> 8) & 255, delay & 255, 0x03, 0xe8, 0, 0])]);
  }
  async function encodeApng(pngBlobs, { delayMs = 250, frameDelaysMs = null, loop = 0 } = {}) {
    if (!Array.isArray(pngBlobs) || !pngBlobs.length) throw new Error("APNGフレームを生成できませんでした");
    const frames = await Promise.all(pngBlobs.map(async blob => parsePng(new Uint8Array(await blob.arrayBuffer()))));
    const { width, height } = frames[0];
    if (frames.some(frame => frame.width !== width || frame.height !== height)) throw new Error("APNGフレームの寸法が一致しません");
    const frameDelays = normalizedFrameDelays(frames.length, delayMs, frameDelaysMs);
    let sequence = 0;
    const parts = [PNG_SIGNATURE, pngChunk("IHDR", frames[0].ihdr), pngChunk("acTL", concat([u32(frames.length), u32(loop)])), pngChunk("fcTL", frameControl(sequence++, width, height, frameDelays[0]))];
    frames[0].idat.forEach(data => parts.push(pngChunk("IDAT", data)));
    frames.slice(1).forEach((frame, index) => {
      parts.push(pngChunk("fcTL", frameControl(sequence++, width, height, frameDelays[index + 1])));
      frame.idat.forEach(data => parts.push(pngChunk("fdAT", concat([u32(sequence++), data]))));
    });
    parts.push(pngChunk("IEND", new Uint8Array()));
    return new Blob([concat(parts)], { type: "image/png" });
  }

  return Object.freeze({ encodeGif, encodeApng, parsePng, quantize332 });
});
