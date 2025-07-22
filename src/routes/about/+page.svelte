<script lang="ts">
  import { fade } from "svelte/transition";
  import { decryptAES } from "$lib/utils/crypto";
  import type { PageData } from "./$types";
  import { getLocale } from "$lib/paraglide/runtime";
  import "devicon/devicon.min.css";
  let { data }: { data: PageData } = $props();
  const locale = getLocale();

  const techStack = [
    { name: "PostgreSQL", icon: "devicon-postgresql-plain" },
    { name: "SvelteKit", icon: "devicon-svelte-plain" },
    { name: "Tailwind CSS", icon: "devicon-tailwindcss-plain" },
    { name: "Node.js", icon: "devicon-nodejs-plain" },
    { name: "Git", icon: "devicon-git-plain" },
    { name: "Docker", icon: "devicon-docker-plain" },
    { name: "AWS", icon: "devicon-amazonwebservices-plain" },
    { name: "GCP", icon: "devicon-googlecloud-plain" },
  ];
  const programmingLanguages = [
    { name: "Go", icon: "devicon-go-plain" },
    { name: "C", icon: "devicon-c-plain" },
    { name: "Zig", icon: "devicon-zig-plain" },
    { name: "TypeScript", icon: "devicon-typescript-plain" },
    { name: "SQL", icon: "devicon-sqlite-plain" },
    { name: "Python", icon: "devicon-python-plain" },
    { name: "Shell Script", icon: "devicon-bash-plain" },
  ];

  async function handleLinkedInClick(event: MouseEvent) {
    event.preventDefault();

    try {
      const decryptedUrl = await decryptAES(
        data.encryptedLinkedInUrl,
        data.decryptPassword
      );
      window.open(decryptedUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Failed to decrypt LinkedIn URL:", error);
      // Fallback or error handling
    }
  }
</script>

<div class="container px-4 mx-auto max-w-4xl py-16" in:fade={{ duration: 300 }}>
  <div class="space-y-8">
    <header class="space-y-4">
      <h1 class="text-4xl font-bold">Just a developer.</h1>
      {#if locale === "ko"}
        <p class="text-xl text-muted-foreground">안녕하세요 :P</p>
      {:else if locale === "jp"}
        <p class="text-xl text-muted-foreground">こんにちは :P</p>
      {:else}
        <p class="text-xl text-muted-foreground">Hello :P</p>
      {/if}
    </header>

    <div class="prose prose-neutral dark:prose-invert max-w-none space-y-6">
      <!-- <section>
        <h2 class="text-2xl font-semibold mb-4">Background</h2>
        <p>기본적으로는 백엔드 개발자입니다.</p>
        <p>최근에는 프론트엔드 개발자로 전향하고 있습니다.</p>
      </section> -->

      <section>
        <h2 class="text-2xl font-semibold mb-4">Tech Stack</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 not-prose">
          {#each techStack as tech}
            <div class="flex items-center gap-2 p-3 rounded-lg bg-secondary">
              <i class={tech.icon}></i>
              <span class="text-sm font-medium">{tech.name}</span>
            </div>
          {/each}
        </div>
      </section>

      <section>
        <h2 class="text-2xl font-semibold mb-4">Programming Languages</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 not-prose">
          {#each programmingLanguages as lang}
            <div class="flex items-center gap-2 p-3 rounded-lg bg-secondary">
              <i class={lang.icon}></i>
              <span class="text-sm font-medium">{lang.name}</span>
            </div>
          {/each}
        </div>
      </section>

      <section>
        <h2 class="text-2xl font-semibold mb-4">Connect</h2>
        <div class="flex gap-4 not-prose">
          <a
            href="https://github.com/ironpark"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <i class="devicon-github-plain text-xl"></i>
            GitHub
          </a>

          <button
            onclick={handleLinkedInClick}
            class="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <i class="devicon-linkedin-plain text-xl"></i>
            LinkedIn
          </button>
        </div>
      </section>
    </div>
  </div>
</div>
