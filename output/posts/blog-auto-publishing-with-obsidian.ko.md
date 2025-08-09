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

**최초 계획은 이랬다:**
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

글을 발행하려고 만든 자동화 때문에 **풀타임 충돌 관리자** 가 될뻔했다

### 두번째 계획
근본적인 문제의 원인은 자동화 프로세스에서 블로그 포스트를 직접 메인 브랜치에 커밋하는것이다. 

그렇다면. **빌드 시점에 포스트를 동적으로 가져오면 어떨까?**
![blog-auto-publishing-with-obsidian.ko.md 2 mermaid image](/posts/blog-auto-publishing-with-obsidian/blog-auto-publishing-with-obsidian.ko-2.svg)


이렇게 하면 **포스트 저장소와 블로그 코드 저장소가 완전히 분리**된다. 각자의 영역에서 독립적으로 커밋하고, 빌드 시점에만 만나는 것이다. 충돌? 그런 건 애초에 발생할 수 없는 구조다.

하지만 이 구조에는 치명적인 문제가 있었다. **공개 저장소가 비공개 저장소의 데이터를 가져와야 한다는 점**이다. 이는 일반적인 보안 원칙에 어긋나는 역방향 접근이었다.

내 Obsidian Vault는 단순한 블로그 저장소가 아니다. 개인 일기, 업무 메모, 프로젝트 아이디어, 때로는 민감한 정보까지 담겨 있는 나만의 디지털 두뇌다. 이런 개인 저장소를 공개 블로그가 접근한다는 것 자체가 불안했다.

- 공개 저장소의 Actions 로그에 민감한 정보가 노출될 가능성
- 토큰 탈취 시 Vault 전체가 위험에 노출되는 보안 문제
- 실수로 비공개 파일이 빌드 과정에 포함될 위험

무엇보다도 나를 믿지 않기때문에 이 계획은 폐기된다

### 최종안 
~~수정본-v3-v3수정-마지막-진짜마지막.doc~~

![Neon Genesis Evangeliongendo Ikari Gendo](/posts/blog-auto-publishing-with-obsidian/Neon-Genesis-Evangeliongendo-Ikari-Gendo.jpg)
> 포스트 발행 시스템 ~~인류~~ 보완 계획 최종본

머리를 열심히 굴려본 결과 나름의 답을 찾는데 성공했다. **처음 계획대로 블로그 저장소에 자동으로 커밋하되, 별도의 브랜치를 사용하면 어떨까?**

![blog-auto-publishing-with-obsidian.ko.md 3 mermaid image](/posts/blog-auto-publishing-with-obsidian/blog-auto-publishing-with-obsidian.ko-3.svg)이 구조에서는:
- Vault의 GitHub Actions가 포스트를 처리해 블로그 저장소의 `auto-sync` 브랜치에 푸시 이후 
- 블로그의 빌드 프로세스가 `master`와 `auto-sync` 브랜치를 모두 체크아웃해 병합 후 빌드
- 디자인이나 코드 수정은 평소처럼 `master` 브랜치에 직접 커밋

충돌의 여지를 원천 차단하면서도, 보안 문제 없이 두 저장소를 연결할 수 있는 구조다.

## 실제 구현

개발자는 말보다 코드 아니겠는가? 바로 아래 코드가 위 계획을 실현시킨 GitHub Actions 파일이다.

**Obsidian Vault (비공개 저장소)**

```yaml
name: Contents Sync
# This workflow syncs contents between the main branch and the blog branch.
on:
  workflow_dispatch:
  push:
    # 불필요한 workflow re-run을 방지하기 위해 특정 파일이 변경될 때만 실행
    paths:
      - "2.Areas/Blog/*.md"
      - ".github/workflows/**"
    branches:
      - main

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      # Checkout brain repository (current repository)
      - name: Checkout brain repository
        uses: actions/checkout@v4
        with:
          path: brain
      # Checkout auto-sync branch of ironpark.github.io
      - name: Checkout contents repository
        uses: actions/checkout@v4
        with:
          repository: ironpark/ironpark.github.io
          ref: auto-sync
          path: contents
          token: ${{ secrets.GH_TOKEN }}
      # Install pnpm & cache settings for auto-sync branch of ironpark.github.io
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
      # Copy all assets and posts from brain to contents (auto-sync branch)
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
      # Check for changes in contents and push if there are any changes
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
      # Push Contents if there are any changes
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

**블로그(프론트) [저장소](https://github.com/ironpark/ironpark.github.io)**

```yaml
name: Build and Deploy to Pages

on:
  push:
    branches: ["master"]
  workflow_dispatch:
  repository_dispatch:
    types: [ post-sync ]
# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write
# Allow one concurrent deployment
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

### 자세히 살펴보기

