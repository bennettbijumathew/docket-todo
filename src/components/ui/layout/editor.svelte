<script lang="ts">
	import { route } from 'sv-router/generated';
    import type { Snippet } from "svelte";
    import { X } from '@lucide/svelte';

    interface LayoutProps {
        children?: Snippet,
        header?: string
        onClose: () => void
    }

    let { 
        children,
        header = "",
        onClose
    }: LayoutProps = $props()
</script>

{#if route.hash == "#edit"}
    <section class="
        bg-background top-0 left-0 right-0 px-6 py-10 flex flex-col justify-between
        absolute z-50 w-full h-full
        sm:static sm:w-50 sm:mt-0 sm:p-6
        lg:w-90
    ">
        <div class="flex justify-between items-center mb-6">
            <h2 class="
                font-title font-semibold 
                text-2xl
                sm:text-lg
            "> 
                {header}
            </h2>

            <!-- Exit button for the editor -->
            <button 
                class="p-2 bg-background-50 hover:bg-background-100 shadow-md rounded-lg cursor-pointer"
                onclick={() => onClose()}
            >   
                <X class="size-4"/>
            </button>
        </div>

        {@render children?.()}
    </section>
{/if}
