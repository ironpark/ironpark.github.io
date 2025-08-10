---
created: '2025-07-28T14:30:00.000Z'
updated: '2025-08-08T14:50:00.000Z'
published: true
slug: blog-auto-publishing-with-obsidian
title: ブログ自動公開（feat. Obsidian）
subTitle: 誰もがそれらしい計画を持っている
description: >-
  Obsidianで文章を書いて保存するだけで、自動的にウェブサイトに公開される完全自動化システム。GitHub
  ActionsとGitの同期によって実現する、執筆に専念できる環境構築
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
## なぜ記事を一つ公開するのがこんなに複雑なのか？

[前回の投稿](/blog/my-ideal-dev-blog)では、ブログを作るに至った理由と技術選択の経緯について話した。今回は、そうして作ったブログで記事を一つ公開するまでになぜこんなに複雑なのか、そしてその過程をどう解決しようとしたのかを話そうと思う。

GitHub Pagesベースの静的ブログを運営して感じた最大の不便さは、**公開プロセスそのもの**だ。

別途のデータベースやサーバー環境がないため、管理ページや専用エディターもない。その結果、下書き作成 → 保存 → 修正 → 公開という基本的な文章作成の流れがスムーズでない。さらに記事とフロントエンドコードが一つのリポジトリに混在している環境は、少しでも気を抜くと迷走してしまう自分にとってはほぼ災害に近い。だからこそ**関心の分離**が切実だった。

### 誰でもそれっぽい計画はある
![get punched in the face](/posts/blog-auto-publishing-with-obsidian/get-punched-in-the-face.jpg)

**最初の計画はこうだった：**
1. Obsidianで記事を書く
2. Gitプラグインが個人リポジトリに自動で同期する
3. GitHub Actionsがブログリポジトリに記事を自動デプロイする

こうすればスマホ、タブレット、デスクトップどこからでも記事を書いてすぐに公開できる完璧なシステムになると確信していた。Obsidianで文章作成に集中し、GitHub Actionsの自動化マジックで残りは勝手に処理される…そんな美しい計画だったのだが…

頭の中では完璧に回っていた計画だったが、実際には思ったより多くの落とし穴が潜んでいた。

> 誰でもそれっぽい計画はある  ~~殴られるまでは~~

## ソリューション探索

### 第一案


![blog-auto-publishing-with-obsidian.ja.md 3 mermaid image](/posts/blog-auto-publishing-with-obsidian/blog-auto-publishing-with-obsidian.ja-1.svg)

最も懸念していたのは**自動コミットと手動コミットが一つのリポジトリ内で絡み合う状況**だった。  
GitHub Actionsが記事を自動でコミット・デプロイしている間に、自分がローカルでCSSやレイアウトを修正したらどうなるだろうか？

おそらくプッシュを試みる瞬間、リモートリポジトリにはすでに自動化が生成したコミットが先に入っているだろう。その場合 `git push` は拒否され、コンフリクトを解決するために再度 `git reset HEAD^ & git pull` をしなければならない面倒な状況が起きる可能性が高い。

記事を公開しようとして作った自動化のせいで、**フルタイムのコンフリクト管理者**になりかねなかった。

### 第二案
根本的な問題の原因は自動化プロセスがブログ記事を直接メインブランチにコミットしていることだ。

では、**ビルド時に記事を動的に取得したらどうか？**
![blog-auto-publishing-with-obsidian.ja.md 3 mermaid image](/posts/blog-auto-publishing-with-obsidian/blog-auto-publishing-with-obsidian.ja-2.svg)


こうすれば**記事リポジトリとブログコードリポジトリが完全に分離**される。各々の領域で独立してコミットし、ビルド時にだけ出会うのだ。コンフリクト？そんなものはそもそも発生しえない構造だ。

しかし、この構造には致命的な問題があった。**公開リポジトリが非公開リポジトリのデータを取得しなければならない点**だ。これは一般的なセキュリティ原則に反する逆方向アクセスだった。

