---
created: 2025-08-25T11:30:12.000Z
updated: 2025-09-03T13:25:35.000Z
published: 2025-09-03T12:37:29.000Z
slug: why-i-became-a-go-developer
title: 내가 Go 언어를 사랑하게 만드는것들
subTitle: 어쩌다 Go 개발자
description: 내가 Go 언어를 좋아하는 이유를 약간의 코드와 함께 정리해보았다 혹시 모르지 당신도 Go며들게 될지도?
series: ''
categories:
  - Thoughts
tags:
  - golang
lang: ko
thumbnail: ''
originalLang: ko
---
# 어쩌다 Go
![i like go title](/posts/why-i-became-a-go-developer/i-like-go-title.jpg)

개발자로 오래 일하다 보면 자연스럽게 여러 프로그래밍 언어를 사용하게 되고, 저마다 좋아하는 언어나 프레임워크가 생기기 마련이다. 내게는 그것이 Go였다. 오늘은 내가 Go 언어에 스며들게된 이유를 약간?의 코드를 첨가하여 정리해보았다 혹시 모르지 당신도 Go며들게 될지도?

> **면책 조항**: 이 글은 순전히 개인적인 경험과 선호를 바탕으로 작성되었습니다. Go가 모든 상황에서 최선의 선택은 아니며, 제가 좋아하는 특징들이 다른 개발자에게는 단점이 될 수 있음을 인정합니다.

## 단순함의 힘
첫 번째로 소개할 Go의 매력은 단순함이다. 언어 구문 자체가 많지 않고 직관적이어서, 정적 언어에 대한 경험이 있다면 금방 손에 익는다. 기본적으로 25개의 예약어가 있고. 이는 일반적으로 다른 언어(c,c++,java ...)들이 적게는 35 많게는 70개 이상의 예약어가 있다는걸 생각하면 매우 적은 편인데

- **선언:** `const`, `func`, `import`, `package`, `type`, `var`
- **복합타입:** `chan`, `interface`, `map`, `struct`
- **제어흐름:** `break`, `case`, `continue`, `default`, `defer`, `else`, `fallthrough`, `for`, `go`, `goto`, `if`, `range`, `return`, `select`, `switch`

이외에 타입추론 시스템, 예외처리 시스템, 상속없는 다형성 구현등 Go 의 설계철학은 여러 고급 기능을 추가하기보다 단순함과 명확성을 추구함을 보여줍니다

```go
// HELLO WORLD! 아주 단순한 go 프로그램 예시
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```

```go
// 전통적인 for 루프
for i := 0; i < 10; i++ { }

// while처럼 사용
for condition { }

// 무한 루프
for { }
```

```go
// try-catch 는 서비스 종료다!
file, err := os.Open("file.txt")
if err != nil {
    return err
}
```

이러한 단순함은 코드를 이해하기 쉽게 만들며, 보다 예측 가능한 코드를 작성하는데 도움을 주고 타인의 소스코드를 분석할 때도 비교적 쉽게 읽고 분석할 수 있게 해줍니다. ~~처음보는데 낮설지가 않아요~~

## 호환성 약속

![thats a promise](/posts/why-i-became-a-go-developer/thats-a-promise.gif)
> 하위호환 보장, 그것이 약속이니까.

