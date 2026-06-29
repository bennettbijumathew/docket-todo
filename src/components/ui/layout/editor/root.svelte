<script lang="ts">
    import { editor } from '@/components/ui/layout/editor/util.svelte';
    import { getPlatform } from '@/lib/shared/platform';
    import { fade, fly } from 'svelte/transition';
    import { type Snippet } from 'svelte';

    type RootProps = { 
        children?: Snippet 
    }

    let { children }: RootProps = $props()
</script>

{#if editor.isOpen == true}
    <section 
        transition:fly={{ x: '100%', duration: 300 }}
        class="
            {getPlatform() == "windows" ? "pt-titlebar" : "pt-4"}
            box-border bg-background flex flex-col justify-between h-full overflow-hidden fixed top-0 right-0 z-10
            w-75 
            sm:w-94
        "
    >
        {@render children?.()}
    </section>

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