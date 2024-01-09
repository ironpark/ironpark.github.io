<!-- src/routes/[slug]/+page.svelte -->

<script>
	import { Utterances } from '@codewithshin/svelte-utterances';
	export let data;
</script>

<article>
	<h1>{data.title}</h1>
	<p>Published: {data.date}</p>
	<svelte:component this={data.content} />
	<Utterances reponame="ironpark/ironpark.github.io" theme="github-dark" />
</article>

<style>
</style>
