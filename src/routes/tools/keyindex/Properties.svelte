<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Key } from './types';

	export let keyItem: Key;
	export let unitSize;

	const stepSize = unitSize / 4;
	const dispatch = createEventDispatcher();

	const pxToUnit = (move: number | undefined) => {
		if (move) {
			return Math.round(move / stepSize) * 0.25;
		} else {
			return 0;
		}
	};
	const emitChange = (property: string, value: any) => {
		if (value) {
			dispatch('change', { property, value });
		}
	};
</script>

<div class="properties">
	<div class="property">
		<label for="key-name">Legend</label>
		<div class="value">
			<input type="text" id="key-name" bind:value={keyItem.name} />
		</div>
	</div>
	<div class="property-group">
		<div class="property">
			<label for="key-row">X</label>
			<div class="value">
				<input
					type="number"
					step="0.25"
					id="key-x"
					value={keyItem.x + pxToUnit(keyItem.moveX)}
					on:input={(e) => {
						emitChange('x', Number(e.target.value));
					}}
				/>
			</div>
		</div>
		<div class="property">
			<label for="key-row">Y</label>
			<div class="value">
				<input
					type="number"
					step="0.25"
					id="key-y"
					value={keyItem.y + pxToUnit(keyItem.moveY)}
					on:input={(e) => {
						emitChange('y', Number(e.target.value));
					}}
				/>
			</div>
		</div>
	</div>
	<div class="description">(x,y) 1 point = {19.05}mm</div>
	<div class="property">
		<label for="key-type">Type</label>
		<div class="value">
			<input type="text" id="key-type" bind:value={keyItem.type} />
		</div>
	</div>
	<div class="property">
		<label for="key-color">Color</label>
		<div class="value">
			<input type="text" id="key-color" bind:value={keyItem.color} />
		</div>
	</div>
</div>

<style lang="scss">
	.properties {
		display: flex;
		flex-direction: column;
		width: 200px;
		.property-group {
			display: flex;
		}
		.description {
			font-size: 0.8rem;
			margin-bottom: 0.5rem;
			padding: 5px;
			color: #9b9b9b;
		}
		.property {
			flex-direction: column;
			display: flex;
			padding: 5px;
			label {
				font-size: 0.8rem;
			}
			.value {
				display: flex;
				input {
					width: 100%;
					font-size: 1rem;
					padding: 0.25rem 0.5rem;
					border: 1px solid #ccc;
					border-radius: 0.5rem;
				}
			}
		}
	}
</style>
