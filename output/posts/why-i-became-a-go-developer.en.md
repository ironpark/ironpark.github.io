---
created: '2025-08-25T11:30:12.000Z'
updated: '2025-09-03T13:25:35.000Z'
published: '2025-09-03T12:37:29.000Z'
slug: why-i-became-a-go-developer
title: What Makes Me Fall in Love with Go
subTitle: An Accidental Go Developer
description: >-
  I've summarized the reasons I love the Go language, along with some code
  snippets. Who knows, you might just fall for Go too!
series: ''
categories:
  - Thoughts
tags:
  - golang
lang: en
thumbnail: ''
originalLang: ko
---
# Somehow Go
![i like go title](/posts/why-i-became-a-go-developer/i-like-go-title.jpg)

When you work as a developer for a long time, you naturally end up using various programming languages, and you tend to develop favorites among languages or frameworks. For me, that was Go. Today, I’ve summarized the reasons why I’ve come to embrace the Go language, sprinkled with a bit? of code. Who knows, maybe you’ll end up falling for Go too?

> **Disclaimer**: This article is purely based on my personal experience and preferences. Go is not the best choice in every situation, and I acknowledge that the features I like might be drawbacks for other developers.

## The Power of Simplicity
The first charm of Go I want to introduce is its simplicity. The language syntax is minimal and intuitive, so if you have experience with statically typed languages, you’ll pick it up quickly. There are basically 25 reserved keywords. Considering that other languages (C, C++, Java, etc.) usually have anywhere from 35 to over 70 reserved keywords, this is quite few.

- **Declarations:** `const`, `func`, `import`, `package`, `type`, `var`
- **Composite types:** `chan`, `interface`, `map`, `struct`
- **Control flow:** `break`, `case`, `continue`, `default`, `defer`, `else`, `fallthrough`, `for`, `go`, `goto`, `if`, `range`, `return`, `select`, `switch`

Beyond that, Go’s design philosophy emphasizes simplicity and clarity over adding many advanced features, as seen in its type inference system, error handling approach, and polymorphism without inheritance.

```go
// HELLO WORLD! A very simple Go program example
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```

```go
// Traditional for loop
for i := 0; i < 10; i++ { }

// Used like a while loop
for condition { }

// Infinite loop
for { }
```

```go
// try-catch means service termination!
file, err := os.Open("file.txt")
if err != nil {
    return err
}
```

This simplicity makes code easier to understand, helps write more predictable code, and makes it relatively easy to read and analyze others’ source code. ~~It doesn’t feel unfamiliar even when you see it for the first time~~

## Compatibility Promise

![thats a promise](/posts/why-i-became-a-go-developer/thats-a-promise.gif)
> Backward compatibility guaranteed, because that’s the promise.

The [Compatibility Promise](https://go.dev/doc/go1compat) starting from Go 1.0 is another major advantage of Go. This promise ensures that code written for Go 1.x will continue to work in future versions.

In real development, you often have to use old libraries that are no longer updated. In Go, even these libraries work without issues on the latest compiler. This means projects written years ago can be built with the latest compiler without any modifications, automatically benefiting from performance improvements and optimizations. There’s no such thing as a free lunch, but a little exception like this is nice, isn’t it?

However, subtle behavior changes may occur due to bug fixes or security patches in the standard library, so it’s always good to check the release notes when upgrading.

## Fast Build Speed

When I first encountered Go, since I mainly used C/C++ and Java, I could really feel the difference in build speed. While it’s no match for interpreted languages that run immediately, among compiled languages, Go boasts astonishingly fast build times. Thanks to this, you can modify code and run it right away, greatly improving development productivity.

## Static Linking, Single Binary

Provided you don’t add dynamic linking using CGO, Go by default produces a single binary that includes all dependencies. This makes deployment extremely simple. Even more impressively, with the `embed` package, you can embed not only source code but also various static files into the binary.

```go
package main

import (
    _ "embed"
    "fmt"
)

// Embed a text file into the binary
//go:embed hello.txt
var helloText string

// Embed a binary file into the binary
//go:embed logo.png
var logoData []byte

func main() {
    fmt.Println(helloText)
    fmt.Printf("Logo size: %d bytes\n", len(logoData))
}
```

## Extensive Standard Library
Go’s standard library is surprisingly rich. It provides built-in support for network protocols like `net/http`, `net/smtp`, regular expressions, over 20 cryptographic algorithms, JSON, XML, Base64, and various data encodings. It even includes an AST parser capable of analyzing Go source code itself—almost like a comprehensive gift set.

Because the standard library is continuously maintained and managed by the Go team, you can significantly reduce dependency on third-party libraries, which in turn improves your project’s stability and security.

## Concurrency
### The Power of Goroutines
One core feature you can’t talk about Go without mentioning is

![go rou tine 0](/posts/why-i-became-a-go-developer/go-rou-tine-0.jpg)

**Go.Rou.Tine**

Goroutines are lightweight threads managed by the Go runtime, with extremely low creation cost compared to OS threads. Their initial stack size is only 2KB, and you can run tens of thousands of goroutines simultaneously without putting much strain on the system (aside from the code running inside the routines).

Honestly, they simplify concurrency and parallelism implementation to a near-magical level. Every time I use other languages, I find myself saying, “Ah, I wish I could use goroutines.”

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
    // Regular function call
    sayHello("World")
    
    // Run as goroutines - just add the go keyword
    go sayHello("Goroutine")
    go sayHello("Go")
    
    // Wait for goroutines to finish
    time.Sleep(time.Second)
}
```

### Communication via Channels

Go’s concurrency philosophy is based on the principle “Don’t communicate by sharing memory; share memory by communicating.” Channels are the key tool implementing this philosophy, enabling safe communication between goroutines.

Channels can be thought of as typed pipes or thread-safe special queues. One side sends data, and the other receives it—a simple structure that allows elegant implementation of complex concurrency patterns.

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    // Create a channel
    messages := make(chan string)
    
    // Send a message to the channel from a goroutine
    go func() {
        time.Sleep(time.Second)
        messages <- "Hello from goroutine!"
    }()
    
    // Receive message in the main goroutine
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
    // Create buffered channels
    jobs := make(chan string, 10)
    results := make(chan string, 10)
    
    // Start 5 worker goroutines
    for i := 1; i <= 5; i++ {
        go worker(i, jobs, results)
    }
    
    // Send tasks
    tasks := []string{"hello", "world", "golang", "concurrency", "is", "awesome"}
    for _, task := range tasks {
        jobs <- task
    }
    // Receive results (as many as tasks)
    for i := 0; i < len(tasks); i++ {
        result := <-results
        fmt.Println("Result:", result)
    }
}
```

