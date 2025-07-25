<script lang="ts">
  import type { PageData } from "./$types";
  import BlogLayout from "$lib/layouts/blog-post.svelte";
  import TableOfContents from "$lib/components/TableOfContents.svelte";
  import Giscus from "@giscus/svelte";
  import { theme, mode } from "mode-watcher";
  import { getLocale } from "$lib/paraglide/runtime";
  import { page } from "$app/state";
  interface Props {
    data: PageData;
  }
  const locale = getLocale();

  let { data }: Props = $props();
</script>

<svelte:head>
  <title>{`IRONPARK | ${data.metadata.title}`}</title>
  <meta name="description" content={data.metadata.description} />

  <!-- Open Graph tags -->
  <meta property="og:title" content={data.metadata.title} />
  <meta property="og:site_name" content="IRONPARK" />
  <meta property="og:description" content={data.metadata.description} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={page.url.href} />
  <meta
    property="og:image"
    content={data.ogImage || "https://ironpark.github.io/og-default.png"}
  />
</svelte:head>

<BlogLayout {...data.metadata}>
  <!-- <svelte:component this={data.content} /> -->
  {@const Content = data.content}
  <Content />
  <div
    class="my-15 border-b border-dashed dark:border-white/50 border-black/50"
  ></div>
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
    term={data.slug}
  />
</BlogLayout>

<TableOfContents />
