<script lang="ts">
    import { navigate } from 'sv-router/generated';
	import { route } from 'sv-router/generated';
    import { X } from "@lucide/svelte";
    import type { Snippet } from "svelte";
    import { type RoutePath } from '@/components/util/routes';

    interface LayoutProps {
        children?: Snippet,
        header: string, 
        onClose?: () => void,
    }

    let { 
        children,
        header, 
        onClose, 
    }: LayoutProps = $props()
    
    function toggleEditor() {
        const currentLink = route.pathname

        if (route.hash == "#edit") {
            navigate(currentLink as RoutePath, {
                hash: ""
            })
        }

        onClose?.()
    }
</script>


{#if route.hash == "#edit"}
    <section class="
        bg-background top-0 left-0 right-0 px-6 py-10 flex flex-col justify-between
        sm:mt-0 sm:p-6
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
