<script lang="ts">
  import type { PageData } from "./$types";
  import BlogLayout from "$lib/layouts/blog-post.svelte";
  import TableOfContents from "$lib/components/TableOfContents.svelte";
  import Giscus from "@giscus/svelte";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
</script>

<BlogLayout {...data.metadata}>
  <!-- <svelte:component this={data.content} /> -->
  {@const Content = data.content}
  <Content />
  <Giscus
    id="comments"
    repo="ironpark/ironpark.github.io"
    repoId="MDEwOlJlcG9zaXRvcnkzNDgxMjA1Mg=="
    category="Posts"
    categoryId="DIC_kwDOAhMwlM4CtLG7"
    mapping="pathname"
    reactionsEnabled="1"
    emitMetadata="0"
    inputPosition="top"
    theme="noborder_dark"
    lang="en"
    loading="lazy"
  />
</BlogLayout>

<TableOfContents />
