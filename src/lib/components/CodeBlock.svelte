<script lang="ts">
    import type { Snippet } from "svelte";
    import { ChevronDown, ChevronUp, Copy, Check } from "@lucide/svelte";

    interface Props {
        children?: Snippet;
        lang: string;
        maxHeight?: number; // Maximum height in pixels before collapsing
    }
    let { children, lang, maxHeight = 400 }: Props = $props();
    
    let codeBodyRef = $state<HTMLDivElement>();
    let codeBlockRef = $state<HTMLDivElement>();
    let copyButtonRef = $state<HTMLButtonElement>();
    let isCollapsed = $state(false);
    let shouldShowToggle = $state(false);
    let contentHeight = $state(0);
    let isCopied = $state(false);
    let isSticky = $state(false);
    
    $effect(() => {
        if (codeBodyRef) {
            // Get the actual height of the content
            const actualHeight = codeBodyRef.scrollHeight;
            contentHeight = actualHeight;
            
            // Show toggle button if content exceeds maxHeight
            if (actualHeight > maxHeight) {
                shouldShowToggle = true;
                isCollapsed = true;
            }
        }
    });
    
    $effect(() => {
        if (!codeBlockRef) return;
        
        const checkStickyState = () => {
            const rect = codeBlockRef?.getBoundingClientRect();
            if (!rect) return;
            
            const headerHeight = 40; // Height of the code block header
            const pageHeaderOffset = 60; // Offset for page header/navigation
            const buttonHeight = 40; // Height of the copy button
            
            // Calculate the actual visible height of the code container
            const codeContainerHeight = isCollapsed ? maxHeight : contentHeight;
            const totalHeight = headerHeight + codeContainerHeight;
            
            // Check if we should show sticky button
            // Button should be sticky when:
            // 1. Top of code block (after header) is above the page header offset
            // 2. Bottom of code block is still visible (with space for button)
            const shouldBeSticky = 
                rect.top + headerHeight < pageHeaderOffset && 
                rect.top + totalHeight > pageHeaderOffset + buttonHeight;
            
            if (isSticky !== shouldBeSticky) {
                isSticky = shouldBeSticky;
            }
        };
        
        // Check on scroll and resize
        const handleScroll = () => {
            requestAnimationFrame(checkStickyState);
        };
        
        // Initial check and when collapse state changes
        checkStickyState();
        
        // Add listeners
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll, { passive: true });
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    });
    
    // Re-check sticky state when collapse state changes
    $effect(() => {
        if (!codeBlockRef) return;
        // Trigger re-check after collapse animation completes
        setTimeout(() => {
            const rect = codeBlockRef?.getBoundingClientRect();
            if (!rect) return;
            
            const headerHeight = 40;
            const pageHeaderOffset = 60;
            const buttonHeight = 40;
            const codeContainerHeight = isCollapsed ? maxHeight : contentHeight;
            const totalHeight = headerHeight + codeContainerHeight;
            
            const shouldBeSticky = 
                rect.top + headerHeight < pageHeaderOffset && 
                rect.top + totalHeight > pageHeaderOffset + buttonHeight;
            
            if (isSticky !== shouldBeSticky) {
                isSticky = shouldBeSticky;
            }
        }, 320); // Wait for transition to complete (300ms + buffer)
    });
    
    function toggleCollapse() {
        isCollapsed = !isCollapsed;
    }
    
    async function copyCode() {
        if (codeBodyRef) {
            const codeText = codeBodyRef.textContent || '';
            try {
                await navigator.clipboard.writeText(codeText);
                isCopied = true;
                setTimeout(() => {
                    isCopied = false;
                }, 2000);
            } catch (err) {
                console.error('Failed to copy code:', err);
            }
        }
    }
</script>

<div bind:this={codeBlockRef} class="relative rounded-lg border border-gray-200 dark:border-gray-800 mt-2">
    <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-800">
        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
            {lang.toUpperCase()}
        </span>
        {#if shouldShowToggle}
            <button
                onclick={toggleCollapse}
                class="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
                aria-expanded={!isCollapsed}
                aria-label={isCollapsed ? "Expand code" : "Collapse code"}
            >
                {isCollapsed ? "Show more" : "Show less"}
                {#if isCollapsed}
                    <ChevronDown class="w-4 h-4" />
                {:else}
                    <ChevronUp class="w-4 h-4" />
                {/if}
            </button>
        {/if}
    </div>
    <div 
        class="relative overflow-hidden transition-all duration-300 ease-in-out"
        style="max-height: {isCollapsed && shouldShowToggle ? maxHeight + 'px' : contentHeight + 'px'}"
    >
        <button
            bind:this={copyButtonRef}
            onclick={copyCode}
            class="{isSticky ? 'fixed' : 'absolute'} right-2 z-[100] p-2 bg-transparent hover:bg-gray-500/30 rounded-md transition-colors backdrop-blur-sm"
            style="{isSticky && codeBlockRef ? `top: 70px; right: ${window.innerWidth - codeBlockRef.getBoundingClientRect().right + 8}px` : 'top: 8px'}"
            aria-label={isCopied ? "Copied!" : "Copy code"}
        >
            {#if isCopied}
                <Check class="w-4 h-4 text-white" />
            {:else}
                <Copy class="w-4 h-4 text-white" />
            {/if}
        </button>
        <div bind:this={codeBodyRef} class="p-0 m-0">
            {@render children?.()}
        </div>
        {#if isCollapsed && shouldShowToggle}
            <div class="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none"></div>
        {/if}
        {#if shouldShowToggle}
            <button
                onclick={toggleCollapse}
                class="absolute bottom-0 left-1/2 -translate-x-1/2 p-1 bg-transparent hover:bg-gray-500/30 rounded-t-md transition-colors backdrop-blur-sm"
                aria-expanded={!isCollapsed}
                aria-label={isCollapsed ? "Expand code" : "Collapse code"}
            >
                {#if isCollapsed}
                    <ChevronDown class="w-5 h-5 text-white" />
                {:else}
                    <ChevronUp class="w-5 h-5 text-white" />
                {/if}
            </button>
        {/if}
    </div>
</div>

<style>
    :global(.shiki) {
        margin: 0 !important;
        border-radius: 0 !important;
    }
</style>