Go 1.0부터 시작된 [호환성 약속](https://go.dev/doc/go1compat)은 Go의 또 다른 큰 장점인데. 이 약속은 Go 1.x 버전에서 작성된 코드가 향후 버전에서도 계속 동작할 것을 보장한다.

실제 개발하다 보면 더 이상 업데이트되지 않는 오래된 라이브러리를 사용해야 하는 경우가 종종 있다. Go에서는 이런 라이브러리들도 최신 컴파일러에서 문제없이 동작한다. 이로인해 수년 전에 작성된 프로젝트라도 별도의 수정 없이 최신 컴파일러로 빌드할 수 있어, 자동으로 성능 개선과 최적화의 혜택을 누릴 수 있다. 공짜 점심은 없다지만 약간의 예외정도는 있어도 좋지않은가.

다만, 표준 라이브러리의 버그 수정이나 보안 취약점 패치로 인한 미묘한 동작 변경이 있을 수 있으므로, 업그레이드 시 릴리스 노트는 반드시 확인하는 것이 좋다.

## 빠른 빌드속도

Go를 처음 만났을 때, 내가 주로 사용하던 언어가 C/C++과 Java였기에 빌드 속도의 차이를 더욱 체감할 수 있었다.바로 실행해 볼 수 있는 인터프리터 언어에 비할 바가 아니지만, 컴파일 언어 중에서는 놀라울 정도로 빠른 빌드 속도를 자랑한다. 덕분에 코드를 수정하고 바로 실행해볼 수 있어 개발 생산성이 크게 향상되었다.

## 정적링크, 단일 바이너리

CGO를 사용하여 동적 링크를 추가하지 않는다는 전제하에, Go는 기본적으로 모든 의존성을 포함한 단일 바이너리를 생성한다. 이는 배포를 극도로 단순하게 만든다. 더 놀라운 점은 `embed` 패키지를 통해 소스 코드뿐만 아니라 각종 정적 파일들도 바이너리에 내장할 수 있다는 것이다.

```go
package main

import (
    _ "embed"
    "fmt"
)

// 텍스트 파일을 바이너리에 내장
//go:embed hello.txt
var helloText string

// 바이너리 파일을 바이너리에 내장
//go:embed logo.png
var logoData []byte

func main() {
    fmt.Println(helloText)
    fmt.Printf("Logo size: %d bytes\n", len(logoData))
}
```

## 방대한 표준라이브러리
Go의 표준 라이브러리는 놀라울 정도로 풍부하다. `net/http`, `net/smtp` 와 같은 네트워크 프로토콜, 정규 표현식, 20개가 넘는 암호학 알고리즘, JSON, XML, Base64 등 다양한 데이터 인코딩을 기본으로 제공하는데. 심지어 Go 소스 코드 자체를 분석 할 수 있는 AST 파서까지 표준 라이브러리가 거의 종합 선물세트 수준.

이러한 표준 라이브러리는 Go 팀에 의해 지속적으로 관리되고 유지보수되는 것이 보장되므로, 서드파티 라이브러리에 대한 의존성을 크게 줄일 수 있고 이는 곧 프로젝트의 안정성과 보안성 향상으로 이어진다.

## 동시성
### 고루틴의 강력함
Go를 이야기할 때 빼놓을 수 없는 핵심 기능이 있다

![go rou tine 0](/posts/why-i-became-a-go-developer/go-rou-tine-0.jpg)

**고.루.틴**

고루틴은 Go 런타임이 관리하는 경량 스레드로, OS 스레드와 달리 생성 비용이 극도로 낮다. 초기 스택 크기가 단 2KB에 불과하며, 수만 개의 고루틴을 동시에 실행해도 (루틴 내 실행되는 코드를 제외하면) 시스템에 큰 부담을 주지 않는다.

솔직히 사기적인 수준으로 동시성과 병렬성 구현을 단순화하는데, 다른 언어를 쓸 때마다 "아, 고루틴 쓰고 싶다"는 말이 절로 나온다.

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
    // 일반 함수 호출
    sayHello("World")
    
    // 고루틴으로 실행 - go 키워드만 추가
    go sayHello("Goroutine")
    go sayHello("Go")
    
    // 고루틴이 끝날 때까지 대기
    time.Sleep(time.Second)
}
```

### 채널을 통한 통신

Go의 동시성 철학은 "메모리를 공유하여 통신하지 말고, 통신을 통해 메모리를 공유하라"는 원칙에 기반한다. 채널(channel)은 이 철학을 구현하는 핵심 도구로, 고루틴 간 안전한 통신을 가능하게 한다.

채널은 타입이 지정된 파이프 내지는 스레드 세이프한 특수큐 라고 생각하면 이해하기 쉽다. 한쪽에서 데이터를 보내면 다른 쪽에서 받는 단순한 구조지만, 이를 통해 복잡한 동시성 패턴을 우아하게 구현할 수 있다.

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    // 채널 생성
    messages := make(chan string)
    
    // 고루틴에서 채널로 메시지 전송
    go func() {
        time.Sleep(time.Second)
        messages <- "Hello from goroutine!"
    }()
    
    // 메인 고루틴에서 메시지 수신
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
    // 버퍼 채널 생성
    jobs := make(chan string, 10)
    results := make(chan string, 10)
    
    // 5개의 워커 고루틴 실행
    for i := 1; i <= 5; i++ {
        go worker(i, jobs, results)
    }
    
    // 작업 전송
    tasks := []string{"hello", "world", "golang", "concurrency", "is", "awesome"}
    for _, task := range tasks {
        jobs <- task
    }
    // 결과 수신 (작업 개수만큼)
    for i := 0; i < len(tasks); i++ {
        result := <-results
        fmt.Println("Result:", result)
    }
}
```

