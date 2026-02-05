<script lang="ts">
	import { Router } from "sv-router";
	import "sv-router/generated";
    import { authController } from "@/lib/auth/controller";
    import { authStore } from "@/lib/auth/store.svelte";
    import { getCurrentWindow } from '@tauri-apps/api/window';
    import { X, Maximize2, Minimize2, Minus } from '@lucide/svelte';
    import { isActive } from 'sv-router/generated';

    const routes = [
        { name: "Home", link: "/" },
        { name: "Login", link: "/login" },
        { name: "Task", link: "/task" }
    ]
    
    let maximizedState: boolean = $state(false) 

    async function handleUserALogin() {
        await authController.logInWithEmail(import.meta.env.VITE_ACCOUNT_TEST_A_EMAIL, import.meta.env.VITE_ACCOUNT_TEST_PASSWORD);
    }

    async function handleUserBLogin() {
        await authController.logInWithEmail(import.meta.env.VITE_ACCOUNT_TEST_B_EMAIL, import.meta.env.VITE_ACCOUNT_TEST_PASSWORD);
    }

    function handleLogOut() {
        authController.logOut();
    }

    function isTauri(): boolean {
        return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
    }

    function isWindowMaximized() {
        getCurrentWindow().isMaximized().then((item => {
            maximizedState = item
        }));
    }
</script>

<header data-tauri-drag-region class="flex justify-between p-4">
    <div class="gap-x-4 flex items-center">
        <h1 class="font-title font-extrabold text-lg"> Docket </h1>
        
        <div class="gap-x-4 flex px-2 pt-0.5 items-center">
            {#each routes as route}
                {#if isActive(route.link)}
                    <a href={route.link} class="border-b-2 border-text-300">
                        {route.name}
                    </a>
                {:else}
                    <a href={route.link} class="border-b-2 border-background-100 hover:border-background-300 transition-colors">
                        {route.name}
                    </a>
                {/if}
            {/each}
        </div>

        <div class="gap-x-4 flex px-2 pt-0.5 items-center">
            <button onclick={handleUserALogin} class="border-b-2 border-background-100 hover:border-background-300 transition-colors">
                USER A
            </button>

            <button onclick={handleUserBLogin} class="border-b-2 border-background-100 hover:border-background-300 transition-colors">
                USER B
            </button>

            <button onclick={handleLogOut} class="border-b-2 border-background-100 hover:border-background-300 transition-colors">
                LOG OUT
            </button>

            <p class="border-b-2 border-background-100">
                {authStore.getUser()?.email}
            </p>
        </div>
    </div>
    
    {#if isTauri() == true}
        <div class="gap-x-6 flex items-center">
            <button onclick={getCurrentWindow().minimize}>
                <Minus class="size-5"/>  
            </button>

            <button onclick={() => { getCurrentWindow().toggleMaximize(); isWindowMaximized() }}> 
                {#if maximizedState == true}
                    <Minimize2 class="size-4"/>    
                {:else}
                    <Maximize2 class="size-4"/>    
                {/if}
            </button>
            
            <button onclick={getCurrentWindow().close}> 
                <X class="size-5"/>    
            </button>
        </div>
    {/if}
</header>

<Router />