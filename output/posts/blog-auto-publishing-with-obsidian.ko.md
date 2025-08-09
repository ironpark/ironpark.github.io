---
created: 2025-07-28T14:30:00.000Z
updated: 2025-08-08T14:50:00.000Z
published: true
slug: blog-auto-publishing-with-obsidian
title: 블로그 자동발행 (feat. Obsidian)
subTitle: 누구나 그럴싸한 계획은 있다
description: >-
  Obsidian에서 글을 쓰고 저장만 하면 자동으로 웹사이트에 발행되는 완전 자동화 시스템. GitHub Actions와 Git 동기화로
  구현하는 글쓰기에만 집중할 수 있는 환경구축
series: 똑똑한 블로그 만들기
categories:
  - Dev
tags:
  - obsidian
  - github-actions
  - automation
  - workflow
  - markdown
lang: ko
thumbnail: null
originalLang: ko
---
## 글 하나 발행하기가 왜 이렇게 복잡해?

[지난 포스트](/blog/my-ideal-dev-blog) 에서는 블로그를 만들게된 이유와 기술선택의 경위에 대하여 이야기했다. 이번에는, 그렇게 만든 블로그에서 글 하나를 발행하기까지 왜 이렇게 복잡한지, 그리고 그 과정을 어떻게 풀어보려 했는지 이야기해보려 한다.

GitHub Pages 기반의 정적 블로그를 운영하면서 느낀 가장 큰 불편함은 **발행 과정 그 자체**다.

별도의 데이터베이스나 서버 환경이 없으니 관리 페이지나 전용 에디터도 없다. 그 결과 초안 작성 → 저장 → 수정 → 발행으로 이어지는 기본적인 글쓰기 흐름이 매끄럽지 않다. 게다가 글과 프론트엔드 코드가 한 저장소에 뒤섞여 있는 환경은, 조금만 방심해도 삼천포로 빠지는 나에겐 재앙에 가깝다. 그래서 **관심사 분리**가 절실했다.

### 누구나 그럴싸한 계획은 있다
![get punched in the face](/posts/blog-auto-publishing-with-obsidian/get-punched-in-the-face.jpg)

**나의 계획은 이랬다:**
1. Obsidian에서 글을 작성한다
2. Git 플러그인이 개인 저장소에 자동으로 동기화한다
3. GitHub Actions가 블로그 저장소에 포스트를 자동 배포한다

이렇게 하면 스마트폰, 태블릿, 데스크탑 어디서든 글을 쓰고 바로 배포할 수 있는 완벽한 시스템이 될 거라 확신했다. Obsidian으로 글쓰기에만 집중하고, GitHub Actions의 자동화 마법으로 나머지는 알아서 처리되는... 그런 아름다운 계획이었는데..

머릿속에선 완벽하게 굴러가던 계획이었지만, 실제로는 생각보다 많은 복병이 숨어 있었다.  

> 누구나 그럴싸한 계획은 있다  ~~쳐맞기 전까지는~~

## 솔루션 탐색

### 첫번째 계획


![blog-auto-publishing-with-obsidian.ko.md 1 mermaid image](/posts/blog-auto-publishing-with-obsidian/blog-auto-publishing-with-obsidian.ko-1.svg)

가장 우려됐던 부분은 **자동 커밋과 수동 커밋이 한 저장소 안에서 얽히는 상황**이었다.  
GitHub Actions가 글을 자동으로 커밋하고 배포하는 동안, 내가 로컬에서 CSS나 레이아웃을 수정한다면 어떻게 될까?

아마 푸시를 시도하는 순간, 원격 저장소에는 이미 자동화가 생성한 커밋이 먼저 들어가 있을 것이다.  그 경우 `git push`가 거부되고, 충돌을 해결하기 위해 다시 `git reset HEAD^ & git pull`을 해야 하는 번거로운 상황이 벌어질 가능성이 높다.

즉, 글을 발행하려고 만든 자동화가 자칫하면 **풀타임 충돌 담당보직으로** 나를 전직시킬 수 있다는 이야기다.

### 두번째 계획
근본적인 문제의 원인은 자동화 프로세스에서 블로그 포스트를 직접 메인 브랜치에 커밋하는것이다. 