私のObsidian Vaultは単なるブログリポジトリではない。個人の日記、業務メモ、プロジェクトアイデア、時には機微な情報まで含む自分だけのデジタル脳だ。そんな個人リポジトリに公開ブログがアクセスすること自体が不安だった。

- 公開リポジトリのActionsログに機微な情報が露出する可能性
- トークン盗難時にVault全体が危険に晒されるセキュリティ問題
- 誤って非公開ファイルがビルド過程に含まれるリスク

何よりも自分を信用できないため、この計画は破棄された。

### 最終案 
~~修正版-v3-v3修正-最後-本当の最後.doc~~

![Neon Genesis Evangeliongendo Ikari Gendo](/posts/blog-auto-publishing-with-obsidian/Neon-Genesis-Evangeliongendo-Ikari-Gendo.jpg)
> 記事公開システム ~~人類~~ 補完計画最終版

頭をひねった結果、自分なりの答えを見つけた。**最初の計画通りブログリポジトリに自動でコミットするが、別のブランチを使ったらどうか？**

![blog-auto-publishing-with-obsidian.ja.md 3 mermaid image](/posts/blog-auto-publishing-with-obsidian/blog-auto-publishing-with-obsidian.ja-3.svg)

- VaultのGitHub Actionsが記事を処理してブログリポジトリの `auto-sync` ブランチにプッシュした後
- ブログのビルドプロセスが `master` と `auto-sync` ブランチの両方をチェックアウトしてマージしビルド
- デザインやコード修正は普段通り `master` ブランチに直接コミット

コンフリクトの余地を根本的に排除しつつ、セキュリティ問題なく二つのリポジトリをつなげる構造だ。

## 計画は完璧だ

### 実際の実装

開発者は言葉よりコードだろう？以下のコードが上記計画を実現したGitHub Actionsファイルである。

**Obsidian Vault（非公開リポジトリ）**

```yaml
name: Contents Sync
# This workflow syncs contents between the main branch and the blog branch.
on:
  workflow_dispatch:
  push:
    # 不要なworkflow再実行を防ぐため特定ファイル変更時のみ実行
    paths:
      - "2.Areas/Blog/*.md"
      - ".github/workflows/**"
    branches:
      - main

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
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
      # pnpmインストール & キャッシュ設定
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
      # brainからcontentsへ全アセットと記事をコピー
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
      # 変更があればコミット＆プッシュ
      - name: Check for changes
        id: check_changes
        working-directory: contents
        run: |
          git add .
          if git diff --staged --quiet; then
            echo "changes=false" >> $GITHUB_OUTPUT
          else
            echo "changes=true" >> $GITHUB_OUTPUT
          fi
      - name: Push Contents
        if: steps.check_changes.outputs.changes == 'true'
        working-directory: contents
        run: |
          git config --global user.email "auto-sync-action@github.com"
          git config --global user.name "auto-sync-action"
          git commit -m "sync contents from $(date +'%Y-%m-%d')"
          git push origin auto-sync
      - name: Run Publish
        run: gh api /repos/ironpark/ironpark.github.io/dispatches -f event_type='post-sync'
        env:
          GITHUB_TOKEN: ${{ secrets.GH_TOKEN }}
```

