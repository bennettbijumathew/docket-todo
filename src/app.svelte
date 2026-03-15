<script lang="ts">
	import { Router } from "sv-router";
	import "sv-router/generated";
    import { getCurrentWindow } from '@tauri-apps/api/window';
    import { X, Maximize2, Minimize2, Minus, ArrowLeft, ArrowRight } from '@lucide/svelte';
    import { routes } from "./components/util/routes";
    import { getPlatform } from "./components/util/platform";
    import { navigate } from "sv-router/generated";
    
    // This tracks the state of the application's window maximized state.
    let maximizedState: boolean = $state(false) 
    
    function isWindowMaximized() {
        getCurrentWindow().isMaximized().then((item => {
            maximizedState = item
        }));
    }
</script>

{#if getPlatform() === "windows"}
    <header data-tauri-drag-region class="bg-transparent absolute top-0 left-0 w-full h-6 flex items-center justify-between z-100">
        <div class="flex items-center transition-colors">
            <button 
                onclick={() => navigate(-1)} 
                class="cursor-pointer hover:bg-background-200 px-2 h-6"
            >
                <ArrowLeft class="size-4"/>
            </button>

            <button 
                onclick={() => navigate(-1)} 
                class="cursor-pointer hover:bg-background-200 px-2 h-6"
            >
                <ArrowRight class="size-4"/>
            </button>
        </div>

        <div class="flex gap-x-2 ml-4">
            {#each routes as [name, {link}]}
                <a 
                    href={link}
                    class="flex justify-center items-center text-xs cursor-pointer hover:bg-background-200 px-2 h-6"
                >
                    {name}
                </a>
            {/each}
        </div>

        <div class="flex items-center transition-colors">
            <button 
                onclick={getCurrentWindow().minimize}
                class="cursor-pointer hover:bg-background-200 px-2 h-6"
            >
                <Minus class="size-4 text-content-900 hover:text-content-600"/>  
            </button>

            <button 
                onclick={() => { getCurrentWindow().toggleMaximize(); isWindowMaximized() }}
                class="cursor-pointer hover:bg-background-200 px-2 h-6"
            > 
                {#if maximizedState == true}
                    <Minimize2 class="size-4 text-content-900"/>    
                {:else}
                    <Maximize2 class="size-4 text-content-900"/>    
                {/if}
            </button>
            
            <button 
                onclick={getCurrentWindow().close}
                class="cursor-pointer hover:bg-red-500 px-2 h-6"
            > 
                <X class="size-4 text-content-900"/>    
            </button>
        </div>
    </header>
{/if}

<Router/>