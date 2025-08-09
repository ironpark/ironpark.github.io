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

GitHub Pagesベースの静的ブログを運営して感じた最大の不便さは、**公開プロセスそのもの**だ。

別途のデータベースやサーバー環境がないため管理ページや専用エディターもない。その結果、下書き作成 → 保存 → 修正 → 公開という基本的な文章作成の流れがスムーズでない。さらに記事とフロントエンドコードが一つのリポジトリに混在している環境は、少しでも気を抜くと迷走しがちな私にとってはほぼ災害に近い。だからこそ**関心の分離**が切実だった。

### 誰でもそれっぽい計画はある
![get punched in the face](/posts/blog-auto-publishing-with-obsidian/get-punched-in-the-face.jpg)

**私の計画はこうだった：**
1. Obsidianで記事を書く
2. Gitプラグインが個人リポジトリに自動で同期する
3. GitHub Actionsがブログリポジトリに記事を自動デプロイする

こうすればスマホ、タブレット、デスクトップどこからでも記事を書いてすぐに公開できる完璧なシステムになると確信していた。Obsidianで執筆に集中し、GitHub Actionsの自動化マジックであとは勝手に処理される…そんな美しい計画だったのだが…

頭の中では完璧に回っていた計画だったが、実際には思ったより多くの落とし穴が潜んでいた。

> 誰でもそれっぽい計画はある  ~~殴られるまでは~~

## ソリューション探索

### 最初の計画


![blog-auto-publishing-with-obsidian.ja.md 1 mermaid image](/posts/blog-auto-publishing-with-obsidian/blog-auto-publishing-with-obsidian.ja-1.svg)

最も懸念していたのは**自動コミットと手動コミットが一つのリポジトリ内で絡み合う状況**だった。  
GitHub Actionsが記事を自動でコミットしてデプロイしている間に、私がローカルでCSSやレイアウトを修正したらどうなるだろう？

おそらくプッシュを試みる瞬間、リモートリポジトリにはすでに自動化が生成したコミットが先に入っているだろう。その場合`git push`が拒否され、コンフリクトを解決するために再度`git reset HEAD^ & git pull`をしなければならない面倒な状況が起こる可能性が高い。

つまり、記事を公開しようと作った自動化が、うっかりすると**フルタイムのコンフリクト担当職に**私を転職させかねないという話だ。

### 二つ目の計画
根本的な問題の原因は自動化プロセスがブログ記事を直接メインブランチにコミットしていることだ。

それならば。**ビルド時に記事を動的に取り込めばどうだろう？**
![blog-auto-publishing-with-obsidian.ja.md 2 mermaid image](/posts/blog-auto-publishing-with-obsidian/blog-auto-publishing-with-obsidian.ja-2.svg)


こうすると**記事リポジトリとブログコードリポジトリが完全に分離**される。各々の領域で独立してコミットし、ビルド時にだけ出会う形だ。コンフリクト？そんなものはそもそも起こりえない構造だ。

しかしこの構造には致命的な問題があった。**公開リポジトリが非公開リポジトリのデータを取りに行かなければならない点**だ。これは一般的なセキュリティ原則に反する逆方向アクセスだった。

私のObsidian Vaultは単なるブログリポジトリではない。個人の日記、業務メモ、プロジェクトアイデア、時には機密情報まで含む私だけのデジタル脳だ。そんな個人リポジトリに公開ブログがアクセスすること自体が不安だった。

Personal Access Tokenを使って非公開リポジトリをクローンする方法も検討したが、リスクが多すぎた：

- 公開リポジトリのActionsログに機密情報が露出する可能性
- トークンが盗まれた場合Vault全体が危険にさらされるセキュリティ問題
- 誤って非公開ファイルがビルド過程に含まれるリスク

何よりも自分を信用できないためこの計画は破棄される

### 最後？

![Neon Genesis Evangeliongendo Ikari Gendo](/posts/blog-auto-publishing-with-obsidian/Neon-Genesis-Evangeliongendo-Ikari-Gendo.jpg)
> 記事公開システム ~~人類~~ 補完計画最終版

そこで発想を転換した。**最初の計画通りブログリポジトリに自動でコミットするが、別のブランチを使えばどうか？**
![blog-auto-publishing-with-obsidian.ja.md 3 mermaid image](/posts/blog-auto-publishing-with-obsidian/blog-auto-publishing-with-obsidian.ja-3.svg)この構造では：
- VaultのGitHub Actionsが記事を処理してブログリポジトリの`auto-sync`ブランチにプッシュした後
- ブログのビルドプロセスが`master`と`auto-sync`の両ブランチをチェックアウトしてマージしビルド
- デザインやコード修正はいつも通り`master`ブランチに直接コミット

コンフリクトの余地を根本から断ちつつ、セキュリティ問題なく二つのリポジトリを連携できる構造だ。

### 直面した課題たち
1. Obsidian文法
Obsidianは独自のマークダウン拡張文法を使っている。`![[image.png]]`のような画像埋め込みや`[[別のノート]]`のようなウィキリンクは基本的にマークダウンプリプロセッサでそのままレンダリングされない。これを変換する前処理が必須だった。

2. 画像パスとアセット管理
Obsidian Vaultの画像は通常ノートと同じフォルダに保存されるが、ウェブでは`/assets/images/`のような統合パスを使うのが一般的だ。ビルド時に画像を正しい場所にコピーしパスを修正する必要があった。

3. 多言語対応とAI翻訳
ブログを韓国語、英語、日本語で提供したかった。毎回3言語で記事を書くのは難しく、自分の外国語能力も乏しいためAI翻訳を導入した。しかし技術用語やコードブロックは翻訳されてはいけないなど細かい配慮が必要だった。


---

> 💡 **この自動化システムに興味があるなら**
> 
> 全コードは[GitHubリポジトリ](https://github.com/ironpark/ironpark.github.io)で確認できる。  
> 特に`.github/workflows/`フォルダのアクションファイルを見ると詳細な実装内容がわかる。  
>
> 似たようなシステムを構築したいならいつでも質問をどうぞ。一緒により良い執筆環境を作っていこう。