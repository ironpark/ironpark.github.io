<script lang="ts">
  // import { fade } from "svelte/transition";
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
  class="container px-4 mx-auto max-w-4xl pt-10"
>
  <header class="space-y-4">
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
    <div class="border-b border-dashed dark:border-white/50 border-black/50 my-10"></div>
  </header>
  <!-- prose-code:bg-muted prose-code:px-1.5 prose-code:py-1 prose-code:mx-1 prose-code:rounded prose-code:text-sm prose-code:font-mono  -->

  <div class="prose prose-lg prose-neutral dark:prose-invert max-w-none prose-li:my-0 
  prose-h1:my-8
  prose-h2:my-6
  prose-h3:my-4
  prose-h4:my-2
  prose-code:font-mono prose-code:text-sm
  prose-inline-code:before:content-[''] prose-inline-code:after:content-[''] prose-inline-code:inline-block
  prose-inline-code:bg-muted prose-inline-code:px-1.5 prose-inline-code:py-0.5 prose-inline-code:mx-0.5 prose-inline-code:rounded prose-inline-code:text-sm prose-inline-code:font-mono
  prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-0 prose-ol:mt-4
  prose-li:mt-0.5 prose-li:p-0
  prose-ul:list-disc prose-ul:pl-6 prose-ul:my-0 prose-ul:mt-4
  prose-p:mb-0 prose-p:mt-4
  ">
    {#if locale === "en"}
    <p class="text-base text-muted-foreground bg-muted p-4 rounded-md">
      This post was originally written in Korean and has been automatically translated to English using LLM. There may be translation errors, typos, or contextually strange parts.
    </p>
    {/if}
    {#if locale === "ja"}
    <p class="text-base text-muted-foreground bg-muted p-4 rounded-md">
      この投稿は元々韓国語で書かれており、LLMを使用して日本語に自動翻訳されています。翻訳エラー、タイプミス、または文脈上奇妙な部分がある可能性があります。
    </p>
    {/if}
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

<style lang="postcss">
  @import "tailwindcss";
  @plugin "@tailwindcss/typography";
  @import "tw-animate-css";
  /* @import "/src/app.postcss"; */
  
  .prose-content {
    code:not(pre > code) {
      @apply bg-muted px-1.5 py-1 mx-1 rounded text-sm font-mono;
    }
  }
</style>