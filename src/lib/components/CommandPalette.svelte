<script lang="ts">
  import { onMount } from "svelte";
  import { fade, scale } from "svelte/transition";
  import { goto } from "$app/navigation";
  import {
    setLocale,
    getLocale,
    locales,
    localizeHref,
  } from "$lib/paraglide/runtime";

  // 로케일에 따라 블로그 포스트를 다르게 import
  const locale = getLocale();

  let blogPosts: any[] = [];

  if (locale === "en") {
    blogPosts = Object.entries(
      import.meta.glob("/src/content/blog/translate/*.en.md", { eager: true })
    ).map(([path, module]: [string, any]) => ({
      slug: path.split("/").pop()?.replace(".en.md", "") || "",
      ...module.metadata,
    }));
  } else if (locale === "jp") {
    blogPosts = Object.entries(
      import.meta.glob("/src/content/blog/translate/*.jp.md", { eager: true })
    ).map(([path, module]: [string, any]) => ({
      slug: path.split("/").pop()?.replace(".jp.md", "") || "",
      ...module.metadata,
    }));
  } else {
    // 기본(한국어)
    blogPosts = Object.entries(
      import.meta.glob("/src/content/blog/*.md", { eager: true })
    ).map(([path, module]: [string, any]) => ({
      slug: path.split("/").pop()?.replace(".md", "") || "",
      ...module.metadata,
    }));
  }

  interface Command {
    id: string;
    title: string;
    description?: string;
    action: () => void;
    icon?: string;
    category?: string;
  }

  let isOpen = $state(false);
  let searchQuery = $state("");
  let selectedIndex = $state(0);
  let searchInput: HTMLInputElement;
  let dialogElement: HTMLDivElement;
  let isMobile = $state(false);
  let keyboardHeight = $state(0);
  let isInitialOpen = $state(false);

  const navigationCommands: Command[] = [
    {
      id: "home",
      title: "/home",
      description: "Navigate to the home page",
      action: () => goto(localizeHref("/")),
      category: "Navigation",
    },
    {
      id: "blog",
      title: "/blog",
      description: "View all blog posts",
      action: () => goto(localizeHref("/blog")),
      category: "Navigation",
    },
    {
      id: "projects",
      title: "/projects",
      description: "View my open-source projects",
      action: () => goto(localizeHref("/projects")),
      category: "Navigation",
    },
    {
      id: "about",
      title: "/about",
      description: "Learn more about me",
      action: () => goto(localizeHref("/about")),
      category: "Navigation",
    },
  ];

  const externalCommands: Command[] = [
    {
      id: "github",
      title: "/github",
      description: "Visit my GitHub profile",
      action: () => window.open("https://github.com/ironpark", "_blank"),
      category: "External",
    },
    {
      id: "rss",
      title: "/rss",
      description: "Subscribe to RSS feed",
      action: () => goto(localizeHref("/rss.xml")),
      category: "External",
    },
  ];

  const blogCommands: Command[] = blogPosts.map((post) => ({
    id: `blog-${post.slug}`,
    title: post.title,
    description:
      post.description ||
      `Published on ${new Date(post.date).toLocaleDateString()}`,
    action: () => goto(localizeHref(`/blog/${post.slug}`)),
    category: "Blog Posts",
  }));

  const commands: Command[] = [
    ...navigationCommands,
    ...externalCommands,
    ...blogCommands,
  ];

  const filteredCommands = $derived(
    searchQuery
      ? commands.filter(
          (cmd) =>
            cmd.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cmd.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : commands
  );

  const groupedCommands = $derived(
    filteredCommands.reduce(
      (groups, command) => {
        const category = command.category || "Other";
        if (!groups[category]) groups[category] = [];
        groups[category].push(command);
        return groups;
      },
      {} as Record<string, Command[]>
    )
  );

  export function open() {
    isOpen = true;
    isInitialOpen = true;
    selectedIndex = 0;
    searchQuery = "";
    keyboardHeight = 0; // Reset keyboard height on open
    // Prevent body scroll on mobile when palette is open
    if (isMobile) {
      document.body.style.overflow = "hidden";
    }
  }

  export function close() {
    isOpen = false;
    // Restore body scroll
    document.body.style.overflow = "";
    // Blur the input to close keyboard on mobile
    searchInput?.blur();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!isOpen) return;

    switch (e.key) {
      case "Escape":
        close();
        break;
      case "ArrowDown":
        e.preventDefault();
        selectedIndex = Math.min(
          selectedIndex + 1,
          filteredCommands.length - 1
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, 0);
        break;
      case "Enter":
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          close();
        }
        break;
    }
  }

  function handleGlobalKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      if (isOpen) {
        close();
      } else {
        open();
      }
    }
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      close();
    }
  }

  onMount(() => {
    window.addEventListener("keydown", handleGlobalKeydown);
    // Check if mobile
    const checkMobile = () => {
      isMobile = window.innerWidth < 640;
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Handle virtual keyboard on mobile
    const handleViewportChange = () => {
      if (window.visualViewport && isMobile && isOpen) {
        const viewport = window.visualViewport;
        const keyboardH = window.innerHeight - viewport.height;
        // Only update if there's a significant change to avoid jitter
        if (Math.abs(keyboardHeight - keyboardH) > 10) {
          keyboardHeight = Math.max(0, keyboardH);
        }
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleViewportChange);
      window.visualViewport.addEventListener("scroll", handleViewportChange);
    }

    return () => {
      window.removeEventListener("keydown", handleGlobalKeydown);
      window.removeEventListener("resize", checkMobile);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener(
          "resize",
          handleViewportChange
        );
        window.visualViewport.removeEventListener(
          "scroll",
          handleViewportChange
        );
      }
    };
  });

  $effect(() => {
    if (isOpen && searchInput) {
      // Delay focus on mobile to ensure proper keyboard behavior
      if (isMobile) {
        // Wait for dialog to be positioned before focusing
        requestAnimationFrame(() => {
          searchInput.focus({ preventScroll: true });
          // Remove initial open flag after focus
          setTimeout(() => {
            isInitialOpen = false;
          }, 300);
        });
      } else {
        searchInput.focus();
      }
    }
  });
