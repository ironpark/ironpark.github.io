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

In [My Own Blog Creation](/blog/my-ideal-dev-blog), I talked about the reasons for creating the blog and the process of choosing the technology. This time, I want to discuss why publishing a single post on the blog I made is so complicated, and how I tried to untangle that process.

The biggest inconvenience I felt while running a static blog based on GitHub Pages is **the publishing process itself**.

Since there is no separate database or server environment, there is no management page or dedicated editor. As a result, the basic writing flow of draft → save → edit → publish is not smooth. Moreover, having the posts and frontend code mixed in one repository is almost a disaster for me, who easily gets sidetracked. So, **separation of concerns** was desperately needed.

### Everyone Has a Plausible Plan
![get punched in the face](/posts/blog-auto-publishing-with-obsidian/get-punched-in-the-face.jpg)

**My plan was this:**
1. Write posts in Obsidian
2. A Git plugin automatically syncs to my personal repository
3. GitHub Actions automatically deploy posts to the blog repository

I was confident that this would be a perfect system allowing me to write and deploy posts immediately from smartphone, tablet, or desktop. I could focus solely on writing in Obsidian, and the rest would be handled automatically by the magic of GitHub Actions... such a beautiful plan.

The plan worked perfectly in my head, but in reality, many unexpected pitfalls were lurking.

> Everyone has a plausible plan — until they get punched in the face.

## Exploring Solutions

### First Plan

![blog-auto-publishing-with-obsidian.en.md 1 mermaid image](/posts/blog-auto-publishing-with-obsidian/blog-auto-publishing-with-obsidian.en-1.svg)

The biggest concern was the **situation where automatic commits and manual commits get tangled in one repository**.  
What if GitHub Actions automatically commits and deploys posts while I’m editing CSS or layout locally?

Most likely, at the moment I try to push, the remote repository will already have commits created by automation. In that case, `git push` will be rejected, and I’ll have to go through the tedious process of resolving conflicts by running `git reset HEAD^ & git pull`.

In other words, the automation I made to publish posts could easily turn me into a **full-time conflict resolution officer**.

### Second Plan
The root cause of the problem was that the automation process directly commits blog posts to the main branch.

So, what if **posts are dynamically fetched at build time?**

![blog-auto-publishing-with-obsidian.en.md 2 mermaid image](/posts/blog-auto-publishing-with-obsidian/blog-auto-publishing-with-obsidian.en-2.svg)

This way, **the post repository and the blog code repository are completely separated**. Each commits independently in their own domain and only meet at build time. Conflicts? Such a thing cannot happen in this structure.

However, this structure had a fatal flaw. **The public repository would have to fetch data from the private repository.** This is a reverse access that violates general security principles.

My Obsidian Vault is not just a simple blog repository. It’s my personal digital brain containing private diaries, work notes, project ideas, and sometimes sensitive information. The idea of a public blog accessing such a personal repository was unsettling.

I also considered cloning the private repository using a Personal Access Token, but there were too many risks:

- Sensitive information could be exposed in the Actions logs of the public repository
- If the token is stolen, the entire Vault would be exposed to security risks
- Risk of accidentally including private files in the build process

Above all, because I don’t trust myself, this plan was discarded.

### The Final?

![Neon Genesis Evangeliongendo Ikari Gendo](/posts/blog-auto-publishing-with-obsidian/Neon-Genesis-Evangeliongendo-Ikari-Gendo.jpg)
> The final version of the post publishing system ~~humanity~~ improvement plan

So I changed my approach. What if I commit automatically to the blog repository as originally planned, but use a separate branch?

![blog-auto-publishing-with-obsidian.en.md 3 mermaid image](/posts/blog-auto-publishing-with-obsidian/blog-auto-publishing-with-obsidian.en-3.svg)

In this structure:
- GitHub Actions in the Vault pushes processed posts to the blog repository’s `auto-sync` branch
- The blog’s build process checks out and merges both `master` and `auto-sync` branches before building
- Design or code changes are committed directly to the `master` branch as usual

This structure completely eliminates the possibility of conflicts while securely connecting the two repositories without security issues.

### Challenges Encountered
1. Obsidian Syntax  
Obsidian uses its own markdown extension syntax. Image embeds like `![[image.png]]` or wikilinks like `[[Other Note]]` don’t render as-is in standard markdown preprocessors. A conversion preprocessing step was essential.

2. Image Paths and Asset Management  
Images in the Obsidian Vault are usually stored in the same folder as the notes, but on the web, it’s common to use a unified path like `/assets/images/`. At build time, images had to be copied to the correct location and paths adjusted.

3. Multilingual Support and AI Translation  
I wanted the blog to be available in Korean, English, and Japanese. Writing posts in all three languages every time was impossible, and my foreign language skills are limited, so I introduced AI translation. However, careful handling was needed to avoid translating technical terms or code blocks.

---

> 💡 **Curious about this automation system?**
> 
> The full code is available in the [GitHub repository](https://github.com/ironpark/ironpark.github.io).  
> Especially check the action files in the `.github/workflows/` folder for detailed implementation.  
>
> If you want to build a similar system, feel free to ask questions anytime. Let’s create a better writing environment together.