아무리 개발자는 코드로 말한다지만, 코드만 던져놓고 사라지는 건 정이 없다. 혹시 따라 해볼 누군가를 위해, 두 개의 GitHub Actions 워크플로우가 어떻게 유기적으로 동작하는지 하나씩 해부해보겠다. 겉보기엔 복잡해 보여도, 각자의 역할은 뚜렷하게 나뉘어 있으니 차근차근 따라가면 이해할 수 있으리라 믿는다.

#### Vault 저장소 워크플로우 분석

먼저 Obsidian Vault 저장소의 `Contents Sync` 워크플로우부터 살펴보자.

**트리거 조건 설정**
```yaml
on:
  workflow_dispatch:            # 수동 실행 가능
  push:
    paths:
      - "2.Areas/Blog/*.md"     # 블로그 포스트 변경 시에만
      - ".github/workflows/**"  # 워크플로우 파일 변경 시
    branches:
      - main
```

`paths` 필터를 이용해 **블로그 관련 파일이 변경될 때만** 실행되도록 했다.  이렇게 하면 불필요한 빌드를 막아 GitHub Actions 무료 티어(월 2,000분)를 절약할 수 있다.  물론 `.gitignore`를 적절히 설정해, 필요 없는 파일이 아예 커밋되지 않게 하는 것도 필수다.

**두 저장소 동시 체크아웃**
```yaml
- name: Checkout brain repository
  uses: actions/checkout@v4
  with:
    path: brain     # 현재 저장소 (vault) 를 brain 폴더에 체크아웃
    
- name: Checkout contents repository
  uses: actions/checkout@v4
  with:
    repository: ironpark/ironpark.github.io # 블로그의 깃허브 저장소에서
    ref: auto-sync  # auto-sync 브랜치를
    path: contents  # contents 폴더에 체크아웃
    token: ${{ secrets.GH_TOKEN }}  # 외부 저장소 접근용 토큰
```

한 워크플로우 안에서 **두 개의 저장소를 다른 경로에 체크아웃**한다.  이렇게 하면 단순한 `cp` 명령어로 파일을 옮길 수 있어, 복잡한 스크립트 없이도 쉽게 동기화가 가능하다.  이때 토큰을 세팅하는 이유는 이후 커밋과 푸시 작업을 위해서다.

**포스트 전처리 과정**
```yaml
- name: Sync Contents  # 기존 파일 제거, 디렉토리 생성, 포스트 마크다운 파일 & 이미지 복사
  run: |
    rm -rf contents/{posts,assets,output}
    mkdir -p contents/{posts,assets}
    cp -r brain/2.Areas/Blog/*.md contents/posts/
    cp -r brain/Z.Assets/* contents/assets/

- name: Build Contents # 전처리 실행 (Obsidian 문법 변환, 번역 등)
  working-directory: contents
  run: |
    pnpm build
```

먼저 Vault에서 **마크다운 파일과 이미지**를 블로그 저장소(`auto-sync` 브랜치)에 복사한다.  
그다음 `pnpm build`로 전처리기를 실행한다. 

이 전처리기는 아래 작업들을 실행하고 그 결과를 output 폴더에 저장한다
- Obsidian의 `![[image.png]]` 문법을 표준 마크다운으로 변환
- AI 번역 처리 (다국어 지원)
- 기타 전처리 작업들..

이 전처리기도 이 블로그를 구축하는데 핵심 역할을 하고 있지만 여기서 다루기에는 너무 크다.

**변경사항 확인과 조건부 푸시**
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
  if: steps.check_changes.outputs.changes == 'true'  # 변경사항이 있을 때만
```

전처리기를 실행한 이후 실제로 변경된 내용이 있을 때만 커밋한다. 이부분은 단순히 저장만 했을 뿐 내용이 바뀌지 않았다면 불필요한 커밋 시도와 이후 배포시도를 방지하기 위해 존재한다.

**블로그 빌드 트리거**
```yaml
- name: Run Publish
  run: gh api /repos/ironpark/ironpark.github.io/dispatches -f event_type='post-sync'
```

GitHub CLI를 사용해 블로그 저장소에 `repository_dispatch` 이벤트를 발생시킨다. 이게 두 워크플로우를 연결하는 핵심 고리다. 여기서 `event_type`은 ‘어떤 이유로 트리거됐는지’를 구분하기 위한 라벨 같은 역할을 한다.
#### 블로그 저장소 워크플로우 분석

이제 블로그 저장소의 `Build and Deploy to Pages` 워크플로우를 보자.

**다양한 트리거 지원**
```yaml
on:
  push:
    branches: ["master"]  # 코드 수정 시
  workflow_dispatch:      # 수동 실행
  repository_dispatch:    
    types: [ post-sync ]  # Vault에서 보낸 이벤트
```

세 가지 트리거가 선언되어 있는데 그중 `repository_dispatch`가 Vault 저장소와 연결되는 중요한 고리다.  Vault 워크 플로우에서 블로그 배포 워크플로우를 실행하기 위해 필요하다.

**두 브랜치 병합**
```yaml
- uses: actions/checkout@v4  # master 브랜치 체크아웃
- uses: actions/checkout@v4
  with:
    path: ./sync
    ref: auto-sync  # auto-sync 브랜치를 sync 폴더에
    
