<script lang="ts">
  import { onMount } from "svelte";

  interface TocItem {
    id: string;
    text: string;
    level: number;
  }

  let toc = $state<TocItem[]>([]);
  let activeId = $state<string>("");
  let hasTocItems = $state(false);
  let showMobileToc = $state(false);

  onMount(() => {
    // Extract headings from the article
    const article = document.querySelector("article");
    if (!article) return;

    const headings = article.querySelectorAll("h2, h3");
    const tocItems: TocItem[] = [];

    headings.forEach((heading) => {
      // Create ID if it doesn't exist
      if (!heading.id) {
        heading.id =
          heading.textContent
            ?.toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-") || "";
      }

      tocItems.push({
        id: heading.id,
        text: heading.textContent || "",
        level: parseInt(heading.tagName[1]),
      });
    });

    toc = tocItems;
    hasTocItems = tocItems.length > 0;

    // Set up intersection observer for active section
    const observerOptions = {
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeId = entry.target.id;
        }
      });
    }, observerOptions);

    headings.forEach((heading) => observer.observe(heading));

    return () => {
      headings.forEach((heading) => observer.unobserve(heading));
    };
  });

  function scrollToSection(id: string) {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }
</script>

{#if hasTocItems}
  <aside
    class="hidden xl:block fixed right-8 top-32 w-50 max-h-[calc(100vh-10rem)] overflow-y-auto"
  >
    <nav class="space-y-1 pl-4 border-l-2 border-border">
      <h3
        class="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4"
      >
        On this page
      </h3>
      {#each toc as item}
        <button
          onclick={() => scrollToSection(item.id)}
          class="block w-full text-left py-1 px-2 text-sm transition-colors hover:text-primary {item.id ===
          activeId
            ? 'text-primary font-medium border-l-2 border-primary -ml-[2px]'
            : 'text-muted-foreground'}"
          style="padding-left: {(item.level - 2) * 1}rem"
        >
          {item.text}
        </button>
      {/each}
    </nav>
  </aside>

  <!-- Mobile TOC Toggle -->
  <div class="xl:hidden fixed bottom-8 right-8 z-50">
    <button
      onclick={() => (showMobileToc = !showMobileToc)}
      class="p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors"
      aria-label="Toggle table of contents"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="8" y1="6" x2="21" y2="6"></line>
        <line x1="8" y1="12" x2="21" y2="12"></line>
        <line x1="8" y1="18" x2="21" y2="18"></line>
        <line x1="3" y1="6" x2="3.01" y2="6"></line>
        <line x1="3" y1="12" x2="3.01" y2="12"></line>
        <line x1="3" y1="18" x2="3.01" y2="18"></line>
      </svg>
    </button>
  </div>

  <!-- Mobile TOC Drawer -->
  {#if showMobileToc}
    <div class="xl:hidden fixed inset-0 z-40 flex justify-end">
      <div
        class="absolute inset-0 bg-black/50"
        onclick={() => (showMobileToc = false)}
      ></div>
      <nav
        class="relative bg-background border-l w-80 max-w-full p-6 overflow-y-auto"
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-semibold text-lg">On this page</h3>
          <button
            onclick={() => (showMobileToc = false)}
            class="p-1 hover:bg-accent rounded-md transition-colors"
            aria-label="Close table of contents"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="space-y-1">
          {#each toc as item}
            <button
              onclick={() => {
                scrollToSection(item.id);
                showMobileToc = false;
              }}
              class="block w-full text-left py-2 px-3 text-sm transition-colors rounded-md hover:bg-accent {item.id ===
              activeId
                ? 'bg-accent font-medium'
                : ''}"
              style="padding-left: {(item.level - 2) * 1 + 0.75}rem"
            >
              {item.text}
            </button>
          {/each}
        </div>
      </nav>
    </div>
  {/if}
{/if}
