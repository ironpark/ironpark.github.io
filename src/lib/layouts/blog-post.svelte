<script lang="ts">
  import { fade } from "svelte/transition";
  import * as m from "$lib/paraglide/messages";
  import type { Snippet } from "svelte";
  import { getLocale } from "$lib/paraglide/runtime";
  import Giscus from "@giscus/svelte";
  import { mode } from "mode-watcher";
  interface Props {
    slug: string;
    title: string;
    subTitle: string;
    created: string;
    updated: string;
    tags?: string[];
    description?: string;
    reading?: {
      text: string;
      minutes: number;
    };
    children?: Snippet;
  }
  const locale = getLocale();
  let {
    slug,
    title,
    created,
    updated,
    tags = [],
    subTitle,
    reading,
    children,
  }: Props = $props();
</script>

<article
  class="container px-4 mx-auto max-w-4xl py-16"
  in:fade={{ duration: 300 }}
>
  <header class="space-y-4 mb-8">
    <div class="flex items-center gap-4 text-sm text-muted-foreground">
      <time>
        {new Date(created).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>
      {#if reading}
        <span>•</span>
        <span>{reading.text}</span>
      {/if}
    </div>

    <h1 class="text-4xl md:text-5xl font-bold tracking-tight">
      {title}
    </h1>

    {#if subTitle}
      <p class="text-xl text-muted-foreground">
        {subTitle}
      </p>
    {/if}

    {#if tags.length > 0}
      <div class="flex gap-2 flex-wrap">
        {#each tags as tag}
          <span class="text-xs px-2 py-1 bg-secondary rounded-md">
            {tag}
          </span>
        {/each}
      </div>
    {/if}
  </header>

  <div
    class="prose prose-lg prose-neutral dark:prose-invert max-w-none
    prose-headings:font-bold prose-headings:tracking-tight
    prose-headings:text-foreground dark:prose-headings:text-foreground
    prose-h1:text-4xl prose-h1:mt-8 prose-h1:mb-4
    prose-h2:text-3xl prose-h2:mt-6 prose-h2:mb-4
    prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-4
    prose-h4:text-xl prose-h4:mt-4 prose-h4:mb-2
    prose-p:text-base prose-p:leading-7 prose-p:my-4 prose-p:text-muted-foreground dark:prose-p:text-muted-foreground
    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
    prose-strong:font-semibold prose-strong:text-foreground dark:prose-strong:text-foreground
    prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-foreground dark:prose-code:text-foreground
    prose-pre:bg-zinc-900 dark:prose-pre:bg-zinc-950 prose-pre:text-zinc-50 prose-pre:rounded-lg prose-pre:overflow-x-auto
    prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground dark:prose-blockquote:text-muted-foreground
    prose-ul:list-disc prose-ul:pl-6 prose-ul:text-muted-foreground dark:prose-ul:text-muted-foreground
    prose-ol:list-decimal prose-ol:pl-6 prose-ol:text-muted-foreground dark:prose-ol:text-muted-foreground
    prose-li:my-2
    prose-hr:border-border dark:prose-hr:border-border"
  >
    {@render children?.()}
  </div>
  <div class="my-15 border-b border-dashed dark:border-white/50 border-black/50"></div>

  <Giscus
    id="comments"
    repo="ironpark/ironpark.github.io"
    repoId="MDEwOlJlcG9zaXRvcnkzNDgxMjA1Mg=="
    category="Posts"
    categoryId="DIC_kwDOAhMwlM4CtLG7"
    mapping="specific"
    reactionsEnabled="1"
    emitMetadata="0"
    inputPosition="top"
    theme={mode.current === "dark" ? "noborder_dark" : "noborder_light"}
    lang={locale === "ko" ? "ko" : locale === "ja" ? "ja" : "en"}
    loading="lazy"
    term={slug}
  /> 
  <footer class="mt-16 pt-8 border-t">
    <div class="flex items-center justify-between">
      <a
        href="/blog"
        class="inline-flex items-center text-sm font-medium text-primary hover:underline"
      >
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
          class="mr-1"
        >
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        {m.blog_back_to_blog()}
      </a>

      <div class="flex gap-4">
        <a
          href="https://twitter.com/intent/tweet?url={encodeURIComponent(
            `https://ironpark.github.io/${locale}/blog/${title}`
          )}&text={encodeURIComponent(title)}"
          target="_blank"
          rel="noopener noreferrer"
          class="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Share on Twitter"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"
            />
          </svg>
        </a>
      </div>
    </div>
  </footer>
</article>

