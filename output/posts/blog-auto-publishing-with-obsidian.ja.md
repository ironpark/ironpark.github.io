---
created: '2025-07-28T14:30:00.000Z'
updated: '2025-08-08T14:50:00.000Z'
published: true
slug: blog-auto-publishing-with-obsidian
title: ブログ自動公開（feat. Obsidian）
subTitle: 誰でもそれらしい計画は持っている
description: >-
  Obsidianで文章を書いて保存するだけで自動的にウェブサイトに公開される完全自動化システム。GitHub
  ActionsとGit同期を活用した、執筆に専念できる環境構築
series: 똑똑한 블로그 만들기
categories:
  - Dev
tags:
  - obsidian
  - github-actions
  - automation
  - workflow
  - markdown
lang: ja
thumbnail: null
originalLang: ko
---
## 記事を一つ公開するのがなぜこんなに複雑なのか？

[前回の投稿](/blog/my-ideal-dev-blog)では、ブログを作った理由と技術選択の経緯について話した。今回は、そうして作ったブログで記事を一つ公開するまでになぜこんなに複雑なのか、そしてその過程をどう解決しようとしたのかを話そうと思う。

GitHub Pagesベースの静的ブログを運営して感じた最大の不便は、**公開プロセスそのもの**だ。

別途のデータベースやサーバー環境がないため管理ページや専用エディターもない。その結果、下書き作成 → 保存 → 修正 → 公開という基本的な文章作成の流れがスムーズでない。さらに記事とフロントエンドコードが一つのリポジトリに混在している環境は、少しでも気を抜くと迷走してしまう私にとってはほぼ災害に近い。だからこそ**関心の分離**が切実だった。

### 誰でもそれっぽい計画はある
![get punched in the face](/posts/blog-auto-publishing-with-obsidian/get-punched-in-the-face.jpg)

**最初の計画はこうだった：**
1. Obsidianで記事を書く
2. Gitプラグインが個人リポジトリに自動で同期する
3. GitHub Actionsがブログリポジトリに記事を自動デプロイする

こうすればスマホ、タブレット、デスクトップどこからでも記事を書いてすぐに公開できる完璧なシステムになると確信していた。Obsidianで執筆に集中し、GitHub Actionsの自動化の魔法であとは勝手に処理される…そんな美しい計画だったのだが…

頭の中では完璧に回っていた計画だったが、実際には思ったより多くの落とし穴が潜んでいた。

> 誰でもそれっぽい計画はある  ~~殴られるまでは~~

## ソリューション探索

### 最初の計画


![blog-auto-publishing-with-obsidian.ja.md 1 mermaid image](/posts/blog-auto-publishing-with-obsidian/blog-auto-publishing-with-obsidian.ja-1.svg)

最も懸念していたのは、**自動コミットと手動コミットが一つのリポジトリ内で絡み合う状況**だった。  
GitHub Actionsが記事を自動でコミットしてデプロイしている間に、私がローカルでCSSやレイアウトを修正したらどうなるだろうか？

おそらくプッシュを試みる瞬間には、リモートリポジトリにはすでに自動化が生成したコミットが先に入っているだろう。その場合 `git push` は拒否され、コンフリクトを解決するために再度 `git reset HEAD^ & git pull` をしなければならない煩わしい状況が起こる可能性が高い。

記事公開のために作った自動化のせいで、**フルタイムのコンフリクト管理者**になりかけた。

### 二番目の計画
根本的な問題の原因は、自動化プロセスがブログ記事を直接メインブランチにコミットしていることだ。

ならば、**ビルド時に記事を動的に取得したらどうか？**
![blog-auto-publishing-with-obsidian.ja.md 2 mermaid image](/posts/blog-auto-publishing-with-obsidian/blog-auto-publishing-with-obsidian.ja-2.svg)


こうすれば、**記事リポジトリとブログコードリポジトリが完全に分離**される。各々の領域で独立してコミットし、ビルド時にだけ出会う形だ。コンフリクト？そんなものはそもそも発生し得ない構造だ。

