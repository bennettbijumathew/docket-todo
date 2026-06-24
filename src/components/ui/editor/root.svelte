<script lang="ts">
    import { getPlatform } from '@/lib/shared/platform';
    import { type Snippet } from 'svelte';
    import { fade, fly } from 'svelte/transition';
    import { editor } from '@/components/ui/editor/util.svelte';

    type RootProps = { 
        children?: Snippet 
    }

    let { children }: RootProps = $props()
</script>

<section 
    transition:fly={{ duration: 300 }}
    class="
        {editor.isOpen ? 'w-75 sm:w-94' : 'w-0'} {getPlatform() == "windows" ? "pt-titlebar" : "pt-4"}
        box-border bg-background flex flex-col justify-between h-full overflow-hidden transition-[width] duration-200
        absolute right-0 z-10
    "
>
    {@render children?.()}
</section>
    
{#if editor.isOpen == true}
    <!-- This is a dark overlay over the app that on clicking it removes the sidebar. -->
    <button 
        transition:fade={{duration: 200}} 
        onclick={editor.close} 
        class="
            bg-black/20 absolute h-full w-full z-9
        " 
        aria-label="Button that closes the task editor"
    >
    </button>
{/if}