---
created: '2025-08-25T11:30:12.000Z'
updated: '2025-09-03T13:25:35.000Z'
published: '2025-09-03T12:37:29.000Z'
slug: why-i-became-a-go-developer
title: 私がGo言語を好きになる理由
subTitle: 偶然のGo開発者
description: 私がGo言語を好きな理由を少しのコードとともにまとめてみました。もしかしたらあなたもGoに惹かれるかもしれません？
series: ''
categories:
  - Thoughts
tags:
  - golang
lang: ja
thumbnail: ''
originalLang: ko
---
# たまたま Go
![i like go title](/posts/why-i-became-a-go-developer/i-like-go-title.jpg)

開発者として長く働いていると、自然と様々なプログラミング言語を使うようになり、それぞれ好きな言語やフレームワークができるものだ。私にとってそれがGoだった。今日は私がGo言語に惹かれた理由を少し？のコードを添えてまとめてみた。もしかしたらあなたもGoに惹かれるかもしれない？

> **免責事項**: この記事は純粋に個人的な経験と好みに基づいて書かれています。Goがすべての状況で最良の選択とは限らず、私が好きな特徴が他の開発者にとっては欠点になることも認めます。

## シンプルさの力
最初に紹介するGoの魅力はシンプルさだ。言語の構文自体が多くなく直感的で、静的言語の経験があればすぐに慣れる。基本的に25個の予約語がある。これは一般的に他の言語（C、C++、Javaなど）が少なくとも35、多いと70以上の予約語があることを考えると非常に少ない。

- **宣言:** `const`, `func`, `import`, `package`, `type`, `var`
- **複合型:** `chan`, `interface`, `map`, `struct`
- **制御フロー:** `break`, `case`, `continue`, `default`, `defer`, `else`, `fallthrough`, `for`, `go`, `goto`, `if`, `range`, `return`, `select`, `switch`

これ以外に型推論システム、例外処理システム、継承なしの多態性実装など、Goの設計哲学は多くの高度な機能を追加するよりもシンプルさと明確さを追求していることを示している。

```go
// HELLO WORLD! とてもシンプルなgoプログラムの例
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```

```go
// 伝統的なforループ
for i := 0; i < 10; i++ { }

// whileのように使う
for condition { }

// 無限ループ
for { }
```

```go
// try-catchはサービス停止だ！
file, err := os.Open("file.txt")
if err != nil {
    return err
}
```

このようなシンプルさはコードを理解しやすくし、より予測可能なコードを書くのに役立ち、他人のソースコードを分析するときも比較的読みやすく分析しやすくしてくれる。~~初めて見ても違和感がないです~~

## 互換性の約束

![thats a promise](/posts/why-i-became-a-go-developer/thats-a-promise.gif)
> 下位互換を保証、それが約束だから。

