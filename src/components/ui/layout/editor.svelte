<script lang="ts">
    import { X } from "@lucide/svelte";
    import type { Snippet } from "svelte";

    interface LayoutProps {
        children?: Snippet,
        header: string, 
        onClose?: () => void,
        openState?: boolean
    }

    let { 
        children,
        header, 
        onClose, 
        openState = false
    }: LayoutProps = $props()
    
    function toggleEditor() {
        openState = !openState

        onClose?.()
    }
</script>


{#if openState == true}
    <section class="
        bg-background top-0 left-0 right-0 px-6 py-10 flex flex-col justify-between
        sm:mt-0 sm:p-6
        {openState ? "absolute z-50 sm:static w-full h-full sm:w-auto" : "sticky flex-none sm:flex-2"}
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
                onclick={toggleEditor}
            >   
                <X class="size-4"/>
            </button>
        </div>

        <div class="flex flex-1 flex-col justify-between gap-y-4">
            {@render children?.()}
        </div>
    </section>
{/if}
