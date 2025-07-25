---
created: 2025-07-20T00:00
updated: 2025-07-25T08:12
published: true

title: Building My Own Blog
subTitle: What makes an ideal blog?
description: 'After multiple failed attempts, I finally found my ideal blog setup. Using GitHub Pages and SvelteKit to achieve cost minimization, data ownership, unlimited customization, and seamless writing with Obsidian and Markdown automation. A journey of creating a truly independent space without platform dependency, and the philosophical reflection on the difference between ideal tools and an ideal blog.'

series: Build A Smart Blog
category: Thoughts
tags: [github-pages,markdown,svelte-kit]
lang: en
---

![Title Image](/posts/my-ideal-dev-blog/title.png)
## Dreaming of My Own Space

I often found myself vaguely thinking, "It would be nice to have my own blog someday." The idea of recording what I've done, sharing it, connecting with others, and setting up my own little workshop in a corner of this vast internet. I had this expectation that maybe, just maybe, I could grow a little bit through this process.

Since it seemed like a waste to just keep thinking about it, I tried a few times. I'd write in a notepad or start on some platform, but it never lasted long. Either I didn't like the features, quickly lost interest, or just got lazy and let it fizzle out. This time, I decided to do things a bit differently. Let me really create a blog that I can be satisfied with. A space that I can organize myself, maintain for a long time, and control however I want.

## What Makes an Ideal Blog
Everyone probably has a different vision of what an ideal blog looks like. But looking back at all my trial and error over the years, I've narrowed down the minimum requirements for a blog that works for me to these four points:

### 1. Minimize Costs
Writing alone is already mentally taxing enough. Why should I worry about financial concerns when running a blog? Running my own server or paying fees is out of the question. I just want it to be free. Preferably free forever.

### 2. Data and Control Ownership
How many services have suddenly shut down over the years? Korea's Cyworld and Egloos are prime examples. No matter how many users a service has or how well it's currently running, **nobody knows if it'll still be around in 10 or 20 years.**

Even if we generously assume a service is guaranteed for 100 years, I don't want my content to be restricted or my familiar features to be reduced or changed due to some terms of service update or business decision.

### 3. Customization
I should be able to control both the design and functional aspects of my blog however I want. Whether it's adding ads, supporting multiple languages, or adding/modifying any feature - it should be easy. **Do whatever I want, however I feel like it.**

### 4. Writing Should Be Easy
Writing is always difficult. But at the very least, **it should be easy to get started**. I should be able to write and delete whenever inspiration strikes, anywhere I am, and **work without being constrained by the environment** - whether it's a smartphone, tablet, or desktop.

## The Ultimate Solution
![Title Image](/posts/my-ideal-dev-blog/silver-bullet.png)

There aren't many ways to satisfy all these conditions. What I chose was the GitHub Pages + SvelteKit combination.

### Github Pages
GitHub allows you to create a repository with your account name and host a static site **for free**. The deployed site can be accessed in the format `username.github.io`, and as you can tell from the URL, this blog was created exactly that way. You can see the source code in the [GitHub repository](https://github.com/ironpark/ironpark.github.io/).

Of course, GitHub is also a service run by a company, and it could experience unexpected outages or permanent shutdowns. But fortunately, to prevent such situations, **I don't need to bow toward Microsoft data centers or offer sacrifices to the GitHub gods at dawn.** That's because Git itself is a distributed version control system. Even if GitHub disappears, all my content remains intact in my local repository.

If you want to be even more certain, you could use open source solutions like [Gitea](https://github.com/go-gitea/gitea) to create a self-sufficient Git server and operate your own backbone. It's lightweight enough to run well even on a Raspberry Pi. ~~Actually, if you get to this level, you're pretty much at technological self-reliance status.~~

This structure goes beyond just running a blog - **it becomes an important foundation for having control over your own data and tools.**

#### Why I Didn't Use Hugo or Jekyll

If I just wanted to create a simple blog with posts using GitHub Pages, using `hugo` or `jekyll` would generally be a better choice. But I wanted to go beyond a simple blog to deploy custom web-based tools, support multilingual posts, custom components, and various other features. Given these considerations, building it myself was more suitable. And honestly, isn't that more fun?

#### Why SvelteKit Specifically?

If you want to build an SSG (Static Site Generation) based blog by directly handling a frontend framework, frameworks like Astro or Next.js are also perfectly good choices. Especially Next.js has a large ecosystem, lots of resources, and is widely used in enterprise settings, so it might be the more **"safe"** choice.

But a blog is a personal project, not a product demanded by a company, which means the abundance of features or performance metrics aren't the main considerations.
> ~~It's a matter of taste. Please respect it.~~

A deep introduction to SvelteKit doesn't fit the purpose of this post, so I'll save it for another time. Instead, let me wrap up by introducing four reasons why I love Svelte/Kit:

- Small and lightweight bundles
- Relatively simple, friendly with plain JS
- Clearer separation of view and logic
- **Low barrier to entry** and concise syntax

If you haven't tried [Svelte](https://svelte.dev/) / [Svelte Kit](https://svelte.dev/docs/kit/introduction) yet, give it a taste - it's delicious.

### Markdown + Automation
![Markdown & GitHub Actions icons](/posts/my-ideal-dev-blog/markdown-action.png)
This blog is written in **Markdown format**. And we have an excellent Markdown-based note-taking app called [Obsidian](https://obsidian.md/) (it's even free!). It supports various platforms and has a well-established plugin ecosystem. What I like most is that **all data is stored locally**.

In my case, I've been subscribing to [Obsidian Sync](https://obsidian.md/sync) for a few years now, so everything automatically syncs across all my devices. Thanks to this, I have **an environment where I can freely write and delete anywhere, anytime**. By combining this with the Obsidian Git plugin and GitHub Actions, Markdown files saved locally are automatically committed and automatically deployed.

In other words, I just write and save - that's it. Nothing else to touch.

> Write in Markdown, manage with Obsidian, auto-deploy with GitHub Actions.  
> **Could I be any lazier?**

> However, this automation work isn't finished yet, and I'm gradually refining and polishing it.  
> 
> I plan to cover the detailed settings and configuration methods  
> **as a light appendix in a follow-up post**, so if you're curious, please visit the blog often.

Through this process, I was able to satisfy all four criteria I initially outlined for a blog:  
1. **Cost minimization**,  
2. **Data and control ownership**,  
3. **Customization**,  
4. **Ease of writing**  

Functionally, it's an ideally structured setup.

## Nevertheless
The subtitle of this article was "**What makes an ideal blog?**" But looking back, what I worried about and built was actually closer to _"conditions for ideal tools rather than an ideal blog."_

Even with this blog I worked so hard to create, if I don't write and just abandon it, it'll just become a dusty notepad in the end.

Making this blog truly **my ideal blog** is up to me.