<div class="toolbar">
	<div class="group">
		<button class="icon preview"> </button>
		<button class="icon pcb"> </button>
		<button class="icon schematic"> </button>
	</div>
	<div class="divider" />
	<div class="group">
		<button>Switch</button>
		<button>Display</button>
		<button>Rotary</button>
	</div>
	<div class="divider" />
	<div class="group">
		<button>Export</button>
	</div>
</div>

<style lang="scss">
	.toolbar {
		width: 100%;
		padding: 5px;
		display: flex;
		background: #7c7c7c;
		border-bottom: 1px solid #000000;
		gap: 5px;
	}
	.divider {
		width: 1px;
		background: #ccc;
	}
	.toolbar button {
		display: inline-block;
		padding: 5px;
		border: 1px solid #ccc;
		border-radius: 5px;
		background: #fff;
		cursor: pointer;
	}
	.toolbar {
		.icon {
			width: 30px;
			height: 30px;
			border: none;
			border-radius: 5px;
			background-size: contain;
			background-position: center;
			&.pcb {
				background: url('/icons/pcb.png');
				background-size: contain;
				box-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
			}
			&.schematic {
				background: url('/icons/sch.png');
				background-size: contain;
				box-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
			}
			&.preview {
				background: url('/icons/kbd.png');
				background-size: contain;
				box-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
			}
		}
	}
	.group button {
		margin: 0;
	}
	.toolbar button:hover {
		background: #ddd;
	}
	.toolbar button:active {
		background: #ccc;
	}
</style>
