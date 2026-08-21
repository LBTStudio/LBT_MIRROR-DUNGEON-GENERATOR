(function registerKagamiBackgroundUtils(root, factory) {
  const api = factory(root);
  root.KagamiBackgroundUtils = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createKagamiBackgroundUtils(root) {
  const SUPPORTED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/apng"]);
  const MAX_SOURCE_BYTES = 12 * 1024 * 1024;
  const MAX_DATA_URL_LENGTH = 1_650_000;
  const MAX_IMAGE_SIDE = 1920;
  const MIN_SCALE = 0.25;
  const MAX_SCALE = 4;
  const MIN_OPACITY = 0.08;
  const MAX_OPACITY = 1;

  const clamp = (value, min, max, fallback) => {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.min(max, Math.max(min, number));
  };

  function createBackground() {
    return {
      enabled: false,
      dataUrl: "",
      name: "",
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      scale: 1,
      scaleX: 1,
      scaleY: 1,
      opacity: 0.38,
    };
  }

  function isSupportedDataUrl(value) {
    return typeof value === "string" && value.length <= MAX_DATA_URL_LENGTH && /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(value);
  }

  function normalizeBackground(input) {
    const fallback = createBackground();
    if (!input || typeof input !== "object") return fallback;
    const dataUrl = isSupportedDataUrl(input.dataUrl) ? input.dataUrl : "";
    const width = Math.round(clamp(input.width, 1, MAX_IMAGE_SIDE, 0));
    const height = Math.round(clamp(input.height, 1, MAX_IMAGE_SIDE, 0));
    const hasImage = Boolean(dataUrl && width && height);
    const scale = clamp(input.scale, MIN_SCALE, MAX_SCALE, 1);
    return {
      enabled: hasImage && Boolean(input.enabled),
      dataUrl: hasImage ? dataUrl : "",
      name: hasImage ? String(input.name ?? "背景画像").slice(0, 120) : "",
      width: hasImage ? width : 0,
      height: hasImage ? height : 0,
      x: clamp(input.x, -12000, 12000, 0),
      y: clamp(input.y, -12000, 12000, 0),
      scale,
      scaleX: clamp(input.scaleX, MIN_SCALE, MAX_SCALE, scale),
      scaleY: clamp(input.scaleY, MIN_SCALE, MAX_SCALE, scale),
      opacity: clamp(input.opacity, MIN_OPACITY, MAX_OPACITY, fallback.opacity),
    };
  }

  function fitBackgroundToMap(input, mapWidth, mapHeight, options = {}) {
    const background = normalizeBackground(input);
    const width = Number(mapWidth);
    const height = Number(mapHeight);
    if (!background.enabled || !Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return background;
    const requestedPadding = Number(options.padding);
    const maximumPadding = Math.max(0, Math.min(width, height) / 2 - 1);
    const padding = Number.isFinite(requestedPadding) ? Math.min(maximumPadding, Math.max(0, requestedPadding)) : 0;
    const availableWidth = Math.max(1, width - padding * 2);
    const availableHeight = Math.max(1, height - padding * 2);
    const scale = clamp(Math.min(availableWidth / background.width, availableHeight / background.height), MIN_SCALE, MAX_SCALE, MIN_SCALE);
    return normalizeBackground({ ...background, x: 0, y: 0, scale, scaleX: scale, scaleY: scale });
  }

  function resetBackgroundTransform(background) {
    return { ...normalizeBackground(background), x: 0, y: 0, scale: 1, scaleX: 1, scaleY: 1, opacity: 0.38 };
  }

  async function prepareBackgroundImage(file) {
    if (!file || !SUPPORTED_IMAGE_TYPES.has(file.type)) {
      throw new Error("PNG・JPEG・WebP・GIF・APNG形式の画像を選択してください");
    }
    if (file.size > MAX_SOURCE_BYTES) {
      throw new Error("画像は12MB以下を選択してください");
    }
    if (!root.document || !root.Image || !root.URL) {
      throw new Error("この環境では画像を準備できません");
    }

    const objectUrl = root.URL.createObjectURL(file);
    const image = new root.Image();
    try {
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = () => reject(new Error("画像を読み込めませんでした"));
        image.src = objectUrl;
      });
      if (!image.naturalWidth || !image.naturalHeight) throw new Error("画像の大きさを取得できませんでした");

      const originalScale = Math.min(1, MAX_IMAGE_SIDE / Math.max(image.naturalWidth, image.naturalHeight));
      let renderScale = originalScale;
      let quality = 0.9;
      let dataUrl = "";
      let width = 0;
      let height = 0;

      for (let attempt = 0; attempt < 10; attempt += 1) {
        width = Math.max(1, Math.round(image.naturalWidth * renderScale));
        height = Math.max(1, Math.round(image.naturalHeight * renderScale));
        const canvas = root.document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d", { alpha: true });
        if (!context) throw new Error("画像の変換を開始できませんでした");
        context.drawImage(image, 0, 0, width, height);
        dataUrl = canvas.toDataURL("image/webp", quality);
        if (!dataUrl.startsWith("data:image/webp")) dataUrl = canvas.toDataURL("image/jpeg", quality);
        if (dataUrl.length <= MAX_DATA_URL_LENGTH) break;
        if (quality > 0.58) quality -= 0.08;
        else renderScale *= 0.82;
      }
      if (!isSupportedDataUrl(dataUrl)) {
        throw new Error("画像を保存可能な大きさまで圧縮できませんでした");
      }
      return normalizeBackground({
        enabled: true,
        dataUrl,
        name: String(file.name || "背景画像").slice(0, 120),
        width,
        height,
      });
    } finally {
      root.URL.revokeObjectURL(objectUrl);
    }
  }

  return Object.freeze({
    SUPPORTED_IMAGE_TYPES,
    MAX_SOURCE_BYTES,
    MAX_DATA_URL_LENGTH,
    MAX_IMAGE_SIDE,
    createBackground,
    normalizeBackground,
    fitBackgroundToMap,
    resetBackgroundTransform,
    prepareBackgroundImage,
  });
});
