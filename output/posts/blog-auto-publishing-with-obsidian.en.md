---
created: 2025-07-28T14:30:00.000Z
updated: 2025-08-08T14:50:00.000Z
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

In [Last Post](/blog/my-ideal-dev-blog), I talked about why I decided to create a blog and how I chose the technology stack. This time, I want to discuss why publishing even a single post on that blog feels so complicated, and how I tried to untangle that process.

The biggest inconvenience I felt while running a static blog based on GitHub Pages is **the publishing process itself**.

Since there’s no separate database or server environment, there’s no management page or dedicated editor. As a result, the basic writing flow—drafting → saving → editing → publishing—is not smooth. On top of that, having blog posts and frontend code mixed in one repository is nearly a disaster for someone like me who easily gets sidetracked. So, **separation of concerns** became absolutely necessary.

### Everyone Has a Plausible Plan
![get punched in the face](/posts/blog-auto-publishing-with-obsidian/get-punched-in-the-face.jpg)

**The original plan was like this:**
1. Write posts in Obsidian
2. A Git plugin automatically syncs to the personal repository
3. GitHub Actions automatically deploy posts to the blog repository

I was confident this would be a perfect system where I could write and instantly publish from my smartphone, tablet, or desktop. I would focus solely on writing in Obsidian, and the rest would be magically handled by GitHub Actions automation… such a beautiful plan.

Although this plan ran perfectly in my head, in reality, there were more hidden pitfalls than I expected.

> Everyone has a plausible plan — until they get punched in the face.

## Exploring Solutions

### First Plan

![blog-auto-publishing-with-obsidian.en.md 1 mermaid image](/posts/blog-auto-publishing-with-obsidian/blog-auto-publishing-with-obsidian.en-1.svg)

The biggest concern was the **entanglement of automatic commits and manual commits in the same repository**.  
What happens if GitHub Actions automatically commits and deploys posts while I’m editing CSS or layout locally?

Most likely, at the moment I try to push, the remote repository already contains commits created by automation. In that case, `git push` will be rejected, and I’ll have to go through the tedious process of resolving conflicts by running `git reset HEAD^ & git pull` again.

Because of automation meant to publish posts, I almost became a **full-time conflict manager**.

### Second Plan

The root cause was that the automation process commits blog posts directly to the main branch.

So, what if **posts were dynamically fetched at build time?**

![blog-auto-publishing-with-obsidian.en.md 2 mermaid image](/posts/blog-auto-publishing-with-obsidian/blog-auto-publishing-with-obsidian.en-2.svg)

This way, **the post repository and blog code repository are completely separated**. Each can commit independently in their own domain and only meet at build time. Conflicts? Such things simply cannot occur in this structure.

However, this structure had a fatal flaw: **a public repository had to fetch data from a private repository**. This is a reverse access that violates common security principles.

My Obsidian Vault is not just a simple blog repository. It’s my personal digital brain containing private diaries, work notes, project ideas, and sometimes sensitive information. The idea of a public blog accessing this personal repository was unsettling.

- Sensitive information might be exposed in the public repository’s Actions logs
- If the token is stolen, the entire Vault could be compromised
- Risk of accidentally including private files in the build process

Above all, because I don’t trust myself, this plan was discarded.

### Final Plan  
~~Revision-v3-v3final-last-reallyfinal.doc~~

![Neon Genesis Evangeliongendo Ikari Gendo](/posts/blog-auto-publishing-with-obsidian/Neon-Genesis-Evangeliongendo-Ikari-Gendo.jpg)
> Final version of the post publishing system ~~humanity~~ improvement plan

After much thinking, I found my own answer. What if I commit automatically to the blog repository as originally planned, but use a separate branch?

![blog-auto-publishing-with-obsidian.en.md 3 mermaid image](/posts/blog-auto-publishing-with-obsidian/blog-auto-publishing-with-obsidian.en-3.svg)

In this structure:
- GitHub Actions in the Vault processes posts and pushes them to the blog repository’s `auto-sync` branch
- The blog’s build process checks out and merges both `master` and `auto-sync` branches before building
- Design or code edits are committed directly to the `master` branch as usual

This structure completely eliminates the possibility of conflicts while securely linking the two repositories.

## Actual Implementation

Developers speak with code, right? Below is the GitHub Actions file that realizes the above plan.

**Obsidian Vault (private repository)**

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