### 전통적인 동기화 방식도 지원

> Of all the monsters who fill the nightmares of our folklore, none terrify more than
werewolves, because they transform unexpectedly from the familiar into horrors. For
these, we seek bullets of silver than can magically lay them to rest.
> No Silver Bullet - *Frederick P. Brooks, Jr*

[은탄환은 없다](https://worrydream.com/refs/Brooks_1986_-_No_Silver_Bullet.pdf)는 오래된 명언처럼 채널은 Go의 강력한 동시성 도구이지만, 모든 상황에서 최선은 아니다. 단순히 공유 변수를 안전하게 업데이트하거나 임계 영역을 보호해야 할 때는 전통적인 동기화 방식이 더 적합한 경우가 많은데.

이러한 요구사항도 충실히 지원한다. `sync` 패키지의 뮤텍스 `sync/atomic` 패키지 등을 통해 저수준 제어가 가능하다.

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
    
    // 1000개의 고루틴이 동시에 카운터 증가
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

### Function Coloring Problem이 없다

많은 언어들이 비동기 프로그래밍을 지원하면서 겪는 '[Function Coloring Problem](https://journal.stuffwithstuff.com/2015/02/01/what-color-is-your-function/)'이 Go에는 존재하지 않는다.

다른 언어들은 동기 함수와 비동기 함수를 구분해야 한다. JavaScript의 `async/await`, Python의 `async def` 등이 대표적인 예다. 일반적으로 비동기 함수는 비동기 컨텍스트에서만 호출할 수 있고, 이는 코드베이스 전체에 전염병처럼 퍼져나간다.

```go
// Go에서는 동기/비동기 구분이 없다
func fetchData() string {
    // 이 함수는 동기적으로도, 비동기적으로도 호출 가능
    time.Sleep(100 * time.Millisecond)
    return "data"
}

func main() {
    // 동기적 호출
    result := fetchData()
    
    // 비동기적 호출 - 함수 시그니처 변경 없음
    go fetchData()
    
    // 채널과 함께 사용
    ch := make(chan string)
    go func() {
        ch <- fetchData()
    }()
}
```

Go의 고루틴은 언어 런타임이 관리하는 경량 스레드이기 때문에, 모든 함수가 잠재적으로 동시성을 가질 수 있다. 함수를 `async`로 표시하거나 특별한 문법을 사용할 필요가 없다. 이는 코드의 복잡성을 크게 줄이고, 내 부족한 싱글코어 두뇌 CPU 점유율에 여유공간을 부여하여 비즈니스 로직을 작성함에 집중 할 수 있게 해준다.

## Why Not ... ?

### Rust
Rust는 메모리 안전성과 성능 면에서 훌륭한 언어지만 내가 진행하는 프로젝트들은 어쩔 수 없이 C/C++ 라이브러리를 사용해야 하는 경우가 많은데, 이 과정이 고통스러웠다. 적절하게 래핑된 라이브러리를 찾아 사용할 수도 있지만, 모든 기능을 제공하지 않거나 기능이 제대로 동작하지 않는 경우를 심심치 않게 만날 수 있다. 

Go의 CGO도 완벽하지는 않지만, 직접 바인딩 코드를 작성할때 보다 직관적으로 사용할 수 있어 더 적합했다. 아마 C 종속성이 필요없거나 적고 성능 매우 중요한 프로젝트를 한다면 Rust 를 고려해볼듯하다.

### Zig
Zig는 C를 대체하려는 야심찬 목표를 가진 흥미로운 언어다. 특히 C/C++ 과의 연동성 측면에서 매우 훌륭하지만 아직은 자료가 부족하고 언어나 생태계가 빠르게 변화하는 단계라고 느껴진다. 계속 관심을 갖고 지켜보는중이다.

## 마치며

모든 경우에 Go를 사용하는 건 아니지만, 많은 경우 Go를 선택하게 된다. 완벽한 언어는 없고, 각 언어는 나름의 트레이드오프를 가지고 있지만 

나에게 Go는 안정성, 단순함, 실용성이 적절한 밸런스를 가지고 있어 매일 먹어도 질리지 않는 담백한 음식처럼 느껴진다. 그렇다 언어는 좀 지루해도 된다.


> "당신이 가장 좋아하는 언어는 무엇인가요? 그리고 왜 좋아하나요?"