### Traditional Synchronization Methods Are Also Supported

> Of all the monsters who fill the nightmares of our folklore, none terrify more than  
werewolves, because they transform unexpectedly from the familiar into horrors. For  
these, we seek bullets of silver that can magically lay them to rest.  
> No Silver Bullet - *Frederick P. Brooks, Jr*

As the old saying [No Silver Bullet](https://worrydream.com/refs/Brooks_1986_-_No_Silver_Bullet.pdf) goes, channels are powerful concurrency tools in Go, but they are not always the best choice. When you simply need to safely update shared variables or protect critical sections, traditional synchronization methods are often more appropriate.

Go fully supports these needs. Low-level control is possible via the `sync` package’s mutexes and the `sync/atomic` package.

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
    
    // 1000 goroutines incrementing the counter concurrently
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

### No Function Coloring Problem

Many languages that support asynchronous programming suffer from the [Function Coloring Problem](https://journal.stuffwithstuff.com/2015/02/01/what-color-is-your-function/), but Go does not.

Other languages require distinguishing between synchronous and asynchronous functions. JavaScript’s `async/await` and Python’s `async def` are prime examples. Typically, asynchronous functions can only be called within asynchronous contexts, and this requirement spreads like an epidemic throughout the codebase.

```go
// In Go, there is no sync/async distinction
func fetchData() string {
    // This function can be called synchronously or asynchronously
    time.Sleep(100 * time.Millisecond)
    return "data"
}

func main() {
    // Synchronous call
    result := fetchData()
    
    // Asynchronous call - no change in function signature
    go fetchData()
    
    // Using with channels
    ch := make(chan string)
    go func() {
        ch <- fetchData()
    }()
}
```

Because goroutines are lightweight threads managed by the language runtime, every function can potentially be concurrent. There’s no need to mark functions as `async` or use special syntax. This greatly reduces code complexity and frees up my limited single-core brain CPU cycles to focus on writing business logic.

## Why Not ... ?

### Rust
Rust is an excellent language in terms of memory safety and performance, but many of the projects I work on inevitably require using C/C++ libraries, and that process was painful. You can try to find well-wrapped libraries, but it’s not uncommon to encounter cases where they don’t provide all features or don’t work properly.

Go’s CGO isn’t perfect either, but it felt more intuitive to use than writing binding code from scratch. If you’re working on a project with little or no C dependency and performance is critical, Rust might be worth considering.

### Zig
Zig is an interesting language with an ambitious goal to replace C. It’s especially excellent in terms of interoperability with C/C++, but I feel there’s still a lack of resources and the language/ecosystem is rapidly evolving. I’m keeping an eye on it with interest.

## In Conclusion

I don’t use Go in every case, but in many situations, I choose Go. No language is perfect, and each has its trade-offs.

For me, Go strikes a good balance of stability, simplicity, and practicality, feeling like a plain but satisfying meal you never get tired of eating every day. Yes, a language can be a bit boring.

> "What is your favorite language? And why do you like it?"