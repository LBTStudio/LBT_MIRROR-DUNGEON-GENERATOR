# LBT_MIRROR-DUNGEON-GENERATOR

**LBT_MIRROR-DUNGEON-GENERATOR** は、Limbus Company の鏡ダンジョンを想起させる**一方向ルート図**を、ブラウザだけで作成／編集し、SVG または PNG として書き出せる**静的な Web ツール**です。サーバー処理は不要で、GitHub Pages に置けばそのまま公開URLとして共有できます。

> 本ツールは Limbus Company の画像素材・ロゴ・独自書体は使用していません。地点種別（開始／通常戦闘／強敵／危険戦闘／イベント／ショップ／ボス）の**機能的な分類**と、**ソシャゲとして読み取りやすい抽象的ピクトグラム**のみを参照しています。

---

## 主な機能

- 左→右への一方向ルート。上端・下端は隣接する段のみに接続、真ん中だけ 3 分岐（鏡ダンジョンの接続ルール準拠）
- 7 種の地点：**開始 / 通常戦闘 / 強敵 / 危険戦闘 / イベント / ショップ / ボス**
- 地点をクリックすると円形メニューが開き、種別を即座に切り替え可能
- **マウスホイールでズーム**（他操作と競合しない、キャンバス上のみ）／ドラッグでパン
- 列数の増減、Undo / Redo、`Ctrl+Z` / `Ctrl+Shift+Z` 対応
- 設定を JSON として書き出し・読み込み。作業中の内容は自動的に `localStorage` に保存
- 完成したマップを **SVG または PNG**（透過背景オプション付き）で保存

---

## ローカルで動かす

このリポジトリは**ビルド不要**の素の HTML／JSX 構成です。CDN 経由の React と Babel をブラウザ上で読み込みます。

### 方法A: 直接ダブルクリック

`LBT_MIRROR-DUNGEON-GENERATOR.html` をそのままブラウザで開くだけです（`file://` プロトコル）。ただしブラウザ設定によってはローカルファイルの読み込みが制限されることがあります。

### 方法B: 簡易サーバー（推奨）

任意の静的サーバーで配信します。

```bash
# Python 3 が入っていれば最速
python -m http.server 8000

# Node.js 派の方
npx --yes serve .
```

ブラウザで <http://localhost:8000/LBT_MIRROR-DUNGEON-GENERATOR.html> を開いてください。

---

## GitHub 上に公開する（推奨手順）

Web ツールとして URL アクセスできるようにする最も簡単な方法は **GitHub Pages** です。

### 1. 新しいリポジトリを作成

GitHub で `LBT_MIRROR-DUNGEON-GENERATOR` などの名前で公開リポジトリを作ります。

### 2. ファイルを追加

このプロジェクトの以下のファイルをリポジトリ直下に置きます。

```
LBT_MIRROR-DUNGEON-GENERATOR.html
app.jsx
icons.jsx
radial-menu.jsx
style.css
README.md
```

### 3. `index.html` を用意（任意）

GitHub Pages はデフォルトで `index.html` を探しに行きます。ルートで直接開けるようにするなら、以下のいずれかを実施してください。

- `LBT_MIRROR-DUNGEON-GENERATOR.html` を `index.html` にリネームする
- または、次の内容のリダイレクト用 `index.html` を追加する

```html
<!doctype html>
<meta http-equiv="refresh" content="0; url=./LBT_MIRROR-DUNGEON-GENERATOR.html">
```

### 4. GitHub Pages を有効化

リポジトリの **Settings → Pages** を開き、

- **Source**: `Deploy from a branch`
- **Branch**: `main` / `root`

を選んで保存します。数十秒後に `https://<ユーザー名>.github.io/<リポジトリ名>/` で公開されます。

### 5. 使ってもらう

上記の公開 URL を配布するだけで、閲覧者はインストール不要で使えます。

---

## ファイル構成

| ファイル | 役割 |
| --- | --- |
| `LBT_MIRROR-DUNGEON-GENERATOR.html` | エントリー HTML。React / Babel の CDN を読み込み、`app.jsx` を起動 |
| `app.jsx` | データモデル・レイアウト・キャンバス・履歴・書き出し処理 |
| `icons.jsx` | 7 種の地点アイコンおよびフレーム SVG |
| `radial-menu.jsx` | 地点クリック時に開く円形メニュー |
| `style.css` | 鏡ダンジョン風の配色・レイアウト |
| `backup_prev/` | 前バージョン（参照用） |

---

## 操作ガイド

| 操作 | 効果 |
| --- | --- |
| キャンバス上でドラッグ | パン（画面移動） |
| キャンバス上でホイール | ズームイン／アウト |
| 地点クリック | 円形メニューを開き、種別を選択 |
| 空きスロット（＋）をクリック | その位置を有効化 |
| 円形メニュー中央「この地点を無効化」 | その地点をスロットから外す |
| 左レール「列数」 | ルートの長さを 2〜11 の範囲で変更 |
| `Ctrl / Cmd + Z` | 直前の編集を取り消す |
| `Ctrl / Cmd + Shift + Z` / `Ctrl + Y` | やり直す |

---

## 接続ルール

各列は最大 3 スロット（上・中・下）。次の列への接続は以下のとおり自動で描かれます。

- **上端（スロット 0）** → 次列の 上・中
- **真ん中（スロット 1）** → 次列の 上・中・下（3 分岐）
- **下端（スロット 2）** → 次列の 中・下

無効化されたスロットは接続に含まれません。

---

## ライセンス

このリポジトリ内のコードは MIT License で公開します。UI のカラーパレット・独自ピクトグラム・レイアウトはすべてこのリポジトリ用にオリジナルで作成した素材です。Limbus Company の画面素材・書体・ロゴは含まれません。
