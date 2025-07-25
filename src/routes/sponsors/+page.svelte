<script lang="ts">
  import SponsorHallOfFame from "$lib/components/SponsorHallOfFame.svelte";
  import * as m from "$lib/paraglide/messages";

  interface Sponsor {
    id: string;
    name: string;
    avatar?: string;
    url?: string;
    tier: "gold" | "silver" | "bronze" | "supporter";
    amount?: number;
    message?: string;
    joinedAt: Date;
  }

  // Example sponsor data - replace with actual data source
  const sponsors: Sponsor[] = [
    // Empty array to show the empty state
  ];
</script>

<svelte:head>
  <title>IRONPARK | {m.sponsors_title()}</title>
  <meta
    name="description"
    content="Support IRONPARK's open source projects and become a sponsor."
  />
</svelte:head>

<div class="container mx-auto max-w-6xl px-4 py-12">
  <div class="text-center mb-12">
    <h1 class="text-4xl font-bold mb-4">{m.sponsors_title()} 🏆</h1>
    <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
      {#if sponsors.length === 0}
        {m.sponsors_description_empty()}
      {:else}
        {m.sponsors_description_with_sponsors()}
      {/if}
    </p>
  </div>

  <SponsorHallOfFame {sponsors} />
</div>
