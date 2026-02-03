<script lang="ts">
	import { Router } from "sv-router";
	import "sv-router/generated";
    import { authController } from "@/lib/auth/controller";
    import { authStore } from "@/lib/auth/store.svelte";
    import { getCurrentWindow } from '@tauri-apps/api/window';

    const routes = [
        { name: "Home", link: "/" },
        { name: "Login", link: "/login" },
        { name: "Planner", link: "/planner" },
        { name: "Task", link: "/task" }
    ]
    
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
</script>

<header data-tauri-drag-region class="flex justify-between bg-orange-300 p-3">
    <div class="gap-x-4 flex">
        <h1 class="font-semibold"> Docket </h1>
        
        <div class="border-r-2 border-black/40"></div>

        {#each routes as route}
            <a href={route.link}>
                {route.name}
            </a>
        {/each}

        <div class="border-r-2 border-black/40"></div>

        <button onclick={handleUserALogin}>
            USER A
        </button>

        <button onclick={handleUserBLogin}>
            USER B
        </button>

        <button onclick={handleLogOut}>
            LOG OUT
        </button>

        <div class="border-r-2 border-black/40"></div>

        <button>
            {authStore.getUser()?.email}
        </button>
    </div>
    
    {#if isTauri() == true}
        <div>
            <button onclick={getCurrentWindow().minimize}> MINIMIZE </button>

            <button onclick={getCurrentWindow().toggleMaximize}> MAXIMIZE </button>

            <button onclick={getCurrentWindow().close}> CLOSE </button>
        </div>
    {/if}
</header>

<Router />