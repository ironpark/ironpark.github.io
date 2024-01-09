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
				<h2 class="title">{post.meta.title}</h2>
				<div class="tags">
					{#each post.meta.tags as tag}
						<a class="tag">{tag}</a>
					{/each}
				</div>
				<time class="published-at">{post.meta.date}</time>
			</a>
		</li>
	{/each}
</ul>

<style lang="scss">
	.posts {
		list-style: none;
		padding: 10px;
		.article {
			display: block;
			background: #000a16;
			padding: 10px;
			border-radius: 10px;
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
			.title {
				margin: 0;
				font-size: 1.5rem;
			}
			&:hover {
				background: #001529;
				scale: 1.02;
			}
			transition: 0.2s;
		}
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
		padding: 0.1rem 0.4rem;
		background-color: #003d89;
		border-radius: 0.2rem;
		font-size: 14px;
	}
</style>
