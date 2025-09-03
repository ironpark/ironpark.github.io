---
created: 2025-07-20T00:00
updated: '2025-09-03T12:40:56.000Z'
published: 2025-07-25T08:12+09:00
slug: my-ideal-dev-blog
title: Creating My Own Blog
subTitle: What Are the Conditions of an Ideal Blog?
description: >-
  A journey to build a truly personal space beyond platform dependency. Achieve
  free hosting and complete customization with GitHub Pages and SvelteKit, while
  enjoying the freedom to write anytime, anywhere with Obsidian.
series: 똑똑한 블로그 만들기
categories:
  - Thoughts
tags:
  - github-pages
  - markdown
  - svelte-kit
lang: en
thumbnail: https://ironpark.github.io/posts/my-ideal-dev-blog/title.png
originalLang: ko
---
![title](/posts/my-ideal-dev-blog/title.png)

## Dreaming of My Own Space

I often had a vague thought: "It would be nice to have my own blog." The idea of recording what I’ve done, sharing it, interacting, and setting up a small workshop of my own in a corner of this vast internet. Along the way, maybe I could grow little by little—that was part of the hope.

Since just thinking about it felt like a waste, I tried a few times. I started by writing in a notepad or borrowing platforms, but none lasted long. Either the features didn’t satisfy me, I quickly lost interest, or I just got lazy and everything fizzled out. This time, I decided to try something a bit different. I wanted to truly create a blog I could be satisfied with—one I could organize myself, maintain for a long time, and control however I pleased.

## What Is an Ideal Blog?
Everyone probably has a different idea of what an ideal blog looks like. But reflecting on various trials and errors, I boiled down the minimum conditions for a blog that suits me to the following four:

### 1. Minimize Costs
Writing alone is already mentally taxing. Do I really want to worry about financial costs just to run a blog? Operating my own server or paying fees is out of the question. Free is best. Ideally, free forever.

### 2. Ownership of Data and Control
How many services have suddenly shut down over the years? Korea’s Cyworld and Egloos are examples. No matter how many users a service has or how well it’s run now, **no one knows if it will still be around in 10 or 20 years.**

Even if we generously assume the service is guaranteed for 100 years, I don’t want my content to be restricted, or features I use to be reduced or changed due to terms of service changes or business decisions.

### 3. Customizability
I want to be able to control the blog’s design and functionality exactly how I want. Whether it’s adding ads, supporting multiple languages, or modifying features, it should be easy. **Do whatever I want, however I feel.**

### 4. Writing Should Be Easy
Writing is always hard. But at the very least, **it should be easy to get started.** I want to be able to write or delete anytime, anywhere, whenever inspiration strikes. Whether on a smartphone, tablet, or desktop, **the environment shouldn’t limit my work.**

## The Ultimate Solution
![silver bullet](/posts/my-ideal-dev-blog/silver-bullet.png)

There aren’t many ways to satisfy all these conditions. What I chose was the combination of GitHub Pages + SvelteKit.

### GitHub Pages
GitHub allows you to create a repository named after your account and host a static site **for free**. The deployed site is accessible via `username.github.io`, and as you can see from the URL, this blog was made that way. You can check out the source code on the [GitHub repository](https://github.com/ironpark/ironpark.github.io/).

Of course, GitHub is also a corporate service, and unexpected outages or permanent shutdowns could happen. But fortunately, you don’t have to **pray to Microsoft data centers or offer sacrifices to the GitHub gods at dawn** to prevent this. That’s because Git itself is a distributed version control system. Even if GitHub disappears, all your content remains intact in your local repository.

If you want to be even more certain, you can run your own self-hosted Git server using open source like [Gitea](https://github.com/go-gitea/gitea). It’s lightweight enough to run well even on a Raspberry Pi. ~~Honestly, if you get to this stage, you’re basically a tech self-sufficient farmer.~~

This structure is more than just running a blog; it’s a crucial foundation for **taking control of your own data and tools.**

#### Why Not Use Hugo or Jekyll?

If I just wanted a simple blog with posts using GitHub Pages, using `hugo` or `jekyll` would generally be a better choice. But I wanted more than a simple blog—I wanted to deploy web-based tools I built myself, support multilingual posts, custom components, and various features. Considering that, building it myself was more suitable. Plus, isn’t it more fun that way?

#### Why SvelteKit?

If you want to build an SSG (Static Site Generation) based blog by handling a frontend framework yourself, frameworks like Astro or Next.js are also great choices. Especially Next.js has a large ecosystem, abundant resources, and is widely used in enterprise, so it might be a more **"safe"** choice.

But a blog is a personal project, not a company product, so the number of features or performance metrics aren’t the priority.
> ~~It’s a matter of taste. Please respect that.~~

A deep introduction to SvelteKit is beyond the scope of this post, so I’ll save that for another time. Instead, let me finish by sharing four reasons why I like Svelte/Kit:

- The bundle is small and lightweight
- Relatively simple, friendly with plain JS
- Clearer separation of view and logic
- **Low entry barrier** and concise syntax

If you haven’t tried [Svelte](https://svelte.dev/) / [Svelte Kit](https://svelte.dev/docs/kit/introduction) yet, give it a try—it’s delicious.

### Markdown + Automation
![markdown action](/posts/my-ideal-dev-blog/markdown-action.png)

This blog is written in **Markdown format**. And we have a fantastic Markdown-based note app called [Obsidian](https://obsidian.md/) (which is even free). It supports various platforms and has a well-established plugin ecosystem. What I like most is that **all data is stored locally.**

In my case, I’ve been subscribing to [Obsidian Sync](https://obsidian.md/sync) for years, so everything syncs automatically across all devices. Thanks to this, I have an environment where I can **freely write and delete anytime, anywhere.** By combining the Obsidian Git plugin and GitHub Actions, Markdown files saved locally are automatically committed and deployed.

In other words, just write and save. Nothing else to do.

> Write in Markdown, manage with Obsidian, and auto-deploy with GitHub Actions.
> **Could it get any lazier than this?**

> However, this automation process isn’t finished yet; I’m still tweaking and refining it.
>
> Detailed setup and configuration will be covered in a future follow-up post,
> **like a light appendix**, so if you’re curious, please visit the blog often.

Through this process, I was able to satisfy all four initial blog conditions:
1. **Minimize costs**,
2. **Ownership of data and control**,
3. **Customizability**,
4. **Ease of writing**

Functionally, it’s an ideal structure.

## Nevertheless
The subtitle of this post was "**What Are the Conditions for an Ideal Blog?**" But looking back, what I really pondered and prepared were closer to _"the conditions for an ideal tool"_ rather than an ideal blog.

Even with this carefully built blog, if I don’t write and just leave it abandoned, it will just become a dusty notepad.

Making this blog truly my **ideal blog** depends on me.