<script lang="ts">
  import { fade } from "svelte/transition";
  import type { PageData } from "./$types";
  import * as m from "$lib/paraglide/messages";
  import { getLocale, localizeHref } from "$lib/paraglide/runtime";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  let { recentPosts } = data;

  const locale = getLocale();
  const localeKey = locale === "ko" ? "ko" : locale === "jp" ? "jp" : "en";

  // Filter posts by current locale
</script>

<div class="container px-4 mx-auto max-w-6xl">
  <section class="py-20 md:py-32 space-y-8">
    <div class="max-w-4xl space-y-4" in:fade={{ duration: 300 }}>
      <h1 class="text-4xl md:text-6xl font-bold tracking-tight">
        {m.home_welcome_title()}
      </h1>
      <p class="text-xl text-muted-foreground">
        {m.home_welcome_description()}
      </p>
      <div class="flex gap-4 pt-4">
        <a
          href={localizeHref("/blog")}
          class="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          {m.home_read_blog_button()}
        </a>
        <a
          href={localizeHref("/about")}
          class="inline-flex items-center justify-center rounded-md border border-border px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          {m.home_about_button()}
        </a>
      </div>
    </div>
  </section>

  <section class="py-16 space-y-8">
    <div class="space-y-2">
      <h2 class="text-3xl font-bold">{m.home_recent_posts_title()}</h2>
      <p class="text-muted-foreground">{m.home_recent_posts_subtitle()}</p>
    </div>

    <div class="grid gap-8 md:gap-12">
      {#each recentPosts as post}
        <article class="group">
          <a href={localizeHref(`/blog/${post.slug}`)} class="block space-y-3">
            <time class="text-sm text-muted-foreground">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <h3
              class="text-2xl font-semibold group-hover:text-primary transition-colors"
            >
              {post.title}
            </h3>
            <p class="text-muted-foreground line-clamp-2">
              {post.description || post.excerpt || ""}
            </p>
            <span
              class="inline-flex items-center text-sm font-medium text-primary"
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
          </a>
        </article>
      {/each}
    </div>

    <div class="pt-8">
      <a
        href={localizeHref("/blog")}
        class="inline-flex items-center text-sm font-medium text-primary hover:underline"
      >
        {m.home_view_all_posts()}
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
      </a>
    </div>
  </section>
</div>
