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

<div style="display: flex;justify-content: center;padding: 10px">
	<GithubCalender {contributions} />
</div>

<ul class="posts">
	{#each posts as post}
		<li>
			<a class="article" href={`${post.path}`}>
				<div>
					<h2 class="title">{post.meta.title}</h2>
					<div class="tags">
						{#each post.meta.tags as tag}
							<a class="tag">#{tag}</a>
						{/each}
					</div>
				</div>
				<span class="published-at">{post.meta.date}</span>
			</a>
		</li>
	{/each}
</ul>

<style lang="scss">
	.posts {
		list-style: none;
		padding: 10px;
		max-width: 800px;
		margin: 0 auto;
		.article {
			display: flex;
			justify-content: space-between;
			align-items: center;
			.title {
				margin: 0;
				font-size: 1.3rem;
				font-weight: 300;
			}
			&:hover {
				scale: 1.01;
			}
			transition: 0.2s;
		}
	}

	.published-at {
		font-size: 0.9rem;
		color: #959595;
		letter-spacing: 0.09rem;
	}
	a {
		color: #fff;
		text-decoration: none;
	}
	.tags {
		display: flex;
		gap: 4px;
	}
	.tag {
		display: inline-block;
		border-radius: 0.2rem;
		font-size: 14px;
		font-weight: 400;
	}
</style>