**ブログ（フロント）[リポジトリ](https://github.com/ironpark/ironpark.github.io)**

```yaml
name: Build and Deploy to Pages

on:
  push:
    branches: ["master"]
  workflow_dispatch:
  repository_dispatch:
    types: [ post-sync ]
# GITHUB_TOKENの権限設定（GitHub Pagesへのデプロイ許可）
permissions:
  contents: read
  pages: write
  id-token: write
# 同時デプロイを一つに制限
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

### 詳細解説

いくら開発者はコードで語ると言っても、コードだけ置いて消えるのはあまりに無情ではないか。もし試してみたい誰かのために、二つのGitHub Actionsワークフローがどう有機的に動くのか一つずつ解剖してみよう。

見た目は複雑でも、それぞれの役割は明確に分かれているのでゆっくり読んでほしい。

#### Vaultリポジトリワークフロー解析

まずObsidian Vaultリポジトリの `Contents Sync` ワークフローだ。

**トリガー条件設定**
```yaml
on:
  workflow_dispatch:            # 手動実行可能
  push:
    paths:
      - "2.Areas/Blog/*.md"     # ブログ記事変更時のみ
      - ".github/workflows/**"  # ワークフローファイル変更時
    branches:
      - main
```

`paths`フィルターを使い、**ブログ関連ファイルが変更された時のみ**実行されるようにした。これにより不要なビルドを防ぎ、GitHub Actions無料枠（月2,000分）を節約できる。もちろん `.gitignore` を適切に設定して、不要ファイルがそもそもコミットされないようにするのも忘れずに。

**二つのリポジトリを同時にチェックアウト**
```yaml
- name: Checkout brain repository
  uses: actions/checkout@v4
  with:
    path: brain     # 現在のリポジトリ（vault）をbrainフォルダにチェックアウト
    
- name: Checkout contents repository
  uses: actions/checkout@v4
  with:
    repository: ironpark/ironpark.github.io # ブログのGitHubリポジトリから
    ref: auto-sync  # auto-syncブランチを
    path: contents  # contentsフォルダにチェックアウト
    token: ${{ secrets.GH_TOKEN }}  # 外部リポジトリアクセストークン
```

一つのワークフロー内で**二つのリポジトリを別パスにチェックアウト**する。こうすることで単純な `cp` コマンドでファイルを移動でき、複雑なスクリプトなしに簡単に同期が可能だ。このときトークンを設定するのは後のコミット＆プッシュ作業のためである。

**記事の前処理工程**
```yaml
- name: Sync Contents  # 既存ファイル削除、ディレクトリ作成、記事マークダウンファイル＆画像コピー
  run: |
    rm -rf contents/{posts,assets,output}
    mkdir -p contents/{posts,assets}
    cp -r brain/2.Areas/Blog/*.md contents/posts/
    cp -r brain/Z.Assets/* contents/assets/

- name: Build Contents # 前処理実行（Obsidian文法変換、翻訳など）
  working-directory: contents
  run: |
    pnpm build
```

まずVaultから**マークダウンファイルと画像**をブログリポジトリ（`auto-sync`ブランチ）にコピーする。次に `pnpm build` でブログリポジトリ内の前処理器を実行する。

この前処理器は以下の作業を行い、その結果をoutputフォルダに保存する
- Obsidianの `![[image.png]]` 文法を標準マークダウンに変換
- AI翻訳処理（多言語対応）
- その他前処理作業…

この前処理器もこのブログ構築の核心的役割を担っているが、今回は割愛する。

**変更確認と条件付きプッシュ**
```yaml
- name: Check for changes
  id: check_changes
  run: |
    git add .
    if git diff --staged --quiet; then
      echo "changes=false" >> $GITHUB_OUTPUT
    else
      echo "changes=true" >> $GITHUB_OUTPUT
    fi

- name: Push Contents
  if: steps.check_changes.outputs.changes == 'true'  # 変更がある時のみ
```

前処理実行後、実際に変更があった場合のみコミットする。ここは単に保存しただけで内容が変わっていなければ不要なコミット試行やデプロイを防ぐために存在する。

**ブログビルドトリガー**
```yaml
- name: Run Publish
  run: gh api /repos/ironpark/ironpark.github.io/dispatches -f event_type='post-sync'
```

GitHub CLIを使いブログリポジトリに `repository_dispatch` イベントを発生させる。これが二つのワークフローをつなぐ重要なリンクだ。ここでの `event_type` は「どんな理由でトリガーされたか」を区別するラベルの役割を果たす。

#### ブログリポジトリワークフロー解析

次にブログリポジトリの `Build and Deploy to Pages` ワークフローを見てみよう。

**多様なトリガー対応**
```yaml
on:
  push:
    branches: ["master"]  # コード修正時
  workflow_dispatch:      # 手動実行
  repository_dispatch:    
    types: [ post-sync ]  # Vaultから送られたイベント
```

三つのトリガーが宣言されており、その中で `repository_dispatch` がVaultリポジトリとつながる重要なリンクだ。Vaultワークフローからブログデプロイワークフローを起動するために必要。

**二つのブランチをマージ**
```yaml
- uses: actions/checkout@v4  # masterブランチチェックアウト
- uses: actions/checkout@v4
  with:
    path: ./sync
    ref: auto-sync  # auto-syncブランチをsyncフォルダに
    
- name: Copy posts
  run: |
    rm -rf ./src/content/blog ; mkdir -p ./src/content/blog
    rm -rf ./static/posts ; mkdir -p ./static/posts
    cp -r ./sync/output/posts/*.md ./src/content/blog  # 前処理済み記事コピー
    cp -r ./sync/output/static/posts/* ./static/posts  # 画像など静的ファイル
```

`master`ブランチのコードと `auto-sync` ブランチのコンテンツを合わせてビルドする。ついにコードとコンテンツの完全な分離を達成した。

#### セキュリティ考慮点

両ワークフローとも `${{ secrets.GH_TOKEN }}` を使用している。このトークンは：
- Blogリポジトリにのみ読み書き権限を付与
- 最小限の権限を持つFine-grained PATを使用

こうすることで万が一トークンが漏洩しても被害を最小限に抑えられる。

### なぜこんなに複雑に？

単に「記事一つ公開するのに何でこんなに複雑にしたのか」と思うかもしれない。しかしこれによって得たものは決して小さくない。

1. **完璧な関心の分離**：文章作成とコーディングがお互いに邪魔しない
2. **コンフリクトのない協業**：自動化と手動作業が平和的に共存する
3. **拡張性**：前処理器、翻訳、クロスポスティングなど機能追加が容易
4. **セキュリティ**：個人Vaultとブログコンテンツの分離

結局複雑に見えるこのシステムも、**文章作成にだけ集中したい**という単純な欲求から始まった。時には単純な目標を達成するために複雑な旅路を歩まねばならないこともあるのだ。

## 触れていないこと

Obsidianで書いた記事は基本的にマークダウン形式に従うが、そのままブログに適用するのは難しかった。そこで別途前処理器を作らねばならず、その過程で直面した様々な問題があった。今回は触れなかったが、機会があれば別途まとめて公開する予定だ。

1. **Obsidian文法**  
    Obsidianは独自のマークダウン拡張文法を使う。例えば `![[image.png]]` 形式の画像埋め込みや `[[他のノート]]` のようなウィキリンクは基本マークダウンレンダラーではそのまま表示されない。したがってこれを変換する前処理工程が必須だった。
    
2. **画像パスとアセット管理**  
    Obsidian Vaultの画像ファイルは通常ノートと同じフォルダに保存されるが、ウェブでは一般的に `/assets/images/` のような統合パスを使う。ビルド時に画像を正しい場所にコピーし、パスを修正する作業が必要だった。
    
3. **Mermaid Diagram対応**  
    この投稿ではmermaid.jsを使って図を作成した。対応のためカスタムコンポーネントを作ったが、なぜか正しくレンダリングされず、前処理でsvgファイルを生成する方式に変更した。
    
4. **多言語対応とAI翻訳**  
    ブログを韓国語、英語、日本語で提供したかった。しかし毎回三言語で直接書くのは難しく、自分の外国語能力にも限界があるためAI翻訳を導入した。ただ翻訳過程でマークダウン文法が崩れたりする問題があり、プロンプトを何度も修正することになった。

## 今後の計画

現在は `published` メタデータで公開の有無を管理しているが、今後は予約公開システムを作り「決まった日に静かに記事が上がる」方式を試してみる予定だ。

また一定時間経過後にVelogやMediumなど他プラットフォームへ自動クロスポスティングしたり、公開と同時にTwitter(X)、LinkedInなどSNSに要約とリンクを流す機能も考えているが、いつ実装するかは未定のままだ。

> 💡 **もっと知りたいなら**
> 
> 非公開リポジトリのVaultを除く全コードはすでに[GitHubリポジトリ](https://github.com/ironpark/ironpark.github.io)で確認できる。特に前処理器の実装が気になるなら `auto-sync` ブランチを見てみよう。