/*
 * 鏡ダンジョン MAP アイコン一式（v2 / Wikiシルエット尊重版）
 * ---
 * 方針：
 *  - 未経験ユーザーが「見て何のマスか分かる」ことを最優先
 *  - Wikiで公開されている公式ゲームMAPアイコンの輪郭を尊重（剣・兜・八角+WARNING・三角+目・？・スロット・！）
 *  - 装飾は控えめに、モノクロ (ink) + アクセント1色で明快に
 *  - 通常戦闘は剣モチーフ（不変）
 * すべて viewBox="0 0 100 100"、単色トーンで統一
 */

const IconDefs = ({ id = "iconglow" }) => (
  <defs>
    <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="1.2" stdDeviation="1.0" floodColor="#000" floodOpacity="0.55" />
    </filter>
    <pattern id={`${id}-warntape`} width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(-14)">
      <rect width="12" height="12" fill="#f0d24b" />
      <path d="M -3 8 L 8 -3 M 4 15 L 15 4" stroke="#161318" strokeWidth="2.6" />
    </pattern>
  </defs>
);

/* ────────────────────────────────
   1. Origin — 起点  (門+○)
   Wiki: 台形ゲート内に中央円
   ──────────────────────────────── */
const IconOrigin = ({ ink = "#eae3d5", accent = "#d4a24b" }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <IconDefs id="ori" />
    <g filter="url(#ori-shadow)" strokeLinejoin="round" strokeLinecap="round">
      {/* 台形ゲート外郭 */}
      <path d="M 14 78 L 22 24 H 78 L 86 78 Z" fill="none" stroke={ink} strokeWidth="7" />
      <path d="M 14 78 L 22 24 H 78 L 86 78 Z" fill="none" stroke={ink} strokeWidth="3" />
      {/* 中央のカプセル型ノブ (Wikiの◯) */}
      <ellipse cx="50" cy="52" rx="18" ry="14" fill="none" stroke={ink} strokeWidth="5" />
      {/* 下部の水平帯 (Wikiの棚) */}
      <path d="M 26 66 H 74" stroke={ink} strokeWidth="5" strokeLinecap="round" />
      {/* アクセント: 中央の光点 */}
      <circle cx="50" cy="52" r="4" fill={accent} />
    </g>
  </svg>
);

/* ────────────────────────────────
   2. Skirmish — 通常戦闘 (剣 + スパーク)   ★モチーフ不変
   Wiki: 剣一振り + 上部の四芒スパーク
   ──────────────────────────────── */
const IconSkirmish = ({ ink = "#eae3d5", accent = "#d4a24b" }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <IconDefs id="sk" />
    <g filter="url(#sk-shadow)">
      {/* スパーク（Wiki踏襲、上部右） */}
      <path
        d="M 76 14 L 82 26 L 94 32 L 82 38 L 76 50 L 70 38 L 58 32 L 70 26 Z"
        fill={ink} stroke={ink} strokeWidth="2" strokeLinejoin="round"
      />
      {/* 剣本体：斜めの太い直刀 (Wiki同じ角度) */}
      <g fill={ink} stroke={ink} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
        {/* 刀身（太い菱形） */}
        <path d="M 24 88 L 30 82 L 74 38 L 68 32 L 24 76 Z" />
        {/* 鍔（横バー） */}
        <path d="M 58 26 L 78 46 L 74 50 L 54 30 Z" />
        {/* 柄尻 */}
        <path d="M 20 92 L 30 82" strokeWidth="4" />
      </g>
      {/* 刃のハイライト */}
      <path d="M 30 78 L 66 42" stroke="#0b0a0d" strokeWidth="2" strokeOpacity="0.4" />
    </g>
  </svg>
);

/* ────────────────────────────────
   3. Focused — 集中戦闘  (角付き兜)
   Wiki: 角二本 + 二つ目 + 顎  → シンプル明快に
   ──────────────────────────────── */
