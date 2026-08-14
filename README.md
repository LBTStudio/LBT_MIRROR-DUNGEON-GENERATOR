# ORBITAL ROUTE ATLAS

**ORBITAL ROUTE ATLAS** は、TRPG用の一方向移動ツリーを作成し、SVGまたはPNGで保存できる静的Webツールです。地点を追加し、任意のアイコン・名称・進行列を設定して、分岐と合流を編集できます。

> このツールは、一般的な「地点から次の地点を選ぶ」移動構造を扱います。特定作品の画面・ロゴ・固有アイコン・用語・画像は利用していません。視覚設計上の区別の方針は [`design-distinction.md`](./design-distinction.md) を参照してください。

## 利用方法

公開サイトでは、まず地点を選びます。次に **この地点から接続** を押し、右側の進行列にある地点を選ぶと接続を作成または解除できます。モバイルでは初期表示でツリー全体が収まり、`− / 全体表示 / ＋`で倍率を変え、ドラッグで移動できます。

設定はブラウザー内に自動保存されます。上部の **設定を保存** でJSONとして書き出し、**設定を読む** で読み戻せます。完成した移動図はSVGまたはPNGで保存できます。

## GitHub Pagesでの公開

このリポジトリでは、`main`への更新時にGitHub Actionsが静的ファイルを生成し、GitHub Pagesへ配布します。リポジトリの **Settings → Pages** で、公開元として **GitHub Actions** を一度だけ選択してください。公開URLは通常、`https://<owner>.github.io/orbital-route-atlas/`です。

静的配布用のビルドは次のとおりです。

```bash
pnpm install --frozen-lockfile
pnpm build:pages
```

成果物は `dist/public/` に生成されます。GitHub Pagesではこの成果物だけを配布し、サーバー側の処理や秘密情報は使いません。

## 開発

```bash
pnpm install
pnpm dev
pnpm check
pnpm build
```

## ライセンス

ソースコードは [MIT License](./LICENSE) で公開します。生成済みのロゴ・背景・参照カードは、このリポジトリの公開目的に合わせて独自に作成した素材です。
