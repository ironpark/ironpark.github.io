---
created: 2025-07-20T00:00
updated: 2025-07-25T08:12
published: true
slug: my-ideal-dev-blog
title: Creating My Own Blog
subTitle: What Are the Conditions of an Ideal Blog?
description: >-
  A journey to build a truly 'mine' space beyond platform dependency. Achieve
  free hosting and complete customization with GitHub Pages and SvelteKit, while
  writing freely anytime, anywhere with Obsidian.
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
![title](/posts/my-ideal-dev-blog/title.png)## Dreaming of My Own Space

I often had the vague thought, "It would be nice to have my own blog." The idea of recording what I’ve done, sharing it, interacting, and setting up a small workshop of my own in some corner of the vast internet. I also hoped that through this, I might grow little by little.

Since just thinking about it felt like a waste, I tried a few times. I wrote in notepads or used platforms, but none lasted long. I didn’t like the features, quickly lost interest, or simply got lazy and let it fade away. This time, I decided to try something a bit different. Really create a blog that I can be satisfied with. A space I can organize myself, maintain for a long time, and manage however I want.

## What Is an Ideal Blog?
Everyone’s ideal blog will look different. But looking back on various trials and errors, the minimum conditions for a blog that suits me boiled down to these four:

### 1. Minimize Costs
Writing alone is already mentally taxing. Can I really afford to worry about money to run a blog? Running a server myself or paying fees is out of the question. Free is best. Preferably free forever.

### 2. Ownership of Data and Control
How many services have suddenly shut down? Korea’s Cyworld and Egloos are examples. No matter how many users a service has now or how well it’s managed, **no one knows if it will still be around in 10 or 20 years.**

Even if we generously assume the service will last 100 years, I don’t want my content to be restricted or features I use to be reduced or changed due to terms of service updates or business decisions.

### 3. Customization
I want to be able to control the blog’s design and functionality as I please. Whether it’s adding ads, supporting multiple languages, or tweaking features, it should be easy. **Do whatever I want, however I feel like it.**

### 4. Writing Should Be Easy
Writing is always hard. But at least **it should be easy to get started.** I want to be able to write or delete whenever and wherever inspiration strikes, whether on a smartphone, tablet, or desktop—**the environment shouldn’t limit me.**

## The Ultimate Solution
![silver-bullet](/posts/my-ideal-dev-blog/silver-bullet.png)

There aren’t many ways to satisfy all these conditions. What I chose was the combination of GitHub Pages + SvelteKit.

### GitHub Pages
GitHub lets you create a repository named after your account and host a static site **for free**. The deployed site can be accessed at `username.github.io`. As you can see from the URL, this blog was created that way. You can check out the source code on the [GitHub repository](https://github.com/ironpark/ironpark.github.io/).

Of course, GitHub is also a corporate service and could face unexpected outages or permanent shutdowns. But fortunately, you don’t have to **bow to Microsoft data centers or offer sacrifices to the GitHub gods at dawn** to prevent this. That’s because Git itself is a distributed version control system. Even if GitHub disappears, all your content remains intact in your local repository.

If you want to be even more certain, you can run a self-hosted Git server using open source like [Gitea](https://github.com/go-gitea/gitea), which is lightweight enough to run on a Raspberry Pi. ~~Honestly, if you get to this stage, you’re practically a tech self-sufficient farmer.~~

This structure goes beyond just running a blog; it forms an important foundation for **taking control of your own data and tools.**

#### Why Not Use Hugo or Jekyll?

If I just wanted a simple blog with posts using GitHub Pages, using `hugo` or `jekyll` would generally be a better choice. But I wanted more than a simple blog—I wanted to deploy web-based tools I built myself, support multilingual posts, custom components, and various other features. Considering that, building it myself was a better fit. Plus, isn’t that more fun?

#### Why SvelteKit?

If you want to build a static site generation (SSG) based blog using a frontend framework, frameworks like Astro or Next.js are also great choices. Especially Next.js, which has a large ecosystem, tons of resources, and is widely used in enterprises, might be a more **"safe"** choice.

But a blog is a personal project, not a product demanded by a company, which means the number of features or performance metrics aren’t priorities.
> ~~It’s just personal preference. Please respect that.~~

A deep introduction to SvelteKit isn’t the purpose of this post, so I’ll save that for another time. Instead, let me wrap up by sharing four reasons why I like Svelte/Kit:

- Small and lightweight bundles
- Relatively simple, close to plain JS
- Clearer separation of view and logic
- **Low barrier to entry** and concise syntax

If you haven’t tried [Svelte](https://svelte.dev/) / [Svelte Kit](https://svelte.dev/docs/kit/introduction) yet, give it a try—it’s delicious.

### Markdown + Automation
![markdown-action](/posts/my-ideal-dev-blog/markdown-action.png)

This blog is written in **Markdown format**. And we have a fantastic Markdown-based note app called [Obsidian](https://obsidian.md/) (which is even free). It supports multiple platforms and has a well-established plugin ecosystem. What I love most is that **all data is stored locally.**

In my case, I’ve been subscribing to [Obsidian Sync](https://obsidian.md/sync) for years, so everything syncs automatically across all my devices. Thanks to this, I have an environment where I can **freely write and delete anytime, anywhere.** Using the Obsidian Git plugin and GitHub Actions, the Markdown files saved locally are automatically committed and deployed.

In other words, just write and save. Nothing else to do.

> Write in Markdown, manage with Obsidian, and auto-deploy with GitHub Actions.
> **Could it get any lazier than this?**

> That said, this automation isn’t finished yet; I’m still tweaking and refining it.
>
> Detailed setup and configuration will be covered later in a follow-up post,
> **like a light appendix**, so if you’re curious, please visit the blog often.

Through this process, I was able to satisfy all the blog conditions I initially set out:
1. **Minimize costs**,
2. **Ownership and control of data**,
3. **Customization**,
4. **Ease of writing**

Functionally, it’s an ideal setup.

## Nevertheless
The subtitle of this post was "**What Are the Conditions for an Ideal Blog?**" But looking back, what I really thought about and prepared were closer to _"the conditions for an ideal tool"_ rather than an ideal blog itself.

Even with a blog I worked so hard to build, if I don’t write and just leave it abandoned, it will end up just a dusty notepad.

Making this blog truly my **ideal blog** depends on me.