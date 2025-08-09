---
created: '2025-07-28T14:30:00.000Z'
updated: '2025-08-08T14:50:00.000Z'
published: true
slug: blog-auto-publishing-with-obsidian
title: Automatic Blog Publishing (feat. Obsidian)
subTitle: Everyone Has a Pretty Good Plan
description: >-
  A fully automated system that publishes your writings to the website
  automatically once you write and save in Obsidian. An environment built with
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

In [[나만의 블로그를 만들다|My Own Blog Creation|previous post]], I talked about why I decided to create a blog and how I chose the technologies. This time, I want to discuss why publishing even a single post on that blog is so complicated and how I tried to untangle that process.

The biggest inconvenience I felt while running a static blog based on GitHub Pages is **the publishing process itself**.

Since there’s no separate database or server environment, there’s no management page or dedicated editor. As a result, the basic writing flow — draft → save → edit → publish — is not smooth. On top of that, having blog posts and frontend code mixed in the same repository is almost a disaster for me, who easily gets sidetracked. So, **separation of concerns** was desperately needed.

### Everyone Has a Plausible Plan
![get punched in the face](/posts/blog-auto-publishing-with-obsidian/get-punched-in-the-face.jpg)

**The original plan was this:**
1. Write posts in Obsidian
2. A Git plugin automatically syncs to a personal repository
3. GitHub Actions automatically deploy posts to the blog repository

I was confident this would be a perfect system to write and deploy posts instantly from smartphones, tablets, or desktops. Just focus on writing in Obsidian, and let GitHub Actions’ automation magic handle the rest... such a beautiful plan.

Although it worked perfectly in my head, in reality, there were more hidden pitfalls than I expected.

> Everyone has a plausible plan — until they get punched in the face.

## Exploring Solutions

### First Plan


![blog-auto-publishing-with-obsidian.en.md 1 mermaid image](/posts/blog-auto-publishing-with-obsidian/blog-auto-publishing-with-obsidian.en-1.svg)

The biggest concern was **the entanglement of automatic commits and manual commits in the same repository**.  
What if GitHub Actions automatically commits and deploys posts while I’m modifying CSS or layout locally?

Most likely, at the moment I try to push, the remote repository will already have commits created by automation. In that case, `git push` will be rejected, and I’ll have to go through the tedious process of `git reset HEAD^ & git pull` to resolve conflicts.

Because of automation created to publish posts, I almost became a **full-time conflict manager**.

### Second Plan
The root problem was that the automation process committed blog posts directly to the main branch.

So, what if we **fetch posts dynamically at build time?**

![blog-auto-publishing-with-obsidian.en.md 2 mermaid image](/posts/blog-auto-publishing-with-obsidian/blog-auto-publishing-with-obsidian.en-2.svg)

This completely separates the post repository and the blog code repository. Each commits independently in its own domain and only meets at build time. Conflicts? Such things simply cannot happen in this structure.

However, this structure had a fatal flaw: **a public repository had to fetch data from a private repository**. This reversed access goes against common security principles.

My Obsidian Vault is not just a simple blog repository. It’s my personal digital brain containing private diaries, work notes, project ideas, and sometimes sensitive information. Having a public blog access this personal repository felt inherently unsafe.

- Risk of sensitive information leaking in public repository’s Actions logs
- Security risk of entire Vault exposure if token is compromised
- Risk of accidentally including private files during the build process

Above all, because I don’t trust myself, this plan was discarded.

### Final Plan
~~Revision-v3-v3final-last-reallyfinal.doc~~

![Neon Genesis Evangeliongendo Ikari Gendo](/posts/blog-auto-publishing-with-obsidian/Neon-Genesis-Evangeliongendo-Ikari-Gendo.jpg)
> Final version of the post publishing system ~~humanity~~ enhancement plan

After much thinking, I found my own answer. **What if we commit automatically to the blog repository as originally planned, but use a separate branch?**

![blog-auto-publishing-with-obsidian.en.md 3 mermaid image](/posts/blog-auto-publishing-with-obsidian/blog-auto-publishing-with-obsidian.en-3.svg)In this structure:
- GitHub Actions in the Vault processes posts and pushes to the blog repository’s `auto-sync` branch
- The blog’s build process checks out and merges both `master` and `auto-sync` branches before building
- Design or code modifications are committed directly to the `master` branch as usual

This structure completely eliminates the possibility of conflicts while securely connecting the two repositories.

## Actual Implementation

Developers speak with code, don’t they? Below is the GitHub Actions file that implements the above plan.

**Obsidian Vault (Private Repository)**

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

