<script>
	import '../code.css';
</script>

<slot />

<style lang="scss">
	:root {
		--background-color: #24252fff;
	}
	:global(body) {
		background-color: var(--background-color);
		color: #fff;
		font-family: 'Noto Sans KR', sans-serif;
		font-size: 16px;
		line-height: 1.5;
	}
</style>