**Blog (frontend) [repository](https://github.com/ironpark/ironpark.github.io)**

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

No matter how much developers speak with code, it’s a bit cold to just drop code and disappear. For anyone who might want to try this, let me dissect how these two GitHub Actions workflows work together. Although it looks complicated at first glance, each has a clear role, so I believe you can understand it step by step.

#### Vault Repository Workflow Analysis

First, let’s look at the `Contents Sync` workflow in the Obsidian Vault repository.

**Trigger Conditions**
```yaml
on:
  workflow_dispatch:            # Can be run manually
  push:
    paths:
      - "2.Areas/Blog/*.md"     # Only when blog posts change
      - ".github/workflows/**"  # Or when workflow files change
    branches:
      - main
```

Using the `paths` filter, it only runs **when blog-related files change**. This prevents unnecessary builds and saves GitHub Actions free tier minutes (2,000 minutes per month). Of course, properly setting `.gitignore` to avoid committing unnecessary files is also essential.

**Checking Out Two Repositories Simultaneously**
```yaml
- name: Checkout brain repository
  uses: actions/checkout@v4
  with:
    path: brain     # Check out current repository (vault) into brain folder
    
- name: Checkout contents repository
  uses: actions/checkout@v4
  with:
    repository: ironpark/ironpark.github.io # From the blog’s GitHub repository
    ref: auto-sync  # The auto-sync branch
    path: contents  # Check out into contents folder
    token: ${{ secrets.GH_TOKEN }}  # Token for external repo access
```

Within one workflow, **two repositories are checked out into different paths**. This allows simple `cp` commands to move files easily without complex scripts. The token is set here for committing and pushing later.

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

First, markdown files and images are copied from the Vault to the blog repository’s `auto-sync` branch.  
Then, `pnpm build` runs the preprocessor.

This preprocessor performs tasks such as:
- Converting Obsidian’s `![[image.png]]` syntax to standard markdown
- AI translation (multilingual support)
- Other preprocessing tasks...

This preprocessor plays a key role in building this blog but is too large to cover here.

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

After preprocessing, it commits only if there are actual changes. This prevents unnecessary commits and deployments if nothing has changed.

**Triggering Blog Build**
```yaml
- name: Run Publish
  run: gh api /repos/ironpark/ironpark.github.io/dispatches -f event_type='post-sync'
```

Using GitHub CLI, it triggers a `repository_dispatch` event on the blog repository. This is the key link connecting the two workflows. The `event_type` acts like a label to distinguish why the trigger happened.

#### Blog Repository Workflow Analysis

Now, let’s look at the `Build and Deploy to Pages` workflow in the blog repository.

**Supporting Various Triggers**
```yaml
on:
  push:
    branches: ["master"]  # When code changes
  workflow_dispatch:      # Manual trigger
  repository_dispatch:    
    types: [ post-sync ]  # Event sent from Vault
```

There are three triggers declared, and among them, `repository_dispatch` is the crucial link to the Vault repository. The Vault workflow needs this to trigger the blog deployment workflow.

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

It merges the code from the `master` branch and the content from the `auto-sync` branch to build the site. This achieves perfect separation of code and content.

#### Security Considerations

Both workflows use `${{ secrets.GH_TOKEN }}`. This token is:
- Granted read/write permissions only on the blog repo
- A fine-grained PAT with minimal privileges

This minimizes damage even if the token is leaked.

#### Why So Complicated?

You might wonder, “Why make publishing a single post so complicated?” But thanks to this…

1. **Perfect separation of concerns**: Writing and coding don’t interfere with each other  
2. **Conflict-free collaboration**: Automation and manual work coexist peacefully  
3. **Extensibility**: Easy to add features like preprocessing, translation, cross-posting  
4. **Security**: Separation between personal Vault and blog content

Ultimately, this seemingly complex system started from the simple desire to **just focus on writing**. Sometimes, you have to take a complicated journey to achieve a simple goal.

## Things Not Covered in This Post

Posts written in Obsidian basically follow markdown format, but applying them directly to the blog was difficult. So I had to create a separate preprocessor, and encountered various issues along the way. I didn’t cover them here, but I plan to write about them separately when I get the chance.

1. **Obsidian Syntax**  
    Obsidian uses its own markdown extensions. For example, image embeds like `![[image.png]]` or wikilinks like `[[another note]]` don’t render properly in standard markdown renderers. So a preprocessing step to convert these was essential.
    
2. **Image Paths and Asset Management**  
    Obsidian Vault images are usually stored in the same folder as notes, but on the web, unified paths like `/assets/images/` are commonly used. At build time, images need to be copied to the correct location and paths adjusted.
    
3. **Mermaid Diagram Support**  
    This post used mermaid.js for diagrams. But to render them properly in a static site build, a separate process supporting dynamic rendering was needed.
    
4. **Multilingual Support and AI Translation**  
    I wanted to offer the blog in Korean, English, and Japanese. Writing in all three languages manually is difficult, and my foreign language skills are limited, so I introduced AI translation. However, markdown syntax sometimes broke or got altered during translation, requiring multiple prompt adjustments.

> 💡 **Curious about the preprocessor?**
> 
> The entire code except the private repository is already available on the [GitHub repository](https://github.com/ironpark/ironpark.github.io). If you’re especially curious about the preprocessor implementation, check out the `auto-sync` branch.

## Plans for the Future

Currently, I manage publication status with the `published` metadata, but I plan to build a scheduled publishing system to “quietly post on a set date.”

Additionally, I’m considering features like automatically cross-posting to platforms like Velog or Medium after a certain time, or posting summaries and links to social media like Twitter (X) and LinkedIn upon publishing. However, when or if these will be implemented remains uncertain.