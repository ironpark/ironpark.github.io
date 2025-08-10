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

In [Last Post](/blog/my-ideal-dev-blog), I talked about why I created my blog and the reasoning behind my technology choices. This time, I want to discuss why publishing even a single post on that blog is so complicated, and how I tried to untangle that process.

The biggest inconvenience I felt while running a static blog based on GitHub Pages was **the publishing process itself**.

Since there’s no separate database or server environment, there’s no management page or dedicated editor. As a result, the basic writing flow—drafting → saving → editing → publishing—is not smooth. Moreover, having blog posts and frontend code mixed in the same repository is almost a disaster for someone like me who easily gets sidetracked. That’s why **separation of concerns** was desperately needed.

### Everyone Has a Plausible Plan
![get punched in the face](/posts/blog-auto-publishing-with-obsidian/get-punched-in-the-face.jpg)

**The original plan was:**
1. Write posts in Obsidian
2. A Git plugin automatically syncs to a personal repository
3. GitHub Actions automatically deploy posts to the blog repository

I was confident this would create a perfect system where I could write and deploy posts immediately from my smartphone, tablet, or desktop. I’d just focus on writing in Obsidian, and the rest would be handled magically by GitHub Actions automation... such a beautiful plan.

Though it worked perfectly in my head, in reality, many hidden pitfalls emerged.

> Everyone has a plausible plan — until they get punched in the face.

## Exploring Solutions

### First Plan

![blog-auto-publishing-with-obsidian.en.md 1 mermaid image](/posts/blog-auto-publishing-with-obsidian/blog-auto-publishing-with-obsidian.en-1.svg)

The biggest concern was **the entanglement of automatic commits and manual commits in the same repository**.  
What happens if GitHub Actions automatically commits and deploys posts while I’m editing CSS or layout locally?

Most likely, when I try to push, the remote repository will already have commits created by automation. In that case, `git push` will be rejected, and I’ll have to go through the hassle of `git reset HEAD^ & git pull` to resolve conflicts.

Because of automation meant to publish posts, I almost became a **full-time conflict manager**.

### Second Plan

The root cause of the problem was that the automation process was committing blog posts directly to the main branch.

So, what if **posts were fetched dynamically at build time?**

![blog-auto-publishing-with-obsidian.en.md 2 mermaid image](/posts/blog-auto-publishing-with-obsidian/blog-auto-publishing-with-obsidian.en-2.svg)

This completely separates the post repository and the blog code repository. Each commits independently in their own domain and only meet at build time. Conflicts? Such a thing simply cannot happen in this structure.

However, this structure had a fatal flaw: **a public repository would have to fetch data from a private repository**. This is a reverse access pattern that violates common security principles.

My Obsidian Vault is not just a simple blog repository. It’s my personal digital brain containing private diaries, work notes, project ideas, and sometimes sensitive information. Having a public blog access this personal repository felt unsettling.

- Risk of sensitive information leaking in public repository’s Actions logs
- Security risk of exposing the entire Vault if tokens are stolen
- Risk of accidentally including private files in the build process

Most of all, because I don’t trust myself, this plan was discarded.

### Final Plan  
~~Revision-v3-v3final-last-final.doc~~

![Neon Genesis Evangeliongendo Ikari Gendo](/posts/blog-auto-publishing-with-obsidian/Neon-Genesis-Evangeliongendo-Ikari-Gendo.jpg)
> Post publishing system ~~Humanity~~ Enhancement Plan Final Version

After thinking hard, I found my own answer. What if I automatically commit to the blog repository as originally planned, but use a separate branch?

![blog-auto-publishing-with-obsidian.en.md 3 mermaid image](/posts/blog-auto-publishing-with-obsidian/blog-auto-publishing-with-obsidian.en-3.svg)

- Vault’s GitHub Actions process posts and push to the blog repository’s `auto-sync` branch
- Blog’s build process checks out both `master` and `auto-sync` branches, merges, then builds
- Design or code edits are committed directly to the `master` branch as usual

This structure completely eliminates the possibility of conflicts while securely connecting the two repositories.

## The Plan Is Perfect

### Actual Implementation

Developers speak with code, don’t they? Below is the GitHub Actions file that realizes the above plan.

**Obsidian Vault (Private Repository)**

