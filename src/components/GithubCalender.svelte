<script lang="ts">
	export let contributions: {
		totalContributions: number;
		weeks: {
			contributionDays: {
				contributionCount: number;
				date: string;
				weekday: number;
			}[];
		}[];
	};
	const darkColor = (count: number) => {
		if (count === 0) return 0;
		if (count <= 3) return 1;
		if (count <= 6) return 2;
		if (count <= 9) return 3;
		return 4;
	};
</script>

<div class="contribution-calender">
	{#each contributions.weeks as week}
		<div class="week">
			{#each week.contributionDays as day}
				<span class="day lv{darkColor(day.contributionCount)}"></span>
			{/each}
		</div>
	{/each}
</div>

<style lang="scss">
	:root {
		--color-calendar-graph-day-border: rgba(27, 31, 35, 0.06);
		--color-L0-bg: #161a23;
		--color-L1-bg: #0e4429;
		--color-L2-bg: #006d32;
		--color-L3-bg: #26a641;
		--color-L4-bg: #39d353;
	}
	.contribution-calender {
		border-radius: 4px;
		padding: 2px;
		align-items: center;
		background: #0d1117;
		width: 100%;
		max-width: 800px;
		display: flex;
		.week {
			aspect-ratio: 1 / 7;
			display: flex;
			flex-direction: column;
			align-self: stretch;
			flex: 1;
			.day {
				aspect-ratio: 1 / 1;
				margin: min(calc(100vw / 800), 1px);
				border-radius: 2px;
				font-size: 10px;
				text-align: center;
				line-height: 12px;
				outline: 1px solid var(--color-calendar-graph-day-border);
				outline-offset: -1px;
			}
		}
	}
	.lv0 {
	}
	.lv1 {
		animation: 2s infinite alternate ease-in-out breathing-1;
	}
	.lv2 {
		animation: 4s infinite alternate ease-in-out breathing-2;
	}
	.lv3 {
		animation: 6s infinite alternate ease-in-out breathing-3;
	}
	.lv4 {
		animation: 3s infinite alternate ease-in-out breathing-4;
	}
	@keyframes breathing-1 {
		from {
			background-color: var(--color-L1-bg);
		}
		to {
			background-color: hsl(0, 0%, 10%);
		}
	}
	@keyframes breathing-2 {
		from {
			background-color: var(--color-L2-bg);
		}
		to {
			background-color: hsl(0, 0%, 10%);
		}
	}
	@keyframes breathing-3 {
		from {
			background-color: var(--color-L3-bg);
		}
		to {
			background-color: var(--color-L1-bg);
		}
	}
	@keyframes breathing-4 {
		from {
			background-color: var(--color-L4-bg);
		}
		to {
			background-color: var(--color-L2-bg);
		}
	}
</style>
