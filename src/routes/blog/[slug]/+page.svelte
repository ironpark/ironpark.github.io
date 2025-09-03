<script lang="ts">
  import type { PageData } from "./$types";
  import TableOfContents from "$lib/components/TableOfContents.svelte";
  import { getLocale } from "$lib/paraglide/runtime";
  import { page } from "$app/state";
  interface Props {
    data: PageData;
  }
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

<data.content />

<TableOfContents />

<style lang="postcss">
  @import "tailwindcss";
  :global(main article img) {
    @apply rounded-lg;
  }
  :global(.mermaid) {
    @apply rounded-lg p-4 bg-white dark:bg-zinc-900;
  }
</style>