# ORBITAL ROUTE ATLAS

**ORBITAL ROUTE ATLAS** は、TRPG用の一方向移動ツリーを作成し、SVGまたはPNGで保存できる静的Webツールです。始点からの列数と各列の地点種別を設定するだけで、左から右へ進む分岐・合流の経路を自動作成できます。

> このツールは、一般的な「地点から次の地点を選ぶ」移動構造を扱います。特定作品の画面・ロゴ・固有アイコン・用語・画像は利用していません。視覚設計上の区別の方針は [`design-distinction.md`](./design-distinction.md) を参照してください。

## 利用方法

公開サイトでは、まず **列数** で始点からどこまで進めるかを決めます。各列にある地点のプルダウンから、小規模交戦・正面衝突・危険交戦・特異事象・分岐事象・補給所・終端警戒などを選びます。隣り合う列の地点は自動で接続されるため、線を個別に引く操作はありません。モバイルでは選択した地点を自動で中央に拡大表示し、`選択地点表示 / − / 全体表示 / ＋`で確認できます。

設定はブラウザー内に自動保存されます。上部の **設定を保存** でJSONとして書き出し、**設定を読む** で読み戻せます。完成した移動図はSVGまたはPNGで保存できます。

## GitHub Pagesでの公開

このリポジトリでは、`main`への更新時にGitHub Actionsが静的ファイルを生成し、GitHub Pagesへ配布します。公開URLは `https://lbtstudio.github.io/LBT_MIRROR-DUNGEON-GENERATOR/` です。

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
