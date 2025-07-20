---
title: Creating My Own Blog
date: 2025-07-20
tags: [SvelteKit, Tailwind CSS]
description: What are the conditions for an ideal blog?
---
```text
This post is still being revised.
```
![Title Image](/posts/my-ideal-dev-blog/title.png)
While I can't speak for all developers, I believe many of them want to run their own blog to promote personal growth and build connections with others. And I'm one of them.

However, thinking is easy while practice is always difficult. Even if you take the first step with difficulty, it's hard to maintain it. I've spent years repeatedly creating blogs through various methods, only to abandon them due to lack of maintenance.

> This way leads nowhere!

This time, learning from my past failures, I'm determined to finally create my ideal blog, which brings us to today.

## Conditions for an Ideal Blog
While everyone has different opinions about what makes an ideal blog, based on my past failures, let me outline the conditions for at least my ideal blog:

### Minimizing Costs
Writing itself is already challenging enough. Should I really have to worry about financial concerns for running a blog? Running a server directly or paying fees is out of the question.

### Retaining Data and Authority
How many services have suddenly shut down over the years? Korea's Cyworld did, and so did Egloos. No matter how many users a service has now or how well it's operated, **nobody knows if it will still exist in 10 or 20 years.**

Even if we generously assume a service is guaranteed for 100 years, I don't want my content to be restricted or features to be reduced or changed due to changes in terms of service or business decisions.

### Customization

I need to be able to control the design and functional aspects of the blog as I wish. Whether it's adding ads or supporting multiple languages, adding or modifying any feature should be easy. **Do it the way I want, go with the flow**

## The Ultimate Solution
![Title Image](/posts/my-ideal-dev-blog/silver-bullet.png)
### Github Pages
GitHub allows you to create a repository with your account name and host static sites **for free**. The deployed site is accessible in the format `username.github.io`, and as you can tell from the URL, this blog is also deployed through GitHub Pages, so you can see the source code in the [GitHub repository](https://github.com/ironpark/ironpark.github.io/).

Of course, GitHub is also a service operated by a company, so we can't completely rule out the possibility of unexpected failures or permanent service termination. However, **Git repositories can be preserved as-is on local computers by their nature**, and it's also possible to set up self-hosted Git servers like Gitea. This minimizes dependency on external services and allows content management or restoration even in environments without network access, which is the biggest advantage.

This structure goes beyond just running a blog and **becomes an important foundation for having sovereignty over your own data and tools.**

#### Why I Didn't Use Hugo or Jekyll

If I just wanted to create a simple blog with posts using GitHub Pages, using `hugo` or `jekyll` would generally be a better choice. However, I wanted to go beyond a simple blog to deploy web-based tools I created myself, support multilingual posts, custom components, and various other features. Considering all this, building it myself was more suitable. And isn't that more fun?

#### Why Svelte Kit?

If you want to handle a frontend framework directly to create an SSG (Static Site Generation) based blog, frameworks like Next.js are also excellent choices. They have a large ecosystem, plenty of resources, and are widely used in enterprise, making them perhaps a **"safer"** choice.

But a blog is a personal project, not a product required by a company, which means the abundance of features or performance metrics aren't considerations.
> ~~It's a matter of preference. Please respect it.~~

Still, let me advocate for some of Svelte Kit's advantages:
- Thanks to the compiler implementation, it's friendly with Plain JS
- Clearer separation of view and logic
- Low barrier to entry and concise syntax

If you haven't tried [Svelte](https://svelte.dev/) / [Svelte Kit](https://svelte.dev/docs/kit/introduction) yet, I strongly suggest giving it a try at least once.

## Nevertheless

Despite having created this blog with such effort, if I don't write and abandon it, it would just be repeating the past. Making this blog truly my **ideal blog** depends on me.