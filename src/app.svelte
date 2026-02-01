<script lang="ts">
	import { Router } from "sv-router";
	import "sv-router/generated";
    import { authController } from "@/lib/auth/controller";
    import { authStore } from "@/lib/auth/store.svelte";

    const routes = [
        { name: "Home", link: "/" },
        { name: "Login", link: "/login" },
        { name: "Planner", link: "/planner" }
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
</script>

<nav class="p-4 flex items-center border-b justify-between">
    <div class="gap-x-4 flex">
        {#each routes as route}
            <a href={route.link}>
                {route.name}
            </a>
        {/each}
    </div>
        
    <div class="gap-x-4 flex">
        <div>
            {authStore.getUser()?.email}
        </div>
        
        <button onclick={handleUserALogin}>
            USER A
        </button>

        <button onclick={handleUserBLogin}>
            USER B
        </button>

        <button onclick={handleLogOut}>
            LOG OUT
        </button>
    </div>
</nav>

<Router />