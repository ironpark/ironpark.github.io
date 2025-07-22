<script lang="ts">
  import "../app.css";
  import { ModeWatcher, toggleMode } from "mode-watcher";
  import { page } from "$app/state";
  import CommandPalette from "$lib/components/CommandPalette.svelte";
  import {
    setLocale,
    getLocale,
    locales,
    localizeHref,
  } from "$lib/paraglide/runtime";
  import * as m from "$lib/paraglide/messages";
  import { Command } from "@lucide/svelte";
  let { children } = $props();
  let commandPalette: CommandPalette;
  let currentLocale = $state(getLocale());
  let locale = getLocale();
  const navItems = $derived([
    { href: "/", label: m.nav_home() },
    { href: "/blog", label: m.nav_blog() },
    { href: "/projects", label: m.nav_projects() },
    { href: "/about", label: m.nav_about() },
  ]);
  const title = $derived(
    page.url.pathname.split("/").at(-1)?.toUpperCase() || ""
  );
</script>

<svelte:head>
  <title>{`IRONPARK | ${title}`}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  {/* @ts-ignore */ null}
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  {#if locale === "ko"}
    <link
      href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap"
      rel="stylesheet"
    />
  {:else if locale === "jp"}
    <link
      href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap"
      rel="stylesheet"
    />
  {:else}
    <link
      href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap"
      rel="stylesheet"
    />
  {/if}
</svelte:head>

<ModeWatcher />
<div style="display:none">
  {#each locales as locale}
    <a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
  {/each}
</div>
<div class="min-h-screen flex flex-col">
  <header
    class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
  >
    <div
      class="container flex h-16 items-center justify-between px-4 mx-auto max-w-6xl"
    >
      <nav class="flex items-center gap-6">
        <a
          href={localizeHref("/")}
          class="font-semibold text-lg hover:text-primary transition-colors flex items-center gap-2 justify-center"
        >
          <img src="/apple-icon-180x180.png" alt="logo" class="w-6 h-6" />
          {m.site_title()}
        </a>
        <div class="hidden md:flex items-center gap-6">
          {#each navItems as item}
            <a
              href={localizeHref(item.href)}
              class="text-sm font-medium transition-colors hover:text-primary {page
                .url.pathname === item.href
                ? 'text-primary'
                : 'text-muted-foreground'}"
            >
              /{item.label}
            </a>
          {/each}
        </div>
      </nav>

      <!-- Command Palette (Mobile) - Center -->
      <div class="md:hidden w-full flex justify-center px-5">
        <button
          onclick={() => commandPalette?.open()}
          class="md:hidden inline-flex items-center justify-start rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-9 border w-full"
          aria-label="Open command palette"
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
            class="ml-2 mr-2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <span class="inline-block text-sm">Search</span>
        </button>
      </div>

      <div class="flex items-center gap-1">
        <!-- Command Palette (Desktop) -->
        <button
          onclick={() => commandPalette?.open()}
          class="hidden md:inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-9 px-3 border"
          aria-label="Open command palette"
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
            class="mr-2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <span class="hidden sm:inline-block">Search</span>
          <kbd
            class="ml-2 bg-muted text-muted-foreground pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100"
          >
            <Command class="h-3 w-3" /> +
            <span class="text-xs">K</span>
          </kbd>
        </button>

        <!-- Theme Toggle -->
        <button
          onclick={toggleMode}
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-9 w-9 relative"
          aria-label="Toggle theme"
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
            class="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
          >
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
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
            class="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
          <span class="sr-only">Toggle theme</span>
        </button>

        <!-- GitHub -->
        <!-- <a
          href="https://github.com/ironpark"
          target="_blank"
          rel="noopener noreferrer"
          class="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="GitHub"
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
              d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
            />
          </svg>
        </a> -->

        <!-- Language Selector -->
        <div class="relative group">
          <button
            class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
            aria-label="Select language"
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
              class="mr-2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path
                d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
              ></path>
            </svg>
            <span class="hidden sm:inline-block">
              {currentLocale === "en"
                ? "EN"
                : currentLocale === "ko"
                  ? "KO"
                  : "JP"}
            </span>
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
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div
            class="absolute right-0 mt-2 w-32 rounded-md border bg-popover text-popover-foreground shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
          >
            <div class="p-1">
              {#each locales as locale}
                <button
                  onclick={() => {
                    setLocale(locale);
                    currentLocale = locale;
                  }}
                  class="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors {locale ===
                  currentLocale
                    ? 'bg-accent'
                    : ''}"
                >
                  {locale === "en"
                    ? "English"
                    : locale === "ko"
                      ? "한국어"
                      : "日本語"}
                </button>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <main class="flex-1">
    {@render children()}
  </main>

  <footer class="border-t">
    <div class="container px-4 py-8 mx-auto max-w-6xl">
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
        <p class="text-sm text-muted-foreground">
          © {new Date().getFullYear()}
          {m.site_title()}. All rights reserved.
        </p>
        <div class="flex items-center gap-6">
          <a
            href={localizeHref("/rss.xml")}
            class="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            RSS
          </a>
          <a
            href="/sitemap.xml"
            class="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sitemap
          </a>
        </div>
      </div>
    </div>
  </footer>
</div>

<CommandPalette bind:this={commandPalette} />
