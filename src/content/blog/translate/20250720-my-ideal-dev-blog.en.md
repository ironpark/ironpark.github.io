---
title: Creating My Own Blog
date: 2024-01-15
tags: [SvelteKit, Tailwind CSS]
description: What are the conditions for an ideal blog?
---
```text
This post is still being edited.
```
![Title Image](/posts/image.png)
I can't speak for all developers, but I believe many developers want to run their own blog to foster their growth or build connections with people, and I'm one of them.

However, thinking is easy but execution is always difficult. Even if you take the first step with difficulty, it's hard to maintain it. I've spent years repeatedly creating blogs in various ways, then abandoning them due to lack of maintenance.

> This way leads nowhere!

This time, I'm determined to learn from my past failures and finally create my ideal blog, which brings us to today.

## Conditions for an Ideal Blog
First, everyone has different opinions about what makes an ideal blog. However, based on my past failures, let me outline the conditions for my ideal blog:

### Minimize Costs
Writing alone is already mentally taxing. Should I also worry about financial concerns for running a blog? Running servers directly or paying costs is out of the question.

### Ownership of Data and Control
How many services have suddenly shut down over the years? Korea's Cyworld did, and Egloos did. No matter how many users a service has or how well it's operating now, **nobody knows if it will remain after 10 or 20 years.**

Even if a service is guaranteed for 100 years, I don't want my content to be restricted or the features I use to be reduced or changed due to changes in terms of service or business decisions.

### Customization

I need to be able to control the design and functional aspects of the blog as I wish. Whether adding ads or supporting multiple languages, adding or modifying any feature should be easy. **Do what I want, follow my instincts**
> It's my preference, please respect it.

## The Ultimate Solution

### GitHub Pages
GitHub allows you to create a repository named after your account and host static sites **for free**. The deployed site is accessible in the format `username.github.io`, and since this blog is also deployed this way, you can see the source code in the [GitHub repository](https://github.com/ironpark/ironpark.github.io/).

Of course, GitHub is also a service operated by a company, so the possibility of unexpected failures or permanent service termination cannot be completely ruled out. To reduce such risks, you can perform regular local backups or consider replication to other Git hosting services like GitLab or Bitbucket.

Furthermore, **Git repositories, by their nature, can be preserved exactly on local computers**, and it's also possible to build self-hosted Git servers like Gitea. This minimizes dependence on external services and allows content management or restoration even in environments without network access.

This structure goes beyond just running a blog and becomes an important foundation for **having sovereignty over your own data and tools.**

#### Why Not Hugo or Jekyll?

If I just wanted to create a simple blog with only posts using GitHub Pages, using `hugo` or `jekyll` would generally be a better choice. However, I wanted to go beyond a simple blog to deploy web-based tools I created myself, support multilingual posts, custom components, and various other features, so building it myself was more suitable. And it's more fun :)

#### Why Svelte Kit?

If you want to handle frontend frameworks directly to create an SSG (Static Site Generation) based blog, frameworks like Next.js are also sufficiently good choices. The ecosystem is large, resources are abundant, and it's widely used in enterprises, so it might be a more **"safe"** choice.

But this blog is not a product required by a company, but a personal project created entirely according to my preferences and methods.
So rather than the quantity of features or performance metrics, this is purely a result of my preferences.

Still, let me advocate for some advantages of Svelte Kit:
- Thanks to the compiler implementation, it's friendly with Plain JS
- Clearer separation of view and logic
- Low barrier to entry and concise syntax

## Nevertheless

Despite having this carefully crafted blog, if I don't write and abandon it, it's just repeating the previous situation. Making this blog truly my **ideal blog** depends on me.