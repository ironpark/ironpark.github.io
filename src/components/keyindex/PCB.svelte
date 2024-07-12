<script lang="ts">
	import { setPCBContext, type Layer } from '$lib/context/pcb';
	import { type G, SVG } from '@svgdotjs/svg.js';
	import { onDestroy, onMount } from 'svelte';
	export let unitSize: number;
	export let mm: number;
	import type { FootPrint } from '$lib/kicad/footprint';
	import { getGraphics, renderGraphics } from '$lib/kicad/render';

	export let footprints: FootPrint[];
	export let layers: Layer[] = [
		{ name: 'F.Cu', color: '#c93535', visible: true },
		{ name: 'B.Cu', color: '#4f7fc4', visible: true },
		{ name: 'F.Paste', color: '#a1928e', visible: true },
		{ name: 'B.Paste', color: '#00b1b2', visible: true },
		{ name: 'F.SilkS', color: '#f1eda2', visible: true },
		{ name: 'B.SilkS', color: '#e8b2a8', visible: true },
		{ name: 'Cmts.User', color: '#5994dc', visible: true },
		{ name: 'Eco1.User', color: '#b4dbd2', visible: true },
		{ name: 'Eco2.User', color: '#d7c852', visible: true },
		{ name: 'Dwgs.User', color: '#c1c2c2', visible: true },
		{ name: 'Edge.Cuts', color: '#d0d2cd', visible: true },
		{ name: 'Margin', color: '#ff3ce3', visible: false },
		{ name: 'B.CrtYd', color: '#ff3ce3', visible: false },
		{ name: 'F.CrtYd', color: '#24e8ff', visible: true },
		{ name: 'F.Fab', color: '#afafae', visible: true },
		{ name: 'B.Fab', color: '#575d84', visible: true }
	];

	let self: HTMLElement;
	const root = SVG();
	let cache: { [key: string]: G } = {};
	footprints.forEach((fp) => {
		let g = root.defs().group();
		[...layers].reverse().forEach((layer) => {
			let gps = getGraphics(fp, layer.name);
			renderGraphics(g, { color: layer.color, mm: mm, x: 0, y: 0 }, [...gps]);
		});
		cache[fp.name] = g;
	});
	setPCBContext({
		layers: layers,
		root: root,
		cache,
		mm: mm,
		globalOffset: 0,
		unitSize: unitSize
	});

	const observer = new ResizeObserver((entries) => {
		for (let entry of entries) {
			const { width, height } = entry.contentRect;
			root.size(width, height);
		}
	});
	onMount(() => {
		const rect = self.getBoundingClientRect();
		root.size(rect.width, rect.height);
		root.addTo(self);
		observer.observe(self);
	});
	onDestroy(() => {
		observer.observe(self);
		root.remove();
	});
</script>

<div bind:this={self} class="pcb">
	<slot />
</div>

<style lang="scss">
	.pcb {
		flex: 1;
		background: #001024;
	}
	.layers {
		border: solid 1px #ccc;
		padding: 5px;
		max-width: 140px;
		font-size: 13px;
		display: flex;
		flex-direction: column;
		gap: 3px;
		.layer {
			display: flex;
			align-items: center;
			gap: 10px;
			.name {
				flex: 1;
			}
			.color {
				width: 20px;
				height: 20px;
				border: none;
				border-radius: 5px;
				padding: 0;
				margin: 0;
				background: transparent;
			}
		}
	}
</style>
