<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { FootPrint } from '$lib/kicad/footprint';
	import { getPCBContext, type Layer } from '$lib/context/pcb';
	import { getGraphics, renderGraphics } from '$lib/kicad/render';
	export let footprint: FootPrint;
	export let x = 0;
	export let y = 0;

	const pcbCtx = getPCBContext();

	// const g = pcbCtx.root.group();
	let cachedGroup = pcbCtx.cache[footprint.name];
	onDestroy(() => {
		cachedGroup.remove();
	});
	onMount(() => {
		if (footprint) {
			console.log(pcbCtx);
			if (cachedGroup) {
				pcbCtx.root
					.use(cachedGroup)
					.move(x * pcbCtx.mm + pcbCtx.globalOffset, y * pcbCtx.mm + pcbCtx.globalOffset);
				return;
			}
		}
	});
</script>

<style>
</style>
