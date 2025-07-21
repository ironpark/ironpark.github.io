---
title: Creating My Own Blog
date: 2025-07-20
tags: [SvelteKit, Tailwind CSS]
description: What makes an ideal blog?
---
```text
This post is still being revised.
```

![Title Image](/posts/my-ideal-dev-blog/title.png)
## Dreaming of My Own Space

I often found myself thinking, "It would be nice to have my own blog." I imagined recording what I’ve done, sharing and interacting with others, and carving out a small workshop of my own in a corner of this vast internet. I hoped that through this, I could also foster my own growth.

Just thinking about it felt like a waste, so I tried a few times. I wrote in notepads or started on various platforms, but none of them lasted long. Sometimes I didn’t like the features, sometimes I lost interest quickly, or sometimes I just got lazy and gave up.

This time, I decided to do it differently. I wanted to create a blog that I could truly be satisfied with—a space I could organize myself, maintain for a long time, and control however I wanted.

## What Is an Ideal Blog?
Of course, everyone has their own opinion about what makes an ideal blog. Based on my past failures, I’ve come up with three conditions that are essential for my ideal blog:

### 1. Minimize Costs
Writing itself is already a mental challenge. Should I really have to worry about money just to run a blog? I don’t want to run my own server or pay for hosting. Free is best. Ideally, free forever.

### 2. Ownership of Data and Rights
How many services have suddenly shut down over the years? Korea’s Cyworld did, and so did Egloos. No matter how many users a service has or how well it’s run now, **no one knows if it’ll still be around in 10 or 20 years.**

Even if, by some miracle, a service is guaranteed for 100 years, I don’t want my content to be restricted or features to be reduced or changed due to changes in terms or business decisions.

### 3. Customizability
I need to be able to control the design and features of my blog however I want. Whether it’s adding ads, supporting multiple languages, or adding and modifying any feature, it should be easy. **Do what I want, how I feel.**

## The Ultimate Solution
![Title Image](/posts/my-ideal-dev-blog/silver-bullet.png)

There aren’t many ways to satisfy all these conditions. What I chose was a combination of GitHub Pages and SvelteKit.

### GitHub Pages
GitHub lets you create a repository named after your account and host a static site **for free**. The deployed site is accessible at `username.github.io`, and as you can see from the URL, this blog was made that way. You can view the source code in the [GitHub repository](https://github.com/ironpark/ironpark.github.io/).

Of course, GitHub is also a company-run service, and unexpected outages or permanent shutdowns could happen. But thankfully, you don’t have to **pray to the Microsoft data center gods or make offerings to the GitHub spirits at dawn** to prevent such disasters. That’s because Git itself is a distributed version control system. Even if GitHub disappears, all the content remains in my local repository.

If you want to be even more certain, you can run your own self-hosted Git server using open-source tools like [Gitea](https://github.com/go-gitea/gitea). It’s lightweight enough to run on a Raspberry Pi.

> ~~At this point, it’s almost like technical self-sufficiency.~~

This kind of setup isn’t just about running a blog—it’s an important foundation for having true ownership over your data and tools.

#### Why Not Hugo or Jekyll?

If I just wanted a simple blog with posts using GitHub Pages, `hugo` or `jekyll` would generally be better choices. But I wanted to go beyond a simple blog: to deploy web-based tools I made, support multilingual posts, custom components, and more. Considering all this, building it myself was more suitable. And isn’t that more fun?

#### Why SvelteKit?

If you want to use a frontend framework to build an SSG (Static Site Generation) blog, frameworks like Astro or Next.js are also great choices. Next.js, in particular, has a huge ecosystem, lots of resources, and is widely used in enterprise, so it might be a **"safer"** choice.

But this blog isn’t a product required by a company—it’s a personal project. That means the number of features or performance metrics aren’t really important.
> ~~It’s just a matter of taste. Please respect that.~~

Still, let me share some of SvelteKit’s strengths:
- Thanks to its compiler, it’s friendly with plain JS
- Clearer separation of view and logic
- Low entry barrier and concise syntax

If you haven’t tried [Svelte](https://svelte.dev/) or [SvelteKit](https://svelte.dev/docs/kit/introduction) yet, I strongly recommend giving them a try.

## Nevertheless

Even after putting so much effort into making this blog, if I don’t write and just abandon it, I’ll only be repeating my past mistakes. In the end, making this blog truly my **ideal blog** is up to me.