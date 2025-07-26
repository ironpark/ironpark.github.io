---
created: 2025-07-20T00:00
updated: 2025-07-25T08:12
published: true
slug: my-ideal-dev-blog
title: Creating My Own Blog
subTitle: What Are the Conditions of an Ideal Blog?
description: >-
  Building my perfect blog through multiple trials and errors. Combining GitHub
  Pages and SvelteKit to minimize costs, secure data ownership, enable flexible
  customization, and enjoy a convenient writing environment using Obsidian and
  Markdown. This is a journey of creating a true personal space independent of
  platforms, along with reflections on the differences between ideal tools and
  an ideal blog that I’ve realized along the way.
series: 똑똑한 블로그 만들기
categories:
  - Thoughts
tags:
  - github-pages
  - markdown
  - svelte-kit
lang: en
thumbnail: https://ironpark.github.io/posts/my-ideal-dev-blog/title.png
ogHash: 1f8f5a5f77a74a4c4b8c534ed2eda9b8e84fc663c462469471f81c9589088520
---
![](/posts/title.png)
## Dreaming of My Own Space

I often had a vague thought: "It would be nice to have my own blog." The idea of recording what I’ve done, sharing it, interacting, and setting up a small workshop of my own in some corner of this vast internet. Along the way, I hoped I might grow little by little.

Since just thinking about it felt like a waste, I tried a few times. I started by writing in a notepad or borrowing platforms, but none lasted long. Either the features didn’t satisfy me, I quickly lost interest, or I just got lazy and things fizzled out. This time, I decided to try something a bit different. Really create a blog that I can be satisfied with. A space I can organize myself, maintain for a long time, and control entirely on my own terms.

## What Is an Ideal Blog?
Everyone’s idea of an ideal blog might differ. But looking back on various trials and errors, I boiled down the minimum requirements for a blog that suits me to these four:

### 1. Minimize Costs
Writing alone is already mentally taxing. Should I really worry about money just to run a blog? Running my own server or paying fees is out of the question. It would be best if it were free. Ideally, free forever.

### 2. Ownership of Data and Control
How many services have suddenly shut down over time? South Korea’s Cyworld and Egloos are examples. No matter how many users a service has now or how well it’s run, **no one knows if it will still be around in 10 or 20 years.**

Even if we generously assume the service will last 100 years, I don’t want my content to be restricted or features I use to be limited or changed due to terms of service updates or business decisions.

### 3. Customizability
I want to be able to control the blog’s design and functionality exactly as I wish. Whether it’s adding ads, supporting multiple languages, or tweaking features, it should be easy to add or modify anything. **Do it my way, follow my vibe.**

### 4. Writing Must Be Easy
Writing is always hard. But at the very least, **it should be easy to get started.** I want to be able to write or delete anytime, anywhere, whenever inspiration strikes. Whether on a smartphone, tablet, or desktop, **it must be possible to work regardless of the environment.**

## The Ultimate Solution
![](/posts/silver-bullet.png)

There aren’t many ways to satisfy all these conditions. What I chose is the combination of GitHub Pages + SvelteKit.

### GitHub Pages
GitHub allows you to create a repository named after your account and host a static site **for free**. The deployed site can be accessed in the format `username.github.io`, and as you can tell from the URL, this blog was made that way. You can view the source code on the [GitHub repository](https://github.com/ironpark/ironpark.github.io/).

Of course, GitHub is also a corporate service, and unexpected outages or permanent shutdowns can happen. But thankfully, you don’t need to **bow to Microsoft data centers or offer sacrifices to the GitHub gods at dawn** to prevent such disasters. That’s because Git itself is a distributed version control system. Even if GitHub disappears, all your content remains intact in your local repository.

If you want to be even more certain, you can run your own self-hosted Git server using open-source software like [Gitea](https://github.com/go-gitea/gitea) and maintain your own backbone. It’s lightweight enough to run well even on a Raspberry Pi. ~~Honestly, if you get to this stage, you’re practically a tech self-sufficient farmer.~~

This kind of setup is more than just running a blog; it forms an important foundation for **taking control of your own data and tools.**

#### Why Not Use Hugo or Jekyll?

If I just wanted a simple blog with only posts using GitHub Pages, using `hugo` or `jekyll` would generally be a better choice. But I wanted more than a simple blog—I wanted to deploy web-based tools I made myself, support multilingual posts, custom components, and various other features. Considering that, building it myself was more suitable. Plus, isn’t it more fun that way?

#### Why SvelteKit?

If you want to build an SSG (Static Site Generation) based blog using a frontend framework, frameworks like Astro or Next.js are also excellent choices. Especially Next.js, which has a large ecosystem, abundant resources, and is widely used in enterprise, might be a more **“safe”** choice.

But a blog isn’t a product demanded by a company; it’s a personal project, meaning the number of features or performance metrics aren’t priorities.
> ~~It’s a matter of taste. Please respect that.~~

A deep introduction to SvelteKit is beyond the scope of this post, so I’ll save it for another time. Instead, let me finish by sharing four reasons why I love Svelte/Kit:

- The bundle is small and lightweight
- Relatively simple, friendly with plain JS
- Clearer separation of view and logic
- **Low barrier to entry** and concise syntax

If you haven’t tried [Svelte](https://svelte.dev/) / [Svelte Kit](https://svelte.dev/docs/kit/introduction) yet, give it a try—it’s delicious.

### Markdown + Automation
![](/posts/markdown-action.png)

This blog is written in **Markdown format**. And we have a fantastic Markdown-based note app called [Obsidian](https://obsidian.md/) (which is even free). It supports various platforms and has a well-developed plugin ecosystem. What I like most is that **all data is stored locally.**

In my case, I’ve subscribed to [Obsidian Sync](https://obsidian.md/sync) for years, so everything automatically syncs across all my devices. Thanks to that, I have an environment where I can **freely write and delete anytime, anywhere.** Using the Obsidian Git plugin and GitHub Actions, Markdown files saved locally are automatically committed and deployed.

In other words, just write and save. Nothing else to do.

> Write in Markdown, manage with Obsidian, and auto-deploy with GitHub Actions.
> **Could anything be lazier?**

> However, this automation isn’t fully finished yet; I’m still tweaking and refining it bit by bit.
>
> Detailed settings and configurations will be covered later in a follow-up post,
> **like a light appendix, so if you’re curious, please visit the blog often.**

Through this process, I was able to satisfy all the blog conditions I initially set:
1. **Minimize costs**,
2. **Ownership of data and control**,
3. **Customizability**,
4. **Ease of writing**.

Functionally, it’s an ideal structure.

## Nevertheless
The subtitle of this post was "**What Are the Conditions for an Ideal Blog?**" But looking back, what I really pondered and prepared were closer to _“the conditions for an ideal tool”_ rather than an ideal blog.

Even with a blog I worked so hard to build, if I don’t write and just leave it, it will end up as a dusty notepad.

Truly making this blog my **ideal blog** depends on me.