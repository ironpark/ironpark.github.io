<script lang="ts">
	import Key from '$comp/keyindex/Key.svelte';
	import DragBox from '$comp/keyindex/DragBox.svelte';

	export let unitSize: number;
	interface Box {
		startX: number;
		startY: number;
		endX: number;
		endY: number;
	}
	interface Key {
		x: number;
		y: number;
		name: string;
		selected: boolean;
	}
	export let keyList: Key[];
	const keyToBox = (key: Key) => {
		return {
			startX: key.x * unitSize,
			startY: key.y * unitSize,
			endX: key.x * unitSize + unitSize,
			endY: key.y * unitSize + unitSize
		};
	};
	const isBoxAInsideBoxB = (boxA: Box, boxB: Box) => {
		// Check top-left corner of boxA
		const topLeftAInB =
			boxA.startX >= boxB.startX &&
			boxA.startX <= boxB.endX &&
			boxA.startY >= boxB.startY &&
			boxA.startY <= boxB.endY;
		// Check bottom-right corner of boxA
		const bottomRightAInB =
			boxA.endX >= boxB.startX &&
			boxA.endX <= boxB.endX &&
			boxA.endY >= boxB.startY &&
			boxA.endY <= boxB.endY;
		return topLeftAInB && bottomRightAInB;
	};
</script>

<DragBox
	on:dragSelect={(e) => {
		const box = e.detail;
		console.log('selected check', box);
		keyList = keyList.map((e) => {
			e.selected = isBoxAInsideBoxB(keyToBox(e), box);
			return e;
		});
	}}
>
	<div class="preview">
		{#each keyList as key}
			<Key
				{unitSize}
				{...key}
				on:click={(e) => {
					keyList = keyList.map((e) => ({ ...e, selected: e === key }));
				}}
			/>
		{/each}
	</div>
</DragBox>

<style lang="scss">
	.preview {
		position: relative;
		padding: 5px;
		width: 100%;
		height: 100%;
	}
</style>
