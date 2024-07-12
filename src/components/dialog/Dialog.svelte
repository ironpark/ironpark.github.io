<script lang="ts">
	import { createDialog, melt } from '@melt-ui/svelte';
	/** Internal helpers */
	import { X } from 'lucide-svelte';
	import { flyAndScale } from '$lib/transition';
	import { createEventDispatcher, onDestroy } from 'svelte';
	export let open: boolean | undefined;
	export let title: string = 'Are you sure you want to delete this?';
	export let role: 'dialog' | 'alertdialog' = 'alertdialog';
	export let asyncAction: (() => Promise<void>) | undefined = undefined;
	const {
		elements: { overlay, content, title: titleMelt, description, close, portalled },
		states: { open: isOpen }
	} = createDialog({
		role: role,
		forceVisible: true
	});
	const dispatch = createEventDispatcher();

	$: open !== undefined && isOpen.set(open);
	if (open !== undefined) {
		isOpen.set(open);
	}
	let subs = isOpen.subscribe((e) => {
		open = e;
	});
	let wait = false;
	onDestroy(subs);
</script>

{#if $isOpen}
	<div class="portal" use:melt={$portalled}>
		<div use:melt={$overlay} class="overlay" />
		<div
			class="content"
			transition:flyAndScale={{ duration: 150, y: 8, start: 0.96 }}
			use:melt={$content}
		>
			<h2 use:melt={$titleMelt} class="title">{title}</h2>
			<p use:melt={$description} class="description">
				<slot name="content" />
			</p>
			<div class="actions">
				<slot name="actions">
					<button use:melt={$close} class="cancel">취소</button>
					<button
						class="confirm"
						on:click={(e) => {
							dispatch('confirm');
							if (asyncAction) {
								wait = true;
								asyncAction()
									.then(() => {
										wait = false;
										isOpen.set(false);
									})
									.catch((e) => {
										console.log(e);
										wait = false;
										isOpen.set(false);
									});
							} else {
								isOpen.set(false);
							}
						}}
					>
						{#if wait}
							<svg
								class="animate-spin -ml-2 mr-3 h-5 w-5 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
						{/if}
						확인</button
					>
				</slot>
			</div>

			<button use:melt={$close} aria-label="Close" class="close">
				<X class="size-4" />
			</button>
		</div>
	</div>
{/if}

<style lang="scss">
	.portal {
	}
	.overlay {
		@apply fixed inset-0 z-50 bg-black/50;
	}
	.content {
		@apply fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[90vw] max-w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white shadow-lg;
		.title {
			@apply text-lg font-medium text-black m-4 flex;
		}
		.description {
			@apply mb-5 mt-2 leading-normal text-zinc-600 m-4;
		}

		.actions {
			@apply flex justify-end gap-4 bg-gray-100 p-3  rounded-b-md;
			//shadow flex items-center justify-between appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 leading-tight;
			button {
				@apply shadow inline-flex h-8 items-center justify-center appearance-none border border-gray-400 rounded-[4px] font-medium leading-none px-5 py-5;
			}
			// 취소 버튼
			.cancel {
				@apply bg-white text-zinc-600;
				&:hover {
					@apply bg-zinc-200;
				}
			}
			// 확인 버튼
			.confirm {
				@apply text-white bg-blue-600 border-blue-900;
				&:hover {
					@apply bg-blue-500;
				}
			}
		}
		// 닫기 버튼
		.close {
			@apply absolute right-[10px] top-[10px] inline-flex h-7 w-7 appearance-none items-center justify-center rounded-full text-magnum-800 transition-colors;
			&:hover {
				@apply bg-magnum-100;
			}
			&:focus {
				@apply shadow-magnum-400;
			}
		}

		@keyframes spin {
			from {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(360deg);
			}
		}
	}
</style>
