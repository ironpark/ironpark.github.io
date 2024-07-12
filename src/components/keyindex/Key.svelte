<script lang="ts">
	export let name: string;
	export let unitSize: number;
	export let x: number;
	export let y: number;
	export let w: number = 1;
	export let h: number = 1;
	export let selected: boolean = false;
</script>

<button
	class="key"
	class:selected
	on:click
	style="--unit:{unitSize};--w: {w}px;--h: {h}px;top:{y * unitSize}px;left:{x * unitSize}px"
>
	<div class="foreground">
		<div class="key-name">{name}</div>
	</div>
</button>

<style lang="scss">
	.key {
		all: unset;
		user-select: none;
		display: flex;
		align-items: center;
		&.selected {
			box-shadow: 0 0 0 1.5px inset #f10000;
		}
		box-shadow: 0 0 0 1px inset #000000;
		position: absolute;
		width: calc(var(--w) * var(--unit));
		height: calc(var(--h) * var(--unit));
		border-radius: 4px;
		background-color: #e1e0e1;
		.foreground {
			margin: 0 auto 12px;
			background-color: #fcfdfd;
			border-radius: 4px;
			width: calc(var(--w) * var(--unit) - 15px);
			height: calc(var(--h) * var(--unit) - 15px);
			position: relative;
			.key-name {
				font-size: 10px;
				padding: 2px;
				background: transparent;
				text-align: center;
				color: #424242;
			}
			font-size: 14px;
			font-weight: 700;
			color: #424242;
		}
	}
</style>
