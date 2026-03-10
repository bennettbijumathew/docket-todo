<script lang="ts">
	import { Router } from "sv-router";
	import "sv-router/generated";
    import { getCurrentWindow } from '@tauri-apps/api/window';
    import { X, Maximize2, Minimize2, Minus } from '@lucide/svelte';
    import { routes } from "./components/util/routes";
    
    let maximizedState: boolean = $state(false) 

    function isTauri(): boolean {
        return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
    }

    function isWindowMaximized() {
        getCurrentWindow().isMaximized().then((item => {
            maximizedState = item
        }));
    }
</script>

{#if isTauri() === true}
    <header data-tauri-drag-region class="flex items-center justify-between bg-background mb-4">
        <div class="flex gap-x-2 ml-4">
            <p class="text-xs select-none"> Logo </p>

            {#each routes as [name, {link}]}
                <a href={link} class="text-xs pl-2 select-none">
                    {name}
                </a>
            {/each}
        </div>

        <div class="flex items-center transition-colors">
            <button 
                onclick={getCurrentWindow().minimize}
                class="cursor-pointer hover:bg-background-200 px-2 py-1.5"
            >
                <Minus class="size-4 text-content-900 hover:text-content-600"/>  
            </button>

            <button 
                onclick={() => { getCurrentWindow().toggleMaximize(); isWindowMaximized() }}
                class="cursor-pointer hover:bg-background-200 px-2 py-1.5"
            > 
                {#if maximizedState == true}
                    <Minimize2 class="size-4 text-content-900"/>    
                {:else}
                    <Maximize2 class="size-4 text-content-900"/>    
                {/if}
            </button>
            
            <button 
                onclick={getCurrentWindow().close}
                class="cursor-pointer hover:bg-red-500 px-2 py-1.5"
            > 
                <X class="size-4 text-content-900"/>    
            </button>
        </div>
    </header>
{/if}

<Router/>