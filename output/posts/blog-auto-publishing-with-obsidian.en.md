---
created: '2025-07-28T14:30:00.000Z'
updated: '2025-08-08T14:50:00.000Z'
published: true
slug: blog-auto-publishing-with-obsidian
title: Automatic Blog Publishing (feat. Obsidian)
subTitle: Everyone Has a Plausible Plan
description: >-
  A fully automated system that automatically publishes your writing to the
  website just by writing and saving in Obsidian. An environment built with
  GitHub Actions and Git synchronization, allowing you to focus solely on
  writing.
series: 똑똑한 블로그 만들기
categories:
  - Dev
tags:
  - obsidian
  - github-actions
  - automation
  - workflow
  - markdown
lang: en
thumbnail: null
originalLang: ko
---
## Why Is Publishing a Single Post So Complicated?

In the [Last Post](/blog/my-ideal-dev-blog), I talked about the reasons for creating my own blog and the rationale behind the technology choices. This time, I want to discuss why publishing even a single post on the blog I built is so complicated, and how I tried to untangle that process.

The biggest inconvenience I felt while running a static blog based on GitHub Pages was **the publishing process itself**.

Since there’s no separate database or server environment, there’s no management page or dedicated editor. As a result, the basic writing flow—drafting → saving → editing → publishing—is not smooth. On top of that, having blog posts and frontend code mixed in one repository is almost a disaster for me, who easily gets sidetracked. That’s why **separation of concerns** was desperately needed.

### Everyone Has a Plausible Plan
![get punched in the face](/posts/blog-auto-publishing-with-obsidian/get-punched-in-the-face.jpg)

**The initial plan was like this:**
1. Write posts in Obsidian
2. A Git plugin automatically syncs to the personal repository
3. GitHub Actions automatically deploy posts to the blog repository

I was confident this would be a perfect system allowing me to write and immediately deploy posts from my smartphone, tablet, or desktop. I could focus solely on writing in Obsidian, and the rest would be handled automatically by the magic of GitHub Actions... It was such a beautiful plan...

Though it worked perfectly in my head, in reality, there were more hidden pitfalls than I expected.

> Everyone has a plausible plan  ~~until they get punched in the face~~

## Exploring Solutions

### First Plan

![blog-auto-publishing-with-obsidian.en.md 1 mermaid image](/posts/blog-auto-publishing-with-obsidian/blog-auto-publishing-with-obsidian.en-1.svg)

The biggest concern was **the situation where automatic commits and manual commits get tangled in the same repository**.  
What happens if GitHub Actions automatically commits and deploys posts while I’m editing CSS or layout locally?

Most likely, the moment I try to push, the remote repository already has commits created by automation. In that case, `git push` will be rejected, and I’ll have to go through the tedious process of `git reset HEAD^ & git pull` to resolve conflicts.

Because of the automation made to publish posts, I almost became a **full-time conflict manager**.

### Second Plan
The root cause of the problem was that the automation process commits blog posts directly to the main branch.

So, what if **posts are fetched dynamically at build time?**

![blog-auto-publishing-with-obsidian.en.md 2 mermaid image](/posts/blog-auto-publishing-with-obsidian/blog-auto-publishing-with-obsidian.en-2.svg)

This way, **the post repository and the blog code repository are completely separated**. Each commits independently in their own domain and only meet at build time. Conflicts? That kind of problem simply can’t happen.

However, this structure had a fatal flaw. **The public repository had to fetch data from the private repository.** This was a reverse access that violates common security principles.

My Obsidian Vault is not just a simple blog repository. It’s my personal digital brain containing private diaries, work notes, project ideas, and sometimes sensitive information. The idea that a public blog would access such a personal repository made me uneasy.

- Sensitive information might be exposed in the public repository’s Actions logs
- If tokens are stolen, the entire Vault could be compromised
- Risk of accidentally including private files in the build process

Above all, because I don’t trust myself, this plan was discarded.

### The Final?

![Neon Genesis Evangeliongendo Ikari Gendo](/posts/blog-auto-publishing-with-obsidian/Neon-Genesis-Evangeliongendo-Ikari-Gendo.jpg)
> Post publishing system ~~Humanity~~ Enhancement plan final version

So I changed my approach. **What if I commit automatically to the blog repository as originally planned, but use a separate branch?**

![blog-auto-publishing-with-obsidian.en.md 3 mermaid image](/posts/blog-auto-publishing-with-obsidian/blog-auto-publishing-with-obsidian.en-3.svg)

In this structure:
- GitHub Actions in the Vault process posts and push them to the blog repository’s `auto-sync` branch
- The blog’s build process checks out and merges both `master` and `auto-sync` branches before building
- Design or code edits are committed directly to the `master` branch as usual

This structure completely eliminates the possibility of conflicts while securely linking the two repositories without security issues.

## Things Not Covered in This Post

Posts written in Obsidian basically follow Markdown format, but applying them directly to the blog was difficult. So I had to create a separate preprocessor, and encountered various issues during that process. I didn’t cover those here, but I plan to organize and share them separately when I get the chance.

1. **Obsidian Syntax**  
    Obsidian uses its own Markdown extension syntax. For example, image embeds like `![[image.png]]` or wikilinks like `[[another note]]` don’t render properly in a standard Markdown renderer. So a preprocessing step to convert these was essential.
    
2. **Image Paths and Asset Management**  
    Obsidian Vault’s image files are usually stored in the same folder as notes, but on the web, unified paths like `/assets/images/` are generally used. At build time, images had to be copied to the correct location and paths adjusted.
    
3. **Mermaid Diagram Support**  
    This post used mermaid.js for diagrams. However, to render these properly in a static site build, a separate handling method supporting dynamic rendering was needed.
    
4. **Multilingual Support and AI Translation**  
    I wanted to offer the blog in Korean, English, and Japanese. Writing in all three languages every time was difficult, and my foreign language skills are limited, so I introduced AI translation. However, the Markdown syntax sometimes got distorted or broken during translation, requiring multiple prompt adjustments.

## Implementation

### Obsidian Vault Repository

```yaml
name: Contents Sync
# This workflow syncs contents between the main branch and the blog branch.
on:
  workflow_dispatch:
  push:
    # Run only when specific files change to avoid unnecessary workflow reruns
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
            echo "::set-output name=changes::false"
          else
            echo "::set-output name=changes::true"
          fi
      # Push Contents if there are any changes
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

### Blog (Frontend) Repository

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

## Future Plans

Currently, post publication status is managed by the `published` metadata, but in the future, I plan to build a scheduled publishing system to quietly post articles on predetermined dates.

Besides that, I’m also considering features like automatically cross-posting to other platforms like Velog or Medium after a certain time, or posting summaries and links to social media like Twitter (X) and LinkedIn simultaneously with publication. However, when these will be implemented is still uncertain...

> It’s still at the idea stage, but my goal is to push GitHub Actions to the limits of the free tier. (At this point, it feels less like the machine is being worked hard and more like I am.)

---

> 💡 **If you’re curious about this automation system**
> 
> The full code is available in the [GitHub repository](https://github.com/ironpark/ironpark.github.io).  
> Especially check out the action files in the `.github/workflows/` folder for detailed implementation.
>
> If you want to build a similar system, feel free to ask questions anytime. Let’s create a better writing environment together.