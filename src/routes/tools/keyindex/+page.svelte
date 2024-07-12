<script lang="ts">
	import ToolBar from './ToolBar.svelte';
	import { Stage, Layer, Shape, Rect } from 'svelte-konva';
	import type { PageData } from './$types';
	import type { FootprintInfo, Key } from './types';
	import Preview from '$comp/keyindex/Preview.svelte';
	import Dialog from '$comp/dialog/Dialog.svelte';
	import { ANSI104, type Item } from './layout-editor';
	import PCB from '$comp/keyindex/PCB.svelte';
	import Footprint from '$comp/keyindex/Footprint.svelte';
	export let data: PageData;
	const { footprints } = data;
	const mm = 3;
	const unitSize = 19.05 * mm;
	let defaultFp: FootprintInfo[] = [
		{
			name: 'SW_MX_HS_1u',
			offsetX: 0,
			offsetY: 0
		},
		{
			name: 'LED_MX_WS2812_2020-ROT',
			offsetX: 0,
			offsetY: 15.4
		}
	];
	// console.log(footprints);
	let fp = footprints.find((f) => f.name.startsWith('SW_choc_v1_HS_CPG135001S30_1u'));
	console.log(fp);
	console.log(fp);
	let open = false;
	let texts = '';
	let keyList: Key[] = ANSI104;
	console.log(keyList);

	const loadLayoutEditorData = (data: string) => {
		let localKeyList: Key[] = [];
		data = data.replace(/([a-zA-Z]+):/g, '"$1":');
		data = `[${data}]`;
		const rows = JSON.parse(data) as Item[][];
		console.log(rows);
		let lastY = 0;
		for (let row = 0; row < rows.length; row++) {
			const items = rows[row];
			let lastX = 0;
			let w = 1;
			let h = 1;
			for (let col = 0; col < items.length; col++) {
				const item = items[col];
				if (typeof item === 'string') {
					localKeyList = [...localKeyList, { name: item, x: lastX, y: lastY, w: w, h: h }];
					lastX += w;
					[w, h] = [1, 1];
				} else {
					if (item.x) lastX += item.x;
					if (item.y) lastY += item.y;
					if (item.w) w = item.w;
					if (item.h) h = item.h;
				}
			}
			lastY += 1;
		}
		keyList = localKeyList;
	};
</script>

<div>KEY INDEX</div>

<ToolBar></ToolBar>
<div class="editor">
	<div class="flex-1">
		<Preview {unitSize} {keyList}></Preview>
	</div>
	<PCB {unitSize} {mm} footprints={[fp?.footprint]}>
		{#each keyList as key}
			<Footprint
				footprint={fp?.footprint}
				x={(key.x + key.w / 2) * 19.05}
				y={(key.y + key.h / 2) * 19.05}
			/>
		{/each}
	</PCB>
</div>

<Dialog
	title="From"
	role="alertdialog"
	bind:open
	on:confirm={() => {
		loadLayoutEditorData(texts);
	}}
>
	<div slot="content" class="contents">
		<div>
			<textarea bind:value={texts} class="border border-zinc-600 rounded p-1" />
		</div>
	</div>
</Dialog>

<!--<PCB {unitSize} bind:keyList footprints={data.footprints}></PCB>-->

<style lang="scss">
	.editor {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin: 10px;
		width: 100%;
		height: 100%;
	}
</style>
