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
		if (count === 0) return 'var(--color-calendar-graph-day-L0-bg)';
		if (count <= 3) return 'var(--color-calendar-graph-day-L1-bg)';
		if (count <= 6) return 'var(--color-calendar-graph-day-L2-bg)';
		if (count <= 9) return 'var(--color-calendar-graph-day-L3-bg)';
		return 'var(--color-calendar-graph-day-L4-bg)';
	};
</script>

<div class="contribution-calender">
	{#each contributions.weeks as week}
		<div class="week">
			{#each week.contributionDays as day}
				<span class="day" style="background-color: {darkColor(day.contributionCount)}"></span>
			{/each}
		</div>
	{/each}
</div>

<style lang="scss">
	:root {
		--color-calendar-graph-day-border: rgba(27, 31, 35, 0.06);
		--color-calendar-graph-day-L0-bg: #161a23;
		--color-calendar-graph-day-L1-bg: #0e4429;
		--color-calendar-graph-day-L2-bg: #006d32;
		--color-calendar-graph-day-L3-bg: #26a641;
		--color-calendar-graph-day-L4-bg: #39d353;
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
</style>
