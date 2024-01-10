<script>
	import '../code.css';
	import '../markdown.scss';
	import Header from '../components/Header.svelte';
</script>

<Header />
<slot />

<style lang="scss">
	:root {
		--background-color: #24252fff;
	}
	:global(body) {
		margin: 0;
		background-color: var(--background-color);
		color: #fff;
		font-family: 'Noto Sans KR', sans-serif;
		font-size: 16px;
		line-height: 1.5;
		width: 100vw;
		height: 100vh;
	}
</style>