Go 1.0から始まった[互換性の約束](https://go.dev/doc/go1compat)はGoのもう一つの大きな利点だ。この約束はGo 1.xバージョンで書かれたコードが将来のバージョンでも動作し続けることを保証する。

実際の開発では、もう更新されていない古いライブラリを使わなければならない場合がよくある。Goではそうしたライブラリも最新のコンパイラで問題なく動作する。これにより数年前に書かれたプロジェクトでも特別な修正なしに最新のコンパイラでビルドでき、自動的にパフォーマンス改善や最適化の恩恵を受けられる。タダ飯はないけど、少しの例外くらいあってもいいのではないか。

ただし、標準ライブラリのバグ修正やセキュリティ脆弱性のパッチによる微妙な動作変更があることもあるため、アップグレード時にはリリースノートを必ず確認することをおすすめする。

## 速いビルド速度

Goに初めて触れたとき、私が主に使っていた言語がC/C++やJavaだったためビルド速度の差を強く実感できた。すぐに実行できるインタプリタ言語には及ばないが、コンパイル言語の中では驚くほど速いビルド速度を誇る。おかげでコードを修正してすぐに実行でき、開発生産性が大幅に向上した。

## 静的リンク、単一バイナリ

CGOを使って動的リンクを追加しない前提で、Goは基本的にすべての依存関係を含む単一バイナリを生成する。これは配布を極めてシンプルにする。さらに驚くべきことに、`embed`パッケージを使うことでソースコードだけでなく様々な静的ファイルもバイナリに組み込める。

```go
package main

import (
    _ "embed"
    "fmt"
)

// テキストファイルをバイナリに埋め込む
//go:embed hello.txt
var helloText string

// バイナリファイルをバイナリに埋め込む
//go:embed logo.png
var logoData []byte

func main() {
    fmt.Println(helloText)
    fmt.Printf("Logo size: %d bytes\n", len(logoData))
}
```

## 豊富な標準ライブラリ
Goの標準ライブラリは驚くほど充実している。`net/http`、`net/smtp`のようなネットワークプロトコル、正規表現、20以上の暗号アルゴリズム、JSON、XML、Base64など多様なデータエンコーディングを標準で提供し、さらにはGoのソースコード自体を解析できるASTパーサまで標準ライブラリに含まれており、ほぼ総合ギフトセットのレベルだ。

これらの標準ライブラリはGoチームによって継続的に管理・メンテナンスされることが保証されているため、サードパーティライブラリへの依存を大幅に減らせ、結果としてプロジェクトの安定性とセキュリティ向上につながる。

## 同時実行性
### ゴルーチンの強力さ
Goを語るうえで欠かせない核心機能がある

![go rou tine 0](/posts/why-i-became-a-go-developer/go-rou-tine-0.jpg)

**ゴ・ル・ーチン**

ゴルーチンはGoランタイムが管理する軽量スレッドで、OSスレッドと違い生成コストが極めて低い。初期スタックサイズはわずか2KBで、数万個のゴルーチンを同時に実行しても（ルーチン内で実行されるコードを除けば）システムに大きな負荷をかけない。

正直に言って詐欺的なレベルで同時実行性と並列性の実装を単純化しており、他の言語を使うたびに「おお、ゴルーチン使いたい」と自然に思ってしまう。

```go
package main

import (
    "fmt"
    "time"
)

func sayHello(name string) {
    for i := 0; i < 3; i++ {
        fmt.Printf("Hello %s!\n", name)
        time.Sleep(100 * time.Millisecond)
    }
}

func main() {
    // 通常の関数呼び出し
    sayHello("World")
    
    // ゴルーチンで実行 - goキーワードを追加するだけ
    go sayHello("Goroutine")
    go sayHello("Go")
    
    // ゴルーチンが終わるまで待機
    time.Sleep(time.Second)
}
```

### チャネルを使った通信

Goの同時実行性の哲学は「メモリを共有して通信するのではなく、通信を通じてメモリを共有せよ」という原則に基づいている。チャネル(channel)はこの哲学を実現する重要なツールで、ゴルーチン間の安全な通信を可能にする。

チャネルは型指定されたパイプ、あるいはスレッドセーフな特殊キューと考えると理解しやすい。片方からデータを送るともう片方で受け取る単純な構造だが、これにより複雑な同時実行パターンを優雅に実装できる。

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    // チャネル作成
    messages := make(chan string)
    
    // ゴルーチンからチャネルへメッセージ送信
    go func() {
        time.Sleep(time.Second)
        messages <- "Hello from goroutine!"
    }()
    
    // メインゴルーチンでメッセージ受信
    msg := <-messages
    fmt.Println(msg)
}
```

```go
func worker(id int, jobs <-chan string, results chan<- string) {
    for job := range jobs {
        fmt.Printf("Worker %d processing: %s\n", id, job)
        results <- strings.ToUpper(job)
    }
}