- name: Copy posts
  run: |
    rm -rf ./src/content/blog ; mkdir -p ./src/content/blog
    rm -rf ./static/posts ; mkdir -p ./static/posts
    cp -r ./sync/output/posts/*.md ./src/content/blog  # 전처리된 포스트 복사
    cp -r ./sync/output/static/posts/* ./static/posts  # 이미지 등 정적 파일
```

`master` 브랜치의 코드와 `auto-sync` 브랜치의 콘텐츠를 합쳐서 빌드한다. 이 방식으로 코드와 콘텐츠의 완벽한 분리를 달성했다.
#### 보안 고려사항

두 워크플로우 모두 `${{ secrets.GH_TOKEN }}`을 사용한다. 이 토큰은:
- Blog 리포에만 읽기,쓰기 권한 부여
- 최소한의 권한만 가진 Fine-grained PAT 사용

이렇게 하면 정말 만에하나 토큰이 노출되더라도 피해를 최소화할 수 있다.

#### 왜 이렇게 복잡하게?

단순히 "글 하나 발행하는데 뭘 이렇게 복잡하게 만들었나" 싶을 수도 있다.  하지만 이로인해 ...

1. **완벽한 관심사 분리**: 글쓰기와 코딩이 서로 방해하지 않는다
2. **충돌 없는 협업**: 자동화와 수동 작업이 평화롭게 공존한다
3. **확장 가능성**: 전처리기, 번역, 크로스포스팅 등 기능 추가가 쉽다
4. **보안**: 개인 Vault와 블로그 컨텐츠간의 분리

결국 복잡해 보이는 이 시스템도 **글쓰기에만 집중하고 싶다** 는 단순한 욕구에서 시작됐다. 때로는 단순한 목표를 달성하기 위해 복잡한 여정을 거쳐야 할 때도 있는 법이다.

## 이 포스트에서 다루지 않은 것들

Obsidian에서 작성한 글은 기본적으로 마크다운 형식을 따르지만, 이를 그대로 블로그에 적용하기는 어려웠다. 그래서 별도의 전처리기를 만들어야 했고, 이 과정에서 마주한 여러 문제들이 있었다. 이번 글에서는 다루지 않았지만, 기회가 되면 따로 정리해 올릴 예정이다.

1. **Obsidian 문법**  
    Obsidian은 자체적인 마크다운 확장 문법을 사용한다. 예를 들어 `![[image.png]]` 형태의 이미지 임베드나 `[[다른 노트]]`와 같은 위키링크는 기본 마크다운 렌더러에서 그대로 표시되지 않는다. 따라서 이를 변환해 주는 전처리 과정이 필수였다.
    
2. **이미지 경로와 에셋 관리**  
    Obsidian Vault의 이미지 파일은 보통 노트와 같은 폴더에 저장되지만, 웹에서는 일반적으로 `/assets/images/`와 같은 통합 경로를 사용한다. 빌드 시점에 이미지를 올바른 위치로 복사하고, 경로를 수정하는 작업이 필요했다.
    
3. **Mermaid Diagram 지원**  
    이 포스트에서는 mermaid.js를 이용해 다이어그램을 작성했다. 하지만 정적 사이트 빌드 과정에서 이를 그대로 표현하려면, 동적 렌더링을 지원하는 별도의 처리 방식이 필요했다.
    
4. **다국어 지원과 AI 번역**  
    블로그를 한국어, 영어, 일본어로 제공하고 싶었다. 하지만 매번 세 언어로 직접 작성하기는 어렵고, 나의 외국어 실력도 한계가 있어 AI 번역을 도입했다. 다만 번역 과정에서 마크다운 문법이 변형되거나 깨지는등 다양한 문제가 있어 프롬프트를 몇번 수정하는 일이 있었다.



> 💡 **전처리기가 궁금하다면**
> 
> 비공개 저장소를 제외한 전체 코드는 이미 [GitHub 저장소](https://github.com/ironpark/ironpark.github.io)에서 확인할 수 있다. 특히 전처리기 구현이 궁금하다면 `auto-sync` 브랜치를 확인해보자.


## 앞으로의 계획

현재는 `published` 메타데이터로 발행 여부를 관리하고 있지만, 앞으로는 예약 발행 시스템을 만들어 “정해진 날짜에 조용히 글이 올라가는” 방식을 시도해볼 예정이다.  

이외에도 일정 시간이 지나면 Velog, Medium 등 다른 플랫폼으로 자동 크로스 포스팅을 하거나, 발행과 동시에 Twitter(X), LinkedIn 같은 SNS에 요약과 링크를 뿌리는 기능도 생각중이나 언제 구현할지는 아직 미지수로 남아 있다.