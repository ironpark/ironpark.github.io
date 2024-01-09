<script lang="ts">
	import type { PageData } from './$types';
	import GithubCalender from '../components/GithubCalender.svelte';

	export let data: PageData;
	let posts = data.posts;
	let info = data.userInfo;
	let contributions = info.contributionsCollection.contributionCalendar;
</script>

<svelte:head>
	<title>웹사이트 제목</title>
	<meta name="description" content="웹사이트 설명" />
</svelte:head>

<div style="display: flex">
	<GithubCalender {contributions} />
</div>

<ul class="posts">
	{#each posts as post}
		<li>
			<article>
				<h2 class="title"><a href={`${post.path}`}>{post.meta.title}</a></h2>
				<div class="tags">
					{#each post.meta.tags as tag}
						<a class="tag">{tag}</a>
					{/each}
				</div>
				<time class="published-at">{post.meta.date}</time>
			</article>
		</li>
	{/each}
</ul>

<style lang="scss">
	.posts {
		list-style: none;
		padding: 0;
	}
	.title {
		margin: 0;
	}
	.published-at {
		font-size: 0.8rem;
		color: #666;
	}
	a {
		color: #fff;
		text-decoration: none;
	}
	.tags {
		display: flex;
		gap: 5px;
	}
	.tag {
		display: inline-block;
		padding: 0.2rem 0.5rem;
		background-color: #131517;
		border-radius: 0.2rem;
		font-size: 14px;
	}
	article {
		background: #000a16;
		padding: 10px;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
	}
</style>
