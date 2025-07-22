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
    lang={locale === "ko" ? "ko" : locale === "jp" ? "ja" : "en"}
    loading="lazy"
    term={data.slug}
  />
</BlogLayout>

<TableOfContents />