그렇다면. **빌드 시점에 포스트를 동적으로 가져오면 어떨까?**
![blog-auto-publishing-with-obsidian.ko.md 2 mermaid image](/posts/blog-auto-publishing-with-obsidian/blog-auto-publishing-with-obsidian.ko-2.svg)


이렇게 하면 **포스트 저장소와 블로그 코드 저장소가 완전히 분리**된다. 각자의 영역에서 독립적으로 커밋하고, 빌드 시점에만 만나는 것이다. 충돌? 그런 건 애초에 발생할 수 없는 구조다.

하지만 이 구조에는 치명적인 문제가 있었다. **공개 저장소가 비공개 저장소의 데이터를 가져와야 한다는 점**이다. 이는 일반적인 보안 원칙에 어긋나는 역방향 접근이었다.

내 Obsidian Vault는 단순한 블로그 저장소가 아니다. 개인 일기, 업무 메모, 프로젝트 아이디어, 때로는 민감한 정보까지 담겨 있는 나만의 디지털 두뇌다. 이런 개인 저장소를 공개 블로그가 접근한다는 것 자체가 불안했다.

Personal Access Token을 사용해 비공개 저장소를 클론하는 방법도 고려했지만, 위험 요소가 너무 많았다:

- 공개 저장소의 Actions 로그에 민감한 정보가 노출될 가능성
- 토큰 탈취 시 Vault 전체가 위험에 노출되는 보안 문제
- 실수로 비공개 파일이 빌드 과정에 포함될 위험

무엇보다도 나를 믿지 않기때문에 이 계획은 폐기된다

### 마지막?

![Neon Genesis Evangeliongendo Ikari Gendo](/posts/blog-auto-publishing-with-obsidian/Neon-Genesis-Evangeliongendo-Ikari-Gendo.jpg)
> 포스트 발행 시스템 ~~인류~~ 보완 계획 최종본

그래서 발상을 전환했다. **처음 계획대로 블로그 저장소에 자동으로 커밋하되, 별도의 브랜치를 사용하면 어떨까?**
![blog-auto-publishing-with-obsidian.ko.md 3 mermaid image](/posts/blog-auto-publishing-with-obsidian/blog-auto-publishing-with-obsidian.ko-3.svg)이 구조에서는:
- Vault의 GitHub Actions가 포스트를 처리해 블로그 저장소의 `auto-sync` 브랜치에 푸시 이후 
- 블로그의 빌드 프로세스가 `master`와 `auto-sync` 브랜치를 모두 체크아웃해 병합 후 빌드
- 디자인이나 코드 수정은 평소처럼 `master` 브랜치에 직접 커밋

충돌의 여지를 원천 차단하면서도, 보안 문제 없이 두 저장소를 연결할 수 있는 구조다.

### 마주친 도전 과제들
1. Obsidian 문법
Obsidian은 자체적인 마크다운 확장 문법을 사용한다. `![[image.png]]` 같은 이미지 임베드나 `[[다른 노트]]` 같은 위키링크는 기본적으로 마크다운 전처리기에서 그대로 렌더링되지 않는다. 이를 변환하는 전처리 과정이 필수였다.

2. 이미지 경로와 에셋 관리
Obsidian Vault의 이미지들은 보통 노트와 같은 폴더에 저장되지만, 웹에서는 /assets/images/ 같은 통합 경로를 사용하는 게 일반적이다. 빌드 시점에 이미지를 올바른 위치로 복사하고 경로를 수정해야 했다.

3. 다국어 지원과 AI 번역
블로그를 한국어, 영어, 일본어로 제공하고 싶었다. 매번 세 개 언어로 글을 쓸 수도 없고 나의 외국어 능력은 빈약하하기에 AI 번역을 도입했다. 하지만 기술 용어나 코드 블록이 번역되면 안 되는 등 세심한 처리가 필요했다.


---

> 💡 **이 자동화 시스템이 궁금하다면**
> 
> 전체 코드는 [GitHub 저장소](https://github.com/ironpark/ironpark.github.io)에서 확인할 수 있다. 
> 특히 `.github/workflows/` 폴더의 액션 파일들을 보면 자세한 구현 내용을 볼 수 있다.
>
> 비슷한 시스템을 구축하고 싶다면 언제든 질문을 남겨달라. 같이 더 나은 글쓰기 환경을 만들어가자.