```yaml
name: Contents Sync
# This workflow syncs contents between the main branch and the blog branch.
on:
  workflow_dispatch:
  push:
    # To avoid unnecessary workflow re-runs, only run when specific files change
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

### Taking a Closer Look

No matter how much developers speak with code, it feels too cold to just drop code and disappear. For anyone who might want to try this, let’s dissect how these two GitHub Actions workflows work together.

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

Using the `paths` filter, it runs **only when blog-related files change**. This prevents unnecessary builds and saves GitHub Actions free tier minutes (2,000 per month). Also, don’t forget to set `.gitignore` properly so unnecessary files aren’t committed in the first place.

**Checking out Both Repositories Simultaneously**
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

Within one workflow, **two repositories are checked out into different paths**. This allows simple `cp` commands to move files without complex scripts. The token is set for later commit and push operations.

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

First, markdown files and images from the Vault are copied into the blog repository’s `auto-sync` branch. Then `pnpm build` runs the preprocessor in the blog repo.

This preprocessor performs tasks like:
- Converting Obsidian’s `![[image.png]]` syntax to standard markdown
- AI translation (for multilingual support)
- Other preprocessing tasks

This preprocessor plays a key role in building this blog but I’ll skip the details for now.

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
  if: steps.check_changes.outputs.changes == 'true'  # Only if there are changes
```

After preprocessing, it commits only if there are actual changes. This prevents unnecessary commits and deployments when nothing has changed.

**Triggering Blog Build**
```yaml
- name: Run Publish
  run: gh api /repos/ironpark/ironpark.github.io/dispatches -f event_type='post-sync'
```

This uses GitHub CLI to trigger a `repository_dispatch` event in the blog repository. This is the key link connecting the two workflows. The `event_type` acts as a label to indicate why the trigger happened.

#### Blog Repository Workflow Analysis

Now, let’s look at the blog repository’s `Build and Deploy to Pages` workflow.

**Supports Multiple Triggers**
```yaml
on:
  push:
    branches: ["master"]  # When code changes
  workflow_dispatch:      # Manual run
  repository_dispatch:    
    types: [ post-sync ]  # Event sent from Vault
```

There are three triggers declared. Among them, `repository_dispatch` is the crucial link to the Vault repository. It’s needed to run the blog deployment workflow from the Vault workflow.

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

It merges the code from the `master` branch and the content from the `auto-sync` branch to build the site. Finally, the perfect separation of code and content is achieved.

#### Security Considerations

Both workflows use `${{ secrets.GH_TOKEN }}`. This token:

- Grants read/write permission only to the blog repo
- Uses a fine-grained PAT with minimal permissions

This minimizes damage even if the token is accidentally exposed.

### Why So Complicated?

You might wonder, “Why make it so complicated just to publish a single post?” But the benefits gained are far from trivial.

1. **Perfect separation of concerns**: Writing and coding don’t interfere with each other  
2. **Conflict-free collaboration**: Automation and manual work coexist peacefully  
3. **Extensibility**: Easy to add features like preprocessors, translation, cross-posting  
4. **Security**: Clear separation between personal Vault and blog content

In the end, this seemingly complex system started from a simple desire to **just focus on writing**. Sometimes, achieving a simple goal requires a complex journey.

## What’s Not Covered

Posts written in Obsidian basically follow markdown format, but applying them directly to the blog was difficult. So I had to create a separate preprocessor and encountered various issues along the way. I didn’t cover them here, but I plan to write about them separately when I get the chance.

1. **Obsidian Syntax**  
    Obsidian uses its own markdown extensions. For example, image embeds like `![[image.png]]` or wikilinks like `[[Other Note]]` don’t render properly in standard markdown renderers. So a preprocessing step to convert these was essential.
    
2. **Image Paths and Asset Management**  
    Obsidian Vault images are usually stored in the same folder as notes, but on the web, unified paths like `/assets/images/` are commonly used. At build time, images need to be copied to the correct location and paths adjusted.
    
3. **Mermaid Diagram Support**  
    This post uses mermaid.js for diagrams. I made custom components to support this, but for some reason, they didn’t render properly. So I switched to generating SVG files during preprocessing.
    
4. **Multilingual Support and AI Translation**  
    I wanted the blog in Korean, English, and Japanese. Writing in all three languages every time was difficult, and my language skills limited, so I introduced AI translation. However, markdown syntax sometimes broke or got distorted during translation, requiring multiple prompt revisions.

## Future Plans

Currently, I manage publishing status with the `published` metadata, but I plan to build a scheduled publishing system that “quietly posts on a set date.”

Also, I’m considering automatic cross-posting to platforms like Velog or Medium after a certain time, or posting summaries and links to social media like Twitter (X) and LinkedIn upon publishing, though when these will be implemented remains uncertain.

> 💡 **If you want to know more**  
> 
> All code except the private Vault repository is already available on the [GitHub repository](https://github.com/ironpark/ironpark.github.io). If you’re curious about the preprocessor implementation, check the `auto-sync` branch.