**Blog (Frontend) [Repository](https://github.com/ironpark/ironpark.github.io)**

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

### A Closer Look

No matter how much developers speak with code, just dropping code and disappearing feels too cold. For anyone who might want to try this, let me dissect how these two GitHub Actions workflows work together.

Though it looks complicated at first glance, each has a clear role, so read on step by step.

#### Vault Repository Workflow Analysis

First, the `Contents Sync` workflow in the Obsidian Vault repository.

**Trigger Conditions**
```yaml
on:
  workflow_dispatch:            # Can be run manually
  push:
    paths:
      - "2.Areas/Blog/*.md"     # Only when blog posts change
      - ".github/workflows/**"  # Or workflow files change
    branches:
      - main
```

Using the `paths` filter, it runs **only when blog-related files change**. This prevents unnecessary builds and saves GitHub Actions free tier minutes (2,000 minutes/month). Also, don’t forget to set `.gitignore` properly so unnecessary files don’t get committed in the first place.

**Checking out Two Repositories Simultaneously**
```yaml
- name: Checkout brain repository
  uses: actions/checkout@v4
  with:
    path: brain     # Check out current repo (vault) into brain folder
    
- name: Checkout contents repository
  uses: actions/checkout@v4
  with:
    repository: ironpark/ironpark.github.io # From blog’s GitHub repo
    ref: auto-sync  # auto-sync branch
    path: contents  # into contents folder
    token: ${{ secrets.GH_TOKEN }}  # Token for external repo access
```

This workflow checks out **two repositories into different paths**. This allows simple `cp` commands to move files, enabling easy synchronization without complex scripts. The token is set to allow commit and push later.

**Post Preprocessing**
```yaml
- name: Sync Contents  # Remove old files, create directories, copy markdown posts & images
  run: |
    rm -rf contents/{posts,assets,output}
    mkdir -p contents/{posts,assets}
    cp -r brain/2.Areas/Blog/*.md contents/posts/
    cp -r brain/Z.Assets/* contents/assets/

- name: Build Contents # Run preprocessing (Obsidian syntax conversion, translation, etc.)
  working-directory: contents
  run: |
    pnpm build
```

First, markdown files and images are copied from Vault to the blog repository’s `auto-sync` branch. Then `pnpm build` runs the preprocessor inside the blog repo.

This preprocessor performs:
- Conversion of Obsidian’s `![[image.png]]` syntax to standard markdown
- AI translation (multilingual support)
- Other preprocessing tasks...

This preprocessor is a core part of this blog’s setup but I’ll skip details for now.

**Checking for Changes and Conditional Push**
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
  if: steps.check_changes.outputs.changes == 'true'  # Only if changes exist
```

After preprocessing, it commits only if there are actual changes. This avoids unnecessary commits and deployments if content hasn’t changed.

**Triggering Blog Build**
```yaml
- name: Run Publish
  run: gh api /repos/ironpark/ironpark.github.io/dispatches -f event_type='post-sync'
```

Using GitHub CLI, it triggers a `repository_dispatch` event on the blog repository. This is the key link connecting the two workflows. The `event_type` acts like a label to distinguish why the trigger happened.

#### Blog Repository Workflow Analysis

Now, let’s look at the blog repository’s `Build and Deploy to Pages` workflow.

**Supporting Multiple Triggers**
```yaml
on:
  push:
    branches: ["master"]  # When code changes
  workflow_dispatch:      # Manual run
  repository_dispatch:    
    types: [ post-sync ]  # Event sent from Vault
```

Three triggers are declared, among which `repository_dispatch` is the important link to the Vault repository. The Vault workflow uses this to trigger the blog deployment workflow.

**Merging Two Branches**
```yaml
- uses: actions/checkout@v4  # Checkout master branch
- uses: actions/checkout@v4
  with:
    path: ./sync
    ref: auto-sync  # Checkout auto-sync branch into sync folder
    
- name: Copy posts
  run: |
    rm -rf ./src/content/blog ; mkdir -p ./src/content/blog
    rm -rf ./static/posts ; mkdir -p ./static/posts
    cp -r ./sync/output/posts/*.md ./src/content/blog  # Copy preprocessed posts
    cp -r ./sync/output/static/posts/* ./static/posts  # Static files like images
```

It builds by combining the code from the `master` branch and the content from the `auto-sync` branch. This achieves perfect separation of code and content.

#### Security Considerations

Both workflows use `${{ secrets.GH_TOKEN }}`. This token is:
- Granted read/write permissions only on the Blog repo
- A fine-grained PAT with minimal permissions

This minimizes damage even if the token is accidentally exposed.

#### Why So Complicated?

You might wonder, “Why make it so complicated just to publish a single post?” But what I gained from this complexity is far from trivial.

1. **Perfect separation of concerns**: Writing and coding don’t interfere
2. **Conflict-free collaboration**: Automation and manual work coexist peacefully
3. **Extensibility**: Easy to add features like preprocessors, translation, cross-posting
4. **Security**: Separation between personal Vault and blog content

Ultimately, this seemingly complex system started from a simple desire to **focus solely on writing**. Sometimes, achieving a simple goal requires a complicated journey.

## What’s Not Covered

Posts written in Obsidian basically follow markdown format, but applying them directly to the blog was difficult. So I had to create a separate preprocessor and faced various issues during that process. I didn’t cover those in this post but plan to write about them separately when I get the chance.

1. **Obsidian Syntax**  
    Obsidian uses its own markdown extensions. For example, image embeds like `![[image.png]]` or wikilinks like `[[Other Note]]` don’t render properly in standard markdown renderers. So a preprocessing step to convert these was essential.
    
2. **Image Paths and Asset Management**  
    Obsidian Vault stores image files usually in the same folder as notes, but on the web, unified paths like `/assets/images/` are commonly used. At build time, images had to be copied to the correct location and paths adjusted.
    
3. **Mermaid Diagram Support**  
    This post uses mermaid.js for diagrams. I created custom components to support this, but for some reason it didn’t render properly. So I switched to generating SVG files during preprocessing.
    
4. **Multilingual Support and AI Translation**  
    I wanted the blog to support Korean, English, and Japanese. Writing all three languages manually every time was hard, and my foreign language skills are limited, so I introduced AI translation. However, markdown syntax sometimes got corrupted during translation, requiring multiple prompt refinements.

## Future Plans

Currently, post publication is managed by `published` metadata, but I plan to create a scheduled publishing system that “quietly posts on a set date.”

Besides that, I’m considering automatic cross-posting to platforms like Velog and Medium after a certain time, or posting summaries and links to social media like Twitter (X) and LinkedIn upon publishing. But when or if these will be implemented is still unknown.

> 💡 **If you want to know more**
> 
> The entire code except for the private Vault repository is already available at the [GitHub repository](https://github.com/ironpark/ironpark.github.io). If you’re curious about the preprocessor implementation, check out the `auto-sync` branch.