func main() {
    // バッファ付きチャネル作成
    jobs := make(chan string, 10)
    results := make(chan string, 10)
    
    // 5つのワーカーゴルーチンを起動
    for i := 1; i <= 5; i++ {
        go worker(i, jobs, results)
    }
    
    // 作業を送信
    tasks := []string{"hello", "world", "golang", "concurrency", "is", "awesome"}
    for _, task := range tasks {
        jobs <- task
    }
    // 結果を受信（作業数分）
    for i := 0; i < len(tasks); i++ {
        result := <-results
        fmt.Println("Result:", result)
    }
}
```

### 伝統的な同期方式もサポート

> 我々の民話の悪夢を満たす怪物の中で、最も恐ろしいのは人狼だ。なぜなら彼らは馴染みのある姿から突然恐怖に変わるからだ。これらに対しては魔法のように彼らを鎮める銀の弾丸を求める。
> No Silver Bullet - *Frederick P. Brooks, Jr*

[銀の弾丸はない](https://worrydream.com/refs/Brooks_1986_-_No_Silver_Bullet.pdf)という古い名言のように、チャネルはGoの強力な同時実行ツールだが、すべての状況で最良とは限らない。単に共有変数を安全に更新したりクリティカルセクションを保護したりする場合は、伝統的な同期方式のほうが適していることが多い。

こうした要求も忠実にサポートしている。`sync`パッケージのミューテックスや`sync/atomic`パッケージなどを通じて低レベル制御が可能だ。

```go
package main

import (
    "fmt"
    "sync"
)

var (
    counter int
    mu      sync.Mutex
)

func main() {
    var wg sync.WaitGroup
    
    // 1000個のゴルーチンが同時にカウンターを増加
    for i := 0; i < 1000; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            mu.Lock()
            counter++
            mu.Unlock()
        }()
    }
    
    wg.Wait()
    fmt.Printf("Final counter value: %d\n", counter)
}
```

### Function Coloring Problemはない

多くの言語が非同期プログラミングをサポートする際に直面する[Function Coloring Problem](https://journal.stuffwithstuff.com/2015/02/01/what-color-is-your-function/)はGoには存在しない。

他の言語は同期関数と非同期関数を区別しなければならない。JavaScriptの`async/await`、Pythonの`async def`が代表例だ。一般的に非同期関数は非同期コンテキストでのみ呼び出せ、これはコードベース全体に伝染病のように広がる。

```go
// Goでは同期/非同期の区別がない
func fetchData() string {
    // この関数は同期的にも非同期的にも呼べる
    time.Sleep(100 * time.Millisecond)
    return "data"
}

func main() {
    // 同期的呼び出し
    result := fetchData()
    
    // 非同期的呼び出し - 関数シグネチャは変わらない
    go fetchData()
    
    // チャネルと一緒に使う
    ch := make(chan string)
    go func() {
        ch <- fetchData()
    }()
}
```

Goのゴルーチンは言語ランタイムが管理する軽量スレッドなので、すべての関数が潜在的に同時実行可能だ。関数を`async`でマークしたり特別な構文を使う必要がない。これはコードの複雑さを大幅に減らし、私の不足気味なシングルコア脳CPU使用率に余裕を与え、ビジネスロジックの作成に集中できるようにしてくれる。

## Why Not ... ?

### Rust
Rustはメモリ安全性と性能面で優れた言語だが、私が進めているプロジェクトはどうしてもC/C++ライブラリを使わざるを得ない場合が多く、その過程が苦痛だった。適切にラップされたライブラリを探して使うこともできるが、すべての機能を提供していなかったり、機能が正しく動作しないケースにしばしば遭遇する。

GoのCGOも完璧ではないが、直接バインディングコードを書くより直感的に使えるためより適していた。おそらくC依存が不要か少なく、性能が非常に重要なプロジェクトをするならRustを検討するだろう。

### Zig
ZigはCを置き換えようという野心的な目標を持つ興味深い言語だ。特にC/C++との連携面で非常に優れているが、まだ資料が少なく言語やエコシステムが急速に変化している段階に感じる。引き続き注目して見守っている。

## おわりに

すべての場合にGoを使うわけではないが、多くの場合Goを選ぶ。完璧な言語はなく、それぞれの言語にはそれなりのトレードオフがあるが、

私にとってGoは安定性、シンプルさ、実用性が適切にバランスされていて、毎日食べても飽きないあっさりした料理のように感じる。そう、言語は少し退屈でもいいのだ。

> "あなたが一番好きな言語は何ですか？そしてなぜ好きですか？"