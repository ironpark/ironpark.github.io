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

In [[나만의 블로그를 만들다|My Own Blog Creation|previous post]], I talked about the reasons behind creating the blog and the choice of technologies. This time, I want to discuss why publishing even a single post on the blog I built is so complicated, and how I tried to untangle that process.

The biggest inconvenience I felt while running a static blog based on GitHub Pages was **the publishing process itself**.

Since there’s no separate database or server environment, there’s no management page or dedicated editor. As a result, the basic writing flow—drafting → saving → editing → publishing—is not smooth. On top of that, having blog posts and frontend code mixed in one repository is almost a disaster for me, who easily gets sidetracked. That’s why **separation of concerns** was desperately needed.

### Everyone Has a Plausible Plan
![get punched in the face](/posts/blog-auto-publishing-with-obsidian/get-punched-in-the-face.jpg)

**The original plan was this:**
1. Write posts in Obsidian
2. A Git plugin automatically syncs to a personal repository
3. GitHub Actions automatically deploy posts to the blog repository

I was confident this would be a perfect system where I could write and publish posts instantly from my smartphone, tablet, or desktop. I could focus solely on writing in Obsidian, and the rest would be handled magically by GitHub Actions automation... such a beautiful plan.

Although the plan worked perfectly in my head, in reality, there were far more hidden pitfalls than I expected.

> Everyone has a plausible plan — until they get punched in the face.

## Exploring Solutions

### First Plan


![blog-auto-publishing-with-obsidian.en.md 1 mermaid image](/posts/blog-auto-publishing-with-obsidian/blog-auto-publishing-with-obsidian.en-1.svg)

The biggest concern was the **entanglement of automated commits and manual commits within the same repository**.  
What happens if GitHub Actions commits and deploys posts automatically while I’m editing CSS or layout locally?

Most likely, the moment I try to push, the remote repository will already contain commits created by automation. In that case, `git push` will be rejected, and I’ll have to go through the tedious process of resolving conflicts by running `git reset HEAD^ & git pull`.

Because of the automation I set up to publish posts, I almost became a **full-time conflict manager**.

### Second Plan
The root cause of the problem was that the automation process committed blog posts directly to the main branch.

So, what if **posts were fetched dynamically at build time?**
![blog-auto-publishing-with-obsidian.en.md 2 mermaid image](/posts/blog-auto-publishing-with-obsidian/blog-auto-publishing-with-obsidian.en-2.svg)

This way, **the post repository and blog code repository are completely separated**. Each commits independently in their own domain, meeting only at build time. Conflicts? That’s a structure where they simply can’t happen.

However, this structure had a fatal flaw: **a public repository would have to fetch data from a private repository**. This is a reverse access that violates common security principles.

My Obsidian Vault isn’t just a simple blog repository. It’s my personal digital brain containing private diaries, work notes, project ideas, and sometimes sensitive information. The idea of a public blog accessing this personal repository was unsettling.

- Sensitive information might be exposed in the public repository’s Actions logs
- If tokens are stolen, the entire Vault could be compromised
- Risk of accidentally including private files in the build process

Above all, because I don’t trust myself, this plan was discarded.

### The Final Plan?

![Neon Genesis Evangeliongendo Ikari Gendo](/posts/blog-auto-publishing-with-obsidian/Neon-Genesis-Evangeliongendo-Ikari-Gendo.jpg)
> The final version of the post publishing system ~~humanity~~ improvement plan

So I changed my approach. **What if I commit automatically to the blog repository as originally planned, but use a separate branch?**
![blog-auto-publishing-with-obsidian.en.md 3 mermaid image](/posts/blog-auto-publishing-with-obsidian/blog-auto-publishing-with-obsidian.en-3.svg)In this structure:
- GitHub Actions in the Vault pushes processed posts to the blog repository’s `auto-sync` branch
- The blog’s build process checks out and merges both `master` and `auto-sync` branches before building
- Design or code changes are committed directly to the `master` branch as usual

This structure completely eliminates the possibility of conflicts while securely linking the two repositories.

## What This Post Didn’t Cover

Posts written in Obsidian basically follow markdown format, but applying them directly to the blog was difficult. So I had to create a separate preprocessor, and encountered several issues along the way. I didn’t cover these here, but I plan to organize and share them separately when I have the chance.

1. **Obsidian Syntax**  
    Obsidian uses its own markdown extensions. For example, image embeds like `![[image.png]]` or wikilinks like `[[other note]]` don’t render properly in standard markdown renderers. So a preprocessing step to convert these was essential.
    
2. **Image Paths and Asset Management**  
    Images in the Obsidian Vault are usually stored in the same folder as notes, but on the web, unified paths like `/assets/images/` are commonly used. At build time, images needed to be copied to the correct location and paths adjusted.
    
3. **Mermaid Diagram Support**  
    This post used mermaid.js for diagrams. However, to render them properly in a static site build, a separate approach supporting dynamic rendering was necessary.
    
4. **Multilingual Support and AI Translation**  
    I wanted the blog to be available in Korean, English, and Japanese. Writing in all three languages manually was difficult, and my foreign language skills limited, so I introduced AI translation. However, markdown syntax sometimes broke or got distorted during translation, requiring several prompt adjustments.

## Implementation
```yaml

```
## Future Plans

Currently, I manage post publication status with a `published` metadata field, but I plan to build a scheduled publishing system that “quietly posts on a set date.”

Additionally, I’m considering features like automatically cross-posting to platforms like Velog or Medium after a certain time, or posting summaries and links to social media like Twitter (X) and LinkedIn simultaneously with publication. When these will be implemented is still uncertain.

> It’s still just an idea, but my goal is to squeeze every bit of free tier usage from GitHub Actions. (At this point, it feels less like the machine is being worked hard, and more like I am.)

---

> 💡 **Curious about this automation system?**
> 
> The full code is available at the [GitHub repository](https://github.com/ironpark/ironpark.github.io).  
> Especially check out the action files in the `.github/workflows/` folder for detailed implementation.
>
> If you want to build a similar system, feel free to ask questions anytime. Let’s create a better writing environment together.