const IconFocused = ({ ink = "#eae3d5", accent = "#d4a24b" }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <IconDefs id="fo" />
    <g filter="url(#fo-shadow)">
      {/* 兜シルエット（角2本 + 頬面 + 顎） Wikiの輪郭を忠実に */}
      <path
        d="
          M 26 14 L 34 32
          L 26 44 L 30 82 L 44 86 L 50 84 L 56 86 L 70 82 L 74 44 L 66 32 L 74 14
          L 62 30 L 50 26 L 38 30 Z
        "
        fill="none" stroke={ink} strokeWidth="7" strokeLinejoin="round" strokeLinecap="round"
      />
      <path
        d="
          M 26 14 L 34 32
          L 26 44 L 30 82 L 44 86 L 50 84 L 56 86 L 70 82 L 74 44 L 66 32 L 74 14
          L 62 30 L 50 26 L 38 30 Z
        "
        fill="none" stroke={ink} strokeWidth="3" strokeLinejoin="round"
      />
      {/* 二つ目（Wiki同じ丸目） */}
      <circle cx="41" cy="54" r="4" fill={ink} />
      <circle cx="59" cy="54" r="4" fill={ink} />
      {/* 顎の水平線（Wikiの下部ライン） */}
      <path d="M 42 78 H 58" stroke={ink} strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

/* ────────────────────────────────
   4. Elite — 精鋭戦闘  (六角プレート + WARNING帯)
   Wiki: 六角の枠 + 周囲に!WARNING!テープ
   ──────────────────────────────── */
const IconElite = ({ ink = "#eae3d5", accent = "#c8443c", warn = "#f0d24b", variant = "full" }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <IconDefs id="el" />
    <g filter="url(#el-shadow)">
      {/* 背後のWARNINGテープ (Wikiの周囲テープ) — variant=quiet では省略 */}
      {variant !== "quiet" && (
        <g>
          <g transform="rotate(-30 50 50)">
            <rect x="-8" y="20" width="116" height="9" fill={warn} />
            <text x="50" y="27" textAnchor="middle" fontSize="9"
                  fontFamily="Impact, 'Bebas Neue', sans-serif" fontWeight="900"
                  fill="#161318" letterSpacing="0.5">!WARNING!!WARNING!</text>
          </g>
          <g transform="rotate(30 50 50)">
            <rect x="-8" y="71" width="116" height="9" fill={warn} />
            <text x="50" y="78" textAnchor="middle" fontSize="9"
                  fontFamily="Impact, 'Bebas Neue', sans-serif" fontWeight="900"
                  fill="#161318" letterSpacing="0.5">!WARNING!!WARNING!</text>
          </g>
        </g>
      )}
      {/* 前面 六角プレート (Wiki準拠) */}
      <path d="M 30 18 H 70 L 86 50 L 70 82 H 30 L 14 50 Z"
            fill="#0b0a0d" stroke={ink} strokeWidth="7" strokeLinejoin="round" />
      <path d="M 30 18 H 70 L 86 50 L 70 82 H 30 L 14 50 Z"
            fill="none" stroke={ink} strokeWidth="3" strokeLinejoin="round" />
      {/* 内部の等分線（Wikiのセグメント） */}
      <g stroke={ink} strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M 50 18 V 82" />
        <path d="M 30 18 L 50 50 L 70 18" />
        <path d="M 30 82 L 50 50 L 70 82" />
      </g>
    </g>
  </svg>
);

/* ────────────────────────────────
   5. Abnormality — 幻想体戦闘 (三角+目+小三角)
   Wiki: 大三角内に「二つ目 + 上の小三角 + 下部の二つ小三角」
   ──────────────────────────────── */
const IconAbnormality = ({ ink = "#eae3d5", accent = "#c8443c" }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <IconDefs id="ab" />
    <g filter="url(#ab-shadow)">
      {/* 大三角シルエット（Wiki準拠 : 頂角がやや尖った） */}
      <path d="M 50 10 L 88 86 H 12 Z"
            fill="none" stroke={ink} strokeWidth="7" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M 50 10 L 88 86 H 12 Z"
            fill="none" stroke={ink} strokeWidth="3" strokeLinejoin="round" />
      {/* 上部の小三角（Wikiの角） */}
      <path d="M 50 20 L 56 30 L 44 30 Z" fill={ink} />
      {/* 二つ目（Wiki同じ配置） */}
      <circle cx="42" cy="50" r="4" fill={ink} />
      <circle cx="58" cy="50" r="4" fill={ink} />
      {/* 下部の二つ小三角（Wikiの下部特徴） */}
      <path d="M 30 82 L 36 68 L 42 82 Z" fill="none" stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M 58 82 L 64 68 L 70 82 Z" fill="none" stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
    </g>
  </svg>
);

/* ────────────────────────────────
   6. Guardian — 強敵 (剣付き炎の輪)  ※既存アセットから継承しつつ調整
   ──────────────────────────────── */
const IconGuardian = ({ ink = "#eae3d5", accent = "#c8443c" }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <IconDefs id="gu" />
    <g filter="url(#gu-shadow)">
      {/* 炎の環 */}
      <path
        d="M 50 12 C 68 22 82 34 84 50 C 82 68 68 78 60 82
           C 66 70 62 60 54 56
           C 60 50 56 40 50 34
           C 44 40 40 50 46 56
           C 38 60 34 70 40 82
           C 32 78 18 68 16 50
           C 18 34 32 22 50 12 Z"
        fill={accent} stroke={ink} strokeWidth="3" strokeLinejoin="round"
      />
      {/* 中央: 剣 */}
      <g stroke={ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="#0b0a0d">
        <path d="M 50 26 L 54 30 V 66 L 50 74 L 46 66 V 30 Z" />
        <path d="M 38 38 H 62" strokeWidth="4" />
        <path d="M 50 74 V 84" />
      </g>
    </g>
  </svg>
);

/* ────────────────────────────────
   7. Event — イベント (?マーク、大きく明快)
   Wiki: 単純に大きな?、下に四角の点
   ──────────────────────────────── */
const IconEvent = ({ ink = "#eae3d5", accent = "#d4a24b" }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <IconDefs id="ev" />
    <g filter="url(#ev-shadow)">
      {/* ?本体（極太、Wikiの様に大きく） */}
      <path
        d="M 32 34
           C 32 20 44 12 54 14
           C 68 18 72 34 62 44
           L 52 54 V 66"
        fill="none" stroke={ink} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
      {/* ?の下ドット */}
      <rect x="45" y="76" width="14" height="14" rx="2" fill={ink} />
    </g>
  </svg>
);

/* ────────────────────────────────
   8. Supply — ショップ (3スロット筐体)
   Wiki: 台形筐体に上段3スロット + 下段3引出
   ──────────────────────────────── */
const IconSupply = ({ ink = "#eae3d5", accent = "#d4a24b" }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <IconDefs id="sp" />
    <g filter="url(#sp-shadow)">
      {/* 台形筐体 (Wiki準拠) */}
      <path d="M 12 82 L 20 26 H 80 L 88 82 Z"
            fill="none" stroke={ink} strokeWidth="7" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M 12 82 L 20 26 H 80 L 88 82 Z"
            fill="none" stroke={ink} strokeWidth="3" strokeLinejoin="round" />
      {/* 中央の水平仕切り */}
      <path d="M 16 58 H 84" stroke={ink} strokeWidth="3.5" strokeLinecap="round" />
      {/* 上段: 3スロット (Wikiの八角) */}
      <g stroke={ink} strokeWidth="3.5" fill="#0b0a0d" strokeLinejoin="round">
        <path d="M 26 34 L 32 30 H 38 L 44 34 V 50 L 38 54 H 32 L 26 50 Z" />
        <path d="M 44 34 L 50 30 H 56 L 62 34 V 50 L 56 54 H 50 L 44 50 Z" />
        <path d="M 62 34 L 68 30 H 74 L 80 34 V 50 L 74 54 H 68 L 62 50 Z" />
      </g>
      {/* 上段スロット内の点 */}
      <g fill={ink}>
        <circle cx="35" cy="42" r="2.5" />
        <circle cx="53" cy="42" r="2.5" />
        <circle cx="71" cy="42" r="2.5" />
      </g>
      {/* 下段: 3引出 */}
      <g stroke={ink} strokeWidth="2.5" fill="none">
        <rect x="24" y="64" width="16" height="10" rx="1.5" />
        <rect x="42" y="64" width="16" height="10" rx="1.5" />
        <rect x="60" y="64" width="16" height="10" rx="1.5" />
      </g>
      <g fill={ink}>
        <circle cx="32" cy="69" r="1.6" />
        <circle cx="50" cy="69" r="1.6" />
        <circle cx="68" cy="69" r="1.6" />
      </g>
    </g>
  </svg>
);

/* ────────────────────────────────
   9. Boss — ボス (三角+! + WARNING帯)
   Wiki: △の中に「！」+ 背後に警告テープ
   ──────────────────────────────── */
const IconBoss = ({ ink = "#eae3d5", accent = "#c8443c", warn = "#f0d24b", variant = "full" }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <IconDefs id="bs" />
    <g filter="url(#bs-shadow)">
      {/* 背後の警告テープ (Wikiと同じく斜めに複数) — variant=quiet では省略 */}
      {variant !== "quiet" && (
        <g>
          <g transform="rotate(-38 50 50)">
            <rect x="-10" y="18" width="120" height="9" fill={warn} />
            <text x="50" y="25" textAnchor="middle" fontSize="9"
                  fontFamily="Impact, 'Bebas Neue', sans-serif" fontWeight="900"
                  fill="#161318" letterSpacing="0.5">!WARNING!!WARNING!</text>
          </g>
          <g transform="rotate(38 50 50)">
            <rect x="-10" y="76" width="120" height="9" fill={warn} />
            <text x="50" y="83" textAnchor="middle" fontSize="9"
                  fontFamily="Impact, 'Bebas Neue', sans-serif" fontWeight="900"
                  fill="#161318" letterSpacing="0.5">!WARNING!!WARNING!</text>
          </g>
        </g>
      )}
      {/* 三角形（Wikiの角丸三角） */}
      <path d="M 50 10 Q 52 10 54 14 L 86 76 Q 88 82 82 84 H 18 Q 12 82 14 76 L 46 14 Q 48 10 50 10 Z"
            fill="#0b0a0d" stroke={ink} strokeWidth="7" strokeLinejoin="round" />
      <path d="M 50 10 Q 52 10 54 14 L 86 76 Q 88 82 82 84 H 18 Q 12 82 14 76 L 46 14 Q 48 10 50 10 Z"
            fill="none" stroke={ink} strokeWidth="3" strokeLinejoin="round" />
      {/* ! マーク */}
      <path d="M 50 32 V 62" stroke={ink} strokeWidth="10" strokeLinecap="round" />
      <circle cx="50" cy="74" r="5.5" fill={ink} />
    </g>
  </svg>
);

// kind → コンポーネント
const IconMap = {
  origin: IconOrigin,
  skirmish: IconSkirmish,
  focused: IconFocused,
  elite: IconElite,
  abnormality: IconAbnormality,
  guardian: IconGuardian,
  event: IconEvent,
  supply: IconSupply,
  boss: IconBoss,
};

Object.assign(window, {
  IconOrigin, IconSkirmish, IconFocused, IconElite, IconAbnormality,
  IconGuardian, IconEvent, IconSupply, IconBoss, IconMap, IconDefs,
});
