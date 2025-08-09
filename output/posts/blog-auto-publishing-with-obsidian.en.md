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

In [Last Post](/blog/my-ideal-dev-blog), I talked about the reasons for creating my own blog and the rationale behind the technology choices. This time, I want to discuss why publishing even a single post on that blog is so complicated, and how I tried to untangle that process.

The biggest inconvenience I felt while running a static blog based on GitHub Pages was **the publishing process itself**.

Since there is no separate database or server environment, there is no management page or dedicated editor. As a result, the basic writing flow of draft → save → edit → publish is not smooth. Moreover, having blog posts and frontend code mixed in one repository is almost a disaster for me, who easily gets sidetracked. That’s why **separation of concerns** was desperately needed.

### Everyone Has a Plausible Plan
![get punched in the face](/posts/blog-auto-publishing-with-obsidian/get-punched-in-the-face.jpg)

**The original plan was this:**
1. Write posts in Obsidian
2. A Git plugin automatically syncs to my personal repository
3. GitHub Actions automatically deploy posts to the blog repository

I was confident this would be a perfect system where I could write and deploy posts instantly from my smartphone, tablet, or desktop. I would focus solely on writing in Obsidian, and GitHub Actions’ automation magic would handle the rest... such a beautiful plan.

Although it worked perfectly in my head, in reality, there were more hidden pitfalls than I expected.

> Everyone has a plausible plan — until they get punched in the face.

## Exploring Solutions

### First Plan


![blog-auto-publishing-with-obsidian.en.md 1 mermaid image](/posts/blog-auto-publishing-with-obsidian/blog-auto-publishing-with-obsidian.en-1.svg)

The biggest concern was the **entanglement of automated commits and manual commits within one repository**.  
What happens if GitHub Actions automatically commits and deploys posts while I’m editing CSS or layout locally?

Most likely, the moment I try to push, the remote repository will already contain commits created by automation. In that case, `git push` will be rejected, and I’ll have to go through the tedious process of `git reset HEAD^ & git pull` to resolve conflicts.

Because of the automation I built to publish posts, I almost became a **full-time conflict manager**.

### Second Plan
The root cause was that the automation process committed blog posts directly to the main branch.

So, what if **posts were fetched dynamically at build time?**
![blog-auto-publishing-with-obsidian.en.md 2 mermaid image](/posts/blog-auto-publishing-with-obsidian/blog-auto-publishing-with-obsidian.en-2.svg)


This completely separates the post repository and the blog code repository. Each commits independently in their own domain, meeting only at build time. Conflicts? That structure makes them impossible.

But this structure had a fatal flaw: **a public repository would have to fetch data from a private repository**. This is a reverse access that violates common security principles.

My Obsidian Vault is not just a blog repository. It is my personal digital brain containing private diaries, work notes, project ideas, and sometimes sensitive information. The idea of a public blog accessing such a personal repository was unsettling.

- Risk of sensitive information leaking in public repository’s Actions logs
- Security risk of the entire Vault being exposed if tokens are compromised
- Risk of accidentally including private files in the build process

Most of all, because I don’t trust myself, this plan was discarded.

### The Final?

![Neon Genesis Evangeliongendo Ikari Gendo](/posts/blog-auto-publishing-with-obsidian/Neon-Genesis-Evangeliongendo-Ikari-Gendo.jpg)
> Post publishing system ~~humanity~~ improvement plan final version

So I changed my approach. **What if I automatically commit to the blog repository as originally planned, but use a separate branch?**
![blog-auto-publishing-with-obsidian.en.md 3 mermaid image](/posts/blog-auto-publishing-with-obsidian/blog-auto-publishing-with-obsidian.en-3.svg)In this structure:
- GitHub Actions in the Vault pushes processed posts to the blog repository’s `auto-sync` branch
- The blog’s build process checks out and merges both `master` and `auto-sync` branches before building
- Design or code edits are committed directly to the `master` branch as usual

This structure completely eliminates the possibility of conflicts while securely connecting the two repositories.

## What This Post Didn’t Cover

Although posts written in Obsidian basically follow Markdown format, applying them directly to the blog was difficult. So I had to create a separate preprocessor, and encountered several issues during that process. I didn’t cover them here, but I plan to write about them separately when I get the chance.

1. **Obsidian Syntax**  
    Obsidian uses its own Markdown extensions. For example, image embeds like `![[image.png]]` or wikilinks like `[[another note]]` don’t render properly in standard Markdown renderers. So a preprocessing step to convert these was essential.
    
2. **Image Paths and Asset Management**  
    Images in the Obsidian Vault are usually stored in the same folder as notes, but on the web, unified paths like `/assets/images/` are commonly used. At build time, images had to be copied to the correct location and paths adjusted.
    
3. **Mermaid Diagram Support**  
    This post used mermaid.js for diagrams. However, to render these properly in a static site build, a separate approach supporting dynamic rendering was needed.
    
4. **Multilingual Support and AI Translation**  
    I wanted to offer the blog in Korean, English, and Japanese. Writing in all three languages manually every time was difficult, and my foreign language skills are limited, so I introduced AI translation. However, there were various issues such as Markdown syntax breaking or being altered during translation, requiring multiple prompt adjustments.

## Implementation
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

      - name: Sync Contents
        run: |
          # Clean up old contents (posts, assets, output)
          rm -rf /contents/{posts,assets,output}
          
          # Create directories and copy files
          mkdir -p /contents/{posts,assets}
          cp -r /brain/2.Areas/Blog/*.md /contents/posts/ 2>/dev/null || echo "No markdown files found"
          cp -r /brain/Z.Assets/* /contents/assets/* 2>/dev/null || echo "No image assets found"
      
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
            echo "No changes detected"
          else
            echo "changes=true" >> $GITHUB_OUTPUT
            echo "Changes detected"
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
## Future Plans

Currently, publication status is managed with the `published` metadata, but I plan to build a scheduled publishing system that “quietly posts articles on predetermined dates.”

I’m also considering automatic cross-posting to other platforms like Velog or Medium after a certain period, or posting summaries and links to social media like Twitter (X) and LinkedIn simultaneously with publication. However, when or if these will be implemented is still uncertain.

> For now, it’s just an idea, but my goal is to squeeze every bit out of GitHub Actions’ free tier. (At this point, it feels less like the machine is working and more like I’m being overworked.)

---

> 💡 **If you’re curious about this automation system**
> 
> The full code is available on the [GitHub repository](https://github.com/ironpark/ironpark.github.io).  
> Especially check out the action files in the `.github/workflows/` folder for detailed implementation.
>
> If you want to build a similar system, feel free to ask questions anytime. Let’s create a better writing environment together.