<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatcher = createEventDispatcher();
	let [left, top, bottom, right, w, h] = [0, 0, 0, 0, 0, 0];
	let dragStart = false;
	let self: HTMLElement;
	let box: { startX: number; startY: number; endX: number; endY: number } = {
		startX: 0,
		startY: 0,
		endX: 0,
		endY: 0
	};
	let style = '';
	const mousemove = (e: MouseEvent) => {
		if (!dragStart) {
			return;
		}
		w = Math.abs(box.startX - e.pageX);
		h = Math.abs(box.startY - e.pageY);
		let local = `width:${w}px;height:${h}px`;
		if (box.startX < e.pageX) {
			left = box.startX;
			local = `${local};left:${left}px`;
		} else {
			right = document.body.clientWidth - box.startX;
			local = `${local};right:${right}px`;
		}
		if (box.startY < e.pageY) {
			top = box.startY;
			local = `${local};top:${top}px`;
		} else {
			bottom = document.body.clientHeight - box.startY;
			local = `${local};bottom:${bottom}px`;
		}
		style = local;
	};
	const mouseup = (e: MouseEvent) => {
		if (dragStart) {
			style = '';
			dragStart = false;
			box.endX = e.pageX;
			box.endY = e.pageY;
			if (box.endX < box.startX) {
				[box.endX, box.startX] = [box.startX, box.endX];
			}
			if (box.endY < box.startY) {
				[box.endY, box.startY] = [box.startY, box.endY];
			}
			const rect = self.getBoundingClientRect();
			box.startX -= rect.x;
			box.endX -= rect.x;
			box.startY -= rect.y;
			box.endY -= rect.y;
			dispatcher('dragSelect', { ...box });
			[left, top, bottom, right, w, h] = [0, 0, 0, 0, 0, 0];
			box = { startX: 0, startY: 0, endX: 0, endY: 0 };
		}
	};
	const mousedown = (e: MouseEvent) => {
		box.startX = e.pageX;
		box.startY = e.pageY;
		w = 0;
		h = 0;
		dragStart = true;
	};
</script>

<svelte:body on:mouseup={mouseup} on:mousemove={mousemove} />
<div bind:this={self} class="dragBox" on:mousedown={mousedown} tabindex="0" role="button">
	{#if dragStart}
		<div class="box" {style}></div>
	{/if}
	<slot />
</div>

<style lang="scss">
	.dragBox {
		position: relative;
		flex: 1;
		.box {
			position: fixed;
			z-index: 999999;
			background-color: transparent;
			border: dashed 1px #01ff70;
		}
	}
</style>
