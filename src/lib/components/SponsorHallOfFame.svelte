<script lang="ts">
  import { Trophy, ExternalLink } from "@lucide/svelte";
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

  interface Props {
    sponsors?: Sponsor[];
    showEmptyState?: boolean;
    maxDisplay?: number;
  }

  let { sponsors = [], showEmptyState = true, maxDisplay }: Props = $props();

  const tierConfig = {
    gold: {
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
    },
    silver: {
      color: "text-gray-400",
      bg: "bg-gray-400/10",
      border: "border-gray-400/20",
    },
    bronze: {
      color: "text-orange-600",
      bg: "bg-orange-600/10",
      border: "border-orange-600/20",
    },
    supporter: {
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
  };

  const displayedSponsors = $derived(
    maxDisplay ? sponsors.slice(0, maxDisplay) : sponsors
  );

  const isEmpty = $derived(sponsors.length === 0);
</script>

<div class="w-full">
  {#if isEmpty && showEmptyState}
    <!-- Empty State -->
    <div
      class="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <h3 class="text-2xl font-semibold mb-3 text-muted-foreground">
        {m.sponsors_empty_title()}
      </h3>

      <p class="text-muted-foreground mb-8 max-w-md">
        {m.sponsors_empty_description()}
      </p>

      <a
        href="https://github.com/sponsors/ironpark"
        target="_blank"
        rel="noopener noreferrer"
        class="relative inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 font-medium group overflow-hidden"
      >
        <!-- 후광 애니메이션 -->
        <div
          class="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        ></div>
        <div
          class="absolute -inset-1 rounded-lg bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-blue-500/30 blur-sm opacity-0 group-hover:opacity-60 transition-all duration-700 animate-pulse"
        ></div>

        <!-- 은은한 빛나는 효과 -->
        <div
          class="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-400/10 via-pink-400/10 to-purple-400/10 animate-pulse opacity-50"
        ></div>

        <!-- 버튼 내용 -->
        <div class="relative z-10 flex items-center gap-2">
          {m.sponsors_become_sponsor()}
          <ExternalLink class="w-4 h-4" />
        </div>
      </a>
    </div>
  {:else if !isEmpty}
    <!-- Sponsor Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each displayedSponsors as sponsor (sponsor.id)}
        <div
          class="group relative border rounded-lg p-6 transition-all duration-200 hover:shadow-md hover:border-primary/20 {tierConfig[
            sponsor.tier
          ].border} {tierConfig[sponsor.tier].bg}"
        >
          <!-- Tier Badge -->
          <div class="absolute top-4 right-4">
            <span
              class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium capitalize {tierConfig[
                sponsor.tier
              ].color} {tierConfig[sponsor.tier].bg}"
            >
              <Trophy class="w-3 h-3" />
              {sponsor.tier}
            </span>
          </div>

          <!-- Avatar & Name -->
          <div class="flex items-center gap-4 mb-4">
            {#if sponsor.avatar}
              <img
                src={sponsor.avatar}
                alt={sponsor.name}
                class="w-12 h-12 rounded-full border-2 {tierConfig[sponsor.tier]
                  .border}"
              />
            {:else}
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center {tierConfig[
                  sponsor.tier
                ].bg} {tierConfig[sponsor.tier].border} border-2"
              >
                <span
                  class="text-lg font-semibold {tierConfig[sponsor.tier].color}"
                >
                  {sponsor.name.charAt(0).toUpperCase()}
                </span>
              </div>
            {/if}

            <div>
              {#if sponsor.url}
                <a
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-semibold text-foreground hover:text-primary transition-colors group-hover:underline"
                >
                  {sponsor.name}
                </a>
              {:else}
                <span class="font-semibold text-foreground">{sponsor.name}</span
                >
              {/if}

              <p class="text-xs text-muted-foreground">
                Since {sponsor.joinedAt.toLocaleDateString()}
              </p>
            </div>
          </div>

          <!-- Message -->
          {#if sponsor.message}
            <blockquote
              class="text-sm text-muted-foreground italic border-l-2 pl-3 {tierConfig[
                sponsor.tier
              ].border}"
            >
              "{sponsor.message}"
            </blockquote>
          {/if}

          <!-- Amount (if specified) -->
          {#if sponsor.amount}
            <div class="mt-4 text-xs text-muted-foreground">
              Supporting with ${sponsor.amount}/month
            </div>
          {/if}
        </div>
      {/each}
    </div>

    <!-- Show More Link (if truncated) -->
    {#if maxDisplay && sponsors.length > maxDisplay}
      <div class="text-center mt-8">
        <p class="text-muted-foreground">
          Showing {maxDisplay} of {sponsors.length} sponsors
        </p>
      </div>
    {/if}
  {/if}
</div>