しかしこの構造には致命的な問題があった。**公開リポジトリが非公開リポジトリのデータを取得しなければならない点**だ。これは一般的なセキュリティ原則に反する逆方向アクセスだった。

私のObsidian Vaultは単なるブログリポジトリではない。個人の日記、業務メモ、プロジェクトアイデア、時には機密情報まで含む私だけのデジタル脳だ。そんな個人リポジトリに公開ブログがアクセスするのは不安だった。

- 公開リポジトリのActionsログに機密情報が露出する可能性
- トークンが盗まれた場合Vault全体が危険にさらされるセキュリティ問題
- 誤って非公開ファイルがビルド過程に含まれるリスク

何よりも自分を信用できないため、この計画は破棄された。

### 最後？

![Neon Genesis Evangeliongendo Ikari Gendo](/posts/blog-auto-publishing-with-obsidian/Neon-Genesis-Evangeliongendo-Ikari-Gendo.jpg)
> 記事公開システム ~~人類~~ 補完計画最終版

そこで発想を転換した。**最初の計画通りブログリポジトリに自動でコミットするが、別のブランチを使ったらどうか？**
![blog-auto-publishing-with-obsidian.ja.md 3 mermaid image](/posts/blog-auto-publishing-with-obsidian/blog-auto-publishing-with-obsidian.ja-3.svg)この構造では：
- VaultのGitHub Actionsが記事を処理しブログリポジトリの `auto-sync` ブランチにプッシュした後 
- ブログのビルドプロセスが `master` と `auto-sync` ブランチを両方チェックアウトしてマージしビルド
- デザインやコードの修正は普段通り `master` ブランチに直接コミット

コンフリクトの余地を根本から断ちつつ、セキュリティ問題なく二つのリポジトリをつなげる構造だ。


## この投稿で扱わなかったこと

Obsidianで書いた記事は基本的にマークダウン形式に従うが、それをそのままブログに適用するのは難しかった。そこで別途前処理器を作らなければならず、その過程で直面した様々な問題があった。今回は触れなかったが、機会があれば別途まとめて公開する予定だ。

1. **Obsidian文法**  
    Obsidianは独自のマークダウン拡張文法を使う。例えば `![[image.png]]` 形式の画像埋め込みや `[[別のノート]]` のようなウィキリンクは基本マークダウンレンダラーではそのまま表示されない。したがってこれを変換する前処理過程が必須だった。
    
2. **画像パスとアセット管理**  
    Obsidian Vaultの画像ファイルは通常ノートと同じフォルダに保存されるが、ウェブでは一般的に `/assets/images/` のような統合パスを使う。ビルド時に画像を正しい場所にコピーし、パスを修正する作業が必要だった。
    
3. **Mermaid Diagram対応**  
    この投稿ではmermaid.jsを使って図を作成した。しかし静的サイトビルド過程でこれをそのまま表現するには、動的レンダリングをサポートする別の処理方式が必要だった。
    
4. **多言語対応とAI翻訳**  
    ブログを韓国語、英語、日本語で提供したかった。しかし毎回三言語で直接書くのは難しく、自分の外国語能力にも限界があるためAI翻訳を導入した。ただし翻訳過程でマークダウン文法が変形したり壊れたりするなど様々な問題があり、プロンプトを何度か修正することがあった。

## 実装

### Obsidian Vaultリポジトリ