</script>

{#if isOpen}
  <div
    class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
    onclick={handleBackdropClick}
    transition:fade={{ duration: 150 }}
  >
    <div
      bind:this={dialogElement}
      class="fixed inset-x-0 z-50 px-4 sm:inset-auto sm:left-[50%] sm:top-[50%] sm:w-full sm:max-w-2xl sm:translate-x-[-50%] sm:translate-y-[-50%] sm:px-0 sm:pb-0"
      style={isMobile
        ? `bottom: ${keyboardHeight}px; padding-bottom: ${keyboardHeight > 0 ? "1rem" : "env(safe-area-inset-bottom, 1rem)"}; transition: ${isInitialOpen ? "none" : "bottom 0.2s ease-out"};`
        : ""}
    >
      <div
        class="bg-background border rounded-lg shadow-lg w-full"
        transition:scale={{
          duration: isMobile ? 100 : 150,
          start: isMobile ? 1 : 0.95,
        }}
      >
        <div class="flex items-center border-b px-3">
          <svg
            class="mr-2 h-4 w-4 shrink-0 opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            bind:this={searchInput}
            bind:value={searchQuery}
            onkeydown={handleKeydown}
            placeholder="Type a command or search..."
            class="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
          <kbd
            class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
          >
            <span class="text-xs">ESC</span>
          </kbd>
        </div>

        <div
          class="overflow-y-auto p-2 overscroll-contain"
          style={isMobile
            ? `max-height:calc(70vh - ${keyboardHeight}px)`
            : "max-height: 400px"}
        >
          {#if filteredCommands.length === 0}
            <div class="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </div>
          {:else}
            {#each Object.entries(groupedCommands) as [category, categoryCommands], categoryIndex}
              <div>
                <div
                  class="px-2 py-1.5 text-xs font-semibold text-muted-foreground"
                >
                  {category}
                </div>
                {#each categoryCommands as command, commandIndex}
                  {@const globalIndex = filteredCommands.findIndex(
                    (cmd) => cmd.id === command.id
                  )}
                  <button
                    onclick={() => {
                      command.action();
                      close();
                    }}
                    onmouseenter={() => (selectedIndex = globalIndex)}
                    class="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors
                      {globalIndex === selectedIndex
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-accent hover:text-accent-foreground'}"
                  >
                    <div class="flex flex-col items-start gap-0.5">
                      <span class="text-xs font-bold">{command.title}</span>
                      {#if command.description}
                        <span class="text-xs text-muted-foreground">
                          {command.description}
                        </span>
                      {/if}
                    </div>
                  </button>
                {/each}
              </div>
            {/each}
          {/if}
        </div>

        <div class="flex items-center justify-between border-t px-3 py-2">
          <div class="flex gap-2 text-[11px] text-muted-foreground">
            <kbd
              class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium"
            >
              <span class="text-xs">↑↓</span>
            </kbd>
            <span>Navigate</span>
            <kbd
              class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium"
            >
              <span class="text-xs">↵</span>
            </kbd>
            <span>Select</span>
          </div>
          <div class="text-[11px] text-muted-foreground">
            <kbd
              class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium"
            >
              <span class="text-xs">⌘K</span>
            </kbd>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
