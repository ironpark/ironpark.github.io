<script lang="ts">
  import { fade } from "svelte/transition";
  import type { PageData } from "./$types";
  import * as m from "$lib/paraglide/messages";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  let { projects } = data;

  const languageColors: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    Python: "#3572A5",
    Go: "#00ADD8",
    Rust: "#dea584",
    Java: "#b07219",
    C: "#555555",
    "C++": "#f34b7d",
    Ruby: "#701516",
    PHP: "#4F5D95",
  };
</script>

<div class="container px-4 mx-auto max-w-6xl py-16">
  <div class="space-y-8" in:fade={{ duration: 300 }}>
    <div class="space-y-4">
      <h1 class="text-4xl font-bold">{m.projects_title()}</h1>
      <p class="text-xl text-muted-foreground">
        {m.projects_description()}
      </p>
    </div>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {#each projects as project}
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          class="group block p-6 bg-card rounded-lg border hover:border-primary transition-all hover:shadow-lg"
        >
          <div class="space-y-3">
            <div class="flex items-start justify-between">
              <h3
                class="font-semibold text-lg group-hover:text-primary transition-colors"
              >
                {project.name}
              </h3>
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
                class="text-muted-foreground group-hover:text-primary transition-colors"
              >
                <path
                  d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                ></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </div>

            <p class="text-sm text-muted-foreground line-clamp-2">
              {project.description}
            </p>

            <div class="flex items-center gap-4 text-sm">
              <div class="flex items-center gap-1">
                <span
                  class="w-3 h-3 rounded-full"
                  style="background-color: {languageColors[project.language] ||
                    '#666'}"
                ></span>
                <span class="text-muted-foreground">{project.language}</span>
              </div>

              {#if project.stars}
                <div class="flex items-center gap-1 text-muted-foreground">
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
                  >
                    <polygon
                      points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                    ></polygon>
                  </svg>
                  <span>{project.stars}</span>
                </div>
              {/if}
            </div>

            <div class="flex flex-wrap gap-1 pt-2">
              {#each project.topics as topic}
                <span class="text-xs px-2 py-1 bg-secondary rounded-full">
                  {topic}
                </span>
              {/each}
            </div>
          </div>
        </a>
      {/each}
    </div>

    <div class="text-center pt-8">
      <a
        href="https://github.com/ironpark"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 px-6 py-3 bg-primary dark:bg-primary-foreground text-primary-foreground dark:text-primary rounded-md hover:bg-primary/90 transition-colors"
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
        {m.projects_view_all_github()}
      </a>
    </div>
  </div>
</div>
