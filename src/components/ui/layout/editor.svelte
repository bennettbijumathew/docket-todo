<script lang="ts">
    import { X } from "@lucide/svelte";
    import type { Snippet } from "svelte";

    interface LayoutProps {
        children?: Snippet,
        header: string, 
        onToggle: () => void,
        showEditor: boolean
    }

    let { 
        children,
        header, 
        onToggle, 
        showEditor
    }: LayoutProps = $props()
</script>

{#if showEditor == true}
    <section class="bg-background p-6 flex flex-col flex-1 transition-colors">
        <div class="flex justify-between items-center mb-6">
            <h2 class="font-title font-semibold text-lg"> {header} </h2>

            <!-- Exit button for the editor -->
            <button 
                class="p-2 bg-background-50 hover:bg-background-100 shadow-md rounded-lg cursor-pointer"
                onclick={onToggle}
            >   
                <X class="size-4"/>
            </button>
        </div>

        <div class="flex flex-1 flex-col justify-between gap-y-4">
            {@render children?.()}
        </div>
    </section>
{/if}
