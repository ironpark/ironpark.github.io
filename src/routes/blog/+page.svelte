<script lang="ts">
  import { fade } from "svelte/transition";
  import type { PageData } from "./$types";
  import * as m from "$lib/paraglide/messages";
  import { localizeHref } from "$lib/paraglide/runtime";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  let { posts } = data;

  let selectedCategory = $state<string | null>(null);

  // All posts are already filtered by locale on the server
  const allCategories = [...new Set(posts.flatMap((post) => post.categories || []))].sort();

  const filteredPosts = $derived(
    selectedCategory
      ? posts.filter((post) => post.categories?.includes(selectedCategory!))
      : posts
  );
</script>

<div class="container px-4 mx-auto max-w-6xl py-16">
  <div class="space-y-8" in:fade={{ duration: 300 }}>
    <div class="space-y-4">
      <h1 class="text-4xl font-bold">{m.blog_title()}</h1>
      <p class="text-xl text-muted-foreground">
        {m.blog_description()}
      </p>
    </div>

    <div class="space-y-4">
      <div class="flex items-center gap-2 flex-wrap">
        <button
          onclick={() => (selectedCategory = null)}
          class="px-3 py-1 text-sm rounded-full transition-colors {!selectedCategory
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}"
        >
          {m.blog_all_posts()}
        </button>
        {#each allCategories as category}
          <button
            onclick={() => (selectedCategory = category)}
            class="px-3 py-1 text-sm rounded-full transition-colors {selectedCategory ===
            category
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}"
          >
            {category}
          </button>
        {/each}
      </div>
    </div>

    <div class="grid gap-8">
      {#each filteredPosts as post (post.slug)}
        <article
          class="group border-b pb-8 last:border-0"
          in:fade|global={{ duration: 200 }}
        >
          <a href={localizeHref(`/blog/${post.slug}`)} class="block space-y-3">
            <div class="flex items-center gap-4 text-sm text-muted-foreground">
              <time>
                {new Date(post.created).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              {#if post.reading?.text}
                <span>•</span>
                <span>{post.reading.text}</span>
              {/if}
              {#if post.series}
                <span>•</span>
                <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md text-xs font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  </svg>
                  {post.series}
                </span>
              {/if}
            </div>

            <h2
              class="text-2xl font-semibold group-hover:text-primary transition-colors"
            >
              {post.title}
            </h2>

            <p class="text-muted-foreground">
              {post.subTitle || ""}
            </p>

            {#if post.tags && post.tags.length > 0}
              <div class="flex gap-2 flex-wrap">
                {#each post.tags as tag}
                  <span class="inline-flex items-center gap-1 text-xs px-2 py-1 bg-accent text-accent-foreground rounded-md font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                      <line x1="7" y1="7" x2="7.01" y2="7"></line>
                    </svg>
                    {tag}
                  </span>
                {/each}
              </div>
            {/if}

            <div class="flex items-center justify-end">
              <span
                class="inline-flex items-center text-sm font-medium text-primary group-hover:underline"
              >
                {m.blog_read_more()}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="ml-1"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </span>
            </div>
          </a>
        </article>
      {/each}
    </div>
  </div>
</div>
