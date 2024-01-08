<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
  let posts = data.posts;
  let info = data.userInfo;
  let contributions = info.contributionsCollection.contributionCalendar;

  const darkColor = (count: number) => {
    if (count === 0) return 'var(--color-calendar-graph-day-L0-bg)';
    if (count <= 3) return 'var(--color-calendar-graph-day-L1-bg)';
    if (count <= 6) return 'var(--color-calendar-graph-day-L2-bg)';
    if (count <= 9) return 'var(--color-calendar-graph-day-L3-bg)';
    return 'var(--color-calendar-graph-day-L4-bg)';
  };
</script>

<svelte:head>
  <title>웹사이트 제목</title>
  <meta name="description" content="웹사이트 설명" />
</svelte:head>
<div style="display: flex">
  <div class="contribution-calender">
    {#each contributions.weeks as week}
      <div class="week">
        {#each week.contributionDays as day}
          <span class="day" style="background-color: {darkColor(day.contributionCount)}"></span>
        {/each}
      </div>
    {/each}
  </div>
</div>

<ul class="posts">
  {#each posts as post}
    <li>
      <article>
        <h2 class="title"><a href={`${post.path}`}>{post.meta.title}</a></h2>
        <time class="published-at">{post.meta.date}</time>
      </article>
    </li>
  {/each}
</ul>

<style lang="scss">
  :root {
    --background-color: #24252f;
    --color-calendar-graph-day-border: rgba(27, 31, 35, 0.06);
    --color-calendar-graph-day-L0-bg: #161a23;
    --color-calendar-graph-day-L1-bg: #0e4429;
    --color-calendar-graph-day-L2-bg: #006d32;
    --color-calendar-graph-day-L3-bg: #26a641;
    --color-calendar-graph-day-L4-bg: #39d353;
  }
  .posts {
    list-style: none;
  }
  .title {
    margin: 0;
  }
  .published-at {
    font-size: 0.8rem;
    color: #666;
  }
  :global(body) {
    background-color: var(--background-color);
    color: #fff;
    font-family: 'Noto Sans KR', sans-serif;
    font-size: 16px;
    line-height: 1.5;
  }
  a {
    color: #fff;
    text-decoration: none;
  }
  .contribution-calender {
    border-radius: 4px;
    padding: 2px;
    display: flex;
    flex-direction: row;
    align-items: center;
    background: #0d1117;
    .week {
      display: inline-flex;
      flex-direction: column;
      align-self: stretch;
      .day {
        display: inline-block;
        width: 10px;
        height: 10px;
        margin: 1px;
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