```yaml
name: Contents Sync
# このワークフローはmainブランチとblogブランチ間でコンテンツを同期する。
on:
  workflow_dispatch:
  push:
    # 不要なworkflowの再実行を防ぐため特定ファイル変更時のみ実行
    paths:
      - "2.Areas/Blog/*.md"
      - ".github/workflows/**"
    branches:
      - main
jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Get current date
        id: date
        run: echo "::set-output name=date::$(date +'%Y-%m-%d')"
      # brainリポジトリ（現在のリポジトリ）をチェックアウト
      - name: Checkout brain repository
        uses: actions/checkout@v4
        with:
          path: brain
      # ironpark.github.ioのauto-syncブランチをチェックアウト
      - name: Checkout contents repository
        uses: actions/checkout@v4
        with:
          repository: ironpark/ironpark.github.io
          ref: auto-sync
          path: contents
          token: ${{ secrets.GH_TOKEN }}
      # pnpmのインストール & キャッシュ設定（ironpark.github.ioのauto-syncブランチ用）
      - uses: pnpm/action-setup@v4
        name: Install pnpm
        with:
          version: 10.12.4
          run_install: false
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"
          cache-dependency-path: contents/pnpm-lock.yaml
      - name: Install dependencies
        working-directory: contents
        run: pnpm install --frozen-lockfile
      # brainからcontents(auto-syncブランチ)へ全アセットと記事をコピー
      - name: Sync Contents
        run: |
          rm -rf contents/{posts,assets,output}
          mkdir -p contents/{posts,assets}
          cp -r brain/2.Areas/Blog/*.md contents/posts/
          cp -r brain/Z.Assets/* contents/assets/
      - name: Build Contents
        working-directory: contents
        env:
          GITHUB_TOKEN: ${{ secrets.GH_TOKEN }}
        run: |
          pnpm build
      # contentsの変更をチェックし、変更があればプッシュ
      - name: Check for changes
        id: check_changes
        working-directory: contents
        run: |
          git add .
          if git diff --staged --quiet; then
            echo "::set-output name=changes::false"
          else
            echo "::set-output name=changes::true"
          fi
      # 変更があればcontentsをプッシュ
      - name: Push Contents
        if: steps.check_changes.outputs.changes == 'true'
        working-directory: contents
        run: |
          git config --global user.email "auto-sync-action@github.com"
          git config --global user.name "auto-sync-action"
          git commit -m "sync contents from ${{ steps.date.outputs.date }}"
          git push origin auto-sync
      - name: Run Publish
        run: gh api /repos/ironpark/ironpark.github.io/dispatches -f event_type='post-sync'
        env:
          GITHUB_TOKEN: ${{ secrets.GH_TOKEN }}
```

### ブログ（フロント）リポジトリ

```yaml
name: Build and Deploy to Pages

on:
  push:
    branches: ["master"]
  workflow_dispatch:
  repository_dispatch:
    types: [ post-sync ]

# GITHUB_TOKENの権限をGitHub Pagesへのデプロイ許可に設定
permissions:
  contents: read
  pages: write
  id-token: write

# 同時デプロイを1つに制限
concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    env:
      GITHUB_TOKEN: ${{ github.token }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/checkout@v4
        with:
          path: ./sync
          ref: auto-sync
      - uses: actions/configure-pages@v5
        id: pages
      - uses: pnpm/action-setup@v4
        name: Install pnpm
        with:
          version: 10.12.4
          run_install: false
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - name: Copy posts
        run: |
          rm -rf ./src/content/blog ; mkdir -p ./src/content/blog
          rm -rf ./static/posts ; mkdir -p ./static/posts
          cp -r ./sync/output/posts/*.md ./src/content/blog
          cp -r ./sync/output/static/posts/* ./static/posts
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      - name: Build
        run: pnpm run build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./build
  deploy:
    runs-on: ubuntu-latest
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

## 今後の計画

現在は `published` メタデータで公開の有無を管理しているが、今後は予約公開システムを作り「決まった日に静かに記事が上がる」方式を試してみる予定だ。

それ以外にも一定時間が経過したらVelog、Mediumなど他プラットフォームへ自動クロスポストしたり、公開と同時にTwitter(X)、LinkedInなどSNSに要約とリンクを流す機能も考えているが、いつ実装するかは未定…。

> まだアイデア段階だが、GitHub Actionsの無料枠を限界まで使い倒すのが目標だ。（ここまでくると機械ではなく私が酷使されている気分だが…）


---

> 💡 **この自動化システムが気になるなら**
> 
> 全コードは[GitHubリポジトリ](https://github.com/ironpark/ironpark.github.io)で確認できる。  
> 特に `.github/workflows/` フォルダのアクションファイルを見ると詳細な実装内容がわかる。  
>
> 同様のシステムを構築したいならいつでも質問を残してほしい。一緒により良い執筆環境を作っていこう。