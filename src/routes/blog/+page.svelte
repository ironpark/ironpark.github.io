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

  let selectedTag = $state<string | null>(null);

  // All posts are already filtered by locale on the server
  const allTags = [
    ...new Set(posts.flatMap((post) => post.tags || [])),
  ].sort();

  const filteredPosts = $derived(
    selectedTag
      ? posts.filter((post) => post.tags?.includes(selectedTag!))
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
          onclick={() => (selectedTag = null)}
          class="px-3 py-1 text-sm rounded-full transition-colors {!selectedTag
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}"
        >
          {m.blog_all_posts()}
        </button>
        {#each allTags as tag}
          <button
            onclick={() => (selectedTag = tag)}
            class="px-3 py-1 text-sm rounded-full transition-colors {selectedTag ===
            tag
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}"
          >
            {tag}
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
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              {#if post.reading?.text}
                <span>•</span>
                <span>{post.reading.text}</span>
              {/if}
            </div>

            <h2
              class="text-2xl font-semibold group-hover:text-primary transition-colors"
            >
              {post.title}
            </h2>

            <p class="text-muted-foreground">
              {post.description || ""}
            </p>

            <div class="flex items-center justify-between">
              <div class="flex gap-2 flex-wrap">
                {#each post.tags || [] as tag}
                  <span class="text-xs px-2 py-1 bg-secondary rounded-md">
                    {tag}
                  </span>
                {/each}
